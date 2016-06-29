'use strict'

var StripeData = require('stripe-mock-data')
var Promise = require('promise')
var assign = require('assign-deep')
var needle = require('needle')

/**
 * Stripe Mock Webhook Constructor
 *
 * @param  {Object} options               Mocking options
 * @param  {String} options.url           URL to be pinged when an event is triggered
 * @param  {String} options.version       Stripe API version to be used
 */
module.exports = exports = function StripeMockWebhooks (options) {
  options = options || {}

  if (!options.url) {
    throw new Error('StripeMockWebhooks: missing required option [url]')
  }

  this.version = options.version || StripeMockWebhooks.LATEST_STRIPE_VERSION
  this.stripeData = StripeData(this.version)
  this.url = options.url
}

/**
 * Latest Stripe API version
 * @type {String}
 */
exports.LATEST_STRIPE_VERSION = '2015-10-01'

/**
 * Build Stripe Event Response
 *
 * @param  {String} event      Stripe webhook event name
 * @param  {Object} properties Properties to be added or replaced in the response
 * @param  {Object} options    Flags and options for the triggered event
 * @param  {Boolean} options.now Change event created timestamp to now, defaults to true
 */
exports.prototype.build = function stripeEvent (event, properties, options) {
  properties = properties || {}
  options = options || {
    now: true
  }

  var response = this.stripeData.webhooks[event]

  if (!response) {
    throw new Error('StripeMockWebhooks: no such webhook [' + event + '] for version [' + this.version + ']')
  } else {
    response = response[0] || response
  }

  if (options.now) {
    response.created = Date.now()
  }

  response = assign(response, properties)

  return response
}

/**
 * Trigger Stripe Webhook Event
 *
 * @param  {String} event      Stripe webhook event name
 * @param  {Object} properties Properties to be added or replaced in the response
 * @param  {Object} options    Flags and options for the triggered event
 * @param  {Boolean} options.now Change event created timestamp to now, defaults to true
 */
exports.prototype.trigger = function triggerStripeEvent (event, properties, options) {
  return new Promise(function (resolve, reject) {
    needle.post(this.url, this.build(event, properties, options), {
      json: true
    }, function (err, res) {
      return err ? reject(err) : resolve(res)
    })
  }.bind(this))
}

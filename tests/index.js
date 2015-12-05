var StripeMockWebhooks = require('../')
var assert = require('assert')
var http = require('http')

// Check latest stripe version
assert(StripeMockWebhooks.LATEST_STRIPE_VERSION === '2015-10-01')

// Build webhooks object
var webhooks = new StripeMockWebhooks({
  version: '2015-04-07',
  url: 'http://localhost:3001/stripe/events'
})

// Check correct version was used
assert(webhooks.version === '2015-04-07')

// Check webhook url was set
assert(webhooks.url === 'http://localhost:3001/stripe/events')

// Invoke a webhook with invalid event
webhooks.trigger('invoice_create').catch(function (err) {
  assert.equal(err.message, 'StripeMockWebhooks: no such webhook [invoice.create] for version [2015-04-07]')
})

// Initialize a server to send a response
var server = http.createServer(function (req, res) {
  var body = ''

  assert.equal(req.method, 'POST')
  assert.equal(req.url, '/stripe/events')

  req.on('data', function (chunk) {
    body += chunk
  })

  req.on('end', function () {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(body)
  })
})

// Listen on 3001
server.listen(3001)

// Invoke a webhook
webhooks.trigger('invoice.created').then(function (response) {
  assert.equal(response.statusCode, 200)
  assert.equal(response.body.type, 'invoice.created')
}).catch(function (err) {
  console.trace(err)
  process.exit(1)
})

// Invoke a webhook with properties
webhooks.trigger('invoice.created', { livemode: true }).then(function (response) {
  assert.equal(response.statusCode, 200)
  assert.equal(response.body.type, 'invoice.created')
  assert.equal(response.body.livemode, true)
  server.close()
}).catch(function (err) {
  console.trace(err)
  process.exit(1)
})
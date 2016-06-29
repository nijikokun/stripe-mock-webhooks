# Stripe Mock Webhooks

Quickly test Stripe Webhooks against your application without hitting Stripe or requiring internet connectivity.

## Features & Data

- Customize Webhook response
- Generate Webhook response object without triggering it against your application
- Offline mocking
- [Supports multiple versions of the Stripe API](https://github.com/Nijikokun/stripe-mock-data#features--data)
- Promises!

## Install

```bash
$ npm install stripe-mock-webhooks --save-dev
```

## Usage

```js
// Require
var StripeMockWebhooks = require('stripe-mock-webhooks')

// Tell the server where it should send events
var webhooks = new StripeMockWebhooks({
  version: '2015-10-01', // Default is latest Stripe API version
  url: 'http://localhost:3001/stripe/events'
})
```

Send a webhook:

```js
webhooks.trigger('invoice.created').then(function (response) {
  // success
}).catch(function (err) {
  // error
})
```

Or overwrite values in the response:

```js
webhooks.trigger('invoice.created', {
  data: {
    object: {
      plan: {
        id: 'PLAN_IDENTIFIER'
      }
    }
  }
})
```

Additional options can be turned on / off:

```js
webhooks.trigger('invoice.created', undefined, {
  now: false
})
```

Build `JSON` response without triggering an event:

```js
var response = webhooks.build('invoice.created', {
  data: {
    object: {
      plan: {
        id: 'PLAN_IDENTIFIER'
      }
    }
  }
})
```

Supports the same arguments as `webhooks.trigger`

## Trigger Options

- `now` - Updates event `created` timestamp to `Date.now()`, defaults to `true`

## Examples

Look in [tests](tests/) to see example usage.

## License

MIT © [Nijiko Yonskai](http://nijikokun.com)

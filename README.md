# whatsapp-cloud-api-types

TypeScript type definitions, Zod schemas, and a fully-typed API client for the WhatsApp Business Cloud API.

[![npm version](https://img.shields.io/npm/v/whatsapp-cloud-api-types.svg)](https://www.npmjs.com/package/whatsapp-cloud-api-types)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Edge Runtime Compatible](https://img.shields.io/badge/Edge%20Runtime-Compatible-brightgreen)](./EDGE_COMPATIBILITY.md)

## Features

- 🎯 **Type-safe**: Full TypeScript support with Zod runtime validation
- 📦 **Zero dependencies**: Only peer dependency on Zod
- 🔄 **Complete webhook coverage**: Support for all message types, statuses, and template webhooks
- ✅ **Fully validated**: All 24 official webhook examples tested and validated
- 🔧 **Subscription management**: Type-safe schemas for WABA subscription APIs
- 🚀 **Tree-shakeable**: Use only what you need
- ✨ **Auto-completion**: Full IntelliSense support in your IDE
- ⚡ **Edge Runtime Compatible**: Works in Cloudflare Workers, Vercel Edge, Deno Deploy, and more ([details](./EDGE_COMPATIBILITY.md))
- 🤖 **API Client**: Complete, type-safe WhatsApp Cloud API client with fetch-based requests
- 📤 **Send Messages**: All message types supported (text, media, interactive, templates, etc.)
- 📁 **Media Management**: Upload, download, and manage media files
- 🏢 **Business Profile**: Manage business profile and settings
- 🏦 **WABA Management**: Manage WhatsApp Business Accounts (owned and shared)
- 📱 **Phone Numbers**: Manage phone numbers, verification status, and quality ratings
- 🔔 **Webhooks**: Configure webhook subscriptions and callback URLs

## Installation

```bash
bun add whatsapp-cloud-api-types zod
```

or with npm:

```bash
npm install whatsapp-cloud-api-types zod
```

## 🚀 Quick Start

### Using the API Client

```typescript
import { WhatsAppCloudAPI } from 'whatsapp-cloud-api-types'

const client = new WhatsAppCloudAPI({
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
})

// Send a text message
await client.messages.sendText('1234567890', 'Hello, World!')

// Send an image
await client.messages.sendImage(
  '1234567890',
  { link: 'https://example.com/image.jpg' },
  'Check this out!'
)

// Send interactive buttons
await client.messages.sendInteractiveButtons('1234567890', {
  type: 'button',
  body: { text: 'Choose an option' },
  action: {
    buttons: [
      { type: 'reply', reply: { id: 'yes', title: 'Yes' } },
      { type: 'reply', reply: { id: 'no', title: 'No' } }
    ]
  }
})

// Send CTA URL button
await client.messages.sendCtaUrl('1234567890', {
  type: 'cta_url',
  body: { text: 'Visit our website for more information!' },
  action: {
    name: 'cta_url',
    parameters: {
      display_text: 'Visit Website',
      url: 'https://example.com'
    }
  }
})

// Upload and send media
const media = await client.media.upload(file, 'image/jpeg')
await client.messages.sendImage('1234567890', { id: media.id })

// Get business profile
const profile = await client.business.getProfile()

// Manage WhatsApp Business Accounts
const waba = await client.waba.getFirst()
const ownedWabas = await client.waba.getOwned()

// Manage phone numbers
const numbers = await client.phoneNumbers.list(waba!.id)
const phoneNumber = await client.phoneNumbers.get('PHONE_NUMBER_ID')

// Configure webhooks
await client.webhooks.subscribe(waba!.id, {
  override_callback_uri: 'https://myapp.com/webhook',
  verify_token: 'my-secret-token',
})
```

**[📖 Complete API Client Documentation →](./CLIENT_README.md)**

## Supported Features

### Webhooks

This library provides Zod schemas for the following WhatsApp Cloud API webhooks:

#### Messages Webhook (`messages` field)
All incoming message types and status updates are fully supported:

**Message Types:**
- ✅ Text messages
- ✅ Audio messages (including voice notes)
- ✅ Image messages
- ✅ Video messages
- ✅ Document messages
- ✅ Sticker messages
- ✅ Location messages
- ✅ Contact messages
- ✅ Button replies
- ✅ Interactive messages (list & button replies)
- ✅ Order messages
- ✅ Reaction messages
- ✅ System messages

**Additional Features:**
- ✅ Message context (replies, forwards)
- ✅ Product references
- ✅ Ad referrals (Click-to-WhatsApp ads)
- ✅ Group messages
- ✅ Message status updates (sent, delivered, read, failed)
- ✅ Conversation tracking & pricing info
- ✅ Error handling (all levels)

**Template Webhooks:**
- ✅ **message_template_status_update** - Template approval, rejection, or status changes
- ✅ **message_template_quality_update** - Template quality score changes
- ✅ **message_template_components_update** - Template component updates
- ✅ **template_category_update** - Template category changes


### Subscription Management APIs

Type-safe schemas for WhatsApp Business Account (WABA) subscription management:

- ✅ **Subscribe to WABA** - Subscribe your app to webhook notifications
- ✅ **Get Subscriptions** - Retrieve all app subscriptions for a WABA
- ✅ **Unsubscribe from WABA** - Remove webhook subscriptions
- ✅ **Override Callback URL** - Set alternate webhook endpoints per WABA

## Webhook Handling

### Quick Start

### Parse Any Webhook

Use the unified schema to automatically validate and parse any webhook:

```typescript
import { WhatsAppWebhookSchema } from 'whatsapp-cloud-api-types'

// In your webhook endpoint (Express example)
app.post('/webhook', (req, res) => {
  try {
    const webhook = WhatsAppWebhookSchema.parse(req.body)

    // TypeScript knows the structure
    webhook.entry.forEach(entry => {
      entry.changes.forEach(change => {
        if (change.field === 'messages') {
          // Handle incoming messages
          const messages = change.value.messages
          const statuses = change.value.statuses
        }
      })
    })

    res.sendStatus(200)
  } catch (error) {
    console.error('Invalid webhook payload:', error)
    res.sendStatus(400)
  }
})
```

### Parse Specific Webhook Types

For better type inference, use specific webhook schemas:

#### Messages Webhook

```typescript
import { MessagesWebhookSchema } from 'whatsapp-cloud-api-types'

const webhook = MessagesWebhookSchema.parse(req.body)

webhook.entry.forEach(entry => {
  entry.changes.forEach(change => {
    // Handle incoming messages
    change.value.messages?.forEach(message => {
      console.log(`Message from ${message.from}: ${message.text?.body}`)

      // Type-safe access to different message types
      switch (message.type) {
        case 'text':
          console.log('Text:', message.text?.body)
          break
        case 'image':
          console.log('Image ID:', message.image?.id)
          break
        case 'interactive':
          console.log('Button clicked:', message.interactive?.button_reply?.title)
          break
      }
    })

    // Handle message status updates
    change.value.statuses?.forEach(status => {
      console.log(`Message ${status.id} is now ${status.status}`)
    })
  })
})
```

#### Template Status Update Webhook

```typescript
import { MessageTemplateStatusUpdateWebhookSchema } from 'whatsapp-cloud-api-types'

const webhook = MessageTemplateStatusUpdateWebhookSchema.parse(req.body)

webhook.entry.forEach(entry => {
  entry.changes.forEach(change => {
    const { event, message_template_name, reason } = change.value

    switch (event) {
      case 'APPROVED':
        console.log(`Template ${message_template_name} was approved!`)
        break
      case 'REJECTED':
        console.log(`Template ${message_template_name} was rejected. Reason: ${reason}`)
        break
      case 'DISABLED':
        console.log(`Template ${message_template_name} was disabled`)
        if (change.value.disable_info) {
          console.log(`Disabled on: ${new Date(change.value.disable_info.disable_date * 1000)}`)
        }
        break
    }
  })
})
```

#### Template Quality Update Webhook

```typescript
import { MessageTemplateQualityUpdateWebhookSchema } from 'whatsapp-cloud-api-types'

const webhook = MessageTemplateQualityUpdateWebhookSchema.parse(req.body)

webhook.entry.forEach(entry => {
  entry.changes.forEach(change => {
    const { message_template_name, previous_quality_score, new_quality_score } = change.value

    console.log(`Template "${message_template_name}" quality changed from ${previous_quality_score} to ${new_quality_score}`)

    if (new_quality_score === 'RED') {
      console.warn('⚠️ Template quality is now RED! Consider reviewing your template.')
    }
  })
})
```

#### Template Components Update Webhook

```typescript
import { MessageTemplateComponentsUpdateWebhookSchema } from 'whatsapp-cloud-api-types'

const webhook = MessageTemplateComponentsUpdateWebhookSchema.parse(req.body)

webhook.entry.forEach(entry => {
  entry.changes.forEach(change => {
    const template = change.value

    console.log(`Template "${template.message_template_name}" was updated`)
    console.log('Body:', template.message_template_element)

    if (template.message_template_title) {
      console.log('Header:', template.message_template_title)
    }

    if (template.message_template_buttons) {
      console.log('Buttons:', template.message_template_buttons.map(b => b.message_template_button_text))
    }
  })
})
```

#### Template Category Update Webhook

```typescript
import { TemplateCategoryUpdateWebhookSchema } from 'whatsapp-cloud-api-types'

const webhook = TemplateCategoryUpdateWebhookSchema.parse(req.body)

webhook.entry.forEach(entry => {
  entry.changes.forEach(change => {
    const value = change.value

    // Check if it's an impending change notification
    if ('correct_category' in value) {
      console.log(`Template "${value.message_template_name}" will be recategorized from ${value.new_category} to ${value.correct_category} in 24 hours`)
    } else {
      console.log(`Template "${value.message_template_name}" was recategorized from ${value.previous_category} to ${value.new_category}`)
    }
  })
})
```

## Advanced Usage

### Type Guards

Use Zod's `safeParse` for safe validation:

```typescript
import { WhatsAppWebhookSchema } from 'whatsapp-cloud-api-types'

app.post('/webhook', (req, res) => {
  const result = WhatsAppWebhookSchema.safeParse(req.body)

  if (!result.success) {
    console.error('Validation failed:', result.error.issues)
    return res.sendStatus(400)
  }

  const webhook = result.data
  // Process webhook...

  res.sendStatus(200)
})
```

### Discriminated Union

Use TypeScript's discriminated unions to handle different webhook types:

```typescript
import { WhatsAppWebhook } from 'whatsapp-cloud-api-types'

function handleWebhook(webhook: WhatsAppWebhook) {
  const change = webhook.entry[0].changes[0]

  switch (change.field) {
    case 'messages':
      handleMessages(change.value)
      break
    case 'message_template_status_update':
      handleTemplateStatusUpdate(change.value)
      break
    case 'template_category_update':
      handleTemplateCategoryUpdate(change.value)
      break
    // TypeScript ensures you handle all cases
  }
}
```

### Extract Specific Types

```typescript
import type {
  Message,
  Status,
  TemplateStatusEvent,
  TemplateQualityScore
} from 'whatsapp-cloud-api-types'

function processMessage(message: Message) {
  if (message.type === 'text') {
    return message.text?.body
  }
  // TypeScript knows the structure
}

function checkQuality(score: TemplateQualityScore) {
  return score === 'GREEN' || score === 'YELLOW'
}
```

## Subscription Management

### Subscribe to a WABA

```typescript
import { SubscribeToWABAResponseSchema } from 'whatsapp-cloud-api-types'

const response = await fetch(
  `https://graph.facebook.com/v18.0/${wabaId}/subscribed_apps`,
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` }
  }
)

const result = SubscribeToWABAResponseSchema.parse(await response.json())
console.log('Subscribed:', result.success)
```

### Get All Subscriptions

```typescript
import { GetSubscriptionsResponseSchema } from 'whatsapp-cloud-api-types'

const response = await fetch(
  `https://graph.facebook.com/v18.0/${wabaId}/subscribed_apps`,
  {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  }
)

const result = GetSubscriptionsResponseSchema.parse(await response.json())
result.data.forEach(app => {
  console.log(`App: ${app.whatsapp_business_api_data.name}`)
})
```

### Override Callback URL

```typescript
import {
  OverrideCallbackURLRequestSchema,
  OverrideCallbackURLResponseSchema
} from 'whatsapp-cloud-api-types'

const requestBody = OverrideCallbackURLRequestSchema.parse({
  override_callback_uri: 'https://your-webhook.com/endpoint',
  verify_token: 'your-verify-token'
})

const response = await fetch(
  `https://graph.facebook.com/v18.0/${wabaId}/subscribed_apps`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  }
)

const result = OverrideCallbackURLResponseSchema.parse(await response.json())
console.log('Override successful:', result.data[0].override_callback_uri)
```

### Unsubscribe from WABA

```typescript
import { UnsubscribeFromWABAResponseSchema } from 'whatsapp-cloud-api-types'

const response = await fetch(
  `https://graph.facebook.com/v18.0/${wabaId}/subscribed_apps`,
  {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` }
  }
)

const result = UnsubscribeFromWABAResponseSchema.parse(await response.json())
console.log('Unsubscribed:', result.success)
```

## API Reference

### Unified Schema

- `WhatsAppWebhookSchema` - Validates any WhatsApp webhook

### Messages Webhook

- `MessagesWebhookSchema` - Messages and status updates
- `MessageSchema` - Individual message object
- `StatusSchema` - Message status object
- `ContactSchema` - Contact information
- `MetadataSchema` - Phone number metadata

### Template Webhooks

- `MessageTemplateStatusUpdateWebhookSchema` - Template status changes
- `MessageTemplateQualityUpdateWebhookSchema` - Template quality changes
- `MessageTemplateComponentsUpdateWebhookSchema` - Template component updates
- `TemplateCategoryUpdateWebhookSchema` - Template category changes

### Subscription Management

- `SubscribeToWABAResponseSchema` - Response from subscribe API
- `GetSubscriptionsResponseSchema` - Response from get subscriptions API
- `UnsubscribeFromWABAResponseSchema` - Response from unsubscribe API
- `OverrideCallbackURLRequestSchema` - Request body for override callback URL
- `OverrideCallbackURLResponseSchema` - Response from override callback URL API
- `WhatsAppBusinessAPIDataSchema` - App data object
- `SubscribedAppSchema` - Subscribed app object
- `SubscribedAppWithOverrideSchema` - Subscribed app with override URI

### Enums

- `TemplateStatusEvent` - Template status events (APPROVED, REJECTED, etc.)
- `TemplateQualityScore` - Quality scores (GREEN, YELLOW, RED, UNKNOWN)
- `TemplateCategory` - Template categories (AUTHENTICATION, MARKETING, UTILITY)
- `TemplateButtonType` - Button types (URL, PHONE_NUMBER, QUICK_REPLY, etc.)

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Run tests in watch mode
bun test:watch

# Build
bun run build

# Type check
bun run type-check

# Lint and format
bun run lint:fix
```

## License

MIT © [Your Name]

## Testing

All webhook types are validated against real examples from the WhatsApp Cloud API documentation:

```bash
# Run all tests including validation of 24 official webhook examples
bun test
```

The test suite validates every message type, status update, and error scenario to ensure 100% compatibility with the WhatsApp Cloud API.

## Package Structure

This package provides two main features:

1. **Webhook Type Definitions** - Zod schemas and TypeScript types for handling incoming webhooks
2. **API Client** - Complete client for sending messages and managing your WhatsApp Business Account

```typescript
// Webhook handling
import { WhatsAppWebhookSchema, MessagesWebhookSchema } from 'whatsapp-cloud-api-types'

// API client
import { WhatsAppCloudAPI } from 'whatsapp-cloud-api-types'

// Individual schemas and types
import type { Message, Status, BusinessProfile } from 'whatsapp-cloud-api-types'
```

## Documentation

- **[API Client Guide](./CLIENT_README.md)** - Complete guide for sending messages and using the API
- **[Webhook Examples](./test/webhooks/)** - Real webhook payload examples
- **[Type Reference](#api-reference)** - Full schema and type documentation below

## Resources

- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Webhook Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Message Types Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages)
- [Zod Documentation](https://zod.dev)

## Support

If you have any questions or issues, please [open an issue](https://github.com/yourusername/whatsapp-cloud-api-types/issues) on GitHub.

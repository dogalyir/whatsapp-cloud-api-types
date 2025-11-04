# Edge Runtime Compatibility

This library is **fully compatible** with edge runtimes like Cloudflare Workers, Vercel Edge Functions, Deno Deploy, and other V8-based environments.

## ✅ Supported Runtimes

- **Cloudflare Workers** - Full support
- **Vercel Edge Functions** - Full support
- **Deno Deploy** - Full support
- **Netlify Edge Functions** - Full support
- **Node.js** (v18+) - Full support
- **Bun** - Full support

## 🔧 How We Ensure Compatibility

### 1. Platform-Neutral Build Target

The library is built with `platform: 'neutral'` to ensure the generated code doesn't include Node.js-specific APIs like:

- ❌ `require()` / `createRequire`
- ❌ `node:module`
- ❌ `node:fs`
- ❌ `node:path`
- ✅ Uses only Web Standard APIs (`fetch`, `FormData`, etc.)

### 2. ESM-Only Distribution

We distribute only ESM (ECMAScript Modules) which is natively supported by all modern JavaScript runtimes:

```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  }
}
```

### 3. No Dynamic Imports

We avoid dynamic `import()` statements that can cause issues with module resolution in edge runtimes. All imports are static and resolved at build time.

### 4. Web Standard APIs Only

The library uses only Web Standard APIs that are available in all modern JavaScript runtimes:

- `fetch()` for HTTP requests
- `FormData` for multipart form uploads
- `URL` and `URLSearchParams` for URL manipulation
- Standard `Promise` and `async/await`

## 📦 Usage in Cloudflare Workers

```typescript
import { WhatsAppCloudAPI } from 'whatsapp-cloud-api-types'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const client = new WhatsAppCloudAPI({
      accessToken: env.WHATSAPP_ACCESS_TOKEN,
      phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
    })

    // Send a message
    await client.messages.sendText('1234567890', 'Hello from Workers!')

    return new Response('Message sent!', { status: 200 })
  },
}
```

## 📦 Usage in Vercel Edge Functions

```typescript
import { WhatsAppCloudAPI } from 'whatsapp-cloud-api-types'
import type { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const client = new WhatsAppCloudAPI({
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
  })

  await client.messages.sendText('1234567890', 'Hello from Edge!')

  return new Response('Message sent!', { status: 200 })
}
```

## 📦 Usage in Deno

```typescript
import { WhatsAppCloudAPI } from 'npm:whatsapp-cloud-api-types'

const client = new WhatsAppCloudAPI({
  accessToken: Deno.env.get('WHATSAPP_ACCESS_TOKEN')!,
  phoneNumberId: Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')!,
})

await client.messages.sendText('1234567890', 'Hello from Deno!')
```

## 🐛 Known Issues

### `Buffer.isBuffer()` in Media Upload

The `MediaService.upload()` method uses `Buffer.isBuffer()` which is a Node.js API. This works in most edge runtimes that provide Node.js compatibility layers, but if you encounter issues, use `Blob` or `File` objects instead:

```typescript
// ✅ Use File (works everywhere)
const file = new File([arrayBuffer], 'image.jpg', { type: 'image/jpeg' })
await client.media.upload(file, 'image/jpeg')

// ✅ Use Blob (works everywhere)
const blob = new Blob([arrayBuffer], { type: 'image/jpeg' })
await client.media.upload(blob, 'image/jpeg', 'image.jpg')

// ⚠️ Use Buffer (Node.js only)
const buffer = Buffer.from(arrayBuffer)
await client.media.upload(buffer, 'image/jpeg', 'image.jpg')
```

## 🔍 Testing

We test this library in:

- ✅ Bun (primary development runtime)
- ✅ Node.js v18+ (CI/CD)
- ✅ Cloudflare Workers (manual testing)

## 🆘 Troubleshooting

### Error: `createRequire is not defined`

If you see this error after upgrading, it means you're using an older version of the library. Update to the latest version:

```bash
npm update whatsapp-cloud-api-types
# or
bun update whatsapp-cloud-api-types
```

### Error: `Cannot use import statement outside a module`

Make sure your environment supports ESM modules. In Node.js, ensure your `package.json` has:

```json
{
  "type": "module"
}
```

Or use `.mjs` file extension for your scripts.

## 📚 Related Documentation

- [Cloudflare Workers Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/)
- [Vercel Edge Runtime](https://vercel.com/docs/functions/edge-functions/edge-runtime)
- [Deno Runtime](https://deno.land/manual/runtime)
- [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

## 🤝 Contributing

If you find any edge runtime compatibility issues, please [open an issue](https://github.com/Dogalyir/whatsapp-cloud-api-types/issues) with:

1. Runtime name and version
2. Error message and stack trace
3. Minimal reproduction code

We're committed to maintaining full edge runtime compatibility! 🚀
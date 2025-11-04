/**
 * Cloudflare Worker Example
 *
 * This example demonstrates how to use whatsapp-cloud-api-types in a Cloudflare Worker.
 * The library is fully compatible with Cloudflare Workers and other edge runtimes.
 *
 * To deploy this worker:
 * 1. Install Wrangler: npm install -g wrangler
 * 2. Create wrangler.toml with your configuration
 * 3. Set environment variables: wrangler secret put WHATSAPP_ACCESS_TOKEN
 * 4. Deploy: wrangler deploy
 */

import {
	WhatsAppCloudAPI,
	type WhatsAppWebhookSchema,
} from 'whatsapp-cloud-api-types'
import type { z } from 'zod'

// Environment variables type (add these in your Cloudflare Worker settings)
interface Env {
	WHATSAPP_ACCESS_TOKEN: string
	WHATSAPP_PHONE_NUMBER_ID: string
	WHATSAPP_WABA_ID?: string
	WEBHOOK_VERIFY_TOKEN?: string
}

export default {
	/**
	 * Main fetch handler for the Worker
	 */
	async fetch(
		request: Request,
		env: Env,
		_ctx: ExecutionContext,
	): Promise<Response> {
		const url = new URL(request.url)

		// Initialize WhatsApp client
		const client = new WhatsAppCloudAPI({
			accessToken: env.WHATSAPP_ACCESS_TOKEN,
			phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
			wabaId: env.WHATSAPP_WABA_ID,
		})

		try {
			// Handle webhook verification (GET request)
			if (request.method === 'GET' && url.pathname === '/webhook') {
				return handleWebhookVerification(request, env)
			}

			// Handle webhook events (POST request)
			if (request.method === 'POST' && url.pathname === '/webhook') {
				return await handleWebhookEvent(request, client)
			}

			// Example: Send a text message
			if (request.method === 'POST' && url.pathname === '/send-text') {
				const { to, message } = await request.json<{
					to: string
					message: string
				}>()
				await client.messages.sendText(to, message)
				return new Response('Message sent!', { status: 200 })
			}

			// Example: Send an image
			if (request.method === 'POST' && url.pathname === '/send-image') {
				const { to, imageUrl, caption } = await request.json<{
					to: string
					imageUrl: string
					caption?: string
				}>()
				await client.messages.sendImage(to, { link: imageUrl }, caption)
				return new Response('Image sent!', { status: 200 })
			}

			// Example: Upload and send media
			if (request.method === 'POST' && url.pathname === '/upload-media') {
				const formData = await request.formData()
				const file = formData.get('file') as File
				const to = formData.get('to') as string

				if (!file || !to) {
					return new Response('Missing file or recipient', { status: 400 })
				}

				// Upload media
				const media = await client.media.upload(file, file.type)

				// Send the uploaded media
				if (file.type.startsWith('image/')) {
					await client.messages.sendImage(to, { id: media.id })
				} else if (file.type.startsWith('video/')) {
					await client.messages.sendVideo(to, { id: media.id })
				} else if (file.type.startsWith('audio/')) {
					await client.messages.sendAudio(to, { id: media.id })
				} else {
					await client.messages.sendDocument(to, { id: media.id })
				}

				return new Response('Media sent!', { status: 200 })
			}

			// Example: Get business profile
			if (request.method === 'GET' && url.pathname === '/profile') {
				const profile = await client.business.getProfile()
				return new Response(JSON.stringify(profile, null, 2), {
					headers: { 'Content-Type': 'application/json' },
				})
			}

			// Example: Show typing indicator and send message
			if (request.method === 'POST' && url.pathname === '/typing-then-send') {
				const { to, message, delay } = await request.json<{
					to: string
					message: string
					delay?: number
				}>()
				await client.actions.typingThenSend(to, message, delay)
				return new Response('Message sent with typing indicator!', {
					status: 200,
				})
			}

			// 404 for unknown routes
			return new Response('Not found', { status: 404 })
		} catch (error) {
			console.error('Error handling request:', error)
			return new Response(
				JSON.stringify({
					error: error instanceof Error ? error.message : 'Unknown error',
				}),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}
	},
}

/**
 * Handle WhatsApp webhook verification (GET request)
 * This is called by WhatsApp when you first set up the webhook
 */
function handleWebhookVerification(request: Request, env: Env): Response {
	const url = new URL(request.url)
	const mode = url.searchParams.get('hub.mode')
	const token = url.searchParams.get('hub.verify_token')
	const challenge = url.searchParams.get('hub.challenge')

	// Check if the verification token matches
	if (mode === 'subscribe' && token === env.WEBHOOK_VERIFY_TOKEN) {
		console.log('Webhook verified successfully')
		return new Response(challenge, { status: 200 })
	}

	console.error('Webhook verification failed')
	return new Response('Forbidden', { status: 403 })
}

/**
 * Handle incoming WhatsApp webhook events (POST request)
 */
async function handleWebhookEvent(
	request: Request,
	client: WhatsAppCloudAPI,
): Promise<Response> {
	try {
		const webhook = (await request.json()) as z.infer<
			typeof WhatsAppWebhookSchema
		>

		// Process each entry in the webhook
		for (const entry of webhook.entry) {
			for (const change of entry.changes) {
				const value = change.value

				// Handle incoming messages
				if (value.messages) {
					for (const message of value.messages) {
						await handleIncomingMessage(message, value, client)
					}
				}

				// Handle message status updates
				if (value.statuses) {
					for (const status of value.statuses) {
						console.log('Message status update:', status)
						// You can track delivery, read receipts, etc.
					}
				}

				// Handle errors
				if (value.errors) {
					for (const error of value.errors) {
						console.error('Webhook error:', error)
					}
				}
			}
		}

		return new Response('OK', { status: 200 })
	} catch (error) {
		console.error('Error processing webhook:', error)
		return new Response('Internal Server Error', { status: 500 })
	}
}

/**
 * Handle a single incoming message
 */
async function handleIncomingMessage(
	message: z.infer<
		typeof WhatsAppWebhookSchema
	>['entry'][number]['changes'][number]['value']['messages'][number],
	_value: z.infer<
		typeof WhatsAppWebhookSchema
	>['entry'][number]['changes'][number]['value'],
	client: WhatsAppCloudAPI,
): Promise<void> {
	const from = message.from
	const messageId = message.id

	console.log(`Received message from ${from}:`, message)

	// Mark message as read
	await client.actions.markAsRead(messageId)

	// Handle different message types
	switch (message.type) {
		case 'text': {
			const text = message.text.body.toLowerCase()

			// Simple command handling
			if (text === 'hi' || text === 'hello') {
				await client.messages.sendText(from, 'Hello! How can I help you?')
			} else if (text === 'help') {
				await client.messages.sendText(
					from,
					'Available commands:\n• hi - Say hello\n• help - Show this message\n• buttons - Show interactive buttons',
				)
			} else if (text === 'buttons') {
				await client.messages.sendInteractiveButtons(from, {
					type: 'button',
					body: { text: 'Choose an option:' },
					action: {
						buttons: [
							{ type: 'reply', reply: { id: 'option1', title: 'Option 1' } },
							{ type: 'reply', reply: { id: 'option2', title: 'Option 2' } },
							{ type: 'reply', reply: { id: 'option3', title: 'Option 3' } },
						],
					},
				})
			} else {
				// Echo the message back
				await client.messages.sendText(from, `You said: ${message.text.body}`)
			}
			break
		}

		case 'interactive': {
			if (message.interactive.type === 'button_reply') {
				const buttonId = message.interactive.button_reply.id
				await client.messages.sendText(from, `You selected: ${buttonId}`)
			} else if (message.interactive.type === 'list_reply') {
				const listId = message.interactive.list_reply.id
				await client.messages.sendText(from, `You selected: ${listId}`)
			}
			break
		}

		case 'image': {
			// Download the image
			const mediaUrl = await client.media.getUrl(message.image.id)
			const imageData = await client.media.download(mediaUrl.url)

			await client.messages.sendText(
				from,
				`Thanks for the image! Size: ${imageData.byteLength} bytes`,
			)
			break
		}

		case 'location': {
			const location = message.location
			await client.messages.sendText(
				from,
				`Thanks for sharing your location: ${location.latitude}, ${location.longitude}`,
			)
			break
		}

		default: {
			console.log('Unhandled message type:', message.type)
			await client.messages.sendText(from, 'Thanks for your message!')
		}
	}
}

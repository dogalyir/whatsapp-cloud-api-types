/**
 * Examples of parsing incoming WhatsApp messages
 *
 * This file demonstrates how to use the library to parse and handle
 * all types of incoming messages from the WhatsApp Business Cloud API.
 */

import {
	type Message,
	type MessagesWebhook,
	MessagesWebhookSchema,
} from '../src'

// Example 1: Parse a text message
const textMessageWebhook = {
	object: 'whatsapp_business_account',
	entry: [
		{
			id: '102290129340398',
			changes: [
				{
					value: {
						messaging_product: 'whatsapp',
						metadata: {
							display_phone_number: '15550783881',
							phone_number_id: '106540352242922',
						},
						contacts: [
							{
								profile: {
									name: 'John Doe',
								},
								wa_id: '16505551234',
							},
						],
						messages: [
							{
								from: '16505551234',
								id: 'wamid.HBgLMTY1MDM4Nzk0MzkVAgASGBQzQTRBNjU5OUFFRTAzODEwMTQ0RgA=',
								timestamp: '1749416383',
								type: 'text',
								text: {
									body: 'Hello, I need help!',
								},
							},
						],
					},
					field: 'messages',
				},
			],
		},
	],
}

// Parse and validate the webhook
const parsedTextMessage = MessagesWebhookSchema.parse(textMessageWebhook)
console.log(
	'Text message:',
	parsedTextMessage.entry[0].changes[0].value.messages?.[0].text?.body,
)

// Example 2: Handle different message types with type narrowing
function handleIncomingMessage(webhook: MessagesWebhook) {
	const message = webhook.entry[0].changes[0].value.messages?.[0]

	if (!message) {
		console.log('No message in webhook')
		return
	}

	switch (message.type) {
		case 'text':
			console.log(`Text message: ${message.text?.body}`)
			break

		case 'image':
			console.log(`Image received: ${message.image?.id}`)
			if (message.image?.caption) {
				console.log(`Caption: ${message.image.caption}`)
			}
			break

		case 'video':
			console.log(`Video received: ${message.video?.id}`)
			break

		case 'audio':
			console.log(`Audio received: ${message.audio?.id}`)
			if (message.audio?.voice) {
				console.log('This is a voice message')
			}
			break

		case 'document':
			console.log(`Document received: ${message.document?.filename}`)
			break

		case 'sticker':
			console.log(`Sticker received: ${message.sticker?.id}`)
			if (message.sticker?.animated) {
				console.log('This is an animated sticker')
			}
			break

		case 'location':
			console.log(
				`Location: ${message.location?.latitude}, ${message.location?.longitude}`,
			)
			if (message.location?.name) {
				console.log(`Location name: ${message.location.name}`)
			}
			break

		case 'contacts':
			console.log(`Received ${message.contacts?.length} contact(s)`)
			message.contacts?.forEach((contact) => {
				console.log(`Contact: ${contact.name.formatted_name}`)
				contact.phones?.forEach((phone) => {
					console.log(`Phone: ${phone.phone}`)
				})
			})
			break

		case 'interactive':
			if (message.interactive?.type === 'button_reply') {
				console.log(
					`Button clicked: ${message.interactive.button_reply?.title}`,
				)
				console.log(`Button ID: ${message.interactive.button_reply?.id}`)
			} else if (message.interactive?.type === 'list_reply') {
				console.log(
					`List item selected: ${message.interactive.list_reply?.title}`,
				)
				console.log(`Item ID: ${message.interactive.list_reply?.id}`)
			}
			break

		case 'button':
			console.log(`Legacy button clicked: ${message.button?.text}`)
			console.log(`Payload: ${message.button?.payload}`)
			break

		case 'reaction':
			console.log(`Reaction: ${message.reaction?.emoji}`)
			console.log(`On message: ${message.reaction?.message_id}`)
			break

		case 'order':
			console.log(`Order received for catalog: ${message.order?.catalog_id}`)
			console.log(`Items in order: ${message.order?.product_items.length}`)
			message.order?.product_items.forEach((item) => {
				console.log(
					`Product: ${item.product_retailer_id}, Quantity: ${item.quantity}, Price: ${item.item_price}`,
				)
			})
			break

		case 'system':
			console.log(`System message: ${message.system?.type}`)
			console.log(`Body: ${message.system?.body}`)
			break

		default:
			console.log(`Unknown message type: ${message.type}`)
	}

	// Check if this is a reply to another message
	if (message.context?.id) {
		console.log(`This is a reply to message: ${message.context.id}`)
	}

	// Check if this is a message from an ad (referral)
	if (message.referral) {
		console.log(`Message from ad campaign: ${message.referral.source_type}`)
		console.log(`Source URL: ${message.referral.source_url}`)
		console.log(`Ad headline: ${message.referral.headline}`)
	}

	// Check if this is a group message
	if (message.group_id) {
		console.log(`Group message in: ${message.group_id}`)
	}
}

// Example 3: Handle status updates
function handleStatusUpdate(webhook: MessagesWebhook) {
	const status = webhook.entry[0].changes[0].value.statuses?.[0]

	if (!status) {
		console.log('No status update in webhook')
		return
	}

	console.log(`Message ${status.id} status: ${status.status}`)
	console.log(`Recipient: ${status.recipient_id}`)

	// Check conversation info (present on first message status)
	if (status.conversation) {
		console.log(`Conversation ID: ${status.conversation.id}`)
		console.log(`Origin type: ${status.conversation.origin?.type}`)
	}

	// Check pricing info
	if (status.pricing) {
		console.log(`Pricing model: ${status.pricing.pricing_model}`)
		console.log(`Billable: ${status.pricing.billable}`)
		console.log(`Category: ${status.pricing.category}`)
	}

	// Check for errors (if status is 'failed')
	if (status.errors) {
		status.errors.forEach((error) => {
			console.error(`Error ${error.code}: ${error.message}`)
			if (error.error_data?.details) {
				console.error(`Details: ${error.error_data.details}`)
			}
		})
	}
}

// Example 4: Use safeParse for error handling
function safeParseWebhook(data: unknown) {
	const result = MessagesWebhookSchema.safeParse(data)

	if (result.success) {
		console.log('Valid webhook received')
		handleIncomingMessage(result.data)
		handleStatusUpdate(result.data)
		return result.data
	}

	console.error('Invalid webhook data:', result.error.issues)
	return null
}

// Example 5: Type-safe message handler with generics
function _processMessage<T extends Message['type']>(
	message: Extract<Message, { type: T }>,
	type: T,
) {
	// TypeScript knows the exact message type here
	if (type === 'text' && message.type === 'text') {
		// message.text is guaranteed to exist
		return message.text.body
	}
	if (type === 'image' && message.type === 'image') {
		// message.image is guaranteed to exist
		return message.image.id
	}
	// ... handle other types
}

// Example 6: Extract message from webhook
function getFirstMessage(webhook: MessagesWebhook): Message | undefined {
	return webhook.entry[0]?.changes[0]?.value?.messages?.[0]
}

// Example 7: Get sender information
function getSenderInfo(webhook: MessagesWebhook) {
	const contact = webhook.entry[0]?.changes[0]?.value?.contacts?.[0]
	const message = webhook.entry[0]?.changes[0]?.value?.messages?.[0]

	return {
		waId: contact?.wa_id,
		name: contact?.profile.name,
		phoneNumber: message?.from,
	}
}

// Example 8: Check if webhook contains messages or status updates
function classifyWebhook(webhook: MessagesWebhook) {
	const value = webhook.entry[0]?.changes[0]?.value

	if (value.messages && value.messages.length > 0) {
		return 'incoming_message'
	}

	if (value.statuses && value.statuses.length > 0) {
		return 'status_update'
	}

	if (value.errors && value.errors.length > 0) {
		return 'error'
	}

	return 'unknown'
}

// Example usage in Express.js
/*
import express from 'express'

const app = express()

app.post('/webhook', express.json(), (req, res) => {
	const result = MessagesWebhookSchema.safeParse(req.body)

	if (!result.success) {
		console.error('Invalid webhook:', result.error)
		return res.status(400).json({ error: 'Invalid webhook data' })
	}

	const webhook = result.data
	const webhookType = classifyWebhook(webhook)

	switch (webhookType) {
		case 'incoming_message':
			handleIncomingMessage(webhook)
			break
		case 'status_update':
			handleStatusUpdate(webhook)
			break
		case 'error':
			console.error('Error webhook received')
			break
	}

	res.sendStatus(200)
})
*/

export {
	handleIncomingMessage,
	handleStatusUpdate,
	safeParseWebhook,
	getFirstMessage,
	getSenderInfo,
	classifyWebhook,
}

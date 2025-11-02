/**
 * Example webhook handler demonstrating all WhatsApp Cloud API webhook types
 *
 * This file shows how to use the type-safe webhook schemas to handle
 * incoming webhooks from the WhatsApp Business Cloud API.
 */

import {
	type Message,
	type MessagesWebhook,
	MessagesWebhookSchema,
	MessageTemplateComponentsUpdateWebhookSchema,
	MessageTemplateQualityUpdateWebhookSchema,
	MessageTemplateStatusUpdateWebhookSchema,
	TemplateCategoryUpdateWebhookSchema,
	type WhatsAppWebhook,
	WhatsAppWebhookSchema,
} from '../src'

// Example 1: Using the unified webhook schema
// This automatically handles any webhook type
export function handleWebhook(body: unknown) {
	try {
		const webhook = WhatsAppWebhookSchema.parse(body)

		webhook.entry.forEach((entry) => {
			entry.changes.forEach((change) => {
				// TypeScript will narrow the type based on the field
				switch (change.field) {
					case 'messages':
						handleMessages(change.value)
						break
					case 'message_template_status_update':
						handleTemplateStatusUpdate(change.value)
						break
					case 'message_template_components_update':
						handleTemplateComponentsUpdate(change.value)
						break
					case 'template_category_update':
						handleTemplateCategoryUpdate(change.value)
						break
				}
			})
		})
	} catch (error) {
		console.error('Invalid webhook payload:', error)
		throw error
	}
}

// Example 2: Handling messages webhook
function handleMessages(
	value: MessagesWebhook['entry'][0]['changes'][0]['value'],
) {
	console.log('📱 Messages webhook received')
	console.log('Phone number:', value.metadata.phone_number_id)

	// Handle incoming messages
	value.messages?.forEach((message) => {
		console.log(`\n📨 New message from ${message.from}`)
		handleMessage(message)
	})

	// Handle message status updates
	value.statuses?.forEach((status) => {
		console.log(`\n📊 Status update for message ${status.id}:`, status.status)

		if (status.conversation) {
			console.log('Conversation ID:', status.conversation.id)
		}

		if (status.pricing) {
			console.log('Pricing model:', status.pricing.pricing_model)
			console.log('Billable:', status.pricing.billable)
		}

		if (status.errors) {
			console.error('Status errors:', status.errors)
		}
	})
}

// Example 3: Handling different message types
function handleMessage(message: Message) {
	switch (message.type) {
		case 'text':
			console.log('Text message:', message.text?.body)
			break

		case 'image':
			console.log('Image received:', message.image?.id)
			if (message.image?.caption) {
				console.log('Caption:', message.image.caption)
			}
			break

		case 'video':
			console.log('Video received:', message.video?.id)
			break

		case 'audio':
			console.log('Audio received:', message.audio?.id)
			break

		case 'document':
			console.log('Document received:', message.document?.id)
			if (message.document?.filename) {
				console.log('Filename:', message.document.filename)
			}
			break

		case 'sticker':
			console.log('Sticker received:', message.sticker?.id)
			break

		case 'location':
			if (message.location) {
				console.log('Location:', {
					lat: message.location.latitude,
					lng: message.location.longitude,
					name: message.location.name,
				})
			}
			break

		case 'interactive':
			if (message.interactive?.type === 'button_reply') {
				console.log('Button clicked:', message.interactive.button_reply?.title)
			} else if (message.interactive?.type === 'list_reply') {
				console.log(
					'List item selected:',
					message.interactive.list_reply?.title,
				)
			}
			break

		case 'reaction':
			console.log('Reaction:', message.reaction?.emoji)
			console.log('To message:', message.reaction?.message_id)
			break

		case 'unknown':
			console.warn('Unknown message type')
			if (message.errors) {
				console.error('Errors:', message.errors)
			}
			break
	}

	// Check if message is a reply
	if (message.context) {
		console.log('This is a reply to:', message.context.id)
		if (message.context.forwarded) {
			console.log('Message was forwarded')
		}
	}
}

// Example 4: Handling template status updates
function handleTemplateStatusUpdate(
	value: any, // Use the actual type from the schema
) {
	console.log('📋 Template Status Update')
	console.log('Template:', value.message_template_name)
	console.log('Language:', value.message_template_language)
	console.log('Event:', value.event)

	switch (value.event) {
		case 'APPROVED':
			console.log('✅ Template was approved!')
			break

		case 'REJECTED':
			console.log('❌ Template was rejected')
			console.log('Reason:', value.reason)
			break

		case 'DISABLED':
			console.log('🚫 Template was disabled')
			if (value.disable_info) {
				const date = new Date(value.disable_info.disable_date * 1000)
				console.log('Disabled on:', date.toISOString())
			}
			break

		case 'LOCKED':
		case 'PAUSED':
			console.log('⏸️ Template was locked/paused')
			if (value.other_info) {
				console.log('Reason:', value.other_info.title)
				console.log('Description:', value.other_info.description)
			}
			break

		case 'REINSTATED':
			console.log('✅ Template was reinstated')
			break
	}
}

// Example 5: Handling template quality updates
function handleTemplateQualityUpdate(value: any) {
	console.log('📊 Template Quality Update')
	console.log('Template:', value.message_template_name)
	console.log(
		`Quality changed: ${value.previous_quality_score} → ${value.new_quality_score}`,
	)

	if (value.new_quality_score === 'RED') {
		console.warn(
			'⚠️ Template quality is now RED! Consider reviewing your template.',
		)
	} else if (value.new_quality_score === 'YELLOW') {
		console.warn('⚠️ Template quality is now YELLOW. Monitor usage carefully.')
	} else if (value.new_quality_score === 'GREEN') {
		console.log('✅ Template quality is GREEN!')
	}
}

// Example 6: Handling template components updates
function handleTemplateComponentsUpdate(value: any) {
	console.log('🔧 Template Components Update')
	console.log('Template:', value.message_template_name)
	console.log('Language:', value.message_template_language)

	if (value.message_template_title) {
		console.log('Header:', value.message_template_title)
	}

	console.log('Body:', value.message_template_element)

	if (value.message_template_footer) {
		console.log('Footer:', value.message_template_footer)
	}

	if (value.message_template_buttons) {
		console.log('Buttons:')
		value.message_template_buttons.forEach((button: any, index: number) => {
			console.log(
				`  ${index + 1}. [${button.message_template_button_type}] ${button.message_template_button_text}`,
			)
			if (button.message_template_button_url) {
				console.log(`     URL: ${button.message_template_button_url}`)
			}
			if (button.message_template_button_phone_number) {
				console.log(
					`     Phone: ${button.message_template_button_phone_number}`,
				)
			}
		})
	}
}

// Example 7: Handling template category updates
function handleTemplateCategoryUpdate(value: any) {
	console.log('📁 Template Category Update')
	console.log('Template:', value.message_template_name)

	// Check if it's an impending change notification
	if ('correct_category' in value) {
		console.log('⏰ Impending category change (will occur in 24 hours):')
		console.log(`  Current: ${value.new_category}`)
		console.log(`  Future: ${value.correct_category}`)
	} else {
		console.log('✅ Category change completed:')
		console.log(`  Previous: ${value.previous_category}`)
		console.log(`  New: ${value.new_category}`)
	}
}

// Example 8: Safe parsing with error handling
export function safeHandleWebhook(body: unknown): boolean {
	const result = WhatsAppWebhookSchema.safeParse(body)

	if (!result.success) {
		console.error('Webhook validation failed:')
		result.error.issues.forEach((issue) => {
			console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
		})
		return false
	}

	try {
		handleWebhook(result.data)
		return true
	} catch (error) {
		console.error('Error processing webhook:', error)
		return false
	}
}

// Example 9: Type-safe webhook handler for Express
/*
import express from 'express'

const app = express()
app.use(express.json())

app.post('/webhook', (req, res) => {
	const result = WhatsAppWebhookSchema.safeParse(req.body)

	if (!result.success) {
		console.error('Invalid webhook:', result.error)
		return res.sendStatus(400)
	}

	// Process webhook asynchronously
	handleWebhook(result.data).catch(console.error)

	// Respond immediately to WhatsApp
	res.sendStatus(200)
})

app.listen(3000, () => {
	console.log('Webhook server listening on port 3000')
})
*/

// Example 10: Specific webhook type handlers
export function handleMessagesOnly(body: unknown) {
	const webhook = MessagesWebhookSchema.parse(body)

	webhook.entry.forEach((entry) => {
		entry.changes.forEach((change) => {
			// TypeScript knows this is always 'messages'
			console.log('Field:', change.field) // Type is 'messages'

			// Access messages with full type safety
			change.value.messages?.forEach((message) => {
				console.log('Message type:', message.type)
				// Full autocomplete for all message fields
			})
		})
	})
}

export function handleTemplateStatusOnly(body: unknown) {
	const webhook = MessageTemplateStatusUpdateWebhookSchema.parse(body)

	webhook.entry.forEach((entry) => {
		entry.changes.forEach((change) => {
			console.log('Template:', change.value.message_template_name)
			console.log('Event:', change.value.event)
			// Full type safety for template status fields
		})
	})
}

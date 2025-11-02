import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { MessagesWebhookSchema } from '../src/webhooks/messages'

// Read the all_messages.json file
const allMessagesPath = join(import.meta.dir, '..', 'json', 'all_messages.json')
const allMessagesJson = JSON.parse(readFileSync(allMessagesPath, 'utf-8'))

test('all message examples should validate against MessagesWebhookSchema', () => {
	// The JSON file is an array of webhook objects
	expect(Array.isArray(allMessagesJson)).toBe(true)
	expect(allMessagesJson.length).toBeGreaterThan(0)

	// Test each webhook example
	allMessagesJson.forEach((webhook, index) => {
		const result = MessagesWebhookSchema.safeParse(webhook)

		if (!result.success) {
			console.error(`\n❌ Webhook at index ${index} failed validation:`)
			console.error('Webhook data:', JSON.stringify(webhook, null, 2))
			console.error('Validation errors:', result.error.format())
		}

		expect(result.success).toBe(true)
	})

	console.log(
		`\n✅ All ${allMessagesJson.length} webhook examples validated successfully!`,
	)
})

test('validate text message', () => {
	const textWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return (
			messages?.[0]?.type === 'text' &&
			!messages?.[0]?.referral &&
			!messages?.[0]?.context
		)
	})

	expect(textWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(textWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('text')
	expect(
		result.entry[0].changes[0].value.messages?.[0].text?.body,
	).toBeDefined()
})

test('validate audio message', () => {
	const audioWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.type === 'audio'
	})

	expect(audioWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(audioWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('audio')
	expect(result.entry[0].changes[0].value.messages?.[0].audio).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].audio?.voice,
	).toBeDefined()
})

test('validate button message', () => {
	const buttonWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.type === 'button'
	})

	expect(buttonWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(buttonWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('button')
	expect(result.entry[0].changes[0].value.messages?.[0].button).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].button?.text,
	).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].button?.payload,
	).toBeDefined()
})

test('validate contacts message', () => {
	const contactsWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.type === 'contacts'
	})

	expect(contactsWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(contactsWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('contacts')
	expect(result.entry[0].changes[0].value.messages?.[0].contacts).toBeDefined()
	expect(
		Array.isArray(result.entry[0].changes[0].value.messages?.[0].contacts),
	).toBe(true)
})

test('validate document message', () => {
	const documentWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.type === 'document'
	})

	expect(documentWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(documentWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('document')
	expect(result.entry[0].changes[0].value.messages?.[0].document).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].document?.filename,
	).toBeDefined()
})

test('validate image message', () => {
	const imageWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.type === 'image'
	})

	expect(imageWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(imageWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('image')
	expect(result.entry[0].changes[0].value.messages?.[0].image).toBeDefined()
})

test('validate interactive message with list_reply', () => {
	const interactiveWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return (
			messages?.[0]?.type === 'interactive' &&
			messages?.[0]?.interactive?.type === 'list_reply'
		)
	})

	expect(interactiveWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(interactiveWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe(
		'interactive',
	)
	expect(result.entry[0].changes[0].value.messages?.[0].interactive?.type).toBe(
		'list_reply',
	)
	expect(
		result.entry[0].changes[0].value.messages?.[0].interactive?.list_reply,
	).toBeDefined()
})

test('validate interactive message with button_reply', () => {
	const interactiveWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return (
			messages?.[0]?.type === 'interactive' &&
			messages?.[0]?.interactive?.type === 'button_reply'
		)
	})

	expect(interactiveWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(interactiveWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe(
		'interactive',
	)
	expect(result.entry[0].changes[0].value.messages?.[0].interactive?.type).toBe(
		'button_reply',
	)
	expect(
		result.entry[0].changes[0].value.messages?.[0].interactive?.button_reply,
	).toBeDefined()
})

test('validate location message', () => {
	const locationWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.type === 'location'
	})

	expect(locationWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(locationWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('location')
	expect(result.entry[0].changes[0].value.messages?.[0].location).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].location?.latitude,
	).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].location?.longitude,
	).toBeDefined()
})

test('validate order message', () => {
	const orderWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.type === 'order'
	})

	expect(orderWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(orderWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('order')
	expect(result.entry[0].changes[0].value.messages?.[0].order).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].order?.catalog_id,
	).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].order?.product_items,
	).toBeDefined()
})

test('validate reaction message', () => {
	const reactionWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.type === 'reaction'
	})

	expect(reactionWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(reactionWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('reaction')
	expect(result.entry[0].changes[0].value.messages?.[0].reaction).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].reaction?.message_id,
	).toBeDefined()
})

test('validate sticker message', () => {
	const stickerWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.type === 'sticker'
	})

	expect(stickerWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(stickerWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('sticker')
	expect(result.entry[0].changes[0].value.messages?.[0].sticker).toBeDefined()
})

test('validate video message', () => {
	const videoWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.type === 'video'
	})

	expect(videoWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(videoWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('video')
	expect(result.entry[0].changes[0].value.messages?.[0].video).toBeDefined()
})

test('validate system message', () => {
	const systemWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.type === 'system'
	})

	expect(systemWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(systemWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('system')
	expect(result.entry[0].changes[0].value.messages?.[0].system).toBeDefined()
})

test('validate message with context', () => {
	const contextWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.context
	})

	expect(contextWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(contextWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].context).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].context?.from,
	).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].context?.id,
	).toBeDefined()
})

test('validate message with referred_product in context', () => {
	const referredProductWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.context?.referred_product
	})

	expect(referredProductWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(referredProductWebhook)
	expect(
		result.entry[0].changes[0].value.messages?.[0].context?.referred_product,
	).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].context?.referred_product
			?.catalog_id,
	).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].context?.referred_product
			?.product_retailer_id,
	).toBeDefined()
})

test('validate message with referral', () => {
	const referralWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.referral
	})

	expect(referralWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(referralWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].referral).toBeDefined()
	expect(
		result.entry[0].changes[0].value.messages?.[0].referral?.source_url,
	).toBeDefined()
})

test('validate message with group_id', () => {
	const groupWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.group_id
	})

	expect(groupWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(groupWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].group_id).toBeDefined()
})

test('validate message with errors', () => {
	const errorMessageWebhook = allMessagesJson.find((w) => {
		const messages = w.entry?.[0]?.changes?.[0]?.value?.messages
		return messages?.[0]?.errors
	})

	expect(errorMessageWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(errorMessageWebhook)
	expect(result.entry[0].changes[0].value.messages?.[0].errors).toBeDefined()
	expect(
		Array.isArray(result.entry[0].changes[0].value.messages?.[0].errors),
	).toBe(true)
})

test('validate status update', () => {
	const statusWebhook = allMessagesJson.find((w) => {
		const statuses = w.entry?.[0]?.changes?.[0]?.value?.statuses
		return statuses && statuses.length > 0
	})

	expect(statusWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(statusWebhook)
	expect(result.entry[0].changes[0].value.statuses).toBeDefined()
	expect(result.entry[0].changes[0].value.statuses?.[0].id).toBeDefined()
	expect(result.entry[0].changes[0].value.statuses?.[0].status).toBeDefined()
})

test('validate status with conversation and pricing', () => {
	const statusWebhook = allMessagesJson.find((w) => {
		const statuses = w.entry?.[0]?.changes?.[0]?.value?.statuses
		return statuses?.[0]?.conversation && statuses?.[0]?.pricing
	})

	expect(statusWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(statusWebhook)
	expect(
		result.entry[0].changes[0].value.statuses?.[0].conversation,
	).toBeDefined()
	expect(result.entry[0].changes[0].value.statuses?.[0].pricing).toBeDefined()
})

test('validate status with errors', () => {
	const statusErrorWebhook = allMessagesJson.find((w) => {
		const statuses = w.entry?.[0]?.changes?.[0]?.value?.statuses
		return statuses?.[0]?.errors
	})

	expect(statusErrorWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(statusErrorWebhook)
	expect(result.entry[0].changes[0].value.statuses?.[0].errors).toBeDefined()
	expect(
		Array.isArray(result.entry[0].changes[0].value.statuses?.[0].errors),
	).toBe(true)
})

test('validate webhook with only errors in value', () => {
	const errorsOnlyWebhook = allMessagesJson.find((w) => {
		const value = w.entry?.[0]?.changes?.[0]?.value
		return value?.errors && !value?.messages && !value?.statuses
	})

	expect(errorsOnlyWebhook).toBeDefined()
	const result = MessagesWebhookSchema.parse(errorsOnlyWebhook)
	expect(result.entry[0].changes[0].value.errors).toBeDefined()
	expect(result.entry[0].changes[0].value.messages).toBeUndefined()
	expect(result.entry[0].changes[0].value.statuses).toBeUndefined()
})

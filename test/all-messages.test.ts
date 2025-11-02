import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { MessagesWebhookSchema } from '../src/webhooks/messages'

// Load all message examples from JSON file
const allMessagesJson = JSON.parse(
	readFileSync(join(__dirname, '../json/all_messages.json'), 'utf-8'),
)

describe('All incoming messages validation', () => {
	test('should parse text message', () => {
		const textMessage = allMessagesJson[0]
		const result = MessagesWebhookSchema.parse(textMessage)

		expect(result.object).toBe('whatsapp_business_account')
		expect(result.entry[0].changes[0].field).toBe('messages')
		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('text')
		expect(result.entry[0].changes[0].value.messages?.[0].text?.body).toBe(
			'Hello World',
		)
	})

	test('should parse audio message with voice true', () => {
		const audioMessage = allMessagesJson[1]
		const result = MessagesWebhookSchema.parse(audioMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('audio')
		expect(result.entry[0].changes[0].value.messages?.[0].audio?.voice).toBe(
			true,
		)
		expect(
			result.entry[0].changes[0].value.messages?.[0].audio?.id,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].audio?.mime_type,
		).toBe('audio/ogg; codecs=opus')
	})

	test('should parse audio message with voice false', () => {
		const audioMessage = allMessagesJson[2]
		const result = MessagesWebhookSchema.parse(audioMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('audio')
		expect(
			result.entry[0].changes[0].value.messages?.[0].audio?.voice,
		).toBeDefined()
	})

	test('should parse button message', () => {
		const buttonMessage = allMessagesJson[3]
		const result = MessagesWebhookSchema.parse(buttonMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('button')
		expect(
			result.entry[0].changes[0].value.messages?.[0].button?.text,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].button?.payload,
		).toBeDefined()
		expect(result.entry[0].changes[0].value.messages?.[0].context).toBeDefined()
	})

	test('should parse contacts message', () => {
		const contactsMessage = allMessagesJson[4]
		const result = MessagesWebhookSchema.parse(contactsMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('contacts')
		expect(
			result.entry[0].changes[0].value.messages?.[0].contacts,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].contacts?.[0].name
				.formatted_name,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].contacts?.[0].phones,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].contacts?.[0].org?.company,
		).toBeDefined()
	})

	test('should parse document message', () => {
		const documentMessage = allMessagesJson[5]
		const result = MessagesWebhookSchema.parse(documentMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('document')
		expect(
			result.entry[0].changes[0].value.messages?.[0].document?.filename,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].document?.caption,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].document?.mime_type,
		).toBeDefined()
	})

	test('should parse error webhook', () => {
		const errorMessage = allMessagesJson[6]
		const result = MessagesWebhookSchema.parse(errorMessage)

		expect(result.entry[0].changes[0].value.errors).toBeDefined()
		expect(result.entry[0].changes[0].value.errors?.[0].code).toBeDefined()
		expect(result.entry[0].changes[0].value.errors?.[0].title).toBeDefined()
		expect(result.entry[0].changes[0].value.errors?.[0].message).toBeDefined()
		expect(
			result.entry[0].changes[0].value.errors?.[0].error_data?.details,
		).toBeDefined()
	})

	test('should parse group message', () => {
		const groupMessage = allMessagesJson[7]
		const result = MessagesWebhookSchema.parse(groupMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('text')
		expect(
			result.entry[0].changes[0].value.messages?.[0].group_id,
		).toBeDefined()
	})

	test('should parse image message', () => {
		const imageMessage = allMessagesJson[8]
		const result = MessagesWebhookSchema.parse(imageMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('image')
		expect(
			result.entry[0].changes[0].value.messages?.[0].image?.caption,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].image?.mime_type,
		).toBe('image/jpeg')
		expect(
			result.entry[0].changes[0].value.messages?.[0].image?.id,
		).toBeDefined()
	})

	test('should parse interactive list_reply message', () => {
		const listReplyMessage = allMessagesJson[9]
		const result = MessagesWebhookSchema.parse(listReplyMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe(
			'interactive',
		)
		expect(
			result.entry[0].changes[0].value.messages?.[0].interactive?.type,
		).toBe('list_reply')
		expect(
			result.entry[0].changes[0].value.messages?.[0].interactive?.list_reply
				?.id,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].interactive?.list_reply
				?.title,
		).toBeDefined()
	})

	test('should parse interactive button_reply message', () => {
		const buttonReplyMessage = allMessagesJson[10]
		const result = MessagesWebhookSchema.parse(buttonReplyMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe(
			'interactive',
		)
		expect(
			result.entry[0].changes[0].value.messages?.[0].interactive?.type,
		).toBe('button_reply')
		expect(
			result.entry[0].changes[0].value.messages?.[0].interactive?.button_reply
				?.id,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].interactive?.button_reply
				?.title,
		).toBeDefined()
	})

	test('should parse location message', () => {
		const locationMessage = allMessagesJson[11]
		const result = MessagesWebhookSchema.parse(locationMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('location')
		expect(
			result.entry[0].changes[0].value.messages?.[0].location?.latitude,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].location?.longitude,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].location?.name,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].location?.address,
		).toBeDefined()
	})

	test('should parse order message', () => {
		const orderMessage = allMessagesJson[12]
		const result = MessagesWebhookSchema.parse(orderMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('order')
		expect(
			result.entry[0].changes[0].value.messages?.[0].order?.catalog_id,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].order?.product_items,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].order?.product_items
				?.length,
		).toBeGreaterThan(0)
		expect(
			result.entry[0].changes[0].value.messages?.[0].order?.product_items?.[0]
				.product_retailer_id,
		).toBeDefined()
	})

	test('should parse reaction message', () => {
		const reactionMessage = allMessagesJson[13]
		const result = MessagesWebhookSchema.parse(reactionMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('reaction')
		expect(
			result.entry[0].changes[0].value.messages?.[0].reaction?.message_id,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].reaction?.emoji,
		).toBeDefined()
	})

	test('should parse status update - sent', () => {
		const statusMessage = allMessagesJson[14]
		const result = MessagesWebhookSchema.parse(statusMessage)

		expect(result.entry[0].changes[0].value.statuses).toBeDefined()
		expect(result.entry[0].changes[0].value.statuses?.[0].status).toBe('sent')
		expect(
			result.entry[0].changes[0].value.statuses?.[0].conversation,
		).toBeDefined()
		expect(result.entry[0].changes[0].value.statuses?.[0].pricing).toBeDefined()
	})

	test('should parse status update - delivered', () => {
		const statusMessage = allMessagesJson[15]
		const result = MessagesWebhookSchema.parse(statusMessage)

		expect(result.entry[0].changes[0].value.statuses?.[0].status).toBeDefined()
	})

	test('should parse status update - failed with errors', () => {
		const statusMessage = allMessagesJson[16]
		const result = MessagesWebhookSchema.parse(statusMessage)

		expect(result.entry[0].changes[0].value.statuses?.[0].status).toBe('failed')
		expect(result.entry[0].changes[0].value.statuses?.[0].errors).toBeDefined()
		expect(
			result.entry[0].changes[0].value.statuses?.[0].errors?.[0].code,
		).toBeDefined()
	})

	test('should parse sticker message', () => {
		const stickerMessage = allMessagesJson[17]
		const result = MessagesWebhookSchema.parse(stickerMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('sticker')
		expect(
			result.entry[0].changes[0].value.messages?.[0].sticker?.id,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].sticker?.mime_type,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].sticker?.animated,
		).toBeDefined()
	})

	test('should parse system message', () => {
		const systemMessage = allMessagesJson[18]
		const result = MessagesWebhookSchema.parse(systemMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('system')
		expect(
			result.entry[0].changes[0].value.messages?.[0].system?.body,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].system?.type,
		).toBeDefined()
	})

	test('should parse text message (duplicate example)', () => {
		const textMessage = allMessagesJson[19]
		const result = MessagesWebhookSchema.parse(textMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('text')
	})

	test('should parse text message with context (referred_product)', () => {
		const textWithContextMessage = allMessagesJson[20]
		const result = MessagesWebhookSchema.parse(textWithContextMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('text')
		expect(result.entry[0].changes[0].value.messages?.[0].context).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].context?.referred_product,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].context?.referred_product
				?.catalog_id,
		).toBeDefined()
	})

	test('should parse text message with referral (from ad)', () => {
		const referralMessage = allMessagesJson[21]
		const result = MessagesWebhookSchema.parse(referralMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('text')
		expect(
			result.entry[0].changes[0].value.messages?.[0].referral,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].referral?.source_url,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].referral?.source_type,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].referral?.headline,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].referral?.ctwa_clid,
		).toBeDefined()
	})

	test('should parse message with errors array', () => {
		const messageWithErrors = allMessagesJson[22]
		const result = MessagesWebhookSchema.parse(messageWithErrors)

		expect(result.entry[0].changes[0].value.messages?.[0].errors).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].errors?.[0].code,
		).toBeDefined()
	})

	test('should parse video message', () => {
		const videoMessage = allMessagesJson[23]
		const result = MessagesWebhookSchema.parse(videoMessage)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('video')
		expect(
			result.entry[0].changes[0].value.messages?.[0].video?.caption,
		).toBeDefined()
		expect(
			result.entry[0].changes[0].value.messages?.[0].video?.mime_type,
		).toBe('video/mp4')
		expect(
			result.entry[0].changes[0].value.messages?.[0].video?.id,
		).toBeDefined()
	})

	test('should parse all messages without throwing errors', () => {
		allMessagesJson.forEach((message: unknown, _index: number) => {
			expect(() => {
				MessagesWebhookSchema.parse(message)
			}).not.toThrow()
		})
	})

	test('should validate contacts and metadata in all messages', () => {
		allMessagesJson.forEach((message: unknown, _index: number) => {
			const result = MessagesWebhookSchema.parse(message)

			// All messages should have metadata
			expect(result.entry[0].changes[0].value.metadata).toBeDefined()
			expect(
				result.entry[0].changes[0].value.metadata.display_phone_number,
			).toBeDefined()
			expect(
				result.entry[0].changes[0].value.metadata.phone_number_id,
			).toBeDefined()

			// Messages with contacts should have valid contact structure
			if (result.entry[0].changes[0].value.contacts) {
				expect(result.entry[0].changes[0].value.contacts[0].wa_id).toBeDefined()
				expect(
					result.entry[0].changes[0].value.contacts[0].profile.name,
				).toBeDefined()
			}
		})
	})
})

import { describe, expect, test } from 'bun:test'
import {
	GetSubscriptionsResponseSchema,
	MessagesWebhookSchema,
	MessageTemplateComponentsUpdateWebhookSchema,
	MessageTemplateQualityUpdateWebhookSchema,
	MessageTemplateStatusUpdateWebhookSchema,
	OverrideCallbackURLRequestSchema,
	OverrideCallbackURLResponseSchema,
	SubscribeToWABAResponseSchema,
	TemplateCategoryUpdateWebhookSchema,
	UnsubscribeFromWABAResponseSchema,
	WhatsAppWebhookSchema,
} from '../src'

describe('Package exports', () => {
	test('should export unified webhook schema', () => {
		expect(WhatsAppWebhookSchema).toBeDefined()
		expect(typeof WhatsAppWebhookSchema.parse).toBe('function')
	})

	test('should export individual webhook schemas', () => {
		expect(MessagesWebhookSchema).toBeDefined()
		expect(MessageTemplateStatusUpdateWebhookSchema).toBeDefined()
		expect(MessageTemplateQualityUpdateWebhookSchema).toBeDefined()
		expect(MessageTemplateComponentsUpdateWebhookSchema).toBeDefined()
		expect(TemplateCategoryUpdateWebhookSchema).toBeDefined()
	})

	test('should export subscription management schemas', () => {
		expect(SubscribeToWABAResponseSchema).toBeDefined()
		expect(GetSubscriptionsResponseSchema).toBeDefined()
		expect(UnsubscribeFromWABAResponseSchema).toBeDefined()
		expect(OverrideCallbackURLRequestSchema).toBeDefined()
		expect(OverrideCallbackURLResponseSchema).toBeDefined()
	})

	test('should parse valid webhook with unified schema', () => {
		const payload = {
			object: 'whatsapp_business_account',
			entry: [
				{
					id: '123',
					changes: [
						{
							value: {
								messaging_product: 'whatsapp',
								metadata: {
									display_phone_number: '1234567890',
									phone_number_id: '123',
								},
								messages: [
									{
										from: '1234567890',
										id: 'msg_123',
										timestamp: '1234567890',
										type: 'text',
										text: {
											body: 'Hello',
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

		const result = WhatsAppWebhookSchema.parse(payload)
		expect(result.object).toBe('whatsapp_business_account')
	})
})

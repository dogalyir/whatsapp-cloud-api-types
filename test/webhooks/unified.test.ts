import { describe, expect, test } from 'bun:test'
import { WhatsAppWebhookSchema } from '../../src/webhooks'

describe('WhatsAppWebhookSchema (Unified)', () => {
	test('should parse messages webhook', () => {
		const payload = {
			object: 'whatsapp_business_account',
			entry: [
				{
					id: '8856996819413533',
					changes: [
						{
							value: {
								messaging_product: 'whatsapp',
								metadata: {
									display_phone_number: '16505553333',
									phone_number_id: '27681414235104944',
								},
								contacts: [
									{
										profile: {
											name: 'Kerry Fisher',
										},
										wa_id: '16315551234',
									},
								],
								messages: [
									{
										from: '16315551234',
										id: 'wamid.ABGGFlCGg0cvAgo-sJQh43L5Pe4W',
										timestamp: '1603059201',
										text: {
											body: 'Hello this is an answer',
										},
										type: 'text',
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
		expect(result.entry[0].changes[0].field).toBe('messages')
	})

	test('should parse template status update webhook', () => {
		const payload = {
			entry: [
				{
					id: '102290129340398',
					time: 1751247548,
					changes: [
						{
							value: {
								event: 'APPROVED',
								message_template_id: 1689556908129832,
								message_template_name: 'order_confirmation',
								message_template_language: 'en-US',
								reason: 'NONE',
							},
							field: 'message_template_status_update',
						},
					],
				},
			],
			object: 'whatsapp_business_account',
		}

		const result = WhatsAppWebhookSchema.parse(payload)

		expect(result.object).toBe('whatsapp_business_account')
		expect(result.entry[0].changes[0].field).toBe(
			'message_template_status_update',
		)
	})

	test('should parse template quality update webhook', () => {
		const payload = {
			entry: [
				{
					id: '102290129340398',
					time: 1674864290,
					changes: [
						{
							value: {
								previous_quality_score: 'GREEN',
								new_quality_score: 'YELLOW',
								message_template_id: 806312974732579,
								message_template_name: 'welcome_template',
								message_template_language: 'en-US',
							},
							field: 'message_template_status_update',
						},
					],
				},
			],
			object: 'whatsapp_business_account',
		}

		const result = WhatsAppWebhookSchema.parse(payload)

		expect(result.object).toBe('whatsapp_business_account')
		expect(result.entry[0].changes[0].field).toBe(
			'message_template_status_update',
		)
	})

	test('should parse template components update webhook', () => {
		const payload = {
			entry: [
				{
					id: '102290129340398',
					time: 1751250234,
					changes: [
						{
							value: {
								message_template_id: 1315502779341834,
								message_template_name: 'order_confirmation',
								message_template_language: 'en_US',
								message_template_title: 'Your order is confirmed!',
								message_template_element:
									'Thank you for your order, {{1}}! Your order number is {{2}}.',
								message_template_footer:
									'Lucky Shrub: the Succulent Specialists!',
								message_template_buttons: [
									{
										message_template_button_type: 'PHONE_NUMBER',
										message_template_button_text: 'Phone support',
										message_template_button_phone_number: '+15550783881',
									},
									{
										message_template_button_type: 'URL',
										message_template_button_text: 'Email support',
										message_template_button_url:
											'https://www.luckyshrub.com/support',
									},
								],
							},
							field: 'message_template_components_update',
						},
					],
				},
			],
			object: 'whatsapp_business_account',
		}

		const result = WhatsAppWebhookSchema.parse(payload)

		expect(result.object).toBe('whatsapp_business_account')
		expect(result.entry[0].changes[0].field).toBe(
			'message_template_components_update',
		)
	})

	test('should parse template category update webhook (impending)', () => {
		const payload = {
			entry: [
				{
					id: '102290129340398',
					time: 1746082800,
					changes: [
						{
							field: 'template_category_update',
							value: {
								message_template_id: 278077987957091,
								message_template_name: 'welcome_template',
								message_template_language: 'en-US',
								correct_category: 'MARKETING',
								new_category: 'UTILITY',
							},
						},
					],
				},
			],
			object: 'whatsapp_business_account',
		}

		const result = WhatsAppWebhookSchema.parse(payload)

		expect(result.object).toBe('whatsapp_business_account')
		expect(result.entry[0].changes[0].field).toBe('template_category_update')
	})

	test('should parse template category update webhook (completed)', () => {
		const payload = {
			entry: [
				{
					id: '102290129340398',
					time: 1746169200,
					changes: [
						{
							field: 'template_category_update',
							value: {
								message_template_id: 278077987957091,
								message_template_name: 'welcome_template',
								message_template_language: 'en-US',
								previous_category: 'UTILITY',
								new_category: 'MARKETING',
							},
						},
					],
				},
			],
			object: 'whatsapp_business_account',
		}

		const result = WhatsAppWebhookSchema.parse(payload)

		expect(result.object).toBe('whatsapp_business_account')
		expect(result.entry[0].changes[0].field).toBe('template_category_update')
	})

	test('should reject completely invalid payload', () => {
		const payload = {
			invalid: 'data',
		}

		expect(() => WhatsAppWebhookSchema.parse(payload)).toThrow()
	})

	test('should use safeParse for graceful error handling', () => {
		const invalidPayload = {
			object: 'whatsapp_business_account',
			entry: [
				{
					id: '123',
					changes: [
						{
							value: {},
							field: 'invalid_field',
						},
					],
				},
			],
		}

		const result = WhatsAppWebhookSchema.safeParse(invalidPayload)

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues.length).toBeGreaterThan(0)
		}
	})

	test('should provide type narrowing based on field value', () => {
		const messagesPayload = {
			object: 'whatsapp_business_account',
			entry: [
				{
					id: '8856996819413533',
					changes: [
						{
							value: {
								messaging_product: 'whatsapp',
								metadata: {
									display_phone_number: '16505553333',
									phone_number_id: '27681414235104944',
								},
								messages: [
									{
										from: '16315551234',
										id: 'wamid.ID',
										timestamp: '1603059201',
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

		const webhook = WhatsAppWebhookSchema.parse(messagesPayload)
		const change = webhook.entry[0].changes[0]

		// TypeScript type narrowing
		if (change.field === 'messages') {
			expect(change.value.messaging_product).toBe('whatsapp')
			expect(change.value.messages).toBeDefined()
		}
	})

	test('should handle multiple entries in a single webhook', () => {
		const payload = {
			object: 'whatsapp_business_account',
			entry: [
				{
					id: '8856996819413533',
					changes: [
						{
							value: {
								messaging_product: 'whatsapp',
								metadata: {
									display_phone_number: '16505553333',
									phone_number_id: '27681414235104944',
								},
								messages: [
									{
										from: '16315551234',
										id: 'wamid.ID1',
										timestamp: '1603059201',
										type: 'text',
										text: {
											body: 'First message',
										},
									},
								],
							},
							field: 'messages',
						},
					],
				},
				{
					id: '8856996819413534',
					changes: [
						{
							value: {
								messaging_product: 'whatsapp',
								metadata: {
									display_phone_number: '16505553334',
									phone_number_id: '27681414235104945',
								},
								messages: [
									{
										from: '16315551235',
										id: 'wamid.ID2',
										timestamp: '1603059202',
										type: 'text',
										text: {
											body: 'Second message',
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

		expect(result.entry.length).toBe(2)
		expect(result.entry[0].id).toBe('8856996819413533')
		expect(result.entry[1].id).toBe('8856996819413534')
	})
})

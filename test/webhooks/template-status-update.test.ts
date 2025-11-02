import { describe, expect, test } from 'bun:test'
import { MessageTemplateStatusUpdateWebhookSchema } from '../../src/webhooks/templates/template-status-update'

describe('MessageTemplateStatusUpdateWebhook', () => {
	test('should parse valid APPROVED template status webhook', () => {
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

		const result = MessageTemplateStatusUpdateWebhookSchema.parse(payload)

		expect(result.object).toBe('whatsapp_business_account')
		expect(result.entry[0].id).toBe('102290129340398')
		expect(result.entry[0].changes[0].value.event).toBe('APPROVED')
		expect(result.entry[0].changes[0].value.message_template_name).toBe(
			'order_confirmation',
		)
	})

	test('should parse valid REJECTED template status webhook', () => {
		const payload = {
			entry: [
				{
					id: '102290129340398',
					time: 1739321024,
					changes: [
						{
							value: {
								event: 'REJECTED',
								message_template_id: 1689556908129832,
								message_template_name: 'promotional_message',
								message_template_language: 'en-US',
								reason: 'PROMOTIONAL',
							},
							field: 'message_template_status_update',
						},
					],
				},
			],
			object: 'whatsapp_business_account',
		}

		const result = MessageTemplateStatusUpdateWebhookSchema.parse(payload)

		expect(result.entry[0].changes[0].value.event).toBe('REJECTED')
		expect(result.entry[0].changes[0].value.reason).toBe('PROMOTIONAL')
	})

	test('should parse DISABLED template with disable_info', () => {
		const payload = {
			entry: [
				{
					id: '102290129340398',
					time: 1739321024,
					changes: [
						{
							value: {
								event: 'DISABLED',
								message_template_id: 1689556908129832,
								message_template_name: 'test_template',
								message_template_language: 'en-US',
								reason: 'ABUSIVE_CONTENT',
								disable_info: {
									disable_date: 1739400000,
								},
							},
							field: 'message_template_status_update',
						},
					],
				},
			],
			object: 'whatsapp_business_account',
		}

		const result = MessageTemplateStatusUpdateWebhookSchema.parse(payload)

		expect(result.entry[0].changes[0].value.event).toBe('DISABLED')
		expect(result.entry[0].changes[0].value.disable_info?.disable_date).toBe(
			1739400000,
		)
	})

	test('should parse LOCKED template with other_info', () => {
		const payload = {
			entry: [
				{
					id: '102290129340398',
					time: 1739321024,
					changes: [
						{
							value: {
								event: 'LOCKED',
								message_template_id: 1689556908129832,
								message_template_name: 'rate_limited_template',
								message_template_language: 'en-US',
								other_info: {
									title: 'RATE_LIMITING_PAUSE',
									description: 'Template paused due to high block rate',
								},
							},
							field: 'message_template_status_update',
						},
					],
				},
			],
			object: 'whatsapp_business_account',
		}

		const result = MessageTemplateStatusUpdateWebhookSchema.parse(payload)

		expect(result.entry[0].changes[0].value.event).toBe('LOCKED')
		expect(result.entry[0].changes[0].value.other_info?.title).toBe(
			'RATE_LIMITING_PAUSE',
		)
		expect(result.entry[0].changes[0].value.other_info?.description).toBe(
			'Template paused due to high block rate',
		)
	})

	test('should reject invalid event type', () => {
		const payload = {
			entry: [
				{
					id: '102290129340398',
					time: 1739321024,
					changes: [
						{
							value: {
								event: 'INVALID_EVENT',
								message_template_id: 1689556908129832,
								message_template_name: 'test',
								message_template_language: 'en-US',
							},
							field: 'message_template_status_update',
						},
					],
				},
			],
			object: 'whatsapp_business_account',
		}

		expect(() =>
			MessageTemplateStatusUpdateWebhookSchema.parse(payload),
		).toThrow()
	})

	test('should reject invalid field value', () => {
		const payload = {
			entry: [
				{
					id: '102290129340398',
					time: 1739321024,
					changes: [
						{
							value: {
								event: 'APPROVED',
								message_template_id: 1689556908129832,
								message_template_name: 'test',
								message_template_language: 'en-US',
							},
							field: 'messages',
						},
					],
				},
			],
			object: 'whatsapp_business_account',
		}

		expect(() =>
			MessageTemplateStatusUpdateWebhookSchema.parse(payload),
		).toThrow()
	})

	test('should reject missing required fields', () => {
		const payload = {
			entry: [
				{
					id: '102290129340398',
					time: 1739321024,
					changes: [
						{
							value: {
								event: 'APPROVED',
								message_template_id: 1689556908129832,
								// missing message_template_name
								message_template_language: 'en-US',
							},
							field: 'message_template_status_update',
						},
					],
				},
			],
			object: 'whatsapp_business_account',
		}

		expect(() =>
			MessageTemplateStatusUpdateWebhookSchema.parse(payload),
		).toThrow()
	})

	test('should handle all valid status events', () => {
		const events = [
			'APPROVED',
			'ARCHIVED',
			'DELETED',
			'DISABLED',
			'FLAGGED',
			'IN_APPEAL',
			'LIMIT_EXCEEDED',
			'LOCKED',
			'PAUSED',
			'PENDING',
			'REINSTATED',
			'PENDING_DELETION',
			'REJECTED',
		]

		for (const event of events) {
			const payload = {
				entry: [
					{
						id: '102290129340398',
						time: 1739321024,
						changes: [
							{
								value: {
									event,
									message_template_id: 1689556908129832,
									message_template_name: 'test',
									message_template_language: 'en-US',
								},
								field: 'message_template_status_update',
							},
						],
					},
				],
				object: 'whatsapp_business_account',
			}

			const result = MessageTemplateStatusUpdateWebhookSchema.parse(payload)
			expect(result.entry[0].changes[0].value.event).toBe(event)
		}
	})
})

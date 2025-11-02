import { describe, expect, test } from 'bun:test'
import { MessagesWebhookSchema } from '../../src/webhooks/messages'

describe('MessagesWebhook', () => {
	test('should parse valid text message webhook', () => {
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

		const result = MessagesWebhookSchema.parse(payload)

		expect(result.object).toBe('whatsapp_business_account')
		expect(result.entry[0].id).toBe('8856996819413533')
		expect(result.entry[0].changes[0].field).toBe('messages')
		expect(result.entry[0].changes[0].value.messaging_product).toBe('whatsapp')
		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('text')
		expect(result.entry[0].changes[0].value.messages?.[0].text?.body).toBe(
			'Hello this is an answer',
		)
	})

	test('should parse valid image message webhook', () => {
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
											name: 'John Doe',
										},
										wa_id: '16315551234',
									},
								],
								messages: [
									{
										from: '16315551234',
										id: 'wamid.id',
										timestamp: '1603059201',
										type: 'image',
										image: {
											caption: 'This is a caption',
											mime_type: 'image/jpeg',
											sha256:
												'81d3bd8a8db4868c9520ed47186e8b7c5789e61ff79f7f834be6950b808a90d3',
											id: '2754859441498128',
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

		const result = MessagesWebhookSchema.parse(payload)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('image')
		expect(result.entry[0].changes[0].value.messages?.[0].image?.id).toBe(
			'2754859441498128',
		)
		expect(result.entry[0].changes[0].value.messages?.[0].image?.caption).toBe(
			'This is a caption',
		)
	})

	test('should parse valid reaction message webhook', () => {
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
											name: 'Test User',
										},
										wa_id: '16315551234',
									},
								],
								messages: [
									{
										from: 'sender_wa_id',
										id: 'message_id',
										timestamp: 'message_timestamp',
										type: 'reaction',
										reaction: {
											emoji: '👍',
											message_id: 'wamid.original_message',
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

		const result = MessagesWebhookSchema.parse(payload)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('reaction')
		expect(result.entry[0].changes[0].value.messages?.[0].reaction?.emoji).toBe(
			'👍',
		)
		expect(
			result.entry[0].changes[0].value.messages?.[0].reaction?.message_id,
		).toBe('wamid.original_message')
	})

	test('should parse valid status update webhook', () => {
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
								statuses: [
									{
										id: 'wamid.message_id',
										recipient_id: '16315551234',
										status: 'delivered',
										timestamp: '1603059201',
										conversation: {
											id: 'conversation_id',
											expiration_timestamp: '1603145601',
										},
										pricing: {
											pricing_model: 'CBP',
											billable: true,
											category: 'user_initiated',
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

		const result = MessagesWebhookSchema.parse(payload)

		expect(result.entry[0].changes[0].value.statuses?.[0].status).toBe(
			'delivered',
		)
		expect(
			result.entry[0].changes[0].value.statuses?.[0].pricing?.pricing_model,
		).toBe('CBP')
		expect(
			result.entry[0].changes[0].value.statuses?.[0].pricing?.billable,
		).toBe(true)
	})

	test('should parse location message webhook', () => {
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
											name: 'Location Sender',
										},
										wa_id: '16315551234',
									},
								],
								messages: [
									{
										from: '16315551234',
										id: 'wamid.ID',
										timestamp: '1603059201',
										type: 'location',
										location: {
											latitude: '37.7749',
											longitude: '-122.4194',
											name: 'San Francisco',
											address: '123 Main St',
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

		const result = MessagesWebhookSchema.parse(payload)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe('location')
		expect(
			result.entry[0].changes[0].value.messages?.[0].location?.latitude,
		).toBe('37.7749')
		expect(result.entry[0].changes[0].value.messages?.[0].location?.name).toBe(
			'San Francisco',
		)
	})

	test('should parse interactive button reply webhook', () => {
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
											name: 'Interactive User',
										},
										wa_id: '16315551234',
									},
								],
								messages: [
									{
										from: '16315551234',
										id: 'wamid.ID',
										timestamp: '1603059201',
										type: 'interactive',
										interactive: {
											type: 'button_reply',
											button_reply: {
												id: 'button_1',
												title: 'Yes, I confirm',
											},
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

		const result = MessagesWebhookSchema.parse(payload)

		expect(result.entry[0].changes[0].value.messages?.[0].type).toBe(
			'interactive',
		)
		expect(
			result.entry[0].changes[0].value.messages?.[0].interactive?.type,
		).toBe('button_reply')
		expect(
			result.entry[0].changes[0].value.messages?.[0].interactive?.button_reply
				?.title,
		).toBe('Yes, I confirm')
	})

	test('should parse message with context (reply)', () => {
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
											name: 'Reply User',
										},
										wa_id: '16315551234',
									},
								],
								messages: [
									{
										from: '16315551234',
										id: 'wamid.ID',
										timestamp: '1603059201',
										type: 'text',
										text: {
											body: 'This is a reply',
										},
										context: {
											from: '16505553333',
											id: 'wamid.original_message',
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

		const result = MessagesWebhookSchema.parse(payload)

		expect(result.entry[0].changes[0].value.messages?.[0].context?.from).toBe(
			'16505553333',
		)
		expect(result.entry[0].changes[0].value.messages?.[0].context?.id).toBe(
			'wamid.original_message',
		)
	})

	test('should reject invalid field value', () => {
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
							},
							field: 'template_status_update',
						},
					],
				},
			],
		}

		expect(() => MessagesWebhookSchema.parse(payload)).toThrow()
	})

	test('should reject invalid object type', () => {
		const payload = {
			object: 'invalid_object',
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
							},
							field: 'messages',
						},
					],
				},
			],
		}

		expect(() => MessagesWebhookSchema.parse(payload)).toThrow()
	})

	test('should handle all valid message types', () => {
		const types = [
			'text',
			'image',
			'video',
			'audio',
			'document',
			'sticker',
			'location',
			'contacts',
			'interactive',
			'button',
			'reaction',
			'order',
			'system',
			'unknown',
		] as const

		for (const type of types) {
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
												name: 'Test User',
											},
											wa_id: '16315551234',
										},
									],
									messages: [
										{
											from: '16315551234',
											id: 'wamid.ID',
											timestamp: '1603059201',
											type,
										},
									],
								},
								field: 'messages',
							},
						],
					},
				],
			}

			const result = MessagesWebhookSchema.parse(payload)
			expect(result.entry[0].changes[0].value.messages?.[0].type).toBe(type)
		}
	})

	test('should handle all valid status types', () => {
		const statuses = ['read', 'delivered', 'sent', 'failed', 'deleted'] as const

		for (const status of statuses) {
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
									statuses: [
										{
											id: 'wamid.message_id',
											recipient_id: '16315551234',
											status,
											timestamp: '1603059201',
										},
									],
								},
								field: 'messages',
							},
						],
					},
				],
			}

			const result = MessagesWebhookSchema.parse(payload)
			expect(result.entry[0].changes[0].value.statuses?.[0].status).toBe(status)
		}
	})
})

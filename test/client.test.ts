import { describe, expect, test } from 'bun:test'
import { WhatsAppCloudAPI } from '../src/client'
import { WhatsAppApiError } from '../src/client/config'

describe('WhatsAppCloudAPI Client', () => {
	test('should create client with valid config', () => {
		const client = new WhatsAppCloudAPI({
			accessToken: 'test-token',
			phoneNumberId: '123456789',
		})

		expect(client).toBeDefined()
		expect(client.getPhoneNumberId()).toBe('123456789')
		expect(client.getVersion()).toBe('v21.0')
	})

	test('should create client with custom version', () => {
		const client = new WhatsAppCloudAPI({
			accessToken: 'test-token',
			phoneNumberId: '123456789',
			version: 'v20.0',
		})

		expect(client.getVersion()).toBe('v20.0')
	})

	test('should create client with wabaId', () => {
		const client = new WhatsAppCloudAPI({
			accessToken: 'test-token',
			phoneNumberId: '123456789',
			wabaId: 'waba-123',
		})

		expect(client.getWabaId()).toBe('waba-123')
	})

	test('should throw error with invalid config', () => {
		expect(() => {
			new WhatsAppCloudAPI({
				accessToken: '',
				phoneNumberId: '123',
			})
		}).toThrow()
	})

	test('should have messages service', () => {
		const client = new WhatsAppCloudAPI({
			accessToken: 'test-token',
			phoneNumberId: '123456789',
		})

		expect(client.messages).toBeDefined()
		expect(client.messages.sendText).toBeDefined()
		expect(client.messages.sendImage).toBeDefined()
		expect(client.messages.sendVideo).toBeDefined()
	})

	test('should have media service', () => {
		const client = new WhatsAppCloudAPI({
			accessToken: 'test-token',
			phoneNumberId: '123456789',
		})

		expect(client.media).toBeDefined()
		expect(client.media.upload).toBeDefined()
		expect(client.media.getUrl).toBeDefined()
		expect(client.media.delete).toBeDefined()
	})

	test('should have business service', () => {
		const client = new WhatsAppCloudAPI({
			accessToken: 'test-token',
			phoneNumberId: '123456789',
		})

		expect(client.business).toBeDefined()
		expect(client.business.getProfile).toBeDefined()
		expect(client.business.updateProfile).toBeDefined()
	})

	test('should update access token', () => {
		const client = new WhatsAppCloudAPI({
			accessToken: 'old-token',
			phoneNumberId: '123456789',
		})

		client.updateAccessToken('new-token')
		expect(client.config.accessToken).toBe('new-token')
	})
})

describe('WhatsAppApiError', () => {
	test('should create error with all fields', () => {
		const error = new WhatsAppApiError(
			400,
			'Invalid request',
			'OAuthException',
			190,
			'trace-123',
		)

		expect(error).toBeInstanceOf(Error)
		expect(error.name).toBe('WhatsAppApiError')
		expect(error.code).toBe(400)
		expect(error.message).toBe('Invalid request')
		expect(error.type).toBe('OAuthException')
		expect(error.subcode).toBe(190)
		expect(error.fbtraceId).toBe('trace-123')
	})
})

describe('Message Schemas', () => {
	test('should validate text message schema', async () => {
		const { TextMessageSchema } = await import(
			'../src/client/services/messages'
		)

		const message = TextMessageSchema.parse({
			to: '1234567890',
			type: 'text',
			text: {
				body: 'Hello, World!',
			},
		})

		expect(message.messaging_product).toBe('whatsapp')
		expect(message.recipient_type).toBe('individual')
		expect(message.to).toBe('1234567890')
		expect(message.text.body).toBe('Hello, World!')
	})

	test('should validate image message schema', async () => {
		const { ImageMessageSchema } = await import(
			'../src/client/services/messages'
		)

		const message = ImageMessageSchema.parse({
			to: '1234567890',
			type: 'image',
			image: {
				link: 'https://example.com/image.jpg',
				caption: 'Test image',
			},
		})

		expect(message.image.link).toBe('https://example.com/image.jpg')
		expect(message.image.caption).toBe('Test image')
	})

	test('should validate location message schema', async () => {
		const { LocationMessageSchema } = await import(
			'../src/client/services/messages'
		)

		const message = LocationMessageSchema.parse({
			to: '1234567890',
			type: 'location',
			location: {
				latitude: 37.7749,
				longitude: -122.4194,
				name: 'San Francisco',
				address: 'SF, CA',
			},
		})

		expect(message.location.latitude).toBe(37.7749)
		expect(message.location.longitude).toBe(-122.4194)
	})

	test('should validate template message schema', async () => {
		const { TemplateMessageSchema } = await import(
			'../src/client/services/messages'
		)

		const message = TemplateMessageSchema.parse({
			to: '1234567890',
			type: 'template',
			template: {
				name: 'hello_world',
				language: {
					code: 'en_US',
				},
			},
		})

		expect(message.template.name).toBe('hello_world')
		expect(message.template.language.code).toBe('en_US')
	})

	test('should validate interactive button message schema', async () => {
		const { InteractiveButtonMessageSchema } = await import(
			'../src/client/services/messages'
		)

		const message = InteractiveButtonMessageSchema.parse({
			to: '1234567890',
			type: 'interactive',
			interactive: {
				type: 'button',
				body: {
					text: 'Choose an option',
				},
				action: {
					buttons: [
						{
							type: 'reply',
							reply: {
								id: 'btn_1',
								title: 'Option 1',
							},
						},
					],
				},
			},
		})

		expect(message.interactive.type).toBe('button')
		expect(message.interactive.action.buttons).toHaveLength(1)
	})

	test('should validate interactive list message schema', async () => {
		const { InteractiveListMessageSchema } = await import(
			'../src/client/services/messages'
		)

		const message = InteractiveListMessageSchema.parse({
			to: '1234567890',
			type: 'interactive',
			interactive: {
				type: 'list',
				body: {
					text: 'Select an option',
				},
				action: {
					button: 'View Options',
					sections: [
						{
							rows: [
								{
									id: 'row_1',
									title: 'Option 1',
								},
							],
						},
					],
				},
			},
		})

		expect(message.interactive.type).toBe('list')
		expect(message.interactive.action.sections).toHaveLength(1)
	})

	test('should validate interactive CTA URL message schema', async () => {
		const { InteractiveCtaUrlMessageSchema } = await import(
			'../src/client/services/messages'
		)

		const message = InteractiveCtaUrlMessageSchema.parse({
			to: '1234567890',
			type: 'interactive',
			interactive: {
				type: 'cta_url',
				body: {
					text: 'Visit our website for more information!',
				},
				action: {
					name: 'cta_url',
					parameters: {
						display_text: 'Visit Website',
						url: 'https://example.com',
					},
				},
			},
		})

		expect(message.interactive.type).toBe('cta_url')
		expect(message.interactive.action.name).toBe('cta_url')
		expect(message.interactive.action.parameters.display_text).toBe(
			'Visit Website',
		)
		expect(message.interactive.action.parameters.url).toBe(
			'https://example.com',
		)
	})

	test('should validate CTA URL message with header and footer', async () => {
		const { InteractiveCtaUrlMessageSchema } = await import(
			'../src/client/services/messages'
		)

		const message = InteractiveCtaUrlMessageSchema.parse({
			to: '1234567890',
			type: 'interactive',
			interactive: {
				type: 'cta_url',
				header: {
					type: 'text',
					text: 'Special Offer!',
				},
				body: {
					text: 'Check out our amazing deals.',
				},
				footer: {
					text: 'Limited time only',
				},
				action: {
					name: 'cta_url',
					parameters: {
						display_text: 'Shop Now',
						url: 'https://example.com/shop',
					},
				},
			},
		})

		expect(message.interactive.header?.type).toBe('text')
		expect(message.interactive.header?.text).toBe('Special Offer!')
		expect(message.interactive.footer?.text).toBe('Limited time only')
	})

	test('should validate CTA URL message with image header', async () => {
		const { InteractiveCtaUrlMessageSchema } = await import(
			'../src/client/services/messages'
		)

		const message = InteractiveCtaUrlMessageSchema.parse({
			to: '1234567890',
			type: 'interactive',
			interactive: {
				type: 'cta_url',
				header: {
					type: 'image',
					image: {
						link: 'https://example.com/image.jpg',
					},
				},
				body: {
					text: 'New product launched!',
				},
				action: {
					name: 'cta_url',
					parameters: {
						display_text: 'View Product',
						url: 'https://example.com/products/new',
					},
				},
			},
		})

		expect(message.interactive.header?.type).toBe('image')
		expect(message.interactive.header?.image?.link).toBe(
			'https://example.com/image.jpg',
		)
	})
})

describe('Business Profile Schema', () => {
	test('should validate business profile schema', async () => {
		const { BusinessProfileSchema } = await import(
			'../src/client/services/business'
		)

		const profile = BusinessProfileSchema.parse({
			about: 'We are a tech company',
			address: '123 Main St',
			description: 'Building amazing products',
			email: 'contact@example.com',
			messaging_product: 'whatsapp',
			websites: ['https://example.com'],
			vertical: 'PROF_SERVICES',
		})

		expect(profile.about).toBe('We are a tech company')
		expect(profile.vertical).toBe('PROF_SERVICES')
		expect(profile.websites).toHaveLength(1)
	})
})

describe('Media Schemas', () => {
	test('should validate media upload response schema', async () => {
		const { MediaUploadResponseSchema } = await import(
			'../src/client/services/media'
		)

		const response = MediaUploadResponseSchema.parse({
			id: 'media-123',
		})

		expect(response.id).toBe('media-123')
	})

	test('should validate media URL response schema', async () => {
		const { MediaUrlResponseSchema } = await import(
			'../src/client/services/media'
		)

		const response = MediaUrlResponseSchema.parse({
			messaging_product: 'whatsapp',
			url: 'https://example.com/media.jpg',
			mime_type: 'image/jpeg',
			sha256: 'abc123',
			file_size: 1024,
			id: 'media-123',
		})

		expect(response.url).toBe('https://example.com/media.jpg')
		expect(response.mime_type).toBe('image/jpeg')
		expect(response.file_size).toBe(1024)
	})
})

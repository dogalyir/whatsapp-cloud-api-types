/**
 * Complete WhatsApp Cloud API Client Example
 *
 * This example demonstrates all the features of the WhatsApp Cloud API client,
 * including sending messages, managing media, templates, business profile,
 * phone number registration, QR codes, and more.
 */

import { WhatsAppCloudAPI } from '../src/index'

// Initialize the client
const client = new WhatsAppCloudAPI({
	accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
	phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
	wabaId: process.env.WHATSAPP_WABA_ID, // Optional, needed for some endpoints
	version: 'v21.0', // Optional, defaults to v21.0
})

async function demonstrateAllFeatures() {
	const recipientPhone = '1234567890' // Replace with actual phone number

	console.log('=== WhatsApp Cloud API Client Demo ===\n')

	// ============================================================================
	// 1. SENDING MESSAGES
	// ============================================================================
	console.log('1. SENDING MESSAGES')

	// Send text message
	console.log('- Sending text message...')
	const textResponse = await client.messages.sendText(
		recipientPhone,
		'Hello! This is a test message from WhatsApp Cloud API.',
		true, // Enable URL preview
	)
	console.log('  Message ID:', textResponse.messages?.[0]?.id)

	// Send image
	console.log('- Sending image...')
	await client.messages.sendImage(
		recipientPhone,
		{ link: 'https://example.com/image.jpg' },
		'Check out this image!',
	)

	// Send video
	console.log('- Sending video...')
	await client.messages.sendVideo(
		recipientPhone,
		{ link: 'https://example.com/video.mp4' },
		'Watch this video!',
	)

	// Send audio
	console.log('- Sending audio...')
	await client.messages.sendAudio(recipientPhone, {
		link: 'https://example.com/audio.mp3',
	})

	// Send document
	console.log('- Sending document...')
	await client.messages.sendDocument(
		recipientPhone,
		{ link: 'https://example.com/document.pdf' },
		'Here is the document',
		'document.pdf',
	)

	// Send location
	console.log('- Sending location...')
	await client.messages.sendLocation(recipientPhone, {
		latitude: 37.7749,
		longitude: -122.4194,
		name: 'San Francisco',
		address: '1 Market St, San Francisco, CA 94105',
	})

	// Send contacts
	console.log('- Sending contact...')
	await client.messages.sendContacts(recipientPhone, [
		{
			name: {
				formatted_name: 'John Doe',
				first_name: 'John',
				last_name: 'Doe',
			},
			phones: [
				{
					phone: '+1234567890',
					type: 'CELL',
				},
			],
			emails: [
				{
					email: 'john@example.com',
					type: 'WORK',
				},
			],
		},
	])

	// Send interactive buttons
	console.log('- Sending interactive buttons...')
	await client.messages.sendInteractiveButtons(recipientPhone, {
		type: 'button',
		body: {
			text: 'Please select an option:',
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
				{
					type: 'reply',
					reply: {
						id: 'btn_2',
						title: 'Option 2',
					},
				},
			],
		},
	})

	// Send interactive list
	console.log('- Sending interactive list...')
	await client.messages.sendInteractiveList(recipientPhone, {
		type: 'list',
		body: {
			text: 'Choose from our menu:',
		},
		action: {
			button: 'View Menu',
			sections: [
				{
					title: 'Main Dishes',
					rows: [
						{
							id: 'dish_1',
							title: 'Pizza',
							description: 'Delicious pizza',
						},
						{
							id: 'dish_2',
							title: 'Pasta',
							description: 'Fresh pasta',
						},
					],
				},
			],
		},
	})

	// Send interactive CTA URL button
	console.log('- Sending CTA URL button...')
	await client.messages.sendCtaUrl(recipientPhone, {
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
	})

	// Send CTA URL with header
	console.log('- Sending CTA URL with header...')
	await client.messages.sendCtaUrl(recipientPhone, {
		type: 'cta_url',
		header: {
			type: 'text',
			text: 'Special Offer!',
		},
		body: {
			text: 'Check out our amazing deals and discounts.',
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
	})

	// Send reaction
	console.log('- Sending reaction...')
	const messageId = textResponse.messages?.[0]?.id
	if (messageId) {
		await client.messages.sendReaction(recipientPhone, messageId, '👍')
	}

	// Send template message
	console.log('- Sending template message...')
	await client.messages.sendTemplate(recipientPhone, {
		name: 'hello_world',
		language: {
			code: 'en_US',
		},
		components: [
			{
				type: 'body',
				parameters: [
					{
						type: 'text',
						text: 'World',
					},
				],
			},
		],
	})

	// ============================================================================
	// 2. CHAT ACTIONS
	// ============================================================================
	console.log('\n2. CHAT ACTIONS')

	// Send typing indicator
	console.log('- Sending typing indicator...')
	await client.actions.typing(recipientPhone)

	// Typing then send
	console.log('- Typing then sending message...')
	await client.actions.typingThenSend(
		recipientPhone,
		'This message was sent after a typing indicator',
		2000,
	)

	// Mark message as read
	if (messageId) {
		console.log('- Marking message as read...')
		await client.actions.markAsRead(messageId)
	}

	// ============================================================================
	// 3. MEDIA MANAGEMENT
	// ============================================================================
	console.log('\n3. MEDIA MANAGEMENT')

	// Upload media from URL
	console.log('- Uploading media from URL...')
	const uploadedMedia = await client.media.uploadFromUrl(
		'https://example.com/test-image.jpg',
		'image/jpeg',
		'test-image.jpg',
	)
	console.log('  Media ID:', uploadedMedia.id)

	// Get media URL
	console.log('- Getting media URL...')
	const mediaUrl = await client.media.getUrl(uploadedMedia.id)
	console.log('  URL:', mediaUrl.url)
	console.log('  MIME Type:', mediaUrl.mime_type)
	console.log('  File Size:', mediaUrl.file_size)

	// Download media
	console.log('- Downloading media...')
	const mediaContent = await client.media.download(mediaUrl.url)
	console.log('  Downloaded:', mediaContent.byteLength, 'bytes')

	// Delete media (optional)
	// await client.media.delete(uploadedMedia.id)

	// ============================================================================
	// 4. BUSINESS PROFILE
	// ============================================================================
	console.log('\n4. BUSINESS PROFILE')

	// Get business profile
	console.log('- Getting business profile...')
	const profile = await client.business.getProfile()
	console.log('  About:', profile.data[0]?.about)
	console.log('  Address:', profile.data[0]?.address)
	console.log('  Email:', profile.data[0]?.email)

	// Update business profile
	console.log('- Updating business profile...')
	await client.business.updateProfile({
		about: 'We provide excellent customer service!',
		address: '123 Main St, San Francisco, CA',
		description: 'Your trusted business partner',
		email: 'contact@example.com',
		websites: ['https://example.com'],
		vertical: 'RETAIL',
	})

	// Get commerce settings (requires wabaId)
	if (client.config.wabaId) {
		console.log('- Getting commerce settings...')
		const commerceSettings = await client.business.getCommerceSettings()
		console.log(
			'  Catalog visible:',
			commerceSettings.data[0]?.is_catalog_visible,
		)
		console.log('  Cart enabled:', commerceSettings.data[0]?.is_cart_enabled)
	}

	// ============================================================================
	// 5. TEMPLATES
	// ============================================================================
	console.log('\n5. TEMPLATES')

	if (client.config.wabaId) {
		// List all templates
		console.log('- Listing templates...')
		const templates = await client.templates.list({ limit: 10 })
		console.log('  Total templates:', templates.data.length)
		templates.data.forEach((template) => {
			console.log(`  - ${template.name} (${template.status})`)
		})

		// Get templates by status
		console.log('- Getting approved templates...')
		const approvedTemplates = await client.templates.getByStatus('APPROVED')
		console.log('  Approved templates:', approvedTemplates.data.length)

		// Create a new template
		console.log('- Creating template...')
		try {
			const newTemplate = await client.templates.create({
				name: 'sample_template',
				language: 'en_US',
				category: 'UTILITY',
				components: [
					{
						type: 'BODY',
						text: 'Hello {{1}}, your order {{2}} is ready!',
					},
					{
						type: 'FOOTER',
						text: 'Thank you for your business',
					},
				],
			})
			console.log('  Created template ID:', newTemplate.id)
		} catch (_error) {
			console.log('  Template creation skipped (may already exist)')
		}
	}

	// ============================================================================
	// 6. PHONE NUMBER REGISTRATION
	// ============================================================================
	console.log('\n6. PHONE NUMBER REGISTRATION')

	// Get phone number info
	console.log('- Getting phone number info...')
	const phoneInfo = await client.registration.getInfo()
	console.log('  Verified name:', phoneInfo.verified_name)
	console.log('  Display number:', phoneInfo.display_phone_number)
	console.log('  Quality rating:', phoneInfo.quality_rating)
	console.log('  Status:', phoneInfo.status)
	console.log('  Account mode:', phoneInfo.account_mode)

	// Request verification code (use with caution in production)
	// console.log('- Requesting verification code...')
	// await client.registration.requestCode('SMS')

	// Verify code
	// await client.registration.verifyCode('123456')

	// ============================================================================
	// 7. QR CODES
	// ============================================================================
	console.log('\n7. QR CODES')

	// Create QR code
	console.log('- Creating QR code...')
	const qrCode = await client.qrCodes.create({
		prefilled_message: 'Hello! I scanned your QR code.',
		generate_qr_image: 'PNG',
	})
	console.log('  QR Code:', qrCode.code)
	console.log('  Deep link:', qrCode.deep_link_url)

	// List QR codes
	console.log('- Listing QR codes...')
	const qrCodes = await client.qrCodes.list()
	console.log('  Total QR codes:', qrCodes.data.length)

	// ============================================================================
	// 8. TWO-STEP VERIFICATION
	// ============================================================================
	console.log('\n8. TWO-STEP VERIFICATION')

	// Set 2FA PIN (use with caution)
	// await client.twoStepVerification.setPin('123456')

	// ============================================================================
	// 9. WABA MANAGEMENT
	// ============================================================================
	console.log('\n9. WABA MANAGEMENT')

	if (client.config.wabaId) {
		// Get WABA info
		console.log('- Getting WABA info...')
		const waba = await client.waba.get(client.config.wabaId)
		console.log('  WABA ID:', waba.id)
		console.log('  Name:', waba.name)

		// Get owned WABAs
		console.log('- Getting owned WABAs...')
		const ownedWabas = await client.waba.getOwned()
		console.log('  Owned WABAs:', ownedWabas.data.length)

		// List phone numbers in WABA
		console.log('- Listing phone numbers in WABA...')
		const phoneNumbers = await client.phoneNumbers.list(client.config.wabaId)
		console.log('  Phone numbers:', phoneNumbers.data.length)
		phoneNumbers.data.forEach((phone) => {
			console.log(`  - ${phone.display_phone_number} (${phone.verified_name})`)
		})
	}

	// ============================================================================
	// 10. PHONE NUMBERS
	// ============================================================================
	console.log('\n10. PHONE NUMBERS')

	// Get specific phone number
	console.log('- Getting phone number details...')
	const phoneNumber = await client.phoneNumbers.get(client.config.phoneNumberId)
	console.log('  Display number:', phoneNumber.display_phone_number)
	console.log('  Verified name:', phoneNumber.verified_name)
	console.log('  Quality rating:', phoneNumber.quality_rating)

	// Check if verified
	console.log('- Checking verification status...')
	const isVerified = await client.phoneNumbers.isVerified(
		client.config.phoneNumberId,
	)
	console.log('  Is verified:', isVerified)

	// Get quality rating
	console.log('- Getting quality rating...')
	const qualityRating = await client.phoneNumbers.getQualityRating(
		client.config.phoneNumberId,
	)
	console.log('  Quality rating:', qualityRating)

	// ============================================================================
	// 11. WEBHOOKS
	// ============================================================================
	console.log('\n11. WEBHOOKS')

	if (client.config.wabaId) {
		// Get current subscriptions
		console.log('- Getting webhook subscriptions...')
		const subscriptions = await client.webhooks.getSubscriptions(
			client.config.wabaId,
		)
		console.log(
			'  Subscribed fields:',
			subscriptions.data?.[0]?.subscribed_fields,
		)

		// Subscribe to webhook fields
		console.log('- Subscribing to webhook fields...')
		await client.webhooks.subscribe(client.config.wabaId, {
			override: false,
			fields: ['messages', 'message_template_status_update'],
		})
		console.log('  Subscription updated')
	}

	console.log('\n=== Demo Complete ===')
}

// Run the demo
demonstrateAllFeatures()
	.then(() => {
		console.log('\n✅ All operations completed successfully!')
		process.exit(0)
	})
	.catch((error) => {
		console.error('\n❌ Error:', error)
		process.exit(1)
	})

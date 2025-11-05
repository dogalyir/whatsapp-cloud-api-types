/**
 * CTA URL (Call-to-Action) Message Examples
 *
 * This example demonstrates how to send interactive CTA URL buttons
 * using the WhatsApp Cloud API client.
 *
 * CTA URL buttons allow you to send a message with a button that opens
 * a URL when clicked by the user.
 */

import { WhatsAppCloudAPI } from '../src/index'

// Initialize the client
const client = new WhatsAppCloudAPI({
	accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
	phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
	version: 'v21.0',
})

async function sendCtaUrlExamples() {
	const recipientPhone = '1234567890' // Replace with actual phone number

	console.log('=== CTA URL Message Examples ===\n')

	// ============================================================================
	// 1. SIMPLE CTA URL (BODY + BUTTON ONLY)
	// ============================================================================
	console.log('1. Simple CTA URL (body + button only)')
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
	console.log('✓ Sent simple CTA URL\n')

	// ============================================================================
	// 2. CTA URL WITH TEXT HEADER
	// ============================================================================
	console.log('2. CTA URL with text header')
	await client.messages.sendCtaUrl(recipientPhone, {
		type: 'cta_url',
		header: {
			type: 'text',
			text: 'Special Offer!',
		},
		body: {
			text: 'Check out our amazing deals and discounts.',
		},
		action: {
			name: 'cta_url',
			parameters: {
				display_text: 'Shop Now',
				url: 'https://example.com/shop',
			},
		},
	})
	console.log('✓ Sent CTA URL with text header\n')

	// ============================================================================
	// 3. CTA URL WITH IMAGE HEADER
	// ============================================================================
	console.log('3. CTA URL with image header')
	await client.messages.sendCtaUrl(recipientPhone, {
		type: 'cta_url',
		header: {
			type: 'image',
			image: {
				link: 'https://example.com/product-image.jpg',
			},
		},
		body: {
			text: 'New product launched! Click to see details.',
		},
		action: {
			name: 'cta_url',
			parameters: {
				display_text: 'View Product',
				url: 'https://example.com/products/new',
			},
		},
	})
	console.log('✓ Sent CTA URL with image header\n')

	// ============================================================================
	// 4. CTA URL WITH VIDEO HEADER
	// ============================================================================
	console.log('4. CTA URL with video header')
	await client.messages.sendCtaUrl(recipientPhone, {
		type: 'cta_url',
		header: {
			type: 'video',
			video: {
				link: 'https://example.com/promo-video.mp4',
			},
		},
		body: {
			text: 'Watch our promotional video and learn more!',
		},
		action: {
			name: 'cta_url',
			parameters: {
				display_text: 'Learn More',
				url: 'https://example.com/promo',
			},
		},
	})
	console.log('✓ Sent CTA URL with video header\n')

	// ============================================================================
	// 5. CTA URL WITH DOCUMENT HEADER
	// ============================================================================
	console.log('5. CTA URL with document header')
	await client.messages.sendCtaUrl(recipientPhone, {
		type: 'cta_url',
		header: {
			type: 'document',
			document: {
				link: 'https://example.com/brochure.pdf',
			},
		},
		body: {
			text: 'Download our brochure and visit our website.',
		},
		action: {
			name: 'cta_url',
			parameters: {
				display_text: 'Visit Site',
				url: 'https://example.com',
			},
		},
	})
	console.log('✓ Sent CTA URL with document header\n')

	// ============================================================================
	// 6. CTA URL WITH FOOTER
	// ============================================================================
	console.log('6. CTA URL with footer')
	await client.messages.sendCtaUrl(recipientPhone, {
		type: 'cta_url',
		body: {
			text: 'Limited time offer! Get 50% off on all products.',
		},
		footer: {
			text: 'Offer valid until Dec 31, 2024',
		},
		action: {
			name: 'cta_url',
			parameters: {
				display_text: 'Shop Now',
				url: 'https://example.com/sale',
			},
		},
	})
	console.log('✓ Sent CTA URL with footer\n')

	// ============================================================================
	// 7. COMPLETE CTA URL (HEADER + BODY + FOOTER + BUTTON)
	// ============================================================================
	console.log('7. Complete CTA URL (all components)')
	await client.messages.sendCtaUrl(recipientPhone, {
		type: 'cta_url',
		header: {
			type: 'image',
			image: {
				link: 'https://example.com/event-banner.jpg',
			},
		},
		body: {
			text: 'Join us for our annual conference! Register now to secure your spot.',
		},
		footer: {
			text: 'Limited seats available',
		},
		action: {
			name: 'cta_url',
			parameters: {
				display_text: 'Register Now',
				url: 'https://example.com/register',
			},
		},
	})
	console.log('✓ Sent complete CTA URL message\n')

	// ============================================================================
	// 8. CTA URL USING MEDIA ID (instead of URL)
	// ============================================================================
	console.log('8. CTA URL with media ID')

	// First, upload an image to get its media ID
	const uploadedMedia = await client.media.uploadFromUrl(
		'https://example.com/promotional-image.jpg',
		'image/jpeg',
		'promo.jpg',
	)
	console.log('  Uploaded media ID:', uploadedMedia.id)

	// Now send CTA URL using the media ID
	await client.messages.sendCtaUrl(recipientPhone, {
		type: 'cta_url',
		header: {
			type: 'image',
			image: {
				id: uploadedMedia.id, // Use media ID instead of link
			},
		},
		body: {
			text: 'Exclusive offer just for you!',
		},
		action: {
			name: 'cta_url',
			parameters: {
				display_text: 'Get Offer',
				url: 'https://example.com/exclusive',
			},
		},
	})
	console.log('✓ Sent CTA URL with media ID\n')

	console.log('=== All Examples Complete ===')
}

// Run the examples
sendCtaUrlExamples()
	.then(() => {
		console.log('\n✅ All CTA URL examples sent successfully!')
		process.exit(0)
	})
	.catch((error) => {
		console.error('\n❌ Error:', error)
		process.exit(1)
	})

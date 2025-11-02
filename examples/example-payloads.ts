/**
 * Example webhook payloads from WhatsApp Cloud API
 *
 * These are real-world examples that can be used for testing
 * and understanding the webhook structure.
 */

// Example 1: Text message webhook
export const textMessageWebhook = {
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

// Example 2: Image message webhook
export const imageMessageWebhook = {
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

// Example 3: Message status update webhook
export const messageStatusWebhook = {
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
									id: 'conversation_id_123',
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

// Example 4: Interactive button reply webhook
export const buttonReplyWebhook = {
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
										id: 'confirm_order',
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

// Example 5: Template status update - APPROVED
export const templateApprovedWebhook = {
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

// Example 6: Template status update - REJECTED
export const templateRejectedWebhook = {
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

// Example 7: Template status update - DISABLED
export const templateDisabledWebhook = {
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

// Example 8: Template quality update
export const templateQualityUpdateWebhook = {
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

// Example 9: Template components update
export const templateComponentsUpdateWebhook = {
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
							'Thank you for your order, {{1}}! Your order number is {{2}}. If you have any questions, contact support using the buttons below. Thanks again!',
						message_template_footer: 'Lucky Shrub: the Succulent Specialists!',
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

// Example 10: Template category update - Impending change
export const templateCategoryImpendingWebhook = {
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

// Example 11: Template category update - Completed change
export const templateCategoryCompletedWebhook = {
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

// Example 12: Reaction message webhook
export const reactionMessageWebhook = {
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

// Example 13: Location message webhook
export const locationMessageWebhook = {
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
									address: '123 Main St, San Francisco, CA',
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

// Example 14: Message with context (reply)
export const replyMessageWebhook = {
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
									body: 'This is a reply to your message',
								},
								context: {
									from: '16505553333',
									id: 'wamid.original_message_id',
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

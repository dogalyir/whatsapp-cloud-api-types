import { z } from 'zod'
import type { ApiResponse } from '../config'
import { BaseService } from '../config'

/**
 * Text message schema
 */
export const TextMessageSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	type: z.literal('text'),
	text: z.object({
		preview_url: z.boolean().optional(),
		body: z.string().max(4096),
	}),
})

export type TextMessage = z.infer<typeof TextMessageSchema>

/**
 * Image message schema
 */
export const ImageMessageSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	type: z.literal('image'),
	image: z.object({
		id: z.string().optional(),
		link: z.string().url().optional(),
		caption: z.string().max(1024).optional(),
	}),
})

export type ImageMessage = z.infer<typeof ImageMessageSchema>

/**
 * Audio message schema
 */
export const AudioMessageSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	type: z.literal('audio'),
	audio: z.object({
		id: z.string().optional(),
		link: z.string().url().optional(),
	}),
})

export type AudioMessage = z.infer<typeof AudioMessageSchema>

/**
 * Video message schema
 */
export const VideoMessageSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	type: z.literal('video'),
	video: z.object({
		id: z.string().optional(),
		link: z.string().url().optional(),
		caption: z.string().max(1024).optional(),
	}),
})

export type VideoMessage = z.infer<typeof VideoMessageSchema>

/**
 * Document message schema
 */
export const DocumentMessageSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	type: z.literal('document'),
	document: z.object({
		id: z.string().optional(),
		link: z.string().url().optional(),
		caption: z.string().max(1024).optional(),
		filename: z.string().optional(),
	}),
})

export type DocumentMessage = z.infer<typeof DocumentMessageSchema>

/**
 * Sticker message schema
 */
export const StickerMessageSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	type: z.literal('sticker'),
	sticker: z.object({
		id: z.string().optional(),
		link: z.string().url().optional(),
	}),
})

export type StickerMessage = z.infer<typeof StickerMessageSchema>

/**
 * Location message schema
 */
export const LocationMessageSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	type: z.literal('location'),
	location: z.object({
		longitude: z.number(),
		latitude: z.number(),
		name: z.string().optional(),
		address: z.string().optional(),
	}),
})

export type LocationMessage = z.infer<typeof LocationMessageSchema>

/**
 * Contact message schema
 */
export const ContactMessageSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	type: z.literal('contacts'),
	contacts: z.array(
		z.object({
			addresses: z
				.array(
					z.object({
						street: z.string().optional(),
						city: z.string().optional(),
						state: z.string().optional(),
						zip: z.string().optional(),
						country: z.string().optional(),
						country_code: z.string().optional(),
						type: z.enum(['HOME', 'WORK']).optional(),
					}),
				)
				.optional(),
			birthday: z.string().optional(),
			emails: z
				.array(
					z.object({
						email: z.string().email().optional(),
						type: z.enum(['HOME', 'WORK']).optional(),
					}),
				)
				.optional(),
			name: z.object({
				formatted_name: z.string(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				middle_name: z.string().optional(),
				suffix: z.string().optional(),
				prefix: z.string().optional(),
			}),
			org: z
				.object({
					company: z.string().optional(),
					department: z.string().optional(),
					title: z.string().optional(),
				})
				.optional(),
			phones: z
				.array(
					z.object({
						phone: z.string().optional(),
						wa_id: z.string().optional(),
						type: z.enum(['CELL', 'MAIN', 'IPHONE', 'HOME', 'WORK']).optional(),
					}),
				)
				.optional(),
			urls: z
				.array(
					z.object({
						url: z.string().url().optional(),
						type: z.enum(['HOME', 'WORK']).optional(),
					}),
				)
				.optional(),
		}),
	),
})

export type ContactMessage = z.infer<typeof ContactMessageSchema>

/**
 * Template message schema
 */
export const TemplateMessageSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	type: z.literal('template'),
	template: z.object({
		name: z.string(),
		language: z.object({
			code: z.string(),
		}),
		components: z
			.array(
				z.object({
					type: z.enum(['header', 'body', 'button']),
					parameters: z.array(
						z.object({
							type: z.enum([
								'text',
								'currency',
								'date_time',
								'image',
								'document',
								'video',
							]),
							text: z.string().optional(),
							currency: z
								.object({
									fallback_value: z.string(),
									code: z.string(),
									amount_1000: z.number(),
								})
								.optional(),
							date_time: z
								.object({
									fallback_value: z.string(),
								})
								.optional(),
							image: z
								.object({
									id: z.string().optional(),
									link: z.string().url().optional(),
								})
								.optional(),
							document: z
								.object({
									id: z.string().optional(),
									link: z.string().url().optional(),
									filename: z.string().optional(),
								})
								.optional(),
							video: z
								.object({
									id: z.string().optional(),
									link: z.string().url().optional(),
								})
								.optional(),
						}),
					),
					sub_type: z.enum(['quick_reply', 'url']).optional(),
					index: z.number().optional(),
				}),
			)
			.optional(),
	}),
})

export type TemplateMessage = z.infer<typeof TemplateMessageSchema>

/**
 * Interactive button message schema
 */
export const InteractiveButtonMessageSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	type: z.literal('interactive'),
	interactive: z.object({
		type: z.literal('button'),
		header: z
			.object({
				type: z.enum(['text', 'image', 'video', 'document']),
				text: z.string().max(60).optional(),
				image: z
					.object({
						id: z.string().optional(),
						link: z.string().url().optional(),
					})
					.optional(),
				video: z
					.object({
						id: z.string().optional(),
						link: z.string().url().optional(),
					})
					.optional(),
				document: z
					.object({
						id: z.string().optional(),
						link: z.string().url().optional(),
						filename: z.string().optional(),
					})
					.optional(),
			})
			.optional(),
		body: z.object({
			text: z.string().max(1024),
		}),
		footer: z
			.object({
				text: z.string().max(60),
			})
			.optional(),
		action: z.object({
			buttons: z
				.array(
					z.object({
						type: z.literal('reply'),
						reply: z.object({
							id: z.string().max(256),
							title: z.string().max(20),
						}),
					}),
				)
				.max(3),
		}),
	}),
})

export type InteractiveButtonMessage = z.infer<
	typeof InteractiveButtonMessageSchema
>

/**
 * Interactive list message schema
 */
export const InteractiveListMessageSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	type: z.literal('interactive'),
	interactive: z.object({
		type: z.literal('list'),
		header: z
			.object({
				type: z.literal('text'),
				text: z.string().max(60),
			})
			.optional(),
		body: z.object({
			text: z.string().max(1024),
		}),
		footer: z
			.object({
				text: z.string().max(60),
			})
			.optional(),
		action: z.object({
			button: z.string().max(20),
			sections: z
				.array(
					z.object({
						title: z.string().max(24).optional(),
						rows: z
							.array(
								z.object({
									id: z.string().max(200),
									title: z.string().max(24),
									description: z.string().max(72).optional(),
								}),
							)
							.max(10),
					}),
				)
				.max(10),
		}),
	}),
})

export type InteractiveListMessage = z.infer<
	typeof InteractiveListMessageSchema
>

/**
 * Interactive CTA URL message schema
 */
export const InteractiveCtaUrlMessageSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	type: z.literal('interactive'),
	interactive: z.object({
		type: z.literal('cta_url'),
		header: z
			.object({
				type: z.enum(['text', 'image', 'video', 'document']),
				text: z.string().max(60).optional(),
				image: z
					.object({
						id: z.string().optional(),
						link: z.string().url().optional(),
					})
					.optional(),
				video: z
					.object({
						id: z.string().optional(),
						link: z.string().url().optional(),
					})
					.optional(),
				document: z
					.object({
						id: z.string().optional(),
						link: z.string().url().optional(),
					})
					.optional(),
			})
			.optional(),
		body: z.object({
			text: z.string().max(1024),
		}),
		footer: z
			.object({
				text: z.string().max(60),
			})
			.optional(),
		action: z.object({
			name: z.literal('cta_url'),
			parameters: z.object({
				display_text: z.string().max(20),
				url: z.string().url(),
			}),
		}),
	}),
})

export type InteractiveCtaUrlMessage = z.infer<
	typeof InteractiveCtaUrlMessageSchema
>

/**
 * Reaction message schema
 */
export const ReactionMessageSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	type: z.literal('reaction'),
	reaction: z.object({
		message_id: z.string(),
		emoji: z.string(),
	}),
})

export type ReactionMessage = z.infer<typeof ReactionMessageSchema>

/**
 * Context for reply messages
 */
export const MessageContextSchema = z.object({
	message_id: z.string(),
})

export type MessageContext = z.infer<typeof MessageContextSchema>

/**
 * Messages Service
 * Handles all message-related API calls
 */
export class MessagesService extends BaseService {
	/**
	 * Send a text message
	 */
	async sendText(
		to: string,
		text: string,
		previewUrl = false,
	): Promise<ApiResponse> {
		const payload = TextMessageSchema.parse({
			to,
			type: 'text',
			text: {
				body: text,
				preview_url: previewUrl,
			},
		})

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}

	/**
	 * Send an image message
	 */
	async sendImage(
		to: string,
		image: { id?: string; link?: string },
		caption?: string,
	): Promise<ApiResponse> {
		const payload = ImageMessageSchema.parse({
			to,
			type: 'image',
			image: {
				...image,
				caption,
			},
		})

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}

	/**
	 * Send an audio message
	 */
	async sendAudio(
		to: string,
		audio: { id?: string; link?: string },
	): Promise<ApiResponse> {
		const payload = AudioMessageSchema.parse({
			to,
			type: 'audio',
			audio,
		})

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}

	/**
	 * Send a video message
	 */
	async sendVideo(
		to: string,
		video: { id?: string; link?: string },
		caption?: string,
	): Promise<ApiResponse> {
		const payload = VideoMessageSchema.parse({
			to,
			type: 'video',
			video: {
				...video,
				caption,
			},
		})

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}

	/**
	 * Send a document message
	 */
	async sendDocument(
		to: string,
		document: { id?: string; link?: string },
		caption?: string,
		filename?: string,
	): Promise<ApiResponse> {
		const payload = DocumentMessageSchema.parse({
			to,
			type: 'document',
			document: {
				...document,
				caption,
				filename,
			},
		})

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}

	/**
	 * Send a sticker message
	 */
	async sendSticker(
		to: string,
		sticker: { id?: string; link?: string },
	): Promise<ApiResponse> {
		const payload = StickerMessageSchema.parse({
			to,
			type: 'sticker',
			sticker,
		})

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}

	/**
	 * Send a location message
	 */
	async sendLocation(
		to: string,
		location: {
			longitude: number
			latitude: number
			name?: string
			address?: string
		},
	): Promise<ApiResponse> {
		const payload = LocationMessageSchema.parse({
			to,
			type: 'location',
			location,
		})

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}

	/**
	 * Send a contacts message
	 */
	async sendContacts(
		to: string,
		contacts: z.infer<typeof ContactMessageSchema>['contacts'],
	): Promise<ApiResponse> {
		const payload = ContactMessageSchema.parse({
			to,
			type: 'contacts',
			contacts,
		})

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}

	/**
	 * Send a template message
	 */
	async sendTemplate(
		to: string,
		template: z.infer<typeof TemplateMessageSchema>['template'],
	): Promise<ApiResponse> {
		const payload = TemplateMessageSchema.parse({
			to,
			type: 'template',
			template,
		})

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}

	/**
	 * Send an interactive button message
	 */
	async sendInteractiveButtons(
		to: string,
		interactive: z.infer<typeof InteractiveButtonMessageSchema>['interactive'],
	): Promise<ApiResponse> {
		const payload = InteractiveButtonMessageSchema.parse({
			to,
			type: 'interactive',
			interactive,
		})

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}

	/**
	 * Send an interactive list message
	 */
	async sendInteractiveList(
		to: string,
		interactive: z.infer<typeof InteractiveListMessageSchema>['interactive'],
	): Promise<ApiResponse> {
		const payload = InteractiveListMessageSchema.parse({
			to,
			type: 'interactive',
			interactive,
		})

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}

	/**
	 * Send a reaction to a message
	 */
	async sendReaction(
		to: string,
		messageId: string,
		emoji: string,
	): Promise<ApiResponse> {
		const payload = ReactionMessageSchema.parse({
			to,
			type: 'reaction',
			reaction: {
				message_id: messageId,
				emoji,
			},
		})

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}

	/**
	 * Remove a reaction from a message
	 */
	async removeReaction(to: string, messageId: string): Promise<ApiResponse> {
		return this.sendReaction(to, messageId, '')
	}

	/**
	 * Send an interactive CTA URL message (call-to-action)
	 */
	async sendCtaUrl(
		to: string,
		interactive: z.infer<typeof InteractiveCtaUrlMessageSchema>['interactive'],
	): Promise<ApiResponse> {
		const payload = InteractiveCtaUrlMessageSchema.parse({
			to,
			type: 'interactive',
			interactive,
		})

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}

	/**
	 * Mark a message as read
	 */
	async markAsRead(messageId: string): Promise<ApiResponse> {
		const payload = {
			messaging_product: 'whatsapp',
			status: 'read',
			message_id: messageId,
		}

		return this.request<ApiResponse>(`${this.config.phoneNumberId}/messages`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	}
}

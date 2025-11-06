import { z } from 'zod'
import { type ApiResponse, BaseService } from '../config'
import { MessagesService } from './messages'

/**
 * Chat action schema
 */
export const ChatActionSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual'),
	to: z.string(),
	action: z.enum(['mark_as_read', 'typing']),
})

export type ChatAction = z.infer<typeof ChatActionSchema>

/**
 * Chat action response schema
 */
export const ChatActionResponseSchema = z.object({
	success: z.boolean(),
})

export type ChatActionResponse = z.infer<typeof ChatActionResponseSchema>

/**
 * Mark as read schema
 */
export const MarkAsReadSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	status: z.literal('read'),
	message_id: z.string(),
})

export type MarkAsRead = z.infer<typeof MarkAsReadSchema>

/**
 * Typing indicator schema
 */
export const TypingIndicatorSchema = z.object({
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	status: z.literal('read'),
	message_id: z.string(),
	typing_indicator: z.object({
		type: z.literal('text'),
	}),
})

export type TypingIndicator = z.infer<typeof TypingIndicatorSchema>

/**
 * Actions Service
 *
 * Service for managing chat actions like typing indicators and read receipts.
 * These actions provide real-time feedback to users during conversations.
 *
 * @example
 * ```typescript
 * // Show typing indicator
 * await client.actions.typing('1234567890')
 *
 * // Mark message as read
 * await client.actions.markAsRead('message-id')
 * ```
 */
export class ActionsService extends BaseService {
	/**
	 * Send a typing indicator to a recipient
	 * The typing indicator will be displayed for approximately 10 seconds
	 * or until a message is sent to the recipient.
	 *
	 * @param to - Recipient phone number (with country code, no + sign)
	 * @returns Action response
	 *
	 * @example
	 * ```typescript
	 * // Show typing indicator
	 * await client.actions.typing('1234567890')
	 *
	 * // Simulate typing, then send message
	 * await client.actions.typing('1234567890')
	 * await new Promise(resolve => setTimeout(resolve, 2000))
	 * await client.messages.sendText('1234567890', 'Hello!')
	 * ```
	 */
	async typing(to: string): Promise<ChatActionResponse> {
		const payload = ChatActionSchema.parse({
			messaging_product: 'whatsapp',
			recipient_type: 'individual',
			to,
			action: 'typing',
		})

		const response = await this.request<ChatActionResponse>(
			`${this.config.phoneNumberId}/messages`,
			{
				method: 'POST',
				body: JSON.stringify(payload),
			},
		)

		return ChatActionResponseSchema.parse(response)
	}

	/**
	 * Mark a message as read
	 * This sends a read receipt to the sender.
	 *
	 * @param messageId - Message ID to mark as read
	 * @returns Action response
	 *
	 * @example
	 * ```typescript
	 * // Mark a received message as read
	 * await client.actions.markAsRead('wamid.xxx')
	 * ```
	 */
	async markAsRead(messageId: string): Promise<ChatActionResponse> {
		const payload = MarkAsReadSchema.parse({
			messaging_product: 'whatsapp',
			status: 'read',
			message_id: messageId,
		})

		const response = await this.request<ChatActionResponse>(
			`${this.config.phoneNumberId}/messages`,
			{
				method: 'POST',
				body: JSON.stringify(payload),
			},
		)

		return ChatActionResponseSchema.parse(response)
	}

	/**
	 * Send a typing indicator for a specific message
	 * This combines marking a message as read with sending a typing indicator.
	 *
	 * @param messageId - Message ID to mark as read with typing indicator
	 * @returns Action response
	 *
	 * @example
	 * ```typescript
	 * // Mark message as read and show typing indicator
	 * await client.actions.typingIndicator('wamid.xxx')
	 * ```
	 */
	async typingIndicator(messageId: string): Promise<ChatActionResponse> {
		const payload = TypingIndicatorSchema.parse({
			messaging_product: 'whatsapp',
			status: 'read',
			message_id: messageId,
			typing_indicator: { type: 'text' },
		})

		const response = await this.request<ChatActionResponse>(
			`${this.config.phoneNumberId}/messages`,
			{
				method: 'POST',
				body: JSON.stringify(payload),
			},
		)

		return ChatActionResponseSchema.parse(response)
	}

	/**
	 * Send typing indicator and automatically send a message after a delay
	 * This is a convenience method that combines typing indicator with message sending.
	 *
	 * @param to - Recipient phone number
	 * @param message - Message to send after typing delay
	 * @param delayMs - Delay in milliseconds (default: 2000ms)
	 * @returns Message send response
	 *
	 * @example
	 * ```typescript
	 * // Show typing for 3 seconds, then send message
	 * await client.actions.typingThenSend(
	 *   '1234567890',
	 *   'Hello! How can I help you?',
	 *   3000
	 * )
	 * ```
	 */
	async typingThenSend(
		to: string,
		message: string,
		delayMs = 2000,
	): Promise<ApiResponse> {
		// Create messages service instance
		const messagesService = new MessagesService(this.config)

		// Send typing indicator
		await this.typing(to)

		// Wait for specified delay
		await new Promise((resolve) => setTimeout(resolve, delayMs))

		// Send the message
		return messagesService.sendText(to, message)
	}
}

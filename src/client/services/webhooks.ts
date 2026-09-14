import { z } from 'zod'
import type { WhatsAppConfig } from '../config'

/**
 * Webhook Subscription Schema
 */
export const SubscriptionSchema = z.object({
	success: z.boolean(),
})

export type Subscription = z.infer<typeof SubscriptionSchema>

/**
 * Webhook Subscriptions List Schema
 */
export const SubscriptionsListSchema = z.object({
	data: z.array(
		z.object({
			whatsapp_business_api_data: z
				.object({
					id: z.string(),
				})
				.optional(),
		}),
	),
})

export type SubscriptionsList = z.infer<typeof SubscriptionsListSchema>

/**
 * Subscribe Options Schema
 */
export const SubscribeOptionsSchema = z.object({
	override_callback_uri: z.string().url().optional(),
	verify_token: z.string().optional(),
})

export type SubscribeOptions = z.infer<typeof SubscribeOptionsSchema>

/**
 * Webhook fields to subscribe to
 */
export const WebhookFieldSchema = z.enum([
	'messages',
	'message_template_status_update',
	'message_template_quality_update',
	'phone_number_name_update',
	'phone_number_quality_update',
	'account_alerts',
	'account_update',
	'business_capability_update',
	'message_echoes',
	'security',
	'template_category_update',
])

export type WebhookField = z.infer<typeof WebhookFieldSchema>

/**
 * Webhooks/Subscriptions Service
 *
 * Manages webhook subscriptions for WhatsApp Business Accounts.
 * Allows you to subscribe to events, manage callback URLs, and configure
 * which events you want to receive.
 *
 * @example
 * ```typescript
 * const client = new WhatsAppCloudAPI({ ... })
 *
 * // Subscribe to a WABA with default callback
 * await client.webhooks.subscribe('WABA_ID')
 *
 * // Subscribe with custom callback URL
 * await client.webhooks.subscribe('WABA_ID', {
 *   override_callback_uri: 'https://example.com/webhook',
 *   verify_token: 'my-verify-token',
 * })
 *
 * // Get all subscriptions
 * const subscriptions = await client.webhooks.getSubscriptions('WABA_ID')
 *
 * // Unsubscribe from a WABA
 * await client.webhooks.unsubscribe('WABA_ID')
 *
 * // Update callback URL
 * await client.webhooks.updateCallbackUrl('WABA_ID', 'https://example.com/new-webhook')
 * ```
 */
export class WebhooksService {
	private readonly config: WhatsAppConfig
	private readonly baseUrl: string

	constructor(config: WhatsAppConfig) {
		this.config = config
		this.baseUrl = `${config.baseUrl}/${config.version}`
	}

	/**
	 * Subscribe to webhook events for a WhatsApp Business Account
	 *
	 * This allows your application to receive real-time notifications about
	 * events happening in your WhatsApp Business Account, such as incoming
	 * messages, message status updates, and template status changes.
	 *
	 * @param wabaId - The WABA ID to subscribe to
	 * @param options - Optional configuration including callback URL and verify token
	 * @returns Subscription result
	 *
	 * @example
	 * ```typescript
	 * // Subscribe with default settings (uses app-level webhook config)
	 * await client.webhooks.subscribe('WABA_ID')
	 *
	 * // Subscribe with custom callback URL
	 * await client.webhooks.subscribe('WABA_ID', {
	 *   override_callback_uri: 'https://myapp.com/webhooks/whatsapp',
	 *   verify_token: 'my-secret-verify-token',
	 * })
	 * ```
	 */
	async subscribe(
		wabaId: string,
		options?: SubscribeOptions,
	): Promise<Subscription> {
		const validatedOptions = options
			? SubscribeOptionsSchema.parse(options)
			: undefined

		const url = new URL(`${this.baseUrl}/${wabaId}/subscribed_apps`)

		const body: Record<string, string> = {}

		if (validatedOptions?.override_callback_uri) {
			body.override_callback_uri = validatedOptions.override_callback_uri
		}

		if (validatedOptions?.verify_token) {
			body.verify_token = validatedOptions.verify_token
		}

		const response = await fetch(url.toString(), {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.config.accessToken}`,
				'Content-Type': 'application/json',
			},
			body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(
				`Failed to subscribe to WABA: ${error.error?.message || response.statusText}`,
			)
		}

		const data = await response.json()
		return SubscriptionSchema.parse(data)
	}

	/**
	 * Get all webhook subscriptions for a WhatsApp Business Account
	 *
	 * @param wabaId - The WABA ID to get subscriptions for
	 * @returns List of subscriptions
	 *
	 * @example
	 * ```typescript
	 * const subscriptions = await client.webhooks.getSubscriptions('WABA_ID')
	 * console.log('Active subscriptions:', subscriptions.data.length)
	 * ```
	 */
	async getSubscriptions(wabaId: string): Promise<SubscriptionsList> {
		const url = new URL(`${this.baseUrl}/${wabaId}/subscribed_apps`)

		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.config.accessToken}`,
			},
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(
				`Failed to get subscriptions: ${error.error?.message || response.statusText}`,
			)
		}

		const data = await response.json()
		return SubscriptionsListSchema.parse(data)
	}

	/**
	 * Unsubscribe from webhook events for a WhatsApp Business Account
	 *
	 * This stops your application from receiving webhook events for the
	 * specified WABA.
	 *
	 * @param wabaId - The WABA ID to unsubscribe from
	 * @returns Subscription result
	 *
	 * @example
	 * ```typescript
	 * await client.webhooks.unsubscribe('WABA_ID')
	 * console.log('Successfully unsubscribed from webhook events')
	 * ```
	 */
	async unsubscribe(wabaId: string): Promise<Subscription> {
		const url = new URL(`${this.baseUrl}/${wabaId}/subscribed_apps`)

		const response = await fetch(url.toString(), {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${this.config.accessToken}`,
			},
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(
				`Failed to unsubscribe from WABA: ${error.error?.message || response.statusText}`,
			)
		}

		const data = await response.json()
		return SubscriptionSchema.parse(data)
	}

	/**
	 * Update the callback URL for webhook subscriptions
	 *
	 * This is an alias for the subscribe method with a custom callback URL.
	 * It can be used to change the webhook endpoint without unsubscribing.
	 *
	 * @param wabaId - The WABA ID to update
	 * @param callbackUrl - The new callback URL
	 * @param verifyToken - Optional verify token for webhook verification
	 * @returns Subscription result
	 *
	 * @example
	 * ```typescript
	 * await client.webhooks.updateCallbackUrl(
	 *   'WABA_ID',
	 *   'https://myapp.com/new-webhook',
	 *   'my-new-verify-token'
	 * )
	 * ```
	 */
	async updateCallbackUrl(
		wabaId: string,
		callbackUrl: string,
		verifyToken?: string,
	): Promise<Subscription> {
		return this.subscribe(wabaId, {
			override_callback_uri: callbackUrl,
			verify_token: verifyToken,
		})
	}

	/**
	 * Check if a WABA is subscribed to webhooks
	 *
	 * @param wabaId - The WABA ID to check
	 * @returns True if subscribed, false otherwise
	 *
	 * @example
	 * ```typescript
	 * const isSubscribed = await client.webhooks.isSubscribed('WABA_ID')
	 * if (!isSubscribed) {
	 *   await client.webhooks.subscribe('WABA_ID')
	 * }
	 * ```
	 */
	async isSubscribed(wabaId: string): Promise<boolean> {
		try {
			const subscriptions = await this.getSubscriptions(wabaId)
			return subscriptions.data.length > 0
		} catch {
			return false
		}
	}

	/**
	 * Subscribe to specific webhook fields
	 *
	 * This allows you to specify exactly which events you want to receive.
	 * By default, subscribing enables all available fields.
	 *
	 * @param wabaId - The WABA ID to subscribe to
	 * @param fields - Array of webhook fields to subscribe to
	 * @param options - Optional configuration
	 * @returns Subscription result
	 *
	 * @example
	 * ```typescript
	 * // Subscribe to only messages and message status updates
	 * await client.webhooks.subscribeToFields('WABA_ID', [
	 *   'messages',
	 *   'message_template_status_update',
	 * ])
	 *
	 * // Subscribe with custom callback
	 * await client.webhooks.subscribeToFields(
	 *   'WABA_ID',
	 *   ['messages', 'account_alerts'],
	 *   { override_callback_uri: 'https://example.com/webhook' }
	 * )
	 * ```
	 */
	async subscribeToFields(
		wabaId: string,
		fields: WebhookField[],
		options?: SubscribeOptions,
	): Promise<Subscription> {
		const validatedOptions = options
			? SubscribeOptionsSchema.parse(options)
			: undefined

		const url = new URL(`${this.baseUrl}/${wabaId}/subscribed_apps`)

		// Validate fields
		for (const field of fields) {
			WebhookFieldSchema.parse(field)
		}

		const body: Record<string, unknown> = {
			subscribed_fields: fields,
		}

		if (validatedOptions?.override_callback_uri) {
			body.override_callback_uri = validatedOptions.override_callback_uri
		}

		if (validatedOptions?.verify_token) {
			body.verify_token = validatedOptions.verify_token
		}

		const response = await fetch(url.toString(), {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.config.accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(
				`Failed to subscribe to fields: ${error.error?.message || response.statusText}`,
			)
		}

		const data = await response.json()
		return SubscriptionSchema.parse(data)
	}
}

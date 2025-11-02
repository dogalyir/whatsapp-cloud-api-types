import { z } from 'zod'

/**
 * WhatsApp Business API data object
 */
export const WhatsAppBusinessAPIDataSchema: z.ZodType<{
	id: string
	link: string
	name: string
}> = z.object({
	/** App ID */
	id: z.string(),
	/** App link */
	link: z.string(),
	/** App name */
	name: z.string(),
})

export type WhatsAppBusinessAPIData = z.infer<
	typeof WhatsAppBusinessAPIDataSchema
>

/**
 * Subscribed app object
 */
export const SubscribedAppSchema: z.ZodType<{
	whatsapp_business_api_data: {
		id: string
		link: string
		name: string
	}
}> = z.object({
	whatsapp_business_api_data: WhatsAppBusinessAPIDataSchema,
})

export type SubscribedApp = z.infer<typeof SubscribedAppSchema>

/**
 * Subscribed app with override callback URI
 */
export const SubscribedAppWithOverrideSchema: z.ZodType<{
	whatsapp_business_api_data: {
		id: string
		link: string
		name: string
	}
	override_callback_uri: string
}> = z.object({
	whatsapp_business_api_data: WhatsAppBusinessAPIDataSchema,
	/** The alternate callback URL for this subscription */
	override_callback_uri: z.string(),
})

export type SubscribedAppWithOverride = z.infer<
	typeof SubscribedAppWithOverrideSchema
>

/**
 * Response schema for subscribing to a WhatsApp Business Account
 *
 * @example
 * ```ts
 * const response = SubscribeToWABAResponseSchema.parse({
 *   success: true
 * })
 * ```
 */
export const SubscribeToWABAResponseSchema: z.ZodType<{
	success: boolean
}> = z.object({
	/** Whether the subscription was successful */
	success: z.boolean(),
})

export type SubscribeToWABAResponse = z.infer<
	typeof SubscribeToWABAResponseSchema
>

/**
 * Response schema for getting all subscriptions for a WhatsApp Business Account
 *
 * @example
 * ```ts
 * const response = GetSubscriptionsResponseSchema.parse({
 *   data: [
 *     {
 *       whatsapp_business_api_data: {
 *         id: "123456789",
 *         link: "https://example.com",
 *         name: "My App"
 *       }
 *     }
 *   ]
 * })
 * ```
 */
export const GetSubscriptionsResponseSchema: z.ZodType<{
	data: Array<{
		whatsapp_business_api_data: {
			id: string
			link: string
			name: string
		}
	}>
}> = z.object({
	/** Array of subscribed apps */
	data: z.array(SubscribedAppSchema),
})

export type GetSubscriptionsResponse = z.infer<
	typeof GetSubscriptionsResponseSchema
>

/**
 * Response schema for unsubscribing from a WhatsApp Business Account
 *
 * @example
 * ```ts
 * const response = UnsubscribeFromWABAResponseSchema.parse({
 *   success: true
 * })
 * ```
 */
export const UnsubscribeFromWABAResponseSchema: z.ZodType<{
	success: boolean
}> = z.object({
	/** Whether the unsubscription was successful */
	success: z.boolean(),
})

export type UnsubscribeFromWABAResponse = z.infer<
	typeof UnsubscribeFromWABAResponseSchema
>

/**
 * Request schema for overriding the callback URL
 *
 * @example
 * ```ts
 * const request = OverrideCallbackURLRequestSchema.parse({
 *   override_callback_uri: "https://example.com/webhook",
 *   verify_token: "my-secret-token"
 * })
 * ```
 */
export const OverrideCallbackURLRequestSchema: z.ZodType<{
	override_callback_uri: string
	verify_token: string
}> = z.object({
	/** The alternate webhook endpoint URL */
	override_callback_uri: z.string().url(),
	/** The verification token for the alternate webhook endpoint */
	verify_token: z.string(),
})

export type OverrideCallbackURLRequest = z.infer<
	typeof OverrideCallbackURLRequestSchema
>

/**
 * Response schema for overriding the callback URL
 *
 * @example
 * ```ts
 * const response = OverrideCallbackURLResponseSchema.parse({
 *   data: [
 *     {
 *       override_callback_uri: "https://example.com/webhook",
 *       whatsapp_business_api_data: {
 *         id: "123456789",
 *         link: "https://facebook.com/app",
 *         name: "My App"
 *       }
 *     }
 *   ]
 * })
 * ```
 */
export const OverrideCallbackURLResponseSchema: z.ZodType<{
	data: Array<{
		whatsapp_business_api_data: {
			id: string
			link: string
			name: string
		}
		override_callback_uri: string
	}>
}> = z.object({
	/** Array of subscribed apps with override callback URIs */
	data: z.array(SubscribedAppWithOverrideSchema),
})

export type OverrideCallbackURLResponse = z.infer<
	typeof OverrideCallbackURLResponseSchema
>

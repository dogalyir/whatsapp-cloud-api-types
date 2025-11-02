import { z } from 'zod'
import { type MessagesWebhook, MessagesWebhookSchema } from './messages'
import {
	type TemplateCategoryUpdateWebhook,
	TemplateCategoryUpdateWebhookSchema,
} from './templates/template-category-update'
import {
	type MessageTemplateComponentsUpdateWebhook,
	MessageTemplateComponentsUpdateWebhookSchema,
} from './templates/template-components-update'
import {
	type MessageTemplateQualityUpdateWebhook,
	MessageTemplateQualityUpdateWebhookSchema,
} from './templates/template-quality-update'
import {
	type MessageTemplateStatusUpdateWebhook,
	MessageTemplateStatusUpdateWebhookSchema,
} from './templates/template-status-update'

/**
 * Unified webhook schema that can parse any WhatsApp Cloud API webhook
 *
 * This discriminated union allows you to parse incoming webhooks and
 * automatically determine their type based on the `field` value.
 *
 * @example
 * ```ts
 * const webhook = WhatsAppWebhookSchema.parse(req.body)
 *
 * // TypeScript will narrow the type based on the field
 * if (webhook.entry[0].changes[0].field === 'messages') {
 *   // webhook is MessagesWebhook
 *   const messages = webhook.entry[0].changes[0].value.messages
 * }
 * ```
 */
export const WhatsAppWebhookSchema: z.ZodUnion<
	[
		typeof MessagesWebhookSchema,
		typeof MessageTemplateStatusUpdateWebhookSchema,
		typeof MessageTemplateQualityUpdateWebhookSchema,
		typeof MessageTemplateComponentsUpdateWebhookSchema,
		typeof TemplateCategoryUpdateWebhookSchema,
	]
> = z.union([
	MessagesWebhookSchema,
	MessageTemplateStatusUpdateWebhookSchema,
	MessageTemplateQualityUpdateWebhookSchema,
	MessageTemplateComponentsUpdateWebhookSchema,
	TemplateCategoryUpdateWebhookSchema,
])

export type WhatsAppWebhook = z.infer<typeof WhatsAppWebhookSchema>

/**
 * Helper type to extract the webhook type from the field name
 */
export type WebhookByField<T extends string> = Extract<
	WhatsAppWebhook,
	{ entry: Array<{ changes: Array<{ field: T }> }> }
>

// Re-export all individual schemas and types
export * from './messages'
export * from './templates/template-category-update'
export * from './templates/template-components-update'
export * from './templates/template-quality-update'
export * from './templates/template-status-update'

// Export individual webhook schemas for convenience
export {
	MessagesWebhookSchema,
	MessageTemplateStatusUpdateWebhookSchema,
	MessageTemplateQualityUpdateWebhookSchema,
	MessageTemplateComponentsUpdateWebhookSchema,
	TemplateCategoryUpdateWebhookSchema,
}

// Export individual webhook types
export type {
	MessagesWebhook,
	MessageTemplateStatusUpdateWebhook,
	MessageTemplateQualityUpdateWebhook,
	MessageTemplateComponentsUpdateWebhook,
	TemplateCategoryUpdateWebhook,
}

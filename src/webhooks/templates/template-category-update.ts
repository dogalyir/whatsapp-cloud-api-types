import { z } from 'zod'

/**
 * Template category values
 */
export const TemplateCategorySchema: z.ZodType<
	'AUTHENTICATION' | 'MARKETING' | 'UTILITY'
> = z.enum(['AUTHENTICATION', 'MARKETING', 'UTILITY'])

export type TemplateCategory = z.infer<typeof TemplateCategorySchema>

/**
 * Template category update value object for impending changes
 * (notification sent 24 hours before the change)
 */
export const TemplateCategoryUpdateImpendingValueSchema: z.ZodType<{
	message_template_id: number
	message_template_name: string
	message_template_language: string
	correct_category: z.infer<typeof TemplateCategorySchema>
	new_category: z.infer<typeof TemplateCategorySchema>
}> = z.object({
	/** The ID of the message template */
	message_template_id: z.number().int(),
	/** The name of the message template */
	message_template_name: z.string(),
	/** The language and locale code of the template (e.g., en-US) */
	message_template_language: z.string(),
	/** The category the template will be recategorized as in 24 hours */
	correct_category: TemplateCategorySchema,
	/** The current category of the template */
	new_category: TemplateCategorySchema,
})

export type TemplateCategoryUpdateImpendingValue = z.infer<
	typeof TemplateCategoryUpdateImpendingValueSchema
>

/**
 * Template category update value object for completed changes
 */
export const TemplateCategoryUpdateCompletedValueSchema: z.ZodType<{
	message_template_id: number
	message_template_name: string
	message_template_language: string
	previous_category: z.infer<typeof TemplateCategorySchema>
	new_category: z.infer<typeof TemplateCategorySchema>
}> = z.object({
	/** The ID of the message template */
	message_template_id: z.number().int(),
	/** The name of the message template */
	message_template_name: z.string(),
	/** The language and locale code of the template (e.g., en-US) */
	message_template_language: z.string(),
	/** The previous category of the template */
	previous_category: TemplateCategorySchema,
	/** The new category of the template */
	new_category: TemplateCategorySchema,
})

export type TemplateCategoryUpdateCompletedValue = z.infer<
	typeof TemplateCategoryUpdateCompletedValueSchema
>

/**
 * Template category update value object (union of impending and completed)
 */
export const TemplateCategoryUpdateValueSchema: z.ZodType<
	| z.infer<typeof TemplateCategoryUpdateImpendingValueSchema>
	| z.infer<typeof TemplateCategoryUpdateCompletedValueSchema>
> = z.union([
	TemplateCategoryUpdateImpendingValueSchema,
	TemplateCategoryUpdateCompletedValueSchema,
])

export type TemplateCategoryUpdateValue = z.infer<
	typeof TemplateCategoryUpdateValueSchema
>

/**
 * Change object for template category update
 */
export const TemplateCategoryUpdateChangeSchema: z.ZodType<{
	value: z.infer<typeof TemplateCategoryUpdateValueSchema>
	field: 'template_category_update'
}> = z.object({
	value: TemplateCategoryUpdateValueSchema,
	field: z.literal('template_category_update'),
})

export type TemplateCategoryUpdateChange = z.infer<
	typeof TemplateCategoryUpdateChangeSchema
>

/**
 * Entry object for template category update
 */
export const TemplateCategoryUpdateEntrySchema: z.ZodType<{
	id: string
	time: number
	changes: Array<z.infer<typeof TemplateCategoryUpdateChangeSchema>>
}> = z.object({
	/** The WhatsApp Business Account ID */
	id: z.string(),
	/** Unix timestamp indicating when the webhook was triggered */
	time: z.number().int(),
	changes: z.array(TemplateCategoryUpdateChangeSchema),
})

export type TemplateCategoryUpdateEntry = z.infer<
	typeof TemplateCategoryUpdateEntrySchema
>

/**
 * Complete webhook payload for template_category_update
 */
export const TemplateCategoryUpdateWebhookSchema: z.ZodType<{
	object: 'whatsapp_business_account'
	entry: Array<z.infer<typeof TemplateCategoryUpdateEntrySchema>>
}> = z.object({
	object: z.literal('whatsapp_business_account'),
	entry: z.array(TemplateCategoryUpdateEntrySchema),
})

export type TemplateCategoryUpdateWebhook = z.infer<
	typeof TemplateCategoryUpdateWebhookSchema
>

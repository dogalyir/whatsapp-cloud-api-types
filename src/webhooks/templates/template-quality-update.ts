import { z } from 'zod'

/**
 * Template quality score values
 */
export const TemplateQualityScoreSchema: z.ZodType<
	'GREEN' | 'RED' | 'YELLOW' | 'UNKNOWN'
> = z.enum(['GREEN', 'RED', 'YELLOW', 'UNKNOWN'])

export type TemplateQualityScore = z.infer<typeof TemplateQualityScoreSchema>

/**
 * Template quality update value object
 */
export const TemplateQualityUpdateValueSchema: z.ZodType<{
	previous_quality_score: z.infer<typeof TemplateQualityScoreSchema>
	new_quality_score: z.infer<typeof TemplateQualityScoreSchema>
	message_template_id: number
	message_template_name: string
	message_template_language: string
}> = z.object({
	/** Previous template quality score */
	previous_quality_score: TemplateQualityScoreSchema,
	/** New template quality score */
	new_quality_score: TemplateQualityScoreSchema,
	/** The unique identifier for the message template */
	message_template_id: z.number().int(),
	/** The name of the message template */
	message_template_name: z.string(),
	/** The language and locale code of the message template (e.g., en_US) */
	message_template_language: z.string(),
})

export type TemplateQualityUpdateValue = z.infer<
	typeof TemplateQualityUpdateValueSchema
>

/**
 * Change object for template quality update
 */
export const TemplateQualityUpdateChangeSchema: z.ZodType<{
	value: z.infer<typeof TemplateQualityUpdateValueSchema>
	field: 'message_template_status_update'
}> = z.object({
	value: TemplateQualityUpdateValueSchema,
	field: z.literal('message_template_status_update'),
})

export type TemplateQualityUpdateChange = z.infer<
	typeof TemplateQualityUpdateChangeSchema
>

/**
 * Entry object for template quality update
 */
export const TemplateQualityUpdateEntrySchema: z.ZodType<{
	id: string
	time: number
	changes: Array<z.infer<typeof TemplateQualityUpdateChangeSchema>>
}> = z.object({
	/** WhatsApp Business Account ID */
	id: z.string(),
	/** Unix timestamp indicating when the webhook was triggered */
	time: z.number().int(),
	changes: z.array(TemplateQualityUpdateChangeSchema),
})

export type TemplateQualityUpdateEntry = z.infer<
	typeof TemplateQualityUpdateEntrySchema
>

/**
 * Complete webhook payload for message_template_quality_update
 */
export const MessageTemplateQualityUpdateWebhookSchema: z.ZodType<{
	object: 'whatsapp_business_account'
	entry: Array<z.infer<typeof TemplateQualityUpdateEntrySchema>>
}> = z.object({
	object: z.literal('whatsapp_business_account'),
	entry: z.array(TemplateQualityUpdateEntrySchema),
})

export type MessageTemplateQualityUpdateWebhook = z.infer<
	typeof MessageTemplateQualityUpdateWebhookSchema
>

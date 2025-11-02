import { z } from 'zod'

/**
 * Template status event types
 */
export const TemplateStatusEventSchema: z.ZodType<
	| 'APPROVED'
	| 'ARCHIVED'
	| 'DELETED'
	| 'DISABLED'
	| 'FLAGGED'
	| 'IN_APPEAL'
	| 'LIMIT_EXCEEDED'
	| 'LOCKED'
	| 'PAUSED'
	| 'PENDING'
	| 'REINSTATED'
	| 'PENDING_DELETION'
	| 'REJECTED'
> = z.enum([
	'APPROVED',
	'ARCHIVED',
	'DELETED',
	'DISABLED',
	'FLAGGED',
	'IN_APPEAL',
	'LIMIT_EXCEEDED',
	'LOCKED',
	'PAUSED',
	'PENDING',
	'REINSTATED',
	'PENDING_DELETION',
	'REJECTED',
])

export type TemplateStatusEvent = z.infer<typeof TemplateStatusEventSchema>

/**
 * Template rejection/disabling reasons
 */
export const TemplateReasonSchema: z.ZodType<
	| 'ABUSIVE_CONTENT'
	| 'CATEGORY_NOT_AVAILABLE'
	| 'INCORRECT_CATEGORY'
	| 'INVALID_FORMAT'
	| 'NONE'
	| 'PROMOTIONAL'
	| 'SCAM'
	| 'TAG_CONTENT_MISMATCH'
> = z.enum([
	'ABUSIVE_CONTENT',
	'CATEGORY_NOT_AVAILABLE',
	'INCORRECT_CATEGORY',
	'INVALID_FORMAT',
	'NONE',
	'PROMOTIONAL',
	'SCAM',
	'TAG_CONTENT_MISMATCH',
])

export type TemplateReason = z.infer<typeof TemplateReasonSchema>

/**
 * Template disable information
 */
export const TemplateDisableInfoSchema: z.ZodType<{
	disable_date: number
}> = z.object({
	/** Unix timestamp indicating when the template was disabled */
	disable_date: z.number().int(),
})

export type TemplateDisableInfo = z.infer<typeof TemplateDisableInfoSchema>

/**
 * Template lock/unlock information titles
 */
export const TemplateOtherInfoTitleSchema: z.ZodType<
	| 'FIRST_PAUSE'
	| 'SECOND_PAUSE'
	| 'RATE_LIMITING_PAUSE'
	| 'UNPAUSE'
	| 'DISABLED'
> = z.enum([
	'FIRST_PAUSE',
	'SECOND_PAUSE',
	'RATE_LIMITING_PAUSE',
	'UNPAUSE',
	'DISABLED',
])

export type TemplateOtherInfoTitle = z.infer<
	typeof TemplateOtherInfoTitleSchema
>

/**
 * Template lock/unlock information
 */
export const TemplateOtherInfoSchema: z.ZodType<{
	title: z.infer<typeof TemplateOtherInfoTitleSchema>
	description: string
}> = z.object({
	/** Title of the pause or unpause event */
	title: TemplateOtherInfoTitleSchema,
	/** Description of why the template was locked or unlocked */
	description: z.string(),
})

export type TemplateOtherInfo = z.infer<typeof TemplateOtherInfoSchema>

/**
 * Template status update value object
 */
export const TemplateStatusUpdateValueSchema: z.ZodType<{
	event: z.infer<typeof TemplateStatusEventSchema>
	message_template_id: number
	message_template_name: string
	message_template_language: string
	reason?: z.infer<typeof TemplateReasonSchema>
	disable_info?: z.infer<typeof TemplateDisableInfoSchema>
	other_info?: z.infer<typeof TemplateOtherInfoSchema>
}> = z.object({
	/** The status event for the template */
	event: TemplateStatusEventSchema,
	/** The ID of the message template */
	message_template_id: z.number().int(),
	/** The name of the message template */
	message_template_name: z.string(),
	/** The language and locale code of the template (e.g., en-US) */
	message_template_language: z.string(),
	/** The reason for the template rejection or disabling */
	reason: TemplateReasonSchema.optional(),
	/** Included only if the template is disabled */
	disable_info: TemplateDisableInfoSchema.optional(),
	/** Included only if the template is locked or unlocked */
	other_info: TemplateOtherInfoSchema.optional(),
})

export type TemplateStatusUpdateValue = z.infer<
	typeof TemplateStatusUpdateValueSchema
>

/**
 * Change object for template status update
 */
export const TemplateStatusUpdateChangeSchema: z.ZodType<{
	value: z.infer<typeof TemplateStatusUpdateValueSchema>
	field: 'message_template_status_update'
}> = z.object({
	value: TemplateStatusUpdateValueSchema,
	field: z.literal('message_template_status_update'),
})

export type TemplateStatusUpdateChange = z.infer<
	typeof TemplateStatusUpdateChangeSchema
>

/**
 * Entry object for template status update
 */
export const TemplateStatusUpdateEntrySchema: z.ZodType<{
	id: string
	time: number
	changes: Array<z.infer<typeof TemplateStatusUpdateChangeSchema>>
}> = z.object({
	/** The WhatsApp Business Account ID */
	id: z.string(),
	/** Unix timestamp indicating when the webhook was triggered */
	time: z.number().int(),
	changes: z.array(TemplateStatusUpdateChangeSchema),
})

export type TemplateStatusUpdateEntry = z.infer<
	typeof TemplateStatusUpdateEntrySchema
>

/**
 * Complete webhook payload for message_template_status_update
 */
export const MessageTemplateStatusUpdateWebhookSchema: z.ZodType<{
	object: 'whatsapp_business_account'
	entry: Array<z.infer<typeof TemplateStatusUpdateEntrySchema>>
}> = z.object({
	object: z.literal('whatsapp_business_account'),
	entry: z.array(TemplateStatusUpdateEntrySchema),
})

export type MessageTemplateStatusUpdateWebhook = z.infer<
	typeof MessageTemplateStatusUpdateWebhookSchema
>

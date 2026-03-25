import { z } from 'zod'
import { BaseService } from '../config'

/**
 * Template component parameter schemas
 */
export const TemplateParameterSchema = z.object({
	type: z.enum(['text', 'currency', 'date_time', 'image', 'document', 'video']),
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
			link: z.string().url(),
		})
		.optional(),
	document: z
		.object({
			link: z.string().url(),
			filename: z.string().optional(),
		})
		.optional(),
	video: z
		.object({
			link: z.string().url(),
		})
		.optional(),
})

export type TemplateParameter = z.infer<typeof TemplateParameterSchema>

/**
 * Template component schema
 */
export const TemplateComponentSchema = z.object({
	type: z.enum(['header', 'body', 'button']),
	parameters: z.array(TemplateParameterSchema).optional(),
	sub_type: z.enum(['quick_reply', 'url']).optional(),
	index: z.number().optional(),
})

export type TemplateComponent = z.infer<typeof TemplateComponentSchema>

/**
 * Template language schema
 */
export const TemplateLanguageSchema = z.object({
	code: z.string(),
	policy: z.enum(['deterministic', 'fallback']).default('deterministic'),
})

export type TemplateLanguage = z.infer<typeof TemplateLanguageSchema>

/**
 * Template schema for sending messages
 */
export const TemplateSchema = z.object({
	name: z.string(),
	language: TemplateLanguageSchema,
	components: z.array(TemplateComponentSchema).optional(),
})

export type Template = z.infer<typeof TemplateSchema>

/**
 * Template creation/update request schema
 */
export const CreateTemplateSchema = z.object({
	name: z.string(),
	language: z.string(),
	category: z.enum(['AUTHENTICATION', 'MARKETING', 'UTILITY']),
	components: z.array(
		z.object({
			type: z.enum(['HEADER', 'BODY', 'FOOTER', 'BUTTONS', 'CAROUSEL']),
			format: z
				.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'LOCATION'])
				.optional(),
			text: z.string().optional(),
			buttons: z
				.array(
					z.object({
						type: z.enum(['PHONE_NUMBER', 'URL', 'QUICK_REPLY', 'COPY_CODE']),
						text: z.string(),
						url: z.string().optional(),
						phone_number: z.string().optional(),
						example: z.array(z.string()).optional(),
					}),
				)
				.optional(),
			example: z
				.object({
					header_text: z.array(z.string()).optional(),
					header_handle: z.array(z.string()).optional(),
					body_text: z.array(z.array(z.string())).optional(),
				})
				.optional(),
			cards: z
				.array(
					z.object({
						components: z.array(z.any()),
					}),
				)
				.optional(),
		}),
	),
	allow_category_change: z.boolean().optional(),
})

export type CreateTemplate = z.infer<typeof CreateTemplateSchema>

/**
 * Template response schema
 */
export const TemplateResponseSchema = z.object({
	id: z.string(),
	status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'PAUSED', 'DISABLED']),
	category: z.enum(['AUTHENTICATION', 'MARKETING', 'UTILITY']),
	name: z.string().optional(),
	language: z.string().optional(),
	rejected_reason: z.string().optional(),
})

export type TemplateResponse = z.infer<typeof TemplateResponseSchema>

/**
 * Template list response schema
 */
export const TemplateListResponseSchema = z.object({
	data: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'PAUSED', 'DISABLED']),
			category: z.enum(['AUTHENTICATION', 'MARKETING', 'UTILITY']),
			language: z.string(),
			components: z.array(z.any()).optional(),
			rejected_reason: z.string().optional(),
		}),
	),
	paging: z
		.object({
			cursors: z
				.object({
					before: z.string().optional(),
					after: z.string().optional(),
				})
				.optional(),
			next: z.string().optional(),
			previous: z.string().optional(),
		})
		.optional(),
})

export type TemplateListResponse = z.infer<typeof TemplateListResponseSchema>

/**
 * Template delete response schema
 */
export const TemplateDeleteResponseSchema = z.object({
	success: z.boolean(),
})

export type TemplateDeleteResponse = z.infer<
	typeof TemplateDeleteResponseSchema
>

/**
 * Templates Service
 *
 * Service for managing WhatsApp message templates.
 * Templates are pre-approved message formats that can be sent to users.
 *
 * @example
 * ```typescript
 * // Create a new template
 * const template = await client.templates.create({
 *   name: 'welcome_message',
 *   language: 'en_US',
 *   category: 'UTILITY',
 *   components: [
 *     {
 *       type: 'BODY',
 *       text: 'Hello {{1}}, welcome to our service!',
 *     },
 *   ],
 * })
 *
 * // List all templates
 * const templates = await client.templates.list()
 *
 * // Get a specific template
 * const template = await client.templates.get('template_id')
 *
 * // Delete a template
 * await client.templates.delete('template_name')
 * ```
 */
export class TemplatesService extends BaseService {
	private requireWabaId(): string {
		if (!this.config.wabaId) {
			throw new Error('wabaId is required for template operations')
		}

		return this.config.wabaId
	}

	/**
	 * Create a new message template
	 *
	 * @param template - Template configuration
	 * @returns Template creation response
	 *
	 * @example
	 * ```typescript
	 * const result = await client.templates.create({
	 *   name: 'order_confirmation',
	 *   language: 'en_US',
	 *   category: 'UTILITY',
	 *   components: [
	 *     {
	 *       type: 'BODY',
	 *       text: 'Your order {{1}} has been confirmed. Total: {{2}}',
	 *     },
	 *   ],
	 * })
	 * ```
	 */
	async create(
		template: z.input<typeof CreateTemplateSchema>,
	): Promise<TemplateResponse> {
		const wabaId = this.requireWabaId()
		const validatedTemplate = CreateTemplateSchema.parse(template)

		const response = await this.request<TemplateResponse>(
			`${wabaId}/message_templates`,
			{
				method: 'POST',
				body: JSON.stringify(validatedTemplate),
			},
		)

		return TemplateResponseSchema.parse(response)
	}

	/**
	 * List all message templates
	 *
	 * @param options - Query options (limit, after cursor)
	 * @returns List of templates
	 *
	 * @example
	 * ```typescript
	 * const templates = await client.templates.list()
	 * console.log(templates.data)
	 * ```
	 */
	async list(options?: {
		limit?: number
		after?: string
	}): Promise<TemplateListResponse> {
		const wabaId = this.requireWabaId()
		const params = new URLSearchParams()

		if (options?.limit) {
			params.append('limit', options.limit.toString())
		}

		if (options?.after) {
			params.append('after', options.after)
		}

		const queryString = params.toString()
		const path = `${wabaId}/message_templates${queryString ? `?${queryString}` : ''}`

		const response = await this.request<TemplateListResponse>(path, {
			method: 'GET',
		})

		return TemplateListResponseSchema.parse(response)
	}

	/**
	 * Get a specific template by ID
	 *
	 * @param templateId - Template ID
	 * @returns Template details
	 *
	 * @example
	 * ```typescript
	 * const template = await client.templates.get('123456789')
	 * console.log(template.status)
	 * ```
	 */
	async get(templateId: string): Promise<TemplateResponse> {
		const response = await this.request<TemplateResponse>(templateId, {
			method: 'GET',
		})

		return TemplateResponseSchema.parse(response)
	}

	/**
	 * Delete a message template
	 *
	 * @param name - Template name
	 * @param options - Additional options (hsm_id for specific language version)
	 * @returns Deletion response
	 *
	 * @example
	 * ```typescript
	 * await client.templates.delete('welcome_message')
	 * ```
	 */
	async delete(
		name: string,
		options?: { hsm_id?: string },
	): Promise<TemplateDeleteResponse> {
		const wabaId = this.requireWabaId()
		const params = new URLSearchParams({ name })

		if (options?.hsm_id) {
			params.append('hsm_id', options.hsm_id)
		}

		const response = await this.request<TemplateDeleteResponse>(
			`${wabaId}/message_templates?${params.toString()}`,
			{
				method: 'DELETE',
			},
		)

		return TemplateDeleteResponseSchema.parse(response)
	}

	/**
	 * Update a message template
	 * Note: Most template properties cannot be edited after creation.
	 * You typically need to delete and recreate the template.
	 *
	 * @param templateId - Template ID
	 * @param updates - Template updates (limited fields)
	 * @returns Updated template response
	 *
	 * @example
	 * ```typescript
	 * await client.templates.update('123456789', {
	 *   category: 'UTILITY'
	 * })
	 * ```
	 */
	async update(
		templateId: string,
		updates: { category?: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY' },
	): Promise<TemplateResponse> {
		const response = await this.request<TemplateResponse>(templateId, {
			method: 'POST',
			body: JSON.stringify(updates),
		})

		return TemplateResponseSchema.parse(response)
	}

	/**
	 * Get templates by name (all language versions)
	 *
	 * @param name - Template name
	 * @returns List of template versions
	 *
	 * @example
	 * ```typescript
	 * const versions = await client.templates.getByName('welcome_message')
	 * ```
	 */
	async getByName(name: string): Promise<TemplateListResponse> {
		const wabaId = this.requireWabaId()
		const params = new URLSearchParams({ name })

		const response = await this.request<TemplateListResponse>(
			`${wabaId}/message_templates?${params.toString()}`,
			{
				method: 'GET',
			},
		)

		return TemplateListResponseSchema.parse(response)
	}

	/**
	 * Get templates by status
	 *
	 * @param status - Template status to filter by
	 * @param options - Additional query options
	 * @returns List of templates with the specified status
	 *
	 * @example
	 * ```typescript
	 * const approved = await client.templates.getByStatus('APPROVED')
	 * ```
	 */
	async getByStatus(
		status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAUSED' | 'DISABLED',
		options?: { limit?: number; after?: string },
	): Promise<TemplateListResponse> {
		const wabaId = this.requireWabaId()
		const params = new URLSearchParams({ status })

		if (options?.limit) {
			params.append('limit', options.limit.toString())
		}

		if (options?.after) {
			params.append('after', options.after)
		}

		const response = await this.request<TemplateListResponse>(
			`${wabaId}/message_templates?${params.toString()}`,
			{
				method: 'GET',
			},
		)

		return TemplateListResponseSchema.parse(response)
	}
}

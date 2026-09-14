import { z } from 'zod'
import type { WhatsAppConfig } from '../config'

/**
 * WhatsApp Business Account (WABA) Schema
 */
export const WABASchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	timezone_id: z.string().optional(),
	message_template_namespace: z.string().optional(),
	account_review_status: z.enum(['APPROVED', 'PENDING', 'REJECTED']).optional(),
	business_verification_status: z
		.enum(['VERIFIED', 'UNVERIFIED', 'PENDING'])
		.optional(),
	currency: z.string().optional(),
	owner_business_info: z
		.object({
			id: z.string(),
			name: z.string().optional(),
			verification_status: z.string().optional(),
		})
		.optional(),
})

export type WABA = z.infer<typeof WABASchema>

/**
 * WABA List Response Schema
 */
export const WABAListResponseSchema = z.object({
	data: z.array(WABASchema),
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

export type WABAListResponse = z.infer<typeof WABAListResponseSchema>

/**
 * WABA fields to request
 */
export const WABAFieldsSchema = z.enum([
	'id',
	'name',
	'timezone_id',
	'message_template_namespace',
	'account_review_status',
	'business_verification_status',
	'currency',
	'owner_business_info',
])

export type WABAFields = z.infer<typeof WABAFieldsSchema>

/**
 * List WABA Options Schema
 */
export const ListWABAOptionsSchema = z
	.object({
		fields: z.array(WABAFieldsSchema).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		after: z.string().optional(),
		before: z.string().optional(),
	})
	.optional()

export type ListWABAOptions = z.infer<typeof ListWABAOptionsSchema>

/**
 * WhatsApp Business Accounts (WABA) Service
 *
 * Manages WhatsApp Business Accounts, allowing you to retrieve information
 * about your owned and shared WABAs.
 *
 * @example
 * ```typescript
 * const client = new WhatsAppCloudAPI({ ... })
 *
 * // Get a specific WABA
 * const waba = await client.waba.get('WABA_ID')
 *
 * // Get all owned WABAs
 * const ownedWabas = await client.waba.getOwned()
 *
 * // Get shared WABAs for a user
 * const sharedWabas = await client.waba.getShared('USER_ID')
 *
 * // Get owned WABAs with specific fields
 * const wabasWithFields = await client.waba.getOwned({
 *   fields: ['id', 'name', 'account_review_status'],
 *   limit: 50,
 * })
 * ```
 */
export class WABAService {
	private readonly config: WhatsAppConfig
	private readonly baseUrl: string

	constructor(config: WhatsAppConfig) {
		this.config = config
		this.baseUrl = `${config.baseUrl}/${config.version}`
	}

	/**
	 * Get a specific WhatsApp Business Account by ID
	 *
	 * @param wabaId - The WABA ID to retrieve
	 * @param fields - Optional array of fields to include in the response
	 * @returns The WABA information
	 *
	 * @example
	 * ```typescript
	 * const waba = await client.waba.get('123456789')
	 * console.log(waba.name)
	 * console.log(waba.message_template_namespace)
	 * ```
	 */
	async get(wabaId: string, fields?: WABAFields[]): Promise<WABA> {
		const url = new URL(`${this.baseUrl}/${wabaId}`)

		if (fields && fields.length > 0) {
			url.searchParams.set('fields', fields.join(','))
		}

		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.config.accessToken}`,
			},
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(
				`Failed to get WABA: ${error.error?.message || response.statusText}`,
			)
		}

		const data = await response.json()
		return WABASchema.parse(data)
	}

	/**
	 * Get all WhatsApp Business Accounts owned by the current user/business
	 *
	 * This retrieves WABAs that you own directly.
	 *
	 * @param options - Optional pagination and field selection options
	 * @returns List of owned WABAs
	 *
	 * @example
	 * ```typescript
	 * // Get all owned WABAs
	 * const ownedWabas = await client.waba.getOwned()
	 *
	 * // Get owned WABAs with specific fields and pagination
	 * const wabasPage = await client.waba.getOwned({
	 *   fields: ['id', 'name', 'account_review_status'],
	 *   limit: 10,
	 * })
	 * ```
	 */
	async getOwned(options?: ListWABAOptions): Promise<WABAListResponse> {
		const validatedOptions = ListWABAOptionsSchema.parse(options)
		const url = new URL(`${this.baseUrl}/me/businesses`)

		if (validatedOptions?.fields && validatedOptions.fields.length > 0) {
			url.searchParams.set('fields', validatedOptions.fields.join(','))
		}

		if (validatedOptions?.limit) {
			url.searchParams.set('limit', validatedOptions.limit.toString())
		}

		if (validatedOptions?.after) {
			url.searchParams.set('after', validatedOptions.after)
		}

		if (validatedOptions?.before) {
			url.searchParams.set('before', validatedOptions.before)
		}

		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.config.accessToken}`,
			},
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(
				`Failed to get owned WABAs: ${error.error?.message || response.statusText}`,
			)
		}

		const data = await response.json()
		return WABAListResponseSchema.parse(data)
	}

	/**
	 * Get WhatsApp Business Accounts shared with a specific user
	 *
	 * This retrieves WABAs that have been shared with the specified user.
	 *
	 * @param userId - The user ID to get shared WABAs for
	 * @param options - Optional pagination and field selection options
	 * @returns List of shared WABAs
	 *
	 * @example
	 * ```typescript
	 * // Get all WABAs shared with a user
	 * const sharedWabas = await client.waba.getShared('USER_ID')
	 *
	 * // Get shared WABAs with specific fields
	 * const wabasPage = await client.waba.getShared('USER_ID', {
	 *   fields: ['id', 'name'],
	 *   limit: 20,
	 * })
	 * ```
	 */
	async getShared(
		userId: string,
		options?: ListWABAOptions,
	): Promise<WABAListResponse> {
		const validatedOptions = ListWABAOptionsSchema.parse(options)
		const url = new URL(`${this.baseUrl}/${userId}/businesses`)

		if (validatedOptions?.fields && validatedOptions.fields.length > 0) {
			url.searchParams.set('fields', validatedOptions.fields.join(','))
		}

		if (validatedOptions?.limit) {
			url.searchParams.set('limit', validatedOptions.limit.toString())
		}

		if (validatedOptions?.after) {
			url.searchParams.set('after', validatedOptions.after)
		}

		if (validatedOptions?.before) {
			url.searchParams.set('before', validatedOptions.before)
		}

		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.config.accessToken}`,
			},
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(
				`Failed to get shared WABAs: ${error.error?.message || response.statusText}`,
			)
		}

		const data = await response.json()
		return WABAListResponseSchema.parse(data)
	}

	/**
	 * Get the first owned WABA (convenience method)
	 *
	 * Useful when you only have one WABA or want to work with the first one.
	 *
	 * @returns The first owned WABA or undefined if none exist
	 *
	 * @example
	 * ```typescript
	 * const waba = await client.waba.getFirst()
	 * if (waba) {
	 *   console.log('Using WABA:', waba.id)
	 * }
	 * ```
	 */
	async getFirst(): Promise<WABA | undefined> {
		const response = await this.getOwned({ limit: 1 })
		return response.data[0]
	}

	/**
	 * Check if a WABA is verified
	 *
	 * @param wabaId - The WABA ID to check
	 * @returns True if the WABA is verified
	 *
	 * @example
	 * ```typescript
	 * const isVerified = await client.waba.isVerified('WABA_ID')
	 * if (!isVerified) {
	 *   console.log('WABA needs verification')
	 * }
	 * ```
	 */
	async isVerified(wabaId: string): Promise<boolean> {
		const waba = await this.get(wabaId, ['business_verification_status'])
		return waba.business_verification_status === 'VERIFIED'
	}

	/**
	 * Check if a WABA is approved
	 *
	 * @param wabaId - The WABA ID to check
	 * @returns True if the WABA is approved
	 *
	 * @example
	 * ```typescript
	 * const isApproved = await client.waba.isApproved('WABA_ID')
	 * if (!isApproved) {
	 *   console.log('WABA needs approval')
	 * }
	 * ```
	 */
	async isApproved(wabaId: string): Promise<boolean> {
		const waba = await this.get(wabaId, ['account_review_status'])
		return waba.account_review_status === 'APPROVED'
	}
}

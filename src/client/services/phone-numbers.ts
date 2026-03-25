import { z } from 'zod'
import type { WhatsAppConfig } from '../config'

/**
 * Phone Number Schema
 */
export const PhoneNumberSchema = z.object({
	id: z.string(),
	display_phone_number: z.string(),
	verified_name: z.string(),
	quality_rating: z.enum(['GREEN', 'YELLOW', 'RED', 'UNKNOWN']).optional(),
	code_verification_status: z.enum(['VERIFIED', 'NOT_VERIFIED']).optional(),
	platform_type: z.enum(['CLOUD_API', 'NOT_APPLICABLE']).optional(),
	throughput: z
		.object({
			level: z.enum(['STANDARD', 'HIGH']).optional(),
		})
		.optional(),
	webhook_configuration: z
		.object({
			application: z.string().optional(),
			whitelisted_domains: z.array(z.string()).optional(),
		})
		.optional(),
	last_onboarded_time: z.string().optional(),
	account_mode: z.enum(['SANDBOX', 'LIVE']).optional(),
	certificate: z.string().optional(),
	name_status: z
		.enum([
			'APPROVED',
			'AVAILABLE_WITHOUT_REVIEW',
			'DECLINED',
			'EXPIRED',
			'PENDING_REVIEW',
			'NONE',
		])
		.optional(),
	new_name_status: z
		.enum([
			'APPROVED',
			'AVAILABLE_WITHOUT_REVIEW',
			'DECLINED',
			'EXPIRED',
			'PENDING_REVIEW',
			'NONE',
		])
		.optional(),
	decision: z.string().optional(),
	requested_verified_name: z.string().optional(),
	rejection_reason: z.string().optional(),
})

export type PhoneNumber = z.infer<typeof PhoneNumberSchema>

/**
 * Phone Number List Response Schema
 */
export const PhoneNumberListResponseSchema = z.object({
	data: z.array(PhoneNumberSchema),
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

export type PhoneNumberListResponse = z.infer<
	typeof PhoneNumberListResponseSchema
>

/**
 * Display Name Status Schema
 */
export const DisplayNameStatusSchema = z.object({
	name_status: z.enum([
		'APPROVED',
		'AVAILABLE_WITHOUT_REVIEW',
		'DECLINED',
		'EXPIRED',
		'PENDING_REVIEW',
		'NONE',
	]),
	new_name_status: z
		.enum([
			'APPROVED',
			'AVAILABLE_WITHOUT_REVIEW',
			'DECLINED',
			'EXPIRED',
			'PENDING_REVIEW',
			'NONE',
		])
		.optional(),
	decision: z.string().optional(),
	requested_verified_name: z.string().optional(),
	rejection_reason: z.string().optional(),
})

export type DisplayNameStatus = z.infer<typeof DisplayNameStatusSchema>

/**
 * Phone Number fields to request
 */
export const PhoneNumberFieldsSchema = z.enum([
	'id',
	'display_phone_number',
	'verified_name',
	'quality_rating',
	'code_verification_status',
	'platform_type',
	'throughput',
	'webhook_configuration',
	'last_onboarded_time',
	'account_mode',
	'certificate',
	'name_status',
	'new_name_status',
	'decision',
	'requested_verified_name',
	'rejection_reason',
])

export type PhoneNumberFields = z.infer<typeof PhoneNumberFieldsSchema>

/**
 * List Phone Numbers Options Schema
 */
export const ListPhoneNumbersOptionsSchema = z
	.object({
		fields: z.array(PhoneNumberFieldsSchema).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		after: z.string().optional(),
		before: z.string().optional(),
		filtering: z
			.array(
				z.object({
					field: z.string(),
					operator: z.enum(['EQUAL', 'NOT_EQUAL', 'IN', 'NOT_IN']),
					value: z.union([z.string(), z.array(z.string())]),
				}),
			)
			.optional(),
	})
	.optional()

export type ListPhoneNumbersOptions = z.infer<
	typeof ListPhoneNumbersOptionsSchema
>

/**
 * Phone Numbers Service
 *
 * Manages phone numbers associated with WhatsApp Business Accounts.
 * Allows you to retrieve information about phone numbers, their verification
 * status, quality ratings, and display name status.
 *
 * @example
 * ```typescript
 * const client = new WhatsAppCloudAPI({ ... })
 *
 * // Get all phone numbers for a WABA
 * const numbers = await client.phoneNumbers.list('WABA_ID')
 *
 * // Get a specific phone number by ID
 * const phoneNumber = await client.phoneNumbers.get('PHONE_NUMBER_ID')
 *
 * // Get display name status
 * const displayName = await client.phoneNumbers.getDisplayNameStatus('PHONE_NUMBER_ID')
 *
 * // List phone numbers with filtering
 * const verifiedNumbers = await client.phoneNumbers.list('WABA_ID', {
 *   filtering: [{
 *     field: 'code_verification_status',
 *     operator: 'EQUAL',
 *     value: 'VERIFIED'
 *   }]
 * })
 * ```
 */
export class PhoneNumbersService {
	private readonly config: WhatsAppConfig
	private readonly baseUrl: string

	constructor(config: WhatsAppConfig) {
		this.config = config
		this.baseUrl = `${config.baseUrl}/${config.version}`
	}

	/**
	 * Get all phone numbers for a WhatsApp Business Account
	 *
	 * @param wabaId - The WABA ID to get phone numbers for
	 * @param options - Optional filtering, pagination, and field selection options
	 * @returns List of phone numbers
	 *
	 * @example
	 * ```typescript
	 * // Get all phone numbers
	 * const numbers = await client.phoneNumbers.list('WABA_ID')
	 *
	 * // Get phone numbers with specific fields
	 * const numbersWithFields = await client.phoneNumbers.list('WABA_ID', {
	 *   fields: ['id', 'display_phone_number', 'quality_rating'],
	 *   limit: 10,
	 * })
	 *
	 * // Get verified phone numbers only
	 * const verifiedNumbers = await client.phoneNumbers.list('WABA_ID', {
	 *   filtering: [{
	 *     field: 'code_verification_status',
	 *     operator: 'EQUAL',
	 *     value: 'VERIFIED'
	 *   }]
	 * })
	 * ```
	 */
	async list(
		wabaId: string,
		options?: ListPhoneNumbersOptions,
	): Promise<PhoneNumberListResponse> {
		const validatedOptions = ListPhoneNumbersOptionsSchema.parse(options)
		const url = new URL(`${this.baseUrl}/${wabaId}/phone_numbers`)

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

		if (validatedOptions?.filtering && validatedOptions.filtering.length > 0) {
			url.searchParams.set(
				'filtering',
				JSON.stringify(validatedOptions.filtering),
			)
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
				`Failed to list phone numbers: ${error.error?.message || response.statusText}`,
			)
		}

		const data = await response.json()
		return PhoneNumberListResponseSchema.parse(data)
	}

	/**
	 * Get a specific phone number by ID
	 *
	 * @param phoneNumberId - The phone number ID to retrieve
	 * @param fields - Optional array of fields to include in the response
	 * @returns The phone number information
	 *
	 * @example
	 * ```typescript
	 * const phoneNumber = await client.phoneNumbers.get('PHONE_NUMBER_ID')
	 * console.log(phoneNumber.display_phone_number)
	 * console.log(phoneNumber.quality_rating)
	 * console.log(phoneNumber.verified_name)
	 * ```
	 */
	async get(
		phoneNumberId: string,
		fields?: PhoneNumberFields[],
	): Promise<PhoneNumber> {
		const url = new URL(`${this.baseUrl}/${phoneNumberId}`)

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
				`Failed to get phone number: ${error.error?.message || response.statusText}`,
			)
		}

		const data = await response.json()
		return PhoneNumberSchema.parse(data)
	}

	/**
	 * Get the display name status for a phone number
	 *
	 * This endpoint returns information about the verified business name
	 * associated with the phone number and its approval status.
	 *
	 * @param phoneNumberId - The phone number ID to get display name status for
	 * @returns The display name status information
	 *
	 * @example
	 * ```typescript
	 * const status = await client.phoneNumbers.getDisplayNameStatus('PHONE_NUMBER_ID')
	 * console.log(status.name_status) // 'APPROVED', 'PENDING_REVIEW', etc.
	 * console.log(status.requested_verified_name)
	 * if (status.rejection_reason) {
	 *   console.log('Rejection reason:', status.rejection_reason)
	 * }
	 * ```
	 */
	async getDisplayNameStatus(
		phoneNumberId: string,
	): Promise<DisplayNameStatus> {
		const url = new URL(
			`${this.baseUrl}/${phoneNumberId}/whatsapp_business_display_name`,
		)

		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.config.accessToken}`,
			},
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(
				`Failed to get display name status: ${error.error?.message || response.statusText}`,
			)
		}

		const data = await response.json()
		return DisplayNameStatusSchema.parse(data)
	}

	/**
	 * Check if a phone number is verified
	 *
	 * @param phoneNumberId - The phone number ID to check
	 * @returns True if the phone number is verified
	 *
	 * @example
	 * ```typescript
	 * const isVerified = await client.phoneNumbers.isVerified('PHONE_NUMBER_ID')
	 * if (!isVerified) {
	 *   console.log('Phone number needs verification')
	 * }
	 * ```
	 */
	async isVerified(phoneNumberId: string): Promise<boolean> {
		const phoneNumber = await this.get(phoneNumberId, [
			'code_verification_status',
		])
		return phoneNumber.code_verification_status === 'VERIFIED'
	}

	/**
	 * Get the quality rating of a phone number
	 *
	 * Quality rating affects messaging limits. GREEN is best, RED is worst.
	 *
	 * @param phoneNumberId - The phone number ID to check
	 * @returns The quality rating or undefined if not available
	 *
	 * @example
	 * ```typescript
	 * const rating = await client.phoneNumbers.getQualityRating('PHONE_NUMBER_ID')
	 * switch (rating) {
	 *   case 'GREEN':
	 *     console.log('Excellent quality')
	 *     break
	 *   case 'YELLOW':
	 *     console.log('Good quality, monitor closely')
	 *     break
	 *   case 'RED':
	 *     console.log('Poor quality, messaging limited')
	 *     break
	 * }
	 * ```
	 */
	async getQualityRating(
		phoneNumberId: string,
	): Promise<'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN' | undefined> {
		const phoneNumber = await this.get(phoneNumberId, ['quality_rating'])
		return phoneNumber.quality_rating
	}

	/**
	 * Check if display name is approved
	 *
	 * @param phoneNumberId - The phone number ID to check
	 * @returns True if the display name is approved
	 *
	 * @example
	 * ```typescript
	 * const isApproved = await client.phoneNumbers.isDisplayNameApproved('PHONE_NUMBER_ID')
	 * if (!isApproved) {
	 *   console.log('Display name pending approval or declined')
	 * }
	 * ```
	 */
	async isDisplayNameApproved(phoneNumberId: string): Promise<boolean> {
		const status = await this.getDisplayNameStatus(phoneNumberId)
		return status.name_status === 'APPROVED'
	}

	/**
	 * Get throughput level for a phone number
	 *
	 * @param phoneNumberId - The phone number ID to check
	 * @returns The throughput level or undefined
	 *
	 * @example
	 * ```typescript
	 * const number = await client.phoneNumbers.get('PHONE_NUMBER_ID', ['throughput'])
	 * const level = number.throughput?.level // 'STANDARD' or 'HIGH'
	 * ```
	 */
	async getThroughputLevel(
		phoneNumberId: string,
	): Promise<'STANDARD' | 'HIGH' | undefined> {
		const phoneNumber = await this.get(phoneNumberId, ['throughput'])
		return phoneNumber.throughput?.level
	}
}

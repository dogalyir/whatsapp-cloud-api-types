import { describe, expect, test } from 'bun:test'
import {
	GetSubscriptionsResponseSchema,
	OverrideCallbackURLRequestSchema,
	OverrideCallbackURLResponseSchema,
	SubscribeToWABAResponseSchema,
	UnsubscribeFromWABAResponseSchema,
} from '../src/subscriptions'

describe('Subscription Management Schemas', () => {
	describe('SubscribeToWABAResponseSchema', () => {
		test('should parse valid subscribe response', () => {
			const validResponse = {
				success: true,
			}

			const result = SubscribeToWABAResponseSchema.parse(validResponse)
			expect(result.success).toBe(true)
		})

		test('should parse unsuccessful subscribe response', () => {
			const validResponse = {
				success: false,
			}

			const result = SubscribeToWABAResponseSchema.parse(validResponse)
			expect(result.success).toBe(false)
		})

		test('should fail on invalid response', () => {
			const invalidResponse = {
				status: 'ok',
			}

			expect(() =>
				SubscribeToWABAResponseSchema.parse(invalidResponse),
			).toThrow()
		})
	})

	describe('GetSubscriptionsResponseSchema', () => {
		test('should parse valid subscriptions response with single app', () => {
			const validResponse = {
				data: [
					{
						whatsapp_business_api_data: {
							link: 'https://example.com/app1',
							name: 'App 1',
							id: '7234002551525653',
						},
					},
				],
			}

			const result = GetSubscriptionsResponseSchema.parse(validResponse)
			expect(result.data).toHaveLength(1)
			expect(result.data[0].whatsapp_business_api_data.id).toBe(
				'7234002551525653',
			)
			expect(result.data[0].whatsapp_business_api_data.name).toBe('App 1')
		})

		test('should parse valid subscriptions response with multiple apps', () => {
			const validResponse = {
				data: [
					{
						whatsapp_business_api_data: {
							link: 'https://example.com/app1',
							name: 'App 1',
							id: '7234002551525653',
						},
					},
					{
						whatsapp_business_api_data: {
							link: 'https://example.com/app2',
							name: 'App 2',
							id: '3736565603394103',
						},
					},
				],
			}

			const result = GetSubscriptionsResponseSchema.parse(validResponse)
			expect(result.data).toHaveLength(2)
			expect(result.data[0].whatsapp_business_api_data.id).toBe(
				'7234002551525653',
			)
			expect(result.data[1].whatsapp_business_api_data.id).toBe(
				'3736565603394103',
			)
		})

		test('should parse empty subscriptions response', () => {
			const validResponse = {
				data: [],
			}

			const result = GetSubscriptionsResponseSchema.parse(validResponse)
			expect(result.data).toHaveLength(0)
		})

		test('should fail on missing data field', () => {
			const invalidResponse = {
				subscriptions: [],
			}

			expect(() =>
				GetSubscriptionsResponseSchema.parse(invalidResponse),
			).toThrow()
		})

		test('should fail on invalid app data structure', () => {
			const invalidResponse = {
				data: [
					{
						app_id: '123',
					},
				],
			}

			expect(() =>
				GetSubscriptionsResponseSchema.parse(invalidResponse),
			).toThrow()
		})
	})

	describe('UnsubscribeFromWABAResponseSchema', () => {
		test('should parse valid unsubscribe response', () => {
			const validResponse = {
				success: true,
			}

			const result = UnsubscribeFromWABAResponseSchema.parse(validResponse)
			expect(result.success).toBe(true)
		})

		test('should parse unsuccessful unsubscribe response', () => {
			const validResponse = {
				success: false,
			}

			const result = UnsubscribeFromWABAResponseSchema.parse(validResponse)
			expect(result.success).toBe(false)
		})
	})

	describe('OverrideCallbackURLRequestSchema', () => {
		test('should parse valid override request', () => {
			const validRequest = {
				override_callback_uri: 'https://alternate-endpoint.com/webhook',
				verify_token: 'my-secret-verification-token',
			}

			const result = OverrideCallbackURLRequestSchema.parse(validRequest)
			expect(result.override_callback_uri).toBe(
				'https://alternate-endpoint.com/webhook',
			)
			expect(result.verify_token).toBe('my-secret-verification-token')
		})

		test('should fail on invalid URL', () => {
			const invalidRequest = {
				override_callback_uri: 'not-a-valid-url',
				verify_token: 'token',
			}

			expect(() =>
				OverrideCallbackURLRequestSchema.parse(invalidRequest),
			).toThrow()
		})

		test('should fail on missing verify_token', () => {
			const invalidRequest = {
				override_callback_uri: 'https://example.com/webhook',
			}

			expect(() =>
				OverrideCallbackURLRequestSchema.parse(invalidRequest),
			).toThrow()
		})

		test('should fail on missing override_callback_uri', () => {
			const invalidRequest = {
				verify_token: 'token',
			}

			expect(() =>
				OverrideCallbackURLRequestSchema.parse(invalidRequest),
			).toThrow()
		})
	})

	describe('OverrideCallbackURLResponseSchema', () => {
		test('should parse valid override response', () => {
			const validResponse = {
				data: [
					{
						override_callback_uri: 'https://alternate-endpoint.com/webhook',
						whatsapp_business_api_data: {
							id: '670843887433847',
							link: 'https://www.facebook.com/games/?app_id=670843887433847',
							name: 'Jaspers Market',
						},
					},
				],
			}

			const result = OverrideCallbackURLResponseSchema.parse(validResponse)
			expect(result.data).toHaveLength(1)
			expect(result.data[0].override_callback_uri).toBe(
				'https://alternate-endpoint.com/webhook',
			)
			expect(result.data[0].whatsapp_business_api_data.id).toBe(
				'670843887433847',
			)
			expect(result.data[0].whatsapp_business_api_data.name).toBe(
				'Jaspers Market',
			)
		})

		test('should parse multiple override responses', () => {
			const validResponse = {
				data: [
					{
						override_callback_uri: 'https://endpoint1.com/webhook',
						whatsapp_business_api_data: {
							id: '111111111111111',
							link: 'https://www.facebook.com/app1',
							name: 'App 1',
						},
					},
					{
						override_callback_uri: 'https://endpoint2.com/webhook',
						whatsapp_business_api_data: {
							id: '222222222222222',
							link: 'https://www.facebook.com/app2',
							name: 'App 2',
						},
					},
				],
			}

			const result = OverrideCallbackURLResponseSchema.parse(validResponse)
			expect(result.data).toHaveLength(2)
			expect(result.data[0].override_callback_uri).toBe(
				'https://endpoint1.com/webhook',
			)
			expect(result.data[1].override_callback_uri).toBe(
				'https://endpoint2.com/webhook',
			)
		})

		test('should fail on missing override_callback_uri', () => {
			const invalidResponse = {
				data: [
					{
						whatsapp_business_api_data: {
							id: '123',
							link: 'https://example.com',
							name: 'App',
						},
					},
				],
			}

			expect(() =>
				OverrideCallbackURLResponseSchema.parse(invalidResponse),
			).toThrow()
		})

		test('should fail on invalid app data structure', () => {
			const invalidResponse = {
				data: [
					{
						override_callback_uri: 'https://example.com/webhook',
						app_data: {
							id: '123',
						},
					},
				],
			}

			expect(() =>
				OverrideCallbackURLResponseSchema.parse(invalidResponse),
			).toThrow()
		})
	})

	describe('Type inference', () => {
		test('should have correct TypeScript types', () => {
			const subscribeResponse = SubscribeToWABAResponseSchema.parse({
				success: true,
			})
			// TypeScript should infer the type correctly
			const success: boolean = subscribeResponse.success

			const getResponse = GetSubscriptionsResponseSchema.parse({
				data: [
					{
						whatsapp_business_api_data: {
							id: '123',
							link: 'https://example.com',
							name: 'Test',
						},
					},
				],
			})
			// TypeScript should infer array type
			const firstApp = getResponse.data[0]
			const appId: string = firstApp.whatsapp_business_api_data.id

			const overrideRequest = OverrideCallbackURLRequestSchema.parse({
				override_callback_uri: 'https://example.com/webhook',
				verify_token: 'token',
			})
			const uri: string = overrideRequest.override_callback_uri
			const token: string = overrideRequest.verify_token

			// If this compiles, types are correct
			expect(success).toBeDefined()
			expect(appId).toBeDefined()
			expect(uri).toBeDefined()
			expect(token).toBeDefined()
		})
	})
})

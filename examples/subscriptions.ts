/**
 * Example usage of WhatsApp Business Account Subscription Management Schemas
 *
 * This file demonstrates how to use Zod schemas for validating WhatsApp Business
 * Account subscription API requests and responses.
 */

import {
	type GetSubscriptionsResponse,
	GetSubscriptionsResponseSchema,
	type OverrideCallbackURLRequest,
	OverrideCallbackURLRequestSchema,
	type OverrideCallbackURLResponse,
	OverrideCallbackURLResponseSchema,
	type SubscribeToWABAResponse,
	SubscribeToWABAResponseSchema,
	type UnsubscribeFromWABAResponse,
	UnsubscribeFromWABAResponseSchema,
} from '../src'

// ============================================================================
// 1. Subscribe to a WhatsApp Business Account (WABA)
// ============================================================================

async function subscribeToWABA(
	wabaId: string,
	accessToken: string,
): Promise<SubscribeToWABAResponse> {
	const response = await fetch(
		`https://graph.facebook.com/v18.0/${wabaId}/subscribed_apps`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	)

	const data = await response.json()

	// Validate the response using Zod
	const validatedResponse = SubscribeToWABAResponseSchema.parse(data)

	console.log('Subscription successful:', validatedResponse.success)

	return validatedResponse
}

// Example usage:
// const result = await subscribeToWABA('1234567890', 'your-access-token')
// if (result.success) {
//   console.log('Successfully subscribed to WABA!')
// }

// ============================================================================
// 2. Get All Subscriptions for a WABA
// ============================================================================

async function getAllSubscriptions(
	wabaId: string,
	accessToken: string,
): Promise<GetSubscriptionsResponse> {
	const response = await fetch(
		`https://graph.facebook.com/v18.0/${wabaId}/subscribed_apps`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	)

	const data = await response.json()

	// Validate the response using Zod
	const validatedResponse = GetSubscriptionsResponseSchema.parse(data)

	console.log(`Found ${validatedResponse.data.length} subscribed app(s):`)
	for (const app of validatedResponse.data) {
		console.log(
			`- ${app.whatsapp_business_api_data.name} (ID: ${app.whatsapp_business_api_data.id})`,
		)
	}

	return validatedResponse
}

// Example usage:
// const subscriptions = await getAllSubscriptions('1234567890', 'your-access-token')
// for (const app of subscriptions.data) {
//   console.log('App:', app.whatsapp_business_api_data.name)
// }

// ============================================================================
// 3. Unsubscribe from a WABA
// ============================================================================

async function unsubscribeFromWABA(
	wabaId: string,
	accessToken: string,
): Promise<UnsubscribeFromWABAResponse> {
	const response = await fetch(
		`https://graph.facebook.com/v18.0/${wabaId}/subscribed_apps`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	)

	const data = await response.json()

	// Validate the response using Zod
	const validatedResponse = UnsubscribeFromWABAResponseSchema.parse(data)

	console.log('Unsubscription successful:', validatedResponse.success)

	return validatedResponse
}

// Example usage:
// const result = await unsubscribeFromWABA('1234567890', 'your-access-token')
// if (result.success) {
//   console.log('Successfully unsubscribed from WABA!')
// }

// ============================================================================
// 4. Override Callback URL for a WABA
// ============================================================================

async function overrideCallbackURL(
	wabaId: string,
	accessToken: string,
	callbackUri: string,
	verifyToken: string,
): Promise<OverrideCallbackURLResponse> {
	// Validate the request payload before sending
	const requestPayload: OverrideCallbackURLRequest =
		OverrideCallbackURLRequestSchema.parse({
			override_callback_uri: callbackUri,
			verify_token: verifyToken,
		})

	const response = await fetch(
		`https://graph.facebook.com/v18.0/${wabaId}/subscribed_apps`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestPayload),
		},
	)

	const data = await response.json()

	// Validate the response using Zod
	const validatedResponse = OverrideCallbackURLResponseSchema.parse(data)

	console.log('Override callback URL successful!')
	for (const app of validatedResponse.data) {
		console.log(
			`- ${app.whatsapp_business_api_data.name}: ${app.override_callback_uri}`,
		)
	}

	return validatedResponse
}

// Example usage:
// const result = await overrideCallbackURL(
//   '1234567890',
//   'your-access-token',
//   'https://your-webhook-endpoint.com/webhook',
//   'your-verify-token'
// )

// ============================================================================
// 5. Safe Parsing with Error Handling
// ============================================================================

async function safeGetSubscriptions(
	wabaId: string,
	accessToken: string,
): Promise<GetSubscriptionsResponse | null> {
	try {
		const response = await fetch(
			`https://graph.facebook.com/v18.0/${wabaId}/subscribed_apps`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		)

		const data = await response.json()

		// Use safeParse for graceful error handling
		const result = GetSubscriptionsResponseSchema.safeParse(data)

		if (!result.success) {
			console.error('Invalid response format:', result.error.issues)
			return null
		}

		return result.data
	} catch (error) {
		console.error('Failed to fetch subscriptions:', error)
		return null
	}
}

// Example usage:
// const subscriptions = await safeGetSubscriptions('1234567890', 'your-access-token')
// if (subscriptions) {
//   console.log('Valid subscriptions:', subscriptions)
// } else {
//   console.error('Failed to retrieve valid subscriptions')
// }

// ============================================================================
// 6. Type-Safe Subscription Management Helper
// ============================================================================

class WABASubscriptionManager {
	constructor(
		private wabaId: string,
		private accessToken: string,
		private apiVersion = 'v18.0',
	) {}

	private get baseUrl() {
		return `https://graph.facebook.com/${this.apiVersion}/${this.wabaId}/subscribed_apps`
	}

	async subscribe(): Promise<SubscribeToWABAResponse> {
		const response = await fetch(this.baseUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
			},
		})

		const data = await response.json()
		return SubscribeToWABAResponseSchema.parse(data)
	}

	async getSubscriptions(): Promise<GetSubscriptionsResponse> {
		const response = await fetch(this.baseUrl, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
			},
		})

		const data = await response.json()
		return GetSubscriptionsResponseSchema.parse(data)
	}

	async unsubscribe(): Promise<UnsubscribeFromWABAResponse> {
		const response = await fetch(this.baseUrl, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
			},
		})

		const data = await response.json()
		return UnsubscribeFromWABAResponseSchema.parse(data)
	}

	async overrideCallback(
		callbackUri: string,
		verifyToken: string,
	): Promise<OverrideCallbackURLResponse> {
		const requestPayload = OverrideCallbackURLRequestSchema.parse({
			override_callback_uri: callbackUri,
			verify_token: verifyToken,
		})

		const response = await fetch(this.baseUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestPayload),
		})

		const data = await response.json()
		return OverrideCallbackURLResponseSchema.parse(data)
	}

	async isSubscribed(): Promise<boolean> {
		const subscriptions = await this.getSubscriptions()
		return subscriptions.data.length > 0
	}
}

// Example usage:
// const manager = new WABASubscriptionManager('1234567890', 'your-access-token')
//
// // Subscribe to WABA
// await manager.subscribe()
//
// // Check if subscribed
// const isSubscribed = await manager.isSubscribed()
// console.log('Is subscribed:', isSubscribed)
//
// // Get all subscriptions
// const subs = await manager.getSubscriptions()
// console.log('Subscriptions:', subs.data)
//
// // Override callback URL
// await manager.overrideCallback(
//   'https://new-webhook.com/endpoint',
//   'new-verify-token'
// )
//
// // Unsubscribe
// await manager.unsubscribe()

// ============================================================================
// 7. Express.js Integration Example
// ============================================================================

/*
import express from 'express'

const app = express()
app.use(express.json())

// Subscribe endpoint
app.post('/api/waba/:wabaId/subscribe', async (req, res) => {
	const { wabaId } = req.params
	const { accessToken } = req.body

	try {
		const manager = new WABASubscriptionManager(wabaId, accessToken)
		const result = await manager.subscribe()

		res.json(result)
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(400).json({ error: 'Invalid response from API', details: error.issues })
		} else {
			res.status(500).json({ error: 'Internal server error' })
		}
	}
})

// Get subscriptions endpoint
app.get('/api/waba/:wabaId/subscriptions', async (req, res) => {
	const { wabaId } = req.params
	const accessToken = req.headers.authorization?.replace('Bearer ', '')

	if (!accessToken) {
		return res.status(401).json({ error: 'Missing authorization token' })
	}

	try {
		const manager = new WABASubscriptionManager(wabaId, accessToken)
		const subscriptions = await manager.getSubscriptions()

		res.json(subscriptions)
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch subscriptions' })
	}
})

// Override callback URL endpoint
app.post('/api/waba/:wabaId/override-callback', async (req, res) => {
	const { wabaId } = req.params
	const accessToken = req.headers.authorization?.replace('Bearer ', '')

	if (!accessToken) {
		return res.status(401).json({ error: 'Missing authorization token' })
	}

	try {
		// Validate request body
		const payload = OverrideCallbackURLRequestSchema.parse(req.body)

		const manager = new WABASubscriptionManager(wabaId, accessToken)
		const result = await manager.overrideCallback(
			payload.override_callback_uri,
			payload.verify_token
		)

		res.json(result)
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(400).json({ error: 'Invalid request body', details: error.issues })
		} else {
			res.status(500).json({ error: 'Internal server error' })
		}
	}
})

app.listen(3000, () => {
	console.log('Server running on port 3000')
})
*/

export {
	WABASubscriptionManager,
	getAllSubscriptions,
	overrideCallbackURL,
	safeGetSubscriptions,
	subscribeToWABA,
	unsubscribeFromWABA,
}

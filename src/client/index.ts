import type { z } from 'zod'
import { type WhatsAppConfig, WhatsAppConfigSchema } from './config'
import { ActionsService } from './services/actions'
import { BusinessService } from './services/business'
import { MediaService } from './services/media'
import { MessagesService } from './services/messages'
import { PhoneNumbersService } from './services/phone-numbers'
import { QRCodesService } from './services/qr-codes'
import { RegistrationService } from './services/registration'
import { TemplatesService } from './services/templates'
import { TwoStepVerificationService } from './services/two-step-verification'
import { WABAService } from './services/waba'
import { WebhooksService } from './services/webhooks'

/**
 * WhatsApp Cloud API Client
 *
 * Main client class for interacting with WhatsApp Business Cloud API.
 * Provides a clean, type-safe interface with automatic validation using Zod schemas.
 *
 * @example
 * ```typescript
 * const client = new WhatsAppCloudAPI({
 *   accessToken: 'your-access-token',
 *   phoneNumberId: 'your-phone-number-id',
 *   wabaId: 'your-waba-id', // optional
 * })
 *
 * // Send a text message
 * await client.messages.sendText('1234567890', 'Hello, World!')
 *
 * // Send an image
 * await client.messages.sendImage('1234567890', {
 *   link: 'https://example.com/image.jpg'
 * }, 'Check this out!')
 *
 * // Upload media
 * const uploadResult = await client.media.upload(file, 'image/jpeg')
 *
 * // Get business profile
 * const profile = await client.business.getProfile()
 *
 * // Manage templates
 * const templates = await client.templates.list()
 *
 * // Create QR code
 * const qrCode = await client.qrCodes.create({ prefilled_message: 'Hi!' })
 *
 * // Send typing indicator
 * await client.actions.typing('1234567890')
 *
 * // Manage WABAs
 * const waba = await client.waba.get('WABA_ID')
 * const ownedWabas = await client.waba.getOwned()
 *
 * // Manage phone numbers
 * const phoneNumbers = await client.phoneNumbers.list('WABA_ID')
 * const phoneNumber = await client.phoneNumbers.get('PHONE_NUMBER_ID')
 *
 * // Manage webhooks
 * await client.webhooks.subscribe('WABA_ID')
 * const subscriptions = await client.webhooks.getSubscriptions('WABA_ID')
 * ```
 */
export class WhatsAppCloudAPI {
	/**
	 * Configuration for the WhatsApp Cloud API client
	 */
	public readonly config: WhatsAppConfig

	/**
	 * Messages service for sending and managing messages
	 */
	public readonly messages: MessagesService

	/**
	 * Media service for uploading, retrieving, and deleting media
	 */
	public readonly media: MediaService

	/**
	 * Business service for managing business profile and settings
	 */
	public readonly business: BusinessService

	/**
	 * Templates service for managing message templates
	 */
	public readonly templates: TemplatesService

	/**
	 * Registration service for managing phone number registration
	 */
	public readonly registration: RegistrationService

	/**
	 * QR Codes service for managing WhatsApp QR codes
	 */
	public readonly qrCodes: QRCodesService

	/**
	 * Actions service for typing indicators and read receipts
	 */
	public readonly actions: ActionsService

	/**
	 * Two-step verification service for managing 2FA settings
	 */
	public readonly twoStepVerification: TwoStepVerificationService

	/**
	 * WABA service for managing WhatsApp Business Accounts
	 */
	public readonly waba: WABAService

	/**
	 * Phone Numbers service for managing phone numbers
	 */
	public readonly phoneNumbers: PhoneNumbersService

	/**
	 * Webhooks service for managing webhook subscriptions
	 */
	public readonly webhooks: WebhooksService

	/**
	 * Create a new WhatsApp Cloud API client
	 *
	 * @param config - Configuration object
	 * @throws {z.ZodError} If configuration is invalid
	 *
	 * @example
	 * ```typescript
	 * const client = new WhatsAppCloudAPI({
	 *   accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
	 *   phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
	 *   version: 'v21.0', // optional, defaults to v21.0
	 * })
	 * ```
	 */
	constructor(config: z.input<typeof WhatsAppConfigSchema>) {
		// Validate and parse configuration
		this.config = WhatsAppConfigSchema.parse(config)

		// Initialize services
		this.messages = new MessagesService(this.config)
		this.media = new MediaService(this.config)
		this.business = new BusinessService(this.config)
		this.templates = new TemplatesService(this.config)
		this.registration = new RegistrationService(this.config)
		this.qrCodes = new QRCodesService(this.config)
		this.actions = new ActionsService(this.config)
		this.twoStepVerification = new TwoStepVerificationService(this.config)
		this.waba = new WABAService(this.config)
		this.phoneNumbers = new PhoneNumbersService(this.config)
		this.webhooks = new WebhooksService(this.config)
	}

	/**
	 * Update the access token
	 * Useful when the token expires and needs to be refreshed
	 *
	 * @param newAccessToken - New access token
	 */
	updateAccessToken(newAccessToken: string): void {
		this.config.accessToken = newAccessToken
	}

	/**
	 * Get the current API version being used
	 */
	getVersion(): string {
		return this.config.version
	}

	/**
	 * Get the current phone number ID
	 */
	getPhoneNumberId(): string {
		return this.config.phoneNumberId
	}

	/**
	 * Get the current WABA ID (if set)
	 */
	getWabaId(): string | undefined {
		return this.config.wabaId
	}
}

// Re-export config and error types
export * from './config'
// Re-export action types
export type {
	ChatAction,
	ChatActionResponse,
	MarkAsRead,
} from './services/actions'
export { ActionsService } from './services/actions'
// Re-export business types (no conflicts)
export type {
	BusinessProfile,
	BusinessProfileResponse,
	CommerceSettings,
	CommerceSettingsResponse,
	UpdateBusinessProfileResponse,
} from './services/business'
export { BusinessService } from './services/business'
// Re-export media types (no conflicts)
export type {
	MediaDeleteResponse,
	MediaUploadResponse,
	MediaUrlResponse,
} from './services/media'
export { MediaService } from './services/media'
// Re-export message types with "Send" prefix to avoid webhook conflicts
export type {
	AudioMessage as SendAudioMessage,
	ContactMessage as SendContactMessage,
	DocumentMessage as SendDocumentMessage,
	ImageMessage as SendImageMessage,
	InteractiveButtonMessage as SendInteractiveButtonMessage,
	InteractiveCtaUrlMessage as SendInteractiveCtaUrlMessage,
	InteractiveListMessage as SendInteractiveListMessage,
	LocationMessage as SendLocationMessage,
	MessageContext as SendMessageContext,
	ReactionMessage as SendReactionMessage,
	StickerMessage as SendStickerMessage,
	TemplateMessage as SendTemplateMessage,
	TextMessage as SendTextMessage,
	VideoMessage as SendVideoMessage,
} from './services/messages'
// Re-export service classes
export { MessagesService } from './services/messages'
// Re-export phone numbers types
export type {
	DisplayNameStatus,
	ListPhoneNumbersOptions,
	PhoneNumber,
	PhoneNumberFields,
	PhoneNumberListResponse,
} from './services/phone-numbers'
export { PhoneNumbersService } from './services/phone-numbers'
// Re-export QR code types
export type {
	CreateQRCode,
	QRCodeDeleteResponse,
	QRCodeListResponse,
	QRCodeResponse,
	UpdateQRCode,
} from './services/qr-codes'
export { QRCodesService } from './services/qr-codes'
// Re-export registration types
export type {
	DeregisterPhoneNumberResponse,
	PhoneNumberInfo,
	PhoneNumberRegistration,
	PhoneNumberRegistrationResponse,
	PhoneNumberSettings,
	RequestCode,
	RequestCodeResponse,
	VerifyCode,
	VerifyCodeResponse,
} from './services/registration'
export { RegistrationService } from './services/registration'

// Re-export template types
export type {
	CreateTemplate,
	Template,
	TemplateComponent,
	TemplateDeleteResponse,
	TemplateLanguage,
	TemplateListResponse,
	TemplateParameter,
	TemplateResponse,
} from './services/templates'
export { TemplatesService } from './services/templates'
// Re-export two-step verification types
export type {
	TwoStepVerificationPin,
	TwoStepVerificationResponse,
} from './services/two-step-verification'
export { TwoStepVerificationService } from './services/two-step-verification'
// Re-export WABA types
export type {
	ListWABAOptions,
	WABA,
	WABAFields,
	WABAListResponse,
} from './services/waba'
export { WABAService } from './services/waba'
// Re-export webhooks types
export type {
	SubscribeOptions,
	Subscription,
	SubscriptionsList,
	WebhookField,
} from './services/webhooks'
export { WebhooksService } from './services/webhooks'

import { z } from 'zod'

/**
 * Contact profile object
 */
export const ContactProfileSchema: z.ZodType<{
	name: string
}> = z.object({
	/** Contact's profile name */
	name: z.string(),
})

export type ContactProfile = z.infer<typeof ContactProfileSchema>

/**
 * Contact object
 */
export const ContactSchema: z.ZodType<{
	profile: { name: string }
	wa_id: string
}> = z.object({
	profile: ContactProfileSchema,
	/** WhatsApp ID of the customer */
	wa_id: z.string(),
})

export type Contact = z.infer<typeof ContactSchema>

/**
 * Metadata object
 */
export const MetadataSchema: z.ZodType<{
	display_phone_number: string
	phone_number_id: string
}> = z.object({
	/** The phone number of the business account receiving the webhook */
	display_phone_number: z.string(),
	/** The ID of the phone number receiving the webhook */
	phone_number_id: z.string(),
})

export type Metadata = z.infer<typeof MetadataSchema>

/**
 * Text message object
 */
export const TextMessageSchema: z.ZodType<{
	body: string
}> = z.object({
	/** The text body of the message */
	body: z.string(),
})

export type TextMessage = z.infer<typeof TextMessageSchema>

/**
 * Media object (for images, videos, audio, documents, stickers)
 */
export const MediaObjectSchema: z.ZodType<{
	id: string
	mime_type?: string
	sha256?: string
	caption?: string
	filename?: string
	voice?: boolean
}> = z.object({
	/** Media ID */
	id: z.string(),
	/** MIME type of the media */
	mime_type: z.string().optional(),
	/** SHA256 hash of the media */
	sha256: z.string().optional(),
	/** Caption for the media (images, videos, documents) */
	caption: z.string().optional(),
	/** Filename for documents */
	filename: z.string().optional(),
	/** Whether this is a voice message (for audio) */
	voice: z.boolean().optional(),
})

export type MediaObject = z.infer<typeof MediaObjectSchema>

/**
 * Reaction object
 */
export const ReactionSchema: z.ZodType<{
	message_id: string
	emoji: string
}> = z.object({
	/** The wamid of the message that was reacted to */
	message_id: z.string(),
	/** The emoji used for the reaction */
	emoji: z.string(),
})

export type Reaction = z.infer<typeof ReactionSchema>

/**
 * Location object
 */
export const LocationSchema: z.ZodType<{
	latitude: string
	longitude: string
	name?: string
	address?: string
}> = z.object({
	/** Latitude of the location */
	latitude: z.string(),
	/** Longitude of the location */
	longitude: z.string(),
	/** Name of the location */
	name: z.string().optional(),
	/** Address of the location */
	address: z.string().optional(),
})

export type Location = z.infer<typeof LocationSchema>

/**
 * Context object (for forwarded messages or replies)
 */
export const ContextSchema: z.ZodType<{
	forwarded?: boolean
	frequently_forwarded?: boolean
	from?: string
	id?: string
	referred_product?: {
		catalog_id: string
		product_retailer_id: string
	}
}> = z.object({
	/** Set to true if the message was forwarded */
	forwarded: z.boolean().optional(),
	/** Set to true if the message was frequently forwarded */
	frequently_forwarded: z.boolean().optional(),
	/** Sender's WhatsApp ID (for replies) */
	from: z.string().optional(),
	/** Message ID of the original message being replied to */
	id: z.string().optional(),
	/** Product information (for catalog messages) */
	referred_product: z
		.object({
			catalog_id: z.string(),
			product_retailer_id: z.string(),
		})
		.optional(),
})

export type Context = z.infer<typeof ContextSchema>

/**
 * Button reply object
 */
export const ButtonReplySchema: z.ZodType<{
	id: string
	title: string
}> = z.object({
	/** ID of the button */
	id: z.string(),
	/** Title text of the button */
	title: z.string(),
})

export type ButtonReply = z.infer<typeof ButtonReplySchema>

/**
 * List reply object
 */
export const ListReplySchema: z.ZodType<{
	id: string
	title: string
	description?: string
}> = z.object({
	/** ID of the list item */
	id: z.string(),
	/** Title of the list item */
	title: z.string(),
	/** Description of the list item */
	description: z.string().optional(),
})

export type ListReply = z.infer<typeof ListReplySchema>

/**
 * Interactive object
 */
export const InteractiveSchema: z.ZodType<{
	type: 'button_reply' | 'list_reply'
	button_reply?: { id: string; title: string }
	list_reply?: { id: string; title: string; description?: string }
}> = z.object({
	/** Type of interactive object */
	type: z.enum(['button_reply', 'list_reply']),
	/** Button reply object (if type is button_reply) */
	button_reply: ButtonReplySchema.optional(),
	/** List reply object (if type is list_reply) */
	list_reply: ListReplySchema.optional(),
})

export type Interactive = z.infer<typeof InteractiveSchema>

/**
 * Error object
 */
export const ErrorObjectSchema: z.ZodType<{
	code: number
	details?: string
	title?: string
}> = z.object({
	/** Error code */
	code: z.number().int(),
	/** Error details */
	details: z.string().optional(),
	/** Error title */
	title: z.string().optional(),
})

export type ErrorObject = z.infer<typeof ErrorObjectSchema>

/**
 * Message object
 */
export const MessageSchema: z.ZodType<{
	from: string
	id: string
	timestamp: string
	type:
		| 'text'
		| 'image'
		| 'video'
		| 'audio'
		| 'document'
		| 'sticker'
		| 'location'
		| 'contacts'
		| 'interactive'
		| 'button'
		| 'reaction'
		| 'order'
		| 'system'
		| 'unknown'
	context?: z.infer<typeof ContextSchema>
	text?: { body: string }
	image?: z.infer<typeof MediaObjectSchema>
	video?: z.infer<typeof MediaObjectSchema>
	audio?: z.infer<typeof MediaObjectSchema>
	document?: z.infer<typeof MediaObjectSchema>
	sticker?: z.infer<typeof MediaObjectSchema>
	location?: z.infer<typeof LocationSchema>
	contacts?: Array<unknown>
	interactive?: z.infer<typeof InteractiveSchema>
	button?: { text: string; payload?: string }
	reaction?: z.infer<typeof ReactionSchema>
	order?: unknown
	system?: unknown
	errors?: Array<z.infer<typeof ErrorObjectSchema>>
}> = z.object({
	/** Sender's phone number */
	from: z.string(),
	/** Unique identifier of the message */
	id: z.string(),
	/** Unix timestamp of when the message was sent */
	timestamp: z.string(),
	/** Type of message */
	type: z.enum([
		'text',
		'image',
		'video',
		'audio',
		'document',
		'sticker',
		'location',
		'contacts',
		'interactive',
		'button',
		'reaction',
		'order',
		'system',
		'unknown',
	]),
	/** Context (for replies or forwarded messages) */
	context: ContextSchema.optional(),
	/** Text message content */
	text: TextMessageSchema.optional(),
	/** Image message content */
	image: MediaObjectSchema.optional(),
	/** Video message content */
	video: MediaObjectSchema.optional(),
	/** Audio message content */
	audio: MediaObjectSchema.optional(),
	/** Document message content */
	document: MediaObjectSchema.optional(),
	/** Sticker message content */
	sticker: MediaObjectSchema.optional(),
	/** Location message content */
	location: LocationSchema.optional(),
	/** Contacts message content */
	contacts: z.array(z.unknown()).optional(),
	/** Interactive message content */
	interactive: InteractiveSchema.optional(),
	/** Button message content */
	button: z
		.object({ text: z.string(), payload: z.string().optional() })
		.optional(),
	/** Reaction message content */
	reaction: ReactionSchema.optional(),
	/** Order message content */
	order: z.unknown().optional(),
	/** System message content */
	system: z.unknown().optional(),
	/** Errors related to the message */
	errors: z.array(ErrorObjectSchema).optional(),
})

export type Message = z.infer<typeof MessageSchema>

/**
 * Conversation object
 */
export const ConversationSchema: z.ZodType<{
	id: string
	origin?: {
		type: string
	}
	expiration_timestamp?: string
}> = z.object({
	/** Conversation ID */
	id: z.string(),
	/** Origin of the conversation */
	origin: z
		.object({
			/** Type of conversation (business_initiated, customer_initiated, referral_conversion, etc.) */
			type: z.string(),
		})
		.optional(),
	/** Unix timestamp of when the conversation expires */
	expiration_timestamp: z.string().optional(),
})

export type Conversation = z.infer<typeof ConversationSchema>

/**
 * Pricing object
 */
export const PricingSchema: z.ZodType<{
	pricing_model: 'CBP' | 'NBP'
	billable: boolean
	category: string
}> = z.object({
	/** Pricing model (CBP or NBP) */
	pricing_model: z.enum(['CBP', 'NBP']),
	/** Whether the conversation is billable */
	billable: z.boolean(),
	/** Conversation category for pricing */
	category: z.string(),
})

export type Pricing = z.infer<typeof PricingSchema>

/**
 * Status object
 */
export const StatusSchema: z.ZodType<{
	id: string
	recipient_id: string
	status: 'read' | 'delivered' | 'sent' | 'failed' | 'deleted'
	timestamp: string
	conversation?: z.infer<typeof ConversationSchema>
	pricing?: z.infer<typeof PricingSchema>
	errors?: Array<z.infer<typeof ErrorObjectSchema>>
}> = z.object({
	/** Message ID */
	id: z.string(),
	/** WhatsApp ID of the recipient */
	recipient_id: z.string(),
	/** Status of the message */
	status: z.enum(['read', 'delivered', 'sent', 'failed', 'deleted']),
	/** Unix timestamp of the status update */
	timestamp: z.string(),
	/** Conversation information (for first message in conversation) */
	conversation: ConversationSchema.optional(),
	/** Pricing information */
	pricing: PricingSchema.optional(),
	/** Errors (if status is failed) */
	errors: z.array(ErrorObjectSchema).optional(),
})

export type Status = z.infer<typeof StatusSchema>

/**
 * Value object for messages webhook
 */
export const MessagesValueSchema: z.ZodType<{
	messaging_product: 'whatsapp'
	metadata: z.infer<typeof MetadataSchema>
	contacts?: Array<z.infer<typeof ContactSchema>>
	messages?: Array<z.infer<typeof MessageSchema>>
	statuses?: Array<z.infer<typeof StatusSchema>>
	errors?: Array<z.infer<typeof ErrorObjectSchema>>
}> = z.object({
	/** Messaging product (always "whatsapp") */
	messaging_product: z.literal('whatsapp'),
	/** Metadata about the phone number */
	metadata: MetadataSchema,
	/** Array of contacts (senders) */
	contacts: z.array(ContactSchema).optional(),
	/** Array of messages received */
	messages: z.array(MessageSchema).optional(),
	/** Array of message status updates */
	statuses: z.array(StatusSchema).optional(),
	/** Array of errors */
	errors: z.array(ErrorObjectSchema).optional(),
})

export type MessagesValue = z.infer<typeof MessagesValueSchema>

/**
 * Change object for messages webhook
 */
export const MessagesChangeSchema: z.ZodType<{
	value: z.infer<typeof MessagesValueSchema>
	field: 'messages'
}> = z.object({
	value: MessagesValueSchema,
	field: z.literal('messages'),
})

export type MessagesChange = z.infer<typeof MessagesChangeSchema>

/**
 * Entry object for messages webhook
 */
export const MessagesEntrySchema: z.ZodType<{
	id: string
	changes: Array<z.infer<typeof MessagesChangeSchema>>
}> = z.object({
	/** WhatsApp Business Account ID */
	id: z.string(),
	/** Array of changes */
	changes: z.array(MessagesChangeSchema),
})

export type MessagesEntry = z.infer<typeof MessagesEntrySchema>

/**
 * Complete webhook payload for messages
 */
export const MessagesWebhookSchema: z.ZodType<{
	object: 'whatsapp_business_account'
	entry: Array<z.infer<typeof MessagesEntrySchema>>
}> = z.object({
	object: z.literal('whatsapp_business_account'),
	entry: z.array(MessagesEntrySchema),
})

export type MessagesWebhook = z.infer<typeof MessagesWebhookSchema>

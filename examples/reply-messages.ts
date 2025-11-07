/**
 * Ejemplos de uso del sistema de Reply (Context) en WhatsApp Cloud API
 *
 * Este archivo muestra cómo usar el parámetro `replyToMessageId` para
 * responder a mensajes específicos en WhatsApp, creando un contexto visual
 * de conversación.
 */

import { WhatsAppClient } from '../src/client'

// Inicializar el cliente
const client = new WhatsAppClient({
	accessToken: 'YOUR_ACCESS_TOKEN',
	phoneNumberId: 'YOUR_PHONE_NUMBER_ID',
	apiVersion: 'v18.0',
})

/**
 * Ejemplo 1: Responder a un mensaje de texto simple
 *
 * Cuando un usuario envía un mensaje, WhatsApp devuelve un message_id.
 * Puedes usar ese ID para responder citando el mensaje original.
 */
async function example1_replyToTextMessage() {
	const userPhone = '1234567890'
	const receivedMessageId = 'wamid.HBgNNTIxMTczNjgyNzQVAgARGBI5...'

	// Responder citando el mensaje original
	const response = await client.messages.sendText(
		userPhone,
		'¡Gracias por tu mensaje! Te responderemos pronto.',
		false, // preview_url
		receivedMessageId, // replyToMessageId - esto cita el mensaje original
	)

	console.log('Mensaje enviado:', response)
}

/**
 * Ejemplo 2: Responder con una imagen
 *
 * Útil para responder preguntas sobre productos con imágenes
 */
async function example2_replyWithImage() {
	const userPhone = '1234567890'
	const questionMessageId = 'wamid.ABC123...'

	await client.messages.sendImage(
		userPhone,
		{
			link: 'https://example.com/producto.jpg',
		},
		'Aquí está el producto que buscas. Precio: $99.99',
		questionMessageId, // Cita la pregunta del usuario
	)
}

/**
 * Ejemplo 3: Responder con un documento
 *
 * Ideal para enviar cotizaciones, contratos, o PDFs informativos
 */
async function example3_replyWithDocument() {
	const userPhone = '1234567890'
	const requestMessageId = 'wamid.DOC456...'

	await client.messages.sendDocument(
		userPhone,
		{
			link: 'https://example.com/cotizacion.pdf',
		},
		'Adjunto encontrarás la cotización solicitada',
		'Cotizacion_2024.pdf',
		requestMessageId, // Cita la solicitud original
	)
}

/**
 * Ejemplo 4: Responder con ubicación
 *
 * Útil para compartir direcciones de tiendas, oficinas, etc.
 */
async function example4_replyWithLocation() {
	const userPhone = '1234567890'
	const locationRequestId = 'wamid.LOC789...'

	await client.messages.sendLocation(
		userPhone,
		{
			latitude: 37.7749,
			longitude: -122.4194,
			name: 'Nuestra Oficina Principal',
			address: 'Market St, San Francisco, CA 94103',
		},
		locationRequestId, // Cita la pregunta sobre ubicación
	)
}

/**
 * Ejemplo 5: Responder con botones interactivos
 *
 * Permite crear menús de opciones como respuesta a un mensaje
 */
async function example5_replyWithInteractiveButtons() {
	const userPhone = '1234567890'
	const helpRequestId = 'wamid.HELP123...'

	await client.messages.sendInteractiveButtons(
		userPhone,
		{
			type: 'button',
			header: {
				type: 'text',
				text: '¿En qué podemos ayudarte?',
			},
			body: {
				text: 'Selecciona el departamento que necesitas:',
			},
			footer: {
				text: 'Horario: 9AM - 6PM',
			},
			action: {
				buttons: [
					{
						type: 'reply',
						reply: {
							id: 'support',
							title: '🛠 Soporte Técnico',
						},
					},
					{
						type: 'reply',
						reply: {
							id: 'sales',
							title: '💰 Ventas',
						},
					},
					{
						type: 'reply',
						reply: {
							id: 'billing',
							title: '📄 Facturación',
						},
					},
				],
			},
		},
		helpRequestId, // Cita la solicitud de ayuda
	)
}

/**
 * Ejemplo 6: Responder con lista interactiva
 *
 * Ideal para catálogos de productos, menús, etc.
 */
async function example6_replyWithInteractiveList() {
	const userPhone = '1234567890'
	const catalogRequestId = 'wamid.CAT456...'

	await client.messages.sendInteractiveList(
		userPhone,
		{
			type: 'list',
			header: {
				type: 'text',
				text: 'Nuestro Catálogo',
			},
			body: {
				text: 'Selecciona una categoría para ver los productos disponibles',
			},
			footer: {
				text: 'Todos los precios en USD',
			},
			action: {
				button: 'Ver Categorías',
				sections: [
					{
						title: 'Electrónica',
						rows: [
							{
								id: 'elec_phones',
								title: 'Teléfonos',
								description: 'Smartphones y accesorios',
							},
							{
								id: 'elec_laptops',
								title: 'Laptops',
								description: 'Computadoras portátiles',
							},
						],
					},
					{
						title: 'Ropa',
						rows: [
							{
								id: 'cloth_men',
								title: 'Hombre',
								description: 'Ropa y accesorios para hombre',
							},
							{
								id: 'cloth_women',
								title: 'Mujer',
								description: 'Ropa y accesorios para mujer',
							},
						],
					},
				],
			},
		},
		catalogRequestId, // Cita la solicitud del catálogo
	)
}

/**
 * Ejemplo 7: Responder con CTA (Call to Action) URL
 *
 * Útil para dirigir usuarios a sitios web, formularios, etc.
 */
async function example7_replyWithCtaUrl() {
	const userPhone = '1234567890'
	const infoRequestId = 'wamid.INFO789...'

	await client.messages.sendCtaUrl(
		userPhone,
		{
			type: 'cta_url',
			header: {
				type: 'text',
				text: 'Más Información',
			},
			body: {
				text: 'Visita nuestro sitio web para conocer todos los detalles sobre nuestros servicios y promociones actuales.',
			},
			footer: {
				text: 'Disponible 24/7',
			},
			action: {
				name: 'cta_url',
				parameters: {
					display_text: 'Visitar Sitio Web',
					url: 'https://example.com',
				},
			},
		},
		infoRequestId, // Cita la solicitud de información
	)
}

/**
 * Ejemplo 8: Flujo de conversación completo con replies
 *
 * Simula un flujo de servicio al cliente usando replies
 */
async function example8_completeConversationFlow() {
	const userPhone = '1234567890'

	// 1. Usuario pregunta por un producto (simulado)
	const productQuestionId = 'wamid.PROD001...'

	// 2. Respondemos con información del producto
	const productInfoResponse = await client.messages.sendText(
		userPhone,
		'Tenemos ese producto disponible. Te envío los detalles...',
		false,
		productQuestionId,
	)

	// 3. Enviamos imagen del producto como reply a nuestra respuesta anterior
	if (productInfoResponse.messages?.[0]?.id) {
		await client.messages.sendImage(
			userPhone,
			{
				link: 'https://example.com/producto-premium.jpg',
			},
			'Producto Premium - $149.99\n\n✅ Garantía de 2 años\n✅ Envío gratis\n✅ Stock disponible',
			productInfoResponse.messages[0].id,
		)
	}

	// 4. Usuario pregunta por el envío (simulado)
	const shippingQuestionId = 'wamid.SHIP002...'

	// 5. Respondemos con botones de opciones de envío
	await client.messages.sendInteractiveButtons(
		userPhone,
		{
			type: 'button',
			body: {
				text: 'Ofrecemos diferentes opciones de envío:',
			},
			action: {
				buttons: [
					{
						type: 'reply',
						reply: {
							id: 'standard',
							title: 'Estándar (5-7 días)',
						},
					},
					{
						type: 'reply',
						reply: {
							id: 'express',
							title: 'Express (2-3 días)',
						},
					},
				],
			},
		},
		shippingQuestionId,
	)
}

/**
 * Ejemplo 9: Manejo de errores al usar replies
 */
async function example9_errorHandling() {
	const userPhone = '1234567890'
	const invalidMessageId = 'wamid.INVALID...'

	try {
		await client.messages.sendText(
			userPhone,
			'Esta respuesta fallará si el message_id no es válido',
			false,
			invalidMessageId,
		)
	} catch (error) {
		console.error('Error al enviar mensaje con reply:', error)
		// Webhook recibirá código 131009 si el mensaje no existe o es muy antiguo (>30 días)

		// Estrategia de fallback: enviar sin reply
		await client.messages.sendText(
			userPhone,
			'Esta respuesta se envía sin contexto como fallback',
		)
	}
}

/**
 * Ejemplo 10: Reaccionar a un mensaje Y responder
 *
 * Combina reacción con mensaje de texto
 */
async function example10_reactAndReply() {
	const userPhone = '1234567890'
	const userMessageId = 'wamid.USER123...'

	// 1. Primero reaccionamos al mensaje (like)
	await client.messages.sendReaction(userPhone, userMessageId, '👍')

	// 2. Luego respondemos con contexto
	await client.messages.sendText(
		userPhone,
		'¡Excelente pregunta! Te respondo...',
		false,
		userMessageId,
	)
}

/**
 * Ejemplo 11: Enviar template como reply
 *
 * Útil para confirmaciones de pedidos, citas, etc.
 */
async function example11_replyWithTemplate() {
	const userPhone = '1234567890'
	const orderMessageId = 'wamid.ORDER456...'

	await client.messages.sendTemplate(
		userPhone,
		{
			name: 'order_confirmation',
			language: {
				code: 'es',
			},
			components: [
				{
					type: 'body',
					parameters: [
						{
							type: 'text',
							text: 'Juan Pérez',
						},
						{
							type: 'text',
							text: '#ORD12345',
						},
						{
							type: 'text',
							text: '$149.99',
						},
					],
				},
			],
		},
		orderMessageId, // Cita el mensaje del pedido
	)
}

/**
 * Ejemplo 12: Múltiples replies en secuencia
 *
 * Útil para tutoriales paso a paso o instrucciones
 */
async function example12_sequentialReplies() {
	const userPhone = '1234567890'
	const helpRequestId = 'wamid.HELP789...'

	// Paso 1
	const step1 = await client.messages.sendText(
		userPhone,
		'Paso 1: Descarga la aplicación desde tu tienda de apps',
		false,
		helpRequestId,
	)

	// Paso 2 - responde al paso 1
	if (step1.messages?.[0]?.id) {
		const step2 = await client.messages.sendText(
			userPhone,
			'Paso 2: Abre la aplicación y crea tu cuenta',
			false,
			step1.messages[0].id,
		)

		// Paso 3 - responde al paso 2
		if (step2.messages?.[0]?.id) {
			await client.messages.sendText(
				userPhone,
				'Paso 3: Verifica tu email y ¡listo! 🎉',
				false,
				step2.messages[0].id,
			)
		}
	}
}

// Exportar todas las funciones de ejemplo
export {
	example1_replyToTextMessage,
	example2_replyWithImage,
	example3_replyWithDocument,
	example4_replyWithLocation,
	example5_replyWithInteractiveButtons,
	example6_replyWithInteractiveList,
	example7_replyWithCtaUrl,
	example8_completeConversationFlow,
	example9_errorHandling,
	example10_reactAndReply,
	example11_replyWithTemplate,
	example12_sequentialReplies,
}

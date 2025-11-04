# WhatsApp Cloud API Client

Un cliente completo y tipado para la API de WhatsApp Business Cloud, construido con TypeScript y Zod para validación en tiempo de ejecución.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Inicio Rápido](#inicio-rápido)
- [Configuración](#configuración)
- [Servicios](#servicios)
  - [Messages (Mensajes)](#messages-mensajes)
  - [Media (Medios)](#media-medios)
  - [Business (Perfil de Negocio)](#business-perfil-de-negocio)
  - [Templates (Plantillas)](#templates-plantillas)
  - [Actions (Acciones)](#actions-acciones)
  - [Registration (Registro)](#registration-registro)
  - [QR Codes (Códigos QR)](#qr-codes-códigos-qr)
  - [Two-Step Verification (Verificación en Dos Pasos)](#two-step-verification-verificación-en-dos-pasos)
  - [WABA (Cuentas de WhatsApp Business)](#waba-cuentas-de-whatsapp-business)
  - [Phone Numbers (Números de Teléfono)](#phone-numbers-números-de-teléfono)
  - [Webhooks](#webhooks)
- [Manejo de Errores](#manejo-de-errores)
- [Tipos y Validación](#tipos-y-validación)

## Instalación

```bash
bun add whatsapp-cloud-api-types
```

## Inicio Rápido

```typescript
import { WhatsAppCloudAPI } from 'whatsapp-cloud-api-types/client'

// Inicializar el cliente
const client = new WhatsAppCloudAPI({
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
  wabaId: process.env.WHATSAPP_WABA_ID, // Opcional
  version: 'v21.0', // Opcional, por defecto v21.0
})

// Enviar un mensaje de texto
const response = await client.messages.sendText('1234567890', '¡Hola, Mundo!')
console.log('Mensaje enviado:', response.messages?.[0].id)
```

## Configuración

### Opciones de Configuración

```typescript
interface WhatsAppConfig {
  // Token de acceso de tu WhatsApp Business Account
  accessToken: string

  // ID del número de teléfono de WhatsApp Business
  phoneNumberId: string

  // ID de WhatsApp Business Account (opcional, requerido para algunos endpoints)
  wabaId?: string

  // Versión de la API (por defecto: v21.0)
  version?: string

  // URL base de la API (por defecto: https://graph.facebook.com)
  baseUrl?: string
}
```

### Ejemplo de Configuración Completa

```typescript
const client = new WhatsAppCloudAPI({
  accessToken: 'EAAxxxxxxxxxxxxx',
  phoneNumberId: '123456789',
  wabaId: '987654321',
  version: 'v21.0',
  baseUrl: 'https://graph.facebook.com',
})
```

### Métodos de Configuración

```typescript
// Actualizar el token de acceso
client.updateAccessToken('nuevo-token')

// Obtener información de configuración
const version = client.getVersion()
const phoneNumberId = client.getPhoneNumberId()
const wabaId = client.getWabaId()
```

## Servicios

### Messages (Mensajes)

Servicio para enviar y gestionar mensajes de WhatsApp.

#### Enviar Mensaje de Texto

```typescript
// Mensaje de texto simple
await client.messages.sendText('1234567890', 'Hola, ¿cómo estás?')

// Con previsualización de URL
await client.messages.sendText(
  '1234567890',
  'Visita https://ejemplo.com',
  true // habilitar preview_url
)
```

#### Enviar Imagen

```typescript
// Por ID de media (previamente subido)
await client.messages.sendImage(
  '1234567890',
  { id: 'media-id' },
  'Mira esta imagen'
)

// Por URL
await client.messages.sendImage(
  '1234567890',
  { link: 'https://ejemplo.com/imagen.jpg' },
  'Descripción de la imagen'
)
```

#### Enviar Video

```typescript
await client.messages.sendVideo(
  '1234567890',
  { link: 'https://ejemplo.com/video.mp4' },
  'Video descriptivo'
)
```

#### Enviar Audio

```typescript
await client.messages.sendAudio('1234567890', {
  link: 'https://ejemplo.com/audio.mp3',
})
```

#### Enviar Documento

```typescript
await client.messages.sendDocument(
  '1234567890',
  { link: 'https://ejemplo.com/documento.pdf' },
  'Documento importante',
  'reporte-mensual.pdf' // nombre del archivo
)
```

#### Enviar Sticker

```typescript
await client.messages.sendSticker('1234567890', {
  id: 'sticker-media-id',
})
```

#### Enviar Ubicación

```typescript
await client.messages.sendLocation('1234567890', {
  latitude: 40.7128,
  longitude: -74.006,
  name: 'Nueva York',
  address: 'Nueva York, NY, USA',
})
```

#### Enviar Contactos

```typescript
await client.messages.sendContacts('1234567890', [
  {
    name: {
      formatted_name: 'Juan Pérez',
      first_name: 'Juan',
      last_name: 'Pérez',
    },
    phones: [
      {
        phone: '+1234567890',
        type: 'CELL',
      },
    ],
    emails: [
      {
        email: 'juan@ejemplo.com',
        type: 'WORK',
      },
    ],
  },
])
```

#### Enviar Plantilla (Template)

```typescript
await client.messages.sendTemplate('1234567890', {
  name: 'nombre_plantilla',
  language: {
    code: 'es',
  },
  components: [
    {
      type: 'body',
      parameters: [
        {
          type: 'text',
          text: 'Juan',
        },
      ],
    },
  ],
})
```

#### Mensajes Interactivos - Botones

```typescript
await client.messages.sendInteractiveButtons('1234567890', {
  type: 'button',
  body: {
    text: '¿Qué te gustaría hacer?',
  },
  action: {
    buttons: [
      {
        type: 'reply',
        reply: {
          id: 'btn-1',
          title: 'Ver más',
        },
      },
      {
        type: 'reply',
        reply: {
          id: 'btn-2',
          title: 'Contactar',
        },
      },
    ],
  },
})
```

#### Mensajes Interactivos - Lista

```typescript
await client.messages.sendInteractiveList('1234567890', {
  type: 'list',
  header: {
    type: 'text',
    text: 'Nuestros Servicios',
  },
  body: {
    text: 'Selecciona un servicio',
  },
  footer: {
    text: 'Powered by Mi Empresa',
  },
  action: {
    button: 'Ver Servicios',
    sections: [
      {
        title: 'Servicios Principales',
        rows: [
          {
            id: 'srv-1',
            title: 'Consultoría',
            description: 'Consultoría profesional',
          },
          {
            id: 'srv-2',
            title: 'Desarrollo',
            description: 'Desarrollo de software',
          },
        ],
      },
    ],
  },
})
```

#### Reacciones

```typescript
// Enviar reacción a un mensaje
await client.messages.sendReaction('1234567890', 'message-id', '👍')

// Remover reacción
await client.messages.removeReaction('1234567890', 'message-id')
```

#### Marcar como Leído

```typescript
await client.messages.markAsRead('message-id')
```

### Media (Medios)

Servicio para gestionar archivos multimedia.

#### Subir Media

```typescript
// Desde un archivo File (navegador)
const file = document.getElementById('fileInput').files[0]
const result = await client.media.upload(file, 'image/jpeg')
console.log('Media ID:', result.id)

// Desde un Buffer (Node.js)
const buffer = fs.readFileSync('./imagen.jpg')
const result = await client.media.upload(buffer, 'image/jpeg', 'imagen.jpg')

// Desde un Blob
const blob = new Blob([data], { type: 'image/jpeg' })
const result = await client.media.upload(blob, 'image/jpeg', 'foto.jpg')
```

#### Subir Media desde URL

```typescript
const result = await client.media.uploadFromUrl(
  'https://ejemplo.com/imagen.jpg',
  'image/jpeg',
  'mi-imagen.jpg'
)
console.log('Media ID:', result.id)
```

#### Obtener URL de Media

```typescript
const mediaInfo = await client.media.getUrl('media-id')
console.log('URL:', mediaInfo.url)
console.log('MIME type:', mediaInfo.mime_type)
console.log('Tamaño:', mediaInfo.file_size)
```

#### Descargar Media

```typescript
// Obtener solo el contenido
const arrayBuffer = await client.media.download('https://media-url.com/file')

// Obtener info completa con contenido
const mediaWithContent = await client.media.get('media-id')
console.log('URL:', mediaWithContent.url)
console.log('Contenido:', mediaWithContent.content)
```

#### Eliminar Media

```typescript
const result = await client.media.delete('media-id')
console.log('Eliminado:', result.success)
```

### Business (Perfil de Negocio)

Gestiona el perfil de tu negocio en WhatsApp.

#### Obtener Perfil de Negocio

```typescript
const profile = await client.business.getProfile()
console.log('Nombre:', profile.data[0].about)
console.log('Descripción:', profile.data[0].description)
```

#### Actualizar Perfil de Negocio

```typescript
await client.business.updateProfile({
  about: 'Somos una empresa líder en tecnología',
  description: 'Ofrecemos soluciones innovadoras',
  email: 'contacto@empresa.com',
  address: 'Calle Principal 123',
  websites: ['https://www.empresa.com'],
  vertical: 'RETAIL',
})
```

#### Configuración de Comercio

```typescript
// Obtener configuración
const settings = await client.business.getCommerceSettings()
console.log('Catálogo visible:', settings.data[0].is_catalog_visible)

// Actualizar configuración
await client.business.updateCommerceSettings({
  is_catalog_visible: true,
  is_cart_enabled: true,
})
```

#### Información del Número de Teléfono

```typescript
const info = await client.business.getPhoneNumberInfo()
console.log('Nombre verificado:', info.verified_name)
console.log('Número:', info.display_phone_number)
console.log('Calidad:', info.quality_rating) // GREEN, YELLOW, RED, UNKNOWN
```

### Templates (Plantillas)

Gestiona plantillas de mensajes.

#### Crear Plantilla

```typescript
const template = await client.templates.create({
  name: 'bienvenida',
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'HEADER',
      format: 'TEXT',
      text: 'Bienvenido {{1}}',
    },
    {
      type: 'BODY',
      text: 'Gracias por unirte a nosotros. Tu código es: {{1}}',
    },
    {
      type: 'FOOTER',
      text: 'Powered by Mi Empresa',
    },
  ],
})
console.log('Template ID:', template.id)
console.log('Estado:', template.status)
```

#### Listar Plantillas

```typescript
// Todas las plantillas
const templates = await client.templates.list()

// Con paginación
const templates = await client.templates.list({
  limit: 10,
  after: 'cursor-id',
})

for (const template of templates.data) {
  console.log(`${template.name} - ${template.status}`)
}
```

#### Obtener Plantilla por ID

```typescript
const template = await client.templates.get('template-id')
console.log('Nombre:', template.name)
console.log('Estado:', template.status)
```

#### Obtener Plantillas por Nombre

```typescript
const versions = await client.templates.getByName('bienvenida')
for (const version of versions.data) {
  console.log(`Idioma: ${version.language} - Estado: ${version.status}`)
}
```

#### Filtrar por Estado

```typescript
const approved = await client.templates.getByStatus('APPROVED', { limit: 20 })
const pending = await client.templates.getByStatus('PENDING')
```

#### Eliminar Plantilla

```typescript
await client.templates.delete('nombre-plantilla')
```

### Actions (Acciones)

Indicadores de escritura y confirmaciones de lectura.

#### Indicador de Escritura

```typescript
// Mostrar "escribiendo..." por ~10 segundos
await client.actions.typing('1234567890')
```

#### Marcar como Leído

```typescript
await client.actions.markAsRead('message-id')
```

#### Escribir y Enviar (Helper)

```typescript
// Muestra "escribiendo", espera, y envía el mensaje
await client.actions.typingThenSend(
  '1234567890',
  'Hola, ¿cómo puedo ayudarte?',
  3000 // esperar 3 segundos
)
```

### Registration (Registro)

Gestiona el registro de números de teléfono.

#### Registrar Número

```typescript
await client.registration.register('123456') // PIN de 6 dígitos
```

#### Desregistrar Número

```typescript
await client.registration.deregister()
```

#### Obtener Información del Número

```typescript
const info = await client.registration.getInfo()
console.log('Nombre verificado:', info.verified_name)
console.log('Calidad:', info.quality_rating)
console.log('Nivel de throughput:', info.throughput.level)
console.log('Estado de verificación:', info.code_verification_status)
console.log('Modo de cuenta:', info.account_mode) // SANDBOX o LIVE
```

#### Solicitar Código de Verificación

```typescript
// Por SMS
await client.registration.requestCode('SMS', 'es')

// Por llamada de voz
await client.registration.requestCode('VOICE', 'es')
```

#### Verificar Código

```typescript
await client.registration.verifyCode('123456')
```

#### Actualizar Configuración

```typescript
// Cambiar PIN
await client.registration.updateSettings({
  pin: '654321',
})
```

### QR Codes (Códigos QR)

Gestiona códigos QR para iniciar conversaciones.

#### Crear Código QR

```typescript
const qrCode = await client.qrCodes.create({
  prefilled_message: '¡Hola! Me gustaría más información',
  generate_qr_image: 'PNG',
})

console.log('Código:', qrCode.code)
console.log('Deep Link:', qrCode.deep_link_url)
console.log('Imagen QR:', qrCode.qr_image_url)
```

#### Listar Códigos QR

```typescript
const codes = await client.qrCodes.list()
for (const code of codes.data) {
  console.log(`${code.code}: ${code.deep_link_url}`)
}
```

#### Obtener Código QR Específico

```typescript
const code = await client.qrCodes.get('qr-code-id')
```

#### Obtener Imagen del QR

```typescript
// PNG
const qrPng = await client.qrCodes.getImage('qr-code-id', 'PNG')

// SVG
const qrSvg = await client.qrCodes.getImage('qr-code-id', 'SVG')

console.log('URL de imagen:', qrPng.qr_image_url)
```

#### Actualizar Código QR

```typescript
await client.qrCodes.update('qr-code-id', {
  prefilled_message: 'Nuevo mensaje predefinido',
})
```

#### Eliminar Código QR

```typescript
await client.qrCodes.delete('qr-code-id')
```

### Two-Step Verification (Verificación en Dos Pasos)

Gestiona la autenticación de dos factores.

#### Establecer PIN

```typescript
await client.twoStepVerification.setPin('123456')
```

#### Remover PIN

```typescript
await client.twoStepVerification.removePin()
```

### WABA (Cuentas de WhatsApp Business)

Gestiona cuentas de WhatsApp Business.

#### Obtener WABA Específica

```typescript
const waba = await client.waba.get('waba-id')
console.log('Nombre:', waba.name)
console.log('Estado:', waba.account_review_status)
console.log('Verificación:', waba.business_verification_status)
```

#### Obtener WABAs Propias

```typescript
// Todas las WABAs que posees
const ownedWabas = await client.waba.getOwned()

// Con campos específicos
const wabas = await client.waba.getOwned({
  fields: ['id', 'name', 'account_review_status'],
  limit: 10,
})

for (const waba of wabas.data) {
  console.log(`${waba.name} (${waba.id})`)
}
```

#### Obtener WABAs Compartidas

```typescript
const sharedWabas = await client.waba.getShared('user-id', {
  fields: ['id', 'name'],
})
```

#### Obtener Primera WABA

```typescript
// Útil cuando solo tienes una WABA
const waba = await client.waba.getFirst()
if (waba) {
  console.log('Usando WABA:', waba.id)
}
```

#### Verificar Estado

```typescript
// Verificar si está verificada
const isVerified = await client.waba.isVerified('waba-id')

// Verificar si está aprobada
const isApproved = await client.waba.isApproved('waba-id')
```

### Phone Numbers (Números de Teléfono)

Gestiona números de teléfono asociados a WABAs.

#### Listar Números de Teléfono

```typescript
// Todos los números de una WABA
const numbers = await client.phoneNumbers.list('waba-id')

// Con campos específicos
const numbers = await client.phoneNumbers.list('waba-id', {
  fields: ['id', 'display_phone_number', 'quality_rating'],
  limit: 10,
})

// Con filtros
const verifiedNumbers = await client.phoneNumbers.list('waba-id', {
  filtering: [
    {
      field: 'code_verification_status',
      operator: 'EQUAL',
      value: 'VERIFIED',
    },
  ],
})
```

#### Obtener Número Específico

```typescript
const number = await client.phoneNumbers.get('phone-number-id')
console.log('Número:', number.display_phone_number)
console.log('Nombre verificado:', number.verified_name)
console.log('Calidad:', number.quality_rating)
console.log('Throughput:', number.throughput?.level)
```

#### Estado del Nombre de Visualización

```typescript
const status = await client.phoneNumbers.getDisplayNameStatus('phone-number-id')
console.log('Estado:', status.name_status)
console.log('Nombre solicitado:', status.requested_verified_name)
if (status.rejection_reason) {
  console.log('Razón de rechazo:', status.rejection_reason)
}
```

#### Verificaciones de Estado

```typescript
// Verificar si está verificado
const isVerified = await client.phoneNumbers.isVerified('phone-number-id')

// Obtener calificación de calidad
const rating = await client.phoneNumbers.getQualityRating('phone-number-id')

// Verificar aprobación del nombre
const isApproved = await client.phoneNumbers.isDisplayNameApproved(
  'phone-number-id'
)

// Obtener nivel de throughput
const level = await client.phoneNumbers.getThroughputLevel('phone-number-id')
```

### Webhooks

Gestiona suscripciones a webhooks.

#### Suscribirse a Webhooks

```typescript
// Suscripción básica (usa configuración de la app)
await client.webhooks.subscribe('waba-id')

// Con callback URL personalizado
await client.webhooks.subscribe('waba-id', {
  override_callback_uri: 'https://mi-app.com/webhook',
  verify_token: 'mi-token-secreto',
})
```

#### Suscribirse a Campos Específicos

```typescript
await client.webhooks.subscribeToFields(
  'waba-id',
  [
    'messages',
    'message_template_status_update',
    'account_alerts',
  ],
  {
    override_callback_uri: 'https://mi-app.com/webhook',
  }
)
```

#### Obtener Suscripciones

```typescript
const subscriptions = await client.webhooks.getSubscriptions('waba-id')
console.log('Suscripciones activas:', subscriptions.data.length)
```

#### Verificar Suscripción

```typescript
const isSubscribed = await client.webhooks.isSubscribed('waba-id')
if (!isSubscribed) {
  await client.webhooks.subscribe('waba-id')
}
```

#### Actualizar Callback URL

```typescript
await client.webhooks.updateCallbackUrl(
  'waba-id',
  'https://nuevo-endpoint.com/webhook',
  'nuevo-verify-token'
)
```

#### Desuscribirse

```typescript
await client.webhooks.unsubscribe('waba-id')
```

## Manejo de Errores

El cliente utiliza la clase personalizada `WhatsAppApiError` para errores de API.

```typescript
import { WhatsAppApiError } from 'whatsapp-cloud-api-types/client'

try {
  await client.messages.sendText('numero-invalido', 'Hola')
} catch (error) {
  if (error instanceof WhatsAppApiError) {
    console.error('Código de error:', error.code)
    console.error('Tipo:', error.type)
    console.error('Mensaje:', error.message)
    console.error('Subcódigo:', error.subcode)
    console.error('Trace ID:', error.fbtraceId)
  } else {
    console.error('Error inesperado:', error)
  }
}
```

### Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 100 | Parámetro inválido |
| 131030 | Límite de tasa excedido |
| 131031 | Cuenta baneada |
| 131047 | Mensaje re-engagement requerido |
| 131051 | Número de teléfono no soportado |
| 133016 | Acceso denegado |
| 190 | Token de acceso inválido o expirado |

## Tipos y Validación

Todos los datos son validados usando Zod schemas en tiempo de ejecución.

```typescript
import type {
  TextMessage,
  ImageMessage,
  Template,
  BusinessProfile,
  PhoneNumber,
  WABA,
} from 'whatsapp-cloud-api-types/client'

// Los tipos están completamente tipados con TypeScript
const message: TextMessage = {
  messaging_product: 'whatsapp',
  recipient_type: 'individual',
  to: '1234567890',
  type: 'text',
  text: {
    body: 'Hola',
  },
}
```

### Re-exportación de Tipos

El cliente re-exporta todos los tipos necesarios:

```typescript
import {
  // Cliente
  WhatsAppCloudAPI,
  
  // Configuración
  type WhatsAppConfig,
  WhatsAppApiError,
  
  // Servicios
  MessagesService,
  MediaService,
  BusinessService,
  TemplatesService,
  ActionsService,
  RegistrationService,
  QRCodesService,
  TwoStepVerificationService,
  WABAService,
  PhoneNumbersService,
  WebhooksService,
  
  // Tipos de mensajes (con prefijo Send para evitar conflictos con webhooks)
  type SendTextMessage,
  type SendImageMessage,
  type SendAudioMessage,
  type SendVideoMessage,
  type SendDocumentMessage,
  type SendStickerMessage,
  type SendLocationMessage,
  type SendContactMessage,
  type SendTemplateMessage,
  type SendInteractiveButtonMessage,
  type SendInteractiveListMessage,
  type SendReactionMessage,
  
  // Tipos de otros servicios
  type BusinessProfile,
  type Template,
  type PhoneNumber,
  type WABA,
  type QRCodeResponse,
  type MediaUploadResponse,
  
  // Y muchos más...
} from 'whatsapp-cloud-api-types/client'
```

## Ejemplos Completos

### Bot de Atención al Cliente

```typescript
import { WhatsAppCloudAPI } from 'whatsapp-cloud-api-types/client'

const client = new WhatsAppCloudAPI({
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
})

async function handleCustomerMessage(from: string, messageId: string, text: string) {
  // Marcar como leído
  await client.actions.markAsRead(messageId)
  
  // Mostrar indicador de escritura
  await client.actions.typing(from)
  
  // Esperar 2 segundos
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Enviar menú interactivo
  await client.messages.sendInteractiveButtons(from, {
    type: 'button',
    body: {
      text: '¿En qué puedo ayudarte hoy?',
    },
    action: {
      buttons: [
        {
          type: 'reply',
          reply: { id: 'sales', title: 'Ventas' },
        },
        {
          type: 'reply',
          reply: { id: 'support', title: 'Soporte' },
        },
        {
          type: 'reply',
          reply: { id: 'info', title: 'Información' },
        },
      ],
    },
  })
}
```

### Sistema de Notificaciones

```typescript
async function sendOrderConfirmation(
  phoneNumber: string,
  orderNumber: string,
  total: string
) {
  // Enviar plantilla de confirmación
  await client.messages.sendTemplate(phoneNumber, {
    name: 'order_confirmation',
    language: { code: 'es' },
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: orderNumber },
          { type: 'text', text: total },
        ],
      },
    ],
  })
  
  // Enviar PDF del pedido
  const pdfUrl = `https://mi-api.com/orders/${orderNumber}/pdf`
  await client.messages.sendDocument(
    phoneNumber,
    { link: pdfUrl },
    'Tu recibo de compra',
    `pedido-${orderNumber}.pdf`
  )
}
```

### Gestión de Media

```typescript
async function uploadAndSendImage(file: File, recipient: string) {
  try {
    // Subir imagen
    const uploadResult = await client.media.upload(file, file.type)
    console.log('Imagen subida con ID:', uploadResult.id)
    
    // Enviar imagen al destinatario
    await client.messages.sendImage(
      recipient,
      { id: uploadResult.id },
      'Aquí está tu imagen'
    )
    
    // La imagen se puede reutilizar múltiples veces
    // hasta que sea eliminada
    
  } catch (error) {
    console.error('Error al procesar imagen:', error)
  }
}
```

### Monitoreo de Calidad

```typescript
async function checkPhoneNumberHealth(phoneNumberId: string) {
  const info = await client.registration.getInfo()
  
  console.log('=== Estado del Número ===')
  console.log('Nombre:', info.verified_name)
  console.log('Número:', info.display_phone_number)
  console.log('Calidad:', info.quality_rating)
  console.log('Throughput:', info.throughput.level)
  console.log('Estado:', info.status)
  
  // Alertas
  if (info.quality_rating === 'RED') {
    console.warn('⚠️ ALERTA: Calidad baja, mensajería limitada')
  }
  
  if (info.quality_rating === 'YELLOW') {
    console.warn('⚠️ Advertencia: Monitorear calidad de cerca')
  }
  
  if (info.status === 'FLAGGED' || info.status === 'RESTRICTED') {
    console.error('🚨 CRÍTICO: Cuenta con restricciones')
  }
  
  return info
}
```

---

**Nota**: Este cliente requiere configuración previa en Meta Business Suite y tokens de acceso válidos. Consulta la [documentación oficial de WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp) para más detalles sobre configuración inicial.
# Skill: WhatsApp Handoff (`/whatsapp-handoff`)

## Cuándo usar esto

Cuando se va a implementar o refinar un handoff a WhatsApp desde el sitio. WhatsApp es **canal complementario** del checkout (ver ADR-008), no rival. Casos típicos:

- Botón de WhatsApp en página de producto
- Handoff desde el asistente IA cuando no puede resolver
- Handoff desde carrito si el usuario duda
- Handoff desde formulario de "ayuda con receta"
- Botón flotante de WhatsApp sitewide

## Antes de arrancar

Leer:
- `DECISIONS.md` ADR-008 (WhatsApp como complementario)
- `conversion-optimizer` agent (cuándo NO mostrar WhatsApp)

Invocar agentes:
- `conversion-optimizer` (decide cuándo prominente, cuándo escondido)
- `argentine-ecom` (entiende patrón cultural argentino del WhatsApp)

## Principios generales

1. **Contexto pre-cargado SIEMPRE**. Nunca abrir WhatsApp con mensaje en blanco. Eso fricciona.
2. **Mensaje en primera persona del CLIENTE**, no del negocio. "Hola, quería consultar..." es del cliente.
3. **Emojis con criterio**, no spam. Acentúan, no decoran.
4. **Tono argentino**, casual pero profesional.
5. **Nunca sustituir el checkout** cuando el flujo va bien. Solo asistir cuando hay fricción.

## Formato técnico del deep link

```
https://wa.me/[NUMERO]?text=[MENSAJE_URL_ENCODED]
```

- `[NUMERO]`: número en formato internacional sin "+" ni espacios. Ejemplo: `5493780123456`
- `[MENSAJE_URL_ENCODED]`: el mensaje URL-encoded (espacios = %20, emojis quedan codificados)

En código:

```typescript
function buildWhatsAppLink(message: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
```

## Templates por punto de entrada

### 1. Botón en página de producto

```
Hola! 👋

Te consulto por este producto:
🕶️ [NOMBRE_PRODUCTO]
🆔 Código: [SKU]
💰 Precio: $[PRECIO]

¿Está disponible? ¿Tenés más fotos / colores?

Gracias!
```

**Cuándo mostrarlo prominente**:
- Producto recetado complejo
- Producto premium / alta consideración
- Producto sin stock visible pero hay alternativas

**Cuándo subordinarlo**:
- Producto simple con add-to-cart claro
- Producto en oferta clara
- Usuario ya está en flujo de checkout

### 2. Handoff desde asistente IA

Cuando el chatbot no puede resolver y el usuario quiere humano:

```
Hola! 👋 Acabo de hablar con el asistente del sitio.

Mi consulta es:
[TRANSCRIPCIÓN_BREVE_DE_LA_CONSULTA]

Si lo charlamos personalmente sería genial.

Gracias!
```

Idealmente, el asistente IA pasa al WhatsApp ya con la consulta transcrita. La persona del otro lado no tiene que volver a preguntar.

### 3. Ayuda con receta

Después de que el usuario sube su receta y el lector IA tiene baja confianza:

```
Hola! 👋

Subí mi receta al sitio pero no se interpretó bien. 

Adjunto la foto de mi receta. ¿Me ayudás a interpretarla y elegir lentes?

[Opcional: el cliente puede mandar la foto manualmente porque WhatsApp no acepta archivos pre-cargados via deep link]

Gracias!
```

**Importante**: WhatsApp **no permite pre-cargar imágenes** via deep link por seguridad. El cliente tiene que mandarla manualmente. El mensaje pre-cargado solo le recuerda.

### 4. Carrito abandonado

Si implementamos recuperación de carrito (V2), puede haber un botón "consultar por mi carrito":

```
Hola! 👋

Tengo este carrito y me quedaron algunas dudas:

🛒 Mi carrito:
- [PRODUCTO_1] x[CANT] - $[PRECIO]
- [PRODUCTO_2] x[CANT] - $[PRECIO]

Total: $[TOTAL]

Mis dudas:
[OPCIONALMENTE_INPUT_PROPIO]

Gracias!
```

### 5. Asistencia con armado de anteojos recetados

Para anteojos de receta complejos (multifocales, blue light, etc.):

```
Hola! 👋

Me interesa este modelo:
🕶️ [NOMBRE_PRODUCTO]

Necesito armarlo con receta. Mi receta es:

OD: Esf [X] / Cil [X] x [X]°
OI: Esf [X] / Cil [X] x [X]°
DNP: [X]

¿Me asesorás sobre el tipo de lente y tratamientos? Quiero entender opciones de precio.

Gracias!
```

Acá la receta ya parseada del lector IA se inyecta automáticamente — flujo super eficiente.

### 6. Botón flotante sitewide

Más genérico, para captar a quien tenga cualquier consulta:

```
Hola! 👋

Quería hacerte una consulta sobre Óptica Carballo.

Me llamo [NOMBRE_OPCIONAL_PRELLENADO_SI_LOGEADO]

Mi consulta:
```

Posición del botón: bottom-right, con respeto al CTA del producto (no taparlo en mobile).

## Diseño visual del botón

### Estilo recomendado

```tsx
<a 
  href={whatsappLink}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
>
  <WhatsAppIcon className="w-5 h-5" />
  <span>Consultar por WhatsApp</span>
</a>
```

### Iconografía

- Usar icono oficial de WhatsApp (Brand Resources de WhatsApp)
- Color verde corporativo de WhatsApp (#25D366) o nuestra paleta cuando se justifica
- No inventar variantes ni mezclar logos

### Texto del botón según contexto

- "Consultar por WhatsApp" (genérico)
- "Asesoramiento por WhatsApp" (premium / receta)
- "Ayuda con mi receta" (específico para receta)
- "Hablar con un óptico" (humanización máxima — para casos delicados)

## Métricas a trackear

Cada handoff debe disparar evento de GA4 + entrada en `whatsapp_leads` table:

```typescript
function trackWhatsAppHandoff(context: {
  source: 'product_page' | 'ai_chat' | 'prescription_help' | 'checkout' | 'floating_button'
  product_id?: string
  prescription_id?: string
  user_id?: string
}) {
  // Evento GA4
  gtag('event', 'whatsapp_handoff', {
    source: context.source,
    product_id: context.product_id,
    has_prescription: !!context.prescription_id
  })
  
  // Insert en DB
  supabase.from('whatsapp_leads').insert({
    source: context.source,
    product_id: context.product_id,
    prescription_id: context.prescription_id,
    user_id: context.user_id
  })
}
```

Esto permite analizar:
- Cuántos handoffs por mes
- Por source (qué partes del sitio generan más handoffs)
- Tasa de conversión (handoffs → ventas reales)
- Si un source genera muchos handoffs sin conversión, hay problema de UX

## Reglas duras

1. **NUNCA enviar usuario a WhatsApp con mensaje vacío**. Siempre contexto.
2. **NUNCA hacer handoff desde checkout fluido**. Mata conversión directa.
3. **NUNCA prometer respuesta inmediata** salvo que sea verdad. "Te respondemos en horario hábil" es mejor que "respuesta inmediata".
4. **NUNCA usar WhatsApp para spam** (broadcast a base de datos sin consentimiento).
5. **NUNCA registrar conversaciones de WhatsApp sin consentimiento del cliente**.
6. **NUNCA hacer link a WhatsApp con `target="_self"`**. Siempre `target="_blank"` o `_top` (en mobile abre la app nativa).

## SLA recomendado

Para que el handoff funcione, hay que responder:

- **Horario hábil**: <30 minutos ideal, <2hs aceptable.
- **Fuera de hora**: respuesta automática indicando próxima ventana de atención.
- **Fines de semana**: a definir según operación de la óptica.

Tener mensaje automático de respuesta del business WhatsApp Business cuando no hay alguien online.

## Anti-patrones

1. **Botón gigante que tapa otros CTAs**. WhatsApp es alternativa, no el primario en checkout.
2. **Auto-popup invasivo** ("Hablá con nosotros!" cada 10 segundos). Ofensa pasiva.
3. **Mensaje genérico** ("Hola, quería consultar"). El cliente abandona.
4. **Múltiples botones de WhatsApp en la misma pantalla**. Uno solo, bien posicionado.
5. **Botón "abrí WhatsApp"** sin contexto. Que sepa qué pasa al clickear.

## Casos especiales

### Si el cliente está en desktop sin WhatsApp Web

El link `wa.me` abre la versión web de WhatsApp (web.whatsapp.com). Si el cliente no tiene sesión, se le pide escanear QR. Funciona pero agrega fricción.

Mitigación: mostrar tooltip "Vas a abrir WhatsApp Web — escaneá el QR con tu celular si es la primera vez".

### Multi-operador (varios números)

Si Óptica Carballo tiene 2+ números (uno para sol, uno para receta), routing por contexto:
- Click en producto de sol → número A
- Click en producto recetado → número B

V1: un solo número, simplicidad.

### WhatsApp Business API (V2)

Para automatización avanzada (respuestas automáticas, bots, broadcasts permitidos), considerar API oficial. Requiere:
- Aprobación de Meta
- Templates pre-aprobados
- Costo por mensaje (mínimo, pero existe)

V1: WhatsApp Business app normal alcanza. V2 evaluar.

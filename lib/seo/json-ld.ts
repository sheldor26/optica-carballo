/**
 * Serializa un objeto para inyectarlo en un `<script type="application/ld+json">`
 * vía `dangerouslySetInnerHTML`. Escapa `<` como `<` para que un valor
 * que contenga literalmente `</script>` (nombre de producto, respuesta de
 * FAQ, texto de guía) no pueda cerrar el tag antes de tiempo y ejecutar lo
 * que venga después como HTML/JS (hallazgo #18, audit 2026-08-01).
 *
 * Hoy todo el contenido que llega acá lo cargan el founder o los agentes
 * (no hay reviews de usuarios ni texto libre público), así que el riesgo
 * real es bajo — pero el patrón se repite en 13 componentes y es gratis
 * cerrarlo de una.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

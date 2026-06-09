/**
 * Smoke test de la INFRA de emails (Resend).
 *
 * Self-contained (no importa `lib/emails`, que es `server-only` y no se puede
 * importar fuera del runtime de Next) — aísla "¿la credencial / dominio /
 * entrega andan?" de "¿anda nuestro wiring de templates?".
 *
 * Manda un email simple a BUSINESS_ADMIN_EMAIL — la casilla del founder que
 * en la 1ra venta no recibió el aviso. Valida: RESEND_API_KEY válida, dominio
 * de RESEND_FROM_EMAIL verificado, y entrega real. NUNCA imprime secretos.
 *
 * El wiring real (templates + senders) se valida con la simulación del webhook
 * MP sobre el server de Next corriendo.
 *
 * Uso:
 *   pnpm exec tsx --env-file=.env.local scripts/email-smoke.ts
 */
import { Resend } from 'resend';

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BUSINESS_ADMIN_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

  if (!apiKey) {
    console.error('❌ Falta RESEND_API_KEY en .env.local.');
    process.exit(1);
  }
  if (!to) {
    console.error('❌ Falta BUSINESS_ADMIN_EMAIL en .env.local.');
    process.exit(1);
  }

  console.log(`\n📧 Enviando email de prueba`);
  console.log(`   From: ${from}`);
  console.log(`   To:   ${to}\n`);

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to,
    subject: '🧪 Prueba de notificación — Óptica Carballo',
    text:
      'Este es un email de prueba del sistema de notificaciones de Óptica Carballo.\n\n' +
      'Si lo recibiste, la infra de Resend funciona: las notificaciones de venta ' +
      'van a llegar a esta casilla cuando se habilite el checkout en producción.',
    html:
      '<p>Este es un email de prueba del sistema de notificaciones de <strong>Óptica Carballo</strong>.</p>' +
      '<p>Si lo recibiste, la infra de Resend funciona: las notificaciones de venta ' +
      'van a llegar a esta casilla cuando se habilite el checkout en producción.</p>',
  });

  if (result.error) {
    console.error(`❌ Resend rechazó el envío: ${result.error.message}`);
    console.error(
      '\nSi dice "domain not verified", hay que verificar el dominio de\n' +
        'RESEND_FROM_EMAIL en Resend (DNS) — o usar onboarding@resend.dev mientras tanto.',
    );
    process.exit(1);
  }

  console.log(`✓ Email enviado OK (id: ${result.data?.id ?? 'unknown'})`);
  console.log('  Revisá tu casilla (y spam).\n');
}

main().catch((err) => {
  console.error('Error inesperado:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});

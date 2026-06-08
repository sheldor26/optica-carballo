/**
 * Smoke test de Mercado Pago (Checkout Pro).
 *
 * Crea una preferencia de pago de prueba con `MP_ACCESS_TOKEN` y verifica:
 *   1. Que el token es válido (la preferencia se crea).
 *   2. Si las credenciales son de PRUEBA o de PRODUCCIÓN (`live_mode`).
 *      live_mode=false → prueba (NO cobra plata real) ✓
 *      live_mode=true  → producción (cobra real) ⚠️
 *   3. Que devuelve un init_point (la URL a la que se manda al cliente).
 *
 * Self-contained (no importa lib/mp) para aislar "¿anda la credencial?" de
 * "¿anda nuestro wiring?". NUNCA imprime el token.
 *
 * Uso (con MP_ACCESS_TOKEN en .env.local):
 *   pnpm mp:smoke
 */

async function main() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    console.error('❌ Falta MP_ACCESS_TOKEN en .env.local.');
    process.exit(1);
  }

  const prefix = token.split('-')[0];
  console.log(`\n🔑 Access Token: prefijo "${prefix}-" (largo ${token.length})`);
  console.log(
    prefix === 'TEST'
      ? '   → esquema viejo (sandbox TEST-)'
      : '   → esquema nuevo (APP_USR-). Si es de "Credenciales de prueba", es de prueba igual.',
  );

  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          title: 'Prueba de integración — Óptica Carballo',
          quantity: 1,
          unit_price: 100,
          currency_id: 'ARS',
        },
      ],
      external_reference: 'SMOKE-TEST',
    }),
  });

  const data = (await res.json()) as {
    id?: string;
    init_point?: string;
    sandbox_init_point?: string;
    live_mode?: boolean;
    message?: string;
    error?: string;
  };

  if (!res.ok) {
    console.error(`\n❌ /checkout/preferences ${res.status}:`, data.message ?? data.error ?? JSON.stringify(data));
    process.exit(1);
  }

  console.log('\n✓ Preferencia creada OK');
  console.log(`   id: ${data.id}`);
  console.log(
    `   live_mode: ${data.live_mode} ${
      data.live_mode
        ? '⚠️  PRODUCCIÓN — estas credenciales COBRAN PLATA REAL'
        : '✓ prueba (no cobra plata real)'
    }`,
  );
  console.log(`   init_point: ${data.init_point ? 'OK' : '❌ falta'}`);
  console.log(
    `   sandbox_init_point: ${data.sandbox_init_point ? 'presente' : 'ausente (normal en esquema nuevo)'}`,
  );

  if (data.live_mode) {
    console.log(
      '\n⚠️  OJO: live_mode=true significa que NO son credenciales de prueba.\n   No probar pagos con estas hasta confirmar. Usá las de "Credenciales de prueba".',
    );
  } else {
    console.log(
      '\n✅ Credenciales de PRUEBA OK. El checkout va a usar el init_point; pagás con tarjetas de prueba (nombre APRO = aprobado).',
    );
  }
  console.log('');
}

main().catch((err) => {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
});

export {};

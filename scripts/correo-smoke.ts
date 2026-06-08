/**
 * Smoke test de la API MiCorreo (Correo Argentino).
 *
 * Verifica, de punta a punta y de forma aislada del resto del código, que:
 *   1. Las credenciales loguean OK (POST /token).
 *   2. /rates devuelve cotizaciones para un CP destino.
 *
 * Es self-contained (no importa lib/correo) para aislar "¿andan las
 * credenciales?" de "¿anda nuestro wiring?". NUNCA imprime credenciales.
 *
 * Uso (después de cargar las env vars en .env.local):
 *   pnpm correo:smoke              # cotiza a CABA (1425) por defecto
 *   pnpm correo:smoke 3400         # cotiza a Corrientes
 *   pnpm correo:smoke 9410 3        # CP 9410 (Ushuaia), 3 anteojos
 */

const REQUIRED = [
  'MICORREO_API_BASE_URL',
  'MICORREO_API_USER',
  'MICORREO_API_PASSWORD',
  'MICORREO_CUSTOMER_ID',
  'BUSINESS_POSTAL_CODE',
] as const;

function fourDigits(raw: string): string {
  return raw.match(/\d{4}/)?.[0] ?? '';
}

async function main() {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('❌ Faltan env vars:', missing.join(', '));
    console.error(
      '   Cargá las credenciales en .env.local y volvé a correr `pnpm correo:smoke`.',
    );
    process.exit(1);
  }

  const baseUrl = process.env.MICORREO_API_BASE_URL!.replace(/\/$/, '');
  const user = process.env.MICORREO_API_USER!;
  const password = process.env.MICORREO_API_PASSWORD!;
  const customerId = process.env.MICORREO_CUSTOMER_ID!;
  const origin = fourDigits(process.env.BUSINESS_POSTAL_CODE!);

  const destRaw = process.argv[2] ?? '1425';
  const dest = fourDigits(destRaw);
  const itemCount = Number(process.argv[3] ?? '1') || 1;
  const weight = 500 + Math.max(0, itemCount - 1) * 250;

  const env = baseUrl.includes('apitest') ? 'TEST' : 'PROD';
  console.log(`\n🌐 Ambiente: ${env}  (${baseUrl})`);
  console.log(`📦 Origen CP ${origin} → Destino CP ${dest}  (peso ${weight}g)\n`);

  // 1) Login
  const basic = Buffer.from(`${user}:${password}`).toString('base64');
  const tokenRes = await fetch(`${baseUrl}/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}` },
  });
  if (!tokenRes.ok) {
    console.error(
      `❌ /token ${tokenRes.status} ${tokenRes.statusText}:`,
      await tokenRes.text().catch(() => ''),
    );
    process.exit(1);
  }
  const tokenData = (await tokenRes.json()) as { token: string; expires: string };
  console.log(
    `✓ Login OK — token recibido (${tokenData.token.length} chars), expira ${tokenData.expires}`,
  );

  // 2) Cotización (sin deliveredType → devuelve domicilio Y sucursal)
  const ratesRes = await fetch(`${baseUrl}/rates`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenData.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId,
      postalCodeOrigin: origin,
      postalCodeDestination: dest,
      dimensions: { weight, height: 10, width: 20, length: 15 },
    }),
  });
  if (!ratesRes.ok) {
    console.error(
      `❌ /rates ${ratesRes.status}:`,
      await ratesRes.text().catch(() => ''),
    );
    process.exit(1);
  }

  const data = (await ratesRes.json()) as {
    rates?: Array<{
      deliveredType: string;
      productName: string;
      price: number;
      deliveryTimeMin: string;
      deliveryTimeMax: string;
    }>;
  };

  if (!data.rates?.length) {
    console.error('⚠️  /rates respondió OK pero sin tarifas:', JSON.stringify(data));
    process.exit(1);
  }

  console.log('\n💰 Cotizaciones:');
  for (const r of data.rates) {
    const tipo = r.deliveredType === 'D' ? 'Domicilio' : 'Sucursal ';
    const precio = r.price.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
    });
    console.log(
      `   [${tipo}] ${precio}  ·  ${r.deliveryTimeMin}-${r.deliveryTimeMax} días  ·  ${r.productName}`,
    );
  }
  console.log('\n✅ MiCorreo responde. La cotización en checkout va a usar estos precios.\n');
}

main().catch((err) => {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
});

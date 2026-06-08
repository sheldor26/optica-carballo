/**
 * Smoke test de la API MiCorreo (Correo Argentino).
 *
 * Verifica, de punta a punta y de forma aislada del resto del código, que
 * las credenciales loguean (POST /token) y que /rates cotiza. Es
 * self-contained (no importa lib/correo) para aislar "¿andan las
 * credenciales?" de "¿anda nuestro wiring?". NUNCA imprime credenciales.
 *
 * Uso (después de cargar las env vars en .env.local):
 *   pnpm correo:smoke              # cotiza a CABA (1425) por defecto
 *   pnpm correo:smoke 3400         # cotiza a Corrientes
 *   pnpm correo:smoke 9410 3       # CP 9410 (Ushuaia), 3 anteojos
 *   pnpm correo:smoke zonas        # corre TODAS las zonas cabecera (verificación completa)
 */

const REQUIRED = [
  'MICORREO_API_BASE_URL',
  'MICORREO_API_USER',
  'MICORREO_API_PASSWORD',
  'MICORREO_CUSTOMER_ID',
  'BUSINESS_POSTAL_CODE',
] as const;

/**
 * Zonas cabecera con cobertura GARANTIZADA del Correo (capitales / ciudades
 * grandes). Lista "infalible" para verificar la integración sin falsos
 * negativos por CPs de área rural sin cobertura (ej: 8100, 5100 rebotan;
 * sus cabeceras 8000 Bahía Blanca y 5000 Córdoba sí cotizan).
 */
const ZONAS: ReadonlyArray<readonly [string, string]> = [
  ['1000', 'CABA'],
  ['1900', 'La Plata'],
  ['8000', 'Bahía Blanca'],
  ['2000', 'Rosario'],
  ['3000', 'Santa Fe'],
  ['3100', 'Paraná'],
  ['5000', 'Córdoba'],
  ['5500', 'Mendoza'],
  ['5400', 'San Juan'],
  ['5600', 'San Rafael'],
  ['4000', 'Tucumán'],
  ['4400', 'Salta'],
  ['4600', 'Jujuy'],
  ['4700', 'Catamarca'],
  ['3400', 'Corrientes'],
  ['3300', 'Posadas'],
  ['3500', 'Resistencia'],
  ['6300', 'Santa Rosa'],
  ['8300', 'Neuquén'],
  ['8500', 'Viedma'],
  ['9100', 'Trelew'],
  ['9400', 'Río Gallegos'],
];

function fourDigits(raw: string): string {
  return raw.match(/\d{4}/)?.[0] ?? '';
}

function fmt(n: number): string {
  return '$' + Math.round(n).toLocaleString('es-AR');
}

function pad(s: string, n: number): string {
  return String(s).padEnd(n);
}

type Rate = {
  deliveredType: string;
  productName: string;
  price: number;
  deliveryTimeMin: string;
  deliveryTimeMax: string;
};

function checkEnv(): void {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('❌ Faltan env vars:', missing.join(', '));
    console.error(
      '   Cargá las credenciales en .env.local y volvé a correr `pnpm correo:smoke`.',
    );
    process.exit(1);
  }
}

async function getToken(baseUrl: string): Promise<string> {
  const basic = Buffer.from(
    `${process.env.MICORREO_API_USER}:${process.env.MICORREO_API_PASSWORD}`,
  ).toString('base64');
  const res = await fetch(`${baseUrl}/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}` },
  });
  if (!res.ok) {
    console.error(
      `❌ /token ${res.status} ${res.statusText}:`,
      await res.text().catch(() => ''),
    );
    process.exit(1);
  }
  const data = (await res.json()) as { token: string };
  return data.token;
}

async function quote(
  baseUrl: string,
  token: string,
  origin: string,
  dest: string,
  weight: number,
): Promise<Rate[]> {
  const res = await fetch(`${baseUrl}/rates`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId: process.env.MICORREO_CUSTOMER_ID,
      postalCodeOrigin: origin,
      postalCodeDestination: dest,
      dimensions: { weight, height: 10, width: 20, length: 15 },
    }),
  });
  if (!res.ok) {
    console.error(`❌ /rates ${res.status} para ${dest}`);
    return [];
  }
  const data = (await res.json()) as { rates?: Rate[] };
  return data.rates ?? [];
}

function cheapest(rates: Rate[], type: string): Rate | undefined {
  return rates
    .filter((r) => r.deliveredType === type)
    .sort((a, b) => a.price - b.price)[0];
}

async function runSingle(
  baseUrl: string,
  origin: string,
  destRaw: string,
  itemCount: number,
): Promise<void> {
  const dest = fourDigits(destRaw);
  const weight = 500 + Math.max(0, itemCount - 1) * 250;
  const env = baseUrl.includes('apitest') ? 'TEST' : 'PROD';
  console.log(`\n🌐 Ambiente: ${env}  (${baseUrl})`);
  console.log(`📦 Origen CP ${origin} → Destino CP ${dest}  (peso ${weight}g)\n`);

  const token = await getToken(baseUrl);
  console.log('✓ Login OK');

  const rates = await quote(baseUrl, token, origin, dest, weight);
  if (!rates.length) {
    console.error(`⚠️  CP ${dest} sin tarifas (Correo no lo reconoce / sin cobertura).`);
    process.exit(1);
  }
  console.log('\n💰 Cotizaciones:');
  for (const r of rates) {
    const tipo = r.deliveredType === 'D' ? 'Domicilio' : 'Sucursal ';
    console.log(
      `   [${tipo}] ${fmt(r.price)}  ·  ${r.deliveryTimeMin}-${r.deliveryTimeMax} días  ·  ${r.productName}`,
    );
  }
  console.log('\n✅ MiCorreo responde.\n');
}

async function runZonas(baseUrl: string, origin: string): Promise<void> {
  const env = baseUrl.includes('apitest') ? 'TEST' : 'PROD';
  console.log(`\n🌐 Ambiente: ${env}  ·  Origen CP ${origin}  ·  1 anteojo 500g (Clásico)\n`);
  const token = await getToken(baseUrl);
  console.log('✓ Login OK\n');

  console.log(
    pad('CP', 6) + pad('Localidad', 16) + pad('Domicilio', 12) + pad('Sucursal', 12) + 'Ahorro suc.',
  );
  console.log('-'.repeat(62));

  let ok = 0;
  for (const [cp, ciudad] of ZONAS) {
    const rates = await quote(baseUrl, token, origin, cp, 500);
    const dom = cheapest(rates, 'D');
    const suc = cheapest(rates, 'S');
    if (!dom && !suc) {
      console.log(pad(cp, 6) + pad(ciudad, 16) + '⚠️  sin cobertura');
      continue;
    }
    ok++;
    const ahorro = dom && suc ? '-' + fmt(dom.price - suc.price) : '—';
    console.log(
      pad(cp, 6) +
        pad(ciudad, 16) +
        pad(dom ? fmt(dom.price) : '—', 12) +
        pad(suc ? fmt(suc.price) : '—', 12) +
        ahorro,
    );
  }
  console.log('-'.repeat(62));
  console.log(`\n✅ ${ok}/${ZONAS.length} zonas cotizaron OK.\n`);
}

async function main() {
  checkEnv();
  const baseUrl = process.env.MICORREO_API_BASE_URL!.replace(/\/$/, '');
  const origin = fourDigits(process.env.BUSINESS_POSTAL_CODE!);

  if (process.argv[2] === 'zonas') {
    await runZonas(baseUrl, origin);
  } else {
    const destRaw = process.argv[2] ?? '1425';
    const itemCount = Number(process.argv[3] ?? '1') || 1;
    await runSingle(baseUrl, origin, destRaw, itemCount);
  }
}

main().catch((err) => {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
});

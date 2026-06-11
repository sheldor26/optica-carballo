/**
 * Trae un item de Mercado Libre usando el token OAuth guardado (encriptado) en
 * `marketplace_integrations`. Self-contained (no importa los módulos
 * `server-only` del integration) — replica el decrypt AES-256-GCM. Read-only.
 *
 * Uso:
 *   pnpm exec tsx --env-file=.env.local scripts/ml-item.ts MLA1388464699
 */
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

function deriveKey(k: string): Buffer {
  if (/^[0-9a-f]{64}$/i.test(k)) return Buffer.from(k, 'hex');
  return crypto.createHash('sha256').update(k).digest();
}

function decrypt(ciphertext: string, key: string): string {
  const [ivHex, tagHex, encHex] = ciphertext.split(':');
  const d = crypto.createDecipheriv('aes-256-gcm', deriveKey(key), Buffer.from(ivHex, 'hex'));
  d.setAuthTag(Buffer.from(tagHex, 'hex'));
  return Buffer.concat([d.update(Buffer.from(encHex, 'hex')), d.final()]).toString('utf8');
}

async function main() {
  const itemId = process.argv[2] || 'MLA1388464699';
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const encKey = process.env.APP_ENCRYPTION_KEY!;
  if (!url || !serviceKey || !encKey) {
    console.error('Faltan env (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / APP_ENCRYPTION_KEY).');
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase
    .from('marketplace_integrations')
    .select('access_token, external_user_id, status, token_expires_at')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    console.error('No hay integración ML activa en marketplace_integrations.', error?.message ?? '');
    process.exit(1);
  }

  const row = data[0] as { access_token: string; external_user_id: string; token_expires_at: string };
  console.log(`Integración: user ${row.external_user_id} · token expira ${row.token_expires_at}`);

  let token: string;
  try {
    token = decrypt(row.access_token, encKey);
  } catch (e) {
    console.error('No se pudo desencriptar el access_token:', e instanceof Error ? e.message : e);
    process.exit(1);
  }

  const res = await fetch(`https://api.mercadolibre.com/items/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.error(`ML /items/${itemId} → HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    process.exit(1);
  }
  const item = (await res.json()) as any;

  console.log(`\nTITLE: ${item.title}`);
  console.log(`STATUS: ${item.status} · price base: ${item.price} · available_quantity: ${item.available_quantity}`);
  console.log(`permalink: ${item.permalink}`);

  const vars = item.variations ?? [];
  console.log(`\n=== ${vars.length} variaciones ===`);
  for (const v of vars) {
    const color =
      (v.attribute_combinations ?? []).find(
        (a: any) => /color/i.test(a.id ?? '') || /color/i.test(a.name ?? ''),
      )?.value_name ?? '(sin color)';
    const sku =
      (v.attributes ?? []).find((a: any) => a.id === 'SELLER_SKU')?.value_name ??
      v.seller_custom_field ??
      '(sin SKU)';
    console.log(
      `  var_id=${v.id} | color=${color} | precio=${v.price} | stock=${v.available_quantity} | vendidos=${v.sold_quantity ?? '?'} | SKU=${sku}`,
    );
  }
}

main().catch((e) => {
  console.error('Error:', e instanceof Error ? e.message : e);
  process.exit(1);
});

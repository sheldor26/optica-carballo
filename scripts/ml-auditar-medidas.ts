/**
 * Script: ml-auditar-medidas
 *
 * Compara las medidas publicadas en la ficha técnica de Mercado Libre contra
 * las medidas reales del catálogo, y lista las que están mal con el valor
 * corregido.
 *
 * SOLO LECTURA. No hace ni un PUT. Corregir es otra cosa: son publicaciones
 * activas con ventas y cada corrección se confirma de a una.
 *
 * De dónde sale la medida correcta: del `alt_text` de la placa de medidas de
 * cada producto, que tiene la forma
 *   "Esquema técnico de medidas <modelo>: frente 140mm, lente 64x39mm,
 *    puente 18mm, varilla 108mm"
 * Esas son las medidas que el founder midió a mano sobre el armazón. La ficha
 * del fabricante NO se usa como referencia: está mal seguido.
 *
 * El error típico que encuentra: milímetros a los que se les aplicó la
 * conversión de pulgadas a centímetros. Un calibre de 56 mm queda publicado
 * como 142,24 cm, porque 56 × 2,54 = 142,24. Verificado en MLA1441317097.
 *
 * Uso:
 *   pnpm ml:medidas
 *   pnpm ml:medidas --todas       (lista también las publicaciones sin problema)
 *
 * Requisitos env: NEXT_PUBLIC_SUPABASE_URL · SUPABASE_SERVICE_ROLE_KEY ·
 * APP_ENCRYPTION_KEY
 */

import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { createClient } from '@supabase/supabase-js';

/** Rangos físicos plausibles de un armazón, en milímetros. */
const RANGOS: Record<string, { min: number; max: number; nombre: string }> = {
  LENS_WIDTH: { min: 38, max: 75, nombre: 'calibre' },
  LENS_HEIGHT: { min: 25, max: 62, nombre: 'alto de lente' },
  BRIDGE_LENGTH: { min: 10, max: 26, nombre: 'puente' },
  TEMPLE_LENGTH: { min: 100, max: 155, nombre: 'varilla' },
  FRAME_WIDTH: { min: 110, max: 155, nombre: 'frente' },
};

/** Qué medida del alt_text corresponde a cada atributo de ML. */
const DESDE_ALT: Record<string, keyof MedidasReales> = {
  LENS_WIDTH: 'calibre',
  LENS_HEIGHT: 'alto',
  BRIDGE_LENGTH: 'puente',
  TEMPLE_LENGTH: 'varilla',
  FRAME_WIDTH: 'frente',
};

type MedidasReales = {
  frente: number;
  calibre: number;
  alto: number;
  puente: number;
  varilla: number;
};

function deriveKey(k: string): Buffer {
  if (/^[0-9a-f]{64}$/i.test(k)) return Buffer.from(k, 'hex');
  return crypto.createHash('sha256').update(k).digest();
}

function decrypt(ciphertext: string, key: string): string {
  const [ivHex, tagHex, encHex] = ciphertext.split(':') as [string, string, string];
  const d = crypto.createDecipheriv('aes-256-gcm', deriveKey(key), Buffer.from(ivHex, 'hex'));
  d.setAuthTag(Buffer.from(tagHex, 'hex'));
  return Buffer.concat([d.update(Buffer.from(encHex, 'hex')), d.final()]).toString('utf8');
}

/** Saca las medidas del alt_text de la placa. Devuelve null si no matchea. */
function parsearAlt(alt: string): MedidasReales | null {
  const m = alt.match(
    /frente\s*(\d+)\s*mm.*?lente\s*(\d+)\s*x\s*(\d+)\s*mm.*?puente\s*(\d+)\s*mm.*?varilla\s*(\d+)\s*mm/i,
  );
  if (!m) return null;
  return {
    frente: Number(m[1]),
    calibre: Number(m[2]),
    alto: Number(m[3]),
    puente: Number(m[4]),
    varilla: Number(m[5]),
  };
}

type Problema = {
  itemId: string;
  titulo: string;
  status: string;
  slug: string;
  atributo: string;
  nombre: string;
  publicado: string;
  publicadoMm: number;
  correctoMm: number;
  diagnostico: string;
};

async function main(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const encKey = process.env.APP_ENCRYPTION_KEY;
  if (!url || !serviceKey || !encKey) {
    throw new Error('Faltan env. Corré con --env-file=.env.local');
  }

  const supabase = createClient(url, serviceKey);

  // --- Medidas reales, por producto ---------------------------------------
  const { data: placas } = await supabase
    .from('product_images')
    .select('alt_text, products!inner(id, slug)')
    .ilike('storage_path', '%medidas%')
    .not('alt_text', 'is', null);

  const medidasPorProducto = new Map<string, MedidasReales>();
  const slugPorProducto = new Map<string, string>();
  for (const p of (placas ?? []) as any[]) {
    const parsed = parsearAlt(p.alt_text);
    if (parsed) {
      medidasPorProducto.set(p.products.id, parsed);
      slugPorProducto.set(p.products.id, p.products.slug);
    }
  }
  console.log(`Medidas reales disponibles para ${medidasPorProducto.size} productos.\n`);

  // --- Publicaciones a revisar --------------------------------------------
  const { data: variantes } = await supabase
    .from('product_variants')
    .select('mercadolibre_item_id, product_id')
    .not('mercadolibre_item_id', 'is', null);

  const productoPorItem = new Map<string, string>();
  for (const v of (variantes ?? []) as any[]) {
    if (!productoPorItem.has(v.mercadolibre_item_id)) {
      productoPorItem.set(v.mercadolibre_item_id, v.product_id);
    }
  }
  const ids = [...productoPorItem.keys()];
  console.log(`Revisando ${ids.length} publicaciones de Mercado Libre...\n`);

  const { data: integ } = await supabase
    .from('marketplace_integrations')
    .select('access_token')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1);
  const token = decrypt((integ as any)[0].access_token, encKey);

  // --- Multiget de a 20 ----------------------------------------------------
  const problemas: Problema[] = [];
  const sinMedidas: string[] = [];

  for (let i = 0; i < ids.length; i += 20) {
    const lote = ids.slice(i, i + 20);
    const r = await fetch(`https://api.mercadolibre.com/items?ids=${lote.join(',')}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) {
      console.warn(`  ⚠️ lote ${i / 20 + 1}: HTTP ${r.status}`);
      continue;
    }

    for (const entrada of (await r.json()) as any[]) {
      const item = entrada.body;
      if (!item?.id) continue;

      const productId = productoPorItem.get(item.id);
      const reales = productId ? medidasPorProducto.get(productId) : undefined;
      if (!reales) {
        sinMedidas.push(item.id);
        continue;
      }

      for (const attr of item.attributes ?? []) {
        const rango = RANGOS[attr.id];
        if (!rango) continue;

        const struct = attr.values?.[0]?.struct;
        if (!struct?.number) continue;

        // ML guarda en cm; el catálogo, en mm.
        const publicadoMm = struct.unit === 'cm' ? struct.number * 10 : struct.number;
        const correctoMm = reales[DESDE_ALT[attr.id]!];

        const fueraDeRango = publicadoMm < rango.min || publicadoMm > rango.max;
        const noCoincide = Math.abs(publicadoMm - correctoMm) > 1;
        if (!fueraDeRango && !noCoincide) continue;

        // ¿Encaja el patrón de milímetros convertidos como pulgadas?
        const comoPulgadas = Math.abs(publicadoMm / 25.4 - correctoMm) < 1.5;
        const diagnostico = comoPulgadas
          ? `mm convertidos como pulgadas (${correctoMm} × 2,54)`
          : fueraDeRango
            ? 'fuera del rango físico'
            : 'no coincide con la medida real';

        problemas.push({
          itemId: item.id,
          titulo: (item.title ?? '').slice(0, 55),
          status: item.status,
          slug: slugPorProducto.get(productId!) ?? '?',
          atributo: attr.id,
          nombre: rango.nombre,
          publicado: attr.value_name ?? String(struct.number),
          publicadoMm,
          correctoMm,
          diagnostico,
        });
      }
    }
    await new Promise((res) => setTimeout(res, 400));
  }

  // --- Reporte --------------------------------------------------------------
  const porItem = new Map<string, Problema[]>();
  for (const p of problemas) {
    porItem.set(p.itemId, [...(porItem.get(p.itemId) ?? []), p]);
  }

  const ordenados = [...porItem.entries()].sort((a, b) => b[1].length - a[1].length);

  for (const [itemId, ps] of ordenados) {
    const p = ps[0]!;
    console.log(`${itemId} [${p.status}] ${p.slug}`);
    console.log(`  ${p.titulo}`);
    for (const x of ps) {
      const corregidoCm = (x.correctoMm / 10).toFixed(1);
      console.log(
        `    ${x.nombre.padEnd(14)} publicado ${x.publicado.padEnd(12)} → correcto ${corregidoCm} cm (${x.correctoMm} mm)   ${x.diagnostico}`,
      );
    }
    console.log('');
  }

  console.log('='.repeat(78));
  console.log(`${porItem.size} publicaciones con medidas mal, ${problemas.length} atributos en total.`);
  const conPatron = problemas.filter((p) => p.diagnostico.includes('pulgadas')).length;
  console.log(`${conPatron} de esos ${problemas.length} encajan con el patrón de mm × 2,54.`);
  if (sinMedidas.length > 0) {
    console.log(`${sinMedidas.length} publicaciones sin placa de medidas en el catálogo: no se pudieron comparar.`);
  }

  const salida = path.join(process.cwd(), 'marketing/auditorias/ml-medidas.json');
  await fs.mkdir(path.dirname(salida), { recursive: true });
  await fs.writeFile(salida, JSON.stringify({ problemas, sinMedidas }, null, 2));
  console.log(`\nDetalle: ${salida}`);
  console.log('Este script no modifica nada. Corregir es un paso aparte, de a una publicación.');
}

main().catch((e) => {
  console.error(`\n✗ ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});

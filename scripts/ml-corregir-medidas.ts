/**
 * Script: ml-corregir-medidas
 *
 * Corrige en Mercado Libre las medidas que `pnpm ml:medidas` marcó como mal,
 * usando como valor bueno el que está en el catálogo (la medición del founder).
 *
 * ESCRIBE EN PUBLICACIONES REALES. Por eso:
 * - Dry-run por defecto: sin `--aplicar` no manda nada.
 * - Guarda los atributos actuales de cada publicación en `marketing/backup-ml/`
 *   antes de tocarla.
 * - Un PUT por publicación, sólo con los atributos a corregir.
 * - Verifica después de cada una y frena al primer error en vez de seguir.
 * - Por defecto sólo toca las medidas físicamente imposibles (`--graves`), que
 *   son las que no admiten discusión. Las discrepancias chicas requieren
 *   criterio del founder y se piden explícitamente con `--todas`.
 *
 * El PUT de `attributes` hace MERGE, no reemplazo: verificado el 2026-08-24
 * sobre MLA1499129431 (pausada, elegida por ser de riesgo cero), donde los 34
 * atributos sobrevivieron y sólo cambió el corregido.
 *
 * Uso:
 *   pnpm ml:corregir-medidas                 (dry-run de las graves)
 *   pnpm ml:corregir-medidas --aplicar
 *   pnpm ml:corregir-medidas --todas --aplicar
 *   pnpm ml:corregir-medidas --item MLA123   (una sola publicación)
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { obtenerIntegracionML } from './lib/ml-auth';

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

function flag(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  if (i === -1) return undefined;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : undefined;
}

/** Físicamente imposible: no hay armazón con una varilla de 3,68 metros. */
function esGrave(p: Problema): boolean {
  return p.diagnostico.includes('pulgadas') || p.publicadoMm > 200;
}

async function main(): Promise<void> {
  const aplicar = process.argv.includes('--aplicar');
  const todas = process.argv.includes('--todas');
  const soloItem = flag('item');

  const auditoria = path.join(process.cwd(), 'marketing/auditorias/ml-medidas.json');
  const { problemas } = JSON.parse(await fs.readFile(auditoria, 'utf8')) as { problemas: Problema[] };

  let objetivo = todas ? problemas : problemas.filter(esGrave);
  if (soloItem) objetivo = objetivo.filter((p) => p.itemId === soloItem);

  if (objetivo.length === 0) {
    console.log('No hay nada que corregir con esos filtros.');
    return;
  }

  const porItem = new Map<string, Problema[]>();
  for (const p of objetivo) porItem.set(p.itemId, [...(porItem.get(p.itemId) ?? []), p]);

  console.log(
    `${porItem.size} publicaciones · ${objetivo.length} atributos` +
      `${todas ? ' (TODAS, incluidas las discrepancias chicas)' : ' (sólo las físicamente imposibles)'}\n`,
  );

  for (const [itemId, ps] of porItem) {
    console.log(`${itemId} [${ps[0]!.status}] ${ps[0]!.slug} — ${ps[0]!.titulo}`);
    for (const p of ps) {
      console.log(`    ${p.nombre.padEnd(14)} ${p.publicado.padStart(10)} → ${(p.correctoMm / 10).toFixed(1)} cm`);
    }
  }

  if (!aplicar) {
    console.log('\nDry-run: no se mandó nada. Agregá --aplicar para corregir.');
    return;
  }

  const { token } = await obtenerIntegracionML();

  await fs.mkdir(path.join(process.cwd(), 'marketing/backup-ml'), { recursive: true });
  console.log('\n' + '='.repeat(70));

  let corregidas = 0;
  for (const [itemId, ps] of porItem) {
    const antes = await (
      await fetch(`https://api.mercadolibre.com/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).json();

    await fs.writeFile(
      path.join(process.cwd(), `marketing/backup-ml/${itemId}-attributes.antes.json`),
      JSON.stringify(antes.attributes, null, 2),
    );

    const attributes = ps.map((p) => ({
      id: p.atributo,
      value_name: `${(p.correctoMm / 10).toFixed(1)} cm`,
    }));

    const put = await fetch(`https://api.mercadolibre.com/items/${itemId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ attributes }),
    });

    if (!put.ok) {
      console.error(`\n✗ ${itemId}: HTTP ${put.status} — ${(await put.text()).slice(0, 250)}`);
      console.error('Freno acá para no encadenar errores. Los backups quedaron guardados.');
      process.exit(1);
    }

    await new Promise((r) => setTimeout(r, 1500));
    const despues = await (
      await fetch(`https://api.mercadolibre.com/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).json();

    const perdidos = antes.attributes.filter(
      (a: any) => !despues.attributes.some((b: any) => b.id === a.id),
    );
    const ok = ps.every((p) => {
      const attr = despues.attributes.find((a: any) => a.id === p.atributo);
      const mm = attr?.values?.[0]?.struct
        ? attr.values[0].struct.unit === 'cm'
          ? attr.values[0].struct.number * 10
          : attr.values[0].struct.number
        : null;
      return mm !== null && Math.abs(mm - p.correctoMm) < 1.5;
    });

    console.log(
      `${ok ? '✓' : '✗'} ${itemId} ${ps[0]!.slug.padEnd(18)} ` +
        `${despues.status}${perdidos.length ? ` · ⚠️ perdió ${perdidos.length} atributos` : ''}`,
    );
    for (const p of ps) {
      const attr = despues.attributes.find((a: any) => a.id === p.atributo);
      console.log(`      ${p.nombre.padEnd(14)} ahora ${attr?.value_name ?? '?'}`);
    }
    if (ok) corregidas++;
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log('\n' + '='.repeat(70));
  console.log(`${corregidas}/${porItem.size} publicaciones corregidas y verificadas.`);
  console.log('Backups de los atributos previos en marketing/backup-ml/');
}

main().catch((e) => {
  console.error(`\n✗ ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});

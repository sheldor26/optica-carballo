/**
 * CLI suelto para la placa de callouts v2 (la lógica vive en
 * `scripts/lib/placas-callouts-v2.ts`; `pnpm placas` ya la usa por defecto).
 *
 *   pnpm exec tsx --env-file=.env.local scripts/placa-callouts-v2.ts \\
 *     --perfil foto.jpg --out placa.jpg \\
 *     --items "DETALLES METÁLICOS@0.33,0.49|POLARIZADAS@0.82,0.40|G-FLEX@0.12,0.43|UV400 · CAT. 3@0.88,0.78"
 */
import { recortarAnteojo } from './lib/placas-frame';
import { asegurarFuentes } from './lib/placas-fuentes';
import { placaCalloutsV2, type ItemCalloutV2 } from './lib/placas-callouts-v2';

function flag(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

async function main(): Promise<void> {
  asegurarFuentes();
  const perfil = flag('perfil');
  const out = flag('out');
  const itemsArg = flag('items');
  if (!perfil || !out || !itemsArg) throw new Error('Faltan --perfil, --out o --items');
  const items: ItemCalloutV2[] = itemsArg.split('|').map((parte) => {
    const [texto, punto] = parte.split('@');
    const [fx, fy] = (punto ?? '').split(',').map(Number);
    if (!texto || fx === undefined || fy === undefined || Number.isNaN(fx) || Number.isNaN(fy)) {
      throw new Error(`Ítem inválido "${parte}": va como TEXTO@fx,fy`);
    }
    return { texto: texto.trim(), fx, fy };
  });
  await placaCalloutsV2(await recortarAnteojo(perfil), items, out);
  console.log(`✓ ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

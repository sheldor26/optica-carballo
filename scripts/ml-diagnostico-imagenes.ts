/**
 * Script: ml-diagnostico-imagenes
 *
 * Le pregunta a Mercado Libre si nuestras placas pasan su propia moderación
 * de imágenes, ANTES de publicar. Usa la API oficial de diagnóstico:
 * `POST /moderations/pictures/diagnostic`, que la doc de ML define como el
 * paso previo obligatorio a asociar una imagen a una publicación, para la
 * principal, las de variante y las secundarias.
 *
 * Criterios que evalúa ML (los que apliquen según la categoría):
 *   white_background · minimum_size · text_logo · watermark
 *
 * Es un diagnóstico: NO crea, modifica ni pausa ninguna publicación. Las
 * imágenes se mandan en base64, así que no hay que subirlas a ningún lado.
 *
 * Uso:
 *   pnpm ml:diag --dir ~/Desktop/placas/vulk-vrast/ml
 *   pnpm ml:diag --dir <dir> --categoria MLA457893 --titulo "Anteojos ..."
 *
 * Flags:
 *   --dir <dir>        Carpeta con las placas (default: la última generada).
 *   --categoria <id>   Categoría de ML (default MLA417128, Anteojos de Sol).
 *                      Armazones de receta: MLA417127 "Armazones y lentes sin
 *                      graduar", que es donde van los armazones que se venden
 *                      SIN lentes puestos. NO usar MLA457893 "Anteojos
 *                      Graduados": es para anteojos ya graduados y está
 *                      prácticamente vacía (141 publicaciones contra 87.881).
 *   --titulo <texto>   Título de la publicación, para dar contexto a ML.
 *   --principal <file> Qué archivo se diagnostica como foto de portada
 *                      (default: el primero por orden alfabético).
 *   --verbose          Imprime la respuesta cruda de ML para cada imagen.
 *
 * La portada va como `picture_type: thumbnail`, que tiene reglas más
 * estrictas; el resto va como `other`.
 *
 * Requisitos env (mismos que ml-item.ts):
 *   NEXT_PUBLIC_SUPABASE_URL · SUPABASE_SERVICE_ROLE_KEY · APP_ENCRYPTION_KEY
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { obtenerIntegracionML } from './lib/ml-auth';

const DIAGNOSTIC_URL = 'https://api.mercadolibre.com/moderations/pictures/diagnostic';
/**
 * Anteojos de Sol en Argentina. Para armazones de receta, MLA417127
 * ("Armazones y lentes sin graduar"). Las dos cuelgan de Moda, y en las dos
 * el criterio `text_logo` está activo para la foto de portada.
 */
const CATEGORIA_DEFAULT = 'MLA417128';

function flag(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  if (i === -1) return undefined;
  const valor = process.argv[i + 1];
  return valor && !valor.startsWith('--') ? valor : undefined;
}

async function obtenerToken(): Promise<string> {
  const { token, externalUserId, expiraEn } = await obtenerIntegracionML();
  console.log(`Integración ML: user ${externalUserId} · token expira ${expiraEn}\n`);
  return token;
}

type Diagnostico = {
  archivo: string;
  tipo: 'thumbnail' | 'other';
  http: number;
  cuerpo: unknown;
};

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function diagnosticar(
  token: string,
  archivo: string,
  tipo: 'thumbnail' | 'other',
  categoria: string,
  titulo: string,
): Promise<Diagnostico> {
  const buffer = await fs.readFile(archivo);
  const ext = path.extname(archivo).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';

  // Mandar 6 imágenes seguidas hace que ML devuelva 429. Un 429 no es un
  // veredicto sobre la imagen: si se contara como "no pude diagnosticar" se
  // estaría publicando sin validar. Se reintenta con espera creciente.
  let response!: Response;
  for (let intento = 0; intento < 4; intento++) {
    response = await fetch(DIAGNOSTIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        picture_url: `data:${mime};base64,${buffer.toString('base64')}`,
        context: { category_id: categoria, title: titulo, picture_type: tipo },
      }),
    });

    if (response.status !== 429) break;
    const espera = 2000 * 2 ** intento;
    console.log(`  · ${path.basename(archivo)}: ML respondió 429, reintento en ${espera / 1000}s...`);
    await esperar(espera);
  }

  const texto = await response.text();
  let cuerpo: unknown = texto;
  try {
    cuerpo = JSON.parse(texto);
  } catch {
    /* la API devolvió algo que no es JSON: lo mostramos crudo */
  }

  return { archivo: path.basename(archivo), tipo, http: response.status, cuerpo };
}

/** Saca los códigos de problema de la respuesta, sea cual sea su forma exacta. */
function problemasDe(cuerpo: unknown): string[] {
  const encontrados: string[] = [];
  const criterios = ['white_background', 'minimum_size', 'text_logo', 'watermark'];

  const recorrer = (valor: unknown): void => {
    if (typeof valor === 'string') {
      for (const c of criterios) if (valor.includes(c) && !encontrados.includes(c)) encontrados.push(c);
      return;
    }
    if (Array.isArray(valor)) {
      valor.forEach(recorrer);
      return;
    }
    if (valor && typeof valor === 'object') {
      for (const [k, v] of Object.entries(valor)) {
        if (criterios.includes(k) && v !== false && v !== null) {
          if (!encontrados.includes(k)) encontrados.push(k);
        }
        recorrer(v);
      }
    }
  };

  recorrer(cuerpo);
  return encontrados;
}

async function main(): Promise<void> {
  const dir = flag('dir');
  if (!dir) {
    console.error('Falta --dir <carpeta con las placas>.');
    process.exit(1);
  }

  const categoria = flag('categoria') || CATEGORIA_DEFAULT;
  const titulo = flag('titulo') || 'Anteojos de sol';

  const archivos = (await fs.readdir(dir))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort()
    .map((f) => path.join(dir, f));

  if (archivos.length === 0) {
    console.error(`No encontré imágenes en ${dir}`);
    process.exit(1);
  }

  const principal = flag('principal') ? path.resolve(flag('principal')!) : archivos[0]!;
  const token = await obtenerToken();

  console.log(`Diagnosticando ${archivos.length} imágenes contra ML (categoría ${categoria})...\n`);

  const resultados: Diagnostico[] = [];
  for (const archivo of archivos) {
    const tipo = archivo === principal ? 'thumbnail' : 'other';
    if (resultados.length > 0) await esperar(1200);
    const resultado = await diagnosticar(token, archivo, tipo, categoria, titulo);
    resultados.push(resultado);

    const problemas = problemasDe(resultado.cuerpo);
    const etiqueta = tipo === 'thumbnail' ? 'PORTADA   ' : 'secundaria';
    if (process.argv.includes('--verbose')) {
      console.log(`  · ${resultado.archivo} [${tipo}] → ${JSON.stringify(resultado.cuerpo)}`);
    }
    if (resultado.http >= 400) {
      console.log(`  ✗ ${etiqueta} ${resultado.archivo} → HTTP ${resultado.http}`);
      console.log(`      ${JSON.stringify(resultado.cuerpo).slice(0, 300)}`);
    } else if (problemas.length === 0) {
      console.log(`  ✓ ${etiqueta} ${resultado.archivo} → sin observaciones`);
    } else {
      console.log(`  ⚠️ ${etiqueta} ${resultado.archivo} → ${problemas.join(', ')}`);
      console.log(`      ${JSON.stringify(resultado.cuerpo).slice(0, 400)}`);
    }
  }

  const conProblemas = resultados.filter((r) => r.http < 400 && problemasDe(r.cuerpo).length > 0);
  const conError = resultados.filter((r) => r.http >= 400);

  console.log('\n---');
  console.log(`${resultados.length - conProblemas.length - conError.length}/${resultados.length} imágenes limpias para ML.`);
  if (conProblemas.length > 0) {
    console.log(`${conProblemas.length} con observaciones: ${conProblemas.map((r) => r.archivo).join(', ')}`);
  }
  if (conError.length > 0) {
    console.log(`${conError.length} no se pudieron diagnosticar (ver HTTP arriba).`);
  }
}

main().catch((e) => {
  console.error(`\n✗ ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});

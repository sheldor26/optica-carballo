/**
 * Script: ml-anclas
 *
 * Marcar A MANO, con el mouse, dónde está cada parte del armazón en una foto
 * de perfil. Sirve para que las flechas de la placa de callouts apunten con
 * precisión de pixel: ningún modelo ubica una bisagra mejor que una persona
 * que la está mirando.
 *
 * Uso:
 *   pnpm anclas marketing/fotos/reef-128/reef128_col015_lateral.jpg [otra.jpg ...]
 *
 * Abre una página local en el navegador. Elegís una parte, hacés click sobre
 * la foto, y listo; con varias fotos pasás de una a otra con "Guardar y
 * siguiente". Cada foto deja al lado un `<foto>.anclas.json` que `pnpm placas`
 * lee solo (no hay que pasar nada más). Si querés usar otro archivo:
 * `pnpm placas --anclas ruta.json`.
 *
 * Si todas las fotos son el mismo armazón con el mismo encuadre (variantes de
 * color de un modelo), alcanza con marcar UNA y pasarle las marcas a las demás:
 *   pnpm anclas --copiar-de ref.jpg otra1.jpg otra2.jpg ...
 * La copia estima la escala y el corrimiento de cada foto comparando bordes
 * (no copia fracciones: cada foto se recorta distinto y a veces se encuadra
 * distinto). Avisa si el calce es dudoso. No abre ninguna página.
 *
 * Las coordenadas son fracciones del armazón recortado, que se calcula igual
 * que en `pnpm placas` (mismo `recortarAnteojo`), así que coinciden.
 */

import { exec } from 'node:child_process';
import { promises as fs } from 'node:fs';
import http from 'node:http';
import path from 'node:path';

import { recortarAnteojo } from './lib/placas-frame';
import { trasladarPartes, type ArchivoAnclas } from './lib/placas-anclas';
import type { NombreParte, Partes } from './lib/placas-partes';

const PARTES: Array<{ id: NombreParte; etiqueta: string; ayuda: string }> = [
  { id: 'bisagra_izquierda', etiqueta: 'Bisagra (izq. de la foto)', ayuda: 'donde la patilla se une al frente' },
  { id: 'bisagra_derecha', etiqueta: 'Bisagra (der. de la foto)', ayuda: 'donde la patilla se une al frente' },
  { id: 'patilla_izquierda', etiqueta: 'Patilla (izq. de la foto)', ayuda: 'sobre la parte recta de la varilla' },
  { id: 'patilla_derecha', etiqueta: 'Patilla (der. de la foto)', ayuda: 'sobre la parte recta de la varilla' },
  { id: 'lente_izquierdo', etiqueta: 'Lente (izq. de la foto)', ayuda: 'sobre el cristal' },
  { id: 'lente_derecho', etiqueta: 'Lente (der. de la foto)', ayuda: 'sobre el cristal' },
  { id: 'frente_izquierdo', etiqueta: 'Frente / aro (izq. de la foto)', ayuda: 'sobre el borde del armazón' },
  { id: 'frente_derecho', etiqueta: 'Frente / aro (der. de la foto)', ayuda: 'sobre el borde del armazón' },
  { id: 'puente', etiqueta: 'Puente', ayuda: 'el puente entre los dos lentes' },
];

type FotoCargada = {
  ruta: string;
  rutaJson: string;
  png: Buffer;
  width: number;
  height: number;
  partes: Partes;
};

function pagina(fotos: FotoCargada[]): string {
  const datos = JSON.stringify({
    fotos: fotos.map((f) => ({
      nombre: path.basename(f.ruta),
      width: f.width,
      height: f.height,
      partes: f.partes,
    })),
    partes: PARTES,
  });

  return `<!doctype html>
<html lang="es-AR"><head><meta charset="utf-8"><title>Marcar partes del armazón</title>
<style>
  :root { --azul:#12294B; --verde:#157F38; --gris:#e8ebf0; }
  * { box-sizing:border-box; }
  body { margin:0; font:15px/1.4 system-ui, sans-serif; color:#1b1f24; background:#f6f7f9; }
  header { background:var(--azul); color:#fff; padding:12px 20px; display:flex; gap:16px; align-items:center; flex-wrap:wrap; }
  header h1 { font-size:17px; margin:0; font-weight:700; }
  header span { opacity:.85; }
  main { display:flex; gap:20px; padding:20px; align-items:flex-start; flex-wrap:wrap; }
  #lienzo { position:relative; background:#fff; border:1px solid #cfd5de; border-radius:8px; line-height:0; cursor:crosshair; user-select:none; }
  #lienzo img { display:block; max-width:min(1000px, calc(100vw - 380px)); min-width:600px; height:auto; }
  .marca { position:absolute; width:0; height:0; pointer-events:none; }
  .marca::before, .marca::after { content:""; position:absolute; background:#ff2d55; box-shadow:0 0 0 1px #fff; }
  .marca::before { left:-9px; top:-1px; width:18px; height:2px; }
  .marca::after { top:-9px; left:-1px; height:18px; width:2px; }
  .marca b { position:absolute; left:10px; top:-24px; font:700 12px system-ui; background:var(--azul); color:#fff; padding:2px 6px; border-radius:4px; white-space:nowrap; line-height:1.2; }
  aside { width:320px; display:flex; flex-direction:column; gap:10px; }
  .caja { background:#fff; border:1px solid #cfd5de; border-radius:8px; padding:12px; }
  .parte { display:flex; align-items:center; gap:8px; padding:8px 10px; border:2px solid var(--gris); border-radius:8px; background:#fff; cursor:pointer; width:100%; text-align:left; font:inherit; }
  .parte.activa { border-color:var(--azul); background:#eaf0fa; }
  .parte small { color:#5b6573; display:block; }
  .parte .estado { margin-left:auto; font-weight:700; color:var(--verde); }
  .parte .quitar { margin-left:6px; color:#a33; border:0; background:none; cursor:pointer; font-size:16px; }
  button.grande { padding:11px 14px; border-radius:8px; border:0; font:700 15px system-ui; cursor:pointer; background:var(--verde); color:#fff; }
  button.grande.sec { background:#fff; color:var(--azul); border:2px solid var(--azul); }
  #lupa { width:240px; height:240px; border:2px solid var(--azul); border-radius:8px; background:#fff; image-rendering:pixelated; }
  #msg { min-height:20px; font-weight:600; color:var(--verde); }
  ol { margin:4px 0 0 18px; padding:0; color:#3a4350; }
  @media (max-width: 1150px) {
    #lienzo img { min-width:0; max-width:calc(100vw - 42px); }
    aside { width:100%; }
    #lista { display:grid !important; grid-template-columns:1fr 1fr; }
    .parte small { display:none; }
  }
</style></head><body>
<header><h1>Marcar partes del armazón</h1><span id="foto"></span></header>
<main>
  <div id="lienzo"><img id="img" alt="foto del armazón"></div>
  <aside>
    <div class="caja"><ol>
      <li>Elegí la parte en la lista.</li>
      <li>Hacé click sobre la foto, <b>justo donde tiene que tocar la flecha</b>.</li>
      <li>Si te equivocás, clickeá de nuevo: se mueve. Con las flechas del teclado ajustás de a 1 pixel.</li>
      <li>Marcá sólo las partes que se ven y de las que habla una burbuja.</li>
    </ol></div>
    <div id="lista" class="caja" style="display:flex;flex-direction:column;gap:6px"></div>
    <div class="caja"><canvas id="lupa" width="240" height="240"></canvas></div>
    <div id="msg"></div>
    <button class="grande" id="guardar">Guardar y siguiente</button>
    <button class="grande sec" id="terminar">Terminar</button>
  </aside>
</main>
<script>
const D = ${datos};
let i = 0, activa = null;
const img = document.getElementById('img'), lienzo = document.getElementById('lienzo');
const lupa = document.getElementById('lupa'), ctx = lupa.getContext('2d');
const etiqueta = Object.fromEntries(D.partes.map(p => [p.id, p.etiqueta]));

function foto() { return D.fotos[i]; }

function cargar() {
  const f = foto();
  document.getElementById('foto').textContent = 'Foto ' + (i + 1) + ' de ' + D.fotos.length + ': ' + f.nombre;
  // Si la foto no tiene marcas, arranca con las de la anterior: la pose suele
  // ser la misma y sólo hay que corregir unos pixeles.
  if (Object.keys(f.partes).length === 0 && i > 0) {
    f.partes = JSON.parse(JSON.stringify(D.fotos[i - 1].partes));
    f.heredada = true;
  }
  img.src = '/foto/' + i + '.png?' + Date.now();
  activa = null;
  render();
}

function render() {
  const f = foto();
  const lista = document.getElementById('lista');
  lista.innerHTML = '';
  D.partes.forEach(p => {
    const b = document.createElement('button');
    b.className = 'parte' + (activa === p.id ? ' activa' : '');
    const puesta = !!f.partes[p.id];
    b.innerHTML = '<span>' + p.etiqueta + '<small>' + p.ayuda + '</small></span>' +
      (puesta ? '<span class="estado">✓</span><span class="quitar" title="Quitar">✕</span>' : '');
    b.onclick = (e) => {
      if (e.target.classList.contains('quitar')) { delete f.partes[p.id]; render(); return; }
      activa = p.id; render();
    };
    lista.appendChild(b);
  });
  document.querySelectorAll('.marca').forEach(m => m.remove());
  for (const [id, pt] of Object.entries(f.partes)) {
    const m = document.createElement('div');
    m.className = 'marca';
    m.style.left = (pt.fx * 100) + '%'; m.style.top = (pt.fy * 100) + '%';
    m.innerHTML = '<b>' + etiqueta[id] + '</b>';
    lienzo.appendChild(m);
  }
  if (f.heredada) mensaje('Arrancó con las marcas de la foto anterior: corregí las que estén corridas.');
}

function mensaje(t) { document.getElementById('msg').textContent = t; }

function fraccion(ev) {
  const r = img.getBoundingClientRect();
  return { fx: Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)),
           fy: Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height)) };
}

lienzo.addEventListener('click', ev => {
  if (!activa) { mensaje('Primero elegí una parte de la lista.'); return; }
  foto().partes[activa] = fraccion(ev);
  foto().heredada = false;
  mensaje('');
  render();
});

lienzo.addEventListener('mousemove', ev => {
  const r = img.getBoundingClientRect();
  const nx = (ev.clientX - r.left) / r.width * img.naturalWidth;
  const ny = (ev.clientY - r.top) / r.height * img.naturalHeight;
  const lado = 40, z = lupa.width / lado;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, lupa.width, lupa.height);
  ctx.drawImage(img, nx - lado / 2, ny - lado / 2, lado, lado, 0, 0, lupa.width, lupa.height);
  ctx.strokeStyle = '#ff2d55'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(lupa.width / 2, 0); ctx.lineTo(lupa.width / 2, lupa.height);
  ctx.moveTo(0, lupa.height / 2); ctx.lineTo(lupa.width, lupa.height / 2); ctx.stroke();
});

window.addEventListener('keydown', ev => {
  const d = { ArrowLeft:[-1,0], ArrowRight:[1,0], ArrowUp:[0,-1], ArrowDown:[0,1] }[ev.key];
  if (!d || !activa || !foto().partes[activa]) return;
  ev.preventDefault();
  const p = foto().partes[activa];
  p.fx = Math.min(1, Math.max(0, p.fx + d[0] / img.naturalWidth));
  p.fy = Math.min(1, Math.max(0, p.fy + d[1] / img.naturalHeight));
  render();
});

async function guardar() {
  const f = foto();
  const r = await fetch('/guardar/' + i, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(f.partes) });
  if (!r.ok) { mensaje('No se pudo guardar.'); return false; }
  f.heredada = false;
  return true;
}

document.getElementById('guardar').onclick = async () => {
  if (!(await guardar())) return;
  if (i < D.fotos.length - 1) { i++; cargar(); mensaje('Guardado ✓'); }
  else mensaje('Guardado ✓ — era la última. Tocá Terminar.');
};
document.getElementById('terminar').onclick = async () => {
  await guardar();
  await fetch('/fin', { method:'POST' });
  document.body.innerHTML = '<p style="padding:40px;font:700 20px system-ui">Listo ✓ Ya podés cerrar esta pestaña.</p>';
};
cargar();
</script></body></html>`;
}

/** Pasa las marcas de una foto de referencia a otras del mismo modelo. */
async function copiarDe(referencia: string, destinos: string[]): Promise<void> {
  const previo = JSON.parse(await fs.readFile(`${referencia}.anclas.json`, 'utf8')) as ArchivoAnclas;
  for (const destino of destinos) {
    if (path.resolve(destino) === path.resolve(referencia)) continue;
    const t = await trasladarPartes(referencia, destino);
    const rec = await recortarAnteojo(destino);
    const salida: ArchivoAnclas = {
      foto: path.basename(destino),
      recorte: { width: rec.width, height: rec.height },
      partes: t.partes,
    };
    await fs.writeFile(`${destino}.anclas.json`, JSON.stringify(salida, null, 2) + '\n');
    console.log(
      `  ✓ ${path.basename(destino)}.anclas.json: escala ${t.escala.toFixed(3)}, calce ${t.calce.toFixed(2)}` +
        (t.dudoso ? '  ⚠️ alineación dudosa: revisá esta placa' : '') +
        ` (de ${path.basename(previo.foto)})`,
    );
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const iCopia = args.indexOf('--copiar-de');
  if (iCopia !== -1) {
    const referencia = args[iCopia + 1];
    if (!referencia) throw new Error('--copiar-de necesita la foto de referencia.');
    const destinos = args.filter((a, i) => !a.startsWith('--') && i !== iCopia + 1);
    await copiarDe(referencia, destinos);
    return;
  }
  const rutas = args.filter((a) => !a.startsWith('--'));
  if (rutas.length === 0) {
    console.error('Uso: pnpm anclas <foto-perfil.jpg> [otra-foto.jpg ...]');
    process.exit(1);
  }

  const fotos: FotoCargada[] = [];
  for (const ruta of rutas) {
    const recorte = await recortarAnteojo(ruta);
    const rutaJson = `${ruta}.anclas.json`;
    let partes: Partes = {};
    try {
      const previo = JSON.parse(await fs.readFile(rutaJson, 'utf8')) as ArchivoAnclas;
      partes = previo.partes ?? {};
    } catch {
      /* foto sin marcas todavía */
    }
    fotos.push({ ruta, rutaJson, png: recorte.buffer, width: recorte.width, height: recorte.height, partes });
  }

  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    const foto = /^\/foto\/(\d+)\.png$/.exec(url.pathname);
    const guardar = /^\/guardar\/(\d+)$/.exec(url.pathname);

    if (req.method === 'GET' && url.pathname === '/') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(pagina(fotos));
    } else if (req.method === 'GET' && foto) {
      const f = fotos[Number(foto[1])];
      if (!f) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'content-type': 'image/png', 'cache-control': 'no-store' });
      res.end(f.png);
    } else if (req.method === 'POST' && guardar) {
      const f = fotos[Number(guardar[1])];
      if (!f) { res.writeHead(404).end(); return; }
      let cuerpo = '';
      req.on('data', (c) => (cuerpo += c));
      req.on('end', async () => {
        try {
          const partes = JSON.parse(cuerpo) as Partes;
          const salida: ArchivoAnclas = {
            foto: path.basename(f.ruta),
            recorte: { width: f.width, height: f.height },
            partes,
          };
          await fs.writeFile(f.rutaJson, JSON.stringify(salida, null, 2) + '\n');
          console.log(`  ✓ ${path.basename(f.rutaJson)} (${Object.keys(partes).length} partes)`);
          res.writeHead(200).end('ok');
        } catch {
          res.writeHead(400).end('json inválido');
        }
      });
    } else if (req.method === 'POST' && url.pathname === '/fin') {
      res.writeHead(200).end('ok');
      setTimeout(() => process.exit(0), 200);
    } else {
      res.writeHead(404).end();
    }
  });

  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address() as { port: number };
    const url = `http://127.0.0.1:${port}/`;
    console.log(`\nAbrí ${url} si no se abre solo. Cuando termines, tocá "Terminar".`);
    exec(`open "${url}"`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

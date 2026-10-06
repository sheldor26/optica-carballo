/**
 * Busca, entre las imágenes descargadas de reefeyewear.com, las que tienen la
 * SILUETA más parecida a unas fotos de referencia del mismo modelo. Sirve para
 * modelos dados de baja: la marca saca el producto del catálogo pero deja viva
 * la URL de cada imagen (https://reefeyewear.com/<id>/x.jpg, el id manda).
 *
 * 1) Bajar un rango de ids (24 en paralelo) a una carpeta y quedarse sólo con JPEG:
 *      mkdir /tmp/scan && cd /tmp/scan
 *      seq 3000 5600 | xargs -P 24 -I{} sh -c 'curl -s -f -m 20 "https://reefeyewear.com/{}/x.jpg" -o {}.jpg || rm -f {}.jpg'
 *      for f in *.jpg; do file -b "$f" | grep -q JPEG || rm -f "$f"; done
 * 2) Correr:  node scripts/marca-buscar-por-silueta.cjs /tmp/scan ref1.jpg ref2.jpg ...
 *    Imprime los 40 ids más parecidos (IoU de la silueta sobre su caja, 1.00 = igual).
 *    Las referencias deben tener el mismo ángulo de cámara que las de la marca
 *    (3/4 con la patilla); sirven fotos de ML o de una revendedora del mismo modelo.
 * 3) Mirar el montaje de los mejores a ojo: la silueta no distingue modelos
 *    parecidos, pero deja 40 candidatos en vez de 3.700 (Reef 183 Bolero:
 *    los 5 colores cayeron entre los 6 primeros).
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function mascara(f) {
  const { data, info } = await sharp(f).flatten({ background: '#fff' }).raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, x1 = 0, y0 = info.height, y1 = 0;
  const ch = info.channels;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * ch;
      if (data[i] < 235 || data[i + 1] < 235 || data[i + 2] < 235) {
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  if (x1 <= x0 || y1 <= y0) return null;
  const c = await sharp(f).flatten({ background: '#fff' })
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .resize(96, 48, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
  const m = new Uint8Array(96 * 48);
  for (let i = 0; i < m.length; i++) {
    const j = i * c.info.channels;
    m[i] = c.data[j] < 225 || c.data[j + 1] < 225 || c.data[j + 2] < 225 ? 1 : 0;
  }
  return m;
}

(async () => {
  const [dir, ...refsArg] = process.argv.slice(2);
  if (!dir || refsArg.length === 0) { console.error('Uso: node scripts/marca-buscar-por-silueta.cjs <carpeta> <ref.jpg> [...]'); process.exit(1); }
  const refs = [];
  for (const r of refsArg) { const m = await mascara(r); if (m) refs.push(m); }
  const res = [];
  for (const f of fs.readdirSync(dir).filter((x) => /^\d+\.jpg$/.test(x))) {
    let m; try { m = await mascara(path.join(dir, f)); } catch { continue; }
    if (!m) continue;
    let mejor = 0;
    for (const r of refs) {
      let inter = 0, uni = 0;
      for (let i = 0; i < r.length; i++) { if (r[i] && m[i]) inter++; if (r[i] || m[i]) uni++; }
      mejor = Math.max(mejor, inter / uni);
    }
    res.push([f, mejor]);
  }
  res.sort((a, b) => b[1] - a[1]);
  console.log(res.slice(0, 40).map(([f, s]) => `${f.replace('.jpg', '')}:${s.toFixed(2)}`).join(' '));
})();

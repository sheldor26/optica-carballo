# Video de producto — HyperFrames

Template de video **1:1 (1080×1080)** para mostrar un anteojo: intro de marca →
perfil → frente → ficha técnica → precio/CTA. Pensado para feed de Instagram y
para embeber en la web. Hecho con [HyperFrames](https://hyperframes.heygen.com)
(HTML → MP4 determinístico).

## Requisitos

- Node 18+ y conexión a internet (la primera vez baja HyperFrames + Chrome headless).
- FFmpeg/FFprobe: se resuelven solos vía `ffmpeg-static` / `ffprobe-static` (no hace
  falta instalar nada en el sistema). Los symlinks `bin/ffmpeg` y `bin/ffprobe` se
  crean en `npm install` (postinstall).

## Uso

```bash
npm install          # instala deps + crea bin/ffmpeg y bin/ffprobe (una vez)
npm run dev          # preview en el navegador con live reload
npm run check        # lint + validate + inspect (correr antes de renderizar)
npm run render       # genera renders/product-video_<fecha>.mp4
```

## Generar el video de OTRO producto

1. Reemplazá las fotos en `assets/`:
   - `esvep-perfil.jpg` → foto de **perfil** del nuevo modelo
   - `esvep-frente.jpg` → foto de **frente**
   (o cambiá las rutas en `data.js`). Bajalas del bucket público:
   `https://<supabase>/storage/v1/object/public/products/<slug>/<archivo>`
2. Editá `data.js` con marca, modelo, specs, precio, etc.
3. `npm run render`.

> ⚠️ **Reglas de negocio**: no afirmar cuotas/promos/beneficios que no estén
> confirmados (ver `priceNote` en `data.js`). Specs y precio siempre reales.

## Cómo funciona

- `index.html` — composición + timeline GSAP (en pausa, el renderer la "seekea").
- `data.js` — datos del producto (lo único que se cambia por modelo).
- Fuentes: **Inter** + **Playfair Display** (las provee HyperFrames de forma
  determinística; no se usa Google Fonts para que el render no dependa de la red).

## Notas

- `bin/`, `node_modules/` y `renders/` están gitignoreados.
- Para cambiar a vertical 9:16 (reels): cambiar `data-width/height` del `#root`,
  el `<meta viewport>` y los `width/height` de `html, body` a `1080×1920`, y
  reacomodar el layout de las escenas.

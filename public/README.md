# public/

Assets estáticos servidos desde la raíz del dominio. Por ejemplo,
`public/brand/logo.png` se accede como `https://opticacarballo.com.ar/brand/logo.png`.

## Estructura

```
public/
├── favicon.ico              # Favicon principal (Next 15 también acepta app/favicon.ico)
├── apple-touch-icon.png     # 180×180, para iOS home screen
├── icon.png                 # 512×512, para PWA / Android
├── brand/
│   ├── logo.png             # Logo principal (header, footer). Idealmente fondo transparente.
│   ├── logo.svg             # Logo vectorial (preferido sobre PNG cuando esté disponible)
│   ├── logo-square.png      # Logo en cuadrado azul (versión que el founder ya tiene)
│   └── isotipo.svg          # Sin texto, solo símbolo
├── og/
│   └── og-default.png       # 1200×630, Open Graph default para compartir en redes
└── products/
    └── <brand-slug>/        # Una carpeta por marca
        └── <product-slug>/  # Una carpeta por producto
            ├── 01-main.webp # Imagen principal
            ├── 02.webp      # Adicionales
            └── ...
```

## Reglas

1. **Formatos**:
   - Logo: SVG si es posible, PNG con transparencia como fallback.
   - Productos: WebP (mejor compresión) o JPEG. NO PNG salvo que requiera transparencia.
   - Favicons: ICO + PNG según la convención.
2. **Naming**: kebab-case, sin espacios ni acentos.
3. **Tamaños sugeridos**:
   - Logo header: ancho 120-200px, altura ~40px (alto).
   - Productos: 1200×1200 (square) o 1600×1200 (4:3). Next.js los optimiza.
   - OG image: 1200×630.
4. **NO commitear** binarios pesados (>1 MB). Si crece mucho, migrar a Supabase Storage.

## Cuando agregás un asset

Para usarlo en código:

```tsx
import Image from 'next/image';

<Image
  src="/brand/logo.svg"     // path desde public/ con / inicial
  alt="Óptica Carballo"
  width={160}
  height={40}
  priority                  // solo para LCP (logo del header)
/>
```

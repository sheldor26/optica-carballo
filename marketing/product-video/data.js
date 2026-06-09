/**
 * Datos del producto para el video. Para generar el video de otro modelo:
 *   1. Reemplazá las imágenes en assets/ (perfil + frente).
 *   2. Editá los valores de abajo.
 *   3. npm run render
 * Sin fetch / sin red en runtime: el render es determinístico (regla HyperFrames).
 */
window.PRODUCT = {
  brand: 'RUSTY',
  model: 'Esvep',
  tagline: 'Envolvente deportivo · Unisex',
  perfil: 'assets/esvep-perfil.jpg',
  frente: 'assets/esvep-frente.jpg',
  // Escala de la foto dentro del card (la foto del catálogo es 2:1 y el
  // anteojo ocupa poco del cuadro). Igual criterio que image-scale-overrides.
  imageScale: 1.35,
  specs: [
    { label: 'Material', value: 'G-Flex flexible' },
    { label: 'Lente', value: 'Policarbonato UV400 · Cat 3' },
    { label: 'Filtro', value: 'Polarizado' },
    { label: 'Medidas', value: '140 · 60×46 · 10 · 130 mm' },
  ],
  price: '$76.194',
  // Nota sobre el precio. NO afirmar cuotas/promos sin confirmar la política
  // (regla dura: no prometer lo que no podemos cumplir). Ej. si se confirma:
  // 'Precio final · 3 cuotas sin interés'.
  priceNote: 'Precio final',
  includes: 'Estuche + franela + garantía 1 año',
  cta: 'Envío a todo el país',
  trust: 'Óptica matriculada · 30 años',
};

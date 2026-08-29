-- ============================================
-- Seed 104: sacar el claim de "cuero" del alt del kit de Vulk
-- Fecha: 2026-08-29
-- ============================================
-- El seed 17 (2026-05-30) dejó publicado este alt en `brands.includes_image_alt` de Vulk:
--
--   'Vulk kit incluido: estuche de cuero, franela de microfibra y stickers de marca'
--                                    ^^^^^^^^
--
-- Esa imagen la inyecta `buildGalleryImages()` (`components/catalog/product-page.tsx:69`) al final
-- de la galería de **TODOS los productos Vulk**, así que el claim estuvo vivo en **33 productos
-- activos** durante ~3 meses.
--
-- ⚠️ NO SABEMOS SI ES CUERO. El founder lo confirmó el 2026-08-29, textual:
-- *"Es estuche Vulk tipo de cuero (no se si es cuero)"*. O sea que el material nunca estuvo
-- verificado: se dedujo de que la foto parece cuero. Afirmarlo viola la **regla dura 3** (no
-- prometemos lo que no podemos cumplir) y la **8** (trust signals reales, no inventados).
--
-- Y "símil cuero" / "cuerina" NO es el arreglo: afirma lo contrario con exactamente la misma falta
-- de dato. Si el estuche resultara ser cuero de verdad, sería igual de falso. **La única salida
-- honesta es no nombrar el material**, que además es lo que ya pedía `BUSINESS_POLICIES.md` §1
-- ("no adjetivos calificativos del estuche, sólo estuche original de la marca") — la regla existía,
-- pero se escribió mirando las descripciones y nadie auditó los alt.
--
-- 📸 QUÉ MUESTRA LA FOTO, mirada de verdad antes de redactar el alt nuevo
-- (`brands-shared/vulk-estuche-franela.jpg`, 1800×1200): un **estuche negro tipo sobre, con solapa
-- triangular y broche a presión**, con el logo Vulk grabado en relieve; una **franela de microfibra
-- negra** con el logo; y **stickers y tarjetas VULKEYEWEAR**. Superficie lisa y con brillo suave.
-- No es un estuche rígido tipo almeja. El alt nuevo describe la FORMA, que es verificable en la
-- propia foto, en vez del MATERIAL, que no lo es.
--
-- ✅ "ESTUCHE" QUEDA CONFIRMADO POR DOS FUENTES INDEPENDIENTES, así que no hay que reescribir
-- ninguna de las 33 fichas ni tocar el default `includes: ["estuche","franela"]`:
--   1. El founder, que lo tiene en la mano.
--   2. Las propias publicaciones de ML: `ACCESSORIES_INCLUDED` dice **"Estuche"** en 5 de 6 items
--      consultados (Guardian y Deserve: "Caja,Estuche,Paño de limpieza"; Dunsert ×2 y CCCP:
--      "Estuche"; Ardigan no declara accesorios).
--      ⚠️ El **"Funda" del Cinema era el outlier**, y fue lo que disparó toda la duda en
--      DATOS_PENDIENTES.md. Es un dato mal cargado en ESA publicación, no la regla de la marca.
--      Queda anotado para que el founder lo corrija en ML cuando quiera — no se toca desde acá.
--
-- Rusty no tiene `includes_image_path`, así que no hay alt equivalente que revisar: Vulk es la única
-- marca con imagen de kit brand-wide.
-- ============================================

BEGIN;

UPDATE public.brands
SET
  includes_image_alt = 'Vulk kit incluido: estuche negro con solapa y broche, franela de microfibra y stickers de marca',
  updated_at         = now()
WHERE slug = 'vulk';

COMMIT;

-- Verificación:
--   SELECT slug, includes_image_alt FROM public.brands WHERE slug='vulk';
-- Esperado: sin la palabra "cuero".

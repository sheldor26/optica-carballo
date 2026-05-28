-- ============================================
-- Migration: catalog_foundation
-- ADRs: 004 (URLs SEO), 005 (variantes), 013 (Storage), 019 (prioridad de carga)
-- Fecha: 2026-05-28
-- Reversible: sí (ver rollback al final)
-- ============================================
-- Crea las 5 tablas del catálogo base: brands, categories, products,
-- product_variants, product_images. Función helper handle_updated_at()
-- reusable por migraciones futuras. RLS habilitado en todas con políticas
-- de lectura pública solo para registros activos. Escritura solo service_role.
-- ============================================

BEGIN;

-- =====================================================================
-- Extensions
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================================
-- Helper function: handle_updated_at()
-- Reusable por toda tabla que tenga columna updated_at.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =====================================================================
-- Table: brands
-- =====================================================================
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  logo_url text,
  is_argentine boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  meta_title text,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_brands_slug ON public.brands(slug);
CREATE INDEX idx_brands_is_active ON public.brands(is_active) WHERE is_active = true;
CREATE INDEX idx_brands_is_argentine ON public.brands(is_argentine) WHERE is_argentine = true;

CREATE TRIGGER on_brands_updated
  BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read active brands"
  ON public.brands
  FOR SELECT
  USING (is_active = true);

-- =====================================================================
-- Table: categories (jerárquica via parent_id)
-- auto_filter: criterios JSONB para auto-asignar productos.
-- Ejemplo: { "frame_shape": "round" } o { "lens_color": "polarized" }
-- =====================================================================
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT,
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  auto_filter jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  meta_title text,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- Slug único dentro del mismo padre (permite "polarizados" bajo sol y receta).
  UNIQUE NULLS NOT DISTINCT (parent_id, slug)
);

CREATE INDEX idx_categories_parent ON public.categories(parent_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_is_active ON public.categories(is_active) WHERE is_active = true;
CREATE INDEX idx_categories_auto_filter ON public.categories USING gin(auto_filter);

CREATE TRIGGER on_categories_updated
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read active categories"
  ON public.categories
  FOR SELECT
  USING (is_active = true);

-- =====================================================================
-- Table: products
-- attributes (JSONB): características técnicas del modelo base.
-- Ejemplo:
-- {
--   "frame_material": "acetate",
--   "frame_shape": "wayfarer",
--   "lens_treatment": ["polarized", "uv_protection"],
--   "gender": "unisex"
-- }
-- =====================================================================
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  short_description text,
  description text,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  meta_title text,
  meta_description text,
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(short_description, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(description, '')), 'C')
  ) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_brand ON public.products(brand_id);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_is_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_is_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_attributes ON public.products USING gin(attributes);
CREATE INDEX idx_products_search ON public.products USING gin(search_vector);

CREATE TRIGGER on_products_updated
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read active products"
  ON public.products
  FOR SELECT
  USING (is_active = true);

-- =====================================================================
-- Table: product_variants (SKUs vendibles)
-- attributes (JSONB): específicas de la variante.
-- Ejemplo: { "frame_color": "negro", "lens_color": "gris", "size": "53-19-145" }
-- price_cents: en centavos de ARS (evita floats con plata).
-- =====================================================================
CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku text UNIQUE NOT NULL,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  price_cents bigint NOT NULL CHECK (price_cents >= 0),
  -- Regla dura #1 del proyecto: solo vendemos lo que tenemos en stock real.
  stock_qty int NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX idx_product_variants_in_stock ON public.product_variants(product_id)
  WHERE is_active = true AND stock_qty > 0;
CREATE INDEX idx_product_variants_attributes ON public.product_variants USING gin(attributes);

CREATE TRIGGER on_product_variants_updated
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Lectura pública solo de variantes activas Y de productos activos.
CREATE POLICY "anyone can read active variants of active products"
  ON public.product_variants
  FOR SELECT
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id
        AND p.is_active = true
    )
  );

-- =====================================================================
-- Table: product_images
-- variant_id NULL = imagen del producto base (compartida entre variantes).
-- storage_path: path en bucket Storage "products" (creado aparte).
-- =====================================================================
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  alt_text text NOT NULL,
  width int CHECK (width IS NULL OR width > 0),
  height int CHECK (height IS NULL OR height > 0),
  sort_order int NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_images_product ON public.product_images(product_id, sort_order);
CREATE INDEX idx_product_images_variant ON public.product_images(variant_id) WHERE variant_id IS NOT NULL;
-- Solo una imagen primary por producto (cuando variant_id es NULL).
CREATE UNIQUE INDEX idx_product_images_primary_per_product
  ON public.product_images(product_id)
  WHERE is_primary = true AND variant_id IS NULL;

CREATE TRIGGER on_product_images_updated
  BEFORE UPDATE ON public.product_images
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read images of active products"
  ON public.product_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id
        AND p.is_active = true
    )
  );

COMMIT;

-- ============================================
-- Rollback plan (ejecutar manualmente si hay que revertir)
-- ============================================
-- BEGIN;
-- DROP TABLE IF EXISTS public.product_images CASCADE;
-- DROP TABLE IF EXISTS public.product_variants CASCADE;
-- DROP TABLE IF EXISTS public.products CASCADE;
-- DROP TABLE IF EXISTS public.categories CASCADE;
-- DROP TABLE IF EXISTS public.brands CASCADE;
-- DROP FUNCTION IF EXISTS public.handle_updated_at();
-- COMMIT;

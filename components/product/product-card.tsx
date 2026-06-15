'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { isCheckoutEnabled } from '@/lib/features';
import { formatPriceCents } from '@/lib/format/currency';
import {
  INSTALLMENTS_ENABLED,
  INTEREST_FREE_INSTALLMENTS,
  installmentAmountCents,
} from '@/lib/site/installments';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { buildProductImageAlt } from '@/lib/catalog/image-alt';
import { QuickAddButton } from '@/components/cart/quick-add-button';
import { AnimatedPrice } from '@/components/product/animated-price';
import { QuickView } from '@/components/product/quick-view';
import { SizeFitBadge } from '@/components/product/size-fit-badge';
import { CrossfadeImage } from '@/components/ui/crossfade-image';
import { TiltCard } from '@/components/ui/tilt-card';
import { WishlistButton } from '@/components/wishlist/wishlist-button';

export type ProductCardVariant = {
  id: string;
  /** SKU — para deep-link `?v=<sku>` a la PDP con esta variante preseleccionada. */
  sku: string;
  /** Precio de ESTA variante en centavos. Para mostrar el precio específico
   * al hacer hover/select en el grid (founder 2026-05-31: variantes con
   * precio distinto deben reflejar su precio al posarse). */
  priceCents: number;
  /** Label legible (color del armazón). Para tooltip + a11y. */
  label: string;
  /** Imagen primary de esta variante (la que muestra el thumbnail). */
  primaryImagePath: string | null;
  /** Imagen secondary (lateral). Para hover swap dentro de la misma variante. */
  secondaryImagePath: string | null;
  /** Scale CSS para normalizar tamaño visual entre fotos no-uniformes.
   * Default 1. Ver `lib/catalog/image-scale-overrides.ts`. */
  primaryImageScale: number;
  secondaryImageScale: number;
  inStock: boolean;
  /** Estado de stock para indicador visual en el thumbnail del grid card.
   * - `out_of_stock`: stock_qty=0 → dot rojo + opacity-50 (founder 2026-05-31).
   * - `low_stock`: stock_qty 1-3 → dot ámbar (advertencia "se está agotando").
   * - `in_stock`: stock_qty 4+ → sin indicador.
   * Threshold ≤3 alineado con VariantList "Solo quedan N". */
  stockState: 'in_stock' | 'low_stock' | 'out_of_stock';
  /** Si ESTA variante es polarizada (`attributes.polarized === true`). El
   * badge "Polarizado" de la card sigue a la variante mostrada — honesto en
   * modelos parcialmente polarizados (no todas las variantes lo son). */
  polarized?: boolean;
};

export type ProductCardData = {
  slug: string;
  name: string;
  shortDescription: string | null;
  minPriceCents: number | null;
  inStockCount: number;
  /** Imagen primary de la variante DEFAULT (la que se muestra al cargar). */
  primaryImagePath: string | null;
  /** Imagen secondary de la variante DEFAULT (para hover swap). */
  secondaryImagePath: string | null;
  /** Scale CSS para imagen default primary/secondary. Default 1 si consumer
   * no lo provee. */
  primaryImageScale?: number;
  secondaryImageScale?: number;
  href: string;
  /** Para construir entry de wishlist. */
  categorySlug: string;
  brandSlug: string;
  /** Nombre legible de la marca (ej "Rusty"). Se muestra como eyebrow arriba
   * del nombre SOLO en grids multi-marca (categoría/forma/género/favoritos/
   * related). En páginas de una marca se omite (redundante). */
  brandName?: string;
  /** Talle del armazón (`attributes.size_fit`) para el badge sobre la foto.
   * Ej "junior". Null/undefined = sin badge. Ver `lib/catalog/size-fit.ts`. */
  sizeFit?: string | null;
  /** Variantes para thumbnails clickeables. La primera entrada suele ser la
   * misma que primaryImagePath / secondaryImagePath. Si solo hay 1 variante
   * o el shape no lo provee (compat con consumers viejos), los thumbs NO
   * se renderizan. */
  variants?: ProductCardVariant[];
};

// 3 thumbs máx (era 5) — con la grilla a 4 col las cards son angostas (~218px en
// laptops 1024-1279); 3 thumbs + "+N" entran sin desbordar a la card vecina.
const MAX_VISIBLE_THUMBS = 3;

/**
 * Card minimalista estilo retail premium. Foto del producto domina,
 * nombre + precio centrados debajo, thumbnails de variantes opcionales.
 *
 * Interactividad (client component):
 * - Hover sobre la card → swap entre primary (frontal) y secondary (lateral)
 *   de la MISMA variante seleccionada (NO cambia a otra variante).
 * - Click en thumbnail → cambia la variante mostrada en la card.
 *
 * WishlistButton va como sibling del Link (no DENTRO) para evitar HTML
 * inválido (<button> dentro de <a>). El article wrapper es relative para
 * que el botón posicionado absolute funcione.
 */
export function ProductCard({ product }: { product: ProductCardData }) {
  const outOfStock = product.inStockCount === 0;
  const variants = product.variants ?? [];
  // Ref al contenedor de la imagen: origen del "vuelo al carrito" del quick-add.
  const imageRef = useRef<HTMLDivElement>(null);
  // Mostrar thumbnails si hay al menos 1 variante con foto. Antes era >1
  // (solo si había múltiples para elegir), pero founder 2026-05-31 pidió
  // que aparezca al menos 1 thumb incluso con variante única — da
  // consistencia visual al grid (todos los cards muestran thumb).
  const hasVariantThumbnails =
    variants.length >= 1 && variants.some((v) => v.primaryImagePath !== null);

  // Estado: variante actualmente mostrada. Default: la primera del array
  // (que es la que matchea con primary/secondaryImagePath del data).
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );

  // Imágenes a mostrar: si hay variante seleccionada, usar sus imágenes.
  // Si no (caso edge: producto sin variantes), usar las top-level del data.
  const currentImages = useMemo(() => {
    if (selectedVariantId === null) {
      return {
        primary: product.primaryImagePath,
        secondary: product.secondaryImagePath,
        primaryScale: product.primaryImageScale ?? 1,
        secondaryScale: product.secondaryImageScale ?? 1,
      };
    }
    const variant = variants.find((v) => v.id === selectedVariantId);
    if (!variant) {
      return {
        primary: product.primaryImagePath,
        secondary: product.secondaryImagePath,
        primaryScale: product.primaryImageScale ?? 1,
        secondaryScale: product.secondaryImageScale ?? 1,
      };
    }
    return {
      primary: variant.primaryImagePath,
      secondary: variant.secondaryImagePath,
      primaryScale: variant.primaryImageScale,
      secondaryScale: variant.secondaryImageScale,
    };
  }, [
    selectedVariantId,
    variants,
    product.primaryImagePath,
    product.secondaryImagePath,
    product.primaryImageScale,
    product.secondaryImageScale,
  ]);

  const primaryUrl = currentImages.primary
    ? getProductImageUrl(currentImages.primary)
    : null;
  const secondaryUrl = currentImages.secondary
    ? getProductImageUrl(currentImages.secondary)
    : null;

  // Variante actualmente seleccionada (hover/click en thumbnail). Usada para
  // (a) mostrar el precio específico de la variante si difiere del mínimo, y
  // (b) deep-link `?v=<sku>` a la PDP con esa variante preseleccionada.
  const selectedVariant =
    selectedVariantId !== null
      ? variants.find((v) => v.id === selectedVariantId)
      : undefined;

  // Badge "Polarizado": sigue a la variante mostrada (igual que el precio).
  // Honesto en modelos parcialmente polarizados — solo aparece cuando la
  // variante previsualizada lo es. Fallback a la primera variante.
  const isPolarized = (selectedVariant ?? variants[0])?.polarized === true;

  // Precio mostrado (founder 2026-06-02: el precio sigue a la variante elegida y
  // SOLO figura si esa variante tiene stock):
  // - Variante seleccionada → su precio si tiene stock, vacío (null) si no.
  // - Sin variante seleccionada (edge) → mínimo del producto si hay stock, si no null.
  // Nunca mostramos el precio de otra variante cuando la elegida está agotada.
  const displayPriceCents = selectedVariant
    ? selectedVariant.inStock
      ? selectedVariant.priceCents
      : null
    : outOfStock
      ? null
      : product.minPriceCents;

  // href: si hay variante seleccionada, deep-link con su SKU para que la PDP
  // abra mostrando esa variante (founder 2026-05-31).
  const href = selectedVariant
    ? `${product.href}?v=${encodeURIComponent(selectedVariant.sku)}`
    : product.href;

  // Quick-add desde la grilla: agrega la variante mostrada (si tiene stock),
  // sino la primera con stock. Solo si el checkout está activo y hay alguna
  // variante comprable. Sin variantes / todo agotado → sin botón.
  const quickAddVariant =
    selectedVariant?.inStock === true
      ? selectedVariant
      : variants.find((v) => v.inStock);
  const showQuickAdd = isCheckoutEnabled() && quickAddVariant !== undefined;

  // Alt descriptivo para Google Imágenes. El bloque de imagen está aria-hidden
  // (el nombre va en el aria-label del link), así que esto es solo para SEO.
  const imageAlt = buildProductImageAlt({
    name: product.name,
    brandName: product.brandName,
    categorySlug: product.categorySlug,
  });

  return (
    <TiltCard className="h-full">
    <article className="group/card relative flex h-full flex-col">
      <WishlistButton
        entry={{
          slug: product.slug,
          category: product.categorySlug,
          brand: product.brandSlug,
        }}
        variant="card"
      />
      <QuickView slug={product.slug} href={href} />
      {product.sizeFit && (
        <div className="pointer-events-none absolute left-2 top-2 z-10">
          <SizeFitBadge sizeFit={product.sizeFit} size="sm" />
        </div>
      )}
      {/* Quick-add: overlay que espeja la geometría de la imagen (aspect-[3/2]
          w-full) para apoyar el botón en su esquina inferior derecha. Sibling
          del Link (no adentro) para no anidar <button> en <a>. Visible siempre
          en mobile, reveal en hover en desktop. */}
      {showQuickAdd && quickAddVariant && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10"
          aria-hidden="false"
        >
          <div className="relative aspect-[3/2] w-full">
            <QuickAddButton
              variantId={quickAddVariant.id}
              productName={product.name}
              getOrigin={() => imageRef.current}
              className="pointer-events-auto absolute bottom-2 right-2 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover/card:opacity-100"
            />
          </div>
        </div>
      )}
      <Link
        href={href}
        className="flex h-full flex-col"
        aria-label={product.name}
      >
        {/* bg-background (white) — antes era bg-zinc-50 para "sutil contraste"
            (commit c368013), pero las fotos de productos suelen venir con
            fondo blanco. Cuando la foto no llena 100% el container (scales
            <1.8 dejan barras visibles), se notaba borde gris alrededor.
            Founder reportó issue 2026-05-31. Rollback a white — el "premium
            feel" del hover (shadow + scale 1.04) compensa la perdida sutil. */}
        <div
          ref={imageRef}
          className="group/image bg-background relative aspect-[3/2] w-full overflow-hidden rounded-md transition-shadow duration-500 ease-out group-hover/card:shadow-lg group-hover/card:shadow-zinc-900/[0.08]"
          aria-hidden="true"
        >
          {primaryUrl ? (
            <>
              <CrossfadeImage
                src={primaryUrl}
                scale={currentImages.primaryScale}
                alt={imageAlt}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                durationMs={350}
                className={cn(
                  'absolute inset-0',
                  secondaryUrl &&
                    'transition-opacity duration-700 ease-out group-hover/image:opacity-0',
                )}
                imageClassName="object-contain transition-transform duration-700 ease-out group-hover/image:scale-[1.04]"
              />
              {secondaryUrl && (
                <Image
                  key={`${selectedVariantId ?? 'default'}-secondary`}
                  src={secondaryUrl}
                  alt={imageAlt}
                  fill
                  // Solo desktop (sm+): la swap de hover no existe en mobile.
                  // `hidden` en mobile = display:none → el browser NO descarga
                  // la 2ª foto en celular (perf: ~mitad de requests de imágenes).
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 1px"
                  style={{ transform: `scale(${currentImages.secondaryScale})` }}
                  className="hidden object-contain opacity-0 transition-all duration-700 ease-out group-hover/image:scale-[1.04] group-hover/image:opacity-100 sm:block"
                />
              )}
            </>
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
              Foto pendiente
            </div>
          )}
          {isPolarized && (
            <span className="absolute bottom-2 left-2 rounded-full bg-zinc-900/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
              Polarizado
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-1 flex-col items-center gap-2 text-center">
          {product.brandName && (
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.18em]">
              {product.brandName}
            </p>
          )}
          <h3 className="text-foreground font-serif text-lg font-medium leading-tight tracking-[-0.01em] transition-colors duration-300 group-hover/card:text-foreground/90 md:text-xl">
            {product.name}
          </h3>
          {displayPriceCents !== null ? (
            <>
              <p className="text-muted-foreground text-sm tabular-nums">
                <AnimatedPrice valueCents={displayPriceCents} />
              </p>
              {INSTALLMENTS_ENABLED && (
                <p className="text-foreground/80 text-xs tabular-nums">
                  {INTEREST_FREE_INSTALLMENTS} cuotas sin interés de{' '}
                  {formatPriceCents(installmentAmountCents(displayPriceCents))}
                </p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Sin stock</p>
          )}
          {variants.length > 1 && (
            <p className="text-muted-foreground/70 text-xs">
              {variants.length} colores
            </p>
          )}
        </div>
      </Link>

      {hasVariantThumbnails && (
        <VariantThumbnails
          variants={variants}
          selectedVariantId={selectedVariantId}
          onSelect={setSelectedVariantId}
          productHref={product.href}
        />
      )}
    </article>
    </TiltCard>
  );
}

/**
 * Tira horizontal de thumbnails (uno por variante). Cada thumbnail es un
 * Link a la PDP de ESA variante (deep-link `?v=<sku>`) — founder 2026-05-31:
 * "al hacer click en el thumbnail debería entrar a la publicación en esa
 * variante". En desktop, hover (onMouseEnter) previsualiza la variante en la
 * foto grande del card sin navegar; el click navega. En mobile (sin hover),
 * el tap navega directo a la PDP de la variante.
 *
 * Máx 3 thumbs (size-14=56px, uniforme) + "+N" — con la grilla a 4 col las
 * cards son angostas (~218px en laptops), 5 thumbs a 80px se desbordaban a la
 * card vecina (founder 2026-06-15). Indicador "+N" dinámico por breakpoint.
 */
function VariantThumbnails({
  variants,
  selectedVariantId,
  onSelect,
  productHref,
}: {
  variants: ProductCardVariant[];
  selectedVariantId: string | null;
  onSelect: (id: string) => void;
  /** href base del producto (sin query) para construir el deep-link `?v=`. */
  productHref: string;
}) {
  const visible = variants.slice(0, MAX_VISIBLE_THUMBS);
  const hiddenCount = variants.length - visible.length;
  // Mobile UX (founder feedback): si hay >3 variantes, mostrar SOLO 2 thumbs
  // + 1 cuadrito "+N" como 3er ítem. Total siempre = 3 cuadritos.
  // Si hay ≤3 variantes, mostrar todos los thumbs normales (sin cuadrito).
  const showMobileOverflowBox = variants.length > 3;
  const hiddenCountMobile = showMobileOverflowBox ? variants.length - 2 : 0;

  return (
    <div className="mt-3 flex max-w-full items-center justify-center gap-2 overflow-hidden">
      {visible.map((v, idx) => {
        const isActive = v.id === selectedVariantId;
        const url = v.primaryImagePath
          ? getProductImageUrl(v.primaryImagePath)
          : null;
        // En mobile con overflow: thumbs 0-1 visibles, 2+ hidden (su lugar lo
        // ocupa el cuadrito "+N"). En mobile sin overflow: todos visibles.
        // En desktop (md+): siempre visible (hasta MAX_VISIBLE_THUMBS=5).
        const hideOnMobile = showMobileOverflowBox && idx >= 2;
        // Indicador sutil de stock en thumbnail (founder 2026-05-31):
        // dot chiquito top-right según stockState. Rojo = sin stock,
        // ámbar = pocas unidades (≤3), nada = stock normal.
        const stockBadge =
          v.stockState === 'out_of_stock'
            ? { color: 'bg-red-500', label: 'Sin stock' }
            : v.stockState === 'low_stock'
              ? { color: 'bg-amber-500', label: 'Pocas unidades' }
              : null;
        const ariaLabel = stockBadge
          ? `Ver ${v.label} (${stockBadge.label})`
          : `Ver ${v.label}`;
        return (
          <Link
            key={v.id}
            href={`${productHref}?v=${encodeURIComponent(v.sku)}`}
            onMouseEnter={() => onSelect(v.id)}
            aria-label={ariaLabel}
            aria-current={isActive ? 'true' : undefined}
            title={stockBadge?.label}
            className={cn(
              'bg-background relative size-14 shrink-0 overflow-hidden rounded border transition-colors',
              isActive
                ? 'border-foreground'
                : 'border-border/60 hover:border-foreground/40',
              !v.inStock && 'opacity-50',
              hideOnMobile && 'hidden md:block',
            )}
          >
            {url ? (
              <Image
                src={url}
                alt={v.label}
                fill
                sizes="(max-width: 768px) 64px, 80px"
                className="object-contain p-1"
              />
            ) : (
              <span className="text-muted-foreground flex h-full items-center justify-center text-[10px]">
                —
              </span>
            )}
            {stockBadge && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute right-1 top-1 size-2 rounded-full ring-2 ring-background',
                  stockBadge.color,
                )}
              />
            )}
          </Link>
        );
      })}
      {/* Cuadrito "+N" mobile: ocupa lugar del 3er thumb cuando hay >3 variantes.
          Solo visible en mobile/tablet (<md). Linkea al PDP para ver todas las
          variantes. */}
      {showMobileOverflowBox && (
        <Link
          href={productHref}
          aria-label={`Ver las ${variants.length} variantes`}
          className="bg-background border-border/60 text-muted-foreground hover:border-foreground/40 flex size-14 shrink-0 items-center justify-center rounded border text-sm font-medium transition-colors md:hidden"
        >
          +{hiddenCountMobile}
        </Link>
      )}
      {/* Desktop (md+): indicador "+N" text inline si hay más de 5 variantes. */}
      {hiddenCount > 0 && (
        <span className="text-muted-foreground hidden text-xs md:inline">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Glasses, Sun } from 'lucide-react';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import type { CompanionModality } from '@/lib/catalog/queries';

/**
 * Cross-link sol↔receta en la PDP. Dos casos, copy distinto a propósito:
 * - `exact`: las dos versiones del MISMO modelo (anteojo de sol y armazón de
 *   receta). Captura la objeción "lindo, pero lo quiero con mi graduación"
 *   (y al revés) en la zona de decisión, debajo del selector de variantes.
 * - `similar`: NO es el mismo modelo, es una alternativa parecida (misma
 *   marca + forma + precio similar) cuando no existe la versión exacta. El
 *   copy NUNCA debe insinuar que es el mismo anteojo (conversion-optimizer
 *   2026-08-01) — decirlo sería falso y rompe confianza justo acá.
 *
 * Decisión CRO (conversion-optimizer 2026-06-14): link-card liviano, SIN color
 * de acción (no compite con el CTA de compra/WhatsApp), thumbnail del modelo
 * destino, misma pestaña. NO va en el sticky buy bar. No se afirma "polarizada"
 * del lado sol→receta porque no todos los modelos lo son (honestidad). Mismo
 * tratamiento visual para ambos casos (conversion-optimizer 2026-08-01: el
 * copy ya deja claro la diferencia, un badge/color distinto sería sobre-
 * ingeniería para un elemento subordinado al CTA principal). Server component,
 * 0 JS.
 */
export function CrossModalityLink({ companion }: { companion: CompanionModality }) {
  const toReceta = companion.targetCategorySlug === 'anteojos-de-receta';
  const isSimilar = companion.matchType === 'similar';
  const label = isSimilar
    ? toReceta
      ? '¿Buscás algo parecido, para receta?'
      : '¿Buscás algo parecido, de sol?'
    : toReceta
      ? '¿Lo necesitás con tu graduación?'
      : '¿Lo querés también de sol?';
  const cta = isSimilar
    ? toReceta
      ? 'Ver un armazón similar'
      : 'Ver un modelo similar de sol'
    : toReceta
      ? 'Ver versión para anteojos de receta'
      : 'Ver versión con lentes solares';
  const Icon = toReceta ? Glasses : Sun;
  const imageUrl = companion.imagePath
    ? getProductImageUrl(companion.imagePath)
    : null;

  return (
    <Link
      href={companion.href}
      className="group/cm border-border/60 bg-muted/20 hover:bg-muted/40 focus-visible:ring-ring flex items-center gap-3 rounded-xl border p-3 transition-colors outline-none focus-visible:ring-2"
    >
      <span className="border-border/60 bg-background relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={isSimilar ? companion.name : ''}
            width={64}
            height={48}
            sizes="64px"
            className="h-full w-full object-contain"
            style={{ transform: `scale(${companion.imageScale})` }}
          />
        ) : (
          <Icon className="text-muted-foreground size-5" strokeWidth={1.75} aria-hidden />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-foreground block text-sm font-medium leading-tight">
          {label}
        </span>
        <span className="text-muted-foreground mt-0.5 block text-xs leading-snug">
          {cta}
        </span>
      </span>
      <ChevronRight
        className="text-muted-foreground size-4 shrink-0 transition-transform group-hover/cm:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}

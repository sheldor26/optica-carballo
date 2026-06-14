/**
 * Skeleton de la grilla de catálogo. Espeja la geometría real de
 * `CategoryCatalogView` (mismo grid + card `aspect-[3/2]`) para que la
 * transición al contenido real no genere salto de layout (CLS).
 *
 * Se renderiza desde los `loading.tsx` de las rutas de catálogo durante la
 * navegación (Suspense de App Router). CSS puro (`animate-pulse`).
 */
export function CatalogGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <main className="container py-8 md:py-12" aria-hidden="true">
      <div className="mb-8 max-w-3xl">
        <div className="bg-muted h-9 w-64 animate-pulse rounded-md" />
        <div className="bg-muted/70 mt-3 h-4 w-40 animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 md:gap-x-10 md:gap-y-20">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col">
            <div className="bg-muted aspect-[3/2] w-full animate-pulse rounded-md" />
            <div className="mt-5 flex flex-col items-center gap-2">
              <div className="bg-muted/70 h-3 w-16 animate-pulse rounded" />
              <div className="bg-muted h-5 w-32 animate-pulse rounded" />
              <div className="bg-muted/70 h-4 w-20 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

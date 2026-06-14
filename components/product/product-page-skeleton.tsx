/**
 * Skeleton de la página de producto (PDP). Espeja el layout 2-columnas real
 * (galería sticky + info) para no generar salto de layout al cargar. La PDP es
 * una ruta dinámica, así que este `loading.tsx` SÍ se ve seguido al navegar.
 * CSS puro (`animate-pulse`).
 */
export function ProductPageSkeleton() {
  return (
    <main className="container py-6 md:py-10" aria-hidden="true">
      {/* Breadcrumb */}
      <div className="bg-muted/70 mb-6 h-3 w-56 animate-pulse rounded" />

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {/* Galería */}
        <div className="flex flex-col gap-3">
          <div className="bg-muted aspect-[3/2] w-full animate-pulse rounded-lg" />
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted/80 aspect-square w-full animate-pulse rounded-md"
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="bg-muted/70 h-3 w-24 animate-pulse rounded" />
          <div className="bg-muted h-9 w-3/4 animate-pulse rounded-md" />
          <div className="bg-muted/70 h-4 w-full max-w-sm animate-pulse rounded" />

          {/* Bloque de precio */}
          <div className="border-border/60 mt-2 rounded-xl border p-5">
            <div className="bg-muted/70 h-3 w-16 animate-pulse rounded" />
            <div className="bg-muted mt-2 h-9 w-40 animate-pulse rounded-md" />
            <div className="bg-muted/70 mt-3 h-4 w-52 animate-pulse rounded" />
          </div>

          {/* CTA */}
          <div className="bg-muted h-12 w-full animate-pulse rounded-md" />

          {/* Variantes */}
          <div className="mt-2 flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted/60 h-14 w-full animate-pulse rounded-md"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

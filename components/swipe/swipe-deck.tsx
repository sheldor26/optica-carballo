'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import {
  ArrowRight,
  Check,
  Heart,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPriceCents } from '@/lib/format/currency';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import {
  addMatch,
  removeMatch,
  syncMatchesFromLocalStorage,
} from '@/lib/swipe/actions';
import {
  SWIPE_MATCHES_STORAGE_KEY,
  type StoredMatches,
  type SwipeDirection,
  type SwipeProduct,
} from '@/lib/swipe/types';
import { cn } from '@/lib/utils';

/** Distancia horizontal en pixels a partir de la cual consideramos "swipe". */
const SWIPE_THRESHOLD = 100;
/** Distancia horizontal animada al confirmar swipe (sale del viewport). */
const SWIPE_EXIT_DISTANCE = 600;

type Props = {
  initialProducts: SwipeProduct[];
  /** Pre-cargados desde DB (el componente siempre persiste a DB). */
  initialMatches?: string[];
};

export function SwipeDeck({
  initialProducts,
  initialMatches = [],
}: Props) {
  const [products] = useState(initialProducts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>(initialMatches);
  const [history, setHistory] = useState<
    Array<{ index: number; direction: SwipeDirection }>
  >([]);
  const [showResults, setShowResults] = useState(false);

  // Sync de localStorage anterior (usuario que era anónimo y se logueó).
  // Los initialMatches ya vienen desde DB; esto solo migra sesiones previas.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SWIPE_MATCHES_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredMatches;
      const localSlugs = Array.isArray(parsed.liked) ? parsed.liked : [];
      if (localSlugs.length > 0) {
        void syncMatchesFromLocalStorage({ slugs: localSlugs }).then(
          (result) => {
            if (result.ok && result.synced > 0) {
              setMatches((current) => {
                const set = new Set(current);
                localSlugs.forEach((s) => set.add(s));
                return Array.from(set);
              });
              try {
                localStorage.removeItem(SWIPE_MATCHES_STORAGE_KEY);
              } catch {
                // ignore
              }
              setShowResults(true);
            }
          },
        );
      }
    } catch {
      // localStorage corrupto, ignoramos.
    }
  }, []);

  const currentProduct = products[currentIndex];
  const nextProduct = products[currentIndex + 1];
  const isFinished = currentIndex >= products.length;

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (!currentProduct) return;
      setHistory((h) => [...h, { index: currentIndex, direction }]);
      if (direction === 'right') {
        setMatches((m) =>
          m.includes(currentProduct.slug) ? m : [...m, currentProduct.slug],
        );
        void addMatch(currentProduct.slug);
      }
      setCurrentIndex((i) => i + 1);
    },
    [currentIndex, currentProduct],
  );

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1]!;
    setHistory((h) => h.slice(0, -1));
    setCurrentIndex(last.index);
    if (last.direction === 'right') {
      const undoneProductSlug = products[last.index]?.slug;
      if (undoneProductSlug) {
        setMatches((m) => m.filter((s) => s !== undoneProductSlug));
        void removeMatch(undoneProductSlug);
      }
    }
  }, [history, products]);

  const handleViewResults = () => setShowResults(true);

  const handleReset = () => {
    const previous = matches;
    setMatches([]);
    setHistory([]);
    setCurrentIndex(0);
    setShowResults(false);
    previous.forEach((slug) => void removeMatch(slug));
  };

  // Si ya terminó o el usuario clickeó "Ver mis matches", mostrar resultados.
  if (showResults || isFinished) {
    return (
      <SwipeResults
        products={products}
        matchedSlugs={matches}
        onReset={handleReset}
        canResume={!isFinished}
        onResume={() => setShowResults(false)}
      />
    );
  }

  return (
    <main className="bg-zinc-950 relative isolate min-h-screen overflow-hidden text-white">
      {/* Mesh glow background, consistente con hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-zinc-950 via-black to-zinc-900"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="animate-mesh-a absolute -top-24 left-[18%] size-[420px] rounded-full bg-white/[0.03] blur-3xl" />
        <div className="animate-mesh-b absolute top-1/2 right-[12%] size-[520px] rounded-full bg-white/[0.04] blur-3xl" />
      </div>

      <div className="container relative flex min-h-screen flex-col py-8 md:py-12">
        {/* Header sticky compacto */}
        <header className="mb-6 flex items-center justify-between md:mb-8">
          <div>
            <p className="text-white/60 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] md:text-xs">
              <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
              Descubrir
            </p>
            <p className="text-white mt-1 font-serif text-xl font-medium tracking-tight md:text-2xl">
              Encontrá tu anteojo
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs">
              {Math.min(currentIndex + 1, products.length)} / {products.length}
            </p>
            <button
              type="button"
              onClick={handleViewResults}
              className="text-brand mt-1 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide hover:text-white transition-colors"
            >
              <Heart className="size-3 fill-current" />
              {matches.length} matches
            </button>
          </div>
        </header>

        {/* Card stack */}
        <div className="relative mx-auto flex w-full max-w-md flex-1 items-center justify-center">
          <div className="relative aspect-[3/4] w-full">
            {/* Card "next" detrás — solo cuando hay next y aún no swipeamos esta */}
            {nextProduct && (
              <div
                aria-hidden="true"
                className="absolute inset-0 scale-[0.95] opacity-50"
                style={{ zIndex: 0 }}
              >
                <SwipeCardStatic product={nextProduct} />
              </div>
            )}

            {/* Card activa — la única arrastrable */}
            <AnimatePresence mode="popLayout">
              {currentProduct && (
                <SwipeCard
                  key={currentProduct.slug}
                  product={currentProduct}
                  onSwipe={handleSwipe}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Botones de acción explícitos */}
        <div className="mt-6 flex items-center justify-center gap-4 md:mt-8 md:gap-6">
          <button
            type="button"
            onClick={() => handleSwipe('left')}
            disabled={!currentProduct}
            aria-label="No me gusta"
            className="bg-white/10 text-white/80 hover:bg-white/20 disabled:opacity-30 flex size-16 items-center justify-center rounded-full transition-colors backdrop-blur"
          >
            <X className="size-7" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            aria-label="Deshacer"
            className="bg-white/10 text-white/80 hover:bg-white/20 disabled:opacity-30 flex size-12 items-center justify-center rounded-full transition-colors backdrop-blur"
          >
            <RotateCcw className="size-5" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={() => handleSwipe('right')}
            disabled={!currentProduct}
            aria-label="Me gusta"
            className="bg-brand text-zinc-950 hover:bg-brand/90 disabled:opacity-30 flex size-16 items-center justify-center rounded-full transition-colors shadow-lg"
          >
            <Heart className="size-7 fill-current" strokeWidth={1.75} />
          </button>
        </div>

        <p className="text-white/40 mt-4 text-center text-[11px] md:text-xs">
          Deslizá a derecha si te gusta, a izquierda si no. O usá los botones.
        </p>
      </div>
    </main>
  );
}

/** Card draggable — animaciones de rotate + opacity según drag X. */
function SwipeCard({
  product,
  onSwipe,
}: {
  product: SwipeProduct;
  onSwipe: (dir: SwipeDirection) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_e: PointerEvent, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe('right');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: 10 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        x: x.get() > 0 ? SWIPE_EXIT_DISTANCE : -SWIPE_EXIT_DISTANCE,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
    >
      <CardContent product={product} />

      {/* Overlays de feedback durante el drag */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="bg-brand/30 border-brand pointer-events-none absolute left-6 top-6 rounded-lg border-2 px-4 py-2 backdrop-blur-sm md:left-8 md:top-8"
      >
        <span className="text-brand text-2xl font-bold uppercase tracking-wide md:text-3xl">
          Me gusta
        </span>
      </motion.div>
      <motion.div
        style={{ opacity: dislikeOpacity }}
        className="bg-red-500/20 border-red-500/80 pointer-events-none absolute right-6 top-6 rounded-lg border-2 px-4 py-2 backdrop-blur-sm md:right-8 md:top-8"
      >
        <span className="text-red-100 text-2xl font-bold uppercase tracking-wide md:text-3xl">
          Skip
        </span>
      </motion.div>
    </motion.div>
  );
}

/** Versión sin drag — usado para mostrar la card "next" en el stack. */
function SwipeCardStatic({ product }: { product: SwipeProduct }) {
  return (
    <div className="absolute inset-0">
      <CardContent product={product} />
    </div>
  );
}

/** Contenido visual de la card — usado por ambas (drag + static). */
function CardContent({ product }: { product: SwipeProduct }) {
  return (
    <div className="border-white/10 bg-zinc-900 relative h-full w-full overflow-hidden rounded-2xl border shadow-2xl">
      {/* Foto del producto sobre bg blanco (consistente con grid catalog) */}
      <div className="bg-background relative aspect-[3/2] w-full overflow-hidden">
        {product.primaryImagePath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getProductImageUrl(product.primaryImagePath)}
            alt={product.name}
            className="absolute inset-0 size-full object-contain"
            style={{ transform: `scale(${product.primaryImageScale})` }}
            draggable={false}
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
            Foto pendiente
          </div>
        )}
      </div>

      {/* Info abajo */}
      <div className="flex flex-col gap-3 p-5 md:p-6">
        <div>
          <p className="text-white/60 text-[10px] font-medium uppercase tracking-[0.18em]">
            {product.brandName}
          </p>
          <h2 className="text-white mt-2 font-serif text-2xl font-medium leading-tight tracking-tight md:text-3xl">
            {product.name}
          </h2>
        </div>
        {product.shortDescription && (
          <p className="text-white/70 line-clamp-2 text-sm leading-relaxed">
            {product.shortDescription}
          </p>
        )}
        {product.minPriceCents !== null && (
          <p className="text-white text-base font-medium tabular-nums">
            {formatPriceCents(product.minPriceCents)}
          </p>
        )}
      </div>
    </div>
  );
}

/** Vista de resultados — los productos a los que el usuario dio 👍. */
function SwipeResults({
  products,
  matchedSlugs,
  onReset,
  canResume,
  onResume,
}: {
  products: SwipeProduct[];
  matchedSlugs: string[];
  onReset: () => void;
  canResume: boolean;
  onResume: () => void;
}) {
  const matched = matchedSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is SwipeProduct => Boolean(p));

  return (
    <main className="container py-12 md:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
          {matched.length > 0 ? 'Tus favoritos' : 'Sin matches'}
        </p>
        <h1 className="text-foreground mt-6 text-balance font-serif text-5xl font-medium leading-[1.0] tracking-[-0.025em] md:text-6xl lg:text-7xl">
          {matched.length === 0 ? (
            <>
              Aún{' '}
              <span className="font-normal italic text-foreground/70">
                no elegiste
              </span>{' '}
              ninguno.
            </>
          ) : matched.length === 1 ? (
            <>
              Tu{' '}
              <span className="font-normal italic text-foreground/70">
                primer match
              </span>
              .
            </>
          ) : (
            <>
              {matched.length}{' '}
              <span className="font-normal italic text-foreground/70">
                matches
              </span>{' '}
              hasta ahora.
            </>
          )}
        </h1>
        <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-balance text-base md:text-lg">
          {matched.length === 0
            ? 'Volvé a deslizar para encontrar tus favoritos.'
            : 'Estos son los modelos que te gustaron. Hacé click en uno para ver detalles o seguí explorando.'}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {canResume && (
            <Button
              size="lg"
              onClick={onResume}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              <Sparkles className="mr-2 size-4" />
              Seguir descubriendo
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={onReset}>
            <RotateCcw className="mr-2 size-4" />
            Empezar de nuevo
          </Button>
        </div>
      </header>

      {matched.length > 0 && (
        <div className="mx-auto mt-12 max-w-2xl text-center">
          <Link
            href="/mi-cuenta/matches"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            <Check className="text-brand size-4" strokeWidth={2.5} />
            Tus matches están guardados en Mi cuenta
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}

      {matched.length > 0 && (
        <section
          aria-label="Tus matches"
          className="mt-12 grid grid-cols-2 gap-6 md:mt-16 md:grid-cols-3 md:gap-x-8 md:gap-y-12 lg:gap-x-10"
        >
          {matched.map((product) => (
            <Link
              key={product.slug}
              href={product.href}
              className="group/match flex flex-col"
            >
              <div className="bg-background relative aspect-[3/2] w-full overflow-hidden rounded-lg transition-shadow duration-500 group-hover/match:shadow-lg">
                {product.primaryImagePath && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getProductImageUrl(product.primaryImagePath)}
                    alt={product.name}
                    className="absolute inset-0 size-full object-contain transition-transform duration-700 group-hover/match:scale-[1.04]"
                    style={{ transform: `scale(${product.primaryImageScale})` }}
                  />
                )}
                {/* Heart badge */}
                <div className="bg-brand absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-zinc-950 shadow-sm">
                  <Check className="size-4" strokeWidth={2.5} />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-1.5">
                <p className="text-foreground/60 text-[10px] font-medium uppercase tracking-[0.18em]">
                  {product.brandName}
                </p>
                <h3 className="text-foreground font-serif text-lg font-medium leading-tight tracking-tight md:text-xl">
                  {product.name}
                </h3>
                {product.minPriceCents !== null && (
                  <p className="text-muted-foreground text-sm tabular-nums">
                    {formatPriceCents(product.minPriceCents)}
                  </p>
                )}
                <span
                  className={cn(
                    'text-foreground/80 group-hover/match:text-foreground mt-2 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.18em] transition-colors',
                  )}
                >
                  Ver detalles
                  <ArrowRight className="size-3 transition-transform duration-300 group-hover/match:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}

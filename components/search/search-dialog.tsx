'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Search, X, ArrowRight, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { formatPriceCents } from '@/lib/format/currency';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { getImageScale } from '@/lib/catalog/image-scale-overrides';
import { searchAction } from '@/lib/catalog/search';
import type { SearchResults } from '@/lib/catalog/search';
import { track, Events } from '@/lib/analytics/track';

const DEBOUNCE_MS = 200;
const MIN_QUERY_LENGTH = 2;

const RECENT_KEY = 'oc_recent_searches';
const RECENT_MAX = 5;

function readRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((v): v is string => typeof v === 'string' && v.length > 0)
      .slice(0, RECENT_MAX);
  } catch {
    return [];
  }
}

function pushRecent(query: string): string[] {
  if (typeof window === 'undefined') return [];
  const trimmed = query.trim();
  if (trimmed.length === 0) return readRecent();
  try {
    const current = readRecent();
    const without = current.filter(
      (q) => q.toLowerCase() !== trimmed.toLowerCase(),
    );
    const next = [trimmed, ...without].slice(0, RECENT_MAX);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    return next;
  } catch {
    return readRecent();
  }
}

function clearRecent(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(RECENT_KEY);
  } catch {
    // ignore
  }
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Dialog global de search. Triggered desde el header o ⌘K / Ctrl+K.
 *
 * - Debounce 200ms entre keystroke y server action.
 * - Min query length 2 chars (evita queries con 1 letra que matchean todo).
 * - Resultados agrupados: Marcas primero (más rápido de identificar),
 *   Productos después con thumbnail + precio.
 * - Empty state cuando query > 0 chars y 0 results → CTA WhatsApp.
 */
export function SearchDialog({ open, onOpenChange }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    products: [],
    brands: [],
  });
  const [recent, setRecent] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const runSearch = useCallback((q: string) => {
    startTransition(async () => {
      const data = await searchAction(q);
      setResults(data);
      const hasResults =
        data.products.length > 0 || data.brands.length > 0;
      // Si la search devolvió resultados, persistir como "recent".
      if (hasResults) {
        const next = pushRecent(q);
        setRecent(next);
      }
      track(Events.SEARCH, {
        query: q,
        results_count: data.products.length + data.brands.length,
        has_results: hasResults,
      });
    });
  }, []);

  // Debounce query → search
  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults({ products: [], brands: [] });
      return;
    }
    const t = window.setTimeout(() => runSearch(trimmed), DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [query, open, runSearch]);

  // Al abrir: cargar recent + auto-focus. Al cerrar: clear input/results.
  useEffect(() => {
    if (open) {
      setRecent(readRecent());
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
    setQuery('');
    setResults({ products: [], brands: [] });
  }, [open]);

  const hasResults =
    results.products.length > 0 || results.brands.length > 0;
  const queryTooShort = query.trim().length < MIN_QUERY_LENGTH;
  const showEmpty = !queryTooShort && !hasResults && !isPending;
  const showRecent = queryTooShort && recent.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0">
        <DialogTitle className="sr-only">Buscar productos y marcas</DialogTitle>

        {/* Input */}
        <div className="border-border/60 relative flex items-center border-b px-4 sm:px-5">
          <Search
            className="text-muted-foreground size-5 shrink-0"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar anteojos, marcas, modelos…"
            className="placeholder:text-muted-foreground/70 h-14 flex-1 bg-transparent px-3 text-base outline-none sm:text-lg"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
              className="text-muted-foreground hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-full transition-colors"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          )}
          <kbd className="border-border/60 bg-muted/40 text-muted-foreground hidden rounded border px-1.5 py-0.5 text-[10px] font-medium sm:inline-flex">
            ESC
          </kbd>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto">
          {showRecent ? (
            <Recent
              items={recent}
              onPick={(q) => setQuery(q)}
              onClear={() => {
                clearRecent();
                setRecent([]);
              }}
            />
          ) : queryTooShort ? (
            <Hint />
          ) : showEmpty ? (
            <EmptyResults query={query} onClose={() => onOpenChange(false)} />
          ) : (
            <Results
              results={results}
              onClose={() => onOpenChange(false)}
              loading={isPending}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Recent({
  items,
  onPick,
  onClear,
}: {
  items: string[];
  onPick: (q: string) => void;
  onClear: () => void;
}) {
  return (
    <section className="py-2">
      <div className="flex items-center justify-between px-4 pb-1 pt-2 sm:px-5">
        <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.15em]">
          Búsquedas recientes
        </p>
        <button
          type="button"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
        >
          Limpiar
        </button>
      </div>
      <ul>
        {items.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => onPick(q)}
              className="hover:bg-muted/40 flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors sm:px-5"
            >
              <Clock
                className="text-muted-foreground size-4 shrink-0"
                strokeWidth={1.75}
                aria-hidden
              />
              <span className="text-foreground flex-1 text-sm">{q}</span>
              <ArrowRight
                className="text-muted-foreground size-4"
                strokeWidth={2}
                aria-hidden
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Hint() {
  return (
    <div className="p-8 text-center">
      <p className="text-muted-foreground text-sm">
        Tipeá al menos 2 letras para buscar.
      </p>
      <p className="text-muted-foreground/70 mt-4 text-xs">
        Probá con una marca (<span className="font-medium">Vulk</span>,{' '}
        <span className="font-medium">Rusty</span>) o forma (
        <span className="font-medium">aviador</span>,{' '}
        <span className="font-medium">wayfarer</span>).
      </p>
    </div>
  );
}

function EmptyResults({
  query,
  onClose,
}: {
  query: string;
  onClose: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <p className="text-foreground text-base font-semibold">
        Sin resultados para &ldquo;{query}&rdquo;
      </p>
      <p className="text-muted-foreground mt-2 text-sm">
        Probá con menos palabras o explorá las marcas que tenemos.
      </p>
      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        <Link
          href="/anteojos-de-sol"
          onClick={onClose}
          className="bg-foreground text-background hover:bg-foreground/85 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors"
        >
          Ver todos los anteojos
        </Link>
      </div>
    </div>
  );
}

function Results({
  results,
  onClose,
  loading,
}: {
  results: SearchResults;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <div className="divide-border/60 divide-y">
      {results.brands.length > 0 && (
        <SectionGroup title="Marcas" loading={loading}>
          {results.brands.map((b) => (
            <Link
              key={b.slug}
              href={b.href}
              onClick={onClose}
              className="hover:bg-muted/40 flex items-center gap-3 px-4 py-3 transition-colors sm:px-5"
            >
              <span
                aria-hidden
                className="border-border/60 bg-muted/40 flex size-9 items-center justify-center rounded-full border"
              >
                <Tag
                  className="text-foreground/70 size-4"
                  strokeWidth={1.75}
                />
              </span>
              <span className="text-foreground flex-1 text-sm font-medium">
                {b.name}
              </span>
              <ArrowRight
                className="text-muted-foreground size-4"
                strokeWidth={2}
                aria-hidden
              />
            </Link>
          ))}
        </SectionGroup>
      )}

      {results.products.length > 0 && (
        <SectionGroup
          title="Productos"
          loading={loading && results.brands.length === 0}
        >
          {results.products.map((p) => (
            <ProductRow key={p.slug} product={p} onClose={onClose} />
          ))}
        </SectionGroup>
      )}
    </div>
  );
}

function SectionGroup({
  title,
  loading,
  children,
}: {
  title: string;
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="py-2">
      <p
        className={cn(
          'text-muted-foreground px-4 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.15em] sm:px-5',
          loading && 'animate-pulse',
        )}
      >
        {title}
      </p>
      <div>{children}</div>
    </section>
  );
}

function ProductRow({
  product,
  onClose,
}: {
  product: SearchResults['products'][0];
  onClose: () => void;
}) {
  return (
    <Link
      href={product.href}
      onClick={onClose}
      className="hover:bg-muted/40 flex items-center gap-3 px-4 py-3 transition-colors sm:px-5"
    >
      <div className="border-border/60 bg-muted/30 flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border">
        {product.primaryImagePath ? (
          <Image
            src={getProductImageUrl(product.primaryImagePath)}
            alt=""
            width={48}
            height={48}
            style={{ transform: `scale(${getImageScale(product.primaryImagePath)})` }}
            className="size-full object-contain p-1"
          />
        ) : (
          <span className="text-muted-foreground/50 text-[9px]">sin foto</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-medium">
          {product.name}
        </p>
        <p className="text-muted-foreground text-xs">{product.brandName}</p>
      </div>
      <div className="text-right">
        {product.minPriceCents !== null ? (
          <p className="text-foreground text-sm font-semibold tabular-nums">
            {formatPriceCents(product.minPriceCents)}
          </p>
        ) : (
          <p className="text-muted-foreground text-xs">Sin stock</p>
        )}
      </div>
    </Link>
  );
}

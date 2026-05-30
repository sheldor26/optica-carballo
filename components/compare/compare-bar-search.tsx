'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { Search, Plus } from 'lucide-react';
import { searchAction, type SearchProductResult } from '@/lib/catalog/search';
import { toggleCompareAction } from '@/lib/compare/actions';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { getImageScale } from '@/lib/catalog/image-scale-overrides';

type Props = {
  /** Slugs ya presentes en el comparador — para excluirlos del dropdown. */
  existingSlugs: string[];
  /** Callback cuando se agrega un producto exitosamente. Sirve para que el
   * componente padre haga refetch del estado optimistic. */
  onAdded: (slug: string) => void;
};

/**
 * Input de búsqueda inline en el CompareBar — permite agregar productos
 * al comparador sin navegar al catálogo.
 *
 * Flow:
 * 1. Usuario tipea → debounce 300ms → searchAction(query)
 * 2. Dropdown muestra top 5 productos (excluyendo los ya en compare)
 * 3. Click "+" → toggleCompareAction(entry) → onAdded(slug)
 *
 * Click fuera cierra el dropdown. Si compare está lleno (4), el toggle
 * devuelve full=true → alert al usuario.
 */
export function CompareBarSearch({ existingSlugs, onAdded }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProductResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search.
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const t = window.setTimeout(async () => {
      try {
        const data = await searchAction(query);
        setResults(data.products.slice(0, 5));
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => window.clearTimeout(t);
  }, [query]);

  // Click outside cierra el dropdown.
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isOpen]);

  const onAdd = (result: SearchProductResult) => {
    startTransition(async () => {
      const res = await toggleCompareAction({
        slug: result.slug,
        category: result.categorySlug,
        brand: result.brandSlug,
      });
      if (res.added) {
        onAdded(result.slug);
        setQuery('');
        setIsOpen(false);
      } else if (res.full) {
        window.alert(
          'Ya tenés 4 productos para comparar. Sacá uno antes de agregar otro.',
        );
      }
    });
  };

  const filteredResults = results.filter((r) => !existingSlugs.includes(r.slug));

  return (
    <div ref={containerRef} className="relative shrink-0">
      <div className="relative">
        <Search className="text-muted-foreground absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar producto..."
          aria-label="Buscar producto para agregar al comparador"
          className="border-border/60 bg-background/60 placeholder:text-muted-foreground/70 focus:ring-foreground/30 w-36 rounded-full border py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 sm:w-44"
        />
      </div>
      {isOpen && (query.trim() || isLoading) && (
        <div className="border-border/60 bg-background absolute right-0 bottom-full mb-2 w-72 overflow-hidden rounded-lg border shadow-xl sm:left-0 sm:right-auto">
          {isLoading ? (
            <p className="text-muted-foreground p-3 text-center text-xs">
              Buscando…
            </p>
          ) : filteredResults.length === 0 ? (
            <p className="text-muted-foreground p-3 text-center text-xs">
              {results.length > 0 && filteredResults.length === 0
                ? 'Todos los resultados ya están en el comparador'
                : 'Sin resultados'}
            </p>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {filteredResults.map((r) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    onClick={() => onAdd(r)}
                    className="hover:bg-muted/60 group flex w-full items-center gap-2.5 px-2.5 py-2 text-left transition-colors"
                  >
                    <div className="bg-muted/30 border-border/40 size-10 shrink-0 overflow-hidden rounded border">
                      {r.primaryImagePath ? (
                        <Image
                          src={getProductImageUrl(r.primaryImagePath)}
                          alt=""
                          width={40}
                          height={40}
                          style={{ transform: `scale(${getImageScale(r.primaryImagePath)})` }}
                          className="size-full object-contain p-1"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate text-xs font-medium">
                        {r.name}
                      </p>
                      <p className="text-muted-foreground truncate text-[10px] uppercase tracking-wide">
                        {r.brandName}
                      </p>
                    </div>
                    <span className="border-border/40 group-hover:bg-foreground group-hover:text-background flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors">
                      <Plus className="size-3" strokeWidth={2.5} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

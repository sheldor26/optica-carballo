'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { FaqAccordion } from '@/components/faqs/faq-accordion';
import { cn } from '@/lib/utils';
import {
  FAQ_CATEGORY_META,
  type FaqCategory,
  type FaqItem,
} from '@/lib/content/faqs';

type Props = {
  allItems: FaqItem[];
};

const ALL_CATEGORIES_LABEL = 'Todas';

/**
 * Búsqueda client-side + chips de filtro por categoría para la página
 * `/preguntas-frecuentes`. Filtra in-memory sobre `allItems` por:
 * - Texto en pregunta o respuesta (case-insensitive).
 * - Categoría activa (chip).
 *
 * Si la búsqueda no matchea nada → empty state con sugerencia de
 * limpiar filtros.
 */
export function FaqSearch({ allItems }: Props) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FaqCategory | null>(null);

  const categories = useMemo(() => {
    return (Object.keys(FAQ_CATEGORY_META) as FaqCategory[]).filter((cat) =>
      allItems.some((i) => i.category === cat),
    );
  }, [allItems]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allItems.filter((item) => {
      if (activeCategory && item.category !== activeCategory) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    });
  }, [allItems, query, activeCategory]);

  const grouped = useMemo(() => {
    return categories
      .map((cat) => ({
        category: cat,
        meta: FAQ_CATEGORY_META[cat],
        items: filtered.filter((f) => f.category === cat),
      }))
      .filter((group) => group.items.length > 0);
  }, [filtered, categories]);

  const showingAll = !query && !activeCategory;
  const noResults = filtered.length === 0;

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        {/* Search input */}
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en las preguntas…"
            className="border-border/60 bg-background placeholder:text-muted-foreground/70 focus-visible:border-foreground/40 focus-visible:ring-foreground/10 h-12 w-full rounded-full border pl-12 pr-12 text-base outline-none transition-colors focus-visible:ring-4"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
              className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full transition-colors"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <CategoryChip
            label={ALL_CATEGORIES_LABEL}
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              label={FAQ_CATEGORY_META[cat].label}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl md:mt-14">
        {noResults ? (
          <EmptyResults
            onClear={() => {
              setQuery('');
              setActiveCategory(null);
            }}
          />
        ) : (
          <div className={cn(showingAll ? 'space-y-12' : 'space-y-10')}>
            {grouped.map((group) => (
              <section
                key={group.category}
                aria-labelledby={`category-${group.category}`}
              >
                <header className="mb-4">
                  <h2
                    id={`category-${group.category}`}
                    className="text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl"
                  >
                    {group.meta.label}
                  </h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {group.meta.description}
                  </p>
                </header>
                <FaqAccordion items={group.items} />
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border/60 bg-background text-foreground hover:bg-muted/40',
      )}
      aria-pressed={active}
    >
      {label}
    </motion.button>
  );
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="border-border/60 bg-muted/20 mx-auto max-w-md rounded-xl border p-8 text-center">
      <p className="text-foreground text-base font-semibold">
        No encontramos preguntas que coincidan
      </p>
      <p className="text-muted-foreground mt-2 text-sm">
        Probá con otra palabra o limpiá los filtros para ver todas.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="text-foreground mt-4 text-sm font-medium underline-offset-2 hover:underline"
      >
        Limpiar filtros
      </button>
    </div>
  );
}

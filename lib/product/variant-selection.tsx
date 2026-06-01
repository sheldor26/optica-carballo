'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';

type Ctx = {
  selectedVariantId: string | null;
  selectVariant: (id: string) => void;
};

const VariantSelectionContext = createContext<Ctx>({
  selectedVariantId: null,
  selectVariant: () => {},
});

export function VariantSelectionProvider({
  children,
  defaultVariantId,
}: {
  children: React.ReactNode;
  defaultVariantId: string | null;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    defaultVariantId,
  );
  const selectVariant = useCallback((id: string) => {
    setSelectedVariantId(id);
  }, []);
  const value = useMemo(
    () => ({ selectedVariantId, selectVariant }),
    [selectedVariantId, selectVariant],
  );
  return (
    <VariantSelectionContext.Provider value={value}>
      {children}
    </VariantSelectionContext.Provider>
  );
}

export function useVariantSelection(): Ctx {
  return useContext(VariantSelectionContext);
}

/**
 * Sincroniza la selección de variante con el query param `?v=<sku>` cuando
 * el usuario llega desde el grid del catálogo habiendo clickeado una variante
 * específica (founder 2026-05-31). Client-side para no romper el ISR de la
 * PDP — debe ir envuelto en <Suspense> (requisito de useSearchParams en
 * páginas estáticas). No renderiza nada.
 *
 * `skuToId`: mapa de SKU → variant id, provisto por el server component de
 * la PDP. Si el `?v=` matchea un SKU, se selecciona esa variante al montar.
 */
export function VariantUrlSync({
  skuToId,
}: {
  skuToId: Record<string, string>;
}) {
  const searchParams = useSearchParams();
  const { selectVariant } = useVariantSelection();

  useEffect(() => {
    const sku = searchParams.get('v');
    if (!sku) return;
    const id = skuToId[sku];
    if (id) selectVariant(id);
  }, [searchParams, skuToId, selectVariant]);

  return null;
}

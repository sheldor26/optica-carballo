'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  // Guard: aplicar el deep-link `?v=` SOLO UNA VEZ (al montar). Sin esto, el
  // useEffect re-corría en cada re-render y pisaba la selección manual del
  // usuario → al cambiar de variante, "rebotaba" a la del URL. Bug reportado
  // founder 2026-05-31. Una vez aplicado el deep-link inicial, el usuario
  // tiene control total.
  const appliedRef = useRef(false);

  useEffect(() => {
    if (appliedRef.current) return;
    const sku = searchParams.get('v');
    if (!sku) {
      // Sin ?v=: marcamos como "aplicado" igual, para no interferir nunca
      // con la selección del usuario.
      appliedRef.current = true;
      return;
    }
    const id = skuToId[sku];
    if (id) selectVariant(id);
    appliedRef.current = true;
  }, [searchParams, skuToId, selectVariant]);

  return null;
}

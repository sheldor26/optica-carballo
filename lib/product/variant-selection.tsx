'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

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

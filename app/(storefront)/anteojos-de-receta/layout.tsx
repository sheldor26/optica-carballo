import { PrescriptionBanner } from '@/components/prescription/prescription-banner';

/**
 * Layout de la sección `/anteojos-de-receta/...` que monta el banner de
 * receta cargada arriba de todas las páginas hijas (categoría, marca,
 * filtros, PDPs). El banner es client component y se renderiza vacío
 * (return null) si no hay cookie de receta → no afecta páginas sin sesión.
 */
export default function PrescriptionCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PrescriptionBanner />
      {children}
    </>
  );
}

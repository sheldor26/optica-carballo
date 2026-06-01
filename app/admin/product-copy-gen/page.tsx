import type { Metadata } from 'next';
import { ProductCopyForm } from '@/components/admin/product-copy-form';
import { requireAdmin } from '@/lib/auth/admin';

export const metadata: Metadata = {
  title: 'Generador de copy de producto — Admin',
  description: 'Herramienta interna para generar fichas de producto con IA.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Página admin (sin storefront layout) para generar copy de producto con
 * IA al cargar productos nuevos. Acelera el armado de las 5 marcas
 * pendientes (Mormaii, Reef, Paula Cahen D'Anvers, etc.).
 *
 * Gateado por `requireAdmin()` (allowlist ADMIN_EMAILS) + rate limit por IP en
 * el endpoint + robots:noindex. Antes era público (solo noindex) — cerrado en
 * Iter 2 del tracker de pedidos.
 */
export default async function Page() {
  await requireAdmin();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <header>
        <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
          Herramienta interna
        </p>
        <h1 className="text-foreground mt-2 font-serif text-3xl font-medium tracking-tight md:text-4xl">
          Generador de copy de producto
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm">
          Pasale el nombre, marca, categoría y atributos del producto y la IA
          te genera shortDescription, description, metaTitle, metaDescription
          y 3 callouts. Editá lo que haga falta antes de pegar al seed SQL.
        </p>
      </header>

      <div className="mt-10">
        <ProductCopyForm />
      </div>
    </main>
  );
}

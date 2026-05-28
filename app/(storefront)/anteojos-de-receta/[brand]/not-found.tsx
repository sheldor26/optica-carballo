import Link from 'next/link';

export default function BrandNotFound() {
  return (
    <main className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight">
        Esa marca todavía no está
      </h1>
      <p className="text-muted-foreground max-w-md">
        Estamos sumando catálogo de a poco. Si buscás una marca específica que no
        aparece, escribinos y la consultamos.
      </p>
      <div className="flex gap-3">
        <Link
          href="/anteojos-de-receta"
          className="text-sm font-medium underline underline-offset-4"
        >
          Ver todos los anteojos de receta
        </Link>
        <Link
          href="/"
          className="text-sm font-medium underline underline-offset-4"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <main className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight">
        Producto no encontrado
      </h1>
      <p className="text-muted-foreground max-w-md">
        No encontramos este producto. Quizás cambió de URL o ya no está
        disponible. Mirá el catálogo completo.
      </p>
      <div className="flex flex-wrap gap-3">
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

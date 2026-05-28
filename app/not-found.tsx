import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Página no encontrada
      </h1>
      <p className="text-muted-foreground">
        No pudimos encontrar lo que buscás.
      </p>
      <Link
        href="/"
        className="text-sm font-medium underline underline-offset-4"
      >
        Volver al inicio
      </Link>
    </main>
  );
}

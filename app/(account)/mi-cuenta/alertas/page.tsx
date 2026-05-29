import type { Metadata } from 'next';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertCard } from '@/components/alerts/alert-card';
import { requireAuth } from '@/lib/auth/server';
import { fetchMyAlerts } from '@/lib/alerts/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Mis alertas | Óptica Carballo' },
  robots: { index: false, follow: false },
};

export default async function Page() {
  await requireAuth('/mi-cuenta/alertas');
  const alerts = await fetchMyAlerts();

  return (
    <main className="container max-w-3xl py-8 md:py-12">
      <header className="mb-8">
        <p className="text-muted-foreground text-sm">
          <Link
            href="/mi-cuenta"
            className="hover:text-foreground underline-offset-2 hover:underline"
          >
            ← Volver a mi cuenta
          </Link>
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Mis alertas
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Te avisamos por email cuando baje el precio o vuelva el stock de los
          productos que te interesan.
        </p>
      </header>

      {alerts.length === 0 ? (
        <div className="border-border rounded-xl border border-dashed p-8 text-center">
          <Bell className="text-muted-foreground mx-auto size-8" />
          <h2 className="text-foreground mt-3 text-base font-medium">
            Todavía no tenés alertas creadas
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Cuando entres a un producto, vas a ver el botón &quot;Crear alerta&quot; para
            avisarte de bajadas de precio o vuelta de stock.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/anteojos-de-sol">Ver catálogo</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert) => (
            <li key={alert.id}>
              <AlertCard alert={alert} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

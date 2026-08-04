import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { CheckoutPage } from '@/components/checkout/checkout-page';
import { requireAuth } from '@/lib/auth/server';
import { readCartCookie } from '@/lib/cart/cookie';
import { resolveCart } from '@/lib/cart/queries';
import { fetchUserAddresses } from '@/lib/addresses/queries';
import { fetchLastUsedDni } from '@/lib/orders/queries';
import { resolveShippingQuotes } from '@/lib/shipping-server';
import { calculateShipping } from '@/lib/shipping';
import { listBranches } from '@/lib/correo/agencies';
import { isCheckoutEnabled } from '@/lib/features';
import { getBusinessInfo } from '@/lib/site/business';
import { getPrescriptionFromCookie } from '@/lib/prescription-cookie/actions';
import { cartRequiresPrescription } from '@/lib/checkout/prescription';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Finalizar compra | Óptica Carballo' },
  robots: { index: false, follow: false },
};

export default async function Page() {
  // Feature flag — si está OFF, /checkout no existe.
  if (!isCheckoutEnabled()) notFound();

  const user = await requireAuth('/checkout');

  const cart = await readCartCookie();
  const resolved = await resolveCart(cart, { userId: user.id });

  // Cart vacío o con issues → volver al carrito.
  if (resolved.items.length === 0 || resolved.hasIssues) {
    redirect('/carrito');
  }

  // Receta: si el carrito tiene algún producto de la categoría receta, el
  // checkout no puede confirmar el pedido sin una receta cargada (regla
  // dura del negocio — hallazgo #6, audit 2026-08-01). La cookie es la
  // misma que llena el lector IA / form manual (`/cargar-receta`,
  // `/lector-de-receta`) antes de llegar acá.
  const prescription = cartRequiresPrescription(resolved)
    ? await getPrescriptionFromCookie()
    : null;

  const addresses = await fetchUserAddresses();
  const lastUsedDni = await fetchLastUsedDni();

  // Provincia tentativa para la cotización: la default del user, o la
  // primera. Si no hay addresses, usamos una zona conservadora (peor caso)
  // para mostrar algo en el resumen mientras el user crea la primera.
  const defaultAddress =
    addresses.find((a) => a.is_default) ?? addresses[0] ?? null;
  const itemCount = resolved.items.reduce((n, it) => n + it.quantity, 0);

  // Pre-cotizamos domicilio + sucursal + listamos sucursales para cada
  // dirección del user (cap 6). El client lee del map según la dirección
  // elegida, sin re-fetch. Caso típico (1 dirección) = 1 cotización.
  const shippingEntries = await Promise.all(
    addresses.slice(0, 6).map(async (a) => {
      const [quotes, branches] = await Promise.all([
        resolveShippingQuotes({
          subtotalCents: resolved.subtotalCents,
          provinceName: a.province,
          postalCode: a.postal_code,
          itemCount,
        }),
        listBranches(a.province),
      ]);
      return [
        a.id,
        { delivery: quotes.delivery, branch: quotes.branch, branches },
      ] as const;
    }),
  );
  const shippingByAddress = Object.fromEntries(shippingEntries);

  // Fallback para mostrar algo en el resumen cuando el user no tiene
  // direcciones todavía (zona conservadora).
  const fallbackShipping = calculateShipping({
    subtotalCents: resolved.subtotalCents,
    provinceName: 'Buenos Aires',
  });

  // Armar dirección legible del local para mostrar como destino de retiro.
  // Si business info no está completa, devolvemos null y el componente
  // muestra "coordinamos por WhatsApp" como fallback honesto.
  const business = getBusinessInfo();
  const pickupAddress =
    business.street && business.locality
      ? [business.street, business.locality, business.region]
          .filter((v): v is string => Boolean(v))
          .join(', ')
      : null;

  return (
    <CheckoutPage
      cart={resolved}
      addresses={addresses}
      shippingByAddress={shippingByAddress}
      defaultAddressId={defaultAddress?.id ?? null}
      fallbackShipping={fallbackShipping}
      pickupAddress={pickupAddress}
      prescription={prescription}
      initialDni={lastUsedDni}
    />
  );
}

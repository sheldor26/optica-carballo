import { CATEGORIES } from '@/lib/catalog/categories';
import type { ResolvedCart } from '@/lib/cart/types';
import type { PrescriptionCookie } from '@/lib/prescription-cookie/types';

/**
 * `true` si el carrito tiene al menos un producto de la categoría receta —
 * el checkout no puede confirmar el pedido sin una receta cargada para
 * estos casos (regla dura del negocio: no vender recetados sin receta
 * válida; hallazgo #6, audit 2026-08-01, decisión founder: obligatoria
 * ANTES de pagar).
 *
 * Sin `'server-only'` a propósito — funciones puras sobre datos planos, se
 * reusan tanto en server (checkout page/actions) como en el componente
 * cliente `CheckoutPage` para no duplicar el criterio de qué categoría
 * requiere receta.
 */
export function cartRequiresPrescription(cart: ResolvedCart): boolean {
  return cart.items.some(
    (item) => item.categorySlug === CATEGORIES.rx.slug,
  );
}

/** Payload listo para el parámetro `p_prescription` de la RPC
 * `create_order_from_cart` (que hace el INSERT en `public.prescriptions`
 * server-side, con `p_user_id` aparte). Solo los campos que la cookie
 * efectivamente guarda — `patient_name`/`doctor_name`/`doctor_matricula`/
 * `image_path` quedan null (la cookie es del flow "monofocal sin
 * patología", ver `lib/prescription-cookie/types.ts`). */
export function prescriptionInsertFromCookie(cookie: PrescriptionCookie) {
  return {
    od_sphere: cookie.od.esf,
    od_cylinder: cookie.od.cil,
    od_axis: cookie.od.eje,
    od_addition: cookie.od.add,
    oi_sphere: cookie.oi.esf,
    oi_cylinder: cookie.oi.cil,
    oi_axis: cookie.oi.eje,
    oi_addition: cookie.oi.add,
    pupillary_distance: cookie.dnp,
    expires_at: cookie.expirationDate,
  };
}

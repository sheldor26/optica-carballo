/**
 * Nombre de producto con la marca adelante, sin repetirla.
 *
 * Varios productos ya llevan la marca en su `name` ("Rusty Xold", "Mormaii Fiji"):
 * concatenar `${brand} ${name}` a ciegas daba "Rusty Rusty Xold" en los mensajes de
 * WhatsApp, el pedido del carrito y el título del ítem en Mercado Pago. Fuente única
 * para armar ese texto en cualquier lugar visible para el cliente.
 */
export function brandedProductName(brandName: string | null | undefined, productName: string): string {
  const name = productName.trim();
  const brand = brandName?.trim();
  if (!brand) return name;
  const n = name.toLowerCase();
  const b = brand.toLowerCase();
  // ¿el nombre ya empieza con la marca (como palabra completa)?
  if (n.startsWith(b) && !/[a-z0-9áéíóúñ]/i.test(n.charAt(b.length))) return name;
  return `${brand} ${name}`;
}

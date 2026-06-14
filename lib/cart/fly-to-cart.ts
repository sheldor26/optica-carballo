/**
 * Animación "volar al carrito": al agregar un producto, una miniatura de su
 * foto vuela en arco desde el origen (la galería de la PDP) hasta el ícono
 * del carrito en el header, que late al recibirla.
 *
 * Puro DOM + Web Animations API — sin librerías, sin estado React. Se
 * autolimpia (crea el clon, lo anima, lo borra). Respeta
 * `prefers-reduced-motion` (no-op) y no hace nada si falta el origen o el
 * destino (degradación silenciosa — la lógica de carrito ya corrió igual).
 *
 * El destino se ubica por id `oc-cart-target` (lo lleva el <Link> del
 * CartBadge). El origen se pasa como elemento (su <img> interno se clona).
 */

const CART_TARGET_ID = 'oc-cart-target';
const MAX_THUMB_PX = 140;

export function flyToCart(originEl: HTMLElement | null): void {
  if (typeof window === 'undefined' || originEl === null) return;

  const reduceMotion = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  if (reduceMotion) return;

  const target = document.getElementById(CART_TARGET_ID);
  if (target === null) return;

  const sourceImg =
    originEl instanceof HTMLImageElement
      ? originEl
      : originEl.querySelector('img');
  const src = sourceImg?.currentSrc || sourceImg?.src;
  if (!src) return;

  const startRect = (sourceImg ?? originEl).getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  if (startRect.width === 0 || startRect.height === 0) return;

  // Achicar el origen a una miniatura prolija (máx ~140px) centrada en la foto.
  const shrink = Math.min(
    1,
    MAX_THUMB_PX / Math.max(startRect.width, startRect.height),
  );
  const w = startRect.width * shrink;
  const h = startRect.height * shrink;
  const startX = startRect.left + (startRect.width - w) / 2;
  const startY = startRect.top + (startRect.height - h) / 2;

  const clone = document.createElement('img');
  clone.src = src;
  clone.alt = '';
  clone.setAttribute('aria-hidden', 'true');
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${w}px`,
    height: `${h}px`,
    objectFit: 'contain',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 12px 32px rgba(24, 24, 27, 0.18)',
    padding: '6px',
    zIndex: '9999',
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(clone);

  const dx = targetRect.left + targetRect.width / 2 - (startX + w / 2);
  const dy = targetRect.top + targetRect.height / 2 - (startY + h / 2);

  const anim = clone.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1, offset: 0 },
      {
        transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(0.55)`,
        opacity: 0.95,
        offset: 0.6,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.12)`,
        opacity: 0.2,
        offset: 1,
      },
    ],
    { duration: 750, easing: 'cubic-bezier(0.5, 0.02, 0.45, 1)' },
  );

  const cleanup = () => clone.remove();
  anim.oncancel = cleanup;
  anim.onfinish = () => {
    cleanup();
    target.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.8)' },
        { transform: 'scale(1)' },
      ],
      { duration: 320, easing: 'ease-out' },
    );
  };
}

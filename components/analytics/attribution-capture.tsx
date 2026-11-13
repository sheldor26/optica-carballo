'use client';

import { useEffect } from 'react';

const COOKIES_CONSENT_KEY = 'oc_cookies_consent';
const ATTRIBUTION_COOKIE = 'oc_attr';
const THIRTY_DAYS_S = 60 * 60 * 24 * 30;

/**
 * ¿La cookie de atribución exige el consentimiento "Aceptar todas"?
 *
 * Por ahora SÍ (lado conservador, ley 25.326): igual que GA4, Clarity y el
 * píxel de X. Si el análisis legal (`argentine-ecom`, 2026-11-12) dice que es
 * una cookie técnica/necesaria, se pone en `false` y se mide a todos los
 * visitantes. Es una sola constante a propósito.
 */
const REQUIRE_CONSENT = true;

function consentGranted(): boolean {
  try {
    const raw = window.localStorage.getItem(COOKIES_CONSENT_KEY);
    if (!raw) return false;
    return (JSON.parse(raw) as { choice?: string }).choice === 'all';
  } catch {
    return false;
  }
}

function cut(v: string | null): string | undefined {
  if (!v) return undefined;
  const t = v.trim().slice(0, 120);
  return t.length > 0 ? t : undefined;
}

/**
 * Guarda de qué anuncio/campaña llegó la visita para anotarlo en el pedido
 * (`orders.attribution`, ver `lib/attribution.ts`). No muestra nada.
 *
 * Solo escribe cuando la URL trae `utm_source` o `twclid` (X agrega `twclid`
 * a los clics de anuncios) o `gclid`: así un visitante que ya vino de un
 * anuncio y después navega o vuelve directo conserva la fuente original
 * durante 30 días (último anuncio gana). Cookie propia, sin datos
 * personales, solo parámetros de campaña.
 */
export function AttributionCapture() {
  useEffect(() => {
    const capture = () => {
      if (REQUIRE_CONSENT && !consentGranted()) return;
      const q = new URLSearchParams(window.location.search);
      const source = cut(q.get('utm_source'));
      const twclid = cut(q.get('twclid'));
      const gclid = cut(q.get('gclid'));
      if (!source && !twclid && !gclid) return;

      const data = {
        s: source ?? (twclid ? 'x' : gclid ? 'google' : undefined),
        m: cut(q.get('utm_medium')),
        c: cut(q.get('utm_campaign')),
        ct: cut(q.get('utm_content')),
        tm: cut(q.get('utm_term')),
        tw: twclid,
        g: gclid,
        lp: window.location.pathname.slice(0, 120),
        t: Date.now(),
      };
      document.cookie =
        `${ATTRIBUTION_COOKIE}=${encodeURIComponent(JSON.stringify(data))}; ` +
        `max-age=${THIRTY_DAYS_S}; path=/; SameSite=Lax; Secure`;
    };

    capture();
    // Si la persona acepta las cookies estando en la página de aterrizaje, la
    // fuente todavía está en la URL: se captura al aceptar.
    const interval = window.setInterval(capture, 2000);
    return () => window.clearInterval(interval);
  }, []);

  return null;
}

'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const COOKIES_CONSENT_KEY = 'oc_cookies_consent';

type ConsentChoice = 'all' | 'necessary_only';

type StoredConsent = {
  version: number;
  choice: ConsentChoice;
  timestamp: number;
};

function readConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COOKIES_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    return parsed.choice ?? null;
  } catch {
    return null;
  }
}

/**
 * Píxel de X (Twitter) — mide qué visitas y compras vienen de los anuncios en
 * X. Es publicidad/seguimiento de terceros, así que se carga SOLO si la persona
 * aceptó en el banner de cookies (mismo gate que GA4 y Clarity, ley 25.326).
 * Con `necessary_only` o sin elegir todavía → no carga nada.
 *
 * Código base oficial del Administrador de eventos de X (Web Pixel). El
 * `config` dispara la vista de página; los eventos de conversión (compra,
 * etc.) hay que crearlos en el Administrador de eventos de X y llamar a
 * `twq('event', '<id del evento>')` — todavía NO hay ninguno creado.
 *
 * ID del píxel vía `NEXT_PUBLIC_X_PIXEL_ID` (con fallback al de la cuenta
 * "Óptica Carballo" de X Ads, leído del Administrador de eventos el
 * 2026-11-12). Vaciando la env var no se carga (silencioso).
 */
const X_PIXEL_ID = process.env.NEXT_PUBLIC_X_PIXEL_ID ?? 'rixqc';

export function XPixel() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const check = () => setConsentGranted(readConsent() === 'all');
    check();
    window.addEventListener('focus', check);
    const interval = window.setInterval(check, 2000);
    return () => {
      window.removeEventListener('focus', check);
      window.clearInterval(interval);
    };
  }, []);

  if (!X_PIXEL_ID || !consentGranted) return null;

  return (
    <Script id="x-pixel-init" strategy="afterInteractive">
      {`
        !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
        },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
        a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
        twq('config','${X_PIXEL_ID}');
      `}
    </Script>
  );
}

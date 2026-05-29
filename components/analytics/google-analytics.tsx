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
 * Google Analytics 4 — carga gtag.js SOLO si el usuario aceptó analytics
 * en el cookie banner. Sin consent, no se carga nada (compliance ley 25.326).
 *
 * Lee `oc_cookies_consent` de localStorage. Si choice === 'all' → carga GA4.
 * Si null o 'necessary_only' → skip.
 *
 * Re-evalúa al focus de la ventana (por si el user cambió consent en otra tab).
 *
 * Requiere `NEXT_PUBLIC_GA_ID` (formato `G-XXXXXXXXXX`) en env vars.
 * Si la env var no está → no carga nada (silencioso, no error).
 */
export function GoogleAnalytics() {
  const [consentGranted, setConsentGranted] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    const check = () => setConsentGranted(readConsent() === 'all');
    check();
    window.addEventListener('focus', check);
    // Poll cada 2s para detectar consent change desde el banner (sin event).
    const interval = window.setInterval(check, 2000);
    return () => {
      window.removeEventListener('focus', check);
      window.clearInterval(interval);
    };
  }, []);

  if (!gaId || !consentGranted) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=Lax;Secure',
          });
        `}
      </Script>
    </>
  );
}

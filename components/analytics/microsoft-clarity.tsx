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
 * Microsoft Clarity — heatmaps + session recordings. Se carga SOLO si el
 * usuario aceptó analytics en el cookie banner (mismo gate que GA4, ley
 * 25.326: Clarity usa cookies y graba comportamiento del usuario).
 *
 * Lee `oc_cookies_consent` de localStorage. Si choice === 'all' → carga
 * Clarity. Si null o 'necessary_only' → skip.
 *
 * Re-evalúa al focus de la ventana + poll 2s (por si el user cambió consent
 * en otra tab / en el banner sin recargar).
 *
 * Project id vía `NEXT_PUBLIC_CLARITY_ID` (con fallback al id provisto por el
 * founder). Si se vacía la env var y no hay fallback → no carga (silencioso).
 */
const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_ID ?? 'xi76xeam7m';

export function MicrosoftClarity() {
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

  if (!CLARITY_PROJECT_ID || !consentGranted) return null;

  return (
    <Script id="ms-clarity-init" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `}
    </Script>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { Mail, Link2, Share2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { track, Events } from '@/lib/analytics/track';

type ShareMethod = 'whatsapp' | 'facebook' | 'email' | 'copy_link' | 'native';
type ContentType = 'product' | 'article';

type Props = {
  /** Título del producto/artículo. Se usa en el mensaje prellenado de
   *  WhatsApp/Email y como subject del email. */
  title: string;
  /** URL absoluta (con https://opticacarballo.com.ar) — necesaria porque
   *  WhatsApp/Facebook/Email no funcionan con paths relativos. */
  url: string;
  /** Para tracking GA4: distinguir si lo compartido es product o article. */
  contentType: ContentType;
  /** Slug del item para `item_id` en evento GA4. */
  itemSlug: string;
  /** Layout:
   *  - 'minimal' (default): 1 botón discreto "Compartir" + popover con los 5.
   *    Founder feedback 2026-05-31: "que queden mas disimulados, que no
   *    ocupen tanto lugar". Usado en PDP + artículos por defecto.
   *  - 'compact': 5 icons en row sin popover. Legacy/futuro si necesitamos
   *    visibilidad máxima en alguna superficie.
   *  - 'labeled': 5 icons + texto en row. Legacy/desktop landscape.
   */
  variant?: 'minimal' | 'compact' | 'labeled';
};

/**
 * Botones para compartir un producto o artículo. Set priorizado para AR:
 * WhatsApp + Facebook + Email + Copiar link + Compartir nativo (mobile).
 *
 * Por defecto renderiza un trigger único "Compartir" + popover con los 5.
 * Diseño minimal — founder reportó 2026-05-31 que los 5 botones inline
 * ocupaban demasiado lugar y se veían intrusivos.
 *
 * Sin emojis en mensaje WhatsApp — founder reportó que rompen el preview
 * en algunos clientes.
 *
 * Cada click dispara evento GA4 `share` con `method` para medir qué canal
 * funciona en producción.
 */
export function ShareButtons({
  title,
  url,
  contentType,
  itemSlug,
  variant = 'minimal',
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [nativeShareSupported, setNativeShareSupported] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Detección de soporte navigator.share en client. SSR-safe: por default
  // false → no renderiza botón nativo hasta que se confirme soporte client-side.
  useEffect(() => {
    setNativeShareSupported(
      typeof navigator !== 'undefined' && typeof navigator.share === 'function',
    );
  }, []);

  // Click-outside cierra el popover (solo variant minimal).
  useEffect(() => {
    if (variant !== 'minimal' || !open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [variant, open]);

  // Escape cierra el popover.
  useEffect(() => {
    if (variant !== 'minimal' || !open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [variant, open]);

  const trackShare = (method: ShareMethod) => {
    track(Events.SHARE, {
      method,
      content_type: contentType,
      item_id: itemSlug,
    });
  };

  // Mensaje prellenado WhatsApp: título del item + URL. Sin emoji (founder
  // 2026-05-31: "Sin emojis - whatsapp los rompe").
  const whatsappText = `Mirá esto en Óptica Carballo: ${title} ${url}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  // Facebook Share Dialog clásico — no requiere SDK ni app ID.
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  // Email: subject = título; body = URL + breve contexto.
  const emailSubject = `${title} - Óptica Carballo`;
  const emailBody = `Mirá esto en Óptica Carballo:\n\n${title}\n${url}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      trackShare('copy_link');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silencioso — en browsers viejos sin clipboard API.
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, url });
      trackShare('native');
      setOpen(false);
    } catch {
      // User canceló o error — silencioso.
    }
  };

  // Variant minimal: trigger único + popover. Default.
  if (variant === 'minimal') {
    return (
      <div ref={wrapperRef} className="relative inline-block">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="Compartir"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
        >
          <Share2 className="size-3.5" aria-hidden="true" />
          <span>Compartir</span>
        </button>

        {open && (
          <div
            role="menu"
            className="border-border/60 bg-background absolute left-0 top-full z-30 mt-2 flex items-center gap-1 rounded-lg border p-1.5 shadow-lg"
          >
            <PopoverItem
              href={whatsappHref}
              onClick={() => {
                trackShare('whatsapp');
                setOpen(false);
              }}
              label="WhatsApp"
              icon={<WhatsAppIcon className="size-4" />}
            />
            <PopoverItem
              href={facebookHref}
              onClick={() => {
                trackShare('facebook');
                setOpen(false);
              }}
              label="Facebook"
              icon={<FacebookIcon className="size-4" />}
            />
            <PopoverItem
              href={emailHref}
              onClick={() => {
                trackShare('email');
                setOpen(false);
              }}
              label="Email"
              icon={<Mail className="size-4" aria-hidden="true" />}
              external={false}
            />
            <PopoverButton
              onClick={handleCopy}
              label={copied ? 'Copiado' : 'Copiar link'}
              icon={
                copied ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Link2 className="size-4" aria-hidden="true" />
                )
              }
            />
            {nativeShareSupported && (
              <PopoverButton
                onClick={handleNativeShare}
                label="Más"
                icon={<Share2 className="size-4" aria-hidden="true" />}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // Variantes legacy compact + labeled (sin popover, los 5 inline).
  const buttonClass = cn(
    'inline-flex items-center justify-center gap-2 rounded-md border border-border/60 bg-background text-foreground transition-colors hover:bg-muted hover:border-foreground/30',
    variant === 'compact'
      ? 'size-9 md:size-10'
      : 'h-10 px-3 text-xs font-medium md:text-sm',
  );

  return (
    <div
      role="group"
      aria-label="Compartir"
      className="relative flex flex-wrap items-center gap-2"
    >
      {variant === 'labeled' && (
        <span className="text-muted-foreground mr-1 text-xs font-medium uppercase tracking-[0.14em]">
          Compartir
        </span>
      )}

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare('whatsapp')}
        aria-label="Compartir por WhatsApp"
        className={buttonClass}
      >
        <WhatsAppIcon className="size-4" />
        {variant === 'labeled' && <span>WhatsApp</span>}
      </a>

      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare('facebook')}
        aria-label="Compartir en Facebook"
        className={buttonClass}
      >
        <FacebookIcon className="size-4" />
        {variant === 'labeled' && <span>Facebook</span>}
      </a>

      <a
        href={emailHref}
        onClick={() => trackShare('email')}
        aria-label="Compartir por email"
        className={buttonClass}
      >
        <Mail className="size-4" aria-hidden="true" />
        {variant === 'labeled' && <span>Email</span>}
      </a>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Link copiado' : 'Copiar link'}
        className={buttonClass}
      >
        {copied ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Link2 className="size-4" aria-hidden="true" />
        )}
        {variant === 'labeled' && <span>{copied ? 'Copiado' : 'Copiar link'}</span>}
      </button>

      {nativeShareSupported && (
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="Compartir (más opciones)"
          className={buttonClass}
        >
          <Share2 className="size-4" aria-hidden="true" />
          {variant === 'labeled' && <span>Más</span>}
        </button>
      )}

      {copied && (
        <span
          role="status"
          aria-live="polite"
          className="bg-foreground text-background absolute -top-9 left-0 rounded-md px-2.5 py-1 text-xs font-medium shadow-md"
        >
          Link copiado
        </span>
      )}
    </div>
  );
}

/**
 * Item de popover anclado a `<a>` (links externos: WhatsApp, Facebook, Email).
 */
function PopoverItem({
  href,
  onClick,
  label,
  icon,
  external = true,
}: {
  href: string;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      role="menuitem"
      aria-label={label}
      title={label}
      className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-9 items-center justify-center rounded-md transition-colors"
    >
      {icon}
    </a>
  );
}

/**
 * Item de popover anclado a `<button>` (acciones: copiar link, share nativo).
 */
function PopoverButton({
  onClick,
  label,
  icon,
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="menuitem"
      aria-label={label}
      title={label}
      className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-9 items-center justify-center rounded-md transition-colors"
    >
      {icon}
    </button>
  );
}

/**
 * Icon de WhatsApp (lucide-react no tiene logo oficial, dibujo svg propio).
 * Path simple del logo verde estándar.
 */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/**
 * Icon de Facebook (lucide-react no tiene logo F oficial, svg propio).
 */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 011.141.195v3.325a8.623 8.623 0 00-.653-.036 26.805 26.805 0 00-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 00-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

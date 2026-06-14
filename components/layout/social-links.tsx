import { Facebook, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SOCIAL_LINKS, type SocialPlatform } from '@/lib/site/business';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.27 0 .54.04.79.12V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.8a4.85 4.85 0 0 1-1.04-.11z" />
    </svg>
  );
}

const ICONS: Record<
  SocialPlatform,
  (props: { className?: string }) => React.ReactElement
> = {
  instagram: ({ className }) => (
    <Instagram className={className} aria-hidden="true" />
  ),
  facebook: ({ className }) => (
    <Facebook className={className} aria-hidden="true" />
  ),
  tiktok: ({ className }) => <TikTokIcon className={className} />,
};

/**
 * Íconos de las redes sociales de la óptica. Lee `SOCIAL_LINKS` (config en
 * `lib/site/business.ts`). Abren en pestaña nueva. Si la lista está vacía,
 * no renderiza nada.
 */
export function SocialLinks({ className }: { className?: string }) {
  if (SOCIAL_LINKS.length === 0) return null;
  return (
    <ul className={cn('flex items-center gap-3', className)}>
      {SOCIAL_LINKS.map((social) => {
        const Icon = ICONS[social.platform];
        return (
          <li key={social.platform}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${social.label} de Óptica Carballo`}
              className="border-border/60 text-foreground/70 hover:text-foreground hover:border-foreground/40 flex size-9 items-center justify-center rounded-full border transition-colors"
            >
              <Icon className="size-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

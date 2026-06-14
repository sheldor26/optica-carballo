/**
 * Info del negocio leída desde env vars públicas. Devuelve sólo los campos
 * que están completos — los vacíos no se muestran (regla dura del proyecto:
 * trust signals reales, no inventados).
 */

function nonEmpty(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok';

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  url: string;
};

/**
 * Redes sociales de la óptica. Hardcodeadas a propósito: son URLs públicas y
 * estables, y así el founder NO tiene que configurar nada en Vercel. Para
 * agregar, sacar o cambiar una red, editar esta lista.
 *
 * Se consumen en el footer (íconos) y en el `sameAs` de Organization JSON-LD
 * (le dice a Google que estos perfiles son del negocio — ayuda al panel de
 * conocimiento y al E-E-A-T).
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/optica.carballo',
  },
  {
    platform: 'facebook',
    label: 'Facebook',
    url: 'https://www.facebook.com/optica.carballo1',
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    url: 'https://www.tiktok.com/@opticacarballo',
  },
];

export type BusinessInfo = {
  siteName: string;
  locality: string | null;
  region: string | null;
  street: string | null;
  postal: string | null;
  phone: string | null;
  whatsappNumber: string | null;
  whatsappLink: string | null;
  regenteName: string | null;
  regenteMatricula: string | null;
  tecnicoName: string | null;
  tecnicoMatricula: string | null;
};

/**
 * Construye una URL `wa.me/` con mensaje pre-llenado.
 * Devuelve null si no hay número de WhatsApp configurado.
 */
export function getWhatsappLinkWithContext(message: string): string | null {
  const whatsappNumber = nonEmpty(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  if (!whatsappNumber) return null;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getBusinessInfo(): BusinessInfo {
  const whatsappNumber = nonEmpty(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola, te consulto por...')}`
    : null;

  return {
    siteName: nonEmpty(process.env.NEXT_PUBLIC_SITE_NAME) ?? 'Óptica Carballo',
    locality: nonEmpty(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_LOCALITY),
    region: nonEmpty(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_REGION),
    street: nonEmpty(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_STREET),
    postal: nonEmpty(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_POSTAL),
    phone: nonEmpty(process.env.NEXT_PUBLIC_BUSINESS_PHONE),
    whatsappNumber,
    whatsappLink,
    regenteName: nonEmpty(process.env.NEXT_PUBLIC_REGENTE_NAME),
    regenteMatricula: nonEmpty(process.env.NEXT_PUBLIC_REGENTE_MATRICULA),
    tecnicoName: nonEmpty(process.env.NEXT_PUBLIC_TECNICO_NAME),
    tecnicoMatricula: nonEmpty(process.env.NEXT_PUBLIC_TECNICO_MATRICULA),
  };
}

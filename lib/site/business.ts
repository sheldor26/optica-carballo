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

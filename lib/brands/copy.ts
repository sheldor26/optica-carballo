/**
 * Copy editorial de cada marca activa para mostrar en su página propia
 * (`/anteojos-de-sol/[brand]` y `/anteojos-de-receta/[brand]`).
 *
 * Fuente: información pública verificable + segmentación de BRANDS.md.
 * **NO inventar fechas o datos no verificados** — preferible omitir el campo.
 *
 * El founder puede editar este archivo directo si quiere ajustar
 * cualquier copy. Si en el futuro escala a 10+ marcas o copy dinámico,
 * migrar a columnas en tabla `brands` (campos: `tagline`, `story_md`,
 * `country`, `founded_year`, `differentials jsonb`).
 */

export type BrandDifferential = {
  /** Lucide icon name. */
  icon: 'Award' | 'Globe' | 'Sparkles' | 'Shield' | 'Heart' | 'Sun' | 'Waves' | 'Mountain' | 'MapPin';
  title: string;
  description: string;
};

export type BrandCopy = {
  tagline: string;
  /** 2-3 párrafos cortos. Honesto, sin claims falsos. */
  story: string;
  country: string;
  /** Si no se confirma con seguridad, omitir. */
  foundedYear?: number;
  segment: string;
  audience: string;
  differentials: BrandDifferential[];
};

export const BRAND_COPY: Record<string, BrandCopy> = {
  vulk: {
    tagline: 'Diseño urbano argentino con buena relación calidad-precio',
    story:
      'Vulk es una marca argentina con foco en estética minimal-urbana. Su catálogo apuesta a líneas limpias, materiales sólidos (acetato y metal) y modelos que funcionan tanto en lo casual como en lo formal. Es una de las opciones más equilibradas para quien busca un anteojo de marca local sin pagar premium internacional.',
    country: 'Argentina',
    segment: 'Medio',
    audience: 'Público joven-adulto urbano',
    differentials: [
      {
        icon: 'MapPin',
        title: 'Diseño local',
        description: 'Marca argentina con estética propia, no etiqueta importada.',
      },
      {
        icon: 'Award',
        title: 'Buena relación precio-calidad',
        description: 'Materiales sólidos a precio accesible vs marcas premium internacionales.',
      },
      {
        icon: 'Sparkles',
        title: 'Estética versátil',
        description: 'Modelos que funcionan en lo casual y lo formal sin verse fuera de lugar.',
      },
    ],
  },

  rusty: {
    tagline: 'Lifestyle surf y skate con identidad clara',
    story:
      'Rusty nació en Australia en 1985 de la mano del shaper Rusty Preisendorfer y rápidamente se convirtió en un referente del surf mundial. La marca llegó a Argentina hace más de dos décadas y hoy tiene una línea propia de anteojos pensada para el público joven, deportivo y casual. El ADN sigue siendo el mismo: simplicidad, diseño funcional y conexión con la cultura del surf y el skate.',
    country: 'Australia (presencia argentina)',
    foundedYear: 1985,
    segment: 'Medio',
    audience: 'Joven, lifestyle surf/skate',
    differentials: [
      {
        icon: 'Waves',
        title: 'Legado surf',
        description: 'Una de las marcas referentes del surf mundial desde los 80.',
      },
      {
        icon: 'Heart',
        title: 'Identidad clara',
        description: 'Estética joven, deportiva y casual sin sobreactuarla.',
      },
      {
        icon: 'Shield',
        title: 'Pensada para uso real',
        description: 'Diseños prácticos, no solo decorativos.',
      },
    ],
  },

  mormaii: {
    tagline: 'Brasilera con alma surf, hecha para el sol fuerte',
    story:
      'Mormaii nació en 1976 en Garopaba, Brasil, fundada por el cirujano y surfista Marco Aurélio Raymundo. Empezó como marca de trajes de neoprene y se expandió a anteojos, ropa, relojes y accesorios. Sus diseños están pensados para uso intensivo bajo sol fuerte, con buena protección UV y durabilidad probada. Es una de las marcas más sólidas del segmento outdoor/lifestyle latinoamericano.',
    country: 'Brasil',
    foundedYear: 1976,
    segment: 'Medio',
    audience: 'Outdoor lifestyle, sol intenso',
    differentials: [
      {
        icon: 'Sun',
        title: 'Pensada para sol intenso',
        description: 'Lentes con protección UV testeada para latitudes tropicales.',
      },
      {
        icon: 'Waves',
        title: 'Linaje surf brasilero',
        description: 'Más de 45 años en el rubro surf y outdoor.',
      },
      {
        icon: 'Shield',
        title: 'Durabilidad probada',
        description: 'Construcción sólida para uso intensivo.',
      },
    ],
  },

  reef: {
    tagline: 'Beach lifestyle californiano con un toque relajado',
    story:
      'Reef nació en 1984 en San Diego (California) de la mano de los hermanos argentinos Fernando y Santiago Aguerre. Se hizo conocida internacionalmente por sus chinelas de playa y desde entonces extendió la marca a anteojos, ropa y accesorios. Sus diseños evocan la cultura playa-surf sin caer en lo deportivo extremo: lo casual sin esfuerzo, con buen acabado.',
    country: 'USA (fundadores argentinos)',
    foundedYear: 1984,
    segment: 'Medio',
    audience: 'Beach lifestyle relajado',
    differentials: [
      {
        icon: 'Sun',
        title: 'ADN playero',
        description: 'Diseños que respiran cultura playa-surf sin caer en lo deportivo.',
      },
      {
        icon: 'Heart',
        title: 'Casual sin esfuerzo',
        description: 'Funcionan en la playa y en la calle sin desentonar.',
      },
      {
        icon: 'Globe',
        title: 'Origen mixto',
        description: 'Marca californiana fundada por hermanos argentinos.',
      },
    ],
  },

  'paula-cahen-danvers': {
    tagline: 'Femenino, sofisticado y argentino',
    story:
      'Paula Cahen D\'Anvers es una de las diseñadoras más reconocidas de Argentina, con una marca de indumentaria femenina que se extendió a accesorios — entre ellos, anteojos. La línea de anteojos mantiene la estética cuidada y atemporal de la marca textil: pensada para la mujer adulta que busca un anteojo con personalidad sin recurrir a etiquetas de lujo internacional.',
    country: 'Argentina',
    segment: 'Medio',
    audience: 'Mujer adulta, estética sofisticada',
    differentials: [
      {
        icon: 'Heart',
        title: 'Estética femenina cuidada',
        description: 'Diseños pensados específicamente para el target femenino adulto.',
      },
      {
        icon: 'MapPin',
        title: 'Marca argentina referente',
        description: 'Una de las diseñadoras más reconocidas del país, con identidad propia.',
      },
      {
        icon: 'Sparkles',
        title: 'Atemporal',
        description: 'Modelos que no quedan fuera de moda en una o dos temporadas.',
      },
    ],
  },
};

export function getBrandCopy(slug: string): BrandCopy | null {
  return BRAND_COPY[slug] ?? null;
}

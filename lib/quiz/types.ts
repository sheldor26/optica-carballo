export type QuizUso = 'sol' | 'receta' | 'ambos';
export type QuizCara = 'ovalada' | 'redonda' | 'cuadrada' | 'corazon' | 'no_se';
export type QuizPrecio = 'bajo' | 'medio' | 'alto';
export type QuizGenero = 'hombre' | 'mujer' | 'unisex';
export type QuizCorreccion = 'si' | 'no';

export interface QuizAnswers {
  uso: QuizUso;
  cara: QuizCara;
  precio: QuizPrecio;
  genero: QuizGenero;
  correccion: QuizCorreccion;
}

export interface QuizRecommendation {
  slug: string;
  name: string;
  brandName: string;
  brandSlug: string;
  categorySlug: string;
  minPriceCents: number | null;
  primaryImagePath: string | null;
  primaryImageScale: number;
  justification: string;
}

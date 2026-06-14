import { NextResponse, type NextRequest } from 'next/server';
import { fetchQuizRecommendations } from '@/lib/quiz/recommendations';
import type { QuizAnswers } from '@/lib/quiz/types';

/**
 * Recomendaciones del riel "Pensado para vos". Recibe las respuestas del quiz
 * por query (las manda el cliente leyendo la cookie `oc_quiz`) y reusa la misma
 * lógica de reglas de `fetchQuizRecommendations`. Data pública (catálogo),
 * cacheable en CDN por combinación de respuestas.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const answers: QuizAnswers = {
    uso: (sp.get('uso') as QuizAnswers['uso']) ?? 'ambos',
    cara: (sp.get('cara') as QuizAnswers['cara']) ?? 'no_se',
    precio: (sp.get('precio') as QuizAnswers['precio']) ?? 'medio',
    genero: (sp.get('genero') as QuizAnswers['genero']) ?? 'unisex',
    correccion: (sp.get('correccion') as QuizAnswers['correccion']) ?? 'no',
  };

  const recommendations = await fetchQuizRecommendations(answers);

  return NextResponse.json(
    { recommendations },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    },
  );
}

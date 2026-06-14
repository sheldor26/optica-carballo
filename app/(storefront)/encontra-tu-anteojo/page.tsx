import type { Metadata } from 'next';
import { QuizStepper } from '@/components/quiz/quiz-stepper';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: '¿Qué anteojo es para vos? — Óptica Carballo',
  description:
    'Respondé 5 preguntas y te recomendamos 3 modelos ideales para vos. Quiz de anteojos personalizado: sol, receta, presupuesto y forma de cara.',
  alternates: { canonical: `${SITE_URL}/encontra-tu-anteojo` },
  openGraph: {
    title: '¿Qué anteojo es para vos? — Óptica Carballo',
    description: 'Quiz en 5 pasos para encontrar el anteojo perfecto según tu cara, presupuesto y uso.',
    url: `${SITE_URL}/encontra-tu-anteojo`,
    type: 'website',
  },
};

export default function EncontraTuAnteojo() {
  return (
    <main>
      <section className="border-b border-border bg-muted/30 px-4 py-10 text-center md:py-14">
        <p className="text-muted-foreground inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
          <span className="bg-foreground size-1.5 rounded-full" aria-hidden="true" />
          Quiz personalizado
        </p>
        <h1 className="text-foreground mt-4 font-serif text-4xl font-medium tracking-[-0.02em] md:text-5xl">
          ¿Qué anteojo <span className="italic">es para vos?</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance text-sm md:text-base">
          Respondé 5 preguntas y te recomendamos los modelos que mejor se adaptan a tu estilo, cara y presupuesto.
        </p>
      </section>

      <QuizStepper />
    </main>
  );
}

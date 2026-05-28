import { CheckCircle2, Truck, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

const ITEMS = [
  { icon: ShieldCheck, label: 'Óptica matriculada habilitada' },
  { icon: MapPin, label: 'Más de 30 años en Argentina' },
  { icon: Truck, label: 'Envíos a todo el país' },
  { icon: CheckCircle2, label: 'Stock real verificado' },
  { icon: Sparkles, label: 'Marcas con respaldo oficial' },
];

export function TrustMarquee() {
  return (
    <section
      aria-label="Beneficios de comprar en Óptica Carballo"
      className="bg-foreground text-background overflow-hidden border-y py-3"
    >
      <div className="group relative flex">
        <div className="animate-marquee flex shrink-0 items-center gap-12 pr-12">
          {[...ITEMS, ...ITEMS].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex shrink-0 items-center gap-2 text-sm font-medium tracking-wide"
              >
                <Icon className="text-brand size-4" aria-hidden="true" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

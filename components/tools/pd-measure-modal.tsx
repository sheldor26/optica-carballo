'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PDMeasureTool } from '@/components/tools/pd-measure-tool';

type Props = {
  /** Trigger element (ej. botón) que abre el modal. */
  children: React.ReactNode;
  /** Callback cuando el usuario clickea "Usar esta DNP" en el modal. */
  onMeasured: (dnpMm: number) => void;
  /** Controlled state opcional. Si no se pasa, el Dialog es uncontrolled. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Wrapper modal del medidor de DNP. Pensado para uso embebido dentro de
 * forms de receta — el usuario está cargando su receta a mano, clickea
 * "Mide tu DP" al lado del campo DNP, abre el modal, mide, y el valor
 * se prellena en el form.
 *
 * El PDMeasureTool acepta `onResult` opcional — cuando está presente,
 * muestra botón "Usar esta DNP" en vez de "Guardar a mi receta".
 */
export function PDMeasureModal({
  children,
  onMeasured,
  open,
  onOpenChange,
}: Props) {
  const handleResult = (dnpMm: number) => {
    onMeasured(dnpMm);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <DialogTitle>Medí tu DNP</DialogTitle>
          <DialogDescription>
            Cuando termines, clickeá &ldquo;Usar esta DNP&rdquo; para sumarla
            al form de receta.
          </DialogDescription>
        </div>
        <div className="mt-4">
          <PDMeasureTool onResult={handleResult} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

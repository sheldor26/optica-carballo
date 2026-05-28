export function ProductGallery({ productName }: { productName: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="bg-muted text-muted-foreground flex aspect-square w-full items-center justify-center rounded-lg text-sm"
        aria-label={`Imagen pendiente de ${productName}`}
      >
        Foto pendiente
      </div>
      <div className="grid grid-cols-4 gap-2" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted/60 aspect-square rounded-md"
          />
        ))}
      </div>
    </div>
  );
}

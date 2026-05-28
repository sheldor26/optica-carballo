import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPriceCents } from '@/lib/format/currency';

export type ProductCardData = {
  slug: string;
  name: string;
  shortDescription: string | null;
  minPriceCents: number | null;
  inStockCount: number;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const outOfStock = product.inStockCount === 0;

  return (
    <Card className="group/card hover:border-foreground/30 flex h-full flex-col transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div
          className="bg-muted text-muted-foreground flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-md text-xs transition-transform duration-500 ease-out group-hover/card:scale-[1.03]"
          aria-hidden="true"
        >
          Foto pendiente
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardTitle className="text-base leading-tight">{product.name}</CardTitle>
        {product.shortDescription && (
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
            {product.shortDescription}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex items-baseline justify-between pt-3">
        {product.minPriceCents !== null ? (
          <p className="text-base font-semibold">
            <span className="text-muted-foreground text-xs font-normal">Desde </span>
            {formatPriceCents(product.minPriceCents)}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">Sin stock</p>
        )}
        {outOfStock && (
          <span className="text-destructive text-xs font-medium">Sin stock</span>
        )}
      </CardFooter>
    </Card>
  );
}

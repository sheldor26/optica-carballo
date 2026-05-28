import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { BrandWithProductCount } from '@/lib/catalog/queries';
import type { CategoryConfig } from '@/lib/catalog/categories';

export function BrandGridCard({
  brand,
  category,
}: {
  brand: BrandWithProductCount;
  category: CategoryConfig;
}) {
  const href = `/${category.slug}/${brand.slug}`;

  return (
    <Link href={href} className="group">
      <Card className="flex h-full flex-col transition-colors group-hover:border-foreground">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{brand.name}</CardTitle>
            {brand.is_argentine && (
              <Badge variant="secondary" className="shrink-0">
                Marca local
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          {brand.description && (
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {brand.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-3">
          <span className="text-muted-foreground text-sm">
            {brand.productCount === 1
              ? '1 modelo disponible'
              : `${brand.productCount} modelos disponibles`}
          </span>
          <span
            className="text-foreground inline-flex items-center gap-1 text-sm font-medium"
            aria-hidden="true"
          >
            Ver catálogo
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

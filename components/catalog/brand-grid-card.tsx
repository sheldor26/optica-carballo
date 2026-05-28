import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  getBrandAssetUrl,
  shouldInvertLogo,
} from '@/lib/storage/brand-asset-url';
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
    <Link href={href} className="group block" aria-label={`Ver ${brand.name}`}>
      <Card className="flex h-full flex-col transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-foreground group-hover:shadow-xl">
        <CardHeader className="pb-3">
          {brand.logo_url ? (
            <div className="flex h-12 items-center">
              <Image
                src={getBrandAssetUrl(brand.logo_url)}
                alt={brand.name}
                width={140}
                height={48}
                className={cn(
                  'h-10 w-auto object-contain',
                  shouldInvertLogo(brand.logo_url, 'light-bg') &&
                    'brightness-0',
                )}
              />
            </div>
          ) : (
            <CardTitle className="text-lg">{brand.name}</CardTitle>
          )}
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
            <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

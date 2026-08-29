'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPriceCents } from '@/lib/format/currency';
import { describeVariant } from '@/lib/catalog/variant-label';
import { isPolarizedVariant } from '@/lib/catalog/polarized';
import { removeFromCart, updateCartItem } from '@/lib/cart/actions';
import {
  MAX_QUANTITY_PER_ITEM,
  type ResolvedCartItem,
} from '@/lib/cart/types';

function issueLabel(issue: ResolvedCartItem['issue']): string | null {
  if (issue === 'unavailable') return 'Ya no está disponible';
  if (issue === 'out_of_stock') return 'Sin stock';
  if (issue === 'over_stock') return 'Stock insuficiente';
  return null;
}

export function CartItemRow({ item }: { item: ResolvedCartItem }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const broken = item.issue !== null;
  const productHref =
    item.categorySlug && item.brand.slug && item.product.slug
      ? `/${item.categorySlug}/${item.brand.slug}/${item.product.slug}`
      : null;
  const maxQty = Math.min(item.variant.stockQty, MAX_QUANTITY_PER_ITEM);
  const lineTotalCents = item.variant.priceCents * item.quantity;

  const handleChangeQty = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextQty = Number(event.target.value);
    if (!Number.isInteger(nextQty) || nextQty < 1) return;
    setError(null);
    startTransition(async () => {
      const res = await updateCartItem({
        variantId: item.variantId,
        quantity: nextQty,
      });
      if (!res.ok) setError(res.error);
      window.dispatchEvent(new CustomEvent('oc:cart-changed'));
    });
  };

  const handleRemove = () => {
    setError(null);
    startTransition(async () => {
      await removeFromCart({ variantId: item.variantId });
      window.dispatchEvent(new CustomEvent('oc:cart-changed'));
    });
  };

  return (
    <li className="border-border flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex-1">
        {productHref ? (
          <Link
            href={productHref}
            className="text-foreground hover:underline font-medium"
          >
            {item.product.name}
          </Link>
        ) : (
          <span className="text-foreground font-medium">{item.product.name}</span>
        )}
        <p className="text-muted-foreground text-xs">
          {item.brand.name} · {describeVariant(item.variant.attributes)}
          {isPolarizedVariant(item.variant.attributes) && (
            <span className="text-blue-700"> · Polarizado</span>
          )}{' '}
          · SKU{' '}
          {item.variant.sku}
        </p>
        {broken && (
          <p className="text-destructive mt-1 text-xs font-medium">
            {issueLabel(item.issue)}
          </p>
        )}
        {error && (
          <p className="text-destructive mt-1 text-xs" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        {broken ? (
          <span className="text-muted-foreground text-sm tabular-nums">
            x{item.quantity}
          </span>
        ) : (
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground text-xs">Cantidad</span>
            <select
              aria-label="Cantidad"
              className="border-input bg-background h-11 rounded-md border px-2 text-sm"
              value={item.quantity}
              onChange={handleChangeQty}
              disabled={pending || maxQty < 1}
            >
              {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="min-w-[90px] text-right">
          <p className="text-foreground text-sm font-semibold">
            {formatPriceCents(lineTotalCents)}
          </p>
          {item.quantity > 1 && !broken && (
            <p className="text-muted-foreground text-xs">
              {formatPriceCents(item.variant.priceCents)} c/u
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          disabled={pending}
          aria-label={`Quitar ${item.product.name}`}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </Button>
      </div>
    </li>
  );
}

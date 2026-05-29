'use server';

import { revalidatePath } from 'next/cache';
import {
  clearCompare,
  removeFromCompare,
  toggleCompare,
  type CompareEntry,
} from '@/lib/compare/cookie';

export async function toggleCompareAction(
  entry: CompareEntry,
): Promise<{ added: boolean; full: boolean }> {
  const result = await toggleCompare(entry);
  revalidatePath('/comparar');
  return result;
}

export async function removeFromCompareAction(slug: string): Promise<void> {
  await removeFromCompare(slug);
  revalidatePath('/comparar');
}

export async function clearCompareAction(): Promise<void> {
  await clearCompare();
  revalidatePath('/comparar');
}

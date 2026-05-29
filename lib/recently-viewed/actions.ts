'use server';

import { addToRecent, type RecentEntry } from '@/lib/recently-viewed/cookie';

/**
 * Server action que escribe el producto al cookie de "vistos recientes".
 * Se llama desde el client component <RecentlyViewedTracker> al montar.
 */
export async function trackRecentAction(entry: RecentEntry): Promise<void> {
  await addToRecent(entry);
}

'use server';

import { subscribeEmail } from '@/lib/newsletter/subscribe';
import type { NewsletterSource, SubscribeResult } from '@/lib/newsletter/types';

export async function subscribeNewsletterAction(args: {
  email: string;
  source: NewsletterSource;
}): Promise<SubscribeResult> {
  return subscribeEmail(args);
}

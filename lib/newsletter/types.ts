export type NewsletterSource =
  | 'home_hero'
  | 'footer'
  | 'checkout'
  | 'popup'
  | 'other';

export type SubscribeResult =
  | { ok: true; alreadyExisted: boolean }
  | { ok: false; error: 'invalid_email' | 'rate_limited' | 'server_error' };

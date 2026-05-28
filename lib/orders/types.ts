/**
 * Tipos del dominio de pedidos. Manuales (en vez de derivados de
 * `Database['public']['Tables']['orders']['Row']`) para mantener
 * estabilidad si el schema cambia y para tener nombres descriptivos.
 */

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type OrderListItem = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalCents: number;
  itemCount: number;
  createdAt: string; // ISO
  paidAt: string | null;
};

export type OrderDetail = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string | null;
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingRecipientName: string | null;
  shippingStreet: string | null;
  shippingNumber: string | null;
  shippingApartment: string | null;
  shippingCity: string | null;
  shippingProvince: string | null;
  shippingPostalCode: string | null;
  shippingPhone: string | null;
  shippingMethod: string | null;
  trackingNumber: string | null;
  mpPaymentId: string | null;
  invoiceUrl: string | null;
  notes: string | null;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  items: OrderItem[];
};

export type OrderItem = {
  id: string;
  productName: string;
  brandName: string | null;
  productSlug: string;
  variantSku: string;
  variantAttributes: Record<string, unknown>;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

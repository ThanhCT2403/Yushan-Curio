export type SouvenirCategory =
  | 'All'
  | 'Porcelain'
  | 'Tea Ware'
  | 'Lacquer & Jade'
  | 'Silk & Paper';

export type SortOption = 'featured' | 'price-asc' | 'price-desc';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

export type LanguageCode = 'en' | 'zh-CN';

export type ProductBadgeType = 'best-seller' | 'new-arrival' | 'low-stock';

export type PriceRangePreset =
  | 'all'
  | 'under-100'
  | '100-150'
  | 'over-150'
  | 'custom';

export type HeroSlideTheme = 'espresso' | 'amber' | 'charcoal' | 'cream';

export interface HeroSlide {
  id: string;
  theme: HeroSlideTheme;
  isDark: boolean;
  kicker: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  ctaLabel: string;
  ctaCategory: SouvenirCategory;
  featuredProductId: string;
  image: string;
  imageAlt: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  note: string;
  priceDelta: number;
}

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  variantLabel: string;
  comment: string;
}

export interface ReviewSummary {
  count: number;
  averageRating: number;
}

export interface SouvenirProduct {
  id: string;
  slug: string;
  name: string;
  chineseTitle: string;
  category: Exclude<SouvenirCategory, 'All'>;
  origin: string;
  workshop: string;
  price: number;
  image: string;
  imageAlt: string;
  editionNote?: string;
  badge?: ProductBadgeType;
  shortDescription: string;
  story: string;
  materials: string;
  dimensions: string;
  inStock: boolean;
  featuredRank: number;
  variants: ProductVariant[];
  reviews?: ProductReview[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  giftWrapFee: number;
  shippingFee: number;
  total: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
}

export type PaymentMethod = 'card' | 'cod';

export interface CheckoutFormValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  giftMessage: string;
  paymentMethod: PaymentMethod;
}

export type CheckoutFieldName =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'address'
  | 'city'
  | 'postalCode';

export type CheckoutErrors = Partial<Record<CheckoutFieldName, string>>;

export interface ConfirmedOrderItem {
  productId: string;
  name: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface ConfirmedOrder {
  orderNumber: string;
  createdAtIso: string;
  customer: CheckoutFormValues;
  items: ConfirmedOrderItem[];
  totals: CartTotals;
}

export type OrderFulfillmentStatus = 'Processing' | 'Shipped' | 'Delivered';

export interface OrderTrackingMilestone {
  step: OrderFulfillmentStatus;
  title: string;
  detail: string;
  timestamp: string;
  completed: boolean;
  active: boolean;
}

export interface SeededOrderRecord {
  order: ConfirmedOrder;
  status: OrderFulfillmentStatus;
  carrierNote: string;
  estimatedDelivery: string;
}

export interface OrderStatusResult {
  order: ConfirmedOrder;
  status: OrderFulfillmentStatus;
  carrierNote: string;
  estimatedDelivery: string;
  estimatedDeliveryDate: string;
  milestones: OrderTrackingMilestone[];
}

export interface RestockAlertSubscription {
  productId: string;
  productName: string;
  email: string;
  subscribedAtIso: string;
}


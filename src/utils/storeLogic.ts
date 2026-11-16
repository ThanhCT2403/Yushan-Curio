import type {
  CartItem,
  CartTotals,
  CheckoutErrors,
  CheckoutFormValues,
  ConfirmedOrder,
  ConfirmedOrderItem,
  CurrencyCode,
  OrderFulfillmentStatus,
  OrderStatusResult,
  OrderTrackingMilestone,
  PriceRangePreset,
  ProductReview,
  RestockAlertSubscription,
  ReviewSummary,
  SeededOrderRecord,
  SortOption,
  SouvenirCategory,
  SouvenirProduct,
} from '../types/store';

export const FREE_SHIPPING_THRESHOLD = 120;
export const STANDARD_SHIPPING_FEE = 15;
export const GIFT_WRAP_FEE = 8;
export const MIN_PRICE_SLIDER = 50;
export const MAX_PRICE_SLIDER = 220;
export const MAX_COMPARE_ITEMS = 3;

export const PRICE_PRESET_OPTIONS: Array<{
  id: Exclude<PriceRangePreset, 'custom'>;
  label: string;
  sliderValue: number;
}> = [
  { id: 'all', label: 'All Prices', sliderValue: MAX_PRICE_SLIDER },
  { id: 'under-100', label: 'Under $100', sliderValue: 100 },
  { id: '100-150', label: '$100–$150', sliderValue: 150 },
  { id: 'over-150', label: 'Over $150', sliderValue: MAX_PRICE_SLIDER },
];

export const CURRENCY_CODES: CurrencyCode[] = ['USD', 'EUR', 'GBP'];

export const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { code: CurrencyCode; symbol: string; rateFromUsd: number; label: string }
> = {
  USD: { code: 'USD', symbol: '$', rateFromUsd: 1, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rateFromUsd: 0.92, label: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', rateFromUsd: 0.79, label: 'GBP (£)' },
};

export function convertFromUsd(usdAmount: number, currency: CurrencyCode = 'USD'): number {
  const rate = CURRENCY_CONFIG[currency]?.rateFromUsd ?? 1;
  if (rate === 1) return Math.round(usdAmount * 100) / 100;
  return Math.round(usdAmount * rate * 100) / 100;
}

export function formatPrice(usdAmount: number, currency: CurrencyCode = 'USD'): string {
  const converted = convertFromUsd(usdAmount, currency);
  const fractionDigits = Number.isInteger(converted) ? 0 : 2;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: 2,
  }).format(converted);
}

export function formatUsd(amount: number): string {
  return formatPrice(amount, 'USD');
}

export function getUnitPrice(product: SouvenirProduct, variantId: string): number {
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  return product.price + (variant ? variant.priceDelta : 0);
}

export function matchesPriceFilter(
  price: number,
  pricePreset: PriceRangePreset = 'all',
  maxPrice?: number,
): boolean {
  switch (pricePreset) {
    case 'under-100':
      return price < 100;
    case '100-150':
      return price >= 100 && price <= 150;
    case 'over-150':
      return price > 150;
    case 'custom':
      return typeof maxPrice === 'number' ? price <= maxPrice : true;
    case 'all':
    default:
      return true;
  }
}

export function filterAndSortProducts(
  products: SouvenirProduct[],
  options: {
    category: SouvenirCategory;
    query: string;
    sortBy: SortOption;
    onlyWishlisted?: boolean;
    wishlistIds?: string[];
    pricePreset?: PriceRangePreset;
    maxPrice?: number;
  },
): SouvenirProduct[] {
  const normalizedQuery = options.query.trim().toLowerCase();
  const wishlistSet = options.onlyWishlisted ? new Set(options.wishlistIds ?? []) : null;
  const pricePreset = options.pricePreset ?? 'all';

  const filtered = products.filter((product) => {
    if (wishlistSet && !wishlistSet.has(product.id)) return false;

    if (!matchesPriceFilter(product.price, pricePreset, options.maxPrice)) return false;

    const matchesCategory = options.category === 'All' || product.category === options.category;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const searchable = [
      product.name,
      product.chineseTitle,
      product.category,
      product.origin,
      product.workshop,
      product.shortDescription,
      product.materials,
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });

  const sorted = [...filtered];
  if (options.sortBy === 'price-asc') {
    sorted.sort((a, b) => a.price - b.price || a.featuredRank - b.featuredRank);
  } else if (options.sortBy === 'price-desc') {
    sorted.sort((a, b) => b.price - a.price || a.featuredRank - b.featuredRank);
  } else {
    sorted.sort((a, b) => a.featuredRank - b.featuredRank);
  }

  return sorted;
}

export function toggleWishlistItem(wishlistIds: string[], productId: string): string[] {
  if (wishlistIds.includes(productId)) {
    return wishlistIds.filter((id) => id !== productId);
  }
  return [...wishlistIds, productId];
}

export function getWishlistProducts(
  products: SouvenirProduct[],
  wishlistIds: string[],
): SouvenirProduct[] {
  const result: SouvenirProduct[] = [];
  for (const id of wishlistIds) {
    const product = products.find((p) => p.id === id);
    if (product) {
      result.push(product);
    }
  }
  return result;
}

export function upsertCartItem(
  items: CartItem[],
  productId: string,
  variantId: string,
  quantityToAdd = 1,
): CartItem[] {
  const safeQty = Math.max(1, Math.floor(quantityToAdd));
  const existingIndex = items.findIndex(
    (item) => item.productId === productId && item.variantId === variantId,
  );

  if (existingIndex === -1) {
    return [...items, { productId, variantId, quantity: safeQty }];
  }

  return items.map((item, idx) =>
    idx === existingIndex ? { ...item, quantity: item.quantity + safeQty } : item,
  );
}

export function updateCartItemQuantity(
  items: CartItem[],
  productId: string,
  variantId: string,
  nextQuantity: number,
): CartItem[] {
  if (nextQuantity <= 0) {
    return removeCartItem(items, productId, variantId);
  }
  const safeQty = Math.floor(nextQuantity);
  return items.map((item) =>
    item.productId === productId && item.variantId === variantId
      ? { ...item, quantity: safeQty }
      : item,
  );
}

export function removeCartItem(
  items: CartItem[],
  productId: string,
  variantId: string,
): CartItem[] {
  return items.filter(
    (item) => !(item.productId === productId && item.variantId === variantId),
  );
}

export function calculateCartTotals(
  items: CartItem[],
  products: SouvenirProduct[],
  giftWrapSelected: boolean,
): CartTotals {
  let subtotal = 0;
  let itemCount = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;
    const unitPrice = getUnitPrice(product, item.variantId);
    subtotal += unitPrice * item.quantity;
    itemCount += item.quantity;
  }

  const giftWrapFee = itemCount > 0 && giftWrapSelected ? GIFT_WRAP_FEE : 0;
  const shippingFee =
    itemCount === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const remainingForFreeShipping =
    itemCount === 0 ? FREE_SHIPPING_THRESHOLD : Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return {
    itemCount,
    subtotal,
    giftWrapFee,
    shippingFee,
    total: subtotal + giftWrapFee + shippingFee,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    remainingForFreeShipping,
  };
}

export function buildConfirmedOrderItems(
  items: CartItem[],
  products: SouvenirProduct[],
): ConfirmedOrderItem[] {
  const result: ConfirmedOrderItem[] = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;
    const variant =
      product.variants.find((v) => v.id === item.variantId) ?? product.variants[0];
    const unitPrice = getUnitPrice(product, item.variantId);
    result.push({
      productId: product.id,
      name: product.name,
      variantLabel: variant ? variant.label : 'Standard Edition',
      unitPrice,
      quantity: item.quantity,
      lineTotal: unitPrice * item.quantity,
    });
  }
  return result;
}

export function validateCheckoutForm(values: CheckoutFormValues): {
  isValid: boolean;
  errors: CheckoutErrors;
} {
  const errors: CheckoutErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = 'Please enter the recipient full name.';
  }

  const emailTrimmed = values.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
    errors.email = 'Please enter a valid email address for receipt delivery.';
  }

  const phoneDigits = values.phone.replace(/[^\d]/g, '');
  if (phoneDigits.length < 7) {
    errors.phone = 'Please provide a contact phone number (at least 7 digits).';
  }

  if (values.address.trim().length < 5) {
    errors.address = 'Please enter a complete street address.';
  }

  if (values.city.trim().length < 2) {
    errors.city = 'Please enter a city or municipality.';
  }

  if (values.postalCode.trim().length < 3) {
    errors.postalCode = 'Please enter a valid postal or ZIP code.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateOrderNumber(seedTimestamp = Date.now()): string {
  const suffix = String(seedTimestamp % 10000).padStart(4, '0');
  return `YS-${suffix}`;
}

export function getNextSlideIndex(currentIndex: number, totalSlides: number): number {
  if (totalSlides <= 0) return 0;
  return (currentIndex + 1) % totalSlides;
}

export function getPrevSlideIndex(currentIndex: number, totalSlides: number): number {
  if (totalSlides <= 0) return 0;
  return (currentIndex - 1 + totalSlides) % totalSlides;
}

export function getReviewSummary(reviews: ProductReview[] = []): ReviewSummary {
  if (reviews.length === 0) {
    return { count: 0, averageRating: 0 };
  }

  const total = reviews.reduce((sum, review) => {
    const clamped = Math.min(5, Math.max(1, review.rating));
    return sum + clamped;
  }, 0);

  return {
    count: reviews.length,
    averageRating: Math.round((total / reviews.length) * 10) / 10,
  };
}

const COMPLEMENTARY_CATEGORY: Record<
  Exclude<SouvenirCategory, 'All'>,
  Exclude<SouvenirCategory, 'All'>
> = {
  Porcelain: 'Tea Ware',
  'Tea Ware': 'Porcelain',
  'Lacquer & Jade': 'Silk & Paper',
  'Silk & Paper': 'Lacquer & Jade',
};

export function getRelatedProducts(
  currentProduct: SouvenirProduct,
  allProducts: SouvenirProduct[],
  limit = 3,
): SouvenirProduct[] {
  const candidates = allProducts.filter((p) => p.id !== currentProduct.id);
  const complementary = COMPLEMENTARY_CATEGORY[currentProduct.category];

  const ranked = [...candidates].sort((a, b) => {
    const scoreA =
      a.category === currentProduct.category
        ? 0
        : a.category === complementary
          ? 1
          : 2;
    const scoreB =
      b.category === currentProduct.category
        ? 0
        : b.category === complementary
          ? 1
          : 2;
    return scoreA - scoreB || a.featuredRank - b.featuredRank;
  });

  return ranked.slice(0, Math.max(0, limit));
}

export function toggleCompareItem(
  compareIds: string[],
  productId: string,
  maxItems = MAX_COMPARE_ITEMS,
): { nextIds: string[]; limitReached: boolean } {
  if (compareIds.includes(productId)) {
    return {
      nextIds: compareIds.filter((id) => id !== productId),
      limitReached: false,
    };
  }
  if (compareIds.length >= maxItems) {
    return {
      nextIds: compareIds,
      limitReached: true,
    };
  }
  return {
    nextIds: [...compareIds, productId],
    limitReached: false,
  };
}

export function getCompareProducts(
  products: SouvenirProduct[],
  compareIds: string[],
): SouvenirProduct[] {
  const result: SouvenirProduct[] = [];
  for (const id of compareIds) {
    const product = products.find((p) => p.id === id);
    if (product) {
      result.push(product);
    }
  }
  return result;
}

export function normalizeOrderNumber(input: string): string {
  return input.trim().replace(/^#+/, '').toUpperCase();
}

export function buildOrderMilestones(
  status: OrderFulfillmentStatus,
  order: ConfirmedOrder,
): OrderTrackingMilestone[] {
  const placedDate = new Date(order.createdAtIso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const stepIndex: Record<OrderFulfillmentStatus, number> = {
    Processing: 0,
    Shipped: 1,
    Delivered: 2,
  };
  const currentIdx = stepIndex[status];

  return [
    {
      step: 'Processing',
      title: 'Processing & Provenance Crating',
      detail: 'Regional atelier inspection, bilingual certificate signing, and double-walled export packing.',
      timestamp: placedDate,
      completed: currentIdx >= 0,
      active: currentIdx === 0,
    },
    {
      step: 'Shipped',
      title: 'Shipped via Tracked Air Express',
      detail: 'Cleared Shanghai export customs and handed to international courier.',
      timestamp: currentIdx >= 1 ? 'In Transit / Dispatched' : 'Pending dispatch',
      completed: currentIdx >= 1,
      active: currentIdx === 1,
    },
    {
      step: 'Delivered',
      title: 'Delivered to Recipient',
      detail: `Final delivery to ${order.customer.city}, ${order.customer.postalCode}.`,
      timestamp: currentIdx >= 2 ? 'Signed & Received' : 'Awaiting arrival',
      completed: currentIdx >= 2,
      active: currentIdx === 2,
    },
  ];
}

export function computeEstimatedDeliveryDate(
  createdAtIso: string,
  status: OrderFulfillmentStatus,
): string {
  const createdMs = Date.parse(createdAtIso);
  const baseDate = Number.isFinite(createdMs) ? new Date(createdMs) : new Date();
  const offsetDays = status === 'Processing' ? 5 : status === 'Shipped' ? 9 : 7;
  const estimate = new Date(baseDate.getTime() + offsetDays * 86_400_000);
  return estimate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function lookupOrderStatus(
  orderNumberInput: string,
  placedOrders: ConfirmedOrder[],
  sampleOrders: SeededOrderRecord[],
): { isValidFormat: boolean; error?: string; result: OrderStatusResult | null } {
  const normalized = normalizeOrderNumber(orderNumberInput);
  if (!normalized) {
    return {
      isValidFormat: false,
      error: 'Please enter an order number (e.g. YS-2088).',
      result: null,
    };
  }

  const userOrder = placedOrders.find(
    (order) => normalizeOrderNumber(order.orderNumber) === normalized,
  );
  if (userOrder) {
    const status: OrderFulfillmentStatus = 'Processing';
    return {
      isValidFormat: true,
      result: {
        order: userOrder,
        status,
        carrierNote: 'Order received — artisan workshop is preparing protective export crating.',
        estimatedDelivery: 'Estimated dispatch within 48 hours',
        estimatedDeliveryDate: computeEstimatedDeliveryDate(userOrder.createdAtIso, status),
        milestones: buildOrderMilestones(status, userOrder),
      },
    };
  }

  const seeded = sampleOrders.find(
    (entry) => normalizeOrderNumber(entry.order.orderNumber) === normalized,
  );
  if (seeded) {
    return {
      isValidFormat: true,
      result: {
        order: seeded.order,
        status: seeded.status,
        carrierNote: seeded.carrierNote,
        estimatedDelivery: seeded.estimatedDelivery,
        estimatedDeliveryDate: computeEstimatedDeliveryDate(
          seeded.order.createdAtIso,
          seeded.status,
        ),
        milestones: buildOrderMilestones(seeded.status, seeded.order),
      },
    };
  }

  return {
    isValidFormat: true,
    error: `No order found matching "${normalized}". Verify your receipt number or try YS-2088.`,
    result: null,
  };
}

export type OrderTrackingErrorCode =
  | 'empty-email'
  | 'invalid-email'
  | 'empty-order'
  | 'not-found';

export function trackOrderWithEmail(
  emailInput: string,
  orderNumberInput: string,
  placedOrders: ConfirmedOrder[],
  sampleOrders: SeededOrderRecord[],
): {
  isValidInput: boolean;
  errorCode?: OrderTrackingErrorCode;
  error?: string;
  result: OrderStatusResult | null;
} {
  const normalizedEmail = emailInput.trim().toLowerCase();
  if (!normalizedEmail) {
    return {
      isValidInput: false,
      errorCode: 'empty-email',
      error: 'Please enter the email address used for your order.',
      result: null,
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return {
      isValidInput: false,
      errorCode: 'invalid-email',
      error: 'Please enter a valid email address (e.g. claire.vance@example.com).',
      result: null,
    };
  }

  const normalizedOrder = normalizeOrderNumber(orderNumberInput);
  if (!normalizedOrder) {
    return {
      isValidInput: false,
      errorCode: 'empty-order',
      error: 'Please enter your order number (e.g. YS-2088).',
      result: null,
    };
  }

  const userOrder = placedOrders.find(
    (order) =>
      normalizeOrderNumber(order.orderNumber) === normalizedOrder &&
      order.customer.email.trim().toLowerCase() === normalizedEmail,
  );
  if (userOrder) {
    const status: OrderFulfillmentStatus = 'Processing';
    return {
      isValidInput: true,
      result: {
        order: userOrder,
        status,
        carrierNote: 'Order received — artisan workshop is preparing protective export crating.',
        estimatedDelivery: 'Estimated dispatch within 48 hours',
        estimatedDeliveryDate: computeEstimatedDeliveryDate(userOrder.createdAtIso, status),
        milestones: buildOrderMilestones(status, userOrder),
      },
    };
  }

  const seeded = sampleOrders.find(
    (entry) =>
      normalizeOrderNumber(entry.order.orderNumber) === normalizedOrder &&
      entry.order.customer.email.trim().toLowerCase() === normalizedEmail,
  );
  if (seeded) {
    return {
      isValidInput: true,
      result: {
        order: seeded.order,
        status: seeded.status,
        carrierNote: seeded.carrierNote,
        estimatedDelivery: seeded.estimatedDelivery,
        estimatedDeliveryDate: computeEstimatedDeliveryDate(
          seeded.order.createdAtIso,
          seeded.status,
        ),
        milestones: buildOrderMilestones(seeded.status, seeded.order),
      },
    };
  }

  return {
    isValidInput: true,
    errorCode: 'not-found',
    error: `No shipment found for "${normalizedOrder}" matching "${normalizedEmail}". Please check both fields and try again.`,
    result: null,
  };
}

export const SCROLL_TO_TOP_THRESHOLD = 500;

export function shouldShowScrollToTop(
  scrollY: number,
  threshold = SCROLL_TO_TOP_THRESHOLD,
): boolean {
  return Number.isFinite(scrollY) && scrollY > threshold;
}

export function validateNewsletterEmail(email: string): {
  isValid: boolean;
  normalizedEmail: string;
  error?: string;
  errorCode?: 'empty' | 'invalid';
} {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return {
      isValid: false,
      normalizedEmail,
      error: 'Please enter your email address.',
      errorCode: 'empty',
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return {
      isValid: false,
      normalizedEmail,
      error: 'Please enter a valid email address (e.g. collector@example.com).',
      errorCode: 'invalid',
    };
  }
  return {
    isValid: true,
    normalizedEmail,
  };
}

export function getRestockAlert(
  alerts: RestockAlertSubscription[],
  productId: string,
): RestockAlertSubscription | undefined {
  return alerts.find((entry) => entry.productId === productId);
}

export function upsertRestockAlert(
  alerts: RestockAlertSubscription[],
  product: Pick<SouvenirProduct, 'id' | 'name'>,
  rawEmail: string,
  subscribedAtIso = new Date().toISOString(),
): {
  isValid: boolean;
  error?: string;
  nextAlerts: RestockAlertSubscription[];
  subscription?: RestockAlertSubscription;
} {
  const emailCheck = validateNewsletterEmail(rawEmail);
  if (!emailCheck.isValid) {
    return {
      isValid: false,
      error: emailCheck.error,
      nextAlerts: alerts,
    };
  }

  const subscription: RestockAlertSubscription = {
    productId: product.id,
    productName: product.name,
    email: emailCheck.normalizedEmail,
    subscribedAtIso,
  };

  const filtered = alerts.filter((entry) => entry.productId !== product.id);
  return {
    isValid: true,
    nextAlerts: [subscription, ...filtered],
    subscription,
  };
}

export const ANNOUNCEMENT_AUTO_CLOSE_MS = 5000;
export const ANNOUNCEMENT_ROTATE_MS = 1600;

export const ANNOUNCEMENT_MESSAGES = [
  'Complimentary tracked express shipping on orders of $120+ · Custom export crating included',
  '2026 Jingdezhen & Longquan Kiln Batch · Signed bilingual provenance card with every piece',
  'Paulownia keepsake gift wrapping available in your shopping bag for $8',
] as const;

export function getNextAnnouncementIndex(
  currentIndex: number,
  totalMessages: number,
): number {
  if (totalMessages <= 0) return 0;
  return (currentIndex + 1) % totalMessages;
}

export interface ProductSharePayload {
  title: string;
  text: string;
  url: string;
}

export function buildProductSharePayload(
  product: Pick<SouvenirProduct, 'slug' | 'name' | 'shortDescription'>,
  displayTitle: string,
  baseUrl: string,
): ProductSharePayload {
  const title = `${displayTitle} · Yunshan Curio`;
  let url = `?product=${encodeURIComponent(product.slug)}`;
  try {
    const parsed = new URL(baseUrl);
    parsed.searchParams.set('product', product.slug);
    parsed.hash = '';
    url = parsed.toString();
  } catch {
    // Keep relative query string when baseUrl is unavailable or invalid
  }
  return {
    title,
    text: product.shortDescription,
    url,
  };
}

export function resolveProductFromUrl(
  products: SouvenirProduct[],
  search: string,
): SouvenirProduct | null {
  try {
    const params = new URLSearchParams(search);
    const key = params.get('product')?.trim();
    if (!key) return null;
    return products.find((p) => p.slug === key || p.id === key) ?? null;
  } catch {
    return null;
  }
}

export function computeZoomOriginPercent(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
): { x: number; y: number } {
  if (
    !Number.isFinite(clientX) ||
    !Number.isFinite(clientY) ||
    !Number.isFinite(rect.width) ||
    !Number.isFinite(rect.height) ||
    rect.width <= 0 ||
    rect.height <= 0
  ) {
    return { x: 50, y: 50 };
  }
  const rawX = ((clientX - rect.left) / rect.width) * 100;
  const rawY = ((clientY - rect.top) / rect.height) * 100;
  const x = Math.round(Math.min(100, Math.max(0, rawX)) * 10) / 10;
  const y = Math.round(Math.min(100, Math.max(0, rawY)) * 10) / 10;
  return { x, y };
}

export function getCategoryThumbnail(
  category: SouvenirCategory,
  thumbnails: Record<SouvenirCategory, string>,
): string {
  return thumbnails[category] || thumbnails.All || '';
}

export const LOYALTY_POINTS_PER_USD = 2;

export function calculateLoyaltyPoints(cartTotalUsd: number): number {
  if (!Number.isFinite(cartTotalUsd) || cartTotalUsd <= 0) {
    return 0;
  }
  return Math.round(cartTotalUsd * LOYALTY_POINTS_PER_USD);
}

export function formatLoyaltyPoints(points: number): string {
  const safe = Number.isFinite(points) && points > 0 ? Math.round(points) : 0;
  return new Intl.NumberFormat('en-US').format(safe);
}

export interface BreadcrumbItem {
  id: 'home' | 'catalog' | 'category' | 'saved';
  label: string;
  href: string;
  isCurrent: boolean;
}

export function buildBreadcrumbItems(options: {
  selectedCategory: SouvenirCategory;
  onlyWishlisted?: boolean;
  labels: {
    home: string;
    catalog: string;
    categoryLabel: string;
    saved: string;
  };
}): BreadcrumbItem[] {
  const isSaved = Boolean(options.onlyWishlisted);
  const hasSpecificCategory = !isSaved && options.selectedCategory !== 'All';

  const items: BreadcrumbItem[] = [
    {
      id: 'home',
      label: options.labels.home,
      href: '#top',
      isCurrent: false,
    },
    {
      id: 'catalog',
      label: options.labels.catalog,
      href: '#collection',
      isCurrent: !isSaved && !hasSpecificCategory,
    },
  ];

  if (isSaved) {
    items.push({
      id: 'saved',
      label: options.labels.saved,
      href: '#collection',
      isCurrent: true,
    });
  } else if (hasSpecificCategory) {
    items.push({
      id: 'category',
      label: options.labels.categoryLabel,
      href: '#collection',
      isCurrent: true,
    });
  }

  return items;
}

export const SEASONAL_PROMO_DURATION_MS = ((2 * 24 + 14) * 60 + 36) * 60 * 1000;

export interface TimeRemainingParts {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function getTimeRemainingParts(
  targetTimestampMs: number,
  nowMs: number = Date.now(),
): TimeRemainingParts {
  if (!Number.isFinite(targetTimestampMs) || !Number.isFinite(nowMs)) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const diffMs = Math.max(0, targetTimestampMs - nowMs);
  const totalSeconds = Math.floor(diffMs / 1000);

  if (totalSeconds <= 0) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalMs: diffMs,
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
}

export function formatTimeRemaining(
  remainingMs: number,
  labels?: {
    days?: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
    expired?: string;
  },
): string {
  const safeMs = Number.isFinite(remainingMs) && remainingMs > 0 ? remainingMs : 0;
  if (safeMs <= 0 && labels?.expired) {
    return labels.expired;
  }

  const totalSeconds = Math.floor(safeMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (val: number) => String(val).padStart(2, '0');
  const dUnit = labels?.days ?? 'd';
  const hUnit = labels?.hours ?? 'h';
  const mUnit = labels?.minutes ?? 'm';
  const sUnit = labels?.seconds ?? 's';

  return `${pad(days)}${dUnit} : ${pad(hours)}${hUnit} : ${pad(minutes)}${mUnit} : ${pad(seconds)}${sUnit}`;
}

export interface ReviewFormInput {
  author: string;
  location: string;
  rating: number;
  comment: string;
}

export interface ReviewFormErrors {
  author?: string;
  rating?: string;
  comment?: string;
}

export function validateReviewInput(input: ReviewFormInput): {
  isValid: boolean;
  errors: ReviewFormErrors;
} {
  const errors: ReviewFormErrors = {};

  if (input.author.trim().length < 2) {
    errors.author = 'Please enter your name (at least 2 characters).';
  }
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    errors.rating = 'Please select a star rating from 1 to 5.';
  }
  if (input.comment.trim().length < 5) {
    errors.comment = 'Please write at least 5 characters of feedback.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function createProductReview(
  input: ReviewFormInput & { variantLabel: string; fallbackLocation?: string },
  nowDate: Date = new Date(),
): ProductReview {
  const safeRating = Math.min(5, Math.max(1, Math.round(input.rating)));
  const formattedDate = nowDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const location = input.location.trim() || input.fallbackLocation || 'Collector';

  return {
    id: `rev-user-${nowDate.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    author: input.author.trim(),
    location,
    rating: safeRating,
    date: formattedDate,
    variantLabel: input.variantLabel || 'Standard Edition',
    comment: input.comment.trim(),
  };
}

export function mergeProductReviews(
  seededReviews: ProductReview[] = [],
  userReviews: ProductReview[] = [],
): ProductReview[] {
  return [...userReviews, ...seededReviews];
}

export const MAX_RECENTLY_VIEWED = 6;
export const DEFAULT_RECOMMENDATIONS_LIMIT = 3;

export function recordRecentlyViewed(
  recentIds: string[],
  productId: string,
  maxItems = MAX_RECENTLY_VIEWED,
): string[] {
  if (!productId) return recentIds;
  const deduped = recentIds.filter((id) => id !== productId);
  return [productId, ...deduped].slice(0, Math.max(1, maxItems));
}

function scoreProductSimilarity(
  candidate: SouvenirProduct,
  seeds: SouvenirProduct[],
): number {
  let score = 0;

  for (const seed of seeds) {
    if (candidate.category === seed.category) {
      score += 4;
    } else if (COMPLEMENTARY_CATEGORY[seed.category] === candidate.category) {
      score += 2;
    }

    const priceDiff = Math.abs(candidate.price - seed.price);
    if (priceDiff <= 45) {
      score += 1.5;
    } else if (priceDiff <= 80) {
      score += 0.5;
    }

    const seedOriginRoot = seed.origin.split(/[&,]/)[0]?.trim().toLowerCase();
    if (seedOriginRoot && candidate.origin.toLowerCase().includes(seedOriginRoot)) {
      score += 1;
    }
  }

  if (candidate.inStock) {
    score += 0.25;
  }

  return score;
}

export interface RecommendationResult {
  products: SouvenirProduct[];
  basedOn: 'activity' | 'featured';
  seedProducts: SouvenirProduct[];
}

export function getRecommendedProducts(
  allProducts: SouvenirProduct[],
  options: {
    wishlistIds?: string[];
    recentIds?: string[];
    limit?: number;
  },
): RecommendationResult {
  const limit = Math.max(0, options.limit ?? DEFAULT_RECOMMENDATIONS_LIMIT);
  if (limit === 0 || allProducts.length === 0) {
    return { products: [], basedOn: 'featured', seedProducts: [] };
  }

  const productById = new Map(allProducts.map((p) => [p.id, p]));
  const combinedSeedIds: string[] = [];
  const seenSeedIds = new Set<string>();

  for (const id of [...(options.recentIds ?? []), ...(options.wishlistIds ?? [])]) {
    if (!seenSeedIds.has(id) && productById.has(id)) {
      seenSeedIds.add(id);
      combinedSeedIds.push(id);
    }
  }

  const seedProducts = combinedSeedIds
    .map((id) => productById.get(id))
    .filter((p): p is SouvenirProduct => Boolean(p));

  if (seedProducts.length === 0) {
    const featured = [...allProducts]
      .sort((a, b) => {
        if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
        return a.featuredRank - b.featuredRank;
      })
      .slice(0, limit);

    return {
      products: featured,
      basedOn: 'featured',
      seedProducts: [],
    };
  }

  const candidates = allProducts.filter((p) => !seenSeedIds.has(p.id));
  const pool = candidates.length > 0 ? candidates : allProducts;

  const ranked = [...pool].sort((a, b) => {
    const scoreDiff =
      scoreProductSimilarity(b, seedProducts) - scoreProductSimilarity(a, seedProducts);
    if (scoreDiff !== 0) return scoreDiff;
    return a.featuredRank - b.featuredRank;
  });

  const picked = ranked.slice(0, limit);
  if (picked.length < limit && candidates.length > 0) {
    const pickedIds = new Set(picked.map((p) => p.id));
    for (const seed of seedProducts) {
      if (picked.length >= limit) break;
      if (!pickedIds.has(seed.id)) {
        picked.push(seed);
        pickedIds.add(seed.id);
      }
    }
  }

  return {
    products: picked,
    basedOn: 'activity',
    seedProducts,
  };
}

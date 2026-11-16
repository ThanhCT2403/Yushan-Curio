import test from 'node:test';
import assert from 'node:assert/strict';
import type { ConfirmedOrder, SouvenirProduct } from '../types/store';
import { SAMPLE_CONFIRMED_ORDERS } from '../data/sampleOrders';
import {
  ANNOUNCEMENT_AUTO_CLOSE_MS,
  ANNOUNCEMENT_MESSAGES,
  CURRENCY_CODES,
  SEASONAL_PROMO_DURATION_MS,
  buildBreadcrumbItems,
  buildProductSharePayload,
  calculateCartTotals,
  computeEstimatedDeliveryDate,
  computeZoomOriginPercent,
  convertFromUsd,
  createProductReview,
  filterAndSortProducts,
  formatPrice,
  formatTimeRemaining,
  getTimeRemainingParts,
  mergeProductReviews,
  trackOrderWithEmail,
  validateReviewInput,
  getCategoryThumbnail,
  getCompareProducts,
  getNextAnnouncementIndex,
  getNextSlideIndex,
  getPrevSlideIndex,
  getRecommendedProducts,
  getRelatedProducts,
  getRestockAlert,
  getReviewSummary,
  getWishlistProducts,
  recordRecentlyViewed,
  LOYALTY_POINTS_PER_USD,
  SCROLL_TO_TOP_THRESHOLD,
  calculateLoyaltyPoints,
  formatLoyaltyPoints,
  lookupOrderStatus,
  normalizeOrderNumber,
  removeCartItem,
  resolveProductFromUrl,
  shouldShowScrollToTop,
  toggleCompareItem,
  toggleWishlistItem,
  updateCartItemQuantity,
  upsertCartItem,
  upsertRestockAlert,
  validateCheckoutForm,
  validateNewsletterEmail,
} from './storeLogic';
import {
  LANGUAGE_CODES,
  getCategoryLabel,
  getOrderStatusLabel,
  getPricePresetLabel,
  getProductBadgeLabel,
  getProductSecondaryTitle,
  getProductTitle,
  getSortOptionLabel,
  getTranslations,
} from './i18n';

const MOCK_PRODUCTS: SouvenirProduct[] = [
  {
    id: 'porcelain-jar',
    slug: 'porcelain-jar',
    name: 'Qinghua Tea Caddy',
    chineseTitle: '青花茶叶罐',
    category: 'Porcelain',
    origin: 'Jingdezhen',
    workshop: 'Old Kiln',
    price: 100,
    image: '/mock/porcelain.jpg',
    imageAlt: 'Porcelain tea caddy',
    shortDescription: 'Hand-painted cobalt jar for loose tea.',
    story: 'Kiln story',
    materials: 'Kaolin porcelain',
    dimensions: '14 cm',
    inStock: true,
    featuredRank: 1,
    variants: [
      { id: 'std', label: 'Standard', note: 'Pouch', priceDelta: 0 },
      { id: 'box', label: 'Wood Box', note: 'Boxed', priceDelta: 25 },
    ],
  },
  {
    id: 'celadon-pot',
    slug: 'celadon-pot',
    name: 'Longquan Celadon Set',
    chineseTitle: '龙泉青瓷',
    category: 'Tea Ware',
    origin: 'Longquan',
    workshop: 'Dayao',
    price: 140,
    image: '/mock/celadon.jpg',
    imageAlt: 'Celadon teapot',
    shortDescription: 'Jade-green teapot and two cups.',
    story: 'Kiln story',
    materials: 'Stoneware clay',
    dimensions: '180 ml',
    inStock: true,
    featuredRank: 2,
    variants: [{ id: 'set-3', label: '3-Piece', note: '2 cups', priceDelta: 0 }],
  },
  {
    id: 'silk-scarf',
    slug: 'silk-scarf',
    name: 'Suzhou Silk Scarf',
    chineseTitle: '苏绣围巾',
    category: 'Silk & Paper',
    origin: 'Suzhou',
    workshop: 'Gusu Silk',
    price: 90,
    image: '/mock/silk.jpg',
    imageAlt: 'Silk scarf',
    shortDescription: 'Mulberry silk with crane embroidery.',
    story: 'Loom story',
    materials: 'Mulberry silk',
    dimensions: '180 x 52 cm',
    inStock: true,
    featuredRank: 3,
    variants: [{ id: 'ivory', label: 'Ivory', note: 'Boxed', priceDelta: 0 }],
  },
];

test('filterAndSortProducts filters by category and search query', () => {
  const porcelainOnly = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'Porcelain',
    query: '',
    sortBy: 'featured',
  });
  assert.equal(porcelainOnly.length, 1);
  assert.equal(porcelainOnly[0].id, 'porcelain-jar');

  const queryMatch = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'All',
    query: 'suzhou',
    sortBy: 'featured',
  });
  assert.equal(queryMatch.length, 1);
  assert.equal(queryMatch[0].id, 'silk-scarf');
});

test('filterAndSortProducts sorts ascending and descending by price', () => {
  const asc = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'All',
    query: '',
    sortBy: 'price-asc',
  });
  assert.deepEqual(
    asc.map((p) => p.id),
    ['silk-scarf', 'porcelain-jar', 'celadon-pot'],
  );

  const desc = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'All',
    query: '',
    sortBy: 'price-desc',
  });
  assert.deepEqual(
    desc.map((p) => p.id),
    ['celadon-pot', 'porcelain-jar', 'silk-scarf'],
  );
});

test('cart item operations upsert, update, and remove correctly', () => {
  let cart = upsertCartItem([], 'porcelain-jar', 'std', 1);
  cart = upsertCartItem(cart, 'porcelain-jar', 'std', 2);
  cart = upsertCartItem(cart, 'porcelain-jar', 'box', 1);

  assert.equal(cart.length, 2);
  assert.equal(cart[0].quantity, 3);
  assert.equal(cart[1].quantity, 1);

  cart = updateCartItemQuantity(cart, 'porcelain-jar', 'std', 1);
  assert.equal(cart[0].quantity, 1);

  cart = updateCartItemQuantity(cart, 'porcelain-jar', 'std', 0);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].variantId, 'box');

  cart = removeCartItem(cart, 'porcelain-jar', 'box');
  assert.equal(cart.length, 0);
});

test('calculateCartTotals applies shipping threshold and gift wrap fee accurately', () => {
  const underThreshold = calculateCartTotals(
    [{ productId: 'silk-scarf', variantId: 'ivory', quantity: 1 }],
    MOCK_PRODUCTS,
    false,
  );
  assert.equal(underThreshold.subtotal, 90);
  assert.equal(underThreshold.shippingFee, 15);
  assert.equal(underThreshold.remainingForFreeShipping, 30);
  assert.equal(underThreshold.total, 105);

  const overThresholdWithWrap = calculateCartTotals(
    [{ productId: 'porcelain-jar', variantId: 'box', quantity: 1 }],
    MOCK_PRODUCTS,
    true,
  );
  assert.equal(overThresholdWithWrap.subtotal, 125);
  assert.equal(overThresholdWithWrap.shippingFee, 0);
  assert.equal(overThresholdWithWrap.giftWrapFee, 8);
  assert.equal(overThresholdWithWrap.remainingForFreeShipping, 0);
  assert.equal(overThresholdWithWrap.total, 133);

  const emptyCart = calculateCartTotals([], MOCK_PRODUCTS, true);
  assert.equal(emptyCart.total, 0);
  assert.equal(emptyCart.giftWrapFee, 0);
});

test('validateCheckoutForm rejects empty fields and accepts valid input', () => {
  const invalid = validateCheckoutForm({
    fullName: '',
    email: 'not-an-email',
    phone: '123',
    address: '12',
    city: '',
    postalCode: '',
    giftMessage: '',
    paymentMethod: 'card',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.address);
  assert.ok(invalid.errors.city);
  assert.ok(invalid.errors.postalCode);

  const valid = validateCheckoutForm({
    fullName: 'Lin Wei',
    email: 'lin.wei@example.com',
    phone: '+1 415 555 0198',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    postalCode: '94107',
    giftMessage: 'Happy Anniversary',
    paymentMethod: 'cod',
  });
  assert.equal(valid.isValid, true);
  assert.deepEqual(valid.errors, {});
});

test('carousel helpers wrap cleanly forward and backward across slides', () => {
  assert.equal(getNextSlideIndex(0, 4), 1);
  assert.equal(getNextSlideIndex(3, 4), 0);
  assert.equal(getPrevSlideIndex(0, 4), 3);
  assert.equal(getPrevSlideIndex(2, 4), 1);
  assert.equal(getNextSlideIndex(0, 0), 0);
  assert.equal(getPrevSlideIndex(0, 0), 0);
});

test('wishlist helpers toggle items, resolve saved products, and filter catalog', () => {
  let wishlist = toggleWishlistItem([], 'porcelain-jar');
  wishlist = toggleWishlistItem(wishlist, 'silk-scarf');
  assert.deepEqual(wishlist, ['porcelain-jar', 'silk-scarf']);

  // Toggling existing item removes it
  wishlist = toggleWishlistItem(wishlist, 'porcelain-jar');
  assert.deepEqual(wishlist, ['silk-scarf']);

  const savedProducts = getWishlistProducts(MOCK_PRODUCTS, wishlist);
  assert.equal(savedProducts.length, 1);
  assert.equal(savedProducts[0].id, 'silk-scarf');

  const filteredWishlistOnly = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'All',
    query: '',
    sortBy: 'featured',
    onlyWishlisted: true,
    wishlistIds: wishlist,
  });
  assert.equal(filteredWishlistOnly.length, 1);
  assert.equal(filteredWishlistOnly[0].id, 'silk-scarf');
});

test('getReviewSummary computes count and rounded average rating accurately', () => {
  assert.deepEqual(getReviewSummary([]), { count: 0, averageRating: 0 });

  const summary = getReviewSummary([
    {
      id: 'r1',
      author: 'Hannah Lim',
      location: 'Singapore',
      rating: 5,
      date: 'October 2026',
      variantLabel: 'Standard',
      comment: 'Lovely cobalt brushwork.',
    },
    {
      id: 'r2',
      author: 'Mark Ellis',
      location: 'Toronto, Canada',
      rating: 4,
      date: 'September 2026',
      variantLabel: 'Wood Box',
      comment: 'Well packed and authentic.',
    },
    {
      id: 'r3',
      author: 'Sora Sato',
      location: 'Tokyo, Japan',
      rating: 5,
      date: 'September 2026',
      variantLabel: 'Standard',
      comment: 'Fits airtight for oolong.',
    },
  ]);

  assert.equal(summary.count, 3);
  assert.equal(summary.averageRating, 4.7);
});

test('filterAndSortProducts filters by price presets and custom maxPrice slider', () => {
  const under100 = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'All',
    query: '',
    sortBy: 'featured',
    pricePreset: 'under-100',
  });
  assert.deepEqual(
    under100.map((p) => p.id),
    ['silk-scarf'],
  );

  const midRange = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'All',
    query: '',
    sortBy: 'featured',
    pricePreset: '100-150',
  });
  assert.deepEqual(
    midRange.map((p) => p.id),
    ['porcelain-jar', 'celadon-pot'],
  );

  const over150 = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'All',
    query: '',
    sortBy: 'featured',
    pricePreset: 'over-150',
  });
  assert.equal(over150.length, 0);

  const customSlider = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'All',
    query: '',
    sortBy: 'featured',
    pricePreset: 'custom',
    maxPrice: 100,
  });
  assert.deepEqual(
    customSlider.map((p) => p.id),
    ['porcelain-jar', 'silk-scarf'],
  );
});

test('getRelatedProducts returns up to 3 distinct items prioritizing same category', () => {
  const extendedCatalog: SouvenirProduct[] = [
    ...MOCK_PRODUCTS,
    {
      ...MOCK_PRODUCTS[0],
      id: 'porcelain-vase',
      slug: 'porcelain-vase',
      name: 'Qinghua Vase',
      featuredRank: 4,
    },
    {
      ...MOCK_PRODUCTS[2],
      id: 'lacquer-box',
      slug: 'lacquer-box',
      name: 'Cinnabar Box',
      category: 'Lacquer & Jade',
      featuredRank: 5,
    },
  ];

  const related = getRelatedProducts(extendedCatalog[0], extendedCatalog, 3);
  assert.equal(related.length, 3);
  assert.equal(related.some((p) => p.id === extendedCatalog[0].id), false);
  // Same-category item ('porcelain-vase') must appear first, followed by complementary Tea Ware
  assert.equal(related[0].id, 'porcelain-vase');
  assert.equal(related[1].id, 'celadon-pot');
});

test('toggleCompareItem enforces max 3 cap and getCompareProducts resolves in order', () => {
  let ids: string[] = [];

  let res = toggleCompareItem(ids, 'porcelain-jar');
  ids = res.nextIds;
  assert.equal(res.limitReached, false);

  res = toggleCompareItem(ids, 'celadon-pot');
  ids = res.nextIds;
  res = toggleCompareItem(ids, 'silk-scarf');
  ids = res.nextIds;
  assert.deepEqual(ids, ['porcelain-jar', 'celadon-pot', 'silk-scarf']);

  // Attempting to add a 4th item must hit the cap without mutating
  const fourth = toggleCompareItem(ids, 'extra-item');
  assert.equal(fourth.limitReached, true);
  assert.deepEqual(fourth.nextIds, ['porcelain-jar', 'celadon-pot', 'silk-scarf']);

  // Toggling an existing item removes it
  const removed = toggleCompareItem(ids, 'celadon-pot');
  assert.equal(removed.limitReached, false);
  assert.deepEqual(removed.nextIds, ['porcelain-jar', 'silk-scarf']);

  const resolved = getCompareProducts(MOCK_PRODUCTS, removed.nextIds);
  assert.deepEqual(
    resolved.map((p) => p.id),
    ['porcelain-jar', 'silk-scarf'],
  );
});

test('lookupOrderStatus resolves placed ConfirmedOrder, seeded statuses, and validates empty/unknown input', () => {
  assert.equal(normalizeOrderNumber(' #ys-2088 '), 'YS-2088');

  const emptyRes = lookupOrderStatus('   ', [], SAMPLE_CONFIRMED_ORDERS);
  assert.equal(emptyRes.isValidFormat, false);
  assert.equal(emptyRes.result, null);
  assert.ok(emptyRes.error);

  const unknownRes = lookupOrderStatus('YS-9999', [], SAMPLE_CONFIRMED_ORDERS);
  assert.equal(unknownRes.isValidFormat, true);
  assert.equal(unknownRes.result, null);
  assert.ok(unknownRes.error);

  // Lookup seeded Shipped order (with # and lowercase)
  const shipped = lookupOrderStatus('#ys-2088', [], SAMPLE_CONFIRMED_ORDERS);
  assert.equal(shipped.result?.status, 'Shipped');
  assert.equal(shipped.result?.milestones[0].completed, true);
  assert.equal(shipped.result?.milestones[1].active, true);
  assert.equal(shipped.result?.milestones[2].completed, false);

  // Lookup freshly placed ConfirmedOrder
  const customPlaced: ConfirmedOrder = {
    ...SAMPLE_CONFIRMED_ORDERS[0].order,
    orderNumber: 'YS-7742',
  };
  const liveOrder = lookupOrderStatus('YS-7742', [customPlaced], SAMPLE_CONFIRMED_ORDERS);
  assert.equal(liveOrder.result?.status, 'Processing');
  assert.equal(liveOrder.result?.order.orderNumber, 'YS-7742');
  assert.equal(liveOrder.result?.milestones[0].active, true);
});

test('shouldShowScrollToTop triggers strictly when scrollY exceeds 500px threshold', () => {
  assert.equal(SCROLL_TO_TOP_THRESHOLD, 500);
  assert.equal(shouldShowScrollToTop(0), false);
  assert.equal(shouldShowScrollToTop(500), false);
  assert.equal(shouldShowScrollToTop(501), true);
  assert.equal(shouldShowScrollToTop(1400), true);
  assert.equal(shouldShowScrollToTop(-10), false);
  assert.equal(shouldShowScrollToTop(Number.NaN), false);
});

test('validateNewsletterEmail validates empty, malformed, and valid email addresses', () => {
  const empty = validateNewsletterEmail('   ');
  assert.equal(empty.isValid, false);
  assert.ok(empty.error);

  const malformed = validateNewsletterEmail('collector@invalid');
  assert.equal(malformed.isValid, false);
  assert.ok(malformed.error);

  const valid = validateNewsletterEmail('  Lin.Wei@Example.com  ');
  assert.equal(valid.isValid, true);
  assert.equal(valid.normalizedEmail, 'lin.wei@example.com');
  assert.equal(valid.error, undefined);
});

test('upsertRestockAlert validates email and stores/updates per-product restock alerts', () => {
  const invalid = upsertRestockAlert([], { id: 'hetian-jade-medallion', name: 'Hetian Jade' }, 'bad');
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.error);
  assert.equal(invalid.nextAlerts.length, 0);

  const first = upsertRestockAlert(
    [],
    { id: 'hetian-jade-medallion', name: 'Hetian Jade' },
    '  Collector@Example.com ',
    '2026-11-15T15:00:00.000Z',
  );
  assert.equal(first.isValid, true);
  assert.equal(first.nextAlerts.length, 1);
  assert.equal(getRestockAlert(first.nextAlerts, 'hetian-jade-medallion')?.email, 'collector@example.com');

  const updated = upsertRestockAlert(
    first.nextAlerts,
    { id: 'hetian-jade-medallion', name: 'Hetian Jade' },
    'updated@example.com',
    '2026-11-15T15:05:00.000Z',
  );
  assert.equal(updated.nextAlerts.length, 1);
  assert.equal(getRestockAlert(updated.nextAlerts, 'hetian-jade-medallion')?.email, 'updated@example.com');
});

test('announcement helpers enforce 5s auto-close timing and wrap message index cleanly', () => {
  assert.equal(ANNOUNCEMENT_AUTO_CLOSE_MS, 5000);
  assert.ok(ANNOUNCEMENT_MESSAGES.length >= 2);
  assert.equal(getNextAnnouncementIndex(0, 3), 1);
  assert.equal(getNextAnnouncementIndex(2, 3), 0);
  assert.equal(getNextAnnouncementIndex(0, 0), 0);
});

test('currency utilities convert USD base prices and format USD, EUR, and GBP accurately', () => {
  assert.deepEqual(CURRENCY_CODES, ['USD', 'EUR', 'GBP']);
  assert.equal(convertFromUsd(100, 'USD'), 100);
  assert.equal(convertFromUsd(100, 'EUR'), 92);
  assert.equal(convertFromUsd(100, 'GBP'), 79);
  assert.equal(convertFromUsd(118, 'EUR'), 108.56);

  assert.equal(formatPrice(118, 'USD'), '$118');
  assert.equal(formatPrice(118, 'EUR'), '€108.56');
  assert.equal(formatPrice(100, 'GBP'), '£79');
  assert.equal(formatPrice(118, 'GBP'), '£93.22');
});

test('i18n utilities resolve English and Simplified Chinese labels consistently', () => {
  assert.deepEqual(LANGUAGE_CODES, ['en', 'zh-CN']);

  const en = getTranslations('en');
  const zh = getTranslations('zh-CN');

  assert.equal(en.header.collection, 'Collection');
  assert.equal(zh.header.collection, '精选藏品');
  assert.equal(en.catalog.addToBag, 'Add to Bag');
  assert.equal(zh.catalog.addToBag, '加入购物袋');

  assert.equal(getCategoryLabel('Porcelain', 'en'), 'Porcelain');
  assert.equal(getCategoryLabel('Porcelain', 'zh-CN'), '瓷器');
  assert.equal(getOrderStatusLabel('Shipped', 'zh-CN'), '已发货');
  assert.equal(getSortOptionLabel('price-asc', 'zh-CN'), '价格：从低到高');

  const sampleProduct = {
    name: 'Qinghua Mountain Tea Caddy',
    chineseTitle: '景德镇青花山水茶叶罐',
  };
  assert.equal(getProductTitle(sampleProduct, 'en'), 'Qinghua Mountain Tea Caddy');
  assert.equal(getProductTitle(sampleProduct, 'zh-CN'), '景德镇青花山水茶叶罐');
  assert.equal(getProductSecondaryTitle(sampleProduct, 'zh-CN'), 'Qinghua Mountain Tea Caddy');

  assert.equal(
    getPricePresetLabel('under-100', formatPrice, 'USD', 'zh-CN'),
    '低于 $100',
  );
  assert.equal(
    getPricePresetLabel('over-150', formatPrice, 'EUR', 'zh-CN'),
    '高于 €138',
  );
});

test('share payload builder and deep-link resolver build and match product URLs', () => {
  const payload = buildProductSharePayload(
    {
      slug: 'jingdezhen-mountain-caddy',
      name: 'Qinghua Mountain Tea Caddy',
      shortDescription: 'Hand-thrown kaolin clay jar.',
    },
    'Qinghua Mountain Tea Caddy',
    'http://localhost:3000/?foo=bar#collection',
  );

  assert.equal(payload.title, 'Qinghua Mountain Tea Caddy · Yunshan Curio');
  assert.equal(payload.text, 'Hand-thrown kaolin clay jar.');
  assert.equal(payload.url, 'http://localhost:3000/?foo=bar&product=jingdezhen-mountain-caddy');

  const fallbackPayload = buildProductSharePayload(
    {
      slug: 'beijing-cinnabar-box',
      name: 'Carved Cinnabar Peony Box',
      shortDescription: 'Carved lacquerware.',
    },
    '北京雕漆牡丹圆盒',
    'not-a-valid-url',
  );
  assert.equal(fallbackPayload.url, '?product=beijing-cinnabar-box');
  assert.equal(fallbackPayload.title, '北京雕漆牡丹圆盒 · Yunshan Curio');

  assert.equal(
    resolveProductFromUrl(MOCK_PRODUCTS, '?product=porcelain-jar')?.id,
    'porcelain-jar',
  );
  assert.equal(
    resolveProductFromUrl(MOCK_PRODUCTS, '?product=unknown-piece'),
    null,
  );
  assert.equal(resolveProductFromUrl(MOCK_PRODUCTS, ''), null);
});

test('computeZoomOriginPercent maps pointer positions cleanly and clamps bounds', () => {
  const rect = { left: 100, top: 200, width: 400, height: 300 };

  assert.deepEqual(computeZoomOriginPercent(300, 350, rect), { x: 50, y: 50 });
  assert.deepEqual(computeZoomOriginPercent(100, 200, rect), { x: 0, y: 0 });
  assert.deepEqual(computeZoomOriginPercent(500, 500, rect), { x: 100, y: 100 });
  assert.deepEqual(computeZoomOriginPercent(50, 900, rect), { x: 0, y: 100 });
  assert.deepEqual(
    computeZoomOriginPercent(200, 250, { left: 0, top: 0, width: 0, height: 300 }),
    { x: 50, y: 50 },
  );
});

test('catalog badges and Quick Buy / PDP Zoom & Share strings localize cleanly', () => {
  assert.equal(getProductBadgeLabel('best-seller', 'en'), 'Best Seller');
  assert.equal(getProductBadgeLabel('new-arrival', 'en'), 'New Arrival');
  assert.equal(getProductBadgeLabel('low-stock', 'en'), 'Low Stock');

  assert.equal(getProductBadgeLabel('best-seller', 'zh-CN'), '热销臻品');
  assert.equal(getProductBadgeLabel('new-arrival', 'zh-CN'), '窑口上新');
  assert.equal(getProductBadgeLabel('low-stock', 'zh-CN'), '库存紧张');

  assert.equal(getTranslations('en').catalog.quickBuy, 'Quick Buy');
  assert.equal(getTranslations('zh-CN').catalog.quickBuy, '快速加购');
  assert.equal(getTranslations('en').pdp.share, 'Share');
  assert.equal(getTranslations('zh-CN').pdp.share, '分享');
  assert.equal(getTranslations('en').pdp.hoverToZoom, 'Hover to zoom');
  assert.equal(getTranslations('zh-CN').pdp.hoverToZoom, '悬停放大细节');
});

test('getCategoryThumbnail resolves distinct thumbnails for every category with safe fallback', () => {
  const thumbMap = {
    All: '/assets/all.jpg',
    Porcelain: '/assets/porcelain.jpg',
    'Tea Ware': '/assets/teaware.jpg',
    'Lacquer & Jade': '/assets/lacquer.jpg',
    'Silk & Paper': '/assets/silk.jpg',
  };

  assert.equal(getCategoryThumbnail('All', thumbMap), '/assets/all.jpg');
  assert.equal(getCategoryThumbnail('Porcelain', thumbMap), '/assets/porcelain.jpg');
  assert.equal(getCategoryThumbnail('Tea Ware', thumbMap), '/assets/teaware.jpg');
  assert.equal(getCategoryThumbnail('Lacquer & Jade', thumbMap), '/assets/lacquer.jpg');
  assert.equal(getCategoryThumbnail('Silk & Paper', thumbMap), '/assets/silk.jpg');
  assert.equal(
    getCategoryThumbnail('Porcelain', { ...thumbMap, Porcelain: '' }),
    '/assets/all.jpg',
  );
});

test('Quick Look preview labels localize cleanly in English and Simplified Chinese', () => {
  const en = getTranslations('en');
  const zh = getTranslations('zh-CN');

  assert.equal(en.catalog.quickLook, 'Quick Look');
  assert.equal(zh.catalog.quickLook, '快速预览');
  assert.equal(en.quickLook.eyebrow, 'Quick Look');
  assert.equal(zh.quickLook.eyebrow, '快速预览');
  assert.equal(en.quickLook.viewFullDetails, 'Full Details');
  assert.equal(zh.quickLook.viewFullDetails, '完整详情');
});

test('loyalty points calculation, formatting, and checkout redemption copy behave accurately', () => {
  assert.equal(LOYALTY_POINTS_PER_USD, 2);
  assert.equal(calculateLoyaltyPoints(0), 0);
  assert.equal(calculateLoyaltyPoints(-15), 0);
  assert.equal(calculateLoyaltyPoints(Number.NaN), 0);
  assert.equal(calculateLoyaltyPoints(133), 266);
  assert.equal(calculateLoyaltyPoints(118.4), 237);

  assert.equal(formatLoyaltyPoints(0), '0');
  assert.equal(formatLoyaltyPoints(266), '266');
  assert.equal(formatLoyaltyPoints(1420), '1,420');

  const en = getTranslations('en');
  const zh = getTranslations('zh-CN');
  assert.match(en.header.loyaltyRedeemNote, /redeemed at checkout/i);
  assert.match(zh.header.loyaltyRedeemNote, /结账时/);
  assert.equal(en.cart.loyaltyRedeemNote, 'Redeemable at checkout');
  assert.equal(zh.cart.loyaltyRedeemNote, '结账时可直接抵扣使用');
});

test('buildBreadcrumbItems constructs dynamic category and saved paths cleanly', () => {
  const en = getTranslations('en');
  const zh = getTranslations('zh-CN');

  const allPath = buildBreadcrumbItems({
    selectedCategory: 'All',
    onlyWishlisted: false,
    labels: {
      home: en.breadcrumb.home,
      catalog: en.breadcrumb.catalog,
      categoryLabel: getCategoryLabel('All', 'en'),
      saved: en.breadcrumb.saved,
    },
  });
  assert.deepEqual(
    allPath.map((i) => ({ label: i.label, isCurrent: i.isCurrent })),
    [
      { label: 'Home', isCurrent: false },
      { label: 'Catalog', isCurrent: true },
    ],
  );

  const porcelainPath = buildBreadcrumbItems({
    selectedCategory: 'Porcelain',
    onlyWishlisted: false,
    labels: {
      home: en.breadcrumb.home,
      catalog: en.breadcrumb.catalog,
      categoryLabel: getCategoryLabel('Porcelain', 'en'),
      saved: en.breadcrumb.saved,
    },
  });
  assert.deepEqual(
    porcelainPath.map((i) => ({ label: i.label, isCurrent: i.isCurrent })),
    [
      { label: 'Home', isCurrent: false },
      { label: 'Catalog', isCurrent: false },
      { label: 'Porcelain', isCurrent: true },
    ],
  );

  const zhSavedPath = buildBreadcrumbItems({
    selectedCategory: 'Tea Ware',
    onlyWishlisted: true,
    labels: {
      home: zh.breadcrumb.home,
      catalog: zh.breadcrumb.catalog,
      categoryLabel: getCategoryLabel('Tea Ware', 'zh-CN'),
      saved: zh.breadcrumb.saved,
    },
  });
  assert.deepEqual(
    zhSavedPath.map((i) => ({ label: i.label, isCurrent: i.isCurrent })),
    [
      { label: '首页', isCurrent: false },
      { label: '典藏目录', isCurrent: false },
      { label: '已收藏', isCurrent: true },
    ],
  );
});

test('getTimeRemainingParts and formatTimeRemaining compute and format seasonal promo time left', () => {
  assert.ok(SEASONAL_PROMO_DURATION_MS > 2 * 86400 * 1000);

  const now = 1_700_000_000_000;
  const remaining = ((2 * 24 + 5) * 3600 + 9 * 60 + 4) * 1000;
  const parts = getTimeRemainingParts(now + remaining, now);

  assert.equal(parts.isExpired, false);
  assert.equal(parts.days, 2);
  assert.equal(parts.hours, 5);
  assert.equal(parts.minutes, 9);
  assert.equal(parts.seconds, 4);
  assert.equal(formatTimeRemaining(parts.totalMs), '02d : 05h : 09m : 04s');

  const zh = getTranslations('zh-CN').promo;
  assert.equal(
    formatTimeRemaining(parts.totalMs, {
      days: zh.days,
      hours: zh.hours,
      minutes: zh.minutes,
      seconds: zh.seconds,
      expired: zh.expired,
    }),
    '02天 : 05时 : 09分 : 04秒',
  );

  const expired = getTimeRemainingParts(now - 5000, now);
  assert.equal(expired.isExpired, true);
  assert.equal(expired.totalMs, 0);
  assert.equal(formatTimeRemaining(0), '00d : 00h : 00m : 00s');
  assert.equal(formatTimeRemaining(-100, { expired: 'Ended' }), 'Ended');
});

test('validateReviewInput, createProductReview, and mergeProductReviews update ratings cleanly', () => {
  const invalid = validateReviewInput({
    author: ' ',
    location: '',
    rating: 0,
    comment: 'ok',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.author);
  assert.ok(invalid.errors.rating);
  assert.ok(invalid.errors.comment);

  const valid = validateReviewInput({
    author: '  Mei Lin ',
    location: 'Kyoto',
    rating: 3,
    comment: 'Lovely cobalt brush detail and well packed.',
  });
  assert.equal(valid.isValid, true);
  assert.deepEqual(valid.errors, {});

  const userReview = createProductReview(
    {
      author: '  Mei Lin ',
      location: ' ',
      rating: 3,
      comment: '  Lovely cobalt brush detail and well packed.  ',
      variantLabel: 'Gift Box Edition',
    },
    new Date('2026-11-16T12:00:00.000Z'),
  );
  assert.equal(userReview.author, 'Mei Lin');
  assert.equal(userReview.location, 'Collector');
  assert.equal(userReview.rating, 3);
  assert.equal(userReview.variantLabel, 'Gift Box Edition');

  const seeded = [
    {
      id: 'rev-1',
      author: 'Elena',
      location: 'London',
      rating: 5,
      date: 'Oct 10, 2026',
      variantLabel: 'Standard',
      comment: 'Superb finish.',
    },
  ];
  const merged = mergeProductReviews(seeded, [userReview]);
  assert.equal(merged.length, 2);
  assert.equal(merged[0].id, userReview.id);

  const summary = getReviewSummary(merged);
  assert.equal(summary.count, 2);
  assert.equal(summary.averageRating, 4);
});

test('newsletter signup localization and email error codes cover empty, invalid, and valid states', () => {
  const empty = validateNewsletterEmail('  ');
  assert.equal(empty.isValid, false);
  assert.equal(empty.errorCode, 'empty');

  const invalid = validateNewsletterEmail('not-an-email');
  assert.equal(invalid.isValid, false);
  assert.equal(invalid.errorCode, 'invalid');

  const valid = validateNewsletterEmail('  Artisan.Collector@Example.com ');
  assert.equal(valid.isValid, true);
  assert.equal(valid.normalizedEmail, 'artisan.collector@example.com');
  assert.equal(valid.errorCode, undefined);

  const en = getTranslations('en').newsletter;
  const zh = getTranslations('zh-CN').newsletter;

  assert.match(en.heading, /Seasonal Updates & Artisan Stories/i);
  assert.match(en.description, /seasonal/i);
  assert.match(en.description, /artisan/i);
  assert.ok(en.seasonalHighlight.length > 0);
  assert.ok(en.storiesHighlight.length > 0);
  assert.ok(en.emptyEmailError.length > 0);
  assert.ok(en.invalidEmailError.length > 0);

  assert.ok(zh.heading.length > 0);
  assert.ok(zh.subscribeButton.length > 0);
  assert.ok(zh.confirmationNote.length > 0);
  assert.ok(zh.emptyEmailError.length > 0);
  assert.ok(zh.invalidEmailError.length > 0);
});

test('recordRecentlyViewed and getRecommendedProducts dynamically recommend similar crafts', () => {
  let recent: string[] = [];
  recent = recordRecentlyViewed(recent, 'p1', 3);
  recent = recordRecentlyViewed(recent, 'p2', 3);
  recent = recordRecentlyViewed(recent, 'p3', 3);
  recent = recordRecentlyViewed(recent, 'p1', 3); // move p1 to front without duplicating
  assert.deepEqual(recent, ['p1', 'p3', 'p2']);

  recent = recordRecentlyViewed(recent, 'p4', 3); // cap at 3
  assert.deepEqual(recent, ['p4', 'p1', 'p3']);

  const catalog: SouvenirProduct[] = [
    ...MOCK_PRODUCTS,
    {
      ...MOCK_PRODUCTS[0],
      id: 'porcelain-bowl',
      slug: 'porcelain-bowl',
      name: 'Qinghua Gaiwan',
      origin: 'Jingdezhen',
      price: 112,
      featuredRank: 4,
    },
    {
      ...MOCK_PRODUCTS[2],
      id: 'lacquer-box',
      slug: 'lacquer-box',
      name: 'Carved Cinnabar Box',
      category: 'Lacquer & Jade',
      origin: 'Beijing',
      price: 185,
      featuredRank: 5,
    },
    {
      ...MOCK_PRODUCTS[2],
      id: 'jade-medallion',
      slug: 'jade-medallion',
      name: 'Hetian Jade Medallion',
      category: 'Lacquer & Jade',
      origin: 'Hotan',
      price: 210,
      inStock: false,
      featuredRank: 6,
    },
  ];

  // Cold start: returns featured in-stock recommendations
  const coldStart = getRecommendedProducts(catalog, {
    wishlistIds: [],
    recentIds: [],
    limit: 3,
  });
  assert.equal(coldStart.basedOn, 'featured');
  assert.equal(coldStart.products.length, 3);
  assert.deepEqual(
    coldStart.products.map((p) => p.id),
    ['porcelain-jar', 'celadon-pot', 'silk-scarf'],
  );

  // When user wishlists Carved Cinnabar Box (Lacquer & Jade, $185),
  // recommends Hetian Jade Medallion (same category) + Silk & Paper complementary items, excluding seed
  const fromWishlist = getRecommendedProducts(catalog, {
    wishlistIds: ['lacquer-box'],
    recentIds: [],
    limit: 3,
  });
  assert.equal(fromWishlist.basedOn, 'activity');
  assert.equal(fromWishlist.products.some((p) => p.id === 'lacquer-box'), false);
  assert.equal(fromWishlist.products[0].id, 'jade-medallion');

  // When user views Qinghua Tea Caddy (Porcelain, $100),
  // recommends Qinghua Gaiwan (same category & Jingdezhen origin) and Celadon Pot (complementary Tea Ware)
  const fromRecent = getRecommendedProducts(catalog, {
    wishlistIds: [],
    recentIds: ['porcelain-jar'],
    limit: 3,
  });
  assert.equal(fromRecent.basedOn, 'activity');
  assert.equal(fromRecent.products.some((p) => p.id === 'porcelain-jar'), false);
  assert.equal(fromRecent.products[0].id, 'porcelain-bowl');
  assert.equal(fromRecent.products[1].id, 'celadon-pot');

  // Localized headings exist in EN and zh-CN
  assert.equal(getTranslations('en').recommendations.heading, 'Recommended for You');
  assert.equal(getTranslations('zh-CN').recommendations.heading, '为您臻选推荐');
});

test('trackOrderWithEmail validates email & order number and computes estimated delivery dates', () => {
  const emptyEmail = trackOrderWithEmail('', 'YS-2088', [], SAMPLE_CONFIRMED_ORDERS);
  assert.equal(emptyEmail.isValidInput, false);
  assert.equal(emptyEmail.errorCode, 'empty-email');
  assert.equal(emptyEmail.result, null);

  const invalidEmail = trackOrderWithEmail('bad-email', 'YS-2088', [], SAMPLE_CONFIRMED_ORDERS);
  assert.equal(invalidEmail.isValidInput, false);
  assert.equal(invalidEmail.errorCode, 'invalid-email');

  const emptyOrder = trackOrderWithEmail('claire.vance@example.com', '  ', [], SAMPLE_CONFIRMED_ORDERS);
  assert.equal(emptyOrder.isValidInput, false);
  assert.equal(emptyOrder.errorCode, 'empty-order');

  // Mismatched email for existing order must NOT leak order details
  const mismatched = trackOrderWithEmail(
    'wrong.person@example.com',
    'YS-2088',
    [],
    SAMPLE_CONFIRMED_ORDERS,
  );
  assert.equal(mismatched.isValidInput, true);
  assert.equal(mismatched.errorCode, 'not-found');
  assert.equal(mismatched.result, null);

  // Matching seeded order (case-insensitive email & # order prefix)
  const shipped = trackOrderWithEmail(
    '  CLAIRE.VANCE@example.com ',
    '#ys-2088',
    [],
    SAMPLE_CONFIRMED_ORDERS,
  );
  assert.equal(shipped.isValidInput, true);
  assert.equal(shipped.result?.status, 'Shipped');
  assert.equal(shipped.result?.estimatedDeliveryDate, 'Nov 17, 2026');

  // Newly placed order matches its checkout email & computes Processing delivery estimate
  const placed: ConfirmedOrder = {
    ...SAMPLE_CONFIRMED_ORDERS[0].order,
    orderNumber: 'YS-8891',
    createdAtIso: '2026-11-16T12:00:00.000Z',
    customer: {
      ...SAMPLE_CONFIRMED_ORDERS[0].order.customer,
      email: 'collector@example.com',
    },
  };
  const liveTrack = trackOrderWithEmail(
    'collector@example.com',
    'YS-8891',
    [placed],
    SAMPLE_CONFIRMED_ORDERS,
  );
  assert.equal(liveTrack.isValidInput, true);
  assert.equal(liveTrack.result?.status, 'Processing');
  assert.equal(
    liveTrack.result?.estimatedDeliveryDate,
    computeEstimatedDeliveryDate('2026-11-16T12:00:00.000Z', 'Processing'),
  );
  assert.equal(liveTrack.result?.estimatedDeliveryDate, 'Nov 21, 2026');

  assert.equal(getTranslations('en').orderTracking.title, 'Order Tracking');
  assert.equal(getTranslations('zh-CN').orderTracking.title, '订单物流追踪');
});



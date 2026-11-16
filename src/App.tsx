import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, Check, X } from 'lucide-react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { BreadcrumbBar } from './components/BreadcrumbBar';
import { CatalogSection } from './components/CatalogSection';
import { CartDrawer } from './components/CartDrawer';
import { CompareModal } from './components/CompareModal';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { NewsletterSignup } from './components/NewsletterSignup';
import { NotifyMeModal } from './components/NotifyMeModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuickLookModal } from './components/QuickLookModal';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CATEGORIES, HERO_SLIDES, SOUVENIR_PRODUCTS } from './data/souvenirs';
import type {
  CartItem,
  CheckoutFormValues,
  ConfirmedOrder,
  CurrencyCode,
  LanguageCode,
  PriceRangePreset,
  ProductReview,
  RestockAlertSubscription,
  SortOption,
  SouvenirCategory,
  SouvenirProduct,
} from './types/store';
import { LANGUAGE_CODES, getProductTitle, getTranslations } from './utils/i18n';
import {
  CURRENCY_CODES,
  MAX_COMPARE_ITEMS,
  MAX_PRICE_SLIDER,
  PRICE_PRESET_OPTIONS,
  buildConfirmedOrderItems,
  calculateCartTotals,
  filterAndSortProducts,
  generateOrderNumber,
  getCompareProducts,
  getRestockAlert,
  getWishlistProducts,
  recordRecentlyViewed,
  removeCartItem,
  resolveProductFromUrl,
  toggleCompareItem,
  toggleWishlistItem,
  updateCartItemQuantity,
  upsertCartItem,
  upsertRestockAlert,
} from './utils/storeLogic';

const CART_STORAGE_KEY = 'yunshan_curio_cart_v1';
const GIFT_WRAP_STORAGE_KEY = 'yunshan_curio_giftwrap_v1';
const WISHLIST_STORAGE_KEY = 'yunshan_curio_wishlist_v1';
const PLACED_ORDERS_STORAGE_KEY = 'yunshan_curio_orders_v1';
const RESTOCK_ALERTS_STORAGE_KEY = 'yunshan_curio_restock_alerts_v1';
const CURRENCY_STORAGE_KEY = 'yunshan_curio_currency_v1';
const LANGUAGE_STORAGE_KEY = 'yunshan_curio_lang_v1';
const USER_REVIEWS_STORAGE_KEY = 'yunshan_curio_reviews_v1';
const RECENTLY_VIEWED_STORAGE_KEY = 'yunshan_curio_recent_v1';

function loadInitialRecentlyViewed(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const validIds = new Set(SOUVENIR_PRODUCTS.map((p) => p.id));
    return parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id));
  } catch {
    return [];
  }
}

function loadInitialUserReviews(): Record<string, ProductReview[]> {
  try {
    const raw = window.localStorage.getItem(USER_REVIEWS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, ProductReview[]>;
  } catch {
    return {};
  }
}

function loadInitialLanguage(): LanguageCode {
  try {
    const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (raw && (LANGUAGE_CODES as string[]).includes(raw)) {
      return raw as LanguageCode;
    }
    return 'en';
  } catch {
    return 'en';
  }
}

function loadInitialCurrency(): CurrencyCode {
  try {
    const raw = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (raw && (CURRENCY_CODES as string[]).includes(raw)) {
      return raw as CurrencyCode;
    }
    return 'USD';
  } catch {
    return 'USD';
  }
}

function loadInitialCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        typeof item?.productId === 'string' &&
        typeof item?.variantId === 'string' &&
        typeof item?.quantity === 'number' &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

function loadInitialGiftWrap(): boolean {
  try {
    return window.localStorage.getItem(GIFT_WRAP_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function loadInitialWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const validIds = new Set(SOUVENIR_PRODUCTS.map((p) => p.id));
    return parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id));
  } catch {
    return [];
  }
}

function loadInitialPlacedOrders(): ConfirmedOrder[] {
  try {
    const raw = window.localStorage.getItem(PLACED_ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (order): order is ConfirmedOrder =>
        typeof order?.orderNumber === 'string' &&
        typeof order?.createdAtIso === 'string' &&
        typeof order?.customer?.fullName === 'string' &&
        Array.isArray(order?.items),
    );
  } catch {
    return [];
  }
}

function loadInitialRestockAlerts(): RestockAlertSubscription[] {
  try {
    const raw = window.localStorage.getItem(RESTOCK_ALERTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is RestockAlertSubscription =>
        typeof entry?.productId === 'string' &&
        typeof entry?.productName === 'string' &&
        typeof entry?.email === 'string' &&
        typeof entry?.subscribedAtIso === 'string',
    );
  } catch {
    return [];
  }
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<SouvenirCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [onlyWishlisted, setOnlyWishlisted] = useState(false);
  const [pricePreset, setPricePreset] = useState<PriceRangePreset>('all');
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE_SLIDER);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const [cartItems, setCartItems] = useState<CartItem[]>(loadInitialCart);
  const [giftWrap, setGiftWrap] = useState<boolean>(loadInitialGiftWrap);
  const [wishlistIds, setWishlistIds] = useState<string[]>(loadInitialWishlist);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<SouvenirProduct | null>(() =>
    resolveProductFromUrl(
      SOUVENIR_PRODUCTS,
      typeof window !== 'undefined' ? window.location.search : '',
    ),
  );
  const [quickLookProduct, setQuickLookProduct] = useState<SouvenirProduct | null>(null);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(true);
  const [lookupInitialOrder, setLookupInitialOrder] = useState('');
  const [placedOrders, setPlacedOrders] = useState<ConfirmedOrder[]>(loadInitialPlacedOrders);
  const [restockAlerts, setRestockAlerts] = useState<RestockAlertSubscription[]>(
    loadInitialRestockAlerts,
  );
  const [notifyProduct, setNotifyProduct] = useState<SouvenirProduct | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [bagNotice, setBagNotice] = useState<string | null>(null);
  const [compareNotice, setCompareNotice] = useState<string | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>(loadInitialCurrency);
  const [language, setLanguage] = useState<LanguageCode>(loadInitialLanguage);
  const [userReviewsByProduct, setUserReviewsByProduct] = useState<
    Record<string, ProductReview[]>
  >(loadInitialUserReviews);
  const [recentProductIds, setRecentProductIds] = useState<string[]>(loadInitialRecentlyViewed);

  const t = getTranslations(language);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage quota errors
    }
  }, [language]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    } catch {
      // Ignore storage quota errors
    }
  }, [currency]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(GIFT_WRAP_STORAGE_KEY, String(giftWrap));
    } catch {
      // Ignore storage quota errors
    }
  }, [giftWrap]);

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PLACED_ORDERS_STORAGE_KEY, JSON.stringify(placedOrders));
    } catch {
      // Ignore storage quota errors
    }
  }, [placedOrders]);

  useEffect(() => {
    try {
      window.localStorage.setItem(RESTOCK_ALERTS_STORAGE_KEY, JSON.stringify(restockAlerts));
    } catch {
      // Ignore storage quota errors
    }
  }, [restockAlerts]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        USER_REVIEWS_STORAGE_KEY,
        JSON.stringify(userReviewsByProduct),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [userReviewsByProduct]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        RECENTLY_VIEWED_STORAGE_KEY,
        JSON.stringify(recentProductIds),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [recentProductIds]);

  useEffect(() => {
    if (!selectedProduct) return;
    setRecentProductIds((prev) => recordRecentlyViewed(prev, selectedProduct.id));
  }, [selectedProduct]);

  useEffect(() => {
    if (!quickLookProduct) return;
    setRecentProductIds((prev) => recordRecentlyViewed(prev, quickLookProduct.id));
  }, [quickLookProduct]);

  useEffect(() => {
    if (!bagNotice) return;
    const timer = window.setTimeout(() => setBagNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [bagNotice]);

  useEffect(() => {
    if (!compareNotice) return;
    const timer = window.setTimeout(() => setCompareNotice(null), 2800);
    return () => window.clearTimeout(timer);
  }, [compareNotice]);

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(SOUVENIR_PRODUCTS, {
        category: selectedCategory,
        query: searchQuery,
        sortBy,
        onlyWishlisted,
        wishlistIds,
        pricePreset,
        maxPrice,
      }),
    [selectedCategory, searchQuery, sortBy, onlyWishlisted, wishlistIds, pricePreset, maxPrice],
  );

  const wishlistProducts = useMemo(
    () => getWishlistProducts(SOUVENIR_PRODUCTS, wishlistIds),
    [wishlistIds],
  );

  const compareProducts = useMemo(
    () => getCompareProducts(SOUVENIR_PRODUCTS, compareIds),
    [compareIds],
  );

  const totals = useMemo(
    () => calculateCartTotals(cartItems, SOUVENIR_PRODUCTS, giftWrap),
    [cartItems, giftWrap],
  );

  const handleAddToBag = (productId: string, variantId: string, quantity = 1) => {
    const product = SOUVENIR_PRODUCTS.find((p) => p.id === productId);
    if (!product || !product.inStock) return;
    setConfirmedOrder(null);
    setCartItems((prev) => upsertCartItem(prev, productId, variantId, quantity));
    setBagNotice(
      `${t.appNotices.addedToBagPrefix} ${getProductTitle(product, language)} ${t.appNotices.addedToBagSuffix}`,
    );
  };

  const handleQuickAdd = (product: SouvenirProduct) => {
    const defaultVariantId = product.variants[0]?.id ?? '';
    handleAddToBag(product.id, defaultVariantId, 1);
  };

  const handleUpdateQuantity = (
    productId: string,
    variantId: string,
    quantity: number,
  ) => {
    setCartItems((prev) => updateCartItemQuantity(prev, productId, variantId, quantity));
  };

  const handleRemoveItem = (productId: string, variantId: string) => {
    setCartItems((prev) => removeCartItem(prev, productId, variantId));
  };

  const handleSubmitOrder = (customer: CheckoutFormValues) => {
    const orderItems = buildConfirmedOrderItems(cartItems, SOUVENIR_PRODUCTS);
    const order: ConfirmedOrder = {
      orderNumber: generateOrderNumber(),
      createdAtIso: new Date().toISOString(),
      customer,
      items: orderItems,
      totals,
    };
    setConfirmedOrder(order);
    setPlacedOrders((prev) => [
      order,
      ...prev.filter((existing) => existing.orderNumber !== order.orderNumber),
    ]);
    setCartItems([]);
    setGiftWrap(false);
  };

  const handleOpenOrderLookup = (orderNumber = '') => {
    setLookupInitialOrder(orderNumber);
    setIsOrderLookupOpen(true);
  };

  const handleSelectPricePreset = (preset: Exclude<PriceRangePreset, 'custom'>) => {
    setPricePreset(preset);
    const matched = PRICE_PRESET_OPTIONS.find((opt) => opt.id === preset);
    if (matched) {
      setMaxPrice(matched.sliderValue);
    }
  };

  const handleMaxPriceChange = (value: number) => {
    setPricePreset('custom');
    setMaxPrice(value);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setOnlyWishlisted(false);
    setPricePreset('all');
    setMaxPrice(MAX_PRICE_SLIDER);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => toggleWishlistItem(prev, productId));
  };

  const handleToggleCompare = (productId: string) => {
    const result = toggleCompareItem(compareIds, productId, MAX_COMPARE_ITEMS);
    if (result.limitReached) {
      setCompareNotice(
        `${t.appNotices.compareLimitPrefix} ${MAX_COMPARE_ITEMS} ${t.appNotices.compareLimitSuffix}`,
      );
      return;
    }
    setCompareNotice(null);
    setCompareIds(result.nextIds);
  };

  const handleAddAllWishlistToBag = () => {
    const inStockWishlist = wishlistProducts.filter((p) => p.inStock);
    if (inStockWishlist.length === 0) return;
    setConfirmedOrder(null);
    setCartItems((prev) => {
      let next = prev;
      for (const product of inStockWishlist) {
        const defaultVariantId = product.variants[0]?.id ?? '';
        next = upsertCartItem(next, product.id, defaultVariantId, 1);
      }
      return next;
    });
    setIsWishlistOpen(false);
    setIsBagOpen(true);
  };

  const handleSubmitRestockAlert = (product: SouvenirProduct, email: string) => {
    const res = upsertRestockAlert(restockAlerts, product, email);
    if (res.isValid) {
      setRestockAlerts(res.nextAlerts);
    }
  };

  const handleAddReview = (productId: string, review: ProductReview) => {
    setUserReviewsByProduct((prev) => ({
      ...prev,
      [productId]: [review, ...(prev[productId] ?? [])],
    }));
  };

  const notifiedProductIds = useMemo(
    () => restockAlerts.map((entry) => entry.productId),
    [restockAlerts],
  );

  const handleExploreCategoryFromHero = (category: SouvenirCategory) => {
    setOnlyWishlisted(false);
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleInspectProductFromHero = (productId: string) => {
    const found = SOUVENIR_PRODUCTS.find((p) => p.id === productId);
    if (found) setSelectedProduct(found);
  };

  const activeSlide = HERO_SLIDES[activeSlideIndex] ?? HERO_SLIDES[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1917]">
      <AnnouncementBar
        isOpen={isAnnouncementOpen}
        language={language}
        onDismiss={() => setIsAnnouncementOpen(false)}
      />

      <Header
        bagCount={totals.itemCount}
        cartTotal={totals.total}
        wishlistCount={wishlistProducts.length}
        currency={currency}
        onChangeCurrency={setCurrency}
        language={language}
        onChangeLanguage={setLanguage}
        onOpenBag={() => setIsBagOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
        heroIsDark={false}
        hasAnnouncementBar={isAnnouncementOpen}
      />

      <div
        aria-hidden="true"
        className={`transition-[height] duration-300 ${isAnnouncementOpen ? 'h-[100px]' : 'h-16'}`}
      />

      <BreadcrumbBar
        selectedCategory={selectedCategory}
        onlyWishlisted={onlyWishlisted}
        resultCount={filteredProducts.length}
        language={language}
        hasAnnouncementBar={isAnnouncementOpen}
        onNavigateHome={handleResetFilters}
        onNavigateCatalog={() => {
          setOnlyWishlisted(false);
          setSelectedCategory('All');
        }}
      />

      <main className="flex-1">
        <Hero
          slides={HERO_SLIDES}
          activeIndex={activeSlideIndex}
          language={language}
          onChangeSlide={setActiveSlideIndex}
          onExploreCategory={handleExploreCategoryFromHero}
          onInspectProduct={handleInspectProductFromHero}
        />

        <CatalogSection
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          pricePreset={pricePreset}
          maxPrice={maxPrice}
          currency={currency}
          language={language}
          onSelectPricePreset={handleSelectPricePreset}
          onMaxPriceChange={handleMaxPriceChange}
          products={filteredProducts}
          allProducts={SOUVENIR_PRODUCTS}
          wishlistIds={wishlistIds}
          recentProductIds={recentProductIds}
          onlyWishlisted={onlyWishlisted}
          onToggleOnlyWishlisted={() => setOnlyWishlisted((prev) => !prev)}
          onToggleWishlist={handleToggleWishlist}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
          notifiedProductIds={notifiedProductIds}
          onRequestNotify={setNotifyProduct}
          onSelectProduct={setSelectedProduct}
          onQuickLook={setQuickLookProduct}
          onQuickAdd={handleQuickAdd}
          onResetFilters={handleResetFilters}
        />

        <CraftsmanshipSection language={language} />

        <NewsletterSignup language={language} />
      </main>

      <Footer
        language={language}
        onOpenOrderLookup={handleOpenOrderLookup}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
      />

      <OrderLookupModal
        isOpen={isOrderLookupOpen}
        initialOrderNumber={lookupInitialOrder}
        placedOrders={placedOrders}
        currency={currency}
        language={language}
        onClose={() => setIsOrderLookupOpen(false)}
      />

      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        placedOrders={placedOrders}
        currency={currency}
        language={language}
        onClose={() => setIsOrderTrackingOpen(false)}
      />

      <ProductDetailModal
        product={selectedProduct}
        allProducts={SOUVENIR_PRODUCTS}
        userReviews={selectedProduct ? (userReviewsByProduct[selectedProduct.id] ?? []) : []}
        currency={currency}
        language={language}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        isNotified={selectedProduct ? notifiedProductIds.includes(selectedProduct.id) : false}
        suppressEscape={Boolean(notifyProduct)}
        onToggleWishlist={handleToggleWishlist}
        onRequestNotify={setNotifyProduct}
        onSelectProduct={setSelectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToBag={handleAddToBag}
        onSubmitReview={handleAddReview}
      />

      <QuickLookModal
        product={quickLookProduct}
        currency={currency}
        language={language}
        isWishlisted={quickLookProduct ? wishlistIds.includes(quickLookProduct.id) : false}
        isNotified={quickLookProduct ? notifiedProductIds.includes(quickLookProduct.id) : false}
        suppressEscape={Boolean(notifyProduct)}
        onToggleWishlist={handleToggleWishlist}
        onRequestNotify={setNotifyProduct}
        onAddToBag={handleAddToBag}
        onOpenFullDetails={setSelectedProduct}
        onClose={() => setQuickLookProduct(null)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={wishlistProducts}
        currency={currency}
        language={language}
        notifiedProductIds={notifiedProductIds}
        suppressEscape={Boolean(notifyProduct)}
        onRemoveFromWishlist={handleToggleWishlist}
        onClearWishlist={() => setWishlistIds([])}
        onAddToBag={handleQuickAdd}
        onRequestNotify={setNotifyProduct}
        onAddAllToBag={handleAddAllWishlistToBag}
        onInspectProduct={setSelectedProduct}
      />

      <CartDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={cartItems}
        products={SOUVENIR_PRODUCTS}
        totals={totals}
        giftWrap={giftWrap}
        onToggleGiftWrap={setGiftWrap}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        confirmedOrder={confirmedOrder}
        currency={currency}
        language={language}
        onSubmitOrder={handleSubmitOrder}
        onClearConfirmedOrder={() => setConfirmedOrder(null)}
      />

      <CompareModal
        isOpen={isCompareOpen}
        products={compareProducts}
        currency={currency}
        language={language}
        notifiedProductIds={notifiedProductIds}
        suppressEscape={Boolean(notifyProduct)}
        onClose={() => setIsCompareOpen(false)}
        onRemoveProduct={handleToggleCompare}
        onClearAll={() => {
          setCompareIds([]);
          setIsCompareOpen(false);
        }}
        onInspectProduct={setSelectedProduct}
        onAddToBag={handleQuickAdd}
        onRequestNotify={setNotifyProduct}
      />

      <NotifyMeModal
        product={notifyProduct}
        currency={currency}
        language={language}
        existingAlert={notifyProduct ? getRestockAlert(restockAlerts, notifyProduct.id) : undefined}
        onClose={() => setNotifyProduct(null)}
        onSubmitAlert={handleSubmitRestockAlert}
      />

      {compareProducts.length > 0 && !isCompareOpen && (
        <aside
          aria-label={t.appNotices.compareTrayAria}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-4xl rounded-xl border border-[#2C2A27] bg-[#1A1917] text-[#FAF8F5] px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <ArrowLeftRight className="w-4 h-4 text-[#E6A39B] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-semibold tabular-nums whitespace-nowrap">
                {t.appNotices.compareLabel} ({compareProducts.length}/{MAX_COMPARE_ITEMS})
              </p>
              <p className="hidden sm:block text-[11px] text-[#FAF8F5]/75 truncate max-w-md">
                {compareProducts.map((p) => getProductTitle(p, language)).join(' · ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 mr-1">
              {compareProducts.map((product) => {
                const title = getProductTitle(product, language);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleToggleCompare(product.id)}
                    aria-label={`Remove ${product.name} from comparison tray`}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#2C2A27] text-[11px] text-[#FAF8F5]/90 hover:text-[#FAF8F5] cursor-pointer max-w-[130px]"
                  >
                    <span className="truncate">{title}</span>
                    <X className="w-3 h-3 shrink-0" aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setCompareIds([])}
              className="px-3 py-2 min-h-[38px] rounded-lg border border-[#FAF8F5]/20 text-xs font-medium text-[#FAF8F5]/90 hover:bg-[#FAF8F5]/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.appNotices.clear}
            </button>

            <button
              type="button"
              disabled={compareProducts.length < 2}
              onClick={() => setIsCompareOpen(true)}
              className="px-4 py-2 min-h-[38px] rounded-lg bg-[#A83226] text-[#FAF8F5] text-xs font-semibold hover:bg-[#8C271D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
            >
              {compareProducts.length < 2
                ? t.appNotices.selectOneMore
                : `${t.appNotices.compareNow} (${compareProducts.length})`}
            </button>
          </div>
        </aside>
      )}

      {(bagNotice || compareNotice) && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-5 z-40 rounded-lg border border-[#E4DFD6] bg-[#1A1917] text-[#FAF8F5] px-4 py-3 shadow-lg flex items-center gap-3 text-xs font-medium ${
            compareProducts.length > 0 && !isCompareOpen ? 'bottom-20' : 'bottom-5'
          }`}
        >
          <Check className="w-4 h-4 text-[#E6A39B] shrink-0" aria-hidden="true" />
          <span>{compareNotice ?? bagNotice}</span>
          {bagNotice && !compareNotice && (
            <button
              type="button"
              onClick={() => {
                setBagNotice(null);
                setIsBagOpen(true);
              }}
              className="underline underline-offset-2 text-[#FAF8F5] hover:text-[#E6A39B] cursor-pointer whitespace-nowrap"
            >
              {t.appNotices.viewBag}
            </button>
          )}
        </div>
      )}
      <ScrollToTopButton
        language={language}
        hasCompareTray={compareProducts.length > 0 && !isCompareOpen}
        hasToast={Boolean(bagNotice || compareNotice)}
        hiddenByOverlay={Boolean(
          selectedProduct ||
            quickLookProduct ||
            isBagOpen ||
            isWishlistOpen ||
            isCompareOpen ||
            isOrderLookupOpen ||
            isOrderTrackingOpen ||
            notifyProduct,
        )}
      />
    </div>
  );
}

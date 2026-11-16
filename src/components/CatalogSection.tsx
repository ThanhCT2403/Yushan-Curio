import { ArrowLeftRight, Bell, Check, Eye, Heart, Search, ShoppingBag, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type {
  CurrencyCode,
  LanguageCode,
  PriceRangePreset,
  ProductBadgeType,
  SortOption,
  SouvenirCategory,
  SouvenirProduct,
} from '../types/store';
import {
  getCategoryLabel,
  getPricePresetLabel,
  getProductBadgeLabel,
  getProductSecondaryTitle,
  getProductTitle,
  getTranslations,
} from '../utils/i18n';
import { CATEGORY_THUMBNAILS } from '../data/souvenirs';
import {
  MAX_PRICE_SLIDER,
  MIN_PRICE_SLIDER,
  PRICE_PRESET_OPTIONS,
  formatPrice,
  getCategoryThumbnail,
} from '../utils/storeLogic';
import { LimitedTimeOfferBanner } from './LimitedTimeOfferBanner';
import { ProductImage } from './ProductImage';
import { RecommendedSection } from './RecommendedSection';

interface CatalogSectionProps {
  categories: SouvenirCategory[];
  selectedCategory: SouvenirCategory;
  onSelectCategory: (category: SouvenirCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  pricePreset: PriceRangePreset;
  maxPrice: number;
  onSelectPricePreset: (preset: Exclude<PriceRangePreset, 'custom'>) => void;
  onMaxPriceChange: (value: number) => void;
  products: SouvenirProduct[];
  allProducts: SouvenirProduct[];
  wishlistIds: string[];
  recentProductIds: string[];
  onlyWishlisted: boolean;
  onToggleOnlyWishlisted: () => void;
  onToggleWishlist: (productId: string) => void;
  compareIds: string[];
  onToggleCompare: (productId: string) => void;
  notifiedProductIds: string[];
  onRequestNotify: (product: SouvenirProduct) => void;
  onSelectProduct: (product: SouvenirProduct) => void;
  onQuickLook: (product: SouvenirProduct) => void;
  onQuickAdd: (product: SouvenirProduct) => void;
  onResetFilters: () => void;
  currency: CurrencyCode;
  language: LanguageCode;
}

const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

const BADGE_STYLE_MAP: Record<ProductBadgeType, string> = {
  'best-seller': 'bg-[#1A1917]/90 text-[#FAF8F5]',
  'new-arrival': 'bg-[#FAF8F5]/95 text-[#1A1917] border border-[#E4DFD6]',
  'low-stock': 'bg-[#A83226]/95 text-[#FAF8F5]',
};

export function CatalogSection({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  pricePreset,
  maxPrice,
  onSelectPricePreset,
  onMaxPriceChange,
  products,
  allProducts,
  wishlistIds,
  recentProductIds,
  onlyWishlisted,
  onToggleOnlyWishlisted,
  onToggleWishlist,
  compareIds,
  onToggleCompare,
  notifiedProductIds,
  onRequestNotify,
  onSelectProduct,
  onQuickLook,
  onQuickAdd,
  onResetFilters,
  currency,
  language,
}: CatalogSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const t = getTranslations(language).catalog;

  return (
    <section
      id="collection"
      aria-labelledby="collection-heading"
      className="scroll-mt-36 max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20"
    >
      <LimitedTimeOfferBanner language={language} />

      {/* Centered Section Header */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease: REVEAL_EASE }}
        className="text-center max-w-xl mx-auto mb-10"
      >
        <p className="text-xs font-medium text-[#5E5A54]">{t.eyebrow}</p>
        <h2
          id="collection-heading"
          className="mt-1.5 font-display text-3xl sm:text-4xl font-semibold text-[#1A1917] text-balance"
        >
          {t.heading}
        </h2>
        <p className="mt-2.5 text-sm text-[#5E5A54] leading-relaxed">
          {t.subtitlePrefix}
          {products.length}{' '}
          {products.length === 1 ? t.artifactSingular : t.artifactPlural}
          {t.subtitleSuffix}
        </p>
      </motion.div>

      {/* Interactive Filter, Search, Price Range, and Sort Toolbar */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, delay: 0.06, ease: REVEAL_EASE }}
        className="space-y-4 pb-6 border-b border-[#E4DFD6]"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div
            role="group"
            aria-label={t.categoryGroupAria}
            className="flex flex-wrap items-center gap-1.5"
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category && !onlyWishlisted;
              const thumbSrc = getCategoryThumbnail(category, CATEGORY_THUMBNAILS);
              return (
                <button
                  key={category}
                  type="button"
                  data-testid={`category-button-${category}`}
                  onClick={() => {
                    if (onlyWishlisted) onToggleOnlyWishlisted();
                    onSelectCategory(category);
                  }}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-2 pl-2 pr-3.5 py-1.5 min-h-[40px] rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#1A1917] text-[#FAF8F5]'
                      : 'bg-[#F2EFE9] text-[#5E5A54] hover:text-[#1A1917] hover:bg-[#EAE4DA]'
                  }`}
                >
                  {thumbSrc && (
                    <span
                      className={`w-6 h-6 rounded-full overflow-hidden shrink-0 ring-1 ${
                        isActive ? 'ring-[#FAF8F5]/45' : 'ring-[#E4DFD6]'
                      } bg-[#FAF8F5]`}
                    >
                      <img
                        src={thumbSrc}
                        alt=""
                        aria-hidden="true"
                        data-testid={`category-thumb-${category}`}
                        className="w-full h-full object-cover"
                      />
                    </span>
                  )}
                  <span>{getCategoryLabel(category, language)}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={onToggleOnlyWishlisted}
              aria-pressed={onlyWishlisted}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                onlyWishlisted
                  ? 'bg-[#A83226] text-[#FAF8F5]'
                  : 'bg-[#F2EFE9] text-[#5E5A54] hover:text-[#1A1917] hover:bg-[#EAE4DA]'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  onlyWishlisted
                    ? 'fill-[#FAF8F5] text-[#FAF8F5]'
                    : wishlistIds.length > 0
                      ? 'fill-[#A83226] text-[#A83226]'
                      : ''
                }`}
                aria-hidden="true"
              />
              <span>{t.saved}</span>
              <span className="tabular-nums">({wishlistIds.length})</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="relative flex-1 sm:w-64">
              <label htmlFor="souvenir-search" className="sr-only">
                {t.searchLabel}
              </label>
              <Search
                className="w-4 h-4 text-[#5E5A54] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="souvenir-search"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full min-h-[40px] pl-10 pr-9 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] placeholder:text-[#5E5A54]/70 focus:border-[#1A1917] focus:outline-none"
              />
              {searchQuery.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label={t.clearSearchAria}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#5E5A54] hover:text-[#1A1917] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="shrink-0">
              <label htmlFor="souvenir-sort" className="sr-only">
                {t.sortLabel}
              </label>
              <select
                id="souvenir-sort"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="w-full sm:w-auto min-h-[40px] pl-3.5 pr-6 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm font-medium text-[#1A1917] focus:border-[#1A1917] focus:outline-none cursor-pointer"
              >
                <option value="featured">{t.sortFeatured}</option>
                <option value="price-asc">{t.sortPriceAsc}</option>
                <option value="price-desc">{t.sortPriceDesc}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Price Range Presets & Slider */}
        <div className="pt-4 border-t border-[#E4DFD6]/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#5E5A54] mr-1 shrink-0">
              {t.priceRangeLabel}
            </span>
            <div
              role="group"
              aria-label={t.priceGroupAria}
              className="flex flex-wrap items-center gap-1.5"
            >
              {PRICE_PRESET_OPTIONS.map((preset) => {
                const isActive = pricePreset === preset.id;
                const label = getPricePresetLabel(preset.id, formatPrice, currency, language);
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectPricePreset(preset.id)}
                    aria-pressed={isActive}
                    className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                      isActive
                        ? 'bg-[#1A1917] text-[#FAF8F5]'
                        : 'bg-[#F2EFE9] text-[#5E5A54] hover:text-[#1A1917] hover:bg-[#EAE4DA]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label
              htmlFor="souvenir-max-price"
              className="text-xs font-medium text-[#5E5A54] whitespace-nowrap"
            >
              {t.maxPriceLabel}
            </label>
            <input
              id="souvenir-max-price"
              type="range"
              min={MIN_PRICE_SLIDER}
              max={MAX_PRICE_SLIDER}
              step={5}
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              aria-valuetext={
                pricePreset === 'over-150'
                  ? `${t.overPrefix} ${formatPrice(150, currency)}`
                  : `${t.upToPrefix} ${formatPrice(maxPrice, currency)}`
              }
              className="w-40 sm:w-48 h-2 rounded-lg bg-[#E4DFD6] accent-[#A83226] cursor-pointer"
            />
            <span
              data-testid="max-price-readout"
              className="min-w-[84px] text-right text-xs font-semibold text-[#1A1917] tabular-nums whitespace-nowrap"
            >
              {pricePreset === 'over-150'
                ? `${t.overPrefix} ${formatPrice(150, currency)}`
                : `${t.upToPrefix} ${formatPrice(maxPrice, currency)}`}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Product Grid or Empty State */}
      {products.length === 0 ? (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: REVEAL_EASE }}
          className="mt-12 rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/50 p-10 text-center max-w-lg mx-auto"
        >
          <h3 className="font-display text-2xl font-semibold text-[#1A1917]">
            {t.emptyTitle}
          </h3>
          <p className="mt-2 text-sm text-[#5E5A54]">{t.emptyDescription}</p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-6 px-5 py-2.5 min-h-[40px] rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors cursor-pointer"
          >
            {t.resetFilters}
          </button>
        </motion.div>
      ) : (
        <div
          data-testid="product-grid"
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8"
        >
          {products.map((product, index) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const isCompared = compareIds.includes(product.id);
            const isNotified = notifiedProductIds.includes(product.id);
            return (
              <motion.article
                key={product.id}
                data-testid={`product-card-${product.id}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.45,
                  delay: prefersReducedMotion ? 0 : (index % 3) * 0.07,
                  ease: REVEAL_EASE,
                }}
                className="group rounded-xl border border-[#E4DFD6] bg-[#FAF8F5] overflow-hidden flex flex-col transition-shadow duration-200 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full bg-[#F2EFE9] overflow-hidden">
                  {product.badge && product.inStock && (
                    <span
                      data-testid={`product-badge-${product.id}`}
                      data-badge={product.badge}
                      className={`absolute top-3 left-3 z-10 pointer-events-none rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-wide shadow-xs ${BADGE_STYLE_MAP[product.badge]}`}
                    >
                      {getProductBadgeLabel(product.badge, language)}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    aria-label={`Inspect ${product.name}`}
                    className="w-full h-full block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                  >
                    <ProductImage
                      src={product.image}
                      alt={product.imageAlt}
                      fallbackTitle={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product.id)}
                    aria-pressed={isWishlisted}
                    aria-label={
                      isWishlisted
                        ? `Remove ${product.name} from wishlist`
                        : `Save ${product.name} to wishlist`
                    }
                    className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-[#FAF8F5]/92 backdrop-blur-xs border border-[#E4DFD6] flex items-center justify-center shadow-xs hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isWishlisted ? 'fill-[#A83226] text-[#A83226]' : 'text-[#1A1917]'
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    type="button"
                    data-testid={`quick-look-${product.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickLook(product);
                    }}
                    aria-label={`Quick look ${product.name}`}
                    className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 min-h-[34px] px-2.5 py-1.5 rounded-lg bg-[#FAF8F5]/95 backdrop-blur-xs border border-[#E4DFD6] text-xs font-semibold text-[#1A1917] shadow-xs hover:bg-[#1A1917] hover:text-[#FAF8F5] hover:border-[#1A1917] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{t.quickLook}</span>
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-[#5E5A54]">
                      <span>{product.origin}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{getCategoryLabel(product.category, language)}</span>
                      {!product.inStock ? (
                        <>
                          <span aria-hidden="true"> · </span>
                          <span className="font-semibold text-[#A83226]">{t.outOfStock}</span>
                        </>
                      ) : (
                        product.editionNote && (
                          <>
                            <span aria-hidden="true"> · </span>
                            <span className="text-[#A83226]">{product.editionNote}</span>
                          </>
                        )
                      )}
                    </p>

                    <h3 className="mt-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="text-left font-display text-2xl font-semibold text-[#1A1917] leading-snug hover:text-[#A83226] transition-colors cursor-pointer"
                      >
                        {getProductTitle(product, language)}
                      </button>
                    </h3>

                    <p className="text-xs text-[#5E5A54] mt-0.5">
                      {getProductSecondaryTitle(product, language)}
                    </p>

                    <p className="mt-2.5 text-sm text-[#5E5A54] leading-relaxed line-clamp-2">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-[#E4DFD6] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-semibold text-[#1A1917] tabular-nums">
                        {formatPrice(product.price, currency)}
                      </span>

                      <button
                        type="button"
                        onClick={() => onToggleCompare(product.id)}
                        aria-pressed={isCompared}
                        aria-label={
                          isCompared
                            ? `Remove ${product.name} from comparison`
                            : `Add ${product.name} to comparison`
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isCompared
                            ? 'border-[#A83226] bg-[#A83226]/8 text-[#A83226]'
                            : 'border-[#E4DFD6] bg-[#FAF8F5] text-[#5E5A54] hover:text-[#1A1917] hover:bg-[#F2EFE9]'
                        }`}
                      >
                        {isCompared ? (
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                        <span>{isCompared ? t.comparing : t.compare}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        aria-label={`View details for ${product.name}`}
                        className="flex-1 px-3 py-2 min-h-[40px] rounded-lg border border-[#E4DFD6] text-xs font-medium text-[#1A1917] hover:bg-[#F2EFE9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {t.details}
                      </button>

                      {product.inStock ? (
                        <button
                          type="button"
                          data-testid={`quick-buy-${product.id}`}
                          onClick={() => onQuickAdd(product)}
                          aria-label={`Quick buy ${product.name}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{t.quickBuy}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRequestNotify(product)}
                          aria-label={`Notify me when ${product.name} is back in stock`}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            isNotified
                              ? 'border-[#B8CEBE] bg-[#F1F6F2] text-[#2A5A3B] hover:border-[#2A5A3B]'
                              : 'border-[#A83226] bg-[#FAF8F5] text-[#A83226] hover:bg-[#A83226] hover:text-[#FAF8F5]'
                          }`}
                        >
                          {isNotified ? (
                            <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          ) : (
                            <Bell className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          )}
                          <span>{isNotified ? t.alertSet : t.notifyMe}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
            </motion.article>
            );
          })}
        </div>
      )}

      <RecommendedSection
        allProducts={allProducts}
        wishlistIds={wishlistIds}
        recentIds={recentProductIds}
        notifiedProductIds={notifiedProductIds}
        currency={currency}
        language={language}
        onToggleWishlist={onToggleWishlist}
        onSelectProduct={onSelectProduct}
        onQuickLook={onQuickLook}
        onQuickAdd={onQuickAdd}
        onRequestNotify={onRequestNotify}
      />
    </section>
  );
}

import { useEffect, useState, type MouseEvent } from 'react';
import {
  ArrowLeft,
  Bell,
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { CurrencyCode, LanguageCode, ProductReview, SouvenirProduct } from '../types/store';
import {
  getCategoryLabel,
  getProductSecondaryTitle,
  getProductTitle,
  getTranslations,
} from '../utils/i18n';
import {
  type PdpZoomScale,
  PDP_ZOOM_SCALES,
  computeZoomOriginPercent,
  filterReviewsByRating,
  formatPrice,
  getReviewSummary,
  getReviewsForProduct,
  getSameCategoryProducts,
  getStarRatingBreakdown,
  getUnitPrice,
} from '../utils/storeLogic';
import { ProductImage } from './ProductImage';
import { ProductReviewForm } from './ProductReviewForm';
import { SocialShareBar } from './SocialShareBar';

interface ProductDetailPageProps {
  product: SouvenirProduct | null;
  allProducts: SouvenirProduct[];
  reviewsByProduct?: Record<string, ProductReview[]>;
  currency: CurrencyCode;
  language: LanguageCode;
  isWishlisted: boolean;
  isNotified?: boolean;
  onToggleWishlist: (productId: string) => void;
  onRequestNotify: (product: SouvenirProduct) => void;
  onSelectProduct: (product: SouvenirProduct) => void;
  onBackToProducts: () => void;
  onBackHome: () => void;
  onAddToBag: (productId: string, variantId: string, quantity: number) => void;
  onSubmitReview: (productId: string, review: ProductReview) => void;
}

function StarRatingRow({ rating, label }: { rating: number; label: string }) {
  const rounded = Math.round(rating);
  return (
    <div className="inline-flex items-center gap-0.5" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const filled = starIndex <= rounded;
        return (
          <Star
            key={starIndex}
            className={`w-4 h-4 ${
              filled ? 'fill-[#A83226] text-[#A83226]' : 'text-[#D6CFC2]'
            }`}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export function ProductDetailPage({
  product,
  allProducts,
  reviewsByProduct = {},
  currency,
  language,
  isWishlisted,
  isNotified = false,
  onToggleWishlist,
  onRequestNotify,
  onSelectProduct,
  onBackToProducts,
  onBackHome,
  onAddToBag,
  onSubmitReview,
}: ProductDetailPageProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [isHoverZoom, setIsHoverZoom] = useState(false);
  const [isPinnedZoom, setIsPinnedZoom] = useState(false);
  const [zoomScale, setZoomScale] = useState<PdpZoomScale>(PDP_ZOOM_SCALES[0]);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const t = getTranslations(language);

  useEffect(() => {
    if (product) {
      setSelectedVariantId(product.variants[0]?.id ?? '');
      setQuantity(1);
      setRatingFilter('all');
      setIsHoverZoom(false);
      setIsPinnedZoom(false);
      setZoomScale(PDP_ZOOM_SCALES[0]);
      setZoomOrigin({ x: 50, y: 50 });
    }
  }, [product]);

  if (!product) {
    return (
      <section
        data-testid="product-detail-page"
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24"
      >
        <div
          data-testid="pdp-not-found"
          className="rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/70 p-8 sm:p-12 text-center space-y-4"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1917]">
            {t.pages.notFoundTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#5E5A54] max-w-lg mx-auto leading-relaxed">
            {t.pages.notFoundDescription}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              data-testid="pdp-not-found-products"
              onClick={onBackToProducts}
              className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#A83226] text-[#FAF8F5] text-sm font-semibold hover:bg-[#8C271D] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.pages.backToProducts}
            </button>
            <button
              type="button"
              onClick={onBackHome}
              className="min-h-[44px] px-5 py-2.5 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-[#1A1917] text-sm font-semibold hover:border-[#1A1917] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.pages.backToHome}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const displayTitle = getProductTitle(product, language);
  const secondaryTitle = getProductSecondaryTitle(product, language);
  const localizedCategory = getCategoryLabel(product.category, language);
  const activeVariantId = selectedVariantId || product.variants[0]?.id || '';
  const activeVariant =
    product.variants.find((v) => v.id === activeVariantId) ?? product.variants[0];
  const unitPrice = getUnitPrice(product, activeVariantId);
  const lineTotal = unitPrice * quantity;

  const productReviews = getReviewsForProduct(product, reviewsByProduct);
  const reviewSummary = getReviewSummary(productReviews);
  const starBreakdown = getStarRatingBreakdown(productReviews);
  const visibleReviews = filterReviewsByRating(productReviews, ratingFilter);
  const relatedProducts = getSameCategoryProducts(product, allProducts, 3);
  const isZoomed = isHoverZoom || isPinnedZoom;

  const updatePointerOrigin = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setZoomOrigin(computeZoomOriginPercent(event.clientX, event.clientY, rect));
  };

  const handleConfirmAdd = () => {
    if (!product.inStock) return;
    onAddToBag(product.id, activeVariantId, quantity);
  };

  return (
    <article
      data-testid="product-detail-page"
      data-product-slug={product.slug}
      className="bg-[#FAF8F5] pb-20 lg:pb-12"
    >
      {/* Top Contextual Return Bar */}
      <div className="border-b border-[#E4DFD6] bg-[#F2EFE9]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            data-testid="pdp-page-back"
            onClick={onBackToProducts}
            className="inline-flex items-center gap-2 min-h-[40px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-xs font-semibold text-[#1A1917] hover:border-[#1A1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{t.pages.backToProducts}</span>
          </button>

          <p className="text-xs font-medium text-[#5E5A54]">
            <span>{product.origin}</span>
            <span aria-hidden="true"> · </span>
            <span>{localizedCategory}</span>
            <span aria-hidden="true"> · </span>
            <span
              className={
                product.inStock
                  ? 'text-[#2A5A3B] font-semibold'
                  : 'font-semibold text-[#A83226]'
              }
            >
              {product.inStock ? t.pdp.inStock : t.pdp.outOfStock}
            </span>
          </p>
        </div>
      </div>

      {/* Main Sticky Two-Column Showcase + Contiguous Purchase Module */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Sticky Craftsmanship Gallery + Spec Breakdown */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-xl border border-[#E4DFD6] bg-[#F2EFE9] p-4 sm:p-6 space-y-5">
              <div
                data-testid="pdp-page-zoom-container"
                data-zoomed={String(isZoomed)}
                data-zoom-scale={String(zoomScale)}
                onMouseEnter={(e) => {
                  setIsHoverZoom(true);
                  updatePointerOrigin(e);
                }}
                onMouseMove={(e) => {
                  if (isZoomed) updatePointerOrigin(e);
                }}
                onMouseLeave={() => setIsHoverZoom(false)}
                className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#EAE4DA] border border-[#E4DFD6] group cursor-zoom-in"
              >
                <div
                  className="w-full h-full transition-transform duration-200 ease-out motion-reduce:transition-none"
                  style={{
                    transform: isZoomed ? `scale(${zoomScale})` : 'scale(1)',
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  }}
                >
                  <ProductImage
                    src={product.image}
                    alt={product.imageAlt}
                    fallbackTitle={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                  <div
                    role="group"
                    aria-label={t.pdp.zoomLevelAria}
                    className="inline-flex items-center rounded-lg bg-[#1A1917]/80 backdrop-blur-xs p-0.5 border border-[#FAF8F5]/15"
                  >
                    {PDP_ZOOM_SCALES.map((scaleOption) => {
                      const active = zoomScale === scaleOption;
                      return (
                        <button
                          key={scaleOption}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomScale(scaleOption);
                            setIsPinnedZoom(true);
                          }}
                          aria-pressed={active && isZoomed}
                          className={`min-h-[32px] px-2 rounded-md text-[11px] font-semibold tabular-nums transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#FAF8F5] text-[#1A1917]'
                              : 'text-[#FAF8F5]/85 hover:text-[#FAF8F5]'
                          }`}
                        >
                          {scaleOption}x
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPinnedZoom((prev) => !prev)}
                    aria-pressed={isPinnedZoom}
                    aria-label={isZoomed ? t.pdp.zoomResetAria : t.pdp.zoomActivateAria}
                    className="w-9 h-9 rounded-lg bg-[#1A1917]/75 text-[#FAF8F5] hover:bg-[#1A1917] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {isZoomed ? (
                      <ZoomOut className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <ZoomIn className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>

                <span className="pointer-events-none absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-md bg-[#1A1917]/75 px-2.5 py-1 text-[11px] font-medium text-[#FAF8F5]">
                  <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isZoomed ? t.pdp.zoomInspectingHint : t.pdp.hoverToZoom}</span>
                </span>
              </div>

              <dl className="space-y-2.5 text-sm border-t border-[#E4DFD6] pt-4">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#5E5A54] shrink-0">{t.pdp.workshop}</dt>
                  <dd className="text-[#1A1917] font-medium text-right">{product.workshop}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#5E5A54] shrink-0">{t.pdp.materials}</dt>
                  <dd className="text-[#1A1917] text-right">{product.materials}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#5E5A54] shrink-0">{t.pdp.dimensions}</dt>
                  <dd className="text-[#1A1917] text-right tabular-nums">{product.dimensions}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#1A1917] leading-tight text-balance">
                {displayTitle}
              </h1>
              <p className="text-sm text-[#5E5A54] mt-1">{secondaryTitle}</p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p
                  data-testid="pdp-page-price"
                  className="text-2xl sm:text-3xl font-semibold text-[#1A1917] tabular-nums"
                >
                  {formatPrice(unitPrice, currency)}
                </p>

                {reviewSummary.count > 0 && (
                  <a
                    href="#pdp-page-reviews"
                    className="inline-flex items-center gap-2 text-xs text-[#5E5A54] hover:text-[#1A1917] transition-colors"
                  >
                    <StarRatingRow
                      rating={reviewSummary.averageRating}
                      label={`Rated ${reviewSummary.averageRating} out of 5 stars`}
                    />
                    <span className="tabular-nums font-medium">
                      {reviewSummary.averageRating.toFixed(1)} · {reviewSummary.count}{' '}
                      {reviewSummary.count === 1 ? t.pdp.reviewSingular : t.pdp.reviewPlural}
                    </span>
                  </a>
                )}
              </div>

              <p className="mt-4 text-sm sm:text-base text-[#5E5A54] leading-relaxed">
                {product.shortDescription}
              </p>
              {product.story && product.story !== product.shortDescription && (
                <p className="mt-2.5 text-sm text-[#5E5A54] leading-relaxed">
                  {product.story}
                </p>
              )}

              {!product.inStock && (
                <div className="mt-4 rounded-lg border border-[#E4DFD6] bg-[#F2EFE9] px-4 py-3 text-xs text-[#A83226] font-medium">
                  {product.editionNote ?? t.pdp.outOfStock}
                </div>
              )}
            </div>

            {product.variants.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-[#1A1917] mb-2.5">
                  {t.pdp.selectEdition}
                </p>
                <div className="space-y-2.5" role="radiogroup" aria-label={t.pdp.selectEdition}>
                  {product.variants.map((variant) => {
                    const isSelected = variant.id === activeVariantId;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'border-[#A83226] bg-[#A83226]/6'
                            : 'border-[#E4DFD6] bg-[#FAF8F5] hover:border-[#1A1917]/40'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-[#1A1917]">{variant.label}</p>
                          {variant.note && (
                            <p className="text-xs text-[#5E5A54] mt-0.5">{variant.note}</p>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-[#1A1917] tabular-nums shrink-0">
                          {variant.priceDelta === 0
                            ? t.pdp.included
                            : `+${formatPrice(variant.priceDelta, currency)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-[#E4DFD6]">
              <div className="flex items-center gap-2.5">
                {product.inStock ? (
                  <>
                    <div className="inline-flex items-center rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        aria-label={t.pdp.decreaseQtyAria}
                        className="w-10 h-11 flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] rounded-l-lg cursor-pointer"
                      >
                        <Minus className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <span
                        aria-label={t.pdp.selectedQtyAria}
                        className="w-10 text-center text-sm font-semibold text-[#1A1917] tabular-nums"
                      >
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label={t.pdp.increaseQtyAria}
                        className="w-10 h-11 flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] rounded-r-lg cursor-pointer"
                      >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    <button
                      type="button"
                      data-testid="pdp-page-add-to-bag"
                      onClick={handleConfirmAdd}
                      className="flex-1 min-w-0 min-h-[44px] px-4 py-3 rounded-lg bg-[#A83226] text-[#FAF8F5] text-sm font-semibold hover:bg-[#8C271D] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {t.pdp.addToBag} ·{' '}
                      <span className="tabular-nums">{formatPrice(lineTotal, currency)}</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => onRequestNotify(product)}
                    className={`flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-lg border text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isNotified
                        ? 'border-[#B8CEBE] bg-[#F1F6F2] text-[#2A5A3B] hover:border-[#2A5A3B]'
                        : 'border-[#A83226] bg-[#A83226] text-[#FAF8F5] hover:bg-[#8C271D]'
                    }`}
                  >
                    {isNotified ? (
                      <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <Bell className="w-4 h-4 shrink-0" aria-hidden="true" />
                    )}
                    <span>{isNotified ? t.pdp.restockAlertSet : t.pdp.notifyWhenAvailable}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  aria-pressed={isWishlisted}
                  aria-label={
                    isWishlisted
                      ? `Remove ${product.name} from wishlist`
                      : `Save ${product.name} to wishlist`
                  }
                  className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                    isWishlisted
                      ? 'border-[#A83226] bg-[#A83226]/8 text-[#A83226]'
                      : 'border-[#E4DFD6] bg-[#FAF8F5] text-[#1A1917] hover:bg-[#F2EFE9]'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? 'fill-[#A83226]' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              <p className="flex items-center gap-2 text-xs text-[#5E5A54]">
                <ShieldCheck className="w-4 h-4 text-[#A83226] shrink-0" aria-hidden="true" />
                <span>{t.pdp.provenanceGuarantee}</span>
              </p>

              <SocialShareBar product={product} language={language} />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section
        id="pdp-page-reviews"
        aria-labelledby="pdp-page-reviews-heading"
        data-testid="pdp-page-reviews-section"
        className="border-t border-[#E4DFD6] bg-[#F2EFE9]/35"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4 border-b border-[#E4DFD6]">
            <div>
              <h2
                id="pdp-page-reviews-heading"
                className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1917]"
              >
                {t.pdp.reviewsHeading}
              </h2>
              <p className="text-xs text-[#5E5A54] mt-1">{t.pdp.reviewsSubtitle}</p>
            </div>

            {reviewSummary.count > 0 && (
              <div className="inline-flex items-center gap-2 text-xs font-medium text-[#1A1917] tabular-nums">
                <StarRatingRow
                  rating={reviewSummary.averageRating}
                  label={`Rated ${reviewSummary.averageRating} out of 5`}
                />
                <span>
                  {reviewSummary.averageRating.toFixed(1)} ({reviewSummary.count}{' '}
                  {reviewSummary.count === 1 ? t.pdp.reviewSingular : t.pdp.reviewPlural})
                </span>
              </div>
            )}
          </div>

          {productReviews.length > 0 && (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center pb-5 border-b border-[#E4DFD6]">
              <div className="md:col-span-4 rounded-xl border border-[#E4DFD6] bg-[#FAF8F5] p-4 flex items-center gap-4">
                <span className="font-display text-4xl font-semibold text-[#1A1917] tabular-nums">
                  {reviewSummary.averageRating.toFixed(1)}
                </span>
                <div>
                  <StarRatingRow
                    rating={reviewSummary.averageRating}
                    label={`Average rating ${reviewSummary.averageRating} out of 5`}
                  />
                  <p className="text-xs text-[#5E5A54] mt-1 tabular-nums">
                    {reviewSummary.count}{' '}
                    {reviewSummary.count === 1 ? t.pdp.reviewSingular : t.pdp.reviewPlural}
                  </p>
                </div>
              </div>

              <div className="md:col-span-8 space-y-1.5" aria-label={t.pdp.ratingDistributionAria}>
                {starBreakdown.map((row) => (
                  <div key={row.stars} className="flex items-center gap-3 text-xs">
                    <span className="w-10 text-right font-medium text-[#1A1917] tabular-nums">
                      {row.stars}★
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-[#E4DFD6] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#A83226]"
                        style={{ width: `${row.percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-[#5E5A54] tabular-nums">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {productReviews.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setRatingFilter('all')}
                aria-pressed={ratingFilter === 'all'}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  ratingFilter === 'all'
                    ? 'border-[#1A1917] bg-[#1A1917] text-[#FAF8F5]'
                    : 'border-[#E4DFD6] bg-[#FAF8F5] text-[#5E5A54] hover:border-[#1A1917] hover:text-[#1A1917]'
                }`}
              >
                {t.pdp.allRatings} ({productReviews.length})
              </button>
              {[5, 4, 3, 2, 1].map((star) => {
                const countForStar = starBreakdown.find((b) => b.stars === star)?.count ?? 0;
                const active = ratingFilter === star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingFilter(star)}
                    aria-pressed={active}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg border text-xs font-medium tabular-nums transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'border-[#1A1917] bg-[#1A1917] text-[#FAF8F5]'
                        : 'border-[#E4DFD6] bg-[#FAF8F5] text-[#5E5A54] hover:border-[#1A1917] hover:text-[#1A1917]'
                    }`}
                  >
                    {star}★ ({countForStar})
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              {visibleReviews.length === 0 ? (
                <div className="rounded-xl border border-[#E4DFD6] bg-[#FAF8F5] p-6 text-center space-y-2">
                  <p className="text-sm text-[#5E5A54]">
                    {productReviews.length === 0 ? t.pdp.noReviews : t.pdp.noReviewsForRating}
                  </p>
                  {ratingFilter !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setRatingFilter('all')}
                      className="text-xs font-semibold text-[#A83226] underline underline-offset-2 cursor-pointer"
                    >
                      {t.pdp.showAllRatings}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleReviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-xl border border-[#E4DFD6] bg-[#FAF8F5] p-4 flex flex-col justify-between gap-2.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <StarRatingRow
                            rating={review.rating}
                            label={`${review.rating} out of 5 stars`}
                          />
                          <span className="text-[11px] text-[#5E5A54] tabular-nums">
                            {review.date}
                          </span>
                        </div>
                        <p className="mt-2.5 text-sm text-[#1A1917] leading-relaxed">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                      </div>
                      <p className="text-xs text-[#5E5A54] pt-2 border-t border-[#E4DFD6]">
                        <span className="font-semibold text-[#1A1917]">{review.author}</span>
                        <span aria-hidden="true"> · </span>
                        <span>{review.location}</span>
                        {review.variantLabel && (
                          <>
                            <span aria-hidden="true"> · </span>
                            <span>{review.variantLabel}</span>
                          </>
                        )}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <ProductReviewForm
                productId={product.id}
                productTitle={displayTitle}
                variantLabel={activeVariant?.label}
                language={language}
                onSubmitReview={(targetProductId, newReview) => {
                  setRatingFilter('all');
                  onSubmitReview(targetProductId, newReview);
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recommended for You (Same-Category Companions) */}
      {relatedProducts.length > 0 && (
        <section
          aria-labelledby="pdp-page-related-heading"
          data-testid="pdp-page-recommended"
          className="border-t border-[#E4DFD6] bg-[#F2EFE9]/60"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2
                  id="pdp-page-related-heading"
                  className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1917]"
                >
                  {t.pdp.relatedHeading}
                </h2>
                <p className="text-xs text-[#5E5A54] mt-1">
                  {localizedCategory} · {t.pdp.relatedSubtitleSuffix}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedProducts.map((related) => {
                const relatedTitle = getProductTitle(related, language);
                const relatedCategory = getCategoryLabel(related.category, language);
                return (
                  <button
                    key={related.id}
                    type="button"
                    data-testid={`pdp-page-related-card-${related.id}`}
                    onClick={() => onSelectProduct(related)}
                    className="group text-left rounded-xl border border-[#E4DFD6] bg-[#FAF8F5] overflow-hidden hover:border-[#1A1917]/50 hover:shadow-sm transition-all cursor-pointer flex flex-col"
                  >
                    <div className="aspect-[4/3] w-full bg-[#EAE4DA] overflow-hidden">
                      <ProductImage
                        src={related.image}
                        alt={related.imageAlt}
                        fallbackTitle={related.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between gap-1.5">
                      <div>
                        <p className="text-[11px] font-medium text-[#5E5A54]">
                          {related.origin} · {relatedCategory}
                        </p>
                        <p className="mt-1 font-display text-lg font-semibold text-[#1A1917] group-hover:text-[#A83226] transition-colors leading-snug">
                          {relatedTitle}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#1A1917] tabular-nums pt-1">
                        {formatPrice(related.price, currency)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Sticky Bottom Buy Bar (<= 15% mobile height) */}
      {product.inStock && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-[#E4DFD6] bg-[#FAF8F5]/95 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#5E5A54] truncate">{displayTitle}</p>
            <p className="text-sm font-semibold text-[#1A1917] tabular-nums">
              {formatPrice(lineTotal, currency)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleConfirmAdd}
            className="min-h-[42px] px-4 py-2 rounded-lg bg-[#A83226] text-[#FAF8F5] text-xs font-semibold hover:bg-[#8C271D] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {t.pdp.addToBag}
          </button>
        </div>
      )}
    </article>
  );
}

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  Bell,
  Check,
  Heart,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Star,
  X,
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
  buildProductSharePayload,
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

interface ProductDetailModalProps {
  product: SouvenirProduct | null;
  allProducts: SouvenirProduct[];
  reviewsByProduct?: Record<string, ProductReview[]>;
  userReviews?: ProductReview[];
  currency: CurrencyCode;
  language: LanguageCode;
  isWishlisted: boolean;
  isNotified?: boolean;
  suppressEscape?: boolean;
  onToggleWishlist: (productId: string) => void;
  onRequestNotify: (product: SouvenirProduct) => void;
  onSelectProduct: (product: SouvenirProduct) => void;
  onClose: () => void;
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
              filled ? 'fill-[#A83226] text-[#A83226]' : 'text-[#D5CFC4]'
            }`}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export function ProductDetailModal({
  product,
  allProducts,
  reviewsByProduct = {},
  userReviews = [],
  currency,
  language,
  isWishlisted,
  isNotified = false,
  suppressEscape = false,
  onToggleWishlist,
  onRequestNotify,
  onSelectProduct,
  onClose,
  onAddToBag,
  onSubmitReview,
}: ProductDetailModalProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [shareStatus, setShareStatus] = useState<'idle' | 'shared' | 'copied'>('idle');
  const [isHoverZoom, setIsHoverZoom] = useState<boolean>(false);
  const [isPinnedZoom, setIsPinnedZoom] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<PdpZoomScale>(PDP_ZOOM_SCALES[0]);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shareTimerRef = useRef<number | null>(null);

  const isZoomed = isHoverZoom || isPinnedZoom;

  useEffect(() => {
    if (product) {
      setSelectedVariantId(product.variants[0]?.id ?? '');
      setQuantity(1);
      setShareStatus('idle');
      setIsHoverZoom(false);
      setIsPinnedZoom(false);
      setZoomScale(PDP_ZOOM_SCALES[0]);
      setZoomOrigin({ x: 50, y: 50 });
      setRatingFilter('all');
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [product]);

  useEffect(() => {
    return () => {
      if (shareTimerRef.current !== null) {
        window.clearTimeout(shareTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!product || suppressEscape) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, suppressEscape, onClose]);

  if (!product) return null;

  const t = getTranslations(language);
  const primaryTitle = getProductTitle(product, language);
  const secondaryTitle = getProductSecondaryTitle(product, language);
  const localizedCategory = getCategoryLabel(product.category, language);

  const activeVariantId = selectedVariantId || product.variants[0]?.id || '';
  const activeVariant =
    product.variants.find((v) => v.id === activeVariantId) ?? product.variants[0];
  const unitPrice = getUnitPrice(product, activeVariantId);
  const lineTotal = unitPrice * quantity;
  const reviews = getReviewsForProduct(product, reviewsByProduct, userReviews);
  const reviewSummary = getReviewSummary(reviews);
  const starBreakdown = getStarRatingBreakdown(reviews);
  const filteredReviews = filterReviewsByRating(reviews, ratingFilter);
  const relatedProducts = getSameCategoryProducts(product, allProducts, 3);

  const handleConfirmAdd = () => {
    onAddToBag(product.id, activeVariantId, quantity);
    onClose();
  };

  const scrollToReviews = (focusComposer = false) => {
    const targetId = focusComposer ? 'pdp-review-author' : 'pdp-reviews-heading';
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: 'smooth', block: focusComposer ? 'center' : 'start' });
    if (focusComposer && el instanceof HTMLInputElement) {
      window.setTimeout(() => el.focus(), 220);
    }
  };

  const scheduleShareReset = () => {
    if (shareTimerRef.current !== null) {
      window.clearTimeout(shareTimerRef.current);
    }
    shareTimerRef.current = window.setTimeout(() => {
      setShareStatus('idle');
    }, 2400);
  };

  const handleShare = async () => {
    const payload = buildProductSharePayload(
      product,
      primaryTitle,
      typeof window !== 'undefined' ? window.location.href : '',
    );

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(payload);
        setShareStatus('shared');
        scheduleShareReset();
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(payload.url);
      } catch {
        // Ignore clipboard permission errors in restricted contexts
      }
    }
    setShareStatus('copied');
    scheduleShareReset();
  };

  const handleImageMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setZoomOrigin(computeZoomOriginPercent(event.clientX, event.clientY, rect));
  };

  const handleCycleZoomScale = () => {
    setZoomScale((prev) => (prev === PDP_ZOOM_SCALES[0] ? PDP_ZOOM_SCALES[1] : PDP_ZOOM_SCALES[0]));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1917]/60"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdp-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#FAF8F5] border border-[#E4DFD6] rounded-xl shadow-2xl overflow-hidden my-auto"
      >
        <div className="shrink-0 flex items-center justify-between gap-4 px-6 sm:px-8 py-3 border-b border-[#E4DFD6] bg-[#FAF8F5]">
          <p className="text-xs font-medium text-[#5E5A54] truncate">
            <span>{product.origin}</span>
            <span aria-hidden="true"> · </span>
            <span>{localizedCategory}</span>
            <span aria-hidden="true"> · </span>
            <span className={product.inStock ? undefined : 'font-semibold text-[#A83226]'}>
              {product.inStock ? t.pdp.inStock : t.pdp.outOfStock}
            </span>
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              data-testid="pdp-share-button"
              onClick={handleShare}
              aria-label={t.pdp.shareAria}
              className={`inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                shareStatus !== 'idle'
                  ? 'border-[#B8CEBE] bg-[#F1F6F2] text-[#2A5A3B]'
                  : 'border-[#E4DFD6] bg-[#FAF8F5] text-[#1A1917] hover:bg-[#F2EFE9]'
              }`}
            >
              {shareStatus !== 'idle' ? (
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <Share2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span>
                {shareStatus === 'shared'
                  ? t.pdp.sharedFeedback
                  : shareStatus === 'copied'
                    ? t.pdp.linkCopiedFeedback
                    : t.pdp.share}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.pdp.closeAria}
              className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E4DFD6] flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Gallery & Specifications */}
          <div className="lg:col-span-6 bg-[#F2EFE9] p-6 sm:p-8 flex flex-col justify-between gap-6 border-b lg:border-b-0 lg:border-r border-[#E4DFD6]">
            <div
              data-testid="pdp-zoom-container"
              data-zoomed={String(isZoomed)}
              data-zoom-scale={String(zoomScale)}
              onMouseEnter={(e) => {
                setIsHoverZoom(true);
                handleImageMouseMove(e);
              }}
              onMouseMove={handleImageMouseMove}
              onMouseLeave={() => {
                setIsHoverZoom(false);
                if (!isPinnedZoom) {
                  setZoomOrigin({ x: 50, y: 50 });
                }
              }}
              className={`relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E4DFD6] bg-[#FAF8F5] ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
            >
              <div
                data-testid="pdp-zoom-surface"
                onClick={() => setIsPinnedZoom((prev) => !prev)}
                className="w-full h-full transition-transform duration-150 ease-out motion-reduce:transition-none will-change-transform"
                style={{
                  transform: isZoomed ? `scale(${zoomScale})` : 'scale(1)',
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                }}
              >
                <ProductImage
                  src={product.image}
                  alt={product.imageAlt}
                  fallbackTitle={primaryTitle}
                />
              </div>

              {isZoomed && (
                <span
                  aria-hidden="true"
                  data-testid="pdp-zoom-reticle"
                  style={{ left: `${zoomOrigin.x}%`, top: `${zoomOrigin.y}%` }}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-[#FAF8F5]/80 ring-1 ring-[#1A1917]/30 shadow-xs transition-[left,top] duration-75 ease-out motion-reduce:transition-none"
                />
              )}

              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                <button
                  type="button"
                  data-testid="pdp-zoom-level-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCycleZoomScale();
                    if (!isZoomed) setIsPinnedZoom(true);
                  }}
                  aria-label={`${t.pdp.zoomLevelAria} (${zoomScale}x)`}
                  className="min-h-[40px] px-3 py-1.5 rounded-md bg-[#1A1917]/80 text-[11px] font-semibold text-[#FAF8F5] hover:bg-[#A83226] transition-colors cursor-pointer tabular-nums"
                >
                  {zoomScale}×
                </button>
                <button
                  type="button"
                  data-testid="pdp-zoom-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isZoomed) {
                      setIsHoverZoom(false);
                      setIsPinnedZoom(false);
                      setZoomOrigin({ x: 50, y: 50 });
                    } else {
                      setIsPinnedZoom(true);
                    }
                  }}
                  aria-pressed={isZoomed}
                  aria-label={isZoomed ? t.pdp.zoomResetAria : t.pdp.zoomActivateAria}
                  className="w-10 h-10 rounded-md bg-[#1A1917]/80 text-[#FAF8F5] flex items-center justify-center hover:bg-[#A83226] transition-colors cursor-pointer"
                >
                  {isZoomed ? (
                    <ZoomOut className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <ZoomIn className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              <span
                data-testid="pdp-zoom-status"
                className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-[#1A1917]/82 px-2.5 py-1 text-[11px] font-medium text-[#FAF8F5] transition-opacity duration-150 tabular-nums"
              >
                <ZoomIn className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {isZoomed
                    ? `${zoomScale}× ${t.pdp.zoomInspectingHint}`
                    : t.pdp.hoverToZoom}
                </span>
              </span>
            </div>

            <dl className="space-y-3 pt-2 border-t border-[#E4DFD6] text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-[#5E5A54] shrink-0">{t.pdp.workshop}</dt>
                <dd className="text-[#1A1917] font-medium text-right">{product.workshop}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#5E5A54] shrink-0">{t.pdp.materials}</dt>
                <dd className="text-[#1A1917] font-medium text-right">{product.materials}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#5E5A54] shrink-0">{t.pdp.dimensions}</dt>
                <dd className="text-[#1A1917] font-medium text-right">{product.dimensions}</dd>
              </div>
            </dl>
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div>
                <h2
                  id="pdp-title"
                  className="font-display text-3xl font-semibold text-[#1A1917] leading-tight"
                >
                  {primaryTitle}
                </h2>
                <p className="text-sm text-[#5E5A54] mt-1">{secondaryTitle}</p>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="text-2xl font-semibold text-[#1A1917] tabular-nums">
                  {formatPrice(unitPrice, currency)}
                </p>

                {reviewSummary.count > 0 ? (
                  <button
                    type="button"
                    data-testid="pdp-rating-summary-trigger"
                    onClick={() => scrollToReviews(false)}
                    className="inline-flex items-center gap-2 text-xs font-medium text-[#5E5A54] hover:text-[#1A1917] transition-colors cursor-pointer"
                  >
                    <StarRatingRow
                      rating={reviewSummary.averageRating}
                      label={`Rated ${reviewSummary.averageRating} out of 5 stars`}
                    />
                    <span className="tabular-nums">
                      {reviewSummary.averageRating.toFixed(1)} · {reviewSummary.count}{' '}
                      {reviewSummary.count === 1 ? t.pdp.reviewSingular : t.pdp.reviewPlural}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    data-testid="pdp-rating-write-trigger"
                    onClick={() => scrollToReviews(true)}
                    className="text-xs font-medium text-[#A83226] hover:underline cursor-pointer"
                  >
                    {t.pdp.writeReviewCta}
                  </button>
                )}
              </div>

              <p className="text-sm text-[#5E5A54] leading-relaxed">{product.story}</p>

              {/* Variant Selector */}
              <fieldset className="pt-2">
                <legend className="text-xs font-semibold text-[#1A1917] mb-2.5">
                  {t.pdp.selectEdition}
                </legend>
                <div role="radiogroup" className="space-y-2">
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
                            ? 'border-[#A83226] bg-[#A83226]/5'
                            : 'border-[#E4DFD6] bg-[#FAF8F5] hover:bg-[#F2EFE9]'
                        }`}
                      >
                        <div>
                          <span className="block text-sm font-medium text-[#1A1917]">
                            {variant.label}
                          </span>
                          <span className="block text-xs text-[#5E5A54] mt-0.5">
                            {variant.note}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#1A1917] tabular-nums shrink-0">
                          {variant.priceDelta > 0
                            ? `+${formatPrice(variant.priceDelta, currency)}`
                            : t.pdp.included}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            {/* Quantity + Buy CTA */}
            <div className="space-y-3 pt-4 border-t border-[#E4DFD6]">
              <div className="flex items-center gap-3">
                {product.inStock ? (
                  <>
                    <div className="inline-flex items-center rounded-lg border border-[#E4DFD6] bg-[#FAF8F5]">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        aria-label={t.pdp.decreaseQtyAria}
                        className="w-9 sm:w-10 h-11 flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] rounded-l-lg cursor-pointer"
                      >
                        <Minus className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <span
                        aria-label={t.pdp.selectedQtyAria}
                        className="w-8 sm:w-10 text-center text-sm font-semibold text-[#1A1917] tabular-nums"
                      >
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label={t.pdp.increaseQtyAria}
                        className="w-9 sm:w-10 h-11 flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] rounded-r-lg cursor-pointer"
                      >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmAdd}
                      className="flex-1 min-w-0 min-h-[44px] px-3 sm:px-5 py-3 rounded-lg bg-[#A83226] text-[#FAF8F5] text-sm font-semibold hover:bg-[#8C271D] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {t.pdp.addToBag} · <span className="tabular-nums">{formatPrice(lineTotal, currency)}</span>
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

        {/* Customer Reviews Section */}
        <section
          aria-labelledby="pdp-reviews-heading"
          data-testid="pdp-reviews-section"
          data-product-id={product.id}
          className="border-t border-[#E4DFD6] bg-[#FAF8F5] p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4 border-b border-[#E4DFD6]">
            <div>
              <h3
                id="pdp-reviews-heading"
                className="font-display text-2xl font-semibold text-[#1A1917]"
              >
                {t.pdp.reviewsHeading}
              </h3>
              <p className="text-xs text-[#5E5A54] mt-1">{t.pdp.reviewsSubtitle}</p>
            </div>

            {reviewSummary.count > 0 && (
              <div
                data-testid="pdp-reviews-summary"
                className="flex items-center gap-2.5 text-sm text-[#1A1917]"
              >
                <StarRatingRow
                  rating={reviewSummary.averageRating}
                  label={`Average rating ${reviewSummary.averageRating} out of 5 stars`}
                />
                <span className="font-semibold tabular-nums">
                  {reviewSummary.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-[#5E5A54] tabular-nums">
                  ({reviewSummary.count}{' '}
                  {reviewSummary.count === 1 ? t.pdp.reviewSingular : t.pdp.reviewPlural})
                </span>
              </div>
            )}
          </div>

          {reviewSummary.count > 0 && (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center pb-5 border-b border-[#E4DFD6]">
              <div
                aria-label={t.pdp.ratingDistributionAria}
                className="md:col-span-6 space-y-1.5"
              >
                {starBreakdown.map((row) => (
                  <div key={row.stars} className="flex items-center gap-2.5 text-xs">
                    <span className="w-8 font-medium text-[#1A1917] tabular-nums shrink-0">
                      {row.stars} ★
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-[#EAE4DA] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#A83226] transition-[width] duration-200 motion-reduce:transition-none"
                        style={{ width: `${row.percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[#5E5A54] tabular-nums shrink-0">
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="md:col-span-6 flex flex-wrap items-center gap-1.5 md:justify-end">
                <button
                  type="button"
                  data-testid="pdp-review-filter-all"
                  onClick={() => setRatingFilter('all')}
                  aria-pressed={ratingFilter === 'all'}
                  className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                    ratingFilter === 'all'
                      ? 'bg-[#1A1917] text-[#FAF8F5]'
                      : 'bg-[#F2EFE9] text-[#5E5A54] hover:text-[#1A1917] hover:bg-[#EAE4DA]'
                  }`}
                >
                  {t.pdp.allRatings} ({reviews.length})
                </button>
                {starBreakdown
                  .filter((row) => row.count > 0)
                  .map((row) => {
                    const isActive = ratingFilter === row.stars;
                    return (
                      <button
                        key={row.stars}
                        type="button"
                        data-testid={`pdp-review-filter-${row.stars}`}
                        onClick={() => setRatingFilter(isActive ? 'all' : row.stars)}
                        aria-pressed={isActive}
                        className={`min-h-[40px] px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                          isActive
                            ? 'bg-[#A83226] text-[#FAF8F5]'
                            : 'bg-[#F2EFE9] text-[#5E5A54] hover:text-[#1A1917] hover:bg-[#EAE4DA]'
                        }`}
                      >
                        {row.stars} {t.pdp.starFilterSuffix} ({row.count})
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Dedicated Interactive Review Submission Component */}
          <div className="mt-5">
            <ProductReviewForm
              productId={product.id}
              productTitle={primaryTitle}
              variantLabel={activeVariant?.label}
              language={language}
              onSubmitReview={(targetProductId, newReview) => {
                setRatingFilter('all');
                onSubmitReview(targetProductId, newReview);
              }}
            />
          </div>

          {reviews.length === 0 ? (
            <p className="py-8 text-sm text-[#5E5A54] text-center">{t.pdp.noReviews}</p>
          ) : filteredReviews.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm text-[#5E5A54]">{t.pdp.noReviewsForRating}</p>
              <button
                type="button"
                onClick={() => setRatingFilter('all')}
                className="min-h-[40px] px-4 py-2 rounded-lg border border-[#E4DFD6] text-xs font-semibold text-[#1A1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
              >
                {t.pdp.showAllRatings}
              </button>
            </div>
          ) : (
            <ul
              className="divide-y divide-[#E4DFD6]"
              data-testid="customer-reviews-list"
              data-product-id={product.id}
            >
              {filteredReviews.map((review) => (
                <li key={review.id} className="py-5 first:pt-5 last:pb-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-[#5E5A54]">
                      <span className="text-sm font-semibold text-[#1A1917]">{review.author}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{review.location}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{review.date}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{review.variantLabel}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <StarRatingRow
                        rating={review.rating}
                        label={`Rated ${review.rating} out of 5 stars`}
                      />
                      <span className="text-xs font-semibold text-[#1A1917] tabular-nums">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2.5 text-sm text-[#5E5A54] leading-relaxed">{review.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recommended for you Section (3 Same-Category Related Products) */}
        {relatedProducts.length > 0 && (
          <section
            aria-labelledby="pdp-related-heading"
            data-testid="pdp-recommended-section"
            data-category={product.category}
            className="border-t border-[#E4DFD6] bg-[#F2EFE9]/55 p-6 sm:p-8"
          >
            <div className="mb-5">
              <h3
                id="pdp-related-heading"
                className="font-display text-2xl font-semibold text-[#1A1917]"
              >
                {t.pdp.relatedHeading}
              </h3>
              <p className="text-xs text-[#5E5A54] mt-1">
                {localizedCategory} · {t.pdp.relatedSubtitleSuffix}
              </p>
            </div>

            <div
              data-testid="related-products-grid"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {relatedProducts.map((related) => {
                const relatedTitle = getProductTitle(related, language);
                return (
                  <button
                    key={related.id}
                    type="button"
                    data-testid={`pdp-recommended-card-${related.id}`}
                    data-category={related.category}
                    onClick={() => onSelectProduct(related)}
                    aria-label={`View ${related.name}`}
                    className="group text-left rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] overflow-hidden hover:border-[#1A1917]/40 hover:shadow-sm transition-all motion-reduce:transition-none flex flex-col cursor-pointer"
                  >
                    <div className="aspect-[4/3] w-full bg-[#F2EFE9] overflow-hidden">
                      <ProductImage
                        src={related.image}
                        alt={related.imageAlt}
                        fallbackTitle={relatedTitle}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-medium text-[#5E5A54]">
                          {getCategoryLabel(related.category, language)} · {related.origin}
                        </p>
                        <p className="mt-1 font-display text-lg font-semibold text-[#1A1917] leading-snug group-hover:text-[#A83226] transition-colors">
                          {relatedTitle}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#1A1917] tabular-nums">
                        {formatPrice(related.price, currency)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
        </div>
      </div>
    </div>
  );
}

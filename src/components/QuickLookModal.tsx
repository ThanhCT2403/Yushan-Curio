import { useEffect, useState } from 'react';
import { Bell, Check, Eye, Heart, ShoppingBag, Star, X } from 'lucide-react';
import type { CurrencyCode, LanguageCode, ProductBadgeType, SouvenirProduct } from '../types/store';
import {
  getCategoryLabel,
  getProductBadgeLabel,
  getProductSecondaryTitle,
  getProductTitle,
  getTranslations,
} from '../utils/i18n';
import { formatPrice, getReviewSummary, getUnitPrice } from '../utils/storeLogic';
import { ProductImage } from './ProductImage';

interface QuickLookModalProps {
  product: SouvenirProduct | null;
  currency: CurrencyCode;
  language: LanguageCode;
  isWishlisted: boolean;
  isNotified?: boolean;
  suppressEscape?: boolean;
  onToggleWishlist: (productId: string) => void;
  onRequestNotify: (product: SouvenirProduct) => void;
  onAddToBag: (productId: string, variantId: string, quantity: number) => void;
  onOpenFullDetails: (product: SouvenirProduct) => void;
  onClose: () => void;
}

const BADGE_STYLE_MAP: Record<ProductBadgeType, string> = {
  'best-seller': 'bg-[#1A1917]/90 text-[#FAF8F5]',
  'new-arrival': 'bg-[#FAF8F5]/95 text-[#1A1917] border border-[#E4DFD6]',
  'low-stock': 'bg-[#A83226]/95 text-[#FAF8F5]',
};

export function QuickLookModal({
  product,
  currency,
  language,
  isWishlisted,
  isNotified = false,
  suppressEscape = false,
  onToggleWishlist,
  onRequestNotify,
  onAddToBag,
  onOpenFullDetails,
  onClose,
}: QuickLookModalProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  useEffect(() => {
    if (product) {
      setSelectedVariantId(product.variants[0]?.id ?? '');
    }
  }, [product]);

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
  const ql = t.quickLook;
  const primaryTitle = getProductTitle(product, language);
  const secondaryTitle = getProductSecondaryTitle(product, language);
  const localizedCategory = getCategoryLabel(product.category, language);

  const activeVariantId = selectedVariantId || product.variants[0]?.id || '';
  const unitPrice = getUnitPrice(product, activeVariantId);
  const reviewSummary = getReviewSummary(product.reviews ?? []);

  const handleQuickBuy = () => {
    onAddToBag(product.id, activeVariantId, 1);
    onClose();
  };

  const handleViewFull = () => {
    onClose();
    onOpenFullDetails(product);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1917]/55 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-look-title"
        data-testid="quick-look-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#E4DFD6] rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[#E4DFD6] bg-[#FAF8F5]">
          <div className="flex items-center gap-2 min-w-0">
            <Eye className="w-4 h-4 text-[#A83226] shrink-0" aria-hidden="true" />
            <p className="text-xs font-medium text-[#5E5A54] truncate">
              <span className="font-semibold text-[#1A1917]">{ql.eyebrow}</span>
              <span aria-hidden="true"> · </span>
              <span>{product.origin}</span>
              <span aria-hidden="true"> · </span>
              <span>{localizedCategory}</span>
              <span aria-hidden="true"> · </span>
              <span className={product.inStock ? undefined : 'font-semibold text-[#A83226]'}>
                {product.inStock ? ql.inStock : ql.outOfStock}
              </span>
            </p>
          </div>

          <button
            type="button"
            data-testid="quick-look-close"
            onClick={onClose}
            aria-label={ql.closeAria}
            className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E4DFD6] flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-5 bg-[#F2EFE9] p-4 sm:p-5 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#E4DFD6]">
            <div className="relative w-full aspect-[4/3] md:aspect-square rounded-lg overflow-hidden border border-[#E4DFD6] bg-[#FAF8F5]">
              {product.badge && product.inStock && (
                <span
                  data-testid="quick-look-badge"
                  className={`absolute top-2.5 left-2.5 z-10 pointer-events-none rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide shadow-xs ${BADGE_STYLE_MAP[product.badge]}`}
                >
                  {getProductBadgeLabel(product.badge, language)}
                </span>
              )}
              <ProductImage
                src={product.image}
                alt={product.imageAlt}
                fallbackTitle={primaryTitle}
              />
            </div>
          </div>

          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div>
                <h2
                  id="quick-look-title"
                  className="font-display text-2xl font-semibold text-[#1A1917] leading-snug"
                >
                  {primaryTitle}
                </h2>
                <p className="text-xs text-[#5E5A54] mt-0.5">{secondaryTitle}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p
                  data-testid="quick-look-price"
                  className="text-xl font-semibold text-[#1A1917] tabular-nums"
                >
                  {formatPrice(unitPrice, currency)}
                </p>

                {reviewSummary.count > 0 && (
                  <div className="inline-flex items-center gap-1 text-xs text-[#5E5A54] tabular-nums">
                    <Star
                      className="w-3.5 h-3.5 fill-[#A83226] text-[#A83226]"
                      aria-hidden="true"
                    />
                    <span className="font-semibold text-[#1A1917]">
                      {reviewSummary.averageRating.toFixed(1)}
                    </span>
                    <span>({reviewSummary.count})</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-[#5E5A54] leading-relaxed">{product.shortDescription}</p>

              <dl className="space-y-1.5 pt-2 border-t border-[#E4DFD6] text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#5E5A54] shrink-0">{ql.workshop}</dt>
                  <dd className="text-[#1A1917] font-medium text-right">{product.workshop}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#5E5A54] shrink-0">{ql.dimensions}</dt>
                  <dd className="text-[#1A1917] font-medium text-right">{product.dimensions}</dd>
                </div>
              </dl>

              {product.variants.length > 0 && (
                <div className="pt-1">
                  <p className="text-[11px] font-semibold text-[#5E5A54] mb-1.5">{ql.edition}</p>
                  <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={ql.edition}>
                    {product.variants.map((variant) => {
                      const isSelected = variant.id === activeVariantId;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                            isSelected
                              ? 'border-[#A83226] bg-[#A83226]/8 text-[#1A1917]'
                              : 'border-[#E4DFD6] bg-[#FAF8F5] text-[#5E5A54] hover:text-[#1A1917] hover:bg-[#F2EFE9]'
                          }`}
                        >
                          <span>{variant.label}</span>
                          {variant.priceDelta > 0 && (
                            <span className="ml-1 tabular-nums text-[#A83226]">
                              +{formatPrice(variant.priceDelta, currency)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E4DFD6] flex flex-wrap items-center gap-2">
              {product.inStock ? (
                <button
                  type="button"
                  data-testid="quick-look-add"
                  onClick={handleQuickBuy}
                  className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 rounded-lg bg-[#A83226] text-[#FAF8F5] text-xs font-semibold hover:bg-[#8C271D] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{ql.addToBag}</span>
                </button>
              ) : (
                <button
                  type="button"
                  data-testid="quick-look-notify"
                  onClick={() => onRequestNotify(product)}
                  className={`flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    isNotified
                      ? 'border-[#B8CEBE] bg-[#F1F6F2] text-[#2A5A3B] hover:border-[#2A5A3B]'
                      : 'border-[#A83226] bg-[#A83226] text-[#FAF8F5] hover:bg-[#8C271D]'
                  }`}
                >
                  {isNotified ? (
                    <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <Bell className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  )}
                  <span>{isNotified ? ql.alertSet : ql.notifyMe}</span>
                </button>
              )}

              <button
                type="button"
                data-testid="quick-look-full-details"
                onClick={handleViewFull}
                className="min-h-[40px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-xs font-semibold text-[#1A1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer whitespace-nowrap"
              >
                {ql.viewFullDetails}
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
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                  isWishlisted
                    ? 'border-[#A83226] bg-[#A83226]/8 text-[#A83226]'
                    : 'border-[#E4DFD6] bg-[#FAF8F5] text-[#1A1917] hover:bg-[#F2EFE9]'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? 'fill-[#A83226]' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

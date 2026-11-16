import { useMemo } from 'react';
import { Bell, Check, Eye, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import type { CurrencyCode, LanguageCode, SouvenirProduct } from '../types/store';
import {
  getCategoryLabel,
  getProductSecondaryTitle,
  getProductTitle,
  getTranslations,
} from '../utils/i18n';
import { formatPrice, getRecommendedProducts } from '../utils/storeLogic';
import { ProductImage } from './ProductImage';

interface RecommendedSectionProps {
  allProducts: SouvenirProduct[];
  wishlistIds: string[];
  recentIds: string[];
  notifiedProductIds: string[];
  currency: CurrencyCode;
  language: LanguageCode;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: SouvenirProduct) => void;
  onQuickLook: (product: SouvenirProduct) => void;
  onQuickAdd: (product: SouvenirProduct) => void;
  onRequestNotify: (product: SouvenirProduct) => void;
}

export function RecommendedSection({
  allProducts,
  wishlistIds,
  recentIds,
  notifiedProductIds,
  currency,
  language,
  onToggleWishlist,
  onSelectProduct,
  onQuickLook,
  onQuickAdd,
  onRequestNotify,
}: RecommendedSectionProps) {
  const t = getTranslations(language).recommendations;

  const recommendation = useMemo(
    () => getRecommendedProducts(allProducts, { wishlistIds, recentIds, limit: 3 }),
    [allProducts, wishlistIds, recentIds],
  );

  if (recommendation.products.length === 0) {
    return null;
  }

  const seedNames = recommendation.seedProducts
    .slice(0, 2)
    .map((p) => getProductTitle(p, language))
    .join(language === 'zh-CN' ? '、' : ' & ');

  const subtitleText =
    recommendation.basedOn === 'activity' && seedNames
      ? `${t.personalizedPrefix} ${seedNames} ${t.personalizedSuffix}`
      : t.curatedSubtitle;

  return (
    <div
      id="recommended-for-you"
      aria-labelledby="recommended-heading"
      data-testid="recommended-section"
      data-basis={recommendation.basedOn}
      className="mt-14 pt-12 border-t border-[#E4DFD6]"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#A83226]">
            <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{t.eyebrow}</span>
          </div>
          <h3
            id="recommended-heading"
            className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1917]"
          >
            {t.heading}
          </h3>
          <p
            data-testid="recommended-subtitle"
            className="text-sm text-[#5E5A54] leading-relaxed"
          >
            {subtitleText}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
        {recommendation.products.map((product) => {
          const isWishlisted = wishlistIds.includes(product.id);
          const isNotified = notifiedProductIds.includes(product.id);

          return (
            <article
              key={product.id}
              data-testid={`recommended-card-${product.id}`}
              className="group rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/45 overflow-hidden flex flex-col transition-shadow duration-200 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full bg-[#F2EFE9] overflow-hidden">
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  aria-label={`Inspect recommended ${product.name}`}
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
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-[#FAF8F5]/92 backdrop-blur-xs border border-[#E4DFD6] flex items-center justify-center shadow-xs hover:scale-105 transition-transform cursor-pointer"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickLook(product);
                  }}
                  aria-label={`Quick look ${product.name}`}
                  className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 min-h-[32px] px-2.5 py-1 rounded-lg bg-[#FAF8F5]/95 backdrop-blur-xs border border-[#E4DFD6] text-xs font-semibold text-[#1A1917] shadow-xs hover:bg-[#1A1917] hover:text-[#FAF8F5] hover:border-[#1A1917] transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{t.quickLook}</span>
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4 bg-[#FAF8F5]">
                <div>
                  <p className="text-xs font-medium text-[#5E5A54]">
                    <span>{product.origin}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{getCategoryLabel(product.category, language)}</span>
                    {!product.inStock && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span className="font-semibold text-[#A83226]">{t.outOfStock}</span>
                      </>
                    )}
                  </p>

                  <h4 className="mt-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="text-left font-display text-xl font-semibold text-[#1A1917] leading-snug hover:text-[#A83226] transition-colors cursor-pointer"
                    >
                      {getProductTitle(product, language)}
                    </button>
                  </h4>

                  <p className="text-xs text-[#5E5A54] mt-0.5">
                    {getProductSecondaryTitle(product, language)}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E4DFD6] space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#1A1917] tabular-nums">
                      {formatPrice(product.price, currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      aria-label={`View details for recommended ${product.name}`}
                      className="flex-1 px-3 py-2 min-h-[38px] rounded-lg border border-[#E4DFD6] text-xs font-medium text-[#1A1917] hover:bg-[#F2EFE9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {t.viewPiece}
                    </button>

                    {product.inStock ? (
                      <button
                        type="button"
                        data-testid={`recommended-quick-buy-${product.id}`}
                        onClick={() => onQuickAdd(product)}
                        aria-label={`Quick buy ${product.name}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{t.quickBuy}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onRequestNotify(product)}
                        aria-label={`Notify me when ${product.name} is back in stock`}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
            </article>
          );
        })}
      </div>
    </div>
  );
}

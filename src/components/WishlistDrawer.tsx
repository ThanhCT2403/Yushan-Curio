import { useEffect } from 'react';
import { Bell, Check, Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import type { CurrencyCode, LanguageCode, SouvenirProduct } from '../types/store';
import { getCategoryLabel, getProductTitle, getTranslations } from '../utils/i18n';
import { formatPrice } from '../utils/storeLogic';
import { ProductImage } from './ProductImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: SouvenirProduct[];
  currency: CurrencyCode;
  language: LanguageCode;
  notifiedProductIds?: string[];
  suppressEscape?: boolean;
  onRemoveFromWishlist: (productId: string) => void;
  onClearWishlist: () => void;
  onAddToBag: (product: SouvenirProduct) => void;
  onRequestNotify?: (product: SouvenirProduct) => void;
  onAddAllToBag: () => void;
  onInspectProduct: (product: SouvenirProduct) => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  products,
  currency,
  language,
  notifiedProductIds = [],
  suppressEscape = false,
  onRemoveFromWishlist,
  onClearWishlist,
  onAddToBag,
  onRequestNotify,
  onAddAllToBag,
  onInspectProduct,
}: WishlistDrawerProps) {
  const t = getTranslations(language).wishlist;

  useEffect(() => {
    if (!isOpen || suppressEscape) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, suppressEscape, onClose]);

  if (!isOpen) return null;

  const inStockCount = products.filter((p) => p.inStock).length;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1A1917]/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.dialogAria}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#FAF8F5] h-full flex flex-col border-l border-[#E4DFD6] shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E4DFD6] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-[#A83226]" aria-hidden="true" />
            <h2 className="font-display text-2xl font-semibold text-[#1A1917]">
              {t.title} ({products.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeAria}
            className="w-10 h-10 rounded-lg border border-[#E4DFD6] flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {products.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-12 h-12 rounded-full bg-[#F2EFE9] flex items-center justify-center mb-4">
                <Heart className="w-5 h-5 text-[#5E5A54]" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#1A1917]">
                {t.emptyTitle}
              </h3>
              <p className="mt-2 text-sm text-[#5E5A54] max-w-xs">{t.emptyDescription}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 min-h-[40px] rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors cursor-pointer"
              >
                {t.browseCollection}
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#E4DFD6]" data-testid="wishlist-items">
              {products.map((product) => {
                const isNotified = notifiedProductIds.includes(product.id);
                const displayTitle = getProductTitle(product, language);
                return (
                  <li key={product.id} className="py-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onInspectProduct(product);
                      }}
                      aria-label={`Inspect ${product.name}`}
                      className="w-24 h-20 rounded-lg overflow-hidden border border-[#E4DFD6] bg-[#F2EFE9] shrink-0 cursor-pointer"
                    >
                      <ProductImage
                        src={product.image}
                        alt={product.imageAlt}
                        fallbackTitle={displayTitle}
                      />
                    </button>

                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-[#5E5A54]">
                            {product.origin} · {getCategoryLabel(product.category, language)}
                            {!product.inStock && (
                              <span className="font-semibold text-[#A83226]">
                                {' '}
                                · {t.outOfStock}
                              </span>
                            )}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onInspectProduct(product);
                            }}
                            className="text-left text-sm font-semibold text-[#1A1917] hover:text-[#A83226] transition-colors truncate block max-w-full cursor-pointer"
                          >
                            {displayTitle}
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-[#1A1917] tabular-nums shrink-0">
                          {formatPrice(product.price, currency)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        {product.inStock ? (
                          <button
                            type="button"
                            onClick={() => onAddToBag(product)}
                            aria-label={`Add ${product.name} to bag`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[36px] rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{t.addToBag}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onRequestNotify?.(product)}
                            aria-label={`Notify me when ${product.name} is back in stock`}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[36px] rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                              isNotified
                                ? 'border-[#B8CEBE] bg-[#F1F6F2] text-[#2A5A3B]'
                                : 'border-[#A83226] bg-[#FAF8F5] text-[#A83226] hover:bg-[#A83226] hover:text-[#FAF8F5]'
                            }`}
                          >
                            {isNotified ? (
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            ) : (
                              <Bell className="w-3.5 h-3.5" aria-hidden="true" />
                            )}
                            <span>{isNotified ? t.alertSet : t.notifyMe}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onRemoveFromWishlist(product.id)}
                          aria-label={`Remove ${product.name} from wishlist`}
                          className="inline-flex items-center gap-1 text-xs text-[#5E5A54] hover:text-[#A83226] py-1.5 px-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{t.remove}</span>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {products.length > 0 && (
          <div className="px-6 py-4 border-t border-[#E4DFD6] bg-[#FAF8F5] flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClearWishlist}
              className="px-4 py-3 min-h-[44px] rounded-lg border border-[#E4DFD6] text-xs font-semibold text-[#1A1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.clearAll}
            </button>
            <button
              type="button"
              disabled={inStockCount === 0}
              onClick={onAddAllToBag}
              className="flex-1 min-h-[44px] px-5 py-3 rounded-lg bg-[#A83226] text-[#FAF8F5] text-sm font-semibold hover:bg-[#8C271D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
            >
              {inStockCount > 0
                ? `${t.moveInStockPrefix} (${inStockCount})`
                : t.noInStockItems}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

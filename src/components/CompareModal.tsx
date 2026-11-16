import { useEffect } from 'react';
import { ArrowLeftRight, Bell, Check, ShoppingBag, Star, Trash2, X } from 'lucide-react';
import type { CurrencyCode, LanguageCode, SouvenirProduct } from '../types/store';
import {
  getCategoryLabel,
  getProductSecondaryTitle,
  getProductTitle,
  getTranslations,
} from '../utils/i18n';
import { formatPrice, getReviewSummary } from '../utils/storeLogic';
import { ProductImage } from './ProductImage';

interface CompareModalProps {
  isOpen: boolean;
  products: SouvenirProduct[];
  currency: CurrencyCode;
  language: LanguageCode;
  notifiedProductIds?: string[];
  suppressEscape?: boolean;
  onClose: () => void;
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
  onInspectProduct: (product: SouvenirProduct) => void;
  onAddToBag: (product: SouvenirProduct) => void;
  onRequestNotify?: (product: SouvenirProduct) => void;
}

export function CompareModal({
  isOpen,
  products,
  currency,
  language,
  notifiedProductIds = [],
  suppressEscape = false,
  onClose,
  onRemoveProduct,
  onClearAll,
  onInspectProduct,
  onAddToBag,
  onRequestNotify,
}: CompareModalProps) {
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

  const t = getTranslations(language);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1917]/55 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-[#FAF8F5] border border-[#E4DFD6] rounded-xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Header Bar */}
        <div className="shrink-0 flex items-center justify-between gap-4 px-6 sm:px-8 py-4 border-b border-[#E4DFD6] bg-[#FAF8F5]">
          <div className="flex items-center gap-3 min-w-0">
            <ArrowLeftRight className="w-5 h-5 text-[#A83226] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h2
                id="compare-modal-title"
                className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1917] leading-tight"
              >
                {t.compare.title}
              </h2>
              <p className="text-xs text-[#5E5A54] mt-0.5 tabular-nums">
                {t.compare.subtitlePrefix} ({products.length} / 3 {t.compare.subtitleSuffix})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {products.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="px-3.5 py-2 min-h-[40px] rounded-lg border border-[#E4DFD6] text-xs font-semibold text-[#1A1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer whitespace-nowrap"
              >
                {t.compare.clearAll}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={t.compare.closeAria}
              className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E4DFD6] flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {products.length === 0 ? (
            <div className="px-6 py-16 text-center max-w-md mx-auto">
              <h3 className="font-display text-2xl font-semibold text-[#1A1917]">
                {t.compare.emptyTitle}
              </h3>
              <p className="mt-2 text-sm text-[#5E5A54]">{t.compare.emptyDescription}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 min-h-[40px] rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors cursor-pointer"
              >
                {t.compare.returnToCollection}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                aria-label={t.compare.tableAria}
                className="w-full min-w-[640px] border-collapse text-left"
              >
                <thead>
                  <tr className="border-b border-[#E4DFD6] bg-[#F2EFE9]/50 align-top">
                    <th
                      scope="col"
                      className="w-44 sm:w-48 px-6 py-5 text-xs font-semibold text-[#5E5A54] align-bottom"
                    >
                      {t.compare.artifactSpec}
                    </th>
                    {products.map((product) => {
                      const primaryTitle = getProductTitle(product, language);
                      const secondaryTitle = getProductSecondaryTitle(product, language);
                      return (
                        <th key={product.id} scope="col" className="px-5 py-5 min-w-[210px] align-top">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-medium text-[#5E5A54]">
                                {getCategoryLabel(product.category, language)}
                              </span>
                              <button
                                type="button"
                                onClick={() => onRemoveProduct(product.id)}
                                aria-label={`Remove ${product.name} from comparison`}
                                className="inline-flex items-center gap-1 text-xs font-medium text-[#5E5A54] hover:text-[#A83226] py-1 px-1.5 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>{t.compare.remove}</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onInspectProduct(product);
                              }}
                              aria-label={`Inspect ${product.name}`}
                              className="block w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#E4DFD6] bg-[#FAF8F5] cursor-pointer"
                            >
                              <ProductImage
                                src={product.image}
                                alt={product.imageAlt}
                                fallbackTitle={primaryTitle}
                              />
                            </button>

                            <div>
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onInspectProduct(product);
                                }}
                                className="text-left font-display text-xl font-semibold text-[#1A1917] hover:text-[#A83226] transition-colors leading-snug cursor-pointer"
                              >
                                {primaryTitle}
                              </button>
                              <p className="text-xs font-normal text-[#5E5A54] mt-0.5">
                                {secondaryTitle}
                              </p>
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E4DFD6] text-sm">
                  <tr className="bg-[#FAF8F5]">
                    <th scope="row" className="px-6 py-4 text-xs font-semibold text-[#5E5A54]">
                      {t.compare.price}
                    </th>
                    {products.map((product) => (
                      <td
                        key={product.id}
                        className="px-5 py-4 font-semibold text-base text-[#1A1917] tabular-nums"
                      >
                        {formatPrice(product.price, currency)}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-[#F2EFE9]/35">
                    <th scope="row" className="px-6 py-4 text-xs font-semibold text-[#5E5A54]">
                      {t.compare.originRegion}
                    </th>
                    {products.map((product) => (
                      <td key={product.id} className="px-5 py-4 text-[#1A1917]">
                        {product.origin}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-[#FAF8F5]">
                    <th scope="row" className="px-6 py-4 text-xs font-semibold text-[#5E5A54]">
                      {t.compare.workshopKiln}
                    </th>
                    {products.map((product) => (
                      <td key={product.id} className="px-5 py-4 font-medium text-[#1A1917]">
                        {product.workshop}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-[#F2EFE9]/35">
                    <th scope="row" className="px-6 py-4 text-xs font-semibold text-[#5E5A54]">
                      {t.compare.materialsCraft}
                    </th>
                    {products.map((product) => (
                      <td key={product.id} className="px-5 py-4 text-[#5E5A54] leading-relaxed">
                        {product.materials}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-[#FAF8F5]">
                    <th scope="row" className="px-6 py-4 text-xs font-semibold text-[#5E5A54]">
                      {t.compare.dimensionsCapacity}
                    </th>
                    {products.map((product) => (
                      <td
                        key={product.id}
                        className="px-5 py-4 text-[#1A1917] tabular-nums leading-relaxed"
                      >
                        {product.dimensions}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-[#F2EFE9]/35">
                    <th scope="row" className="px-6 py-4 text-xs font-semibold text-[#5E5A54]">
                      {t.compare.collectorRating}
                    </th>
                    {products.map((product) => {
                      const summary = getReviewSummary(product.reviews);
                      return (
                        <td key={product.id} className="px-5 py-4">
                          {summary.count > 0 ? (
                            <div className="inline-flex items-center gap-1.5 text-[#1A1917]">
                              <Star
                                className="w-4 h-4 fill-[#A83226] text-[#A83226] shrink-0"
                                aria-hidden="true"
                              />
                              <span className="font-semibold tabular-nums">
                                {summary.averageRating.toFixed(1)}
                              </span>
                              <span className="text-xs text-[#5E5A54] tabular-nums">
                                ({summary.count}{' '}
                                {summary.count === 1 ? t.pdp.reviewSingular : t.pdp.reviewPlural})
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#5E5A54]">
                              {t.compare.noReviewsYet}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="bg-[#FAF8F5]">
                    <th scope="row" className="px-6 py-4 text-xs font-semibold text-[#5E5A54]">
                      {t.compare.availableEditions}
                    </th>
                    {products.map((product) => (
                      <td key={product.id} className="px-5 py-4 text-xs text-[#5E5A54]">
                        <ul className="space-y-1">
                          {product.variants.map((v) => (
                            <li key={v.id} className="text-[#1A1917]">
                              {v.label}{' '}
                              <span className="text-[#5E5A54] tabular-nums">
                                (
                                {v.priceDelta > 0
                                  ? `+${formatPrice(v.priceDelta, currency)}`
                                  : t.compare.standard}
                                )
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-[#F2EFE9]/35">
                    <th scope="row" className="px-6 py-4 text-xs font-semibold text-[#5E5A54]">
                      {t.compare.provenanceNote}
                    </th>
                    {products.map((product) => (
                      <td key={product.id} className="px-5 py-4 text-xs text-[#5E5A54]">
                        {product.editionNote
                          ? `${product.editionNote} · ${t.compare.bilingualCardSuffix}`
                          : t.compare.defaultProvenanceNote}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-[#FAF8F5]">
                    <th scope="row" className="px-6 py-4 text-xs font-semibold text-[#5E5A54]">
                      {t.compare.availability}
                    </th>
                    {products.map((product) => (
                      <td key={product.id} className="px-5 py-4 text-xs font-semibold">
                        <span className={product.inStock ? 'text-[#2A5A3B]' : 'text-[#A83226]'}>
                          {product.inStock ? t.compare.inStock : t.compare.outOfStock}
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-[#F2EFE9]/35">
                    <th scope="row" className="px-6 py-5 text-xs font-semibold text-[#5E5A54]">
                      {t.compare.action}
                    </th>
                    {products.map((product) => {
                      const isNotified = notifiedProductIds.includes(product.id);
                      return (
                        <td key={product.id} className="px-5 py-5">
                          {product.inStock ? (
                            <button
                              type="button"
                              onClick={() => onAddToBag(product)}
                              aria-label={`Add ${product.name} to bag`}
                              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[40px] rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>
                                {t.compare.addToBag} · {formatPrice(product.price, currency)}
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onRequestNotify?.(product)}
                              aria-label={`Notify me when ${product.name} is back in stock`}
                              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[40px] rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
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
                              <span>{isNotified ? t.compare.alertSet : t.compare.notifyMe}</span>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>

              {products.length === 1 && (
                <p className="px-6 py-4 text-xs text-[#5E5A54] border-t border-[#E4DFD6] bg-[#F2EFE9]/40">
                  {t.compare.tipOneSelected}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

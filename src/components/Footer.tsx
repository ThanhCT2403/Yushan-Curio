import { FormEvent, useState } from 'react';
import { AlertCircle, PackageSearch } from 'lucide-react';
import type { LanguageCode } from '../types/store';
import { getTranslations } from '../utils/i18n';
import { normalizeOrderNumber } from '../utils/storeLogic';

interface FooterProps {
  language: LanguageCode;
  onOpenOrderLookup: (orderNumber?: string) => void;
  onOpenOrderTracking: () => void;
}

export function Footer({ language, onOpenOrderLookup, onOpenOrderTracking }: FooterProps) {
  const [orderInput, setOrderInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const allT = getTranslations(language);
  const t = allT.footer;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const normalized = normalizeOrderNumber(orderInput);
    if (!normalized) {
      setInputError(t.emptyOrderError);
      return;
    }
    setInputError(null);
    onOpenOrderLookup(orderInput);
  };

  return (
    <footer
      id="footer-shipping"
      className="border-t border-[#E4DFD6] bg-[#F2EFE9]/70"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          <div className="md:col-span-4 space-y-3">
            <p className="font-display text-2xl font-semibold text-[#1A1917]">
              {allT.brand.fullTitle}
            </p>
            <p className="text-sm text-[#5E5A54] leading-relaxed max-w-sm">
              {t.brandSummary}
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h2 className="font-display text-lg font-semibold text-[#1A1917]">
              {t.shippingHeading}
            </h2>
            <p className="text-sm text-[#5E5A54] leading-relaxed">{t.shippingDescription}</p>
          </div>

          <div className="md:col-span-2 space-y-2">
            <h2 className="font-display text-lg font-semibold text-[#1A1917]">
              {t.navigationHeading}
            </h2>
            <ul className="space-y-2 text-sm text-[#5E5A54]">
              <li>
                <a href="#collection" className="hover:text-[#1A1917] transition-colors">
                  {t.navCollection}
                </a>
              </li>
              <li>
                <a href="#craftsmanship" className="hover:text-[#1A1917] transition-colors">
                  {t.navWorkshops}
                </a>
              </li>
              <li>
                <a href="#collectors" className="hover:text-[#1A1917] transition-colors">
                  {t.navCollectors}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenOrderTracking}
                  className="hover:text-[#1A1917] transition-colors cursor-pointer text-left"
                >
                  {t.navTrackOrder}
                </button>
              </li>
            </ul>
          </div>

          <div id="footer-order-lookup" className="md:col-span-3 space-y-2.5">
            <div className="flex items-center gap-2">
              <PackageSearch className="w-4 h-4 text-[#A83226] shrink-0" aria-hidden="true" />
              <h2 className="font-display text-lg font-semibold text-[#1A1917]">
                {t.orderLookupHeading}
              </h2>
            </div>
            <p className="text-xs text-[#5E5A54] leading-relaxed">
              {t.orderLookupDescription}
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-2">
              <label htmlFor="footer-order-number-input" className="sr-only">
                {t.orderNumberLabel}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="footer-order-number-input"
                  type="text"
                  value={orderInput}
                  onChange={(e) => {
                    setOrderInput(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  placeholder={t.orderNumberPlaceholder}
                  className="min-w-0 flex-1 min-h-[40px] px-3 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-xs text-[#1A1917] placeholder:text-[#5E5A54]/70 tabular-nums focus:outline-none focus:border-[#1A1917]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 min-h-[40px] rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {t.lookUpButton}
                </button>
              </div>

              {inputError && (
                <p role="alert" className="flex items-center gap-1.5 text-xs text-[#A83226]">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{inputError}</span>
                </p>
              )}
            </form>

            <p className="text-[11px] text-[#5E5A54] tabular-nums">
              {t.samplesPrefix}{' '}
              {(['YS-2114', 'YS-2088', 'YS-2041'] as const).map((sampleId, idx) => (
                <span key={sampleId}>
                  {idx > 0 ? ' · ' : ''}
                  <button
                    type="button"
                    onClick={() => {
                      setOrderInput(sampleId);
                      setInputError(null);
                      onOpenOrderLookup(sampleId);
                    }}
                    className="underline underline-offset-2 hover:text-[#1A1917] cursor-pointer"
                  >
                    {sampleId}
                  </button>
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E4DFD6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[#5E5A54]">
          <p>{t.copyright}</p>
          <p>{t.guarantee}</p>
        </div>
      </div>
    </footer>
  );
}

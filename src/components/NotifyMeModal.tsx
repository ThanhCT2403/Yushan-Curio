import { FormEvent, useEffect, useState } from 'react';
import { AlertCircle, Bell, CheckCircle2, X } from 'lucide-react';
import type {
  CurrencyCode,
  LanguageCode,
  RestockAlertSubscription,
  SouvenirProduct,
} from '../types/store';
import { getProductTitle, getTranslations } from '../utils/i18n';
import { formatPrice, validateNewsletterEmail } from '../utils/storeLogic';
import { ProductImage } from './ProductImage';

interface NotifyMeModalProps {
  product: SouvenirProduct | null;
  currency: CurrencyCode;
  language: LanguageCode;
  existingAlert?: RestockAlertSubscription;
  onClose: () => void;
  onSubmitAlert: (product: SouvenirProduct, email: string) => void;
}

export function NotifyMeModal({
  product,
  currency,
  language,
  existingAlert,
  onClose,
  onSubmitAlert,
}: NotifyMeModalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  const t = getTranslations(language).notifyModal;

  useEffect(() => {
    if (!product) return;
    setEmailInput(existingAlert?.email ?? '');
    setError(null);
    setIsEditingExisting(false);
  }, [product, existingAlert]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const displayTitle = getProductTitle(product, language);
  const showConfirmation = Boolean(existingAlert) && !isEditingExisting;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const check = validateNewsletterEmail(emailInput);
    if (!check.isValid) {
      setError(check.error ?? 'Please enter a valid email address.');
      return;
    }
    setError(null);
    setIsEditingExisting(false);
    onSubmitAlert(product, check.normalizedEmail);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-[#1A1917]/55 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notify-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-[#FAF8F5] border border-[#E4DFD6] rounded-xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Fixed Header */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-4 border-b border-[#E4DFD6] bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Bell className="w-5 h-5 text-[#A83226] shrink-0" aria-hidden="true" />
            <h2
              id="notify-modal-title"
              className="font-display text-2xl font-semibold text-[#1A1917] leading-tight truncate"
            >
              {t.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeAria}
            className="w-10 h-10 shrink-0 rounded-lg bg-[#FAF8F5] border border-[#E4DFD6] flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Product Summary */}
          <div className="flex items-center gap-3.5 rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/60 p-3.5">
            <div className="w-20 h-16 rounded-lg overflow-hidden border border-[#E4DFD6] bg-[#FAF8F5] shrink-0">
              <ProductImage
                src={product.image}
                alt={product.imageAlt}
                fallbackTitle={displayTitle}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-[#A83226] tabular-nums">
                {t.outOfStockPrefix} · {formatPrice(product.price, currency)}
              </p>
              <p className="font-display text-lg font-semibold text-[#1A1917] leading-snug truncate">
                {displayTitle}
              </p>
              <p className="text-xs text-[#5E5A54] truncate">
                {product.origin} · {product.workshop}
              </p>
            </div>
          </div>

          {showConfirmation && existingAlert ? (
            <div className="space-y-4">
              <div
                role="status"
                aria-live="polite"
                className="rounded-xl border border-[#B8CEBE] bg-[#F1F6F2] p-4 flex items-start gap-3"
              >
                <CheckCircle2
                  className="w-5 h-5 text-[#2A5A3B] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-[#1A1917]">
                    {t.activePrefix}{' '}
                    <span className="break-all text-[#2A5A3B]">{existingAlert.email}</span>
                  </p>
                  <p className="text-[#5E5A54] leading-relaxed">
                    {t.activeDescriptionPrefix} {displayTitle} {t.activeDescriptionMid}{' '}
                    {product.workshop}.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditingExisting(true)}
                  className="px-4 py-2.5 min-h-[40px] rounded-lg border border-[#E4DFD6] text-xs font-semibold text-[#1A1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {t.updateEmail}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 min-h-[40px] rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {t.done}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <p className="text-sm text-[#5E5A54] leading-relaxed">
                {t.formPromptPrefix}{' '}
                <span className="font-medium text-[#1A1917]">{displayTitle}</span>{' '}
                {t.formPromptSuffix}
              </p>

              <div className="space-y-1.5">
                <label
                  htmlFor="notify-email-input"
                  className="block text-xs font-semibold text-[#1A1917]"
                >
                  {t.emailLabel}
                </label>
                <input
                  id="notify-email-input"
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (error) setError(null);
                  }}
                  aria-invalid={Boolean(error)}
                  placeholder="collector@example.com"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] placeholder:text-[#5E5A54]/70 focus:outline-none focus:border-[#1A1917]"
                />
                {error && (
                  <p role="alert" className="flex items-center gap-1.5 text-xs text-[#A83226]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 min-h-[42px] rounded-lg border border-[#E4DFD6] text-xs font-semibold text-[#1A1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[42px] rounded-lg bg-[#A83226] text-[#FAF8F5] text-xs font-semibold hover:bg-[#8C271D] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Bell className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.notifyMe}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

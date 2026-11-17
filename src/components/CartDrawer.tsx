import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  CheckCircle2,
  Minus,
  PenLine,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import type {
  CartItem,
  CartTotals,
  CheckoutErrors,
  CheckoutFormValues,
  ConfirmedOrder,
  CurrencyCode,
  LanguageCode,
  SouvenirProduct,
} from '../types/store';
import { getProductTitle, getTranslations } from '../utils/i18n';
import {
  FREE_SHIPPING_THRESHOLD,
  GIFT_WRAP_FEE,
  MAX_GIFT_MESSAGE_LENGTH,
  calculateLoyaltyPoints,
  formatLoyaltyPoints,
  formatPrice,
  getUnitPrice,
  validateCheckoutForm,
} from '../utils/storeLogic';
import { ProductImage } from './ProductImage';

type DrawerView = 'bag' | 'checkout' | 'confirmed';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  products: SouvenirProduct[];
  totals: CartTotals;
  giftWrap: boolean;
  onToggleGiftWrap: (next: boolean) => void;
  giftMessage: string;
  onChangeGiftMessage: (message: string) => void;
  onUpdateQuantity: (productId: string, variantId: string, quantity: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  confirmedOrder: ConfirmedOrder | null;
  currency: CurrencyCode;
  language: LanguageCode;
  onSubmitOrder: (customer: CheckoutFormValues) => void;
  onClearConfirmedOrder: () => void;
}

const INITIAL_FORM: CheckoutFormValues = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  giftMessage: '',
  paymentMethod: 'card',
};

export function CartDrawer({
  isOpen,
  onClose,
  items,
  products,
  totals,
  giftWrap,
  onToggleGiftWrap,
  giftMessage,
  onChangeGiftMessage,
  onUpdateQuantity,
  onRemoveItem,
  confirmedOrder,
  currency,
  language,
  onSubmitOrder,
  onClearConfirmedOrder,
}: CartDrawerProps) {
  const [view, setView] = useState<DrawerView>('bag');
  const [formValues, setFormValues] = useState<CheckoutFormValues>(() => ({
    ...INITIAL_FORM,
    giftMessage,
  }));
  const [errors, setErrors] = useState<CheckoutErrors>({});

  useEffect(() => {
    if (!isOpen) return;
    if (confirmedOrder) {
      setView('confirmed');
    } else {
      setView('bag');
      setFormValues((prev) => ({ ...prev, giftMessage }));
    }
  }, [isOpen, confirmedOrder, giftMessage]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const t = getTranslations(language);

  const updateField = <K extends keyof CheckoutFormValues>(
    field: K,
    value: CheckoutFormValues[K],
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof CheckoutErrors];
        return next;
      });
    }
  };

  const handleCheckoutSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = validateCheckoutForm(formValues);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onSubmitOrder(formValues);
    setFormValues(INITIAL_FORM);
    setView('confirmed');
  };

  const handleContinueShopping = () => {
    onClearConfirmedOrder();
    setView('bag');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1A1917]/55"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.cart.dialogAria}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#FAF8F5] h-full flex flex-col border-l border-[#E4DFD6] shadow-2xl"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E4DFD6] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            {view === 'checkout' && (
              <button
                type="button"
                onClick={() => setView('bag')}
                aria-label={t.cart.backToBagAria}
                className="w-9 h-9 rounded-lg border border-[#E4DFD6] flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            <h2 className="font-display text-2xl font-semibold text-[#1A1917]">
              {view === 'bag' && `${t.cart.bagTitle} (${totals.itemCount})`}
              {view === 'checkout' && t.cart.checkoutTitle}
              {view === 'confirmed' && t.cart.receiptTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.cart.closeAria}
            className="w-10 h-10 rounded-lg border border-[#E4DFD6] flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {view === 'confirmed' && confirmedOrder ? (
            <div className="space-y-6" data-testid="order-confirmation">
              <div className="rounded-xl border border-[#E4DFD6] bg-[#F2EFE9] p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#A83226]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-semibold">{t.cart.orderConfirmedTag}</span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#1A1917]">
                  {t.cart.orderConfirmedHeadingPrefix}
                  {confirmedOrder.orderNumber}
                  {t.cart.orderConfirmedHeadingSuffix}
                </h3>
                <p className="text-sm text-[#5E5A54]">
                  {t.cart.receiptPreparedFor} {confirmedOrder.customer.email}.
                </p>
              </div>

              <div className="space-y-3 text-sm border-b border-[#E4DFD6] pb-5">
                <h4 className="font-semibold text-[#1A1917]">{t.cart.deliveryDetails}</h4>
                <p className="text-[#5E5A54]">
                  {confirmedOrder.customer.fullName} · {confirmedOrder.customer.phone}
                </p>
                <p className="text-[#5E5A54]">
                  {confirmedOrder.customer.address}, {confirmedOrder.customer.city}{' '}
                  {confirmedOrder.customer.postalCode}
                </p>
                <p className="text-[#5E5A54]">
                  {t.cart.paymentLabel}:{' '}
                  <span className="text-[#1A1917] font-medium">
                    {confirmedOrder.customer.paymentMethod === 'cod'
                      ? t.cart.paymentCod
                      : t.cart.paymentCard}
                  </span>
                </p>
                {confirmedOrder.customer.giftMessage.trim() && (
                  <p className="text-[#5E5A54]">
                    {t.cart.giftCardNoteLabel}: “{confirmedOrder.customer.giftMessage}”
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#1A1917]">{t.cart.itemizedReceipt}</h4>
                <ul className="divide-y divide-[#E4DFD6] border-y border-[#E4DFD6]">
                  {confirmedOrder.items.map((item, idx) => {
                    const matchedProduct = products.find((p) => p.id === item.productId);
                    const displayItemName = matchedProduct
                      ? getProductTitle(matchedProduct, language)
                      : item.name;
                    return (
                      <li
                        key={`${item.productId}-${idx}`}
                        className="py-3 flex items-start justify-between gap-4 text-sm"
                      >
                        <div>
                          <p className="font-medium text-[#1A1917]">{displayItemName}</p>
                          <p className="text-xs text-[#5E5A54]">
                            {item.variantLabel} · {t.cart.qtyLabel} {item.quantity}
                          </p>
                        </div>
                        <span className="font-semibold text-[#1A1917] tabular-nums">
                          {formatPrice(item.lineTotal, currency)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <dl className="space-y-2 pt-2 text-sm">
                  <div className="flex justify-between text-[#5E5A54]">
                    <dt>{t.cart.subtotal}</dt>
                    <dd className="tabular-nums">
                      {formatPrice(confirmedOrder.totals.subtotal, currency)}
                    </dd>
                  </div>
                  {confirmedOrder.totals.giftWrapFee > 0 && (
                    <div className="flex justify-between text-[#5E5A54]">
                      <dt>{t.cart.giftWrap}</dt>
                      <dd className="tabular-nums">
                        {formatPrice(confirmedOrder.totals.giftWrapFee, currency)}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between text-[#5E5A54]">
                    <dt>{t.cart.expressShipping}</dt>
                    <dd className="tabular-nums">
                      {confirmedOrder.totals.shippingFee === 0
                        ? t.cart.complimentary
                        : formatPrice(confirmedOrder.totals.shippingFee, currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E4DFD6] font-semibold text-[#1A1917] text-base">
                    <dt>{t.cart.totalPaidDue}</dt>
                    <dd className="tabular-nums">
                      {formatPrice(confirmedOrder.totals.total, currency)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-12 h-12 rounded-full bg-[#F2EFE9] flex items-center justify-center mb-4">
                <ShoppingBag className="w-5 h-5 text-[#5E5A54]" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#1A1917]">
                {t.cart.emptyTitle}
              </h3>
              <p className="mt-2 text-sm text-[#5E5A54] max-w-xs">{t.cart.emptyDescription}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 min-h-[40px] rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors cursor-pointer"
              >
                {t.cart.browseCollection}
              </button>
            </div>
          ) : view === 'bag' ? (
            <div className="space-y-5">
              {/* Free shipping status */}
              <div className="rounded-lg border border-[#E4DFD6] bg-[#F2EFE9] px-4 py-3 text-xs text-[#1A1917]">
                {totals.remainingForFreeShipping === 0 ? (
                  <span>
                    {t.cart.freeShippingUnlockedPrefix}{' '}
                    <span className="tabular-nums">
                      {formatPrice(FREE_SHIPPING_THRESHOLD, currency)}+
                    </span>
                    ).
                  </span>
                ) : (
                  <span>
                    {t.cart.freeShippingRemainingPrefix}{' '}
                    <strong className="tabular-nums">
                      {formatPrice(totals.remainingForFreeShipping, currency)}
                    </strong>{' '}
                    {t.cart.freeShippingRemainingMid}{' '}
                    <span className="tabular-nums">
                      {formatPrice(FREE_SHIPPING_THRESHOLD, currency)}+
                    </span>
                    ).
                  </span>
                )}
              </div>

              {/* Cart Items */}
              <ul className="divide-y divide-[#E4DFD6]">
                {items.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;
                  const variant =
                    product.variants.find((v) => v.id === item.variantId) ??
                    product.variants[0];
                  const unitPrice = getUnitPrice(product, item.variantId);

                  const displayTitle = getProductTitle(product, language);

                  return (
                    <li
                      key={`${item.productId}-${item.variantId}`}
                      className="py-4 flex gap-4"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#E4DFD6] bg-[#F2EFE9] shrink-0">
                        <ProductImage
                          src={product.image}
                          alt={product.imageAlt}
                          fallbackTitle={displayTitle}
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-[#1A1917] truncate">
                              {displayTitle}
                            </h3>
                            <p className="text-xs text-[#5E5A54] mt-0.5">
                              {variant?.label}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-[#1A1917] tabular-nums shrink-0">
                            {formatPrice(unitPrice * item.quantity, currency)}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-md border border-[#E4DFD6]">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(
                                  item.productId,
                                  item.variantId,
                                  item.quantity - 1,
                                )
                              }
                              aria-label={`Decrease quantity of ${product.name}`}
                              className="w-8 h-8 flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(
                                  item.productId,
                                  item.variantId,
                                  item.quantity + 1,
                                )
                              }
                              aria-label={`Increase quantity of ${product.name}`}
                              className="w-8 h-8 flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.productId, item.variantId)}
                            aria-label={`Remove ${product.name} from bag`}
                            className="inline-flex items-center gap-1 text-xs text-[#5E5A54] hover:text-[#A83226] py-1 px-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{t.cart.remove}</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Gift Wrap Toggle */}
              <div className="rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/60 p-4 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => onToggleGiftWrap(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#A83226] rounded cursor-pointer"
                  />
                  <div className="flex-1 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-[#1A1917]">
                        {t.cart.giftWrapTitle}
                      </span>
                      <span className="font-semibold text-[#1A1917] tabular-nums">
                        +{formatPrice(GIFT_WRAP_FEE, currency)}
                      </span>
                    </div>
                    <p className="text-xs text-[#5E5A54] mt-1">
                      {t.cart.giftWrapDescription}
                    </p>
                  </div>
                </label>

                {/* Optional Personalized Gift Message stored in cart state */}
                <div className="pt-3.5 border-t border-[#E4DFD6] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="cart-gift-message"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1917]"
                    >
                      <PenLine className="w-3.5 h-3.5 text-[#A83226] shrink-0" aria-hidden="true" />
                      <span>{t.cart.giftMessageTitle}</span>
                    </label>
                    {giftMessage.length > 0 && (
                      <button
                        type="button"
                        data-testid="cart-gift-message-clear"
                        onClick={() => {
                          onChangeGiftMessage('');
                          setFormValues((prev) => ({ ...prev, giftMessage: '' }));
                        }}
                        className="text-[11px] font-medium text-[#5E5A54] hover:text-[#A83226] transition-colors cursor-pointer"
                      >
                        {t.cart.giftMessageClear}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[#5E5A54]">{t.cart.giftMessageSubtitle}</p>
                  <textarea
                    id="cart-gift-message"
                    data-testid="cart-gift-message"
                    rows={3}
                    maxLength={MAX_GIFT_MESSAGE_LENGTH}
                    value={giftMessage}
                    onChange={(e) => {
                      const next = e.target.value;
                      onChangeGiftMessage(next);
                      setFormValues((prev) => ({ ...prev, giftMessage: next }));
                    }}
                    placeholder={t.cart.giftMessagePlaceholder}
                    className="w-full px-3 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] placeholder:text-[#5E5A54]/65 focus:border-[#1A1917] focus:outline-none resize-none"
                  />
                  <div className="flex items-center justify-between gap-2 text-[11px] text-[#5E5A54]">
                    <span>
                      {giftMessage.trim().length > 0 ? t.cart.giftMessageSavedBadge : ''}
                    </span>
                    <span data-testid="cart-gift-message-count" className="tabular-nums">
                      {giftMessage.length}/{MAX_GIFT_MESSAGE_LENGTH}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form
              id="checkout-form"
              noValidate
              onSubmit={handleCheckoutSubmit}
              className="space-y-4"
            >
              <div className="rounded-lg border border-[#E4DFD6] bg-[#F2EFE9] p-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#5E5A54]">
                    {totals.itemCount}{' '}
                    {totals.itemCount === 1 ? t.cart.itemsCountSingular : t.cart.itemsCountPlural} ·{' '}
                    {t.cart.expressDelivery}
                  </span>
                  <span className="font-semibold text-[#1A1917] tabular-nums">
                    {t.cart.totalLabel} {formatPrice(totals.total, currency)}
                  </span>
                </div>
                <p
                  data-testid="checkout-loyalty-notice"
                  className="flex items-center gap-1.5 text-xs text-[#5E5A54]"
                >
                  <Award className="w-3.5 h-3.5 text-[#A83226] shrink-0" aria-hidden="true" />
                  <span>
                    {t.cart.loyaltyEstimatedPrefix}{' '}
                    <strong className="text-[#1A1917] tabular-nums">
                      +{formatLoyaltyPoints(calculateLoyaltyPoints(totals.total))} {t.header.pointsUnit}
                    </strong>{' '}
                    · {t.cart.loyaltyRedeemNote}
                  </span>
                </p>
              </div>

              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-semibold text-[#1A1917] mb-1.5"
                >
                  {t.cart.fullName}
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={formValues.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  aria-invalid={Boolean(errors.fullName)}
                  placeholder={t.cart.fullNamePlaceholder}
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] focus:border-[#1A1917] focus:outline-none"
                />
                {errors.fullName && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#A83226]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="checkout-email"
                    className="block text-xs font-semibold text-[#1A1917] mb-1.5"
                  >
                    {t.cart.emailAddress}
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={formValues.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    placeholder="you@example.com"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] focus:border-[#1A1917] focus:outline-none"
                  />
                  {errors.email && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#A83226]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-semibold text-[#1A1917] mb-1.5"
                  >
                    {t.cart.phoneNumber}
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={formValues.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    placeholder="+1 415 555 0198"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] focus:border-[#1A1917] focus:outline-none"
                  />
                  {errors.phone && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#A83226]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-semibold text-[#1A1917] mb-1.5"
                >
                  {t.cart.streetAddress}
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  value={formValues.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  aria-invalid={Boolean(errors.address)}
                  placeholder="742 Evergreen Terrace, Apt 4B"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] focus:border-[#1A1917] focus:outline-none"
                />
                {errors.address && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#A83226]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="checkout-city"
                    className="block text-xs font-semibold text-[#1A1917] mb-1.5"
                  >
                    {t.cart.city}
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    value={formValues.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    aria-invalid={Boolean(errors.city)}
                    placeholder="San Francisco"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] focus:border-[#1A1917] focus:outline-none"
                  />
                  {errors.city && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#A83226]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.city}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-postal"
                    className="block text-xs font-semibold text-[#1A1917] mb-1.5"
                  >
                    {t.cart.postalCode}
                  </label>
                  <input
                    id="checkout-postal"
                    type="text"
                    value={formValues.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                    aria-invalid={Boolean(errors.postalCode)}
                    placeholder="94107"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] focus:border-[#1A1917] focus:outline-none"
                  />
                  {errors.postalCode && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#A83226]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.postalCode}</span>
                    </p>
                  )}
                </div>
              </div>

              <fieldset className="pt-1">
                <legend className="text-xs font-semibold text-[#1A1917] mb-2">
                  {t.cart.paymentMethod}
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`px-3.5 py-3 rounded-lg border text-sm cursor-pointer flex items-center gap-2.5 ${
                      formValues.paymentMethod === 'card'
                        ? 'border-[#A83226] bg-[#A83226]/5 font-medium text-[#1A1917]'
                        : 'border-[#E4DFD6] text-[#5E5A54]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formValues.paymentMethod === 'card'}
                      onChange={() => updateField('paymentMethod', 'card')}
                      className="accent-[#A83226]"
                    />
                    <span>{t.cart.cardInvoiceLink}</span>
                  </label>

                  <label
                    className={`px-3.5 py-3 rounded-lg border text-sm cursor-pointer flex items-center gap-2.5 ${
                      formValues.paymentMethod === 'cod'
                        ? 'border-[#A83226] bg-[#A83226]/5 font-medium text-[#1A1917]'
                        : 'border-[#E4DFD6] text-[#5E5A54]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formValues.paymentMethod === 'cod'}
                      onChange={() => updateField('paymentMethod', 'cod')}
                      className="accent-[#A83226]"
                    />
                    <span>{t.cart.cashOnDelivery}</span>
                  </label>
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="checkout-gift-note"
                  className="block text-xs font-semibold text-[#1A1917] mb-1.5"
                >
                  {t.cart.optionalGiftNote}
                </label>
                <textarea
                  id="checkout-gift-note"
                  rows={2}
                  maxLength={MAX_GIFT_MESSAGE_LENGTH}
                  value={formValues.giftMessage}
                  onChange={(e) => {
                    const next = e.target.value;
                    updateField('giftMessage', next);
                    onChangeGiftMessage(next);
                  }}
                  placeholder={t.cart.giftNotePlaceholder}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] focus:border-[#1A1917] focus:outline-none resize-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {view === 'confirmed' && confirmedOrder ? (
          <div className="px-6 py-4 border-t border-[#E4DFD6] bg-[#FAF8F5] shrink-0">
            <button
              type="button"
              onClick={handleContinueShopping}
              className="w-full min-h-[44px] px-5 py-3 rounded-lg bg-[#1A1917] text-[#FAF8F5] text-sm font-semibold hover:bg-[#A83226] transition-colors cursor-pointer"
            >
              {t.cart.continueExploring}
            </button>
          </div>
        ) : (
          items.length > 0 && (
            <div className="px-6 py-4 border-t border-[#E4DFD6] bg-[#FAF8F5] space-y-4 shrink-0">
              {view === 'bag' && (
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#5E5A54]">
                    <dt>{t.cart.subtotal}</dt>
                    <dd className="tabular-nums">{formatPrice(totals.subtotal, currency)}</dd>
                  </div>
                  {totals.giftWrapFee > 0 && (
                    <div className="flex justify-between text-[#5E5A54]">
                      <dt>{t.cart.giftWrap}</dt>
                      <dd className="tabular-nums">{formatPrice(totals.giftWrapFee, currency)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-[#5E5A54]">
                    <dt>{t.cart.expressShipping}</dt>
                    <dd className="tabular-nums">
                      {totals.shippingFee === 0
                        ? t.cart.complimentary
                        : formatPrice(totals.shippingFee, currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E4DFD6] text-base font-semibold text-[#1A1917]">
                    <dt>{t.cart.total}</dt>
                    <dd className="tabular-nums">{formatPrice(totals.total, currency)}</dd>
                  </div>
                  <div
                    data-testid="cart-loyalty-notice"
                    className="flex items-center justify-between gap-2 pt-1.5 text-xs text-[#5E5A54]"
                  >
                    <dt className="inline-flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#A83226] shrink-0" aria-hidden="true" />
                      <span>
                        {t.cart.loyaltyEstimatedPrefix} ({t.cart.loyaltyRedeemNote})
                      </span>
                    </dt>
                    <dd className="font-semibold text-[#1A1917] tabular-nums">
                      +{formatLoyaltyPoints(calculateLoyaltyPoints(totals.total))} {t.header.pointsUnit}
                    </dd>
                  </div>
                </dl>
              )}

              {view === 'bag' ? (
                <button
                  key="proceed-checkout-btn"
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setFormValues((prev) => ({ ...prev, giftMessage }));
                    setView('checkout');
                  }}
                  className="w-full min-h-[44px] px-5 py-3 rounded-lg bg-[#A83226] text-[#FAF8F5] text-sm font-semibold hover:bg-[#8C271D] transition-colors cursor-pointer"
                >
                  {t.cart.proceedToCheckout}
                </button>
              ) : (
                <button
                  key="place-order-btn"
                  type="submit"
                  form="checkout-form"
                  className="w-full min-h-[44px] px-5 py-3 rounded-lg bg-[#A83226] text-[#FAF8F5] text-sm font-semibold hover:bg-[#8C271D] transition-colors cursor-pointer"
                >
                  {t.cart.placeOrder} ·{' '}
                  <span className="tabular-nums">{formatPrice(totals.total, currency)}</span>
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

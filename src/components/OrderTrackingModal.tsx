import { FormEvent, useEffect, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Truck,
  X,
} from 'lucide-react';
import { SAMPLE_CONFIRMED_ORDERS } from '../data/sampleOrders';
import type {
  ConfirmedOrder,
  CurrencyCode,
  LanguageCode,
  OrderFulfillmentStatus,
  OrderStatusResult,
} from '../types/store';
import { getOrderStatusLabel, getTranslations } from '../utils/i18n';
import {
  OrderTrackingErrorCode,
  formatPrice,
  trackOrderWithEmail,
} from '../utils/storeLogic';

interface OrderTrackingModalProps {
  isOpen: boolean;
  placedOrders: ConfirmedOrder[];
  currency: CurrencyCode;
  language: LanguageCode;
  onClose: () => void;
}

function getStatusPresentation(status: OrderFulfillmentStatus, language: LanguageCode) {
  const label = getOrderStatusLabel(status, language);
  switch (status) {
    case 'Processing':
      return {
        label,
        Icon: Clock,
        badgeClass: 'border-[#D5CCB9] bg-[#F2EFE9] text-[#6E4726]',
      };
    case 'Shipped':
      return {
        label,
        Icon: Truck,
        badgeClass: 'border-[#D8B4AF] bg-[#FBF2F0] text-[#A83226]',
      };
    case 'Delivered':
      return {
        label,
        Icon: CheckCircle2,
        badgeClass: 'border-[#B8CEBE] bg-[#F1F6F2] text-[#2A5A3B]',
      };
  }
}

export function OrderTrackingModal({
  isOpen,
  placedOrders,
  currency,
  language,
  onClose,
}: OrderTrackingModalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [orderInput, setOrderInput] = useState('');
  const [errorCode, setErrorCode] = useState<OrderTrackingErrorCode | null>(null);
  const [activeResult, setActiveResult] = useState<OrderStatusResult | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrorCode(null);
  }, [isOpen]);

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
  const ot = t.orderTracking;

  const runTrackingLookup = (rawEmail: string, rawOrder: string) => {
    setEmailInput(rawEmail);
    setOrderInput(rawOrder);
    const outcome = trackOrderWithEmail(
      rawEmail,
      rawOrder,
      placedOrders,
      SAMPLE_CONFIRMED_ORDERS,
    );
    setActiveResult(outcome.result);
    setErrorCode(outcome.errorCode ?? null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    runTrackingLookup(emailInput, orderInput);
  };

  const localizedError = errorCode
    ? errorCode === 'empty-email'
      ? ot.emptyEmailError
      : errorCode === 'invalid-email'
        ? ot.invalidEmailError
        : errorCode === 'empty-order'
          ? ot.emptyOrderError
          : ot.notFoundError
    : null;

  const statusMeta = activeResult ? getStatusPresentation(activeResult.status, language) : null;
  const placedDateFormatted = activeResult
    ? new Date(activeResult.order.createdAtIso).toLocaleDateString(
        language === 'zh-CN' ? 'zh-CN' : 'en-US',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC',
        },
      )
    : '';

  const formattedDeliveryDate = activeResult
    ? new Date(activeResult.estimatedDeliveryDate).toLocaleDateString(
        language === 'zh-CN' ? 'zh-CN' : 'en-US',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC',
        },
      )
    : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1917]/60"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-tracking-modal-title"
        data-testid="order-tracking-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#FAF8F5] border border-[#E4DFD6] rounded-xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Fixed Header Bar */}
        <div className="shrink-0 flex items-center justify-between gap-4 px-6 sm:px-8 py-4 border-b border-[#E4DFD6] bg-[#FAF8F5]">
          <div className="flex items-center gap-3 min-w-0">
            <Truck className="w-5 h-5 text-[#A83226] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h2
                id="order-tracking-modal-title"
                className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1917] leading-tight"
              >
                {ot.title}
              </h2>
              <p className="text-xs text-[#5E5A54] mt-0.5">{ot.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={ot.closeAria}
            className="w-10 h-10 shrink-0 rounded-lg bg-[#FAF8F5] border border-[#E4DFD6] flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label
                  htmlFor="tracking-email-input"
                  className="block text-xs font-semibold text-[#1A1917]"
                >
                  {ot.emailLabel}
                </label>
                <input
                  id="tracking-email-input"
                  type="email"
                  autoComplete="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (errorCode) setErrorCode(null);
                  }}
                  aria-invalid={errorCode === 'empty-email' || errorCode === 'invalid-email'}
                  placeholder={ot.emailPlaceholder}
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-white text-sm text-[#1A1917] placeholder:text-[#5E5A54]/65 focus:outline-none focus:border-[#1A1917]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="tracking-order-input"
                  className="block text-xs font-semibold text-[#1A1917]"
                >
                  {ot.orderNumberLabel}
                </label>
                <input
                  id="tracking-order-input"
                  type="text"
                  value={orderInput}
                  onChange={(e) => {
                    setOrderInput(e.target.value);
                    if (errorCode) setErrorCode(null);
                  }}
                  aria-invalid={errorCode === 'empty-order'}
                  placeholder={ot.orderNumberPlaceholder}
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-white text-sm text-[#1A1917] placeholder:text-[#5E5A54]/65 tabular-nums focus:outline-none focus:border-[#1A1917]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {localizedError ? (
                <div
                  role="alert"
                  className="flex-1 flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border border-[#E2B7B2] bg-[#FBF2F0] text-xs text-[#8C271D]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{localizedError}</span>
                </div>
              ) : (
                <span className="hidden sm:block" />
              )}

              <button
                type="submit"
                data-testid="order-tracking-submit"
                className="px-6 py-2.5 min-h-[42px] rounded-lg bg-[#A83226] text-[#FAF8F5] text-xs font-semibold hover:bg-[#8C271D] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {ot.submitButton}
              </button>
            </div>
          </form>

          {/* Quick-Select Verified Order Chips */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-[#5E5A54]">
              {placedOrders.length > 0 ? ot.quickFillRecent : ot.quickFillSample}
            </p>
            <div className="flex flex-wrap gap-2">
              {placedOrders.map((order) => (
                <button
                  key={order.orderNumber}
                  type="button"
                  onClick={() => runTrackingLookup(order.customer.email, order.orderNumber)}
                  className="px-3 py-2 min-h-[38px] rounded-lg border border-[#A83226]/35 bg-[#FBF2F0] text-xs font-semibold text-[#1A1917] hover:border-[#A83226] transition-colors cursor-pointer tabular-nums whitespace-nowrap"
                >
                  {order.orderNumber} · {order.customer.email}
                </button>
              ))}
              {SAMPLE_CONFIRMED_ORDERS.map((entry) => (
                <button
                  key={entry.order.orderNumber}
                  type="button"
                  onClick={() =>
                    runTrackingLookup(entry.order.customer.email, entry.order.orderNumber)
                  }
                  className="px-3 py-2 min-h-[38px] rounded-lg border border-[#E4DFD6] bg-[#F2EFE9]/70 text-xs font-medium text-[#1A1917] hover:border-[#1A1917] transition-colors cursor-pointer tabular-nums whitespace-nowrap"
                >
                  {entry.order.orderNumber} ({getOrderStatusLabel(entry.status, language)}) ·{' '}
                  {entry.order.customer.email}
                </button>
              ))}
            </div>
          </div>

          {/* Tracking Result */}
          {activeResult && statusMeta ? (
            <div
              data-testid="order-tracking-result"
              className="space-y-6 pt-3 border-t border-[#E4DFD6]"
            >
              <div className="rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/60 p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#5E5A54]">
                      {ot.placedPrefix} {placedDateFormatted}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-[#1A1917] mt-0.5 tabular-nums">
                      {ot.orderHeadingPrefix} {activeResult.order.orderNumber}
                    </h3>
                  </div>

                  <span
                    data-testid="tracking-status-badge"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap ${statusMeta.badgeClass}`}
                  >
                    <statusMeta.Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{statusMeta.label}</span>
                  </span>
                </div>

                {/* Estimated Shipping Status + Estimated Delivery Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3 border-t border-[#E4DFD6]">
                  <div className="rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] p-3.5 space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5E5A54]">
                      {ot.shippingStatusLabel}
                    </p>
                    <p className="text-sm font-semibold text-[#1A1917]">{statusMeta.label}</p>
                    <p className="text-xs text-[#5E5A54] leading-relaxed">
                      {activeResult.carrierNote}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] p-3.5 space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5E5A54]">
                      {ot.estimatedDeliveryLabel}
                    </p>
                    <p
                      data-testid="tracking-delivery-date"
                      className="text-sm font-semibold text-[#A83226] inline-flex items-center gap-1.5 tabular-nums"
                    >
                      <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{formattedDeliveryDate}</span>
                    </p>
                    <p className="text-xs text-[#5E5A54]">{activeResult.estimatedDelivery}</p>
                    <p className="text-xs text-[#1A1917] flex items-center gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[#5E5A54]" aria-hidden="true" />
                      <span>
                        {activeResult.order.customer.fullName} ·{' '}
                        {activeResult.order.customer.city}, {activeResult.order.customer.postalCode}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 3-Step Milestones */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5E5A54]">
                  {ot.milestonesHeading}
                </h4>
                <ol className="divide-y divide-[#E4DFD6] border border-[#E4DFD6] rounded-xl bg-[#FAF8F5]">
                  {activeResult.milestones.map((milestone) => {
                    const StepIcon =
                      milestone.step === 'Processing'
                        ? Clock
                        : milestone.step === 'Shipped'
                          ? Truck
                          : CheckCircle2;

                    return (
                      <li key={milestone.step} className="p-4 flex items-start gap-3.5">
                        <div
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                            milestone.completed
                              ? 'border-[#1A1917] bg-[#1A1917] text-[#FAF8F5]'
                              : 'border-[#E4DFD6] bg-[#F2EFE9]/60 text-[#5E5A54]'
                          }`}
                        >
                          <StepIcon className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p
                              className={`text-sm font-semibold ${
                                milestone.completed ? 'text-[#1A1917]' : 'text-[#5E5A54]'
                              }`}
                            >
                              {milestone.title}
                            </p>
                            <span className="text-xs text-[#5E5A54] tabular-nums">
                              {milestone.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-[#5E5A54] mt-1 leading-relaxed">
                            {milestone.detail}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Shipment Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5E5A54]">
                  {ot.itemsInOrder} ({activeResult.order.totals.itemCount})
                </h4>
                <div className="border border-[#E4DFD6] rounded-xl overflow-hidden bg-[#FAF8F5]">
                  <ul className="divide-y divide-[#E4DFD6]">
                    {activeResult.order.items.map((item) => (
                      <li
                        key={`${item.productId}-${item.variantLabel}`}
                        className="px-4 py-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <Package
                            className="w-4 h-4 text-[#5E5A54] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1A1917]">{item.name}</p>
                            <p className="text-[#5E5A54] tabular-nums">
                              {item.variantLabel} · {ot.qtyLabel} {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-[#1A1917] tabular-nums shrink-0">
                          {formatPrice(item.lineTotal, currency)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="px-4 py-3 bg-[#F2EFE9]/55 border-t border-[#E4DFD6] flex items-center justify-between text-xs">
                    <span className="text-[#5E5A54]">{ot.recipientLabel}</span>
                    <span className="font-semibold text-sm text-[#1A1917] tabular-nums">
                      {ot.total}: {formatPrice(activeResult.order.totals.total, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            !localizedError && (
              <div className="rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/40 px-5 py-6 text-center space-y-1.5">
                <p className="font-display text-xl font-semibold text-[#1A1917]">
                  {ot.idleTitle}
                </p>
                <p className="text-xs text-[#5E5A54] max-w-md mx-auto">{ot.idleDescription}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

import { FormEvent, useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  PackageSearch,
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
import { formatPrice, lookupOrderStatus } from '../utils/storeLogic';

interface OrderLookupModalProps {
  isOpen: boolean;
  initialOrderNumber: string;
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

export function OrderLookupModal({
  isOpen,
  initialOrderNumber,
  placedOrders,
  currency,
  language,
  onClose,
}: OrderLookupModalProps) {
  const [query, setQuery] = useState(initialOrderNumber);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [activeResult, setActiveResult] = useState<OrderStatusResult | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const trimmed = initialOrderNumber.trim();
    setQuery(initialOrderNumber);

    if (trimmed) {
      const outcome = lookupOrderStatus(trimmed, placedOrders, SAMPLE_CONFIRMED_ORDERS);
      setActiveResult(outcome.result);
      setLookupError(outcome.error ?? null);
    } else {
      setActiveResult(null);
      setLookupError(null);
    }
  }, [isOpen, initialOrderNumber, placedOrders]);

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

  const runLookup = (rawOrderNumber: string) => {
    setQuery(rawOrderNumber);
    const outcome = lookupOrderStatus(rawOrderNumber, placedOrders, SAMPLE_CONFIRMED_ORDERS);
    setActiveResult(outcome.result);
    setLookupError(outcome.error ?? null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    runLookup(query);
  };

  const t = getTranslations(language);
  const statusMeta = activeResult ? getStatusPresentation(activeResult.status, language) : null;
  const placedDateFormatted = activeResult
    ? new Date(activeResult.order.createdAtIso).toLocaleDateString(
        language === 'zh-CN' ? 'zh-CN' : 'en-US',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        },
      )
    : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1917]/55 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-lookup-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#FAF8F5] border border-[#E4DFD6] rounded-xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Fixed Header Bar */}
        <div className="shrink-0 flex items-center justify-between gap-4 px-6 sm:px-8 py-4 border-b border-[#E4DFD6] bg-[#FAF8F5]">
          <div className="flex items-center gap-3 min-w-0">
            <PackageSearch className="w-5 h-5 text-[#A83226] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h2
                id="order-lookup-modal-title"
                className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1917] leading-tight"
              >
                {t.orderLookup.title}
              </h2>
              <p className="text-xs text-[#5E5A54] mt-0.5">{t.orderLookup.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.orderLookup.closeAria}
            className="w-10 h-10 shrink-0 rounded-lg bg-[#FAF8F5] border border-[#E4DFD6] flex items-center justify-center text-[#1A1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            <label
              htmlFor="modal-order-number-input"
              className="block text-xs font-semibold text-[#1A1917]"
            >
              {t.orderLookup.orderNumberLabel}
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                id="modal-order-number-input"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (lookupError) setLookupError(null);
                }}
                placeholder={t.orderLookup.placeholder}
                className="flex-1 min-h-[42px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] placeholder:text-[#5E5A54]/70 tabular-nums focus:outline-none focus:border-[#1A1917]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 min-h-[42px] rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {t.orderLookup.checkStatus}
              </button>
            </div>

            {lookupError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg border border-[#E2B7B2] bg-[#FBF2F0] text-xs text-[#8C271D]"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{lookupError}</span>
              </div>
            )}
          </form>

          {/* Quick-Select Order Numbers */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-[#5E5A54]">
              {placedOrders.length > 0
                ? t.orderLookup.recentAndSamples
                : t.orderLookup.samplePrompt}
            </p>
            <div className="flex flex-wrap gap-2">
              {placedOrders.map((order) => (
                <button
                  key={order.orderNumber}
                  type="button"
                  onClick={() => runLookup(order.orderNumber)}
                  className="px-3 py-2 min-h-[38px] rounded-lg border border-[#A83226]/35 bg-[#FBF2F0] text-xs font-semibold text-[#1A1917] hover:border-[#A83226] transition-colors cursor-pointer tabular-nums whitespace-nowrap"
                >
                  {order.orderNumber} · {t.orderLookup.recentOrderTag}
                </button>
              ))}
              {SAMPLE_CONFIRMED_ORDERS.map((entry) => (
                <button
                  key={entry.order.orderNumber}
                  type="button"
                  onClick={() => runLookup(entry.order.orderNumber)}
                  className="px-3 py-2 min-h-[38px] rounded-lg border border-[#E4DFD6] bg-[#F2EFE9]/70 text-xs font-medium text-[#1A1917] hover:border-[#1A1917] transition-colors cursor-pointer tabular-nums whitespace-nowrap"
                >
                  {entry.order.orderNumber} · {getOrderStatusLabel(entry.status, language)}
                </button>
              ))}
            </div>
          </div>

          {/* Lookup Result */}
          {activeResult && statusMeta ? (
            <div className="space-y-6 pt-2 border-t border-[#E4DFD6]">
              {/* Status Summary Card */}
              <div className="rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/55 p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#5E5A54]">
                      {t.orderLookup.confirmedPlacedPrefix} {placedDateFormatted}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-[#1A1917] mt-0.5 tabular-nums">
                      {t.orderLookup.orderHeadingPrefix} {activeResult.order.orderNumber}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap ${statusMeta.badgeClass}`}
                  >
                    <statusMeta.Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{statusMeta.label}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E4DFD6] text-xs">
                  <div className="space-y-1">
                    <p className="text-[#5E5A54] font-medium">{t.orderLookup.dispatchUpdate}</p>
                    <p className="text-[#1A1917] leading-relaxed">{activeResult.carrierNote}</p>
                    <p className="text-[#A83226] font-semibold tabular-nums">
                      {activeResult.estimatedDelivery}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[#5E5A54] font-medium">
                      {t.orderLookup.recipientDestination}
                    </p>
                    <p className="text-[#1A1917] font-semibold">
                      {activeResult.order.customer.fullName}
                    </p>
                    <p className="text-[#5E5A54] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[#5E5A54]" aria-hidden="true" />
                      <span>
                        {activeResult.order.customer.city}, {activeResult.order.customer.postalCode}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 3-Step Fulfillment Milestone Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5E5A54]">
                  {t.orderLookup.milestonesHeading}
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

              {/* Itemized ConfirmedOrder Summary */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5E5A54]">
                  {t.orderLookup.itemsInOrder} ({activeResult.order.totals.itemCount})
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
                              {item.variantLabel} · {t.orderLookup.qtyLabel} {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-[#1A1917] tabular-nums shrink-0">
                          {formatPrice(item.lineTotal, currency)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="px-4 py-3 bg-[#F2EFE9]/55 border-t border-[#E4DFD6] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[#5E5A54]">
                      {t.orderLookup.subtotal} {formatPrice(activeResult.order.totals.subtotal, currency)} ·{' '}
                      {t.orderLookup.shipping}{' '}
                      {activeResult.order.totals.shippingFee === 0
                        ? t.orderLookup.complimentary
                        : formatPrice(activeResult.order.totals.shippingFee, currency)}
                      {activeResult.order.totals.giftWrapFee > 0
                        ? ` · ${t.orderLookup.giftWrap} ${formatPrice(activeResult.order.totals.giftWrapFee, currency)}`
                        : ''}
                    </span>
                    <span className="font-semibold text-sm text-[#1A1917] tabular-nums">
                      {t.orderLookup.total} {formatPrice(activeResult.order.totals.total, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            !lookupError && (
              <div className="rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/40 px-5 py-6 text-center space-y-1.5">
                <p className="font-display text-xl font-semibold text-[#1A1917]">
                  {t.orderLookup.idleTitle}
                </p>
                <p className="text-xs text-[#5E5A54] max-w-md mx-auto">
                  {t.orderLookup.idleDescription}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

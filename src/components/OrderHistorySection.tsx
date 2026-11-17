import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Gift,
  PackageSearch,
  RotateCcw,
  Truck,
} from 'lucide-react';
import { SAMPLE_CONFIRMED_ORDERS } from '../data/sampleOrders';
import type {
  ConfirmedOrder,
  CurrencyCode,
  LanguageCode,
  OrderFulfillmentStatus,
  SouvenirProduct,
} from '../types/store';
import {
  getOrderStatusLabel,
  getProductTitle,
  getTranslations,
} from '../utils/i18n';
import {
  type OrderHistoryFilter,
  buildOrderHistoryEntries,
  formatPrice,
  getOrderStatusCounts,
} from '../utils/storeLogic';

interface OrderHistorySectionProps {
  placedOrders: ConfirmedOrder[];
  products: SouvenirProduct[];
  currency: CurrencyCode;
  language: LanguageCode;
  onInspectOrder: (orderNumber: string) => void;
  onInspectProduct: (product: SouvenirProduct) => void;
  onReorder: (order: ConfirmedOrder) => void;
}

const FILTER_OPTIONS: OrderHistoryFilter[] = ['all', 'Processing', 'Shipped', 'Delivered'];

function StatusIcon({ status }: { status: OrderFulfillmentStatus }) {
  switch (status) {
    case 'Delivered':
      return <CheckCircle2 className="w-4 h-4 text-[#2E6B4E] shrink-0" aria-hidden="true" />;
    case 'Shipped':
      return <Truck className="w-4 h-4 text-[#8C5A2B] shrink-0" aria-hidden="true" />;
    case 'Processing':
    default:
      return <Clock className="w-4 h-4 text-[#A83226] shrink-0" aria-hidden="true" />;
  }
}

function getStatusTextClass(status: OrderFulfillmentStatus): string {
  switch (status) {
    case 'Delivered':
      return 'text-[#2E6B4E]';
    case 'Shipped':
      return 'text-[#8C5A2B]';
    case 'Processing':
    default:
      return 'text-[#A83226]';
  }
}

export function OrderHistorySection({
  placedOrders,
  products,
  currency,
  language,
  onInspectOrder,
  onInspectProduct,
  onReorder,
}: OrderHistorySectionProps) {
  const [statusFilter, setStatusFilter] = useState<OrderHistoryFilter>('all');

  const allT = getTranslations(language);
  const t = allT.orderHistory;

  const allEntries = useMemo(
    () => buildOrderHistoryEntries(placedOrders, SAMPLE_CONFIRMED_ORDERS, 'all'),
    [placedOrders],
  );

  const visibleEntries = useMemo(
    () =>
      statusFilter === 'all'
        ? allEntries
        : allEntries.filter((entry) => entry.status === statusFilter),
    [allEntries, statusFilter],
  );

  const statusCounts = useMemo(() => getOrderStatusCounts(allEntries), [allEntries]);

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const formatDate = (isoString: string) => {
    const ms = Date.parse(isoString);
    if (!Number.isFinite(ms)) return isoString;
    return new Date(ms).toLocaleDateString(language === 'zh-CN' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const totalCountLabel =
    allEntries.length === 1 ? t.totalOrdersSingular : t.totalOrdersPlural;

  return (
    <section
      id="order-history"
      aria-labelledby="order-history-heading"
      data-testid="order-history-section"
      className="scroll-mt-36 max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-16 border-t border-[#E4DFD6]"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A83226]">
            {t.eyebrow}
          </p>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2
              id="order-history-heading"
              className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1917] tracking-tight"
            >
              {t.heading}
            </h2>
            <span className="text-sm font-medium text-[#5E5A54] tabular-nums">
              ({allEntries.length} {totalCountLabel})
            </span>
          </div>
          <p className="text-sm text-[#5E5A54] leading-relaxed">{t.subtitle}</p>
        </div>

        <div
          role="group"
          aria-label={t.filterGroupAria}
          className="flex flex-wrap items-center gap-2"
        >
          {FILTER_OPTIONS.map((option) => {
            const active = statusFilter === option;
            const count = statusCounts[option];
            const label =
              option === 'all' ? t.filterAll : getOrderStatusLabel(option, language);
            return (
              <button
                key={option}
                type="button"
                data-testid={`order-history-filter-${option}`}
                aria-pressed={active}
                onClick={() => setStatusFilter(option)}
                className={`min-h-[40px] px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors motion-reduce:transition-none cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                  active
                    ? 'border-[#1A1917] bg-[#1A1917] text-[#FAF8F5]'
                    : 'border-[#E4DFD6] bg-[#FAF8F5] text-[#5E5A54] hover:border-[#1A1917] hover:text-[#1A1917]'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`tabular-nums ${
                    active ? 'text-[#FAF8F5]/80' : 'text-[#5E5A54]/80'
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {visibleEntries.length === 0 ? (
        <div
          data-testid="order-history-empty"
          className="rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/50 px-6 py-12 text-center space-y-3"
        >
          <p className="font-display text-xl font-semibold text-[#1A1917]">
            {allEntries.length === 0 ? t.emptyTitle : t.emptyFiltered}
          </p>
          {statusFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors motion-reduce:transition-none cursor-pointer"
            >
              {t.resetFilter}
            </button>
          )}
        </div>
      ) : (
        <div
          role="region"
          aria-label={t.scrollRegionAria}
          tabIndex={0}
          data-testid="order-history-scroll-list"
          className="max-h-[460px] overflow-y-auto overscroll-contain rounded-xl border border-[#E4DFD6] bg-[#FAF8F5] divide-y divide-[#E4DFD6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1917]"
        >
          {visibleEntries.map((entry) => {
            const { order, status, source } = entry;
            const totalQty = order.totals.itemCount;
            const piecesUnit = totalQty === 1 ? t.itemsSingular : t.itemsPlural;
            const hasInStockItems = order.items.some((item) => {
              const matched = productById.get(item.productId);
              return Boolean(matched?.inStock);
            });

            return (
              <article
                key={order.orderNumber}
                data-testid={`order-history-card-${order.orderNumber}`}
                className="p-5 sm:p-6 bg-[#FAF8F5] hover:bg-[#F2EFE9]/45 transition-colors motion-reduce:transition-none"
              >
                {/* Header Summary Line */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#E4DFD6]/80">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-xl font-semibold text-[#1A1917] tabular-nums">
                        {order.orderNumber}
                      </h3>
                      <span
                        className={`text-xs font-semibold uppercase tracking-[0.12em] ${
                          source === 'user' ? 'text-[#A83226]' : 'text-[#5E5A54]'
                        }`}
                      >
                        {source === 'user' ? t.recentOrderBadge : t.archiveOrderBadge}
                      </span>
                    </div>

                    <p className="text-xs text-[#5E5A54] tabular-nums">
                      {t.placedOnPrefix} {formatDate(order.createdAtIso)} ·{' '}
                      {t.recipientPrefix} {order.customer.fullName} ({order.customer.city}) ·{' '}
                      {totalQty} {piecesUnit}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0">
                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${getStatusTextClass(
                        status,
                      )}`}
                    >
                      <StatusIcon status={status} />
                      <span>{getOrderStatusLabel(status, language)}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#1A1917] tabular-nums">
                      {t.totalLabel}: {formatPrice(order.totals.total, currency)}
                    </p>
                  </div>
                </div>

                {/* Purchased Items */}
                <ul className="mt-4 space-y-3">
                  {order.items.map((item) => {
                    const matchedProduct = productById.get(item.productId);
                    const localizedName = matchedProduct
                      ? getProductTitle(matchedProduct, language)
                      : item.name;
                    return (
                      <li
                        key={`${order.orderNumber}-${item.productId}-${item.variantLabel}`}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {matchedProduct && (
                            <img
                              src={matchedProduct.image}
                              alt={matchedProduct.imageAlt}
                              className="w-11 h-11 rounded-md object-cover border border-[#E4DFD6] shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            {matchedProduct ? (
                              <button
                                type="button"
                                onClick={() => onInspectProduct(matchedProduct)}
                                className="text-left font-medium text-[#1A1917] hover:text-[#A83226] underline-offset-2 hover:underline transition-colors motion-reduce:transition-none cursor-pointer truncate block max-w-full"
                              >
                                {localizedName}
                              </button>
                            ) : (
                              <p className="font-medium text-[#1A1917] truncate">
                                {localizedName}
                              </p>
                            )}
                            <p className="text-xs text-[#5E5A54] tabular-nums truncate">
                              {item.variantLabel} · {t.qtyLabel} {item.quantity} ×{' '}
                              {formatPrice(item.unitPrice, currency)}
                            </p>
                          </div>
                        </div>

                        <span className="text-sm font-semibold text-[#1A1917] tabular-nums shrink-0">
                          {formatPrice(item.lineTotal, currency)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* Optional Gift Note & Shipping Update + Actions */}
                <div className="mt-4 pt-3.5 border-t border-[#E4DFD6]/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1 text-xs text-[#5E5A54] min-w-0">
                    {order.customer.giftMessage && (
                      <p className="inline-flex items-center gap-1.5 text-[#1A1917]">
                        <Gift className="w-3.5 h-3.5 text-[#A83226] shrink-0" aria-hidden="true" />
                        <span className="font-medium">{t.giftNoteLabel}:</span>
                        <span className="italic truncate">“{order.customer.giftMessage}”</span>
                      </p>
                    )}
                    <p className="truncate">
                      <span className="font-medium text-[#1A1917]">{t.estimatedDeliveryLabel}:</span>{' '}
                      {entry.estimatedDelivery} · {entry.carrierNote}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      data-testid={`order-history-inspect-${order.orderNumber}`}
                      onClick={() => onInspectOrder(order.orderNumber)}
                      className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-xs font-semibold text-[#1A1917] hover:border-[#1A1917] hover:bg-[#F2EFE9] transition-colors motion-reduce:transition-none cursor-pointer whitespace-nowrap"
                    >
                      <PackageSearch className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{t.viewDetailsButton}</span>
                    </button>

                    {hasInStockItems && (
                      <button
                        type="button"
                        data-testid={`order-history-reorder-${order.orderNumber}`}
                        onClick={() => onReorder(order)}
                        className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors motion-reduce:transition-none cursor-pointer whitespace-nowrap"
                      >
                        <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{t.reorderButton}</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

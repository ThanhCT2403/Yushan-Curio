import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import type { LanguageCode } from '../types/store';
import { getTranslations } from '../utils/i18n';
import {
  SEASONAL_PROMO_DURATION_MS,
  formatTimeRemaining,
  getTimeRemainingParts,
} from '../utils/storeLogic';

const PROMO_END_STORAGE_KEY = 'yunshan_curio_seasonal_promo_end_v1';

function loadOrCreatePromoTargetMs(): number {
  const fallback = Date.now() + SEASONAL_PROMO_DURATION_MS;
  try {
    const raw = window.localStorage.getItem(PROMO_END_STORAGE_KEY);
    if (raw) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed) && parsed > Date.now() + 60_000) {
        return parsed;
      }
    }
    window.localStorage.setItem(PROMO_END_STORAGE_KEY, String(fallback));
    return fallback;
  } catch {
    return fallback;
  }
}

interface LimitedTimeOfferBannerProps {
  language: LanguageCode;
  targetTimestampMs?: number;
}

export function LimitedTimeOfferBanner({
  language,
  targetTimestampMs,
}: LimitedTimeOfferBannerProps) {
  const [resolvedTargetMs] = useState<number>(
    () => targetTimestampMs ?? loadOrCreatePromoTargetMs(),
  );
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const t = getTranslations(language).promo;
  const parts = getTimeRemainingParts(resolvedTargetMs, nowMs);
  const formattedTime = formatTimeRemaining(parts.totalMs, {
    days: t.days,
    hours: t.hours,
    minutes: t.minutes,
    seconds: t.seconds,
    expired: t.expired,
  });

  const segments = [
    { value: parts.days, label: t.daysFull, key: 'days' },
    { value: parts.hours, label: t.hoursFull, key: 'hours' },
    { value: parts.minutes, label: t.minutesFull, key: 'minutes' },
    { value: parts.seconds, label: t.secondsFull, key: 'seconds' },
  ];

  return (
    <aside
      data-testid="limited-time-offer-banner"
      aria-label={t.regionAria}
      className="mb-10 rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/90 px-5 py-4 sm:px-6 sm:py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
    >
      <div className="space-y-1.5 min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#A83226] text-[#FAF8F5] text-[11px] font-semibold tracking-wide uppercase">
            <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>{t.badge}</span>
          </span>
          <h3 className="font-display text-lg sm:text-xl font-semibold text-[#1A1917]">
            {t.title}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5E5A54] leading-relaxed max-w-2xl">
          {t.description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2 shrink-0">
        <span className="text-[11px] font-medium text-[#5E5A54]">
          {t.endsIn}:{' '}
          <span
            data-testid="promo-countdown-formatted"
            className="font-semibold text-[#1A1917] tabular-nums"
          >
            {formattedTime}
          </span>
        </span>

        <div
          data-testid="promo-countdown-grid"
          aria-hidden="true"
          className="grid grid-cols-4 gap-2"
        >
          {segments.map((seg) => (
            <div
              key={seg.key}
              className="min-w-[54px] rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] px-2.5 py-1.5 text-center shadow-2xs"
            >
              <span className="block text-base sm:text-lg font-semibold text-[#1A1917] leading-tight tabular-nums">
                {String(seg.value).padStart(2, '0')}
              </span>
              <span className="block text-[10px] font-medium text-[#5E5A54] uppercase tracking-wider">
                {seg.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

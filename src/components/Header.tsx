import { useEffect, useRef, useState } from 'react';
import { Award, Heart, Menu, ShoppingBag, X } from 'lucide-react';
import type { CurrencyCode, LanguageCode } from '../types/store';
import { getTranslations } from '../utils/i18n';
import {
  CURRENCY_CODES,
  CURRENCY_CONFIG,
  calculateLoyaltyPoints,
  formatLoyaltyPoints,
} from '../utils/storeLogic';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  bagCount: number;
  cartTotal: number;
  wishlistCount: number;
  currency: CurrencyCode;
  onChangeCurrency: (currency: CurrencyCode) => void;
  language: LanguageCode;
  onChangeLanguage: (language: LanguageCode) => void;
  onOpenBag: () => void;
  onOpenWishlist: () => void;
  onOpenOrderTracking: () => void;
  heroIsDark: boolean;
  hasAnnouncementBar?: boolean;
}

export function Header({
  bagCount,
  cartTotal,
  wishlistCount,
  currency,
  onChangeCurrency,
  language,
  onChangeLanguage,
  onOpenBag,
  onOpenWishlist,
  onOpenOrderTracking,
  heroIsDark,
  hasAnnouncementBar = false,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loyaltyOpen, setLoyaltyOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const loyaltyRef = useRef<HTMLDivElement>(null);

  const t = getTranslations(language);
  const estimatedPoints = calculateLoyaltyPoints(cartTotal);
  const formattedPoints = formatLoyaltyPoints(estimatedPoints);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!loyaltyOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (loyaltyRef.current && !loyaltyRef.current.contains(event.target as Node)) {
        setLoyaltyOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLoyaltyOpen(false);
      }
    };
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loyaltyOpen]);

  const navLinks = [
    { href: '#collection', label: t.header.collection },
    { href: '#craftsmanship', label: t.header.regions },
    { href: '#collectors', label: t.header.collectors },
    { href: '#footer-shipping', label: t.header.shipping },
  ];

  const useLightText = !isScrolled && heroIsDark;

  return (
    <header
      className={`fixed left-0 right-0 z-30 transition-[top,background-color,border-color] duration-300 ${
        hasAnnouncementBar ? 'top-9' : 'top-0'
      } ${
        isScrolled || !heroIsDark
          ? 'bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E4DFD6]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#top"
          className={`font-display text-lg sm:text-2xl font-semibold tracking-tight whitespace-nowrap shrink-0 transition-colors ${
            useLightText ? 'text-[#FAF8F5]' : 'text-[#1A1917]'
          }`}
        >
          {t.brand.wordmark}
        </a>

        {/* Zone 2: Concise single-line navigation items */}
        <nav
          aria-label={t.header.primaryNavAria}
          className={`hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium ${
            useLightText ? 'text-[#FAF8F5]/85' : 'text-[#5E5A54]'
          }`}
        >
          <a
            href="#collection"
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              useLightText ? 'hover:text-[#FAF8F5]' : 'hover:text-[#1A1917]'
            }`}
          >
            {t.header.collection}
          </a>

          <button
            type="button"
            onClick={onOpenWishlist}
            aria-label={`${t.header.openWishlistAria} (${wishlistCount})`}
            className={`inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              useLightText ? 'hover:text-[#FAF8F5]' : 'hover:text-[#1A1917]'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                wishlistCount > 0
                  ? useLightText
                    ? 'fill-[#E5C185] text-[#E5C185]'
                    : 'fill-[#A83226] text-[#A83226]'
                  : ''
              }`}
              aria-hidden="true"
            />
            <span>{t.header.wishlist}</span>
            <span className="tabular-nums">({wishlistCount})</span>
          </button>

          {navLinks.slice(1).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                useLightText ? 'hover:text-[#FAF8F5]' : 'hover:text-[#1A1917]'
              }`}
            >
              {link.label}
            </a>
          ))}

          <button
            type="button"
            data-testid="header-order-tracking"
            onClick={onOpenOrderTracking}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              useLightText ? 'hover:text-[#FAF8F5]' : 'hover:text-[#1A1917]'
            }`}
          >
            {t.header.orderTracking}
          </button>
        </nav>

        {/* Zone 3: Language Switcher + Currency Switcher + Loyalty Tracker + Bag CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <LanguageSwitcher
              language={language}
              onChangeLanguage={onChangeLanguage}
              useLightText={useLightText}
            />

            <div className="shrink-0">
              <label htmlFor="header-currency-select" className="sr-only">
                {t.header.currencyAria}
              </label>
              <select
                id="header-currency-select"
                aria-label={t.header.currencyAria}
                value={currency}
                onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
                className={`min-h-[38px] sm:min-h-[40px] px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer focus:outline-none tabular-nums ${
                  useLightText
                    ? 'border-[#FAF8F5]/30 bg-[#1A1917]/40 text-[#FAF8F5] hover:bg-[#FAF8F5]/10'
                    : 'border-[#E4DFD6] bg-[#FAF8F5]/90 text-[#1A1917] hover:bg-[#F2EFE9]'
                }`}
              >
                {CURRENCY_CODES.map((code) => (
                  <option key={code} value={code} className="bg-[#FAF8F5] text-[#1A1917]">
                    {CURRENCY_CONFIG[code].code} {CURRENCY_CONFIG[code].symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div ref={loyaltyRef} className="relative shrink-0">
            <button
              type="button"
              data-testid="header-loyalty-tracker"
              onClick={() => setLoyaltyOpen((prev) => !prev)}
              aria-expanded={loyaltyOpen}
              aria-label={`${t.header.loyaltyAria}: ${formattedPoints} ${t.header.pointsUnit}. ${t.header.loyaltyRedeemNote}`}
              title={t.header.loyaltyRedeemNote}
              className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 min-h-[38px] sm:min-h-[40px] rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                useLightText
                  ? 'border-[#FAF8F5]/30 bg-[#1A1917]/40 text-[#FAF8F5] hover:bg-[#FAF8F5]/10'
                  : 'border-[#E4DFD6] bg-[#FAF8F5]/90 text-[#1A1917] hover:bg-[#F2EFE9]'
              }`}
            >
              <Award
                className={`w-3.5 h-3.5 shrink-0 ${
                  useLightText ? 'text-[#E5C185]' : 'text-[#A83226]'
                }`}
                aria-hidden="true"
              />
              <span className="hidden xl:inline">{t.header.loyaltyLabel}</span>
              <span data-testid="header-loyalty-points" className="tabular-nums">
                {formattedPoints} {t.header.pointsUnit}
              </span>
            </button>

            {loyaltyOpen && (
              <div
                role="region"
                aria-label={t.header.loyaltyTitle}
                data-testid="header-loyalty-popover"
                className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 mt-2 sm:w-72 rounded-xl border border-[#E4DFD6] bg-[#FAF8F5] p-4 shadow-xl text-left text-[#1A1917] z-40"
              >
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#E4DFD6]">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1917]">
                    <Award className="w-4 h-4 text-[#A83226]" aria-hidden="true" />
                    <span>{t.header.loyaltyTitle}</span>
                  </span>
                  <span className="text-sm font-semibold text-[#A83226] tabular-nums">
                    +{formattedPoints} {t.header.pointsUnit}
                  </span>
                </div>

                <p className="mt-2.5 text-xs text-[#5E5A54] leading-relaxed">
                  {estimatedPoints > 0 ? t.header.loyaltyEstimateLabel : t.header.loyaltyEmptyHint}
                </p>
                <p className="mt-1.5 text-xs font-medium text-[#1A1917] leading-relaxed">
                  {t.header.loyaltyRedeemNote}
                </p>
                <p className="mt-1 text-[11px] text-[#5E5A54]">{t.header.loyaltyRateNote}</p>

                <button
                  type="button"
                  onClick={() => {
                    setLoyaltyOpen(false);
                    onOpenBag();
                  }}
                  className="mt-3 w-full min-h-[36px] px-3 py-1.5 rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors cursor-pointer"
                >
                  {t.header.loyaltyOpenBag}
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            data-testid="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? t.header.closeMenuAria : t.header.openMenuAria}
            aria-expanded={mobileMenuOpen}
            className={`lg:hidden inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border transition-colors shrink-0 ${
              useLightText
                ? 'border-[#FAF8F5]/30 text-[#FAF8F5] hover:bg-[#FAF8F5]/10'
                : 'border-[#E4DFD6] text-[#1A1917] bg-[#FAF8F5]/80 hover:bg-[#F2EFE9]'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onOpenBag}
            aria-label={`${t.header.openBagAria} (${bagCount})`}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 min-h-[38px] sm:min-h-[40px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              useLightText
                ? 'bg-[#E5C185] text-[#1A120C] hover:bg-[#FAF8F5]'
                : 'bg-[#1A1917] text-[#FAF8F5] hover:bg-[#A83226]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{t.header.bag}</span>
            <span className="tabular-nums">({bagCount})</span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label={t.header.mobileNavAria}
          className="lg:hidden border-t border-[#E4DFD6] bg-[#FAF8F5] px-6 py-4 flex flex-col gap-3 shadow-lg"
        >
          <div
            data-testid="mobile-loyalty-tracker"
            className="rounded-lg border border-[#E4DFD6] bg-[#F2EFE9] px-3.5 py-2.5 text-xs"
          >
            <div className="flex items-center justify-between gap-2 font-semibold text-[#1A1917]">
              <span className="inline-flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#A83226]" aria-hidden="true" />
                <span>{t.header.loyaltyTitle}</span>
              </span>
              <span className="tabular-nums text-[#A83226]">
                +{formattedPoints} {t.header.pointsUnit}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#5E5A54]">{t.header.loyaltyRedeemNote}</p>
          </div>
          <div className="sm:hidden flex items-center justify-between gap-2 pb-1">
            <LanguageSwitcher
              language={language}
              onChangeLanguage={onChangeLanguage}
              useLightText={false}
            />
            <div>
              <label htmlFor="mobile-currency-select" className="sr-only">
                {t.header.currencyAria}
              </label>
              <select
                id="mobile-currency-select"
                aria-label={t.header.currencyAria}
                value={currency}
                onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
                className="min-h-[38px] px-2.5 py-1.5 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-xs font-semibold text-[#1A1917] tabular-nums"
              >
                {CURRENCY_CODES.map((code) => (
                  <option key={code} value={code} className="bg-[#FAF8F5] text-[#1A1917]">
                    {CURRENCY_CONFIG[code].code} {CURRENCY_CONFIG[code].symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenWishlist();
            }}
            className="py-2 text-left text-sm font-medium text-[#1A1917] hover:text-[#A83226] transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-[#A83226] text-[#A83226]' : ''}`}
              aria-hidden="true"
            />
            <span>
              {t.header.wishlist} <span className="tabular-nums">({wishlistCount})</span>
            </span>
          </button>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-medium text-[#1A1917] hover:text-[#A83226] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            data-testid="mobile-order-tracking"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrderTracking();
            }}
            className="py-2 text-left text-sm font-medium text-[#1A1917] hover:text-[#A83226] transition-colors cursor-pointer"
          >
            {t.header.orderTracking}
          </button>
        </nav>
      )}
    </header>
  );
}

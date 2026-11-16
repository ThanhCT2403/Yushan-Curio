import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import type { LanguageCode } from '../types/store';
import { getTranslations } from '../utils/i18n';
import { SCROLL_TO_TOP_THRESHOLD, shouldShowScrollToTop } from '../utils/storeLogic';

interface ScrollToTopButtonProps {
  language?: LanguageCode;
  hasCompareTray?: boolean;
  hasToast?: boolean;
  hiddenByOverlay?: boolean;
}

export function ScrollToTopButton({
  language = 'en',
  hasCompareTray = false,
  hasToast = false,
  hiddenByOverlay = false,
}: ScrollToTopButtonProps) {
  const [pastThreshold, setPastThreshold] = useState(false);
  const label = getTranslations(language).scrollTop.ariaLabel;

  useEffect(() => {
    const syncScroll = () => {
      setPastThreshold(shouldShowScrollToTop(window.scrollY, SCROLL_TO_TOP_THRESHOLD));
    };

    syncScroll();
    window.addEventListener('scroll', syncScroll, { passive: true });
    return () => window.removeEventListener('scroll', syncScroll);
  }, []);

  const isVisible = pastThreshold && !hiddenByOverlay;

  const bottomPositionClass =
    hasCompareTray && hasToast
      ? 'bottom-36'
      : hasCompareTray || hasToast
        ? 'bottom-20'
        : 'bottom-6';

  const handleScrollToTop = () => {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label={label}
      title={label}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={`fixed right-5 ${bottomPositionClass} z-30 w-11 h-11 rounded-xl border border-[#E4DFD6]/25 bg-[#1A1917] text-[#FAF8F5] shadow-lg flex items-center justify-center hover:bg-[#A83226] hover:border-[#A83226] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A83226] transition-all duration-200 cursor-pointer ${
        isVisible
          ? 'opacity-100 translate-y-0 visible'
          : 'opacity-0 translate-y-3 invisible pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}

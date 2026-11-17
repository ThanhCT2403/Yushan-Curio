import { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { HeroSlide, HeroSlideTheme, LanguageCode, SouvenirCategory } from '../types/store';
import { getTranslations } from '../utils/i18n';
import { getNextSlideIndex, getPrevSlideIndex } from '../utils/storeLogic';

interface HeroProps {
  slides: HeroSlide[];
  activeIndex: number;
  language: LanguageCode;
  onChangeSlide: (nextIndex: number) => void;
  onExploreCategory: (category: SouvenirCategory) => void;
  onInspectProduct: (productId: string) => void;
}

const THEME_BACKGROUNDS: Record<HeroSlideTheme, string> = {
  espresso: 'bg-[#1D140E]',
  amber: 'bg-[#B68043]',
  charcoal: 'bg-[#151311]',
  cream: 'bg-[#EDE1CF]',
};

const THEME_SCRIMS: Record<HeroSlideTheme, string> = {
  espresso:
    'bg-gradient-to-r from-[#1A110C]/95 via-[#1A110C]/80 sm:via-[#1A110C]/65 to-[#1A110C]/45 sm:to-transparent',
  amber:
    'bg-gradient-to-r from-[#8F5F2B]/95 via-[#9C6A34]/80 sm:via-[#9C6A34]/55 to-[#8F5F2B]/40 sm:to-transparent',
  charcoal:
    'bg-gradient-to-r from-[#12100E]/95 via-[#12100E]/80 sm:via-[#12100E]/65 to-[#12100E]/45 sm:to-transparent',
  cream:
    'bg-gradient-to-r from-[#EDE1CF]/96 via-[#EDE1CF]/88 sm:via-[#EDE1CF]/75 to-[#EDE1CF]/55 sm:to-transparent',
};

export function Hero({
  slides,
  activeIndex,
  language,
  onChangeSlide,
  onExploreCategory,
  onInspectProduct,
}: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const activeSlide = slides[activeIndex] ?? slides[0];
  const t = getTranslations(language).hero;

  useEffect(() => {
    if (prefersReducedMotion || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      onChangeSlide(getNextSlideIndex(activeIndex, slides.length));
    }, 6500);
    return () => window.clearInterval(timer);
  }, [activeIndex, slides.length, onChangeSlide, prefersReducedMotion]);

  if (!activeSlide) return null;

  const isDark = activeSlide.isDark;
  const localizedSlide = t.slides[activeSlide.id] ?? {
    kicker: activeSlide.kicker,
    headlineLine1: activeSlide.headlineLine1,
    headlineLine2: activeSlide.headlineLine2,
    description: activeSlide.description,
    ctaLabel: activeSlide.ctaLabel,
  };

  const handlePrev = () => {
    onChangeSlide(getPrevSlideIndex(activeIndex, slides.length));
  };

  const handleNext = () => {
    onChangeSlide(getNextSlideIndex(activeIndex, slides.length));
  };

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label={t.carouselAria}
      className={`relative w-full min-h-[480px] sm:min-h-[540px] lg:h-[600px] overflow-hidden transition-colors duration-500 ${THEME_BACKGROUNDS[activeSlide.theme]}`}
    >
      {/* Background Studio Slide Image + Contrast Scrim */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img
            src={activeSlide.image}
            alt={activeSlide.imageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right"
          />
          <div
            aria-hidden="true"
            className={`absolute inset-0 ${THEME_SCRIMS[activeSlide.theme]}`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Editorial Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-20 lg:px-24 h-full min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-center py-14 sm:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeSlide.id}-copy`}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg space-y-5"
          >
            <p
              className={`text-xs sm:text-sm font-medium tracking-wide ${
                isDark ? 'text-[#E5C185]' : 'text-[#7A3224]'
              }`}
            >
              {localizedSlide.kicker}
            </p>

            <h1
              className={`font-sans text-[clamp(2.5rem,5.2vw,4.5rem)] font-bold tracking-tight text-balance ${
                language === 'zh-CN' ? 'leading-[1.16]' : 'leading-[0.98]'
              } ${isDark ? 'text-[#FAF8F5]' : 'text-[#1A140F]'}`}
            >
              <span className="block">{localizedSlide.headlineLine1}</span>
              <span className="block">{localizedSlide.headlineLine2}</span>
            </h1>

            <p
              className={`text-sm sm:text-[15px] leading-relaxed max-w-md ${
                isDark ? 'text-[#FAF8F5]/85' : 'text-[#3D332B]'
              }`}
            >
              {localizedSlide.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="/products"
                onClick={(e) => {
                  e.preventDefault();
                  onExploreCategory(activeSlide.ctaCategory);
                }}
                className={`inline-flex items-center justify-center px-6 py-3 min-h-[44px] rounded-full text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isDark
                    ? 'bg-[#E5C185] text-[#1A120C] hover:bg-[#FAF8F5]'
                    : 'bg-[#1A140F] text-[#FAF8F5] hover:bg-[#A83226]'
                }`}
              >
                {localizedSlide.ctaLabel}
              </a>

              <button
                type="button"
                onClick={() => onInspectProduct(activeSlide.featuredProductId)}
                className={`inline-flex items-center justify-center px-6 py-3 min-h-[44px] rounded-full border text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isDark
                    ? 'border-[#FAF8F5]/45 text-[#FAF8F5] hover:bg-[#FAF8F5]/12'
                    : 'border-[#1A140F]/35 text-[#1A140F] hover:bg-[#1A140F]/8'
                }`}
              >
                {t.inspectPiece}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Left / Right Circular Carousel Controls */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label={t.prevAria}
        className="absolute left-4 sm:left-6 bottom-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FAF8F5] text-[#1A1917] shadow-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label={t.nextAria}
        className="absolute right-4 sm:right-6 bottom-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FAF8F5] text-[#1A1917] shadow-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Bottom Slide Bar Indicators */}
      <div
        role="tablist"
        aria-label={t.tablistAria}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
      >
        {slides.map((slide, idx) => {
          const isActive = idx === activeIndex;
          const slideLabel = t.slides[slide.id] ?? slide;
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Slide ${idx + 1}: ${slideLabel.headlineLine1} ${slideLabel.headlineLine2}`}
              onClick={() => onChangeSlide(idx)}
              className="py-2 px-1 cursor-pointer flex items-center"
            >
              <span
                className={`block h-1 rounded-full transition-all duration-300 ${
                  isActive
                    ? isDark
                      ? 'w-9 bg-[#FAF8F5]'
                      : 'w-9 bg-[#1A140F]'
                    : isDark
                      ? 'w-5 bg-[#FAF8F5]/35 hover:bg-[#FAF8F5]/60'
                      : 'w-5 bg-[#1A140F]/25 hover:bg-[#1A140F]/50'
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

import { ArrowRight } from 'lucide-react';
import { CATEGORY_THUMBNAILS } from '../data/souvenirs';
import type { LanguageCode, SouvenirCategory } from '../types/store';
import { getCategoryLabel, getTranslations } from '../utils/i18n';
import { getCategoryThumbnail } from '../utils/storeLogic';
import { ProductImage } from './ProductImage';

interface HomeAtelierShowcaseProps {
  categories: SouvenirCategory[];
  language: LanguageCode;
  onSelectCategory: (category: SouvenirCategory) => void;
  onOpenAllProductsPage: () => void;
}

export function HomeAtelierShowcase({
  categories,
  language,
  onSelectCategory,
  onOpenAllProductsPage,
}: HomeAtelierShowcaseProps) {
  const t = getTranslations(language);
  const disciplines = categories.filter(
    (cat): cat is Exclude<SouvenirCategory, 'All'> => cat !== 'All',
  );

  return (
    <section
      id="atelier-disciplines"
      data-testid="home-atelier-showcase"
      aria-labelledby="home-disciplines-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-18"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#A83226]">
            {t.homeShowcase.eyebrow}
          </p>
          <h2
            id="home-disciplines-heading"
            className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#1A1917] tracking-tight text-balance"
          >
            {t.homeShowcase.heading}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5E5A54] leading-relaxed">
            {t.homeShowcase.subtitle}
          </p>
        </div>

        <button
          type="button"
          data-testid="home-open-products-page"
          onClick={onOpenAllProductsPage}
          className="inline-flex items-center gap-2 self-start md:self-end min-h-[44px] px-5 py-2.5 rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>{t.homeShowcase.browseAllCta}</span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {disciplines.map((category, index) => {
          const localizedName = getCategoryLabel(category, language);
          const info = t.homeShowcase.disciplines[category];
          const thumbnail = getCategoryThumbnail(category, CATEGORY_THUMBNAILS);

          return (
            <button
              key={category}
              type="button"
              data-testid={`home-discipline-card-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              onClick={() => onSelectCategory(category)}
              className="group text-left rounded-xl border border-[#E4DFD6] bg-[#FAF8F5] overflow-hidden hover:border-[#1A1917]/50 hover:shadow-sm transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/3] w-full bg-[#EAE4DA] overflow-hidden">
                <ProductImage
                  src={thumbnail}
                  alt={localizedName}
                  fallbackTitle={localizedName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium text-[#A83226] tabular-nums">
                    0{index + 1} · {info.region}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl font-semibold text-[#1A1917] group-hover:text-[#A83226] transition-colors">
                    {localizedName}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#5E5A54] leading-relaxed">
                    {info.summary}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1917] group-hover:text-[#A83226] pt-3 border-t border-[#E4DFD6] transition-colors">
                  <span>{t.homeShowcase.exploreDisciplineCta}</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

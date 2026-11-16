import { ChevronRight, Home } from 'lucide-react';
import type { LanguageCode, SouvenirCategory } from '../types/store';
import { getCategoryLabel, getTranslations } from '../utils/i18n';
import { buildBreadcrumbItems } from '../utils/storeLogic';

interface BreadcrumbBarProps {
  selectedCategory: SouvenirCategory;
  onlyWishlisted: boolean;
  resultCount: number;
  language: LanguageCode;
  hasAnnouncementBar: boolean;
  onNavigateHome: () => void;
  onNavigateCatalog: () => void;
}

export function BreadcrumbBar({
  selectedCategory,
  onlyWishlisted,
  resultCount,
  language,
  hasAnnouncementBar,
  onNavigateHome,
  onNavigateCatalog,
}: BreadcrumbBarProps) {
  const t = getTranslations(language).breadcrumb;
  const categoryLabel = getCategoryLabel(selectedCategory, language);

  const items = buildBreadcrumbItems({
    selectedCategory,
    onlyWishlisted,
    labels: {
      home: t.home,
      catalog: t.catalog,
      categoryLabel,
      saved: t.saved,
    },
  });

  return (
    <div
      data-testid="breadcrumb-bar"
      className={`sticky z-20 transition-[top] duration-300 bg-[#F2EFE9]/95 backdrop-blur-sm border-b border-[#E4DFD6] ${
        hasAnnouncementBar ? 'top-[100px]' : 'top-16'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 min-h-[40px] py-1.5 flex items-center justify-between gap-4">
        <nav aria-label={t.navAria} className="min-w-0">
          <ol className="flex items-center flex-wrap gap-1.5 text-xs">
            {items.map((item, idx) => (
              <li key={item.id} className="inline-flex items-center gap-1.5 min-w-0">
                {idx > 0 && (
                  <ChevronRight
                    className="w-3.5 h-3.5 text-[#8A8378] shrink-0"
                    aria-hidden="true"
                  />
                )}

                {item.isCurrent ? (
                  <span
                    aria-current="page"
                    data-testid={`breadcrumb-current-${item.id}`}
                    className="font-semibold text-[#1A1917] truncate"
                  >
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    data-testid={`breadcrumb-link-${item.id}`}
                    onClick={() => {
                      if (item.id === 'home') {
                        onNavigateHome();
                      } else if (item.id === 'catalog') {
                        onNavigateCatalog();
                      }
                    }}
                    className="inline-flex items-center gap-1 font-medium text-[#5E5A54] hover:text-[#A83226] transition-colors whitespace-nowrap"
                  >
                    {item.id === 'home' && (
                      <Home className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    )}
                    <span>{item.label}</span>
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <p
          data-testid="breadcrumb-count"
          className="hidden sm:block text-[11px] font-medium text-[#5E5A54] tabular-nums whitespace-nowrap shrink-0"
        >
          {t.showingPrefix} {resultCount}{' '}
          {resultCount === 1 ? t.showingSingular : t.showingPlural}
        </p>
      </div>
    </div>
  );
}

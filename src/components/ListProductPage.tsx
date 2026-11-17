import { ArrowLeft } from 'lucide-react';
import type {
  CurrencyCode,
  LanguageCode,
  PriceRangePreset,
  SortOption,
  SouvenirCategory,
  SouvenirProduct,
} from '../types/store';
import { getTranslations } from '../utils/i18n';
import { CatalogSection } from './CatalogSection';

interface ListProductPageProps {
  categories: SouvenirCategory[];
  selectedCategory: SouvenirCategory;
  onSelectCategory: (category: SouvenirCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  pricePreset: PriceRangePreset;
  maxPrice: number;
  currency: CurrencyCode;
  language: LanguageCode;
  onSelectPricePreset: (preset: Exclude<PriceRangePreset, 'custom'>) => void;
  onMaxPriceChange: (price: number) => void;
  products: SouvenirProduct[];
  allProducts: SouvenirProduct[];
  wishlistIds: string[];
  recentProductIds: string[];
  onlyWishlisted: boolean;
  onToggleOnlyWishlisted: () => void;
  onToggleWishlist: (productId: string) => void;
  compareIds: string[];
  onToggleCompare: (productId: string) => void;
  notifiedProductIds: string[];
  onRequestNotify: (product: SouvenirProduct) => void;
  onSelectProduct: (product: SouvenirProduct) => void;
  onQuickLook: (product: SouvenirProduct) => void;
  onQuickAdd: (product: SouvenirProduct) => void;
  onResetFilters: () => void;
  onBackHome: () => void;
}

export function ListProductPage({
  onBackHome,
  ...catalogProps
}: ListProductPageProps) {
  const t = getTranslations(catalogProps.language);

  return (
    <div data-testid="list-product-page" className="bg-[#FAF8F5]">
      <section className="border-b border-[#E4DFD6] bg-[#F2EFE9]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#A83226]">
                {t.pages.listProductsEyebrow}
              </p>
              <h1 className="mt-2 font-display text-3xl sm:text-5xl font-semibold text-[#1A1917] tracking-tight text-balance">
                {t.pages.listProductsHeading}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#5E5A54] leading-relaxed">
                {t.pages.listProductsSubtitle}
              </p>
            </div>

            <button
              type="button"
              data-testid="list-page-back-home"
              onClick={onBackHome}
              className="inline-flex items-center gap-2 self-start sm:self-end min-h-[40px] px-4 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-xs font-semibold text-[#1A1917] hover:border-[#1A1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t.pages.backToHome}</span>
            </button>
          </div>
        </div>
      </section>

      <CatalogSection {...catalogProps} />
    </div>
  );
}

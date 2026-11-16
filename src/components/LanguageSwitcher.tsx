import type { LanguageCode } from '../types/store';
import { LANGUAGE_OPTIONS, getTranslations } from '../utils/i18n';

interface LanguageSwitcherProps {
  language: LanguageCode;
  onChangeLanguage: (language: LanguageCode) => void;
  useLightText: boolean;
}

export function LanguageSwitcher({
  language,
  onChangeLanguage,
  useLightText,
}: LanguageSwitcherProps) {
  const t = getTranslations(language);

  return (
    <div
      id="header-language-switcher"
      role="group"
      aria-label={t.header.languageGroupAria}
      className={`inline-flex items-center rounded-lg border p-0.5 shrink-0 transition-colors ${
        useLightText
          ? 'border-[#FAF8F5]/30 bg-[#1A1917]/40'
          : 'border-[#E4DFD6] bg-[#FAF8F5]/90'
      }`}
    >
      {LANGUAGE_OPTIONS.map((option) => {
        const isActive = language === option.code;
        const ariaLabel =
          option.code === 'en' ? t.header.switchToEnglishAria : t.header.switchToChineseAria;

        return (
          <button
            key={option.code}
            type="button"
            data-testid={`lang-btn-${option.code}`}
            aria-pressed={isActive}
            aria-label={ariaLabel}
            onClick={() => onChangeLanguage(option.code)}
            className={`min-h-[34px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              isActive
                ? useLightText
                  ? 'bg-[#E5C185] text-[#1A120C]'
                  : 'bg-[#1A1917] text-[#FAF8F5]'
                : useLightText
                  ? 'text-[#FAF8F5]/85 hover:text-[#FAF8F5]'
                  : 'text-[#5E5A54] hover:text-[#1A1917]'
            }`}
          >
            {option.shortLabel}
          </button>
        );
      })}
    </div>
  );
}

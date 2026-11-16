import { COLLECTOR_NOTES, REGIONAL_CRAFT_STORIES } from '../data/souvenirs';
import type { LanguageCode } from '../types/store';
import { getTranslations } from '../utils/i18n';

interface CraftsmanshipSectionProps {
  language: LanguageCode;
}

export function CraftsmanshipSection({ language }: CraftsmanshipSectionProps) {
  const t = getTranslations(language).craftsmanship;

  return (
    <section
      id="craftsmanship"
      aria-labelledby="craftsmanship-heading"
      className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20 border-t border-[#E4DFD6]"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-medium text-[#5E5A54]">{t.eyebrow}</p>
        <h2
          id="craftsmanship-heading"
          className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[#1A1917] text-balance"
        >
          {t.heading}
        </h2>
        <p className="mt-3 text-[15px] text-[#5E5A54] leading-relaxed">{t.subtitle}</p>
      </div>

      {/* 3-Column Craftsmanship Stories */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-8">
        {REGIONAL_CRAFT_STORIES.map((story, index) => {
          const localized = t.stories[story.id] ?? story;
          return (
            <article
              key={story.id}
              className="rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/55 p-6 flex flex-col justify-between gap-5"
            >
              <div>
                <p className="text-xs font-medium text-[#A83226] tabular-nums">
                  0{index + 1}. {localized.region}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-[#1A1917]">
                  {localized.craft}
                </h3>
                <p className="mt-3 text-sm text-[#5E5A54] leading-relaxed">
                  {localized.summary}
                </p>
              </div>
              <p className="pt-4 border-t border-[#E4DFD6] text-xs text-[#5E5A54]">
                {localized.provenanceDetail}
              </p>
            </article>
          );
        })}
      </div>

      {/* Adjacent Collector Notes (Claim-to-Proof Adjacency) */}
      <div id="collectors" className="mt-12 pt-10 border-t border-[#E4DFD6]">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
          <h3 className="font-display text-2xl font-semibold text-[#1A1917]">
            {t.notesHeading}
          </h3>
          <p className="text-xs text-[#5E5A54]">{t.notesSubheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {COLLECTOR_NOTES.map((note) => {
            const localizedNote = t.notes[note.id] ?? note;
            return (
              <blockquote
                key={note.id}
                className="rounded-xl border border-[#E4DFD6] bg-[#FAF8F5] p-6 flex flex-col justify-between gap-4"
              >
                <p className="text-sm text-[#1A1917] leading-relaxed">
                  “{localizedNote.quote}”
                </p>
                <footer className="pt-3 border-t border-[#E4DFD6] text-xs text-[#5E5A54]">
                  <span className="font-semibold text-[#1A1917]">{note.reviewer}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{localizedNote.location}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{localizedNote.purchasedItem}</span>
                </footer>
              </blockquote>
            );
          })}
        </div>
      </div>
    </section>
  );
}

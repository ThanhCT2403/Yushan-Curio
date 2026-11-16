import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import type { LanguageCode } from '../types/store';
import { getTranslations } from '../utils/i18n';
import {
  ANNOUNCEMENT_AUTO_CLOSE_MS,
  ANNOUNCEMENT_ROTATE_MS,
  getNextAnnouncementIndex,
} from '../utils/storeLogic';

interface AnnouncementBarProps {
  isOpen: boolean;
  language: LanguageCode;
  onDismiss: () => void;
}

export function AnnouncementBar({ isOpen, language, onDismiss }: AnnouncementBarProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const t = getTranslations(language).announcements;

  useEffect(() => {
    if (!isOpen) return;

    const autoCloseTimer = window.setTimeout(() => {
      onDismiss();
    }, ANNOUNCEMENT_AUTO_CLOSE_MS);

    const rotateInterval = window.setInterval(() => {
      setMessageIndex((prev) => getNextAnnouncementIndex(prev, t.messages.length));
    }, ANNOUNCEMENT_ROTATE_MS);

    return () => {
      window.clearTimeout(autoCloseTimer);
      window.clearInterval(rotateInterval);
    };
  }, [isOpen, onDismiss, t.messages.length]);

  if (!isOpen) return null;

  const activeMessage = t.messages[messageIndex] ?? t.messages[0];

  return (
    <div
      id="top-announcement-bar"
      role="region"
      aria-label={t.regionAria}
      className="fixed top-0 left-0 right-0 z-40 h-9 bg-[#1A1917] text-[#FAF8F5] border-b border-[#FAF8F5]/12"
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3">
        <span className="hidden sm:block w-8 shrink-0" aria-hidden="true" />

        <p
          aria-live="polite"
          className="flex-1 min-w-0 flex items-center justify-center gap-2 text-[11px] sm:text-xs font-medium tracking-wide text-center"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E5C185] shrink-0" aria-hidden="true" />
          <span className="truncate">{activeMessage}</span>
        </p>

        <button
          type="button"
          onClick={onDismiss}
          aria-label={t.dismissAria}
          className="w-8 h-8 shrink-0 rounded-md flex items-center justify-center text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:bg-[#FAF8F5]/10 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

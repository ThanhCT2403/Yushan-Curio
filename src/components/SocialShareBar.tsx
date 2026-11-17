import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Check, ExternalLink, Share2 } from 'lucide-react';
import type { LanguageCode, SouvenirProduct } from '../types/store';
import { getProductTitle, getTranslations } from '../utils/i18n';
import {
  type SocialSharePlatform,
  buildProductSharePayload,
  buildSocialShareUrls,
  executeNativeShare,
} from '../utils/storeLogic';

interface SocialShareBarProps {
  product: SouvenirProduct;
  language: LanguageCode;
}

function FacebookIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 22v-8.2h2.76l.41-3.2H13.5V8.56c0-.93.26-1.56 1.59-1.56h1.7V4.14c-.3-.04-1.31-.13-2.49-.13-2.46 0-4.15 1.5-4.15 4.26v2.33H7.4v3.2h2.75V22h3.35z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 3.5h2.95l-6.44 7.36L23 20.5h-5.95l-4.66-6.08-5.32 6.08H4.12l6.89-7.88L3.7 3.5h6.1l4.21 5.56 4.89-5.56zm-1.03 15.27h1.64L8.98 5.14H7.22l10.65 13.63z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.2 2C6.75 2 4 5.9 4 9.15c0 1.97.75 3.72 2.35 4.38.26.11.5 0 .58-.29.06-.2.19-.74.25-.96.08-.29.05-.4-.17-.66-.46-.55-.76-1.26-.76-2.27 0-2.92 2.18-5.54 5.68-5.54 3.1 0 4.8 1.9 4.8 4.43 0 3.33-1.47 6.14-3.66 6.14-1.21 0-2.12-1-1.83-2.23.35-1.47 1.02-3.05 1.02-4.11 0-.95-.51-1.74-1.56-1.74-1.24 0-2.24 1.28-2.24 3-.01 1.09.37 1.83.37 1.83s-1.27 5.37-1.49 6.31c-.44 1.87-.07 4.16-.03 4.39.02.14.19.17.27.07.11-.14 1.56-1.93 2.05-3.71.14-.51.81-3.15.81-3.15.4.77 1.57 1.44 2.82 1.44 3.71 0 6.23-3.39 6.23-7.92C20.23 5.26 17.21 2 12.2 2z" />
    </svg>
  );
}

export function SocialShareBar({ product, language }: SocialShareBarProps) {
  const [feedback, setFeedback] = useState<{
    platform: SocialSharePlatform;
    outcome: 'shared' | 'copied';
  } | null>(null);
  const timerRef = useRef<number | null>(null);

  const t = getTranslations(language).pdp;
  const displayTitle = getProductTitle(product, language);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const payload = buildProductSharePayload(product, displayTitle, currentUrl);

  let resolvedImageUrl = product.image;
  if (typeof window !== 'undefined' && product.image && !/^https?:\/\//i.test(product.image)) {
    try {
      resolvedImageUrl = new URL(product.image, window.location.origin).toString();
    } catch {
      resolvedImageUrl = product.image;
    }
  }
  const socialUrls = buildSocialShareUrls(payload, resolvedImageUrl);

  useEffect(() => {
    setFeedback(null);
  }, [product.id]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const scheduleReset = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const getPlatformLabel = (platform: SocialSharePlatform): string => {
    switch (platform) {
      case 'facebook':
        return t.shareFacebook;
      case 'twitter':
        return t.shareTwitter;
      case 'pinterest':
        return t.sharePinterest;
      case 'native':
      default:
        return t.shareNativeButton;
    }
  };

  const handleShare = async (platform: SocialSharePlatform) => {
    const shareData =
      platform === 'native'
        ? payload
        : {
            ...payload,
            title: `${payload.title} · ${getPlatformLabel(platform)}`,
          };

    const nativeFn =
      typeof navigator !== 'undefined' && typeof navigator.share === 'function'
        ? (data: typeof payload) => navigator.share(data)
        : null;

    const copyFn =
      typeof navigator !== 'undefined' && navigator.clipboard?.writeText
        ? (text: string) => navigator.clipboard.writeText(text)
        : null;

    const outcome = await executeNativeShare(shareData, nativeFn, copyFn);
    if (outcome === 'aborted') return;

    setFeedback({ platform, outcome });
    scheduleReset();
  };

  const platformButtons: Array<{
    id: Exclude<SocialSharePlatform, 'native'>;
    label: string;
    icon: ReactNode;
  }> = [
    { id: 'facebook', label: t.shareFacebook, icon: <FacebookIcon /> },
    { id: 'twitter', label: t.shareTwitter, icon: <TwitterIcon /> },
    { id: 'pinterest', label: t.sharePinterest, icon: <PinterestIcon /> },
  ];

  const activeExternalUrl =
    feedback && feedback.platform !== 'native' ? socialUrls[feedback.platform] : null;

  return (
    <div
      data-testid="pdp-social-share-bar"
      className="pt-3 border-t border-[#E4DFD6] space-y-2.5"
    >
      <div className="space-y-2">
        <p className="text-xs font-medium text-[#5E5A54]">{t.shareSectionLabel}</p>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5">
          {platformButtons.map((btn) => {
            const isActive = feedback?.platform === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                data-testid={`pdp-share-${btn.id}`}
                onClick={() => handleShare(btn.id)}
                aria-label={`${t.share} ${displayTitle} on ${btn.label}`}
                className={`inline-flex items-center justify-center gap-1.5 min-h-[40px] px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors motion-reduce:transition-none cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#B8CEBE] bg-[#F1F6F2] text-[#2A5A3B]'
                    : 'border-[#E4DFD6] bg-[#FAF8F5] text-[#1A1917] hover:border-[#1A1917] hover:bg-[#F2EFE9]'
                }`}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            data-testid="pdp-share-native"
            onClick={() => handleShare('native')}
            aria-label={t.shareAria}
            className={`inline-flex items-center justify-center gap-1.5 min-h-[40px] px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors motion-reduce:transition-none cursor-pointer whitespace-nowrap ${
              feedback?.platform === 'native'
                ? 'border-[#B8CEBE] bg-[#F1F6F2] text-[#2A5A3B]'
                : 'border-[#E4DFD6] bg-[#FAF8F5] text-[#1A1917] hover:border-[#1A1917] hover:bg-[#F2EFE9]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{t.shareNativeButton}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          data-testid="pdp-social-share-status"
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#B8CEBE] bg-[#F1F6F2] px-3 py-2 text-xs text-[#2A5A3B]"
        >
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>
              {feedback.outcome === 'shared'
                ? `${t.sharedToPrefix} ${getPlatformLabel(feedback.platform)}`
                : `${t.copiedForPrefix} ${getPlatformLabel(feedback.platform)}`}
            </span>
          </span>

          {activeExternalUrl && (
            <a
              href={activeExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`pdp-share-external-${feedback.platform}`}
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-[#1A1917] whitespace-nowrap"
            >
              <span>
                {t.openComposerPrefix} {getPlatformLabel(feedback.platform)}
              </span>
              <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

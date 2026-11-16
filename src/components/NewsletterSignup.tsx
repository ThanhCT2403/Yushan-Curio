import { FormEvent, useEffect, useState } from 'react';
import { AlertCircle, BookOpen, CheckCircle2, Mail, Sparkles } from 'lucide-react';
import type { LanguageCode } from '../types/store';
import { getTranslations } from '../utils/i18n';
import { validateNewsletterEmail } from '../utils/storeLogic';

export const NEWSLETTER_STORAGE_KEY = 'yunshan_curio_newsletter_v1';

function loadInitialSubscribedEmail(): string | null {
  try {
    const raw = window.localStorage.getItem(NEWSLETTER_STORAGE_KEY);
    if (!raw) return null;
    const check = validateNewsletterEmail(raw);
    return check.isValid ? check.normalizedEmail : null;
  } catch {
    return null;
  }
}

interface NewsletterSignupProps {
  language: LanguageCode;
}

export function NewsletterSignup({ language }: NewsletterSignupProps) {
  const [emailInput, setEmailInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(loadInitialSubscribedEmail);

  const t = getTranslations(language).newsletter;

  useEffect(() => {
    try {
      if (subscribedEmail) {
        window.localStorage.setItem(NEWSLETTER_STORAGE_KEY, subscribedEmail);
      } else {
        window.localStorage.removeItem(NEWSLETTER_STORAGE_KEY);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [subscribedEmail]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = validateNewsletterEmail(emailInput);
    if (!result.isValid) {
      setErrorMessage(
        result.errorCode === 'empty' ? t.emptyEmailError : t.invalidEmailError,
      );
      return;
    }
    setErrorMessage(null);
    setSubscribedEmail(result.normalizedEmail);
    setEmailInput('');
  };

  const handleChangeEmail = () => {
    setEmailInput(subscribedEmail ?? '');
    setSubscribedEmail(null);
    setErrorMessage(null);
  };

  return (
    <section
      id="newsletter-signup"
      aria-labelledby="newsletter-signup-heading"
      data-testid="newsletter-signup"
      className="max-w-7xl mx-auto px-6 lg:px-10 pb-14 lg:pb-20"
    >
      <div className="rounded-2xl border border-[#E4DFD6] bg-[#F2EFE9]/75 p-7 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A83226]">
            <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{t.eyebrow}</span>
          </div>

          <h2
            id="newsletter-signup-heading"
            className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1917] text-balance"
          >
            {t.heading}
          </h2>

          <p className="text-[15px] text-[#5E5A54] leading-relaxed max-w-2xl">
            {t.description}
          </p>

          <ul className="pt-1 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-xs text-[#1A1917]">
            <li className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#A83226] shrink-0" aria-hidden="true" />
              <span>{t.seasonalHighlight}</span>
            </li>
            <li className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-[#A83226] shrink-0" aria-hidden="true" />
              <span>{t.storiesHighlight}</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl border border-[#E4DFD6] bg-[#FAF8F5] p-5 sm:p-6">
            {subscribedEmail ? (
              <div
                role="status"
                aria-live="polite"
                data-testid="newsletter-success"
                className="rounded-lg border border-[#B8CEBE] bg-[#F1F6F2] p-4 space-y-3"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <CheckCircle2
                    className="w-4 h-4 text-[#2A5A3B] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="text-xs text-[#1A1917] space-y-1 min-w-0">
                    <p className="font-semibold">
                      {t.subscribedPrefix} ·{' '}
                      <span className="break-all text-[#2A5A3B]">{subscribedEmail}</span>
                    </p>
                    <p className="text-[#5E5A54] leading-relaxed">{t.confirmationNote}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="text-xs font-medium text-[#5E5A54] underline underline-offset-2 hover:text-[#1A1917] cursor-pointer"
                  >
                    {t.changeButton}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                <label
                  htmlFor="newsletter-signup-email"
                  className="block text-xs font-medium text-[#1A1917]"
                >
                  {t.emailLabel}
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <input
                    id="newsletter-signup-email"
                    type="email"
                    autoComplete="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    aria-invalid={Boolean(errorMessage)}
                    aria-describedby={errorMessage ? 'newsletter-signup-error' : undefined}
                    placeholder={t.emailPlaceholder}
                    className="min-w-0 flex-1 min-h-[44px] px-3.5 py-2 rounded-lg border border-[#E4DFD6] bg-white text-sm text-[#1A1917] placeholder:text-[#5E5A54]/65 focus:outline-none focus:border-[#1A1917]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 min-h-[44px] rounded-lg bg-[#A83226] text-[#FAF8F5] text-xs font-semibold hover:bg-[#8C271D] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {t.subscribeButton}
                  </button>
                </div>

                {errorMessage && (
                  <p
                    id="newsletter-signup-error"
                    role="alert"
                    className="flex items-center gap-1.5 text-xs text-[#A83226]"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </p>
                )}

                <p className="text-[11px] text-[#5E5A54]">{t.privacyNote}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

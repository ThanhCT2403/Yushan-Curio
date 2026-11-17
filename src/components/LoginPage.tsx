import { useState } from 'react';
import { signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  ArrowRight,
  Check,
  Heart,
  History,
  LogOut,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import type { LanguageCode } from '../types/store';
import { getTranslations } from '../utils/i18n';

interface LoginPageProps {
  mode: 'login' | 'signin';
  user: User | null;
  authReady: boolean;
  wishlistCount: number;
  language: LanguageCode;
  onSwitchAuthMode: (mode: 'login' | 'signin') => void;
  onNavigateProducts: () => void;
  onNavigateOrderHistory: () => void;
}

function GoogleMarkIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function LoginPage({
  mode,
  user,
  authReady,
  wishlistCount,
  language,
  onSwitchAuthMode,
  onNavigateProducts,
  onNavigateOrderHistory,
}: LoginPageProps) {
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const t = getTranslations(language);

  const isSignInMode = mode === 'signin';
  const activeEyebrow = isSignInMode ? t.pages.signinEyebrow : t.pages.loginEyebrow;
  const activeHeading = isSignInMode ? t.pages.signinHeading : t.pages.loginHeading;
  const activeSubtitle = isSignInMode ? t.pages.signinSubtitle : t.pages.loginSubtitle;

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setSubmitting(true);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      if (credential.user && !credential.user.emailVerified) {
        setAuthError(t.pages.unverifiedEmailError);
      }
    } catch (err: unknown) {
      const code = typeof err === 'object' && err !== null && 'code' in err ? String((err as { code?: unknown }).code) : '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setAuthError(t.pages.authPopupClosedError);
      } else if (code === 'auth/popup-blocked') {
        setAuthError(t.pages.authPopupBlockedError);
      } else {
        setAuthError(t.pages.authGenericError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    setSubmitting(true);
    try {
      await signOut(auth);
    } catch {
      setAuthError(t.pages.authGenericError);
    } finally {
      setSubmitting(false);
    }
  };

  const userInitial = (user?.displayName || user?.email || 'C').trim().charAt(0).toUpperCase();

  return (
    <section
      data-testid={isSignInMode ? 'signin-page' : 'login-page'}
      data-auth-mode={mode}
      className="bg-[#FAF8F5] py-10 sm:py-16 min-h-[calc(100vh-14rem)] flex items-center"
    >
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Editorial Collector Registry Overview */}
          <div className="lg:col-span-5 rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/75 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#A83226]">
                {activeEyebrow}
              </p>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#1A1917] leading-tight text-balance">
                {t.pages.loginStoryTitle}
              </h1>
              <p className="mt-4 text-sm text-[#5E5A54] leading-relaxed">
                {t.pages.loginStoryBody}
              </p>
            </div>

            <ul className="space-y-3 pt-4 border-t border-[#E4DFD6] text-xs sm:text-sm text-[#1A1917]">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#A83226] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{t.pages.loginBenefitWishlist}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#A83226] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{t.pages.loginBenefitOrders}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#A83226] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{t.pages.loginBenefitUpdates}</span>
              </li>
            </ul>
          </div>

          {/* Right Authentication / Signed-In Profile Card */}
          <div className="lg:col-span-7 rounded-xl border border-[#E4DFD6] bg-[#FAF8F5] p-6 sm:p-10 flex flex-col justify-center">
            {!authReady ? (
              <div className="space-y-4 animate-pulse" aria-busy="true">
                <div className="h-7 w-48 rounded bg-[#E4DFD6]" />
                <div className="h-4 w-full max-w-md rounded bg-[#EAE4DA]" />
                <div className="h-11 w-full rounded-lg bg-[#EAE4DA] mt-4" />
              </div>
            ) : user ? (
              <div data-testid="login-account-card" className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E4DFD6]">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName ?? 'Collector avatar'}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border border-[#E4DFD6] shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#1A1917] text-[#FAF8F5] flex items-center justify-center font-display text-xl font-semibold shrink-0">
                        {userInitial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#2A5A3B]">
                        {t.pages.signedInBadge} · {t.pages.accountProfileHeading}
                      </p>
                      <h2 className="font-display text-2xl font-semibold text-[#1A1917] truncate">
                        {user.displayName || user.email}
                      </h2>
                      {user.email && (
                        <p className="text-xs text-[#5E5A54] truncate">{user.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-[#E4DFD6] bg-[#F2EFE9]/60 p-4">
                    <div className="flex items-center gap-2 text-xs text-[#5E5A54]">
                      <Heart className="w-4 h-4 text-[#A83226] shrink-0" aria-hidden="true" />
                      <span>{t.pages.syncedWishlistLabel}</span>
                    </div>
                    <p className="mt-2 font-display text-2xl font-semibold text-[#1A1917] tabular-nums">
                      {wishlistCount}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#E4DFD6] bg-[#F2EFE9]/60 p-4 flex flex-col justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-[#2A5A3B] font-medium">
                      <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{t.pages.signedInBadge}</span>
                    </div>
                    <p className="text-xs text-[#5E5A54] leading-relaxed">
                      {t.pages.syncActiveNote}
                    </p>
                  </div>
                </div>

                {authError && (
                  <p
                    role="alert"
                    data-testid="login-error-banner"
                    className="rounded-lg border border-[#A83226]/30 bg-[#A83226]/8 px-3.5 py-2.5 text-xs font-medium text-[#A83226]"
                  >
                    {authError}
                  </p>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    data-testid="login-browse-products"
                    onClick={onNavigateProducts}
                    className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#A83226] text-[#FAF8F5] text-sm font-semibold hover:bg-[#8C271D] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{t.pages.browseProductsCta}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onNavigateOrderHistory}
                    className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-[#1A1917] text-sm font-semibold hover:border-[#1A1917] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <History className="w-4 h-4 text-[#A83226] shrink-0" aria-hidden="true" />
                    <span>{t.pages.orderHistoryCta}</span>
                  </button>

                  <button
                    type="button"
                    data-testid="login-signout-button"
                    disabled={submitting}
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-[#5E5A54] text-sm font-medium hover:text-[#1A1917] hover:border-[#1A1917] disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap sm:ml-auto"
                  >
                    <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{t.pages.signOutButton}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div data-testid="login-form-card" className="space-y-6">
                <div className="inline-flex rounded-lg border border-[#E4DFD6] bg-[#F2EFE9] p-1">
                  <button
                    type="button"
                    data-testid="auth-tab-signin"
                    onClick={() => onSwitchAuthMode('signin')}
                    aria-pressed={isSignInMode}
                    className={`min-h-[36px] px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isSignInMode
                        ? 'bg-[#1A1917] text-[#FAF8F5]'
                        : 'text-[#5E5A54] hover:text-[#1A1917]'
                    }`}
                  >
                    {t.header.signIn}
                  </button>
                  <button
                    type="button"
                    data-testid="auth-tab-login"
                    onClick={() => onSwitchAuthMode('login')}
                    aria-pressed={!isSignInMode}
                    className={`min-h-[36px] px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      !isSignInMode
                        ? 'bg-[#1A1917] text-[#FAF8F5]'
                        : 'text-[#5E5A54] hover:text-[#1A1917]'
                    }`}
                  >
                    {t.header.logIn}
                  </button>
                </div>

                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1917]">
                    {activeHeading}
                  </h2>
                  <p className="mt-2 text-sm text-[#5E5A54] leading-relaxed">
                    {activeSubtitle}
                  </p>
                </div>

                {authError && (
                  <p
                    role="alert"
                    data-testid="login-error-banner"
                    className="rounded-lg border border-[#A83226]/30 bg-[#A83226]/8 px-3.5 py-2.5 text-xs font-medium text-[#A83226]"
                  >
                    {authError}
                  </p>
                )}

                <div className="space-y-3">
                  <button
                    type="button"
                    data-testid="login-google-button"
                    disabled={submitting}
                    onClick={handleGoogleSignIn}
                    className="w-full min-h-[46px] px-5 py-3 rounded-lg bg-[#1A1917] text-[#FAF8F5] text-sm font-semibold hover:bg-[#A83226] disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
                      <GoogleMarkIcon />
                    </span>
                    <span>{submitting ? t.pages.signingIn : t.pages.continueWithGoogle}</span>
                  </button>

                  <button
                    type="button"
                    data-testid="login-guest-products"
                    onClick={onNavigateProducts}
                    className="w-full min-h-[44px] px-5 py-2.5 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-[#1A1917] text-sm font-medium hover:border-[#1A1917] hover:bg-[#F2EFE9] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t.pages.browseProductsCta}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </button>
                </div>

                <p className="pt-2 border-t border-[#E4DFD6] text-xs text-[#5E5A54] flex flex-wrap items-center justify-between gap-2">
                  <span>
                    {isSignInMode ? t.pages.switchToLoginPrompt : t.pages.switchToSigninPrompt}
                  </span>
                  <button
                    type="button"
                    data-testid="auth-switch-mode-link"
                    onClick={() => onSwitchAuthMode(isSignInMode ? 'login' : 'signin')}
                    className="font-semibold text-[#A83226] hover:underline underline-offset-4 cursor-pointer"
                  >
                    {isSignInMode ? t.header.logIn : t.header.signIn} →
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

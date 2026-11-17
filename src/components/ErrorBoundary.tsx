import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected application error occurred.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1A1917] flex items-center justify-center px-6 py-12">
          <div className="max-w-md w-full rounded-xl border border-[#E4DFD6] bg-[#F2EFE9] p-6 sm:p-8 space-y-4 text-center">
            <h1 className="font-display text-2xl font-semibold text-[#1A1917]">
              Something went wrong
            </h1>
            <p className="text-sm text-[#5E5A54] leading-relaxed">
              We encountered an unexpected error while loading this view. Return to the storefront
              or reload to continue browsing.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, errorMessage: '' });
                  window.location.assign('/');
                }}
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#A83226] text-[#FAF8F5] text-sm font-semibold hover:bg-[#8C271D] transition-colors cursor-pointer"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

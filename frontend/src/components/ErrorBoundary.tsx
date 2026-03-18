import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center fake-glass rounded-[24px] m-4"
          role="alert"
        >
          <p className="text-3xl mb-3" aria-hidden="true">
            ⚠️
          </p>
          <h2
            className="text-base font-semibold text-[var(--ContrastColor)] mb-2"
            style={{ fontFamily: 'Golos Text, sans-serif' }}
          >
            Что-то пошло не так
          </h2>
          {this.state.error && (
            <p className="text-xs text-[var(--ContrastColor)] opacity-50 mb-4 max-w-[240px] break-words">
              {this.state.error.message}
            </p>
          )}
          <button
            type="button"
            onClick={this.handleReset}
            className="fill-fakeglass-light stroke-glass-gradient px-5 py-2 rounded-[16px] text-sm text-[var(--ContrastColor)] font-medium"
          >
            Попробовать снова
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

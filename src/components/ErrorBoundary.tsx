import { Component, type ErrorInfo, type ReactNode } from 'react';
import { storage } from '@/services/storage';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Top-level crash containment (Requirement 1.5, design.md §9).
 * Renders a friendly fallback with a reset action instead of a blank screen.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Demo-only: log for debugging. No remote telemetry (no network calls).
    console.error('[ErrorBoundary] caught error:', error, info.componentStack);
  }

  private handleReset = (): void => {
    storage.clear();
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center gap-6 bg-jungle-dark px-6 text-center text-mist"
        >
          <div className="text-5xl" aria-hidden="true">
            🧭
          </div>
          <h1 className="text-2xl font-bold">Something went off the trail</h1>
          <p className="max-w-sm text-mist/80">
            The app hit an unexpected snag. You can reset and head back to the
            start of the expedition.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="min-h-[44px] min-w-[44px] rounded-card bg-leaf px-6 py-3 font-semibold text-jungle-dark transition-colors hover:bg-leaf-light"
          >
            Reset &amp; reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

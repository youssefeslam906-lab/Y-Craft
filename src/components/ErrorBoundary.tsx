import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Unexpected error occurred.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen bg-[#FBF5EA] text-[#1E1714] flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full rounded-2xl bg-[#FFFDF9] border border-[#E5D7C5] p-6 space-y-4">
            <div className="font-display text-xl font-bold text-[#B92708]">Y-CRAFT</div>
            <h2 className="font-display text-lg font-semibold">
              حدث خطأ أثناء الاتصال بقاعدة البيانات
            </h2>
            <p className="text-xs text-[#6B584E] break-words leading-relaxed">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[#B92708] text-[#FBF5EA] text-sm font-medium hover:bg-[#991F05] transition-colors"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

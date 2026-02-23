import { type ReactNode, useCallback, useState } from "react";
import { type FallbackProps, ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-red-400 bg-red-50 p-5 text-red-700">
      <h2 className="text-lg font-semibold">Something went wrong</h2>

      <p className="mt-1">An error occurred while rendering this component.</p>

      <details className="mt-2.5" open={isOpen} onToggle={(e) => setIsOpen(e.currentTarget.open)}>
        <summary className="cursor-pointer">Error details</summary>
        <pre className="mt-2.5 overflow-auto rounded bg-gray-100 p-2.5">
          {getErrorMessage(error)}
        </pre>
      </details>

      <button
        type="button"
        onClick={resetErrorBoundary}
        className="mt-2.5 cursor-pointer rounded bg-red-400 px-4 py-2 text-white hover:bg-red-500"
      >
        Try again
      </button>
    </div>
  );
};

const onError = (error: unknown) => {
  console.error("ErrorBoundary caught an error:", error);
};

export const ErrorBoundary = ({ children, fallback }: Props) => {
  const renderFallback = useCallback(
    (props: FallbackProps) => {
      if (fallback) {
        return <>{fallback}</>;
      }
      return <ErrorFallback {...props} />;
    },
    [fallback],
  );

  return (
    <ReactErrorBoundary fallbackRender={renderFallback} onError={onError}>
      {children}
    </ReactErrorBoundary>
  );
};

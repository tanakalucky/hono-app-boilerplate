import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";

import "./styles/index.css";
import { createRoot } from "react-dom/client";

import { ErrorBoundary } from "@/app/providers/ErrorBoundary";
import { HomePage } from "@/pages/home";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);

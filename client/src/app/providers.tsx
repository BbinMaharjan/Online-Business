"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@/theme";
import { Toaster } from "react-hot-toast";

function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: (failureCount, error: unknown) => {
          if (error && typeof error === "object" && "response" in error) {
            const response = (error as { response?: { status?: number } }).response;
            if (response?.status && response.status >= 400 && response.status < 500) {
              return false;
            }
          }
          return failureCount < 3;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = React.useState(getQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "8px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#4caf50",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#f44336",
                secondary: "#fff",
              },
            },
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </MUIThemeProvider>
    </QueryClientProvider>
  );
}
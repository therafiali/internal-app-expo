import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";

const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        // 10 seconds
        refetchInterval: 1000 * 10,
      },
    },
  }
);

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

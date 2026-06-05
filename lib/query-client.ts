import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // Next.js App Router caching often handles staleness, but we set a baseline
          staleTime: 60 * 1000, // 1 minute
          refetchOnWindowFocus: true, // Auto-update when user switches tabs back (faux-realtime)
        },
      },
    }),
);

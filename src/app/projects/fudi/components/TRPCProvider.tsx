'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { trpc, trpcClient } from '../lib/trpc';
import { useState } from 'react';
import { OrderStatusTicker } from './OrderStatusTicker';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <JotaiProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <OrderStatusTicker />
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </JotaiProvider>
  );
}

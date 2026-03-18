import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config as gluestackConfig } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';

import '@/shared/i18n';

type TestProvidersProps = {
  children: ReactNode;
};

export function TestProviders({ children }: TestProvidersProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider config={gluestackConfig}>{children}</GluestackUIProvider>
    </QueryClientProvider>
  );
}

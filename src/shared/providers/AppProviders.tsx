import { config as gluestackConfig } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import i18next from "@/shared/i18n";
import { useLanguageStore } from "@/shared/state/useLanguageStore";

const queryClient = new QueryClient();

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    if (i18next.language !== language) {
      i18next.changeLanguage(language).catch(() => undefined);
    }
  }, [language]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GluestackUIProvider config={gluestackConfig}>
          {children}
        </GluestackUIProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

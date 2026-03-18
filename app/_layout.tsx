import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '@/shared/i18n';
import { AppProviders } from '@/shared/providers/AppProviders';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerTintColor: '#EAF4FF',
            headerStyle: { backgroundColor: '#0D1B2A' },
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: '#0D1B2A' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Stores' }} />
          <Stack.Screen name="stores/new" options={{ presentation: 'modal', title: 'Store' }} />
          <Stack.Screen name="stores/[storeId]/edit" options={{ presentation: 'modal', title: 'Store' }} />
          <Stack.Screen name="stores/[storeId]/index" options={{ title: 'Products' }} />
          <Stack.Screen
            name="stores/[storeId]/products/new"
            options={{ presentation: 'modal', title: 'Product' }}
          />
          <Stack.Screen
            name="stores/[storeId]/products/[productId]/edit"
            options={{ presentation: 'modal', title: 'Product' }}
          />
        </Stack>
      </AppProviders>
    </GestureHandlerRootView>
  );
}

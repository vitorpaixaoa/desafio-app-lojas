import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '@/shared/i18n';
import { AppProviders } from '@/shared/providers/AppProviders';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerTintColor: '#0F2A43',
            headerStyle: { backgroundColor: '#F3F8FF' },
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: '#F7FAFF' },
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

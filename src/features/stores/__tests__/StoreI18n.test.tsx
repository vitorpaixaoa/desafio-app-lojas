import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { resetMockDb } from '@/mocks/data';
import { server } from '@/mocks/server';
import { StoreListScreen } from '@/features/stores/ui/StoreListScreen';
import { TestProviders } from '@/test/TestProviders';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('StoreListScreen i18n', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
    resetMockDb();
    useLanguageStore.getState().setLanguage('pt');
  });

  afterAll(() => {
    server.close();
  });

  it('troca idioma para inglês em tempo real', async () => {
    render(
      <TestProviders>
        <StoreListScreen />
      </TestProviders>,
    );

    expect(await screen.findByPlaceholderText('Buscar lojas')).toBeTruthy();

    fireEvent.press(screen.getByText('EN'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search stores')).toBeTruthy();
      expect(screen.getByText('New store')).toBeTruthy();
    });
  });
});

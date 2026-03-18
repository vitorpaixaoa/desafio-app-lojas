import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { resetMockDb } from '@/mocks/data';
import { server } from '@/mocks/server';
import i18next from '@/shared/i18n';
import { TestProviders } from '@/test/TestProviders';
import { StoreListScreen } from '@/features/stores/ui/StoreListScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('StoreListScreen', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(async () => {
    server.resetHandlers();
    resetMockDb();
    await i18next.changeLanguage('pt');
  });

  afterAll(() => {
    server.close();
  });

  it('renderiza lojas carregadas da API', async () => {
    render(
      <TestProviders>
        <StoreListScreen />
      </TestProviders>,
    );

    await waitFor(() => {
      expect(screen.getByText('Loja Centro')).toBeTruthy();
      expect(screen.getByText('Loja Norte')).toBeTruthy();
    });
  });

  it('filtra lojas por termo de busca', async () => {
    render(
      <TestProviders>
        <StoreListScreen />
      </TestProviders>,
    );

    const input = await screen.findByPlaceholderText('Buscar lojas');

    fireEvent.changeText(input, 'Centro');

    await waitFor(() => {
      expect(screen.getByText('Loja Centro')).toBeTruthy();
      expect(screen.queryByText('Loja Norte')).toBeNull();
    });
  });
});

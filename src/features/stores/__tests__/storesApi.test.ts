import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';

import { resetMockDb } from '@/mocks/data';
import { server } from '@/mocks/server';
import {
  createStore,
  deleteStore,
  getStores,
  updateStore,
} from '@/features/stores/api/storesApi';

describe('storesApi', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
    resetMockDb();
  });

  afterAll(() => {
    server.close();
  });

  it('lista lojas com contagem de produtos', async () => {
    const stores = await getStores();

    const lojaCentro = stores.find((store) => store.name === 'Loja Centro');

    expect(stores).toHaveLength(2);
    expect(lojaCentro?.productsCount).toBe(2);
  });

  it('cria uma nova loja', async () => {
    const created = await createStore({
      name: 'Loja Sul',
      address: {
        zipCode: '65000000',
        street: 'Rua das Palmeiras',
        number: '300',
        neighborhood: 'Jardins',
        city: 'São Luís',
        state: 'MA',
        complement: 'Sala 3',
      },
    });

    const stores = await getStores();

    expect(created.id).toBeTruthy();
    expect(created.name).toBe('Loja Sul');
    expect(stores.some((store) => store.id === created.id)).toBe(true);
  });

  it('atualiza uma loja existente', async () => {
    const stores = await getStores();
    const first = stores[0];

    const updated = await updateStore(first.id, {
      name: 'Loja Centro Atualizada',
      address: {
        ...first.address,
        number: '999',
      },
    });

    expect(updated.name).toBe('Loja Centro Atualizada');
    expect(updated.address.number).toBe('999');

    const refreshed = await getStores();
    const found = refreshed.find((store) => store.id === first.id);

    expect(found?.name).toBe('Loja Centro Atualizada');
  });

  it('remove uma loja e seus produtos', async () => {
    const stores = await getStores();
    const target = stores.find((store) => store.name === 'Loja Centro');

    expect(target).toBeDefined();

    await deleteStore(target!.id);

    const refreshed = await getStores();

    expect(refreshed.some((store) => store.id === target!.id)).toBe(false);
  });
});

import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';

import { resetMockDb } from '@/mocks/data';
import { server } from '@/mocks/server';
import {
  createProduct,
  deleteProduct,
  getProductsByStore,
  updateProduct,
} from '@/features/products/api/productsApi';

describe('productsApi', () => {
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

  it('lista produtos por loja', async () => {
    const products = await getProductsByStore('store-1');

    expect(products).toHaveLength(2);
    expect(products.every((product) => product.storeId === 'store-1')).toBe(true);
  });

  it('filtra produtos por termo', async () => {
    const products = await getProductsByStore('store-1', 'Tênis');

    expect(products).toHaveLength(1);
    expect(products[0].name).toBe('Tênis Casual');
  });

  it('cria um produto para a loja selecionada', async () => {
    const created = await createProduct({
      storeId: 'store-2',
      name: 'Relógio Urbano',
      category: 'Acessórios',
      price: 349.99,
    });

    const refreshed = await getProductsByStore('store-2');

    expect(created.id).toBeTruthy();
    expect(refreshed.some((product) => product.id === created.id)).toBe(true);
  });

  it('atualiza um produto existente', async () => {
    const products = await getProductsByStore('store-1');
    const target = products[0];

    const updated = await updateProduct(target.id, {
      name: 'Camiseta Premium',
      category: target.category,
      price: 79.9,
    });

    expect(updated.name).toBe('Camiseta Premium');
    expect(updated.price).toBe(79.9);
  });

  it('remove produto', async () => {
    const products = await getProductsByStore('store-1');

    await deleteProduct(products[0].id);

    const refreshed = await getProductsByStore('store-1');

    expect(refreshed).toHaveLength(1);
  });
});

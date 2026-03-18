import { httpClient } from '@/shared/api/httpClient';
import { Product, Store, StoreWithProductsCount } from '@/shared/types/entities';

export type CreateStoreInput = Pick<Store, 'name' | 'address'>;

export type UpdateStoreInput = Pick<Store, 'name' | 'address'>;

function getStoreQuery(search?: string) {
  const term = search?.trim();

  if (!term) {
    return '/stores';
  }

  return `/stores?search=${encodeURIComponent(term)}`;
}

export async function getStores(search?: string): Promise<StoreWithProductsCount[]> {
  const [stores, products] = await Promise.all([
    httpClient.get<Store[]>(getStoreQuery(search)),
    httpClient.get<Product[]>('/products'),
  ]);

  const countByStoreId = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.storeId] = (acc[product.storeId] ?? 0) + 1;
    return acc;
  }, {});

  return stores.map((store) => ({
    ...store,
    productsCount: countByStoreId[store.id] ?? 0,
  }));
}

export function createStore(payload: CreateStoreInput) {
  return httpClient.post<Store>('/stores', payload);
}

export function updateStore(storeId: string, payload: UpdateStoreInput) {
  return httpClient.put<Store>(`/stores/${storeId}`, payload);
}

export function deleteStore(storeId: string) {
  return httpClient.delete<void>(`/stores/${storeId}`);
}

import { httpClient } from '@/shared/api/httpClient';
import { Product } from '@/shared/types/entities';

export type CreateProductInput = Pick<Product, 'storeId' | 'name' | 'category' | 'price'>;

export type UpdateProductInput = Pick<Product, 'name' | 'category' | 'price'>;

function buildProductsQuery(storeId: string, search?: string) {
  const params = new URLSearchParams();
  params.set('storeId', storeId);

  if (search?.trim()) {
    params.set('search', search.trim());
  }

  return `/products?${params.toString()}`;
}

export function getProductsByStore(storeId: string, search?: string) {
  return httpClient.get<Product[]>(buildProductsQuery(storeId, search));
}

export function createProduct(payload: CreateProductInput) {
  return httpClient.post<Product>('/products', payload);
}

export function updateProduct(productId: string, payload: UpdateProductInput) {
  return httpClient.put<Product>(`/products/${productId}`, payload);
}

export function deleteProduct(productId: string) {
  return httpClient.delete<void>(`/products/${productId}`);
}

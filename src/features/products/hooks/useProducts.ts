import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createProduct,
  CreateProductInput,
  deleteProduct,
  getProductsByStore,
  updateProduct,
  UpdateProductInput,
} from '@/features/products/api/productsApi';
import { STORES_QUERY_KEY } from '@/features/stores/hooks/useStores';

export const PRODUCTS_QUERY_KEY = 'products';

export function useProducts(storeId: string, search = '') {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, storeId, search],
    queryFn: () => getProductsByStore(storeId, search),
    enabled: Boolean(storeId),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductInput) => createProduct(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      await queryClient.invalidateQueries({ queryKey: [STORES_QUERY_KEY] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: UpdateProductInput }) =>
      updateProduct(productId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      await queryClient.invalidateQueries({ queryKey: [STORES_QUERY_KEY] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      await queryClient.invalidateQueries({ queryKey: [STORES_QUERY_KEY] });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createStore,
  CreateStoreInput,
  deleteStore,
  getStores,
  updateStore,
  UpdateStoreInput,
} from '@/features/stores/api/storesApi';

export const STORES_QUERY_KEY = 'stores';

export function useStores(search = '') {
  return useQuery({
    queryKey: [STORES_QUERY_KEY, search],
    queryFn: () => getStores(search),
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStoreInput) => createStore(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [STORES_QUERY_KEY] });
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, payload }: { storeId: string; payload: UpdateStoreInput }) =>
      updateStore(storeId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [STORES_QUERY_KEY] });
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeId: string) => deleteStore(storeId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [STORES_QUERY_KEY] });
    },
  });
}

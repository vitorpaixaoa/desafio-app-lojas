import { useLocalSearchParams } from 'expo-router';

import { ProductFormScreen } from '@/features/products/ui/ProductFormScreen';

export default function EditProductRoute() {
  const { storeId, productId } = useLocalSearchParams<{ storeId: string; productId: string }>();

  return <ProductFormScreen mode="edit" productId={productId} storeId={storeId} />;
}

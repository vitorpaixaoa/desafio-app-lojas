import { useLocalSearchParams } from 'expo-router';

import { ProductFormScreen } from '@/features/products/ui/ProductFormScreen';

export default function NewProductRoute() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();

  return <ProductFormScreen mode="create" storeId={storeId} />;
}

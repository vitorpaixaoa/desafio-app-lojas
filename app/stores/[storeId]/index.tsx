import { useLocalSearchParams } from "expo-router";

import { ProductListScreen } from "@/features/products/ui/ProductListScreen";

export default function ProductsRoute() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();

  return <ProductListScreen storeId={storeId} />;
}

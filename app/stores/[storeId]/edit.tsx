import { useLocalSearchParams } from "expo-router";

import { StoreFormScreen } from "@/features/stores/ui/StoreFormScreen";

export default function EditStoreRoute() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();

  return <StoreFormScreen mode="edit" storeId={storeId} />;
}

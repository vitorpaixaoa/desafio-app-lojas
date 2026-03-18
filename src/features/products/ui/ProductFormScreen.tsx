import { Center, Text } from '@gluestack-ui/themed';

type ProductFormScreenProps = {
  mode: 'create' | 'edit';
  storeId?: string;
  productId?: string;
};

export function ProductFormScreen({ mode, storeId, productId }: ProductFormScreenProps) {
  return (
    <Center flex={1} bg="$backgroundDark900">
      <Text color="$textLight200">
        {mode === 'create'
          ? `Criando produto para ${storeId ?? '-'}`
          : `Editando produto ${productId ?? '-'} da loja ${storeId ?? '-'}`}
      </Text>
    </Center>
  );
}

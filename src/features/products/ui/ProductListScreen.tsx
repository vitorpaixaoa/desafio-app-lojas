import { Center, Text } from '@gluestack-ui/themed';

type ProductListScreenProps = {
  storeId?: string;
};

export function ProductListScreen({ storeId }: ProductListScreenProps) {
  return (
    <Center flex={1} bg="$backgroundDark900">
      <Text color="$textLight200">Produtos da loja {storeId ?? '-'}</Text>
    </Center>
  );
}

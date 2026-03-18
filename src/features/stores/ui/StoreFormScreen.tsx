import { Center, Text } from '@gluestack-ui/themed';

type StoreFormScreenProps = {
  mode: 'create' | 'edit';
  storeId?: string;
};

export function StoreFormScreen({ mode, storeId }: StoreFormScreenProps) {
  return (
    <Center flex={1} bg="$backgroundDark900">
      <Text color="$textLight200">
        {mode === 'create' ? 'Criando loja...' : `Editando loja ${storeId ?? ''}`}
      </Text>
    </Center>
  );
}

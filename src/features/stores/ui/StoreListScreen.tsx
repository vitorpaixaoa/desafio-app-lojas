import { Center, Spinner, Text } from '@gluestack-ui/themed';

export function StoreListScreen() {
  return (
    <Center flex={1} bg="$backgroundDark900">
      <Spinner size="large" color="$blue400" />
      <Text mt="$3" color="$textLight200">
        Em desenvolvimento...
      </Text>
    </Center>
  );
}

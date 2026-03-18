import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  Input,
  InputField,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useTranslation } from 'react-i18next';

import { useDeleteStore, useStores } from '@/features/stores/hooks/useStores';
import { AnimatedCard } from '@/shared/ui/AnimatedCard';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';
import { ScreenGradient } from '@/shared/ui/ScreenGradient';

export function StoreListScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const { data: stores = [], isLoading, isError } = useStores(search);
  const deleteStore = useDeleteStore();

  const empty = useMemo(() => !isLoading && stores.length === 0, [isLoading, stores.length]);

  const onDeleteStore = (storeId: string) => {
    Alert.alert(t('stores.delete.confirmTitle'), t('stores.delete.confirmText'), [
      {
        text: t('stores.delete.cancel'),
        style: 'cancel',
      },
      {
        text: t('stores.delete.action'),
        style: 'destructive',
        onPress: () => {
          deleteStore.mutate(storeId);
        },
      },
    ]);
  };

  return (
    <ScreenGradient>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <VStack gap="$4">
          <HStack alignItems="center" justifyContent="space-between">
            <Heading color="$textLight50" size="2xl">
              {t('stores.title')}
            </Heading>
            <LanguageSwitcher />
          </HStack>

          <HStack gap="$3">
            <Box flex={1}>
              <Input variant="outline" bg="$backgroundDark800" borderRadius="$xl">
                <InputField
                  placeholder={t('stores.search')}
                  placeholderTextColor="#9AA8BE"
                  value={search}
                  onChangeText={setSearch}
                />
              </Input>
            </Box>

            <Button borderRadius="$xl" onPress={() => router.push('/stores/new')}>
              <ButtonText>{t('stores.add')}</ButtonText>
            </Button>
          </HStack>
        </VStack>

        {isLoading ? (
          <VStack alignItems="center" justifyContent="center" py="$10">
            <Spinner size="large" color="$blue400" />
            <Text color="$textLight300" mt="$2">
              {t('states.loading')}
            </Text>
          </VStack>
        ) : null}

        {isError ? (
          <Text color="$error400" mt="$3">
            {t('states.error')}
          </Text>
        ) : null}

        {empty ? (
          <Text color="$textLight300" mt="$3">
            {t('stores.empty')}
          </Text>
        ) : null}

        <VStack gap="$3" mt="$1">
          {stores.map((store, index) => (
            <AnimatedCard key={store.id} delay={index * 60}>
              <VStack gap="$2">
                <Button
                  variant="link"
                  action="secondary"
                  alignSelf="flex-start"
                  px="$0"
                  py="$0"
                  onPress={() =>
                    router.push({
                      pathname: '/stores/[storeId]',
                      params: { storeId: store.id },
                    })
                  }
                >
                  <ButtonText size="lg" color="$textLight50">
                    {store.name}
                  </ButtonText>
                </Button>

                <Text color="$textLight300">{store.address}</Text>
                <Text color="$blue300">{store.productsCount} produtos</Text>

                <HStack gap="$2" mt="$2">
                  <Button
                    flex={1}
                    variant="outline"
                    action="secondary"
                    borderRadius="$lg"
                    onPress={() =>
                      router.push({
                        pathname: '/stores/[storeId]/edit',
                        params: { storeId: store.id },
                      })
                    }
                  >
                    <ButtonText>{t('actions.edit')}</ButtonText>
                  </Button>

                  <Button
                    flex={1}
                    variant="solid"
                    action="negative"
                    borderRadius="$lg"
                    onPress={() => onDeleteStore(store.id)}
                  >
                    <ButtonText>{t('actions.remove')}</ButtonText>
                  </Button>
                </HStack>
              </VStack>
            </AnimatedCard>
          ))}
        </VStack>
      </ScrollView>
    </ScreenGradient>
  );
}

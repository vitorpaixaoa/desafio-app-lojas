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

import { useDeleteProduct, useProducts } from '@/features/products/hooks/useProducts';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { AnimatedCard } from '@/shared/ui/AnimatedCard';
import { ScreenGradient } from '@/shared/ui/ScreenGradient';

type ProductListScreenProps = {
  storeId?: string;
};

export function ProductListScreen({ storeId }: ProductListScreenProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const { data: products = [], isLoading, isError } = useProducts(storeId ?? '', search);
  const deleteProduct = useDeleteProduct();

  const empty = useMemo(() => !isLoading && products.length === 0, [isLoading, products.length]);

  const onDeleteProduct = (productId: string) => {
    Alert.alert(t('actions.remove'), t('products.title'), [
      {
        text: t('actions.close'),
        style: 'cancel',
      },
      {
        text: t('actions.remove'),
        style: 'destructive',
        onPress: () => {
          deleteProduct.mutate(productId);
        },
      },
    ]);
  };

  return (
    <ScreenGradient>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <VStack gap="$4">
          <Heading color="$textLight50" size="2xl">
            {t('products.title')}
          </Heading>

          <HStack gap="$3">
            <Box flex={1}>
              <Input variant="outline" bg="$backgroundDark800" borderRadius="$xl">
                <InputField
                  placeholder={t('products.search')}
                  placeholderTextColor="#9AA8BE"
                  value={search}
                  onChangeText={setSearch}
                />
              </Input>
            </Box>

            <Button
              borderRadius="$xl"
              onPress={() =>
                router.push({
                  pathname: '/stores/[storeId]/products/new',
                  params: { storeId: storeId ?? '' },
                })
              }
            >
              <ButtonText>{t('products.add')}</ButtonText>
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
            {t('products.empty')}
          </Text>
        ) : null}

        <VStack gap="$3" mt="$1">
          {products.map((product, index) => (
            <AnimatedCard key={product.id} delay={index * 60}>
              <VStack gap="$2">
                <Text color="$textLight50" size="lg" fontWeight="$bold">
                  {product.name}
                </Text>
                <Text color="$textLight300">{product.category}</Text>
                <Text color="$blue300">{formatCurrency(product.price)}</Text>

                <HStack gap="$2" mt="$2">
                  <Button
                    flex={1}
                    variant="outline"
                    action="secondary"
                    borderRadius="$lg"
                    onPress={() =>
                      router.push({
                        pathname: '/stores/[storeId]/products/[productId]/edit',
                        params: {
                          storeId: storeId ?? '',
                          productId: product.id,
                        },
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
                    onPress={() => onDeleteProduct(product.id)}
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

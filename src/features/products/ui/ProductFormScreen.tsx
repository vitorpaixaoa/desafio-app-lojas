import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Button,
  ButtonText,
  Heading,
  Input,
  InputField,
  ScrollView,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useTranslation } from 'react-i18next';

import {
  useCreateProduct,
  useProducts,
  useUpdateProduct,
} from '@/features/products/hooks/useProducts';
import { ScreenGradient } from '@/shared/ui/ScreenGradient';

type ProductFormScreenProps = {
  mode: 'create' | 'edit';
  storeId?: string;
  productId?: string;
};

export function ProductFormScreen({ mode, storeId, productId }: ProductFormScreenProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { data: products = [] } = useProducts(storeId ?? '');

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === productId),
    [productId, products],
  );

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && selectedProduct) {
      setName(selectedProduct.name);
      setCategory(selectedProduct.category);
      setPrice(String(selectedProduct.price));
    }
  }, [mode, selectedProduct]);

  const onSubmit = async () => {
    const parsedPrice = Number(price.replace(',', '.'));

    if (!name.trim()) {
      setError(t('products.form.nameRequired'));
      return;
    }

    if (!category.trim()) {
      setError(t('products.form.categoryRequired'));
      return;
    }

    if (!parsedPrice || parsedPrice <= 0) {
      setError(t('products.form.priceRequired'));
      return;
    }

    if (!storeId) {
      setError(t('states.error'));
      return;
    }

    setError('');

    if (mode === 'create') {
      await createProduct.mutateAsync({
        storeId,
        name: name.trim(),
        category: category.trim(),
        price: parsedPrice,
      });
      router.back();
      return;
    }

    if (!productId) {
      setError(t('states.error'));
      return;
    }

    await updateProduct.mutateAsync({
      productId,
      payload: {
        name: name.trim(),
        category: category.trim(),
        price: parsedPrice,
      },
    });

    router.back();
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  return (
    <ScreenGradient>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <VStack gap="$4">
          <Heading color="$textLight50" size="xl">
            {mode === 'create' ? t('products.form.createTitle') : t('products.form.editTitle')}
          </Heading>

          <VStack gap="$2">
            <Text color="$textLight300">{t('products.form.name')}</Text>
            <Input bg="$backgroundDark800" borderRadius="$xl">
              <InputField value={name} onChangeText={setName} autoCapitalize="words" />
            </Input>
          </VStack>

          <VStack gap="$2">
            <Text color="$textLight300">{t('products.form.category')}</Text>
            <Input bg="$backgroundDark800" borderRadius="$xl">
              <InputField value={category} onChangeText={setCategory} autoCapitalize="words" />
            </Input>
          </VStack>

          <VStack gap="$2">
            <Text color="$textLight300">{t('products.form.price')}</Text>
            <Input bg="$backgroundDark800" borderRadius="$xl">
              <InputField
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                autoCapitalize="none"
              />
            </Input>
          </VStack>

          {error ? <Text color="$error400">{error}</Text> : null}

          <Button borderRadius="$xl" isDisabled={isSubmitting} onPress={onSubmit}>
            <ButtonText>{t('products.form.save')}</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </ScreenGradient>
  );
}

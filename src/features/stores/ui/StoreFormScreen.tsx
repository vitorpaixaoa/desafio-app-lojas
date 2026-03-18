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

import { useCreateStore, useStores, useUpdateStore } from '@/features/stores/hooks/useStores';
import { ScreenGradient } from '@/shared/ui/ScreenGradient';

type StoreFormScreenProps = {
  mode: 'create' | 'edit';
  storeId?: string;
};

export function StoreFormScreen({ mode, storeId }: StoreFormScreenProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const createStore = useCreateStore();
  const updateStore = useUpdateStore();

  const { data: stores = [] } = useStores();

  const selectedStore = useMemo(
    () => stores.find((item) => item.id === storeId),
    [storeId, stores],
  );

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && selectedStore) {
      setName(selectedStore.name);
      setAddress(selectedStore.address);
    }
  }, [mode, selectedStore]);

  const onSubmit = async () => {
    if (!name.trim()) {
      setError(t('stores.form.nameRequired'));
      return;
    }

    if (!address.trim()) {
      setError(t('stores.form.addressRequired'));
      return;
    }

    setError('');

    if (mode === 'create') {
      await createStore.mutateAsync({
        name: name.trim(),
        address: address.trim(),
      });
      router.back();
      return;
    }

    if (!storeId) {
      setError(t('states.error'));
      return;
    }

    await updateStore.mutateAsync({
      storeId,
      payload: {
        name: name.trim(),
        address: address.trim(),
      },
    });

    router.back();
  };

  const isSubmitting = createStore.isPending || updateStore.isPending;

  return (
    <ScreenGradient>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <VStack gap="$4">
          <Heading color="$textLight50" size="xl">
            {mode === 'create' ? t('stores.form.createTitle') : t('stores.form.editTitle')}
          </Heading>

          <VStack gap="$2">
            <Text color="$textLight300">{t('stores.form.name')}</Text>
            <Input bg="$backgroundDark800" borderRadius="$xl">
              <InputField value={name} onChangeText={setName} autoCapitalize="words" />
            </Input>
          </VStack>

          <VStack gap="$2">
            <Text color="$textLight300">{t('stores.form.address')}</Text>
            <Input bg="$backgroundDark800" borderRadius="$xl">
              <InputField value={address} onChangeText={setAddress} autoCapitalize="sentences" />
            </Input>
          </VStack>

          {error ? <Text color="$error400">{error}</Text> : null}

          <Button borderRadius="$xl" isDisabled={isSubmitting} onPress={onSubmit}>
            <ButtonText>{t('stores.form.save')}</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </ScreenGradient>
  );
}

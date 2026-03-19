import {
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  Input,
  InputField,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useCreateStore,
  useStores,
  useUpdateStore,
} from "@/features/stores/hooks/useStores";
import { lookupCep } from "@/shared/services/cepService";
import { ScreenGradient } from "@/shared/ui/ScreenGradient";
import { formatZipCode, normalizeZipCode } from "@/shared/utils/address";

type StoreFormScreenProps = {
  mode: "create" | "edit";
  storeId?: string;
};

type AddressFormState = {
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
};

const emptyAddress: AddressFormState = {
  zipCode: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  complement: "",
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

  const [name, setName] = useState("");
  const [address, setAddress] = useState<AddressFormState>(emptyAddress);
  const [error, setError] = useState("");
  const [isLookingUpZip, setIsLookingUpZip] = useState(false);

  useEffect(() => {
    if (mode === "edit" && selectedStore) {
      setName(selectedStore.name);
      setAddress({
        zipCode: formatZipCode(selectedStore.address.zipCode),
        street: selectedStore.address.street,
        number: selectedStore.address.number,
        neighborhood: selectedStore.address.neighborhood,
        city: selectedStore.address.city,
        state: selectedStore.address.state,
        complement: selectedStore.address.complement || "",
      });
    }
  }, [mode, selectedStore]);

  const setAddressField = (field: keyof AddressFormState, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const lookupZipCode = async () => {
    const zipCode = normalizeZipCode(address.zipCode);

    if (zipCode.length !== 8) {
      setError(t("stores.form.zipCodeRequired"));
      return;
    }

    setIsLookingUpZip(true);
    setError("");

    try {
      const result = await lookupCep(zipCode);

      setAddress((prev) => ({
        ...prev,
        zipCode: formatZipCode(result.zipCode),
        street: result.street || prev.street,
        neighborhood: result.neighborhood || prev.neighborhood,
        city: result.city || prev.city,
        state: result.state || prev.state,
      }));
    } catch {
      setError(t("stores.form.zipLookupFailed"));
    } finally {
      setIsLookingUpZip(false);
    }
  };

  const onSubmit = async () => {
    const zipCode = normalizeZipCode(address.zipCode);

    if (!name.trim()) {
      setError(t("stores.form.nameRequired"));
      return;
    }

    if (zipCode.length !== 8) {
      setError(t("stores.form.zipCodeRequired"));
      return;
    }

    if (!address.street.trim()) {
      setError(t("stores.form.streetRequired"));
      return;
    }

    if (!address.number.trim()) {
      setError(t("stores.form.numberRequired"));
      return;
    }

    if (!address.city.trim()) {
      setError(t("stores.form.cityRequired"));
      return;
    }

    if (!address.state.trim()) {
      setError(t("stores.form.stateRequired"));
      return;
    }

    setError("");

    const payload = {
      name: name.trim(),
      address: {
        zipCode,
        street: address.street.trim(),
        number: address.number.trim(),
        neighborhood: address.neighborhood.trim(),
        city: address.city.trim(),
        state: address.state.trim().toUpperCase(),
        complement: address.complement.trim(),
      },
    };

    if (mode === "create") {
      await createStore.mutateAsync(payload);
      router.back();
      return;
    }

    if (!storeId) {
      setError(t("states.error"));
      return;
    }

    await updateStore.mutateAsync({
      storeId,
      payload,
    });

    router.back();
  };

  const isSubmitting = createStore.isPending || updateStore.isPending;

  return (
    <ScreenGradient>
      <ScrollView contentContainerStyle={{ padding: 18 }}>
        <VStack gap="$4">
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 320 }}
          >
            <VStack gap="$1">
              <Text
                color="#1D4ED8"
                fontSize="$xs"
                textTransform="uppercase"
                letterSpacing={1.3}
              >
                Store Details
              </Text>
              <Heading color="$textDark950" size="2xl" lineHeight="$3xl">
                {mode === "create"
                  ? t("stores.form.createTitle")
                  : t("stores.form.editTitle")}
              </Heading>
            </VStack>
          </MotiView>

          <Box
            bg="$backgroundLight50"
            borderColor="$borderLight300"
            borderWidth={1}
            borderRadius="$3xl"
            p="$5"
          >
            <VStack gap="$4">
              <VStack gap="$2">
                <Text color="$textDark600">{t("stores.form.name")}</Text>
                <Input bg="$backgroundLight0" borderRadius="$2xl" h="$12">
                  <InputField
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </Input>
              </VStack>

              <VStack gap="$2">
                <Text color="$textDark600">{t("stores.form.zipCode")}</Text>
                <HStack gap="$2">
                  <Box flex={1}>
                    <Input bg="$backgroundLight0" borderRadius="$2xl" h="$12">
                      <InputField
                        value={address.zipCode}
                        onChangeText={(value) =>
                          setAddressField("zipCode", formatZipCode(value))
                        }
                        keyboardType="numeric"
                        autoCapitalize="none"
                        onBlur={() => {
                          if (
                            normalizeZipCode(address.zipCode).length === 8 &&
                            !address.street.trim()
                          ) {
                            lookupZipCode().catch(() => undefined);
                          }
                        }}
                      />
                    </Input>
                  </Box>

                  <Button
                    borderRadius="$2xl"
                    h="$12"
                    px="$4"
                    variant="outline"
                    action="secondary"
                    onPress={() => {
                      lookupZipCode().catch(() => undefined);
                    }}
                    isDisabled={isLookingUpZip}
                  >
                    <ButtonText>
                      {isLookingUpZip
                        ? t("stores.form.lookupZipLoading")
                        : t("stores.form.lookupZip")}
                    </ButtonText>
                  </Button>
                </HStack>
              </VStack>

              <VStack gap="$2">
                <Text color="$textDark600">{t("stores.form.street")}</Text>
                <Input bg="$backgroundLight0" borderRadius="$2xl" h="$12">
                  <InputField
                    value={address.street}
                    onChangeText={(value) => setAddressField("street", value)}
                    autoCapitalize="words"
                  />
                </Input>
              </VStack>

              <HStack gap="$2">
                <Box flex={1}>
                  <VStack gap="$2">
                    <Text color="$textDark600">{t("stores.form.number")}</Text>
                    <Input bg="$backgroundLight0" borderRadius="$2xl" h="$12">
                      <InputField
                        value={address.number}
                        onChangeText={(value) =>
                          setAddressField("number", value)
                        }
                        autoCapitalize="none"
                      />
                    </Input>
                  </VStack>
                </Box>

                <Box flex={2}>
                  <VStack gap="$2">
                    <Text color="$textDark600">
                      {t("stores.form.neighborhood")}
                    </Text>
                    <Input bg="$backgroundLight0" borderRadius="$2xl" h="$12">
                      <InputField
                        value={address.neighborhood}
                        onChangeText={(value) =>
                          setAddressField("neighborhood", value)
                        }
                        autoCapitalize="words"
                      />
                    </Input>
                  </VStack>
                </Box>
              </HStack>

              <HStack gap="$2">
                <Box flex={2}>
                  <VStack gap="$2">
                    <Text color="$textDark600">{t("stores.form.city")}</Text>
                    <Input bg="$backgroundLight0" borderRadius="$2xl" h="$12">
                      <InputField
                        value={address.city}
                        onChangeText={(value) => setAddressField("city", value)}
                        autoCapitalize="words"
                      />
                    </Input>
                  </VStack>
                </Box>

                <Box flex={1}>
                  <VStack gap="$2">
                    <Text color="$textDark600">{t("stores.form.state")}</Text>
                    <Input bg="$backgroundLight0" borderRadius="$2xl" h="$12">
                      <InputField
                        value={address.state}
                        onChangeText={(value) =>
                          setAddressField(
                            "state",
                            value
                              .replace(/[^A-Za-z]/g, "")
                              .toUpperCase()
                              .slice(0, 2),
                          )
                        }
                        autoCapitalize="characters"
                        autoCorrect={false}
                      />
                    </Input>
                  </VStack>
                </Box>
              </HStack>

              <VStack gap="$2">
                <Text color="$textDark600">{t("stores.form.complement")}</Text>
                <Input bg="$backgroundLight0" borderRadius="$2xl" h="$12">
                  <InputField
                    value={address.complement}
                    onChangeText={(value) =>
                      setAddressField("complement", value)
                    }
                    autoCapitalize="sentences"
                  />
                </Input>
              </VStack>

              {error ? <Text color="#B42318">{error}</Text> : null}

              <Button
                borderRadius="$2xl"
                h="$12"
                isDisabled={isSubmitting}
                onPress={onSubmit}
              >
                <ButtonText>{t("stores.form.save")}</ButtonText>
              </Button>
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
    </ScreenGradient>
  );
}

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
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import { useDeleteStore, useStores } from "@/features/stores/hooks/useStores";
import { AnimatedCard } from "@/shared/ui/AnimatedCard";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";
import { ScreenGradient } from "@/shared/ui/ScreenGradient";
import { formatAddressLine, formatAddressMeta } from "@/shared/utils/address";

export function StoreListScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [isAddPressed, setIsAddPressed] = useState(false);
  const { data: stores = [], isLoading, isError } = useStores(search);
  const deleteStore = useDeleteStore();
  const productsLabel = t("products.title").toLowerCase();

  const empty = useMemo(
    () => !isLoading && stores.length === 0,
    [isLoading, stores.length],
  );

  const onDeleteStore = (storeId: string) => {
    Alert.alert(
      t("stores.delete.confirmTitle"),
      t("stores.delete.confirmText"),
      [
        {
          text: t("stores.delete.cancel"),
          style: "cancel",
        },
        {
          text: t("stores.delete.action"),
          style: "destructive",
          onPress: () => {
            deleteStore.mutate(storeId);
          },
        },
      ],
    );
  };

  return (
    <ScreenGradient>
      <ScrollView contentContainerStyle={{ padding: 18, gap: 18 }}>
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 420 }}
        >
          <VStack gap="$1" mb="$4">
            <Text
              color="#1D4ED8"
              fontSize="$xs"
              letterSpacing={1.4}
              textTransform="uppercase"
              opacity={0.85}
            >
              Retail Manager
            </Text>
            <Heading color="$textDark950" size="3xl" lineHeight="$4xl">
              {t("stores.title")}
            </Heading>
            <Text color="$textDark600" mt="$1">
              Gestão centralizada com busca rápida e navegação fluida.
            </Text>
          </VStack>
        </MotiView>

        <VStack
          gap="$4"
          bg="$backgroundLight50"
          p="$4"
          borderRadius="$3xl"
          borderColor="$borderLight300"
          borderWidth={1}
        >
          <HStack alignItems="center" justifyContent="space-between">
            <Text color="$textDark600" fontSize="$sm">
              Preferência de idioma
            </Text>
            <LanguageSwitcher />
          </HStack>

          <HStack gap="$3">
            <Box flex={1}>
              <Input
                variant="outline"
                bg="$backgroundLight0"
                borderRadius="$2xl"
                height="$12"
              >
                <InputField
                  placeholder={t("stores.search")}
                  placeholderTextColor="#6B7280"
                  value={search}
                  onChangeText={setSearch}
                />
              </Input>
            </Box>

            <MotiView
              animate={{ scale: isAddPressed ? 0.97 : 1 }}
              transition={{ type: "timing", duration: 120 }}
            >
              <Button
                borderRadius="$2xl"
                h="$12"
                px="$5"
                onPressIn={() => setIsAddPressed(true)}
                onPressOut={() => setIsAddPressed(false)}
                onPress={() => router.push("/stores/new")}
              >
                <ButtonText>{t("stores.add")}</ButtonText>
              </Button>
            </MotiView>
          </HStack>
        </VStack>

        {isLoading ? (
          <VStack
            alignItems="center"
            justifyContent="center"
            py="$10"
            bg="$backgroundLight50"
            borderRadius="$3xl"
            borderColor="$borderLight300"
            borderWidth={1}
          >
            <Spinner size="large" color="$blue400" />
            <Text color="$textDark600" mt="$2">
              {t("states.loading")}
            </Text>
          </VStack>
        ) : null}

        {isError ? (
          <Text color="#B42318" mt="$3">
            {t("states.error")}
          </Text>
        ) : null}

        {empty ? (
          <Box
            mt="$3"
            p="$5"
            borderRadius="$3xl"
            borderColor="$borderLight300"
            borderWidth={1}
            bg="$backgroundLight50"
          >
            <Text color="$textDark600">{t("stores.empty")}</Text>
          </Box>
        ) : null}

        <VStack gap="$4" mt="$1">
          {stores.map((store, index) => (
            <AnimatedCard key={store.id} delay={index * 70}>
              <VStack gap="$3">
                <Button
                  variant="link"
                  action="secondary"
                  alignSelf="flex-start"
                  px="$0"
                  py="$0"
                  onPress={() =>
                    router.push({
                      pathname: "/stores/[storeId]",
                      params: { storeId: store.id },
                    })
                  }
                >
                  <ButtonText
                    size="xl"
                    color="$textDark950"
                    letterSpacing={0.2}
                  >
                    {store.name}
                  </ButtonText>
                </Button>

                <Text color="$textDark600">
                  {formatAddressLine(store.address)}
                </Text>
                <Text color="$textDark400" fontSize="$xs">
                  {formatAddressMeta(store.address)}
                </Text>
                <Box
                  alignSelf="flex-start"
                  bg="#E8F1FF"
                  px="$3"
                  py="$1"
                  borderRadius="$full"
                  borderColor="#BBD3FF"
                  borderWidth={1}
                >
                  <Text color="#1D4ED8" fontSize="$xs" letterSpacing={0.6}>
                    {store.productsCount} {productsLabel}
                  </Text>
                </Box>

                <HStack gap="$2" mt="$2">
                  <Button
                    flex={1}
                    variant="outline"
                    action="secondary"
                    borderRadius="$lg"
                    h="$11"
                    onPress={() =>
                      router.push({
                        pathname: "/stores/[storeId]/edit",
                        params: { storeId: store.id },
                      })
                    }
                  >
                    <ButtonText>{t("actions.edit")}</ButtonText>
                  </Button>

                  <Button
                    flex={1}
                    variant="solid"
                    action="negative"
                    borderRadius="$lg"
                    h="$11"
                    onPress={() => onDeleteStore(store.id)}
                  >
                    <ButtonText>{t("actions.remove")}</ButtonText>
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

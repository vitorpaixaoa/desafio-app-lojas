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

import {
  useDeleteProduct,
  useProducts,
} from "@/features/products/hooks/useProducts";
import { AnimatedCard } from "@/shared/ui/AnimatedCard";
import { ScreenGradient } from "@/shared/ui/ScreenGradient";
import { formatCurrency } from "@/shared/utils/formatCurrency";

type ProductListScreenProps = {
  storeId?: string;
};

export function ProductListScreen({ storeId }: ProductListScreenProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [isAddPressed, setIsAddPressed] = useState(false);

  const {
    data: products = [],
    isLoading,
    isError,
  } = useProducts(storeId ?? "", search);
  const deleteProduct = useDeleteProduct();

  const empty = useMemo(
    () => !isLoading && products.length === 0,
    [isLoading, products.length],
  );

  const onDeleteProduct = (productId: string) => {
    Alert.alert(t("actions.remove"), t("products.title"), [
      {
        text: t("actions.close"),
        style: "cancel",
      },
      {
        text: t("actions.remove"),
        style: "destructive",
        onPress: () => {
          deleteProduct.mutate(productId);
        },
      },
    ]);
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
              Store Inventory
            </Text>
            <Heading color="$textDark950" size="3xl" lineHeight="$4xl">
              {t("products.title")}
            </Heading>
            <Text color="$textDark600" mt="$1">
              Itens vinculados à loja, com busca instantânea e edição rápida.
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
          <HStack gap="$3">
            <Box flex={1}>
              <Input
                variant="outline"
                bg="$backgroundLight0"
                borderRadius="$2xl"
                height="$12"
              >
                <InputField
                  placeholder={t("products.search")}
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
                onPress={() =>
                  router.push({
                    pathname: "/stores/[storeId]/products/new",
                    params: { storeId: storeId ?? "" },
                  })
                }
              >
                <ButtonText>{t("products.add")}</ButtonText>
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
            <Text color="$textDark600">{t("products.empty")}</Text>
          </Box>
        ) : null}

        <VStack gap="$4" mt="$1">
          {products.map((product, index) => (
            <AnimatedCard key={product.id} delay={index * 70}>
              <VStack gap="$3">
                <Text
                  color="$textDark950"
                  size="xl"
                  fontWeight="$bold"
                  letterSpacing={0.2}
                >
                  {product.name}
                </Text>
                <Text color="$textDark600">{product.category}</Text>
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
                    {formatCurrency(product.price)}
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
                        pathname: "/stores/[storeId]/products/[productId]/edit",
                        params: {
                          storeId: storeId ?? "",
                          productId: product.id,
                        },
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
                    onPress={() => onDeleteProduct(product.id)}
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

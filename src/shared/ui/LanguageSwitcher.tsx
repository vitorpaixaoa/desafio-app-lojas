import { Button, ButtonText, HStack } from "@gluestack-ui/themed";
import { MotiView } from "moti";

import { AppLanguage } from "@/shared/i18n/resources";
import { useLanguageStore } from "@/shared/state/useLanguageStore";

const languages: { code: AppLanguage; label: string }[] = [
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

export function LanguageSwitcher() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <HStack
      gap="$2"
      bg="$backgroundLight100"
      p="$1"
      borderRadius="$full"
      borderColor="$borderLight300"
      borderWidth={1}
    >
      {languages.map((item) => (
        <MotiView
          key={item.code}
          animate={{ scale: language === item.code ? 1 : 0.96 }}
          transition={{ type: "timing", duration: 180 }}
        >
          <Button
            action={language === item.code ? "primary" : "secondary"}
            size="xs"
            variant={language === item.code ? "solid" : "link"}
            borderRadius="$full"
            minWidth="$10"
            onPress={() => setLanguage(item.code)}
          >
            <ButtonText>{item.label}</ButtonText>
          </Button>
        </MotiView>
      ))}
    </HStack>
  );
}

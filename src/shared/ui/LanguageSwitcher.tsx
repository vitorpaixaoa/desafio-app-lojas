import { Button, ButtonText, HStack } from '@gluestack-ui/themed';

import { AppLanguage } from '@/shared/i18n/resources';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

const languages: Array<{ code: AppLanguage; label: string }> = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
];

export function LanguageSwitcher() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <HStack gap="$2">
      {languages.map((item) => (
        <Button
          key={item.code}
          action={language === item.code ? 'primary' : 'secondary'}
          size="xs"
          variant={language === item.code ? 'solid' : 'outline'}
          onPress={() => setLanguage(item.code)}
        >
          <ButtonText>{item.label}</ButtonText>
        </Button>
      ))}
    </HStack>
  );
}

import i18next from '@/shared/i18n';

const localeByLanguage = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

export function formatCurrency(value: number) {
  const lang = (i18next.language?.slice(0, 2) ?? 'pt') as keyof typeof localeByLanguage;

  return new Intl.NumberFormat(localeByLanguage[lang] ?? 'pt-BR', {
    style: 'currency',
    currency: lang === 'pt' ? 'BRL' : 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

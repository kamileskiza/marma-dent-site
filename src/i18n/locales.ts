export interface LocaleInfo {
  code: string;
  flag: string;
  name: string;
  dir: 'ltr' | 'rtl';
  hreflang: string;
}

// Ordered by dental-tourism-to-Turkey potential (highest first), per client brief.
export const LOCALES: LocaleInfo[] = [
  { code: 'en', flag: '🇬🇧', name: 'English', dir: 'ltr', hreflang: 'en' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe', dir: 'ltr', hreflang: 'tr' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский', dir: 'ltr', hreflang: 'ru' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch', dir: 'ltr', hreflang: 'de' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية', dir: 'rtl', hreflang: 'ar' },
  { code: 'az', flag: '🇦🇿', name: 'Azərbaycanca', dir: 'ltr', hreflang: 'az' },
  { code: 'uk', flag: '🇺🇦', name: 'Українська', dir: 'ltr', hreflang: 'uk' },
  { code: 'bg', flag: '🇧🇬', name: 'Български', dir: 'ltr', hreflang: 'bg' },
  { code: 'nl', flag: '🇳🇱', name: 'Nederlands', dir: 'ltr', hreflang: 'nl' },
  { code: 'fr', flag: '🇫🇷', name: 'Français', dir: 'ltr', hreflang: 'fr' },
  { code: 'pl', flag: '🇵🇱', name: 'Polski', dir: 'ltr', hreflang: 'pl' },
  { code: 'ro', flag: '🇷🇴', name: 'Română', dir: 'ltr', hreflang: 'ro' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano', dir: 'ltr', hreflang: 'it' },
  { code: 'el', flag: '🇬🇷', name: 'Ελληνικά', dir: 'ltr', hreflang: 'el' },
  { code: 'es', flag: '🇪🇸', name: 'Español', dir: 'ltr', hreflang: 'es' },
  { code: 'cs', flag: '🇨🇿', name: 'Čeština', dir: 'ltr', hreflang: 'cs' },
  { code: 'sk', flag: '🇸🇰', name: 'Slovenčina', dir: 'ltr', hreflang: 'sk' },
  { code: 'hu', flag: '🇭🇺', name: 'Magyar', dir: 'ltr', hreflang: 'hu' },
  { code: 'lt', flag: '🇱🇹', name: 'Lietuvių', dir: 'ltr', hreflang: 'lt' },
  { code: 'lv', flag: '🇱🇻', name: 'Latviešu', dir: 'ltr', hreflang: 'lv' },
  { code: 'et', flag: '🇪🇪', name: 'Eesti', dir: 'ltr', hreflang: 'et' },
  { code: 'pt', flag: '🇵🇹', name: 'Português', dir: 'ltr', hreflang: 'pt' },
  { code: 'sv', flag: '🇸🇪', name: 'Svenska', dir: 'ltr', hreflang: 'sv' },
  { code: 'da', flag: '🇩🇰', name: 'Dansk', dir: 'ltr', hreflang: 'da' },
  { code: 'fi', flag: '🇫🇮', name: 'Suomi', dir: 'ltr', hreflang: 'fi' },
  { code: 'hr', flag: '🇭🇷', name: 'Hrvatski', dir: 'ltr', hreflang: 'hr' },
  { code: 'sl', flag: '🇸🇮', name: 'Slovenščina', dir: 'ltr', hreflang: 'sl' },
  { code: 'sr', flag: '🇷🇸', name: 'Српски', dir: 'ltr', hreflang: 'sr' },
  { code: 'no', flag: '🇳🇴', name: 'Norsk', dir: 'ltr', hreflang: 'no' },
];

export const DEFAULT_LOCALE = 'en';

export function getLocale(code: string): LocaleInfo {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

export function localePath(code: string, path: string = ''): string {
  const clean = path.replace(/^\/+/, '');
  if (code === DEFAULT_LOCALE) return `/${clean}`;
  return `/${code}/${clean}`;
}

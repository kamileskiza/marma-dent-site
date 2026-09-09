import { BLOG_EN } from '../content/blog/en';
import { BLOG_TR } from '../content/blog/tr';
import { BLOG_RU } from '../content/blog/ru';
import { BLOG_DE } from '../content/blog/de';
import { BLOG_AR } from '../content/blog/ar';
import { BLOG_AZ } from '../content/blog/az';
import { BLOG_UK } from '../content/blog/uk';
import { BLOG_BG } from '../content/blog/bg';
import { BLOG_NL } from '../content/blog/nl';
import { BLOG_FR } from '../content/blog/fr';
import { BLOG_PL } from '../content/blog/pl';
import { BLOG_RO } from '../content/blog/ro';
import { BLOG_IT } from '../content/blog/it';
import { BLOG_EL } from '../content/blog/el';
import { BLOG_ES } from '../content/blog/es';
import { BLOG_CS } from '../content/blog/cs';
import { BLOG_SK } from '../content/blog/sk';
import { BLOG_HU } from '../content/blog/hu';
import { BLOG_LT } from '../content/blog/lt';
import { BLOG_LV } from '../content/blog/lv';
import { BLOG_ET } from '../content/blog/et';
import { BLOG_PT } from '../content/blog/pt';
import { BLOG_SV } from '../content/blog/sv';
import { BLOG_DA } from '../content/blog/da';
import { BLOG_FI } from '../content/blog/fi';
import { BLOG_HR } from '../content/blog/hr';
import { BLOG_SL } from '../content/blog/sl';
import { BLOG_SR } from '../content/blog/sr';
import { BLOG_NO } from '../content/blog/no';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  relatedTreatment: string | null;
  body: Array<{ h?: string; p?: string }>;
}

const BLOG: Record<string, BlogPost[]> = {
  en: BLOG_EN,
  tr: BLOG_TR,
  ru: BLOG_RU,
  de: BLOG_DE,
  ar: BLOG_AR,
  az: BLOG_AZ,
  uk: BLOG_UK,
  bg: BLOG_BG,
  nl: BLOG_NL,
  fr: BLOG_FR,
  pl: BLOG_PL,
  ro: BLOG_RO,
  it: BLOG_IT,
  el: BLOG_EL,
  es: BLOG_ES,
  cs: BLOG_CS,
  sk: BLOG_SK,
  hu: BLOG_HU,
  lt: BLOG_LT,
  lv: BLOG_LV,
  et: BLOG_ET,
  pt: BLOG_PT,
  sv: BLOG_SV,
  da: BLOG_DA,
  fi: BLOG_FI,
  hr: BLOG_HR,
  sl: BLOG_SL,
  sr: BLOG_SR,
  no: BLOG_NO,
};

// Only locales with real, hand-written blog content — no fallback, no fake pages.
export const BLOG_LOCALES = Object.keys(BLOG);

export function getBlogPosts(locale: string): BlogPost[] {
  return BLOG[locale] ?? [];
}

export function getBlogPost(locale: string, slug: string): BlogPost | undefined {
  return getBlogPosts(locale).find((p) => p.slug === slug);
}

// Fallback <title>/<meta description> builders used for every treatment page
// that does NOT have a hand-tuned entry in seo-overrides.ts (currently only
// en/tr are hand-tuned; the other 27 locales fall back to this).
//
// Fixes two things the full-site SEO audit flagged:
// 1. Duplicate <title> across locales — many treatment names (e.g. "Hollywood
//    Smile") are proper nouns and stay the same word in dozens of languages,
//    so the old fallback (`${title} — Nizam Abdullayev Dental Clinic`) produced
//    an identical <title> tag on 20+ different-locale URLs. Appending the
//    in-language word for "Istanbul" both de-duplicates the tag AND adds the
//    single highest-value local geo-keyword patients actually search with.
// 2. Titles over ~65 chars / descriptions outside the ~70-165 char band that
//    search engines truncate or flag as thin content.

const BRAND_FULL = 'Nizam Abdullayev Dental Clinic';
const BRAND_SHORT = 'Nizam Abdullayev';
const TITLE_MAX = 65;
const DESC_MIN = 70;
const DESC_MAX = 165;

// The in-language word for "Istanbul", taken from each locale's own
// hand-written homepage SEO title (home-seo.ts) so it matches the term
// already used elsewhere on the site.
export const ISTANBUL_WORD: Record<string, string> = {
  en: 'Istanbul', tr: 'İstanbul', ru: 'Стамбул', de: 'Istanbul', ar: 'اسطنبول',
  az: 'İstanbul', uk: 'Стамбул', bg: 'Истанбул', nl: 'Istanbul', fr: 'Istanbul',
  pl: 'Stambuł', ro: 'Istanbul', it: 'Istanbul', el: 'Κωνσταντινούπολη',
  es: 'Estambul', cs: 'Istanbul', sk: 'Istanbul', hu: 'Isztambul',
  lt: 'Stambulas', lv: 'Stambula', et: 'Istanbul', pt: 'Istambul',
  sv: 'Istanbul', da: 'Istanbul', fi: 'Istanbul', hr: 'Istanbul', sl: 'Istanbul',
  sr: 'Истанбул', no: 'Istanbul',
};

// A short, reusable trust clause ("digital planning, lifetime warranty...")
// in each language, lifted from the second sentence of that locale's own
// homepage meta description (home-seo.ts) — used to pad out taglines that are
// too short to serve as a full meta description on their own.
const DESC_SUFFIX: Record<string, string> = {
  en: 'Digital planning, lifetime warranty, free quote in 24h.',
  tr: 'Dijital planlama, ömür boyu garanti, 24 saatte ücretsiz teklif.',
  ru: 'Цифровое планирование, пожизненная гарантия.',
  de: 'Digitale Planung, lebenslange Garantie, kostenloses Angebot in 24h.',
  ar: 'تخطيط رقمي، ضمان مدى الحياة، عرض سعر مجاني خلال 24 ساعة.',
  az: 'Rəqəmsal planlaşdırma, ömürlük zəmanət, 24 saatə pulsuz təklif.',
  uk: 'Цифрове планування, довічна гарантія.',
  bg: 'Цифрово планиране, доживотна гаранция.',
  nl: 'Digitale planning, levenslange garantie.',
  fr: 'Planification numérique, garantie à vie.',
  pl: 'Planowanie cyfrowe, dożywotnia gwarancja.',
  ro: 'Planificare digitală, garanție pe viață.',
  it: 'Pianificazione digitale, garanzia a vita.',
  el: 'Ψηφιακός σχεδιασμός, εγγύηση ζωής.',
  es: 'Planificación digital, garantía de por vida.',
  cs: 'Digitální plánování, doživotní záruka.',
  sk: 'Digitálne plánovanie, doživotná záruka.',
  hu: 'Digitális tervezés, élethosszig tartó garancia.',
  lt: 'Skaitmeninis planavimas, garantija visam gyvenimui.',
  lv: 'Digitālā plānošana, mūža garantija.',
  et: 'Digitaalne planeerimine, eluaegne garantii.',
  pt: 'Planeamento digital, garantia vitalícia.',
  sv: 'Digital planering, livstidsgaranti, gratis offert inom 24h.',
  da: 'Digital planlægning, livstidsgaranti, gratis tilbud inden for 24 timer.',
  fi: 'Digitaalinen suunnittelu, elinikäinen takuu.',
  hr: 'Digitalno planiranje, doživotno jamstvo.',
  sl: 'Digitalno načrtovanje, doživljenjska garancija.',
  sr: 'Дигитално планирање, доживотна гаранција.',
  no: 'Digital planlegging, livstidsgaranti, gratis tilbud innen 24 timer.',
};

function truncateAtWord(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + '…';
}

// Appends " — Nizam Abdullayev Dental Clinic" (or a shorter form, or nothing)
// depending on how much room `base` leaves under the ~65 char budget.
export function buildTitleWithBrand(base: string): string {
  const withFull = `${base} — ${BRAND_FULL}`;
  if (withFull.length <= TITLE_MAX) return withFull;

  const withShort = `${base} — ${BRAND_SHORT}`;
  if (withShort.length <= TITLE_MAX) return withShort;

  // Still too long (a long article/treatment name): drop the brand suffix
  // entirely and just truncate the base title itself.
  return truncateAtWord(base, TITLE_MAX);
}

export function buildFallbackTitle(treatmentTitle: string, locale: string): string {
  const city = ISTANBUL_WORD[locale];
  const base = city ? `${treatmentTitle} ${city}` : treatmentTitle;
  return buildTitleWithBrand(base);
}

export function buildFallbackDescription(tagline: string, locale: string): string {
  if (tagline.length > DESC_MAX) return truncateAtWord(tagline, DESC_MAX);
  if (tagline.length >= DESC_MIN) return tagline;

  const suffix = DESC_SUFFIX[locale];
  if (!suffix) return tagline;
  const combined = `${tagline} ${suffix}`;
  return combined.length <= DESC_MAX ? combined : truncateAtWord(combined, DESC_MAX);
}

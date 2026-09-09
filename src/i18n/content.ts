import homeEn from '../content/home/en.json';
import homeTr from '../content/home/tr.json';
import homeRu from '../content/home/ru.json';
import homeDe from '../content/home/de.json';
import homeAr from '../content/home/ar.json';
import homeAz from '../content/home/az.json';
import homeUk from '../content/home/uk.json';
import homeBg from '../content/home/bg.json';
import homeNl from '../content/home/nl.json';
import homeFr from '../content/home/fr.json';
import homePl from '../content/home/pl.json';
import homeRo from '../content/home/ro.json';
import homeIt from '../content/home/it.json';
import homeEl from '../content/home/el.json';
import homeEs from '../content/home/es.json';
import homeCs from '../content/home/cs.json';
import homeSk from '../content/home/sk.json';
import homeHu from '../content/home/hu.json';
import homeLt from '../content/home/lt.json';
import homeLv from '../content/home/lv.json';
import homeEt from '../content/home/et.json';
import homePt from '../content/home/pt.json';
import homeSv from '../content/home/sv.json';
import homeDa from '../content/home/da.json';
import homeFi from '../content/home/fi.json';
import homeHr from '../content/home/hr.json';
import homeSl from '../content/home/sl.json';
import homeSr from '../content/home/sr.json';
import homeNo from '../content/home/no.json';

import treatEn from '../content/treatments/en.json';
import treatTr from '../content/treatments/tr.json';
import treatRu from '../content/treatments/ru.json';
import treatDe from '../content/treatments/de.json';
import treatAr from '../content/treatments/ar.json';
import treatAz from '../content/treatments/az.json';
import treatUk from '../content/treatments/uk.json';
import treatBg from '../content/treatments/bg.json';
import treatNl from '../content/treatments/nl.json';
import treatFr from '../content/treatments/fr.json';
import treatPl from '../content/treatments/pl.json';
import treatRo from '../content/treatments/ro.json';
import treatIt from '../content/treatments/it.json';
import treatEl from '../content/treatments/el.json';
import treatEs from '../content/treatments/es.json';
import treatCs from '../content/treatments/cs.json';
import treatSk from '../content/treatments/sk.json';
import treatHu from '../content/treatments/hu.json';
import treatLt from '../content/treatments/lt.json';
import treatLv from '../content/treatments/lv.json';
import treatEt from '../content/treatments/et.json';
import treatPt from '../content/treatments/pt.json';
import treatSv from '../content/treatments/sv.json';
import treatDa from '../content/treatments/da.json';
import treatFi from '../content/treatments/fi.json';
import treatHr from '../content/treatments/hr.json';
import treatSl from '../content/treatments/sl.json';
import treatSr from '../content/treatments/sr.json';
import treatNo from '../content/treatments/no.json';

const HOME: Record<string, Record<string, string>> = {
  en: homeEn, tr: homeTr, ru: homeRu, de: homeDe, ar: homeAr, az: homeAz,
  uk: homeUk, bg: homeBg, nl: homeNl, fr: homeFr, pl: homePl, ro: homeRo,
  it: homeIt, el: homeEl, es: homeEs,
  cs: homeCs, sk: homeSk, hu: homeHu, lt: homeLt, lv: homeLv, et: homeEt,
  pt: homePt, sv: homeSv, da: homeDa, fi: homeFi, hr: homeHr, sl: homeSl,
  sr: homeSr, no: homeNo,
};

const TREATMENTS: Record<string, Record<string, any>> = {
  en: treatEn, tr: treatTr, ru: treatRu, de: treatDe, ar: treatAr, az: treatAz,
  uk: treatUk, bg: treatBg, nl: treatNl, fr: treatFr, pl: treatPl, ro: treatRo,
  it: treatIt, el: treatEl, es: treatEs,
  cs: treatCs,
  sk: treatSk,
  hu: treatHu,
  lt: treatLt,
  lv: treatLv,
  et: treatEt,
  pt: treatPt,
  sv: treatSv,
  da: treatDa,
  fi: treatFi,
  hr: treatHr,
  sl: treatSl,
  sr: treatSr,
  no: treatNo,
};

// Locales with real, hand-written TREATMENT PAGE content (14 treatments each).
// IMPORTANT: this list intentionally does NOT yet include the remaining newer
// European locales (sk/hu/lt/lv/et/pt/sv/da/fi/hr/sl/sr/no) — their homepages are
// fully translated, but their treatment pages don't have real content yet. Per the
// no-fake-hreflang principle, treatment pages (and their hreflang sets) are only
// generated for locales in this list until each one's content is actually written.
export const TREATMENT_CONTENT_LOCALES = [
  'en','tr','ru','de','ar','az','uk','bg','nl','fr','pl','ro','it','el','es',
  'cs',
  'sk',
  'hu',
  'lt',
  'lv',
  'et',
  'pt',
  'sv',
  'da',
  'fi',
  'hr',
  'sl',
  'sr',
  'no',
];

// Some treatments (like the newly-added E-max Veneers) only have content in a
// subset of locales so far. Defaults to TREATMENT_CONTENT_LOCALES for treatments
// not listed here.
export const TREATMENT_LOCALES_OVERRIDE: Record<string, string[]> = {
  'emax-veneers': ['en', 'tr', 'ru', 'de'],
  // zygomatic-implants, dental-bridge, invisalign now have content in all 15 languages —
  // no override needed, they use the full TREATMENT_CONTENT_LOCALES list below.
};

export function localesForTreatment(id: string): string[] {
  return TREATMENT_LOCALES_OVERRIDE[id] ?? TREATMENT_CONTENT_LOCALES;
}

export function getHome(locale: string): Record<string, string> {
  return HOME[locale] ?? HOME.en;
}

export function getTreatments(locale: string): Record<string, any> {
  return TREATMENTS[locale] ?? TREATMENTS.en;
}

// ============================================================================
// SLUG REDIRECT REGISTRY
// ============================================================================
// Purpose: whenever a treatment or blog slug is renamed in the future, add one
// line here instead of leaving the old URL to 404. On every `npx astro build`,
// the Astro integration registered in astro.config.mjs reads this list and
// writes a Netlify `_redirects` file into dist/, so every entry becomes a real
// 301 redirect the moment the site is deployed. Nothing else needs to change.
//
// HOW TO ADD A REDIRECT
// ----------------------------------------------------------------------------
// 1. Find the locale the slug changed in (redirects are per-locale, because
//    every language has its own independent slug).
// 2. Add an entry: { from: '/old-slug-istanbul/', to: '/new-slug-istanbul/' }
//    - Paths are relative to that locale's own URL root (the locale prefix,
//      e.g. /tr/, is added automatically below — don't include it yourself,
//      except for English, which has no prefix).
//    - Always include the leading AND trailing slash, matching this site's
//      trailingSlash: 'always' convention.
// 3. Rebuild (`npx astro build`). Done — dist/_redirects now contains the
//    301 rule. Deploy as usual.
//
// EXAMPLE
// ----------------------------------------------------------------------------
// tr: [
//   { from: '/eski-slug-istanbul/', to: '/yeni-slug-istanbul/' },
// ],
//
// Redirects are additive and safe to leave here indefinitely — an unused
// entry just means an old URL keeps forwarding correctly, which is exactly
// what you want for links that are already indexed by Google or shared
// externally. Never delete an entry unless you're certain nothing still
// points to the old URL.
// ============================================================================

export interface SlugRedirect {
  from: string; // old path, locale-relative, e.g. '/old-treatment-name-istanbul/'
  to: string;   // new path, locale-relative, e.g. '/new-treatment-name-istanbul/'
}

export const REDIRECTS: Record<string, SlugRedirect[]> = {
  en: [],
  tr: [],
  ru: [],
  de: [],
  ar: [],
  az: [],
  uk: [],
  bg: [],
  nl: [],
  fr: [],
  pl: [],
  ro: [],
  it: [],
  el: [],
  es: [],
  cs: [],
  sk: [],
  hu: [],
  lt: [],
  lv: [],
  et: [],
  pt: [],
  sv: [],
  da: [],
  fi: [],
  hr: [],
  sl: [],
  sr: [],
  no: [],
};

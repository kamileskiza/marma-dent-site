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
  tr: [
    // 2026-10-01: non-ASCII slugs transliterated (raw + percent-encoded old URL)
    { from: '/blog/milyonlarca-hasta-neden-turkiyeyi-diş-bakimi-icin-seciyor/', to: '/blog/milyonlarca-hasta-neden-turkiyeyi-dis-bakimi-icin-seciyor/' },
    { from: '/blog/milyonlarca-hasta-neden-turkiyeyi-di%C5%9F-bakimi-icin-seciyor/', to: '/blog/milyonlarca-hasta-neden-turkiyeyi-dis-bakimi-icin-seciyor/' },
  ],
  ru: [],
  de: [],
  ar: [],
  az: [
    // 2026-10-01: non-ASCII slugs transliterated (raw + percent-encoded old URL)
    { from: '/blog/all-on-4-qiymeti-turkiye-vs-ingiltere-abş/', to: '/blog/all-on-4-qiymeti-turkiye-vs-ingiltere-abs/' },
    { from: '/blog/all-on-4-qiymeti-turkiye-vs-ingiltere-ab%C5%9F/', to: '/blog/all-on-4-qiymeti-turkiye-vs-ingiltere-abs/' },
    { from: '/ortodontiya-diş-teli-istanbul/', to: '/ortodontiya-dis-teli-istanbul/' },
    { from: '/ortodontiya-di%C5%9F-teli-istanbul/', to: '/ortodontiya-dis-teli-istanbul/' },
    { from: '/vintli-oklüzal-sistem-istanbul/', to: '/vintli-okluzal-sistem-istanbul/' },
    { from: '/vintli-okl%C3%BCzal-sistem-istanbul/', to: '/vintli-okluzal-sistem-istanbul/' },
  ],
  uk: [
    // 2026-10-01: non-ASCII slugs transliterated (raw + percent-encoded old URL)
    { from: '/blog/chy-mozhna-robyty-implanty-yakshcho-vy-kurytе/', to: '/blog/chy-mozhna-robyty-implanty-yakshcho-vy-kuryte/' },
    { from: '/blog/chy-mozhna-robyty-implanty-yakshcho-vy-kuryt%D0%B5/', to: '/blog/chy-mozhna-robyty-implanty-yakshcho-vy-kuryte/' },
  ],
  bg: [],
  nl: [],
  fr: [],
  pl: [],
  ro: [],
  it: [],
  el: [],
  es: [],
  cs: [
    // 2026-10-01: non-ASCII slugs transliterated (raw + percent-encoded old URL)
    { from: '/blog/proc-miliony-pacientu-volí-turecko-pro-zubni-peci/', to: '/blog/proc-miliony-pacientu-voli-turecko-pro-zubni-peci/' },
    { from: '/blog/proc-miliony-pacientu-vol%C3%AD-turecko-pro-zubni-peci/', to: '/blog/proc-miliony-pacientu-voli-turecko-pro-zubni-peci/' },
  ],
  sk: [],
  hu: [],
  lt: [
    // 2026-10-01: non-ASCII slugs transliterated (raw + percent-encoded old URL)
    { from: '/blog/all-on-4-kaina-kas-iš-tikrujų-ijeita/', to: '/blog/all-on-4-kaina-kas-is-tikruju-ijeita/' },
    { from: '/blog/all-on-4-kaina-kas-i%C5%A1-tikruj%C5%B3-ijeita/', to: '/blog/all-on-4-kaina-kas-is-tikruju-ijeita/' },
    { from: '/blog/hollywood-smile-prieš-fasetes-tikrasis-skirtumas/', to: '/blog/hollywood-smile-pries-fasetes-tikrasis-skirtumas/' },
    { from: '/blog/hollywood-smile-prie%C5%A1-fasetes-tikrasis-skirtumas/', to: '/blog/hollywood-smile-pries-fasetes-tikrasis-skirtumas/' },
    { from: '/blog/invisalign-prieš-tradicinius-breketus-ka-pasirinkti/', to: '/blog/invisalign-pries-tradicinius-breketus-ka-pasirinkti/' },
    { from: '/blog/invisalign-prie%C5%A1-tradicinius-breketus-ka-pasirinkti/', to: '/blog/invisalign-pries-tradicinius-breketus-ka-pasirinkti/' },
    { from: '/blog/kiek-iš-tikrujų-trunka-cirkonio-karuneles/', to: '/blog/kiek-is-tikruju-trunka-cirkonio-karuneles/' },
    { from: '/blog/kiek-i%C5%A1-tikruj%C5%B3-trunka-cirkonio-karuneles/', to: '/blog/kiek-is-tikruju-trunka-cirkonio-karuneles/' },
  ],
  lv: [
    // 2026-10-01: non-ASCII slugs transliterated (raw + percent-encoded old URL)
    { from: '/blog/cik-ilgi-aizmnem-cirkonija-kroņa-izgatavosana/', to: '/blog/cik-ilgi-aizmnem-cirkonija-krona-izgatavosana/' },
    { from: '/blog/cik-ilgi-aizmnem-cirkonija-kro%C5%86a-izgatavosana/', to: '/blog/cik-ilgi-aizmnem-cirkonija-krona-izgatavosana/' },
    { from: '/blog/cirkonija-kroni-cena-lētāks-ne-vienmēr-labāks/', to: '/blog/cirkonija-kroni-cena-letaks-ne-vienmer-labaks/' },
    { from: '/blog/cirkonija-kroni-cena-l%C4%93t%C4%81ks-ne-vienm%C4%93r-lab%C4%81ks/', to: '/blog/cirkonija-kroni-cena-letaks-ne-vienmer-labaks/' },
    { from: '/blog/kas-notiek-sakņu-kanala-arstesanas-laika-solis-pa-solim/', to: '/blog/kas-notiek-saknu-kanala-arstesanas-laika-solis-pa-solim/' },
    { from: '/blog/kas-notiek-sak%C5%86u-kanala-arstesanas-laika-solis-pa-solim/', to: '/blog/kas-notiek-saknu-kanala-arstesanas-laika-solis-pa-solim/' },
  ],
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

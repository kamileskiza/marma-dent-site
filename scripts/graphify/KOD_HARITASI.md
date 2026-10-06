# Kod haritasi — marma-dent-site

> Otomatik uretilir (`scripts/graphify/guncelle.sh`). Elle duzenleme; yeniden uretilince silinir.
> Once burayi ve `graphify query` kullan; kaynak kodu ancak implementasyon gerekince ve SADECE ilgili satir araligini oku.
## Icindekiler (TAMAMINI OKUMA: yalniz gereken bolumu `sed -n A,Bp` ile oku)
- Ozet: satir 24-29
- Sorgu rehberi (token ucuzdan pahaliya): satir 30-38
- Klasor yapisi (kod dosyasi sayisi): satir 39-41
- Teknoloji haritasi: satir 42-47
- Giris noktalari: satir 48-49
- Is alanlari (domain → en onemli dosyalar): satir 50-54
- API (1): satir 55-59
- Veritabani tablolari (0): satir 60-63
- Dis entegrasyonlar: satir 64-66
- Arka plan isleri / zamanlayicilar: satir 67-68
- Ortam degiskenleri (4; yalniz ADLAR, deger yok): satir 69-71
- Sayfalar (9): satir 72-74
- Testler (0 test dosyasi): satir 75-79
- Dongusel bagimliliklar (0): satir 80-81
- POTANSIYEL LEGACY (2; emin degil — import edilmeyen, giris/test/script olmayan dosyalar): satir 82-84
- Merkez semboller (en cok kullanilan; degistirirken blast radius YUKSEK): satir 85-106


## Ozet
- Kod dosyasi: 45 · grafta: 45 (%100)
- Dugum: 460 · kenar: 749 · sembol: 143
- Katman: domain 22, entegrasyon 1, env 4, page 9, route 1
- Graf commit: `654a90e6c7cea2c0af9138edb0c9d636c84d15ea`

## Sorgu rehberi (token ucuzdan pahaliya)
1. Bu dosya (KOD_HARITASI.md) → hangi alan/dosya/route/tablo
2. `graphify explain "<sembol | route etiketi (POST /webhook) | id (table_leads, ext_anthropic, env_database_url, domain_hasta)>"` → komsular, dosya:satir
3. `graphify affected "<sembol>" --depth 2` → blast radius (kim etkilenir)
4. `graphify path "A" "B"` → iki nokta arasi yol (orn. route → table)
5. `graphify query "<soru>" --budget 1500` → ilgili alt graf
6. Sonra yalniz gosterilen satir araligini oku. Graf ile kaynak celisirse KAYNAK KOD ESASTIR.
- Katman dugum id'leri (normalize): `route_get_yol`, `table_ad`, `env_ad`, `ext_anthropic`, `job_ad`, `domain_hasta`, `page_yol`. Etiketle sorgu daha kolay: `POST /webhook`, `leads`, `anthropic`.

## Klasor yapisi (kod dosyasi sayisi)
`src/content` 29, `src/i18n` 11, `.astro` 2, `astro.config.mjs` 1, `netlify/functions` 1, `scripts` 1

## Teknoloji haritasi
- Diller: .ts 42, .mjs 3
- Calisma ortami: Node >=22.12.0
- Dagitim: Netlify (`netlify.toml`)
- Dis servisler: meta

## Giris noktalari

## Is alanlari (domain → en onemli dosyalar)
- **Reklam / Pazarlama** (4 dosya, 1 route, 0 tablo): `netlify/functions/meta-capi.mjs`, `src/i18n/seo-fallback.ts`, `src/i18n/home-seo.ts`, `src/i18n/seo-overrides.ts`
- **Tedavi plani** (3 dosya, 0 route, 0 tablo): `src/i18n/content.ts`, `src/i18n/slugs.ts`, `src/i18n/treatment-images.ts`
- **Ops / Yedek / Izleme** (1 dosya, 0 route, 0 tablo): `scripts/site-audit.mjs`

## API (1)
| Yontem | Yol | Handler | Auth | Istemci |
|---|---|---|---|---|
| ANY | `/.netlify/functions/meta-capi` | `netlify/functions/meta-capi.mjs:1` | — | — |

## Veritabani tablolari (0)
| Tablo | Tanim | FK → | Okuyan | Yazan |
|---|---|---|---|---|

## Dis entegrasyonlar
- **meta** (Meta Graph API (Facebook/Instagram/Lead Ads/CAPI)): 2 cagri noktasi; dosyalar: `netlify/functions/meta-capi.mjs`; env: META_CAPI_TOKEN, META_GRAPH_VERSION, META_PIXEL_ID, META_TEST_EVENT_CODE

## Arka plan isleri / zamanlayicilar

## Ortam degiskenleri (4; yalniz ADLAR, deger yok)
`META_CAPI_TOKEN`🔒, `META_GRAPH_VERSION`, `META_PIXEL_ID`, `META_TEST_EVENT_CODE`

## Sayfalar (9)
`/`, `/404`, `/[locale]`, `/[locale]/[slug]`, `/[locale]/blog`, `/[locale]/blog/[slug]`, `/[slug]`, `/blog`, `/blog/[slug]`

## Testler (0 test dosyasi)
- Bir sembolun testleri: `graphify explain "<sembol>"` icinde `tests` kenarlari; ya da asagidaki dosya eslesmesi.
- En cok test edilen dosyalar: 
- Hic test dosyasi tarafindan kullanilmayan uretim dosyasi: 42

## Dongusel bagimliliklar (0)

## POTANSIYEL LEGACY (2; emin degil — import edilmeyen, giris/test/script olmayan dosyalar)
`.astro/content.d.ts`, `.astro/types.d.ts`

## Merkez semboller (en cok kullanilan; degistirirken blast radius YUKSEK)
- `Graf` — scripts/graphify/katman.py:155 (17)
- `localePath` — src/i18n/locales.ts:48 (11)
- `_oku` — scripts/graphify/katman.py:139 (10)
- `localesForTreatment` — src/i18n/content.ts:125 (10)
- `treatmentSlug` — src/i18n/slugs.ts:507 (9)
- `_kisa` — scripts/graphify/katman.py:151 (6)
- `getHome` — src/i18n/content.ts:129 (6)
- `getBlogPosts` — src/i18n/blog.ts:75 (5)
- `_yol_kalibi` — scripts/graphify/katman.py:278 (4)
- `py_araliklar` — scripts/graphify/katman.py:266 (4)
- `TreatmentId` — src/i18n/slugs.ts:22 (3)
- `getTreatments` — src/i18n/content.ts:133 (3)
- `_rel` — scripts/graphify/katman.py:120 (2)
- `norm_id` — scripts/graphify/katman.py:107 (2)
- `_satir` — scripts/graphify/katman.py:146 (2)
- `kod_dosyalari` — scripts/graphify/katman.py:124 (2)
- `_ts_auth` — scripts/graphify/katman.py:381 (2)
- `hasConsent` — src/components/MetaPixel.astro:28 (2)
- `truncateAtWord` — src/i18n/seo-fallback.ts:70 (2)
- `buildTitleWithBrand` — src/i18n/seo-fallback.ts:79 (2)


## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Kod haritasi (Graphify) — kod okumadan ONCE
1. `scripts/graphify/KOD_HARITASI.md` (TAMAMINI OKUMA: Icindekiler satir araligiyla yalniz gereken bolum). Ustteki commit HEAD'den eskiyse once `bash scripts/graphify/guncelle.sh`.
2. `graphify explain "<sembol | POST /yol | table_x | ext_x>"`, `graphify affected "<sembol>" --depth 2`, `graphify query "<soru>" --budget 1500`.
3. Sonra yalniz gosterilen satir araligini oku. Graf ile kaynak celisirse KAYNAK esastir.
Akis: niyet → sorumlu modul → hedef sembol → 1-hop bagimlilik → blast radius → minimum kaynak → minimal yama → ilgili test → DUR.
Guvenlik (Security OS 06.10.2026): Graphify yalniz `--code-only`, surum 0.9.77 sabit, API anahtarsiz; `graphify install`/`hook install` yok; .env ve veri grafa girmez.

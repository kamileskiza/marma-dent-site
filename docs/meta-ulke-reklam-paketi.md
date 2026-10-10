# Meta Ülke Reklam Paketi — Nizam Abdullayev Dental Clinic

Hazırlanma: 10.10.2026 · Dal: `claude/ulke-sayfalari` · Reklamlar API ile **oluşturulmadı**; bu belge Reklam Yöneticisi'nde elle kurulum içindir.

Her reklam, ilgili ülke sayfasına UTM'li link verir. Sayfalar canlıya alınmadan (main'e merge + Netlify yayını) reklam açılmamalı.

---

## 1. Ülke sayfaları (hedef linkler)

| Ülke | Dil | Sayfa |
|---|---|---|
| Almanya | de-DE | https://dtnizamabdullayev.com/de/zahnimplantate-tuerkei-istanbul/ |
| Avusturya | de-AT | https://dtnizamabdullayev.com/de/zahnimplantate-tuerkei-oesterreich/ |
| İsviçre | de-CH | https://dtnizamabdullayev.com/de/zahnimplantate-tuerkei-schweiz/ |
| Hollanda | nl-NL | https://dtnizamabdullayev.com/nl/tandimplantaten-turkije-istanbul/ |
| Belçika (Flaman) | nl-BE | https://dtnizamabdullayev.com/nl/tandimplantaten-turkije-belgie/ |
| Belçika (Fransızca) | fr-BE | https://dtnizamabdullayev.com/fr/implants-dentaires-turquie-belgique/ |
| Fransa | fr-FR | https://dtnizamabdullayev.com/fr/implants-dentaires-turquie-istanbul/ |
| Norveç | nb-NO | https://dtnizamabdullayev.com/no/tannimplantater-tyrkia-istanbul/ |
| Birleşik Krallık | en-GB | https://dtnizamabdullayev.com/dental-implants-turkey-uk/ |
| İrlanda | en-IE | https://dtnizamabdullayev.com/dental-implants-turkey-ireland/ |
| ABD | en-US | https://dtnizamabdullayev.com/dental-implants-turkey-usa/ |
| Polonya | pl-PL | https://dtnizamabdullayev.com/pl/implanty-zebow-turcja-stambul/ |
| Çekya | cs-CZ | https://dtnizamabdullayev.com/cs/zubni-implantaty-turecko-istanbul/ |
| Bulgaristan | bg-BG | https://dtnizamabdullayev.com/bg/zabni-implanti-turtsiya-istanbul/ |
| Romanya | ro-RO | https://dtnizamabdullayev.com/ro/implanturi-dentare-turcia-istanbul/ |
| Portekiz | pt-PT | https://dtnizamabdullayev.com/pt/implantes-dentarios-turquia-istambul/ |

**UTM şablonu** (her reklamın "Web sitesi URL'si" alanına; Instant Form'da "Web sitesini görüntüle" butonuna):

```
?utm_source=facebook&utm_medium=paid_social&utm_campaign=ulke_{ulke}_{amac}_2026q4&utm_content={ulke}_v{1|2|3}
```

- `{ulke}`: de, at, ch, nl, be-nl, be-fr, fr, no, uk, ie, us, pl, cz, bg, ro, pt
- `{amac}`: `lead` (AB ülkeleri, form reklamı) veya `wa` (ABD, WhatsApp'a tıklama)
- Örnek: `https://dtnizamabdullayev.com/de/zahnimplantate-tuerkei-oesterreich/?utm_source=facebook&utm_medium=paid_social&utm_campaign=ulke_at_lead_2026q4&utm_content=at_v2`
- Sayfadaki form bu UTM'leri, `country`, `landing` ve `landing_page` alanlarıyla Netlify "lead" formuna yazar; GA4 `generate_lead` (page_type=country_landing, country=XX) ve Meta Lead (Pixel + CAPI) olayları ana sayfa formuyla aynı şekilde çalışır.

---

## 2. Kampanya yapısı

| Bölge | Amaç | Reklam türü | Not |
|---|---|---|---|
| AB + İsviçre + Norveç + BK (DE, AT, CH, NL, BE, FR, NO, UK, IE, PL, CZ, BG, RO, PT) | Potansiyel müşteri (Leads) | **Instant Form (lead form)** — "Daha yüksek niyet" form tipi | Form bitiş ekranında "Web sitesini görüntüle" → ülke sayfası (UTM'li) |
| ABD (ileride CA/AU/NZ/Körfez) | Etkileşim → Mesajlar | **WhatsApp'a tıklama (CTWA)** | Alternatif ikinci reklam seti: Trafik → ülke sayfası (UTM'li) |

- **1 kampanya / bölge dili** önerisi: `ULKE_DACH_LEAD`, `ULKE_BENELUX_LEAD`, `ULKE_UKIE_LEAD`, `ULKE_NO_LEAD`, `ULKE_US_WA`, Faz 2'de `ULKE_DOGU_AB_LEAD` (PL/CZ/BG/RO), `ULKE_FR_PT_LEAD`.
- Her ülke = ayrı reklam seti (konum + dil farklı) → her setin içinde 3 varyant (aşağıda).
- Bütçe: reklam seti düzeyinde (ABO) başlayın; 7–10 gün sonra kazanan setleri kampanya bütçesine (CBO / Advantage+ kampanya bütçesi) taşıyın.
- **Lead form soruları** (ülke diliyle): Ad soyad (otomatik), Telefon (otomatik), "Hangi tedaviyle ilgileniyorsunuz?" (İmplant / Zirkonyum kron / Lamina-veneer / Henüz emin değilim), "Size nasıl ulaşalım?" (WhatsApp / Telefon). Sağlık durumu, hastalık, ilaç vb. **soru sormayın** (Meta özel soru politikası).
- Form gizlilik linki: ilgili dilin ana sayfası `#privacy` (örn. `https://dtnizamabdullayev.com/de/#privacy`).

## 3. Hedef kitle (tüm ülkeler)

- **Konum:** "Bu konumda yaşayan kişiler" — yalnız hedef ülke. **Türkiye hariç** (Konum → Hariç tut: Türkiye).
- **Yaş:** 35–65+ (Meta'nın üst sınırı "65+"; 70'e eşdeğer).
- **Dil:** ülkenin dili (BE: Flamanca set = Hollandaca, Valon set = Fransızca; CH: Almanca; NO: Norveççe Bokmål; US/UK/IE: İngilizce). Dil kısıtını ilk 7 gün açık tutun, hacim düşükse kaldırın.
- **İlgi alanı:** Meta sağlıkla ilgili detaylı ilgi alanlarının çoğunu kaldırdı; geniş hedefleme (Advantage+ kitle) + yaş + konum önerilir. Eklenebilecek, sağlık durumu ima etmeyen ilgiler: "Medical tourism / Sağlık turizmi", "Istanbul", "Turkish Airlines", "Travel". **"Diş kaybı", "protez", "diş ağrısı" gibi durum ima eden ilgiler kullanmayın.**
- **Hariç:** son 180 günde form dolduranlar (lead form özel kitlesi), mevcut hastalar listesi (varsa, Kamil onayıyla).
- **Opsiyon (Kamil kararı):** DE/NL/BE/AT'de Türk kökenli kitle için ayrı Türkçe set — dil = Türkçe, konum = ülke. Türkiye kuralları ayrı olduğu için bu pakete dahil edilmedi.
- **Yerleşimler:** yalnız **Instagram** (Akış, Hikâyeler, Reels, Keşfet) + **Facebook** (Akış, Hikâyeler, Reels). Audience Network ve Messenger kapalı.

## 4. Bütçe — toplam 1.200 TL/gün

Hedef: mevcut hastaların geldiği pazarlara yoğunlaşmak; küçük bütçeyi 16 sete bölüp öğrenme aşamasını kilitlememek.

**Faz 1 (ilk 14 gün)**

| Reklam seti | TL/gün |
|---|---|
| Almanya (DE) | 280 |
| Avusturya (AT) | 70 |
| İsviçre (CH) | 70 |
| Hollanda (NL) | 140 |
| Belçika (nl 60 + fr 40) | 100 |
| Birleşik Krallık (UK) | 190 |
| İrlanda (IE) | 50 |
| Norveç (NO) | 120 |
| ABD (WhatsApp, CTWA) | 180 |
| **Toplam** | **1.200** |

**Faz 2 (15. günden itibaren):** Lead başı maliyeti en kötü 2 seti kısın; açılan bütçeyle sırayla 7'şer günlük testler: Fransa 100, Polonya 60, Çekya 60, Bulgaristan 60, Romanya 60, Portekiz 60 TL/gün. Kural: 7 günde 0 lead ve CTR < %0,8 → durdur; lead başı maliyet ortalamanın %50 altındaysa bütçeyi %20 artır (günde en fazla bir kez).

Not: Çok küçük setler (50–70 TL) yavaş öğrenir; AT ve CH 10 günde 10'dan az lead getirirse DE kampanyasına "DACH" altında birleştirip tek set (DE+AT+CH) yapın, reklam linkini ülkeye göre ayıramayacağınız için o durumda DE sayfasını kullanın.

---

## 5. Reklam metinleri (her ülke için 3 varyant)

Kurallar: birincil metin ≤125 karakter · fiyat yok · "paket/otel dahil" yok · önce/sonra yok · "Dişleriniz mi eksik?" gibi kişisel sağlık durumu ima eden "siz" cümlesi yok · garanti edilen sonuç yok · "en iyi/en ucuz" yok.

Görsel brifi (tüm ülkeler, varyant numarasına göre):
- **V1 — Doktor:** Dt. Nizam Abdullayev'in klinikte gerçek portresi (repo: `public/images/doctor.jpg` veya yeni çekim). 4:5 akış + 9:16 hikâye/reels. Yazı bindirmesi en fazla 1 kısa satır (örn. "Dt. Nizam Abdullayev · 12 Jahre"). Gülümseyen "sonuç" yakın planı yok.
- **V2 — Dijital süreç:** 15–20 sn dikey video: ağız içi tarayıcı (iTero, `public/images/itero-scanner.jpg`), ekranda panoramik röntgen üzerinde planlama, vida ile sabitlenen kron modeli. Ülke dilinde altyazı. Hasta yüzü/ağzı yakın plan yok; ses olmadan anlaşılır olmalı.
- **V3 — Güven / plan:** 4 kartlı karusel: (1) doktor, (2) tarayıcı, (3) Sağlık Bakanlığı sağlık turizmi yetki belgesi (`cert-ministry.jpg`), (4) klinik tedavi odası (`clinic-room.jpg`). Kart başlıkları: "Doktor", "Dijital plan", "Yetki belgesi", "Klinik". Fiyat/otel/transfer görseli yok.

### Almanya (DE) — Lead form · link: `/de/zahnimplantate-tuerkei-istanbul/` · `utm_campaign=ulke_de_lead_2026q4`

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Dt. Nizam Abdullayev behandelt in seiner Klinik in Istanbul selbst – 12 Jahre Erfahrung, digital geplant. | Zahnarztgeführte Klinik in Istanbul | Kostenlose Online-Beratung | Mehr dazu |
| 2 | Intraoralscan, Planung am Röntgenbild, verschraubte Implantatkronen: So läuft die Behandlung bei uns ab. | Erst digital geplant, dann behandelt | Ab Deutschland ca. 3 Std. Flug | Mehr dazu |
| 3 | Vor der Reise erhalten Sie einen schriftlichen Plan. Dazu 10 Jahre Klinikgarantie und Implantate von BEGO. | Online-Beratung mit dem Zahnarzt | Kostenlos und unverbindlich | Registrieren |

### Avusturya (AT) — Lead form · link: `/de/zahnimplantate-tuerkei-oesterreich/` · `utm_campaign=ulke_at_lead_2026q4`

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Dt. Nizam Abdullayev behandelt in seiner Ordination in Istanbul selbst – 12 Jahre Erfahrung, digital geplant. | Zahnarztgeführte Klinik in Istanbul | Kostenlose Online-Beratung | Mehr dazu |
| 2 | Intraoralscan, Planung am Röntgenbild, verschraubte Implantatkronen: So läuft die Behandlung bei uns ab. | Erst digital geplant, dann behandelt | Ab Wien ca. 2¼ Flugstunden | Mehr dazu |
| 3 | Vor der Reise erhalten Sie einen schriftlichen Plan. Dazu 10 Jahre Klinikgarantie und Implantate von BEGO. | Online-Beratung mit dem Zahnarzt | Kostenlos und unverbindlich | Registrieren |

### İsviçre (CH) — Lead form · link: `/de/zahnimplantate-tuerkei-schweiz/` · `utm_campaign=ulke_ch_lead_2026q4` (İsviçre yazımı: "ß" yok)

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Dt. Nizam Abdullayev behandelt in seiner Klinik in Istanbul selbst – 12 Jahre Erfahrung, digital geplant. | Zahnarztgeführte Klinik in Istanbul | Kostenlose Online-Beratung | Mehr dazu |
| 2 | Intraoralscan, Planung am Röntgenbild, verschraubte Implantatkronen: So läuft die Behandlung bei uns ab. | Erst digital geplant, dann behandelt | Ab Zürich rund 3 Flugstunden | Mehr dazu |
| 3 | Vor der Reise erhalten Sie einen schriftlichen Plan. Dazu 10 Jahre Klinikgarantie und Implantate von BEGO. | Online-Beratung mit dem Zahnarzt | Kostenlos und unverbindlich | Registrieren |

### Hollanda (NL) — Lead form · link: `/nl/tandimplantaten-turkije-istanbul/` · `utm_campaign=ulke_nl_lead_2026q4`

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Dt. Nizam Abdullayev behandelt zelf in zijn kliniek in Istanbul – 12 jaar ervaring en digitale planning. | Kliniek geleid door de tandarts | Gratis online consult | Meer informatie |
| 2 | Intra-orale scan, planning op de röntgenfoto en verschroefde implantaatkronen: zo werken wij in Istanbul. | Eerst digitaal gepland | Vanuit NL ca. 3,5 uur vliegen | Meer informatie |
| 3 | Vóór de reis een schriftelijk plan, 10 jaar kliniekgarantie en implantaten van BEGO. Online consult met de tandarts. | Online consult met de tandarts | Gratis en vrijblijvend | Aanmelden |

### Belçika — Flaman (BE-nl) — Lead form · link: `/nl/tandimplantaten-turkije-belgie/` · `utm_campaign=ulke_be-nl_lead_2026q4`

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Dt. Nizam Abdullayev behandelt zelf in zijn kliniek in Istanbul – 12 jaar ervaring en digitale planning. | Kliniek geleid door de tandarts | Gratis online consult | Meer informatie |
| 2 | Intra-orale scan, planning op de röntgenfoto en verschroefde implantaatkronen: zo werken wij in Istanbul. | Eerst digitaal gepland | Vanuit Brussel ca. 3,5 uur | Meer informatie |
| 3 | Vóór de reis een schriftelijk plan, 10 jaar kliniekgarantie en implantaten van BEGO. Online consult met de tandarts. | Online consult met de tandarts | Gratis en vrijblijvend | Aanmelden |

### Belçika — Fransızca (BE-fr) — Lead form · link: `/fr/implants-dentaires-turquie-belgique/` · `utm_campaign=ulke_be-fr_lead_2026q4`

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Le Dt Nizam Abdullayev soigne lui-même ses patients dans sa clinique d’Istanbul : 12 ans d’expérience. | Clinique dirigée par le dentiste | Consultation en ligne gratuite | En savoir plus |
| 2 | Empreinte optique, planification sur radiographie, couronnes transvissées : voici comment nous travaillons. | Planifié avant d’être réalisé | Depuis Bruxelles, env. 3 h 30 | En savoir plus |
| 3 | Avant le voyage, un plan écrit. Garantie clinique de 10 ans et implants BEGO. Consultation en ligne gratuite. | Consultation avec le dentiste | Sans engagement | S’inscrire |

### Fransa (FR) — Lead form (Faz 2) · link: `/fr/implants-dentaires-turquie-istanbul/` · `utm_campaign=ulke_fr_lead_2026q4`

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Le Dt Nizam Abdullayev soigne lui-même ses patients dans sa clinique d’Istanbul : 12 ans d’expérience. | Clinique dirigée par le dentiste | Consultation en ligne gratuite | En savoir plus |
| 2 | Empreinte optique, planification sur radiographie, couronnes transvissées : voici comment nous travaillons. | Planifié avant d’être réalisé | Depuis Paris, env. 3 h 30 | En savoir plus |
| 3 | Avant le voyage, un plan écrit. Garantie clinique de 10 ans et implants BEGO. Consultation en ligne gratuite. | Consultation avec le dentiste | Sans engagement | S’inscrire |

### Norveç (NO) — Lead form · link: `/no/tannimplantater-tyrkia-istanbul/` · `utm_campaign=ulke_no_lead_2026q4`

Not: Klinik Norveççe konuşmuyor (sayfa ve SSS bunu açıkça söylüyor); form takibi İngilizce/Almanca yapılmalı.

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Dt. Nizam Abdullayev behandler selv på klinikken sin i Istanbul – 12 års erfaring og digital planlegging. | Klinikk drevet av tannlegen | Gratis nettkonsultasjon | Les mer |
| 2 | Intraoral skanning, planlegging på røntgenbildet og skrudde implantatkroner: slik jobber vi i Istanbul. | Planlagt digitalt først | Fra Oslo ca. 4 timer | Les mer |
| 3 | Skriftlig plan før reisen, 10 års klinikkgaranti og implantater fra BEGO. Nettkonsultasjon med tannlegen. | Nettkonsultasjon med tannlegen | Gratis og uforpliktende | Registrer deg |

### Birleşik Krallık (UK) — Lead form · link: `/dental-implants-turkey-uk/` · `utm_campaign=ulke_uk_lead_2026q4`

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Dt. Nizam Abdullayev treats patients himself at his Istanbul clinic – 12 years’ experience, digital planning. | A clinic run by the dentist | Free online consultation | Learn more |
| 2 | Intraoral scan, planning on the X-ray, screw-retained implant crowns: this is how treatment works at our clinic. | Planned digitally first | About 4 hours from London | Learn more |
| 3 | A written plan before travel, a 10-year clinic warranty and BEGO implants. Free online consultation with the dentist. | Talk to the dentist online | Free, no obligation | Sign up |

### İrlanda (IE) — Lead form · link: `/dental-implants-turkey-ireland/` · `utm_campaign=ulke_ie_lead_2026q4`

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Dt. Nizam Abdullayev treats patients himself at his Istanbul clinic – 12 years’ experience, digital planning. | A clinic run by the dentist | Free online consultation | Learn more |
| 2 | Intraoral scan, planning on the X-ray, screw-retained implant crowns: this is how treatment works at our clinic. | Planned digitally first | About 4 hours from Dublin | Learn more |
| 3 | A written plan before travel, a 10-year clinic warranty and BEGO implants. Free online consultation with the dentist. | Talk to the dentist online | Free, no obligation | Sign up |

### ABD (US) — WhatsApp'a tıklama · link (trafik seti): `/dental-implants-turkey-usa/` · `utm_campaign=ulke_us_wa_2026q4`

WhatsApp karşılama mesajı (Meta'da "Mesaj şablonu"): "Hello! Thanks for reaching out to Nizam Abdullayev Dental Clinic. Our coordinator will reply shortly – feel free to share which treatment you're interested in." (Sağlık sorusu sormayın.)

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Dt. Nizam Abdullayev personally treats patients at his Istanbul clinic – 12 years of experience, digital planning. | A clinic run by the dentist | Free online consultation | Send WhatsApp message |
| 2 | Two visits, one digital plan: implant treatment in Istanbul is planned from scans before anyone books a flight. | Planned before you fly | Direct flights from US hubs | Send WhatsApp message |
| 3 | Written plan before travel, 10-year clinic warranty, BEGO implants. Chat with our coordinator on WhatsApp. | Talk to our coordinator | Free, no obligation | Send WhatsApp message |

### Polonya (PL) — Lead form (Faz 2) · link: `/pl/implanty-zebow-turcja-stambul/` · `utm_campaign=ulke_pl_lead_2026q4`

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Dt. Nizam Abdullayev osobiście leczy pacjentów w swojej klinice w Stambule – 12 lat doświadczenia. | Klinika prowadzona przez lekarza | Bezpłatna konsultacja online | Dowiedz się więcej |
| 2 | Skan wewnątrzustny, planowanie na zdjęciu RTG i przykręcane korony na implantach – tak pracujemy. | Najpierw cyfrowy plan | Z Warszawy ok. 2,5 h lotu | Dowiedz się więcej |
| 3 | Pisemny plan przed podróżą, 10 lat gwarancji kliniki i implanty BEGO. Konsultacja online z lekarzem. | Konsultacja online z lekarzem | Bezpłatnie, bez zobowiązań | Zarejestruj się |

### Çekya (CZ) — Lead form (Faz 2) · link: `/cs/zubni-implantaty-turecko-istanbul/` · `utm_campaign=ulke_cz_lead_2026q4`

Not: Klinik Çekçe konuşmuyor (İngilizce/Almanca/Lehçe); sayfada belirtildi.

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Dt. Nizam Abdullayev osobně ošetřuje pacienty ve své klinice v Istanbulu – 12 let praxe. | Klinika vedená zubním lékařem | Bezplatná online konzultace | Další informace |
| 2 | Intraorální sken, plánování na rentgenu a šroubované korunky na implantátech – takto pracujeme. | Nejdřív digitální plán | Z Prahy cca 2,5 h letu | Další informace |
| 3 | Písemný plán před cestou, záruka kliniky 10 let a implantáty BEGO. Online konzultace se zubním lékařem. | Konzultace se zubním lékařem | Zdarma a nezávazně | Zaregistrovat se |

### Bulgaristan (BG) — Lead form (Faz 2) · link: `/bg/zabni-implanti-turtsiya-istanbul/` · `utm_campaign=ulke_bg_lead_2026q4`

Not: Bulgaristan'da fiyatlar zaten düşük; mesaj fiyat değil doktor/plan/garanti üzerine.

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Dt. Nizam Abdullayev лекува лично пациентите в клиниката си в Истанбул – 12 години опит. | Клиника, ръководена от лекар | Безплатна онлайн консултация | Научете повече |
| 2 | Интраорално сканиране, планиране по рентгенография и завинтени корони върху импланти – така работим. | Първо дигитален план | От София ок. 1 ч полет | Научете повече |
| 3 | Писмен план преди пътуването, 10 години гаранция и импланти BEGO. Онлайн консултация с лекаря. | Онлайн консултация с лекаря | Безплатно и без ангажимент | Регистрация |

### Romanya (RO) — Lead form (Faz 2) · link: `/ro/implanturi-dentare-turcia-istanbul/` · `utm_campaign=ulke_ro_lead_2026q4`

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | Dt. Nizam Abdullayev își tratează personal pacienții în clinica sa din Istanbul – 12 ani de experiență. | Clinică condusă de medic | Consultație online gratuită | Aflați mai multe |
| 2 | Scanare intraorală, planificare pe radiografie și coroane înșurubate pe implant – așa lucrăm în Istanbul. | Mai întâi planul digital | Din București, ~1 h 30 zbor | Aflați mai multe |
| 3 | Plan scris înainte de călătorie, garanție a clinicii de 10 ani și implanturi BEGO. Consultație online gratuită. | Consultație online cu medicul | Gratuit, fără obligații | Înscrieți-vă |

### Portekiz (PT) — Lead form (Faz 2) · link: `/pt/implantes-dentarios-turquia-istambul/` · `utm_campaign=ulke_pt_lead_2026q4`

Not: Klinik Portekizce konuşmuyor (İngilizce/İspanyolca); sayfada belirtildi.

| # | Birincil metin | Başlık | Açıklama | CTA |
|---|---|---|---|---|
| 1 | O Dt. Nizam Abdullayev trata pessoalmente os pacientes na sua clínica em Istambul – 12 anos de experiência. | Clínica dirigida pelo médico | Consulta online gratuita | Saiba mais |
| 2 | Digitalização intraoral, planeamento na radiografia e coroas aparafusadas sobre implantes: assim trabalhamos. | Primeiro, o plano digital | De Lisboa, cerca de 4 h 30 | Saiba mais |
| 3 | Plano escrito antes da viagem, garantia da clínica de 10 anos e implantes BEGO. Consulta online gratuita. | Consulta online com o médico | Gratuito e sem compromisso | Registar |

---

## 6. Uyum kontrol listesi (her reklam yayına girmeden önce)

**Meta (reddedilme nedenleri)**
- [ ] Metinde, görselde, videoda **fiyat yok** ("ab 1.500 €", "%70 tasarruf", "uygun fiyat" dahil).
- [ ] **"Her şey dahil paket", "otel dahil", "uçak dahil", "ücretsiz transfer"** teklifi yok (sayfada hizmet olarak anlatılıyor; reklamda yok).
- [ ] **Önce/sonra** görseli, yan yana karşılaştırma, "sonuç" odaklı gülüş yakın planı yok.
- [ ] Kişisel özelliğe/sağlık durumuna hitap eden "siz" cümlesi yok ("Dişleriniz mi eksik?", "Protezden bıktınız mı?", "Gülümsemekten utanıyor musunuz?").
- [ ] Garanti edilen sonuç yok ("mükemmel gülüş", "ağrısız", "%100 başarı"). "10 yıl klinik garantisi" bir hizmet garantisidir; sonuç vaadi gibi yazılmamalı.
- [ ] Üstünlük iddiası yok ("en iyi", "en ucuz", "1 numara", "Türkiye'nin lider kliniği").
- [ ] Lead formunda sağlık durumu sorusu yok; gizlilik politikası linki dolu.
- [ ] Hedeflemede sağlık durumu ima eden ilgi alanı yok; Türkiye hariç tutuldu.
- [ ] Link ilgili ülke sayfasına ve doğru UTM ile gidiyor (sayfa canlı ve 200 dönüyor).

**Ülke hukuku (genel not — hukuki danışmanlık değildir)**
- [ ] **Almanya/Avusturya/İsviçre:** Almanya'da HWG §3 başarı "kesinlikle beklenebilir" izlenimi yasak; HWG §11 Abs.1 S.3 estetik-cerrahi girişimlerde önce/sonra karşılaştırması yasak ([§3](https://www.gesetze-im-internet.de/heilmwerbg/__3.html), [§11](https://www.gesetze-im-internet.de/heilmwerbg/__11.html)). Aynı çizgi AT/CH için de güvenli kabul edilmeli.
- [ ] **Birleşik Krallık/İrlanda:** CAP Code 3.1/3.3/3.7 — yanıltıcı olmama, önemli bilgiyi gizlememe, kanıtlanabilirlik. ASA, Türk diş turizmi aracısını "BK genel merkezi varmış ve tedaviyi kendisi yapıyormuş" izlenimi için durdurdu ([ASA kararı](https://www.asa.org.uk/rulings/dental-centre-turkey-uk-ltd-a22-1157178-dental-centre-turkey-ltd.html)). BK'da ofis/temsilcilik ima etmeyin; Türkiye'deki dişhekiminin GDC kayıtlı olmadığını gizlemeyin (sayfada açıkça yazıyor).
- [ ] **Norveç:** Helsepersonelloven §13 — sağlık hizmeti pazarlaması "forsvarlig, nøktern og saklig" (sorumlu, ölçülü, nesnel) olmalı.
- [ ] **Fransa/Belçika:** yanıltıcı ticari uygulama yasağı; sonuç vaadi ve karşılaştırmalı üstünlük iddiası kullanmayın.
- [ ] **ABD:** FTC — sağlık iddiaları kanıtlanabilir olmalı; hasta yorumu kullanılırsa tipik sonucu yansıtmalı. ABD'de Meta, sağlık/wellness reklamverenlerinin alt-huni dönüşüm optimizasyonunu kısıtlayabiliyor — bu yüzden ABD'de WhatsApp/Mesaj amacı seçildi.
- [ ] **Polonya/Çekya/Bulgaristan/Romanya/Portekiz:** bilgilendirici, ölçülü dil; fiyat ve sonuç vaadi yok.

---

## 7. Araştırma özeti (sayfalardaki bilgilerin dayanağı)

### Ülkede tipik fiyatlar (yalnız karşılaştırma; klinik fiyatı değildir)

| Ülke | Bulgu | Kaynak |
|---|---|---|
| DE | Tek implant 1.500–3.000 €; zirkon kron 800–2.000 € | [zahnzusatzversicherung-experten.de](https://www.zahnzusatzversicherung-experten.de/zahnimplantat-kosten-und-eigenanteil.html), [CHECK24](https://www.check24.de/zahnzusatzversicherung/zahnkrone/) |
| AT | İmplant+kron 2.200–3.200 €; kron 600–1.200 € | [bleaching-mundgesund.de](https://www.bleaching-mundgesund.de/ratgeber/zahnersatz/zahnimplantat-kosten-oesterreich-schweiz) |
| CH | İmplant+kron CHF 3.500–5.500; zincir klinik: implant+kron ab CHF 4.000, kron ab CHF 1.400, veneer ab CHF 1.345 | aynı kaynak, [zahnarztzentrum.ch](https://zahnarztzentrum.ch/preise) |
| NL | İmplant+kron ~€1.500–2.200 (NZa azami tarifeleri) | [Overstappen.nl](https://www.overstappen.nl/zorgverzekering/vergoedingen/tandimplantaten/) |
| BE | İmplant+kron €1.000–3.500 (ort. ~€1.800); All-on-4 ~€15.000 | [HelloSafe.be](https://hellosafe.be/mutuelle/remboursement/implant-dentaire) |
| FR | Komple implant 1.400–3.100 €; kron 600–1.500 €; SGK implantı ödemez | [Réassurez-moi](https://reassurez-moi.fr/guide/mutuelle-sante/remboursement/implant-dentaire) |
| NO | İmplant+kron 14.000–37.000 kr; seramik kron çoğunlukla 5.000–6.000 kr | [Tannsmart](https://www.tannsmart.no/pris/nye-tenner), [Tannsmart kron](https://www.tannsmart.no/pris/tannkrone) |
| UK | Tek implant+kron £2.400'den; zirkon/E-max kron £850'den; NHS Band 3 £326,70 | [Bupa](https://www.bupa.co.uk/dental/dental-care/treatments/dental-implants/cost), [Whites Dental](https://www.whitesdental.co.uk/dental-crowns-london/), [Healthwatch](https://www.healthwatchbrightonandhove.co.uk/advice-and-information/2025-07-07/understanding-nhs-dental-charges) |
| IE | İmplant+kron €3.000–3.500; All-on-4 çene başı €12.000–18.000 | [Docklands Dental](https://www.docklandsdental.ie/dental-implants-cost-ireland/) |
| US | Tek implant $3.000–5.600; All-on-4 çene başı $11.600–27.500 | [NewMouth](https://www.newmouth.com/dentistry/restorative/implants/cost/) |
| PL | İmplant+kron 4.000–10.000 zł; All-on-4 çene başı 25.000–45.000 zł | [Miadent](https://miadent.pl/blog/ile-kosztuje-implant-zeba-w-polsce-cennik-2026/) |
| CZ | İmplant+kron 25.000–40.000 Kč; implant üstü kron 8.000–18.000 Kč | [nejlepsizubniimplantaty.cz](https://nejlepsizubniimplantaty.cz/blog/cena-zubniho-implantatu/), [Wichrová](https://wichrova-katerina.cz/kolik-stoji-nove-zuby-v-cr-2025-ceny-implantatu-korunek-a-protez) |
| BG | İmplant+kron 1.350–2.800 лв (≈690–1.430 €); All-on-4 7.500–13.500 лв | [BalCare](https://balcare.bg/zybni-implanti-sofiya/) |
| RO | İmplant+abutment+kron 3.500–9.000 lei; zirkon kron 1.500–2.500 lei | [catcostain.ro](https://catcostain.ro/cat-costa-un-implant-dentar.html) |
| PT | Tek diş değişimi 920–3.190 € (ort. ~1.600 €); devlet katkısı yok | [DECO PROteste](https://www.deco.proteste.pt/saude/higiene-oral/noticias/implantes-dentarios-caros-sem-comparticipacao-estado) |

Sonuç: Batı/Kuzey Avrupa ve ABD'de fark belirgin; **BG, RO, PL, PT'de fiyat avantajı zayıf** → bu ülkelerde sayfa ve reklam doktor/plan/garanti odaklı, "en ucuz" iddiası yok.

### Hasta korkuları / itirazları
- BK'da BDA anketi: dişhekimlerinin %94'ü yurtdışında tedavi olmuş hasta görmüş; sorun gören hekimlerin en sık şikâyetleri başarısız tedavi, ağrı, kötü uygulama; aşırı kesilmiş dişler, uymayan kronlar, kaybedilen implantlar; %93 tedavi sürekliliği, %77 hak arama zorluğu, %66 iletişim sorunu endişesi ([Dental Tribune / BDA](https://uk.dental-tribune.com/news/dental-tourism-among-uk-patients-is-on-the-rise-bda-reports/)).
- Sayfalardaki SSS bu itirazlara göre yazıldı: dönüşte takip, garantinin yurtdışından nasıl işlediği, sağlam dişlerin kesilmesi, sigorta/geri ödeme, dil, toplam süre.

### Rakip mesajları (Meta Reklam Kütüphanesi, 10.10.2026, aktif reklamlar)
- BK (~1.800 aktif reklam "dental implants Turkey"): "Up to 70% cheaper", "Best prices, 5-star quality", "Save up to 80% – flight included", BK şehirlerinde "Free dental meetup" (Liverpool, Crawley, Elgin).
- NL/BE: "Bespaar tot 70%", "Tot 60 procent goedkoper dan België", Genk'te ücretsiz yüz yüze konsültasyon.
- DE (~177): "All-on-6 Zahnimplantate in Istanbul", "Premium-Zahnklinik in Istanbul".
- Fark: rakipler fiyat/paket konuşuyor (Meta reddi riski yüksek); bizim konumumuz **doktorun kendisi + dijital plan + yazılı garanti + yazılı plan**. Yüz yüze "meetup" etkinlikleri BK ve Belçika'da güçlü bir rakip taktiği — ileride değerlendirilebilir.

### Ödeme alışkanlıkları (genel bilgi — doğrulanmadı)
DE: banka havalesi/EC kart, kredi kartı daha az; NL: iDEAL; BE: Bancontact; PL: BLIK; NO: Vipps; PT: MB WAY/Multibanco; UK/US/IE: kredi/banka kartı, ABD'de finansman yaygın. Kliniğin kabul ettiği yöntemler sitede bulunamadı → sayfalar yalnız "ödeme yöntemi yazılı planda belirtilir" diyor.

### Uçuş süreleri
Sayfalarda "yaklaşık, direkt uçuş, rezervasyonda kontrol edin" notuyla verildi (genel tarife bilgisi; tek tek doğrulanmadı). Örnek: Münih ≈2 sa 40 dk, Frankfurt ≈3 sa, Viyana ≈2 sa 15 dk, Zürih ≈3 sa, Amsterdam ≈3 sa 30 dk, Brüksel ≈3 sa 20 dk, Oslo ≈3 sa 50 dk, Londra ≈3 sa 50 dk, Dublin ≈4 sa 15 dk, New York ≈10 sa, Varşova ≈2 sa 30 dk, Prag ≈2 sa 30 dk, Sofya ≈1 sa 15 dk, Bükreş ≈1 sa 30 dk, Lizbon ≈4 sa 30 dk. Klinik Maltepe'de: SAW'a ~30 dk.

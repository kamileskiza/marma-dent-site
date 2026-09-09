// Tightened SEO titles & descriptions using the exact keyword phrases from the
// client's own keyword research (Doc1/Doc2), for the two priority markets (EN/TR).
// Falls back to the generic `${treatment title} — clinic name` pattern for
// locales/treatments not listed here.

export const SEO_OVERRIDES: Record<string, Record<string, { title: string; description: string }>> = {
  en: {
    'all-on-4-5-6': {
      title: 'All-on-4 & All-on-6 Dental Implants Istanbul | Fixed Teeth in One Day',
      description: 'All-on-4 and All-on-6 dental implants in Istanbul: a full, fixed arch of teeth in one visit. Genuine implant brands, digital planning, lifetime warranty.',
    },
    'dental-implants': {
      title: 'Dental Implants Istanbul | Single Tooth to Full-Mouth Implants',
      description: 'Dental implants in Istanbul, planned digitally and backed by a lifetime warranty — from a single missing tooth to full-mouth restoration.',
    },
    'hollywood-smile': {
      title: 'Hollywood Smile Istanbul | 3D Digital Smile Makeover',
      description: 'A full Hollywood Smile makeover in Istanbul: 3D digital smile design, veneers or zirconia crowns, planned around your face — not a one-size template.',
    },
    'emax-veneers': {
      title: 'E-max Veneers Istanbul | Minimal-Prep Porcelain Veneers',
      description: 'Genuine E-max porcelain veneers in Istanbul: minimal tooth preparation, natural translucency, and a lifetime warranty on the finished work.',
    },
    'monolithic-zirconia': {
      title: 'Zirconia Crowns Istanbul | Monolithic Zirconia, Chip-Resistant',
      description: 'Monolithic zirconia crowns and bridges in Istanbul, milled from a single block for maximum strength — ideal for molars and for patients who grind their teeth.',
    },
    'digital-smile-design': {
      title: 'Digital Smile Design Istanbul | Preview Your Smile in 3D',
      description: 'See your new smile in 3D before treatment starts. Digital Smile Design in Istanbul combines AI-assisted planning with a same-visit mock-up.',
    },
    'teeth-whitening': {
      title: 'Professional Teeth Whitening Istanbul | Same-Day Results',
      description: 'Professional, in-office teeth whitening in Istanbul — safely lift the shade of your natural teeth in a single session.',
    },
    'all-on-4-5-6': {
      title: 'All-on-4 & All-on-6 Dental Implants Istanbul | Fixed Teeth in a Day',
      description: 'Full-arch dental implants in Istanbul on 4, 5 or 6 implants. Fixed, non-removable teeth, genuine implant brands, digital planning, lifetime warranty.',
    },
    'zygomatic-implants': {
      title: 'Zygomatic Implants Istanbul | Implants for Severe Bone Loss',
      description: 'Zygomatic implants in Istanbul for patients with severe upper jaw bone loss — a fixed solution without a bone graft, anchored in the cheekbone.',
    },
    'dental-bridge': {
      title: 'Dental Bridge Istanbul | Fixed Tooth Replacement, No Implant',
      description: 'Dental bridges in Istanbul: a fixed, non-surgical way to replace one or more missing teeth, anchored to the adjacent teeth.',
    },
    'invisalign': {
      title: 'Invisalign Istanbul | Clear Aligners, Nearly Invisible',
      description: 'Straighten your teeth with Invisalign clear aligners in Istanbul — a nearly invisible, removable alternative to metal braces, planned digitally.',
    },
    'screw-retained-occlusal': {
      title: 'Screw-Retained Implant Crowns Istanbul | Easy Maintenance',
      description: 'Screw-retained implant restorations in Istanbul — fixed with an occlusal screw instead of cement, so they can be serviced without damage.',
    },
    'gingivectomy': {
      title: 'Gingivectomy Istanbul | Gum Reshaping for a Healthier Smile',
      description: 'Gingivectomy in Istanbul: reshaping the gum line to correct a gummy smile or uneven gums, improving both health and appearance.',
    },
    'sinus-lift': {
      title: 'Sinus Lift Istanbul | Bone Height for Upper Jaw Implants',
      description: 'Sinus lift surgery in Istanbul adds bone height in the upper jaw so back-tooth implants have a stable, long-lasting foundation.',
    },
    'root-canal-therapy': {
      title: 'Root Canal Treatment Istanbul | Save Your Natural Tooth',
      description: 'Root canal therapy in Istanbul removes infection from inside the tooth and seals it, saving your natural tooth wherever possible.',
    },
  },
  tr: {
    'all-on-4-5-6': {
      title: 'All-on-4 All-on-5 All-on-6 İmplant İstanbul | Tam Çene Sabit Diş',
      description: 'İstanbul\'da All-on-4, All-on-5 ve All-on-6 implant tedavisi: tam çene sabit diş, dijital planlama, ömür boyu garanti. Ücretsiz tedavi planı için iletişime geçin.',
    },
    'dental-implants': {
      title: 'Diş İmplantı İstanbul | Tek Dişten Tam Çeneye İmplant Tedavisi',
      description: 'İstanbul\'da diş implantı tedavisi: tek diş kaybından tam çene rehabilitasyonuna, dijital planlama ve ömür boyu garantiyle.',
    },
    'hollywood-smile': {
      title: 'Hollywood Smile İstanbul | Dijital Gülüş Tasarımı ile Estetik Diş',
      description: 'İstanbul\'da Hollywood Smile: 3D dijital gülüş tasarımı, laminat veya zirkonyum kaplama ile yüzünüze özel planlanan estetik diş dönüşümü.',
    },
    'emax-veneers': {
      title: 'E-max Lamina Diş İstanbul | Diş Kesmeden Estetik Laminat',
      description: 'İstanbul\'da orijinal E-max lamina diş: minimal diş kesimi, doğal görünüm ve ömür boyu garanti ile porselen laminat kaplama.',
    },
    'monolithic-zirconia': {
      title: 'Zirkonyum Kaplama İstanbul | Monolitik Zirkonyum Diş',
      description: 'İstanbul\'da zirkonyum diş kaplama: tek blok monolitik zirkonyumdan, kırılmaya dayanıklı, azı dişleri ve diş sıkma vakaları için ideal.',
    },
    'digital-smile-design': {
      title: 'Dijital Gülüş Tasarımı İstanbul | Yeni Gülüşünüzü 3D\'de Görün',
      description: 'İstanbul\'da dijital gülüş tasarımı: tedavi başlamadan önce yeni gülüşünüzü 3D olarak önizleyin, yapay zeka destekli planlama ile.',
    },
    'teeth-whitening': {
      title: 'Diş Beyazlatma İstanbul | Profesyonel Ofis Tipi Beyazlatma',
      description: 'İstanbul\'da profesyonel diş beyazlatma: tek seansta, ofis tipi bleaching ile doğal dişlerinizin rengini güvenle açın.',
    },
    'all-on-4-5-6': {
      title: 'All-on-4 All-on-5 All-on-6 İmplant İstanbul | Tam Çene Sabit Diş',
      description: 'İstanbul\'da All-on-4, All-on-5 ve All-on-6 implant tedavisi: tam çene sabit diş, dijital planlama, ömür boyu garanti. Ücretsiz tedavi planı için iletişime geçin.',
    },
    'zygomatic-implants': {
      title: 'Zigoma İmplant İstanbul | Ciddi Kemik Kaybında İmplant Çözümü',
      description: 'İstanbul\'da zigoma implant: ciddi üst çene kemik kaybı olan hastalar için kemik greftine gerek kalmadan elmacık kemiğine sabitlenen implant çözümü.',
    },
    'dental-bridge': {
      title: 'Diş Köprüsü İstanbul | Cerrahisiz Sabit Diş Çözümü',
      description: 'İstanbul\'da diş köprüsü: bir veya daha fazla eksik dişi, yandaki dişlere sabitleyerek cerrahisiz ve sabit şekilde tamamlayan tedavi.',
    },
    'invisalign': {
      title: 'Şeffaf Diş Teli İstanbul | Invisalign ile Görünmez Ortodonti',
      description: 'İstanbul\'da Invisalign şeffaf diş teli: metal bracket olmadan, neredeyse görünmez ve çıkarılabilir plaklarla dijital planlanan diş düzeltme.',
    },
    'screw-retained-occlusal': {
      title: 'Vidalı İmplant Üstü Kaplama İstanbul | Kolay Bakım',
      description: 'İstanbul\'da vidalı implant bertarama: sement yerine vida ile sabitlenen, zarar vermeden bakımı yapılabilen implant üstü restorasyon.',
    },
    'gingivectomy': {
      title: 'Diş Eti Tedavisi İstanbul | Gingivektomi ile Estetik Diş Eti',
      description: 'İstanbul\'da gingivektomi: diş eti gülüşünü veya eşit olmayan diş etini düzelten, hem sağlık hem estetik sağlayan diş eti şekillendirme.',
    },
    'sinus-lift': {
      title: 'Sinüs Lift İstanbul | Üst Çene İmplant için Kemik Yükseltme',
      description: 'İstanbul\'da sinüs lift ameliyatı: üst çenedeki arka diş implantlarına sabit, uzun ömürlü bir temel sağlamak için kemik yüksekliği ekler.',
    },
    'root-canal-therapy': {
      title: 'Kanal Tedavisi İstanbul | Doğal Dişinizi Kurtarın',
      description: 'İstanbul\'da kanal tedavisi: diş içindeki enfeksiyonu temizleyip mühürleyerek, mümkün olduğunda doğal dişinizi kurtarır.',
    },
  },
};

export function getSeoOverride(locale: string, treatmentId: string): { title: string; description: string } | null {
  return SEO_OVERRIDES[locale]?.[treatmentId] ?? null;
}

// Country landing pages ("patients from <country>") — one entry per page.
// Rendered by src/pages/[...landing].astro → src/components/CountryLanding.astro.
//
// PRICES: the site has no clinic price source, so these pages NEVER state clinic
// prices. `prices` are home-country reference ranges from third-party sources
// (each row points at `sources[src]`). Re-check the sources at least yearly.
// FLIGHTS: approximate direct-flight durations (general schedule knowledge,
// not a booking source) — the page says so.
//
// hreflang: every entry is one language-region version of the same page;
// `htmlLang` is used both as <html lang> and as its hreflang value.

export interface PriceRow { item: string; range: string; src: number; }
export interface Source { label: string; url: string; }
export interface Faq { q: string; a: string; }

export interface CountryLanding {
  id: string;          // stable id, also sent as `country` with the lead (e.g. 'de-AT')
  locale: string;      // site locale folder ('en' = root)
  ui: string;          // key into LANDING_UI
  htmlLang: string;    // <html lang> + hreflang
  country: string;     // ISO 3166-1 alpha-2
  dial: string;        // default phone country code (digits)
  flag: string;
  slug: string;        // path inside the locale, without slashes
  navLabel: string;    // link text in footer / country switcher
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
  priceH2: string;
  priceCol: string;
  priceIntro: string;
  prices: PriceRow[];
  sources: Source[];
  travelH2: string;
  airports: Array<{ from: string; time: string }>;
  travelNote?: string;
  faqH2: string;
  faq: Faq[];
  wa: string;          // prefilled WhatsApp text
}

const S = {
  zzvExperten: { label: 'zahnzusatzversicherung-experten.de – Zahnimplantate: Kosten & Eigenanteil (Stand 12/2024)', url: 'https://www.zahnzusatzversicherung-experten.de/zahnimplantat-kosten-und-eigenanteil.html' },
  check24Krone: { label: 'CHECK24 – Zahnkrone: Kosten und Erstattung', url: 'https://www.check24.de/zahnzusatzversicherung/zahnkrone/' },
  atchRatgeber: { label: 'bleaching-mundgesund.de – Zahnimplantat-Kosten in Österreich und der Schweiz', url: 'https://www.bleaching-mundgesund.de/ratgeber/zahnersatz/zahnimplantat-kosten-oesterreich-schweiz' },
  zazPreise: { label: 'zahnarztzentrum.ch – Preise (Ab-Preise)', url: 'https://zahnarztzentrum.ch/preise' },
  overstappen: { label: 'Overstappen.nl – Vergoeding tandimplantaten (NZa-maximumtarieven)', url: 'https://www.overstappen.nl/zorgverzekering/vergoedingen/tandimplantaten/' },
  hellosafe: { label: 'HelloSafe.be – Implant dentaire : prix et remboursement', url: 'https://hellosafe.be/mutuelle/remboursement/implant-dentaire' },
  reassurez: { label: 'Réassurez-moi – Implant dentaire : quel remboursement ?', url: 'https://reassurez-moi.fr/guide/mutuelle-sante/remboursement/implant-dentaire' },
  tannsmartNye: { label: 'Tannsmart – Hva koster nye tenner? (2026)', url: 'https://www.tannsmart.no/pris/nye-tenner' },
  tannsmartKrone: { label: 'Tannsmart – Hva koster tannkrone? (2026)', url: 'https://www.tannsmart.no/pris/tannkrone' },
  bupa: { label: 'Bupa Dental Care – Dental implant cost', url: 'https://www.bupa.co.uk/dental/dental-care/treatments/dental-implants/cost' },
  whites: { label: 'Whites Dental (London) – Dental crowns', url: 'https://www.whitesdental.co.uk/dental-crowns-london/' },
  nhsBands: { label: 'Healthwatch Brighton & Hove – Understanding NHS dental charges (2025)', url: 'https://www.healthwatchbrightonandhove.co.uk/advice-and-information/2025-07-07/understanding-nhs-dental-charges' },
  docklands: { label: 'Docklands Dental (Dublin) – Dental implants cost Ireland', url: 'https://www.docklandsdental.ie/dental-implants-cost-ireland/' },
  newmouth: { label: 'NewMouth – Dental implant cost (medically reviewed, 2026)', url: 'https://www.newmouth.com/dentistry/restorative/implants/cost/' },
  miadent: { label: 'Miadent – Ile kosztuje implant zęba w Polsce (cennik 2026)', url: 'https://miadent.pl/blog/ile-kosztuje-implant-zeba-w-polsce-cennik-2026/' },
  czImpl: { label: 'nejlepsizubniimplantaty.cz – Cena zubního implantátu 2026', url: 'https://nejlepsizubniimplantaty.cz/blog/cena-zubniho-implantatu/' },
  czWichrova: { label: 'MUDr. Kateřina Wichrová – Kolik stojí nové zuby v ČR 2025', url: 'https://wichrova-katerina.cz/kolik-stoji-nove-zuby-v-cr-2025-ceny-implantatu-korunek-a-protez' },
  balcare: { label: 'BalCare – Зъбни импланти София: цени (2026)', url: 'https://balcare.bg/zybni-implanti-sofiya/' },
  catcostain: { label: 'catcostain.ro – Cât costă un implant dentar în România (2026)', url: 'https://catcostain.ro/cat-costa-un-implant-dentar.html' },
  deco: { label: 'DECO PROteste – Implantes dentários: caros e sem comparticipação do Estado (dez. 2025–jan. 2026)', url: 'https://www.deco.proteste.pt/saude/higiene-oral/noticias/implantes-dentarios-caros-sem-comparticipacao-estado' },
};

// Reused German FAQ answers (DE / AT / CH share most patient questions).
const deFaqCommon = (insurer: string, insurerDat: string, home: string): Faq[] => [
  { q: 'Wie lange muss ich insgesamt einplanen?', a: 'Für Implantate planen Sie zwei Aufenthalte ein: zuerst 5–6 Tage, nach der Einheilzeit (meist einige Monate) noch einmal 4–5 Tage. Für Kronen oder Veneers genügt in der Regel ein Aufenthalt von 5–7 Tagen. Den genauen Zeitplan erhalten Sie nach der Online-Beratung schriftlich.' },
  { q: `Beteiligt sich ${insurer} an den Kosten?`, a: `Das hängt von Ihrem Vertrag ab. Bitte klären Sie vor der Behandlung direkt mit ${insurerDat} bzw. Ihrer Zusatzversicherung, ob und in welcher Höhe eine Behandlung in der Türkei erstattet wird. Auf Wunsch erhalten Sie dafür vorab Ihren schriftlichen Behandlungsplan.` },
  { q: `Wer kümmert sich nach der Rückkehr ${home} um mich?`, a: 'Ihre Ansprechperson und Dt. Abdullayev bleiben per WhatsApp erreichbar – oft genügen Fotos für eine erste Einschätzung. Ihre Unterlagen mit Röntgenbildern sowie Marke und Größe der Implantate stehen Ihnen zur Verfügung, sodass auch ein Zahnarzt vor Ort Kontrollen übernehmen kann.' },
  { q: 'Werden für Kronen oder Veneers gesunde Zähne stark abgeschliffen?', a: 'Wie viel Zahnsubstanz abgetragen werden muss, hängt vom Befund und vom Material ab. Dt. Abdullayev plant digital und erklärt Ihnen vorab, welche Lösung zahnschonender ist – auch wenn das bedeutet, weniger Zähne zu versorgen.' },
  { q: 'Wie funktioniert die Garantie, wenn ich nicht in Istanbul wohne?', a: 'Die Garantiebedingungen erhalten Sie schriftlich zusammen mit Ihrem Plan. Garantieleistungen erbringt unsere Klinik in Istanbul; die Einzelheiten besprechen Sie vorab mit Ihrer Ansprechperson.' },
  { q: 'Kann ich auf Deutsch kommunizieren?', a: 'Ja. Wir sprechen unter anderem Deutsch – die Abstimmung mit Ihrer Ansprechperson ist auf Deutsch möglich.' },
];

const nlFaqCommon = (insurer: string, home: string): Faq[] => [
  { q: 'Hoeveel tijd moet ik in totaal rekenen?', a: 'Voor implantaten rekent u op twee verblijven: eerst 5–6 dagen en na de genezingsperiode (meestal enkele maanden) nog eens 4–5 dagen. Voor kronen of facings volstaat doorgaans één verblijf van 5–7 dagen. Het exacte schema ontvangt u na het online consult schriftelijk.' },
  { q: `Vergoedt ${insurer} iets?`, a: `Dat hangt af van uw polis. Vraag vóór de behandeling bij ${insurer} na of en hoeveel er voor een behandeling in Turkije wordt vergoed. Op verzoek ontvangt u daarvoor vooraf uw schriftelijke behandelplan.` },
  { q: `Wie helpt mij na mijn terugkeer ${home}?`, a: 'Uw contactpersoon en Dt. Abdullayev blijven bereikbaar via WhatsApp – vaak zijn foto’s genoeg voor een eerste inschatting. Uw dossier met röntgenfoto’s en het merk en de maat van de implantaten krijgt u mee, zodat ook een tandarts in de buurt controles kan doen.' },
  { q: 'Worden gezonde tanden sterk afgeslepen voor kronen of facings?', a: 'Hoeveel tandweefsel weg moet, hangt af van uw situatie en het materiaal. Dt. Abdullayev plant digitaal en legt vooraf uit welke oplossing het meest tandsparend is – ook als dat betekent dat er minder tanden behandeld worden.' },
  { q: 'Hoe werkt de garantie als ik niet in Istanbul woon?', a: 'De garantievoorwaarden ontvangt u schriftelijk samen met uw plan. Garantiewerkzaamheden worden in onze kliniek in Istanbul uitgevoerd; de details bespreekt u vooraf met uw contactpersoon.' },
  { q: 'Kan ik in het Nederlands communiceren?', a: 'Ja. Wij spreken onder meer Nederlands – het contact met uw contactpersoon kan in het Nederlands.' },
];

const frFaqCommon = (insurer: string, home: string): Faq[] => [
  { q: 'Combien de temps dois-je prévoir au total ?', a: 'Pour des implants, prévoyez deux séjours : d’abord 5 à 6 jours, puis, après la cicatrisation (en général quelques mois), 4 à 5 jours. Pour des couronnes ou des facettes, un séjour de 5 à 7 jours suffit généralement. Le calendrier précis vous est remis par écrit après la consultation en ligne.' },
  { q: `${insurer.charAt(0).toUpperCase()}${insurer.slice(1)} participe-t-elle aux frais ?`, a: `Cela dépend de votre contrat. Renseignez-vous avant le traitement auprès de ${insurer} pour savoir si des soins réalisés en Turquie peuvent être remboursés, et dans quelle mesure. Sur demande, nous vous transmettons à l’avance votre plan de traitement écrit.` },
  { q: `Qui me suit après mon retour ${home} ?`, a: 'Votre interlocuteur et le Dt Abdullayev restent joignables par WhatsApp – des photos suffisent souvent pour un premier avis. Vous recevez votre dossier avec les radiographies ainsi que la marque et la taille des implants, afin qu’un dentiste près de chez vous puisse aussi assurer des contrôles.' },
  { q: 'Faut-il beaucoup meuler des dents saines pour des couronnes ou des facettes ?', a: 'La quantité de tissu dentaire à retirer dépend de votre situation et du matériau. Le Dt Abdullayev planifie numériquement et vous explique à l’avance quelle solution préserve le mieux vos dents – même si cela signifie traiter moins de dents.' },
  { q: 'Comment fonctionne la garantie si je n’habite pas à Istanbul ?', a: 'Les conditions de garantie vous sont remises par écrit avec votre plan. Les prestations de garantie sont réalisées dans notre clinique à Istanbul ; les détails sont convenus à l’avance avec votre interlocuteur.' },
  { q: 'Puis-je communiquer en français ?', a: 'Oui. Nous parlons notamment français – les échanges avec votre interlocuteur peuvent se faire en français.' },
];

const enFaqCommon = (home: string, us = false): Faq[] => [
  { q: 'How much time should I plan for in total?', a: 'For implants, plan two visits: first 5–6 days, then – after the healing period (usually a few months) – another 4–5 days. Crowns or veneers usually need a single visit of 5–7 days. You receive the exact schedule in writing after the online consultation.' },
  { q: `Who looks after me once I am back ${home}?`, a: 'Your coordinator and Dt. Abdullayev stay reachable on WhatsApp – photos are often enough for a first assessment. You take home your records with X-rays and the brand and size of your implants, so a local dentist can also carry out check-ups.' },
  { q: 'Will healthy teeth be heavily filed down for crowns or veneers?', a: `How much tooth structure needs to be removed depends on your situation and the material. Dt. Abdullayev plans digitally and explains beforehand which option is the most conservative – even if that means treating fewer teeth.` },
  { q: 'How does the warranty work if I don’t live in Istanbul?', a: `You receive the warranty terms in writing with your plan. Warranty work is carried out at our clinic in Istanbul; the details are agreed with your coordinator in advance.` },
  { q: 'How do I pay?', a: us ? 'Payment methods and timing are set out in your written plan before you book anything, so there are no surprises when you arrive.' : 'Payment methods and timing are set out in your written plan before you book anything, so there are no surprises on arrival.' },
];

export const COUNTRY_LANDINGS: CountryLanding[] = [
  // ───────────── Germany
  {
    id: 'de-DE', locale: 'de', ui: 'de', htmlLang: 'de-DE', country: 'DE', dial: '49', flag: '🇩🇪',
    slug: 'zahnimplantate-tuerkei-istanbul',
    navLabel: 'Patienten aus Deutschland',
    title: 'Zahnimplantate in der Türkei – für Patienten aus Deutschland',
    description: 'Zahnimplantate in Istanbul, rund 3 Flugstunden von Deutschland: Behandlung durch Dt. Nizam Abdullayev, digitale Planung, 10 Jahre Klinikgarantie. Kostenlose Online-Beratung.',
    eyebrow: 'Für Patientinnen und Patienten aus Deutschland',
    h1: 'Zahnimplantate in Istanbul – aus Deutschland in rund 3 Flugstunden',
    lead: 'Ein Zahnarzt, ein digitaler Plan, eine schriftliche Garantie: In unserer inhabergeführten Klinik behandelt Sie Dt. Nizam Abdullayev persönlich – nach einer kostenlosen Online-Beratung, noch bevor Sie einen Flug buchen.',
    priceH2: 'Was Zahnersatz in Deutschland üblicherweise kostet',
    priceCol: 'Übliche Spanne in Deutschland',
    priceIntro: 'Viele Patientinnen und Patienten vergleichen zunächst die Kosten in Deutschland. Zur Orientierung einige veröffentlichte Richtwerte:',
    prices: [
      { item: 'Einzelimplantat (Gesamtkosten)', range: 'ca. 1.500–3.000 €', src: 0 },
      { item: 'Zirkonkrone', range: 'ca. 800–2.000 €', src: 1 },
    ],
    sources: [S.zzvExperten, S.check24Krone],
    travelH2: 'Anreise aus Deutschland',
    airports: [
      { from: 'München (MUC)', time: '≈ 2 Std. 40 Min.' },
      { from: 'Frankfurt (FRA)', time: '≈ 3 Std.' },
      { from: 'Berlin (BER)', time: '≈ 2 Std. 55 Min.' },
      { from: 'Stuttgart (STR)', time: '≈ 2 Std. 55 Min.' },
      { from: 'Düsseldorf (DUS) / Köln (CGN)', time: '≈ 3 Std. 15 Min.' },
      { from: 'Hamburg (HAM)', time: '≈ 3 Std. 15 Min.' },
    ],
    faqH2: 'Fragen von Patienten aus Deutschland',
    faq: deFaqCommon('Ihre Krankenkasse', 'Ihrer Krankenkasse', 'nach Deutschland'),
    wa: 'Guten Tag, ich komme aus Deutschland und interessiere mich für eine kostenlose Online-Beratung zu Zahnimplantaten.',
  },
  // ───────────── Austria
  {
    id: 'de-AT', locale: 'de', ui: 'de', htmlLang: 'de-AT', country: 'AT', dial: '43', flag: '🇦🇹',
    slug: 'zahnimplantate-tuerkei-oesterreich',
    navLabel: 'Patienten aus Österreich',
    title: 'Zahnimplantate in der Türkei – für Patienten aus Österreich',
    description: 'Zahnimplantate in Istanbul, ab Wien in rund 2¼ Flugstunden: Behandlung durch Dt. Nizam Abdullayev, digitale Planung, 10 Jahre Klinikgarantie. Kostenlose Online-Beratung.',
    eyebrow: 'Für Patientinnen und Patienten aus Österreich',
    h1: 'Zahnimplantate in Istanbul – ab Wien in rund 2¼ Flugstunden',
    lead: 'Persönlich und sorgfältig: In unserer kleinen, ärztlich geführten Ordination behandelt Sie Dt. Nizam Abdullayev selbst – digital geplant, schriftlich garantiert und nach einer kostenlosen Online-Beratung.',
    priceH2: 'Was Zahnersatz in Österreich üblicherweise kostet',
    priceCol: 'Übliche Spanne in Österreich',
    priceIntro: 'Zur Orientierung veröffentlichte Richtwerte für Österreich:',
    prices: [
      { item: 'Implantat inkl. Abutment und Krone', range: 'ca. 2.200–3.200 €', src: 0 },
      { item: 'Krone (als Teil der Implantatversorgung)', range: 'ca. 600–1.200 €', src: 0 },
    ],
    sources: [S.atchRatgeber],
    travelH2: 'Anreise aus Österreich',
    airports: [
      { from: 'Wien (VIE)', time: '≈ 2 Std. 15 Min.' },
      { from: 'Graz (GRZ)', time: '≈ 2 Std. 10 Min.' },
      { from: 'Salzburg (SZG)', time: '≈ 2 Std. 30 Min.' },
      { from: 'Linz (LNZ) / Innsbruck (INN)', time: 'meist mit Umstieg' },
    ],
    faqH2: 'Fragen von Patienten aus Österreich',
    faq: deFaqCommon('Ihre Krankenkasse (z. B. die ÖGK)', 'Ihrer Krankenkasse', 'nach Österreich'),
    wa: 'Guten Tag, ich komme aus Österreich und interessiere mich für eine kostenlose Online-Beratung zu Zahnimplantaten.',
  },
  // ───────────── Switzerland
  {
    id: 'de-CH', locale: 'de', ui: 'deCH', htmlLang: 'de-CH', country: 'CH', dial: '41', flag: '🇨🇭',
    slug: 'zahnimplantate-tuerkei-schweiz',
    navLabel: 'Patienten aus der Schweiz',
    title: 'Zahnimplantate in der Türkei – für Patienten aus der Schweiz',
    description: 'Zahnimplantate in Istanbul, ab Zürich in rund 3 Flugstunden: Behandlung durch Dt. Nizam Abdullayev, digitale Planung, 10 Jahre Klinikgarantie. Kostenlose Online-Beratung.',
    eyebrow: 'Für Patientinnen und Patienten aus der Schweiz',
    h1: 'Zahnimplantate in Istanbul – ab Zürich in rund 3 Flugstunden',
    lead: 'Sorgfältig geplant, persönlich behandelt: In unserer kleinen Klinik betreut Sie Dt. Nizam Abdullayev von der kostenlosen Online-Beratung bis zur Schlusskontrolle – mit digitaler Planung und schriftlicher Garantie.',
    priceH2: 'Was Zahnersatz in der Schweiz üblicherweise kostet',
    priceCol: 'Übliche Spanne in der Schweiz',
    priceIntro: 'Zur Orientierung veröffentlichte Richtwerte aus der Schweiz:',
    prices: [
      { item: 'Implantat inkl. Krone', range: 'ca. CHF 3’500–5’500', src: 0 },
      { item: 'Zahnimplantat mit Krone (Zahnarztzentrum)', range: 'ab CHF 4’000', src: 1 },
      { item: 'Krone inkl. Schweizer Labor', range: 'ab CHF 1’400', src: 1 },
      { item: 'Veneer', range: 'ab CHF 1’345', src: 1 },
    ],
    sources: [S.atchRatgeber, S.zazPreise],
    travelH2: 'Anreise aus der Schweiz',
    airports: [
      { from: 'Zürich (ZRH)', time: '≈ 3 Std.' },
      { from: 'Basel (BSL)', time: '≈ 3 Std.' },
      { from: 'Genf (GVA)', time: '≈ 3 Std. 15 Min.' },
    ],
    faqH2: 'Fragen von Patienten aus der Schweiz',
    faq: deFaqCommon('Ihre Krankenkasse', 'Ihrer Krankenkasse', 'in die Schweiz').map((f) => ({ q: f.q.replace(/ß/g, 'ss'), a: f.a.replace(/ß/g, 'ss') })),
    wa: 'Grüezi, ich komme aus der Schweiz und interessiere mich für eine kostenlose Online-Beratung zu Zahnimplantaten.',
  },
  // ───────────── Netherlands
  {
    id: 'nl-NL', locale: 'nl', ui: 'nl', htmlLang: 'nl-NL', country: 'NL', dial: '31', flag: '🇳🇱',
    slug: 'tandimplantaten-turkije-istanbul',
    navLabel: 'Patiënten uit Nederland',
    title: 'Tandimplantaten in Turkije – voor patiënten uit Nederland',
    description: 'Tandimplantaten in Istanbul, ca. 3,5 uur vliegen vanuit Nederland: behandeling door Dt. Nizam Abdullayev, digitale planning, 10 jaar kliniekgarantie. Gratis online consult.',
    eyebrow: 'Voor patiënten uit Nederland',
    h1: 'Tandimplantaten in Istanbul – vanuit Nederland ca. 3,5 uur vliegen',
    lead: 'Eén tandarts, één digitaal plan, garantie op papier: in onze kleinschalige kliniek behandelt Dt. Nizam Abdullayev u persoonlijk – na een gratis online consult, nog voordat u een vlucht boekt.',
    priceH2: 'Wat tandvervanging in Nederland gewoonlijk kost',
    priceCol: 'Gangbaar bedrag in Nederland',
    priceIntro: 'In Nederland gelden maximumtarieven van de NZa. Ter oriëntatie een gepubliceerd richtbedrag:',
    prices: [
      { item: 'Eén implantaat met kroon', range: 'ca. € 1.500 – € 2.200', src: 0 },
    ],
    sources: [S.overstappen],
    travelH2: 'Reizen vanuit Nederland',
    airports: [
      { from: 'Amsterdam (AMS)', time: '≈ 3 u 30 min' },
      { from: 'Eindhoven (EIN)', time: '≈ 3 u 15 min' },
      { from: 'Rotterdam (RTM)', time: 'meestal met overstap' },
    ],
    faqH2: 'Vragen van patiënten uit Nederland',
    faq: nlFaqCommon('uw zorgverzekeraar', 'in Nederland'),
    wa: 'Goedendag, ik woon in Nederland en heb interesse in een gratis online consult over tandimplantaten.',
  },
  // ───────────── Belgium (nl)
  {
    id: 'nl-BE', locale: 'nl', ui: 'nl', htmlLang: 'nl-BE', country: 'BE', dial: '32', flag: '🇧🇪',
    slug: 'tandimplantaten-turkije-belgie',
    navLabel: 'Patiënten uit België',
    title: 'Tandimplantaten in Turkije – voor patiënten uit België',
    description: 'Tandimplantaten in Istanbul, ca. 3,5 uur vliegen vanuit Brussel: behandeling door Dt. Nizam Abdullayev, digitale planning, 10 jaar kliniekgarantie. Gratis online consult.',
    eyebrow: 'Voor patiënten uit België',
    h1: 'Tandimplantaten in Istanbul – vanuit België ca. 3,5 uur vliegen',
    lead: 'Persoonlijk en zorgvuldig: in onze kleinschalige kliniek begeleidt Dt. Nizam Abdullayev u zelf, van het gratis online consult tot de laatste controle – digitaal gepland en met schriftelijke garantie.',
    priceH2: 'Wat tandvervanging in België gewoonlijk kost',
    priceCol: 'Gangbaar bedrag in België',
    priceIntro: 'Ter oriëntatie gepubliceerde richtbedragen voor België:',
    prices: [
      { item: 'Implantaat met abutment en kroon', range: 'ca. € 1.000 – € 3.500 (gemiddeld ca. € 1.800)', src: 0 },
      { item: 'All-on-4', range: 'ca. € 15.000', src: 0 },
    ],
    sources: [S.hellosafe],
    travelH2: 'Reizen vanuit België',
    airports: [
      { from: 'Brussel (BRU)', time: '≈ 3 u 20 min' },
      { from: 'Charleroi (CRL)', time: '≈ 3 u 15 min' },
      { from: 'Antwerpen / Luik', time: 'via Brussel of Charleroi' },
    ],
    faqH2: 'Vragen van patiënten uit België',
    faq: nlFaqCommon('uw ziekenfonds of aanvullende tandverzekering', 'in België'),
    wa: 'Goedendag, ik woon in België en heb interesse in een gratis online consult over tandimplantaten.',
  },
  // ───────────── Belgium (fr)
  {
    id: 'fr-BE', locale: 'fr', ui: 'fr', htmlLang: 'fr-BE', country: 'BE', dial: '32', flag: '🇧🇪',
    slug: 'implants-dentaires-turquie-belgique',
    navLabel: 'Patients de Belgique',
    title: 'Implants dentaires en Turquie – pour les patients de Belgique',
    description: 'Implants dentaires à Istanbul, à environ 3 h 30 de vol de Bruxelles : soins par le Dt Nizam Abdullayev, planification numérique, garantie clinique de 10 ans. Consultation en ligne gratuite.',
    eyebrow: 'Pour les patients de Belgique',
    h1: 'Implants dentaires à Istanbul – à environ 3 h 30 de vol de la Belgique',
    lead: 'Un dentiste, un plan numérique, une garantie écrite : dans notre clinique à taille humaine, le Dt Nizam Abdullayev vous soigne personnellement – après une consultation en ligne gratuite, avant même que vous réserviez un vol.',
    priceH2: 'Ce que coûtent habituellement les implants en Belgique',
    priceCol: 'Fourchette habituelle en Belgique',
    priceIntro: 'À titre indicatif, des valeurs publiées pour la Belgique :',
    prices: [
      { item: 'Implant avec pilier et couronne', range: 'env. 1 000 – 3 500 € (moyenne env. 1 800 €)', src: 0 },
      { item: 'All-on-4', range: 'env. 15 000 €', src: 0 },
    ],
    sources: [S.hellosafe],
    travelH2: 'Voyager depuis la Belgique',
    airports: [
      { from: 'Bruxelles (BRU)', time: '≈ 3 h 20' },
      { from: 'Charleroi (CRL)', time: '≈ 3 h 15' },
      { from: 'Liège / Namur', time: 'via Bruxelles ou Charleroi' },
    ],
    faqH2: 'Questions des patients de Belgique',
    faq: frFaqCommon('votre mutualité ou assurance dentaire complémentaire', 'en Belgique'),
    wa: 'Bonjour, j’habite en Belgique et je souhaiterais une consultation en ligne gratuite au sujet des implants dentaires.',
  },
  // ───────────── France
  {
    id: 'fr-FR', locale: 'fr', ui: 'fr', htmlLang: 'fr-FR', country: 'FR', dial: '33', flag: '🇫🇷',
    slug: 'implants-dentaires-turquie-istanbul',
    navLabel: 'Patients de France',
    title: 'Implants dentaires en Turquie – pour les patients de France',
    description: 'Implants dentaires à Istanbul, à environ 3 h de vol de Paris ou Lyon : soins par le Dt Nizam Abdullayev, planification numérique, garantie clinique de 10 ans. Consultation en ligne gratuite.',
    eyebrow: 'Pour les patients de France',
    h1: 'Implants dentaires à Istanbul – à environ 3 heures de vol de la France',
    lead: 'Pas de « package » standard : dans notre clinique à taille humaine, le Dt Nizam Abdullayev étudie votre dossier lors d’une consultation en ligne gratuite, planifie numériquement et vous soigne lui-même – avec une garantie écrite.',
    priceH2: 'Ce que coûte habituellement un implant en France',
    priceCol: 'Fourchette habituelle en France',
    priceIntro: 'À titre indicatif, des valeurs publiées pour la France. L’Assurance maladie ne rembourse pas l’implant lui-même ; seule la couronne est partiellement prise en charge (base de remboursement de 120 €) :',
    prices: [
      { item: 'Implant complet (implant + pilier + couronne)', range: 'env. 1 400 – 3 100 €', src: 0 },
      { item: 'Couronne (selon le matériau)', range: 'env. 600 – 1 500 €', src: 0 },
    ],
    sources: [S.reassurez],
    travelH2: 'Voyager depuis la France',
    airports: [
      { from: 'Paris (CDG / ORY)', time: '≈ 3 h 30' },
      { from: 'Lyon (LYS)', time: '≈ 3 h' },
      { from: 'Nice (NCE)', time: '≈ 2 h 45' },
      { from: 'Marseille (MRS)', time: '≈ 3 h' },
      { from: 'Bordeaux / Toulouse', time: 'souvent avec escale' },
    ],
    faqH2: 'Questions des patients de France',
    faq: [
      ...frFaqCommon('votre mutuelle', 'en France').map((f, i) => i === 1
        ? { q: 'L’Assurance maladie ou ma mutuelle participent-elles aux frais ?', a: 'En règle générale, les soins programmés hors de l’Union européenne ne sont pas pris en charge par l’Assurance maladie. Certaines mutuelles prévoient des forfaits dentaires : renseignez-vous avant le départ. Sur demande, nous vous transmettons à l’avance votre plan de traitement écrit.' }
        : f),
    ],
    wa: 'Bonjour, j’habite en France et je souhaiterais une consultation en ligne gratuite au sujet des implants dentaires.',
  },
  // ───────────── Norway
  {
    id: 'nb-NO', locale: 'no', ui: 'no', htmlLang: 'nb-NO', country: 'NO', dial: '47', flag: '🇳🇴',
    slug: 'tannimplantater-tyrkia-istanbul',
    navLabel: 'Pasienter fra Norge',
    title: 'Tannimplantater i Tyrkia – for pasienter fra Norge',
    description: 'Tannimplantater i Istanbul, rundt 4 timer med fly fra Oslo: behandling ved Dt. Nizam Abdullayev, digital planlegging, 10 års klinikkgaranti. Gratis nettkonsultasjon.',
    eyebrow: 'For pasienter fra Norge',
    h1: 'Tannimplantater i Istanbul – rundt 4 timer med fly fra Oslo',
    lead: 'Én tannlege, én digital plan, skriftlig garanti: I vår lille klinikk behandler Dt. Nizam Abdullayev deg personlig – etter en gratis nettkonsultasjon, før du bestiller flybillett.',
    priceH2: 'Hva tannerstatning vanligvis koster i Norge',
    priceCol: 'Vanlig prisnivå i Norge',
    priceIntro: 'Til orientering noen publiserte veiledende priser for Norge:',
    prices: [
      { item: 'Implantat med krone, per tann', range: 'ca. 14 000–37 000 kr', src: 0 },
      { item: 'Helkeramisk krone (vanligst)', range: 'ca. 5 000–6 000 kr', src: 1 },
      { item: 'Implantater i hele munnen', range: 'opptil ca. 150 000 kr', src: 0 },
    ],
    sources: [S.tannsmartNye, S.tannsmartKrone],
    travelH2: 'Reise fra Norge',
    airports: [
      { from: 'Oslo (OSL)', time: '≈ 3 t 50 min' },
      { from: 'Bergen / Stavanger / Trondheim', time: 'ofte med ett bytte' },
    ],
    faqH2: 'Spørsmål fra pasienter i Norge',
    faq: [
      { q: 'Hvor mye tid må jeg sette av totalt?', a: 'For implantater trenger du to opphold: først 5–6 dager, og etter tilhelingen (vanligvis noen måneder) 4–5 dager til. Kroner eller fasetter krever som regel ett opphold på 5–7 dager. Den nøyaktige planen får du skriftlig etter nettkonsultasjonen.' },
      { q: 'Dekker Helfo noe av behandlingen?', a: 'Helfo dekker tannbehandling bare i særskilte tilfeller, og planlagt behandling utenfor EØS dekkes som hovedregel ikke. Sjekk med Helfo og eventuell privat forsikring før du bestemmer deg. Ved ønske får du behandlingsplanen skriftlig på forhånd.' },
      { q: 'Hvem følger meg opp når jeg er hjemme i Norge?', a: 'Kontaktpersonen din og Dt. Abdullayev kan nås på WhatsApp – ofte holder det med bilder for en første vurdering. Du får med deg journal med røntgenbilder og merke og størrelse på implantatene, slik at også en tannlege der du bor kan ta kontroller.' },
      { q: 'Blir friske tenner slipt mye ned for kroner eller fasetter?', a: 'Hvor mye tannsubstans som må fjernes, avhenger av situasjonen og materialet. Dt. Abdullayev planlegger digitalt og forklarer på forhånd hvilken løsning som er mest skånsom – også om det betyr at færre tenner behandles.' },
      { q: 'Hvordan fungerer garantien når jeg ikke bor i Istanbul?', a: 'Garantivilkårene får du skriftlig sammen med planen. Garantiarbeid utføres på klinikken vår i Istanbul; detaljene avtales på forhånd med kontaktpersonen din.' },
      { q: 'Hvilket språk foregår kommunikasjonen på?', a: 'Vi snakker ikke norsk. Kommunikasjonen foregår på engelsk eller tysk, og alt vi avtaler, får du skriftlig.' },
    ],
    wa: 'Hei, jeg bor i Norge og er interessert i en gratis nettkonsultasjon om tannimplantater.',
  },
  // ───────────── United Kingdom
  {
    id: 'en-GB', locale: 'en', ui: 'en', htmlLang: 'en-GB', country: 'GB', dial: '44', flag: '🇬🇧',
    slug: 'dental-implants-turkey-uk',
    navLabel: 'Patients from the UK',
    title: 'Dental Implants in Turkey – for Patients from the UK',
    description: 'Dental implants in Istanbul, about 4 hours from the UK: treated by Dt. Nizam Abdullayev, digital planning, written 10-year clinic warranty. Free online consultation.',
    eyebrow: 'For patients from the United Kingdom',
    h1: 'Dental implants in Istanbul – about 4 hours’ flight from the UK',
    lead: 'One dentist, one digital plan, a written warranty. At our small doctor-run clinic, Dt. Nizam Abdullayev treats you personally – after a free online consultation, before you book a flight.',
    priceH2: 'What implants and crowns usually cost in the UK',
    priceCol: 'Typical UK price',
    priceIntro: 'Most implant treatment in the UK is private. For reference, some published UK figures:',
    prices: [
      { item: 'Single implant with crown (Bupa Dental Care)', range: 'from £2,400', src: 0 },
      { item: 'Zirconia or E-max crown (London practice)', range: 'from £850', src: 1 },
      { item: 'NHS Band 3 course incl. crowns, England (if you can access an NHS dentist)', range: '£326.70', src: 2 },
    ],
    sources: [S.bupa, S.whites, S.nhsBands],
    travelH2: 'Travelling from the UK',
    airports: [
      { from: 'London (LHR / LGW / STN)', time: '≈ 3 h 50 min' },
      { from: 'Manchester (MAN)', time: '≈ 4 h' },
      { from: 'Birmingham (BHX)', time: '≈ 3 h 55 min' },
      { from: 'Edinburgh (EDI)', time: '≈ 4 h 15 min' },
    ],
    faqH2: 'Questions from UK patients',
    faq: [
      { q: 'I have read about “Turkey teeth”. How is your approach different?', a: 'Many of the problems UK dentists report come from over-prepared teeth, poorly fitting crowns or treatment carried out without proper planning. We plan digitally from your scans and X-ray, explain the most conservative option first and put your plan in writing before you travel. Dt. Abdullayev treats you himself rather than handing you to a rotating team.' },
      ...enFaqCommon('in the UK'),
      { q: 'Is the clinic regulated?', a: 'The clinic is authorised by the Ministry of Health of the Republic of Türkiye for international health tourism, and Dt. Abdullayev is a dentist licensed in Türkiye. Please note that dentists practising in Türkiye are not registered with the UK General Dental Council.' },
    ],
    wa: 'Hello, I live in the UK and would like a free online consultation about dental implants.',
  },
  // ───────────── Ireland
  {
    id: 'en-IE', locale: 'en', ui: 'en', htmlLang: 'en-IE', country: 'IE', dial: '353', flag: '🇮🇪',
    slug: 'dental-implants-turkey-ireland',
    navLabel: 'Patients from Ireland',
    title: 'Dental Implants in Turkey – for Patients from Ireland',
    description: 'Dental implants in Istanbul, about 4 hours from Dublin: treated by Dt. Nizam Abdullayev, digital planning, written 10-year clinic warranty. Free online consultation.',
    eyebrow: 'For patients from Ireland',
    h1: 'Dental implants in Istanbul – about 4 hours’ flight from Dublin',
    lead: 'Careful planning, one dentist, a written warranty. At our small doctor-run clinic, Dt. Nizam Abdullayev looks after you personally – starting with a free online consultation before you book anything.',
    priceH2: 'What implants usually cost in Ireland',
    priceCol: 'Typical price in Ireland',
    priceIntro: 'For reference, published figures from a Dublin practice:',
    prices: [
      { item: 'Single implant with abutment and crown', range: '€3,000 – €3,500', src: 0 },
      { item: 'Porcelain crown on an implant', range: 'about €1,350', src: 0 },
      { item: 'All-on-4, per arch', range: '€12,000 – €18,000', src: 0 },
    ],
    sources: [S.docklands],
    travelH2: 'Travelling from Ireland',
    airports: [
      { from: 'Dublin (DUB)', time: '≈ 4 h 15 min' },
      { from: 'Cork / Shannon', time: 'usually with one connection' },
    ],
    faqH2: 'Questions from patients in Ireland',
    faq: [
      ...enFaqCommon('in Ireland'),
      { q: 'Can I claim tax relief on treatment abroad?', a: 'In Ireland, non-routine dental treatment such as crowns and implants can qualify for medical expenses tax relief (Form Med 2). Whether treatment abroad qualifies depends on Revenue’s rules – please check with Revenue or your tax adviser before you travel.' },
    ],
    wa: 'Hello, I live in Ireland and would like a free online consultation about dental implants.',
  },
  // ───────────── United States
  {
    id: 'en-US', locale: 'en', ui: 'enUS', htmlLang: 'en-US', country: 'US', dial: '1', flag: '🇺🇸',
    slug: 'dental-implants-turkey-usa',
    navLabel: 'Patients from the USA',
    title: 'Dental Implants in Turkey – for Patients from the USA',
    description: 'Dental implants in Istanbul with direct flights from major US cities: treated by Dt. Nizam Abdullayev, digital planning, written 10-year clinic warranty. Free online consultation.',
    eyebrow: 'For patients from the United States',
    h1: 'Dental implants in Istanbul – direct flights from major US cities',
    lead: 'A long trip deserves a careful plan. Dt. Nizam Abdullayev reviews your case in a free online consultation, plans your treatment digitally and gives you a written plan and schedule before you book a flight.',
    priceH2: 'What implants usually cost in the US',
    priceCol: 'Typical US range',
    priceIntro: 'For reference, published US figures (before insurance):',
    prices: [
      { item: 'Single implant with abutment and crown', range: '$3,000 – $5,600', src: 0 },
      { item: 'All-on-4, per arch', range: '$11,600 – $27,500', src: 0 },
    ],
    sources: [S.newmouth],
    travelH2: 'Traveling from the US',
    airports: [
      { from: 'New York (JFK / EWR)', time: '≈ 10 h' },
      { from: 'Washington (IAD)', time: '≈ 10 h 15 min' },
      { from: 'Chicago (ORD)', time: '≈ 10 h 30 min' },
      { from: 'Miami (MIA)', time: '≈ 11 h 30 min' },
      { from: 'Houston (IAH)', time: '≈ 12 h' },
      { from: 'Los Angeles (LAX)', time: '≈ 13 h' },
    ],
    travelNote: 'Because implant treatment needs two visits, we plan both trips with you from the start so you can book flights and time off work in advance.',
    faqH2: 'Questions from US patients',
    faq: [
      ...enFaqCommon('in the US', true).map((f) => ({ q: f.q, a: f.a.replace('check-ups', 'checkups') })),
      { q: 'Will my US dental insurance cover treatment abroad?', a: 'Many US dental plans do not cover planned treatment abroad, and some cover only part of it. Please check with your insurer before you travel; on request we send your written treatment plan in advance.' },
    ],
    wa: 'Hello, I live in the United States and would like a free online consultation about dental implants.',
  },
  // ───────────── Poland
  {
    id: 'pl-PL', locale: 'pl', ui: 'pl', htmlLang: 'pl-PL', country: 'PL', dial: '48', flag: '🇵🇱',
    slug: 'implanty-zebow-turcja-stambul',
    navLabel: 'Pacjenci z Polski',
    title: 'Implanty zębów w Turcji – dla pacjentów z Polski',
    description: 'Implanty zębów w Stambule, ok. 2,5 godziny lotu z Polski: leczenie u Dt. Nizam Abdullayev, cyfrowe planowanie, 10 lat gwarancji kliniki. Bezpłatna konsultacja online.',
    eyebrow: 'Dla pacjentów z Polski',
    h1: 'Implanty zębów w Stambule – z Polski ok. 2,5 godziny lotu',
    lead: 'Jeden lekarz, jeden cyfrowy plan, gwarancja na piśmie: w naszej kameralnej klinice leczy Państwa osobiście Dt. Nizam Abdullayev – po bezpłatnej konsultacji online, zanim kupią Państwo bilet.',
    priceH2: 'Ile zwykle kosztują implanty w Polsce',
    priceCol: 'Typowy przedział w Polsce',
    priceIntro: 'Ceny w Polsce bywają niższe niż w Europie Zachodniej – dlatego nie obiecujemy „najniższej ceny”. Liczą się lekarz, planowanie i gwarancja. Orientacyjne, opublikowane wartości:',
    prices: [
      { item: 'Implant z łącznikiem i koroną', range: 'ok. 4 000–10 000 zł', src: 0 },
      { item: 'Korona (zależnie od materiału)', range: 'ok. 1 500–4 000 zł', src: 0 },
      { item: 'All-on-4, jeden łuk', range: 'ok. 25 000–45 000 zł', src: 0 },
    ],
    sources: [S.miadent],
    travelH2: 'Podróż z Polski',
    airports: [
      { from: 'Warszawa (WAW)', time: '≈ 2 h 30 min' },
      { from: 'Kraków (KRK)', time: '≈ 2 h 15 min' },
      { from: 'Katowice (KTW)', time: '≈ 2 h 15 min' },
      { from: 'Gdańsk (GDN)', time: '≈ 2 h 50 min' },
    ],
    faqH2: 'Pytania pacjentów z Polski',
    faq: [
      { q: 'Ile czasu trzeba zaplanować łącznie?', a: 'Przy implantach potrzebne są dwa pobyty: najpierw 5–6 dni, a po okresie gojenia (zwykle kilka miesięcy) kolejne 4–5 dni. Korony lub licówki wymagają zazwyczaj jednego pobytu trwającego 5–7 dni. Dokładny harmonogram otrzymują Państwo na piśmie po konsultacji online.' },
      { q: 'Czy NFZ lub prywatne ubezpieczenie pokryje część kosztów?', a: 'NFZ co do zasady nie finansuje implantów, a planowane leczenie poza UE zwykle nie podlega refundacji. Prosimy sprawdzić warunki u swojego ubezpieczyciela przed wyjazdem. Na życzenie wcześniej przesyłamy pisemny plan leczenia.' },
      { q: 'Kto zajmie się mną po powrocie do Polski?', a: 'Koordynator i Dt. Abdullayev pozostają dostępni przez WhatsApp – często zdjęcia wystarczą do wstępnej oceny. Otrzymują Państwo dokumentację ze zdjęciami RTG oraz marką i rozmiarem implantów, więc kontrole może przeprowadzić także stomatolog w miejscu zamieszkania.' },
      { q: 'Czy do koron lub licówek mocno szlifuje się zdrowe zęby?', a: 'Zakres szlifowania zależy od sytuacji klinicznej i materiału. Dt. Abdullayev planuje cyfrowo i z góry wyjaśnia, które rozwiązanie najbardziej oszczędza zęby – nawet jeśli oznacza to leczenie mniejszej liczby zębów.' },
      { q: 'Jak działa gwarancja, jeśli nie mieszkam w Stambule?', a: 'Warunki gwarancji otrzymują Państwo na piśmie razem z planem. Świadczenia gwarancyjne realizuje nasza klinika w Stambule; szczegóły ustala się wcześniej z koordynatorem.' },
      { q: 'Czy mogę porozumiewać się po polsku?', a: 'Tak. Mówimy m.in. po polsku – kontakt z koordynatorem jest możliwy w języku polskim.' },
    ],
    wa: 'Dzień dobry, mieszkam w Polsce i chciał(a)bym umówić bezpłatną konsultację online w sprawie implantów zębów.',
  },
  // ───────────── Czechia
  {
    id: 'cs-CZ', locale: 'cs', ui: 'cs', htmlLang: 'cs-CZ', country: 'CZ', dial: '420', flag: '🇨🇿',
    slug: 'zubni-implantaty-turecko-istanbul',
    navLabel: 'Pacienti z Česka',
    title: 'Zubní implantáty v Turecku – pro pacienty z Česka',
    description: 'Zubní implantáty v Istanbulu, z Prahy přibližně 2,5 hodiny letu: ošetření u Dt. Nizam Abdullayev, digitální plánování, záruka kliniky 10 let. Bezplatná online konzultace.',
    eyebrow: 'Pro pacienty z České republiky',
    h1: 'Zubní implantáty v Istanbulu – z Prahy přibližně 2,5 hodiny letu',
    lead: 'Jeden lékař, jeden digitální plán, písemná záruka: v naší menší klinice vás osobně ošetří Dt. Nizam Abdullayev – po bezplatné online konzultaci, ještě než si koupíte letenku.',
    priceH2: 'Kolik obvykle stojí implantáty v Česku',
    priceCol: 'Obvyklé rozpětí v Česku',
    priceIntro: 'Pro orientaci zveřejněné částky z Česka:',
    prices: [
      { item: 'Implantát s korunkou (na jeden zub)', range: 'cca 25 000–40 000 Kč', src: 0 },
      { item: 'Korunka na implantátu', range: 'cca 8 000–18 000 Kč', src: 1 },
    ],
    sources: [S.czImpl, S.czWichrova],
    travelH2: 'Cesta z Česka',
    airports: [
      { from: 'Praha (PRG)', time: '≈ 2 h 30 min' },
      { from: 'Brno / Ostrava', time: 'obvykle s přestupem nebo z Vídně / Katovic' },
    ],
    faqH2: 'Dotazy pacientů z Česka',
    faq: [
      { q: 'Kolik času mám celkem počítat?', a: 'U implantátů počítejte se dvěma pobyty: nejprve 5–6 dní a po zhojení (obvykle několik měsíců) ještě 4–5 dní. Korunky nebo fazety obvykle vyžadují jeden pobyt na 5–7 dní. Přesný harmonogram obdržíte písemně po online konzultaci.' },
      { q: 'Přispěje zdravotní pojišťovna?', a: 'Veřejné zdravotní pojištění implantáty zpravidla nehradí a plánovanou péči mimo EU obvykle také ne. Ověřte si prosím podmínky u své pojišťovny před cestou. Na přání vám předem pošleme písemný plán léčby.' },
      { q: 'Kdo se o mě postará po návratu domů?', a: 'Vaše kontaktní osoba i Dt. Abdullayev jsou dostupní přes WhatsApp – pro první posouzení často stačí fotografie. Dostanete dokumentaci s rentgenovými snímky a značkou i velikostí implantátů, takže kontroly může provádět i zubní lékař v místě bydliště.' },
      { q: 'Brousí se kvůli korunkám nebo fazetám hodně zdravých zubů?', a: 'Rozsah broušení závisí na nálezu a materiálu. Dt. Abdullayev plánuje digitálně a předem vysvětlí, které řešení je k zubům nejšetrnější – i když to znamená ošetřit méně zubů.' },
      { q: 'Jak funguje záruka, když nebydlím v Istanbulu?', a: 'Záruční podmínky dostanete písemně spolu s plánem. Záruční plnění poskytuje naše klinika v Istanbulu; podrobnosti si předem domluvíte se svou kontaktní osobou.' },
      { q: 'V jakém jazyce budeme komunikovat?', a: 'Česky nemluvíme. Komunikace probíhá v angličtině, němčině nebo polštině a vše domluvené dostanete písemně.' },
    ],
    wa: 'Dobrý den, žiji v Česku a mám zájem o bezplatnou online konzultaci ohledně zubních implantátů.',
  },
  // ───────────── Bulgaria
  {
    id: 'bg-BG', locale: 'bg', ui: 'bg', htmlLang: 'bg-BG', country: 'BG', dial: '359', flag: '🇧🇬',
    slug: 'zabni-implanti-turtsiya-istanbul',
    navLabel: 'Пациенти от България',
    title: 'Зъбни импланти в Турция – за пациенти от България',
    description: 'Зъбни импланти в Истанбул, на около час полет от София: лечение при Dt. Nizam Abdullayev, дигитално планиране, 10 години гаранция. Безплатна онлайн консултация.',
    eyebrow: 'За пациенти от България',
    h1: 'Зъбни импланти в Истанбул – на около час полет от София',
    lead: 'Един лекар, един дигитален план, писмена гаранция: в нашата малка клиника Dt. Nizam Abdullayev ви лекува лично – след безплатна онлайн консултация, преди да купите билет.',
    priceH2: 'Колко струват обикновено имплантите в България',
    priceCol: 'Обичаен диапазон в България',
    priceIntro: 'Цените в България често са по-ниски, отколкото в Западна Европа – затова не обещаваме „най-ниската цена“. Решаващи са лекарят, планирането и гаранцията. Ориентировъчни публикувани стойности (в евро по фиксирания курс 1,95583 лв.):',
    prices: [
      { item: 'Имплант с корона', range: 'ок. 1 350–2 800 лв. (≈ 690–1 430 €)', src: 0 },
      { item: 'Циркониева корона', range: 'ок. 800–1 200 лв. (≈ 410–615 €)', src: 0 },
      { item: 'All-on-4, на челюст', range: 'ок. 7 500–13 500 лв. (≈ 3 835–6 900 €)', src: 0 },
    ],
    sources: [S.balcare],
    travelH2: 'Пътуване от България',
    airports: [
      { from: 'София (SOF)', time: '≈ 1 ч 15 мин' },
      { from: 'Варна (VAR)', time: '≈ 1 ч 10 мин' },
      { from: 'Бургас (BOJ)', time: 'по сезонни линии' },
      { from: 'С кола от София', time: '≈ 550 км' },
    ],
    faqH2: 'Въпроси от пациенти от България',
    faq: [
      { q: 'Колко време трябва да предвидя общо?', a: 'При импланти са нужни два престоя: първо 5–6 дни, а след зарастването (обикновено няколко месеца) още 4–5 дни. За корони или фасети обикновено е достатъчен един престой от 5–7 дни. Точния график получавате писмено след онлайн консултацията.' },
      { q: 'Мога ли да дойда с кола или автобус?', a: 'Да. Много пациенти от България пътуват по суша. Кажете ни как пристигате и координаторът ще уточни с вас логистиката до клиниката.' },
      { q: 'Поема ли НЗОК или частна застраховка част от разходите?', a: 'Имплантите по правило не се покриват от задължителното здравно осигуряване, а планово лечение извън ЕС обикновено също не се възстановява. Проверете условията при застрахователя си преди пътуването. При желание ви изпращаме предварително писмения план.' },
      { q: 'Кой ще ме проследява след връщането в България?', a: 'Координаторът и Dt. Abdullayev са на разположение в WhatsApp – често снимките са достатъчни за първа оценка. Получавате документация с рентгенографии и марка и размер на имплантите, така че контролите може да прави и зъболекар близо до вас.' },
      { q: 'Изпиляват ли се силно здрави зъби за корони или фасети?', a: 'Колко зъбна тъкан трябва да се отнеме, зависи от случая и материала. Dt. Abdullayev планира дигитално и предварително обяснява кое решение е най-щадящо – дори ако това означава да се лекуват по-малко зъби.' },
      { q: 'Говорите ли български?', a: 'Да. Говорим и български – комуникацията с координатора е възможна на български език.' },
    ],
    wa: 'Здравейте, от България съм и бих искал(а) безплатна онлайн консултация за зъбни импланти.',
  },
  // ───────────── Romania
  {
    id: 'ro-RO', locale: 'ro', ui: 'ro', htmlLang: 'ro-RO', country: 'RO', dial: '40', flag: '🇷🇴',
    slug: 'implanturi-dentare-turcia-istanbul',
    navLabel: 'Pacienți din România',
    title: 'Implanturi dentare în Turcia – pentru pacienții din România',
    description: 'Implanturi dentare în Istanbul, la aproximativ 1 h 30 de zbor din București: tratament la Dt. Nizam Abdullayev, planificare digitală, garanție 10 ani. Consultație online gratuită.',
    eyebrow: 'Pentru pacienții din România',
    h1: 'Implanturi dentare în Istanbul – la aproximativ 1 h 30 de zbor din București',
    lead: 'Un singur medic, un plan digital, garanție în scris: în clinica noastră de mici dimensiuni vă tratează personal Dt. Nizam Abdullayev – după o consultație online gratuită, înainte să cumpărați biletul.',
    priceH2: 'Cât costă de obicei implanturile în România',
    priceCol: 'Interval obișnuit în România',
    priceIntro: 'Prețurile din România sunt adesea mai mici decât în Europa de Vest – de aceea nu promitem „cel mai mic preț”. Contează medicul, planificarea și garanția. Valori orientative publicate:',
    prices: [
      { item: 'Implant + bont + coroană', range: 'aprox. 3.500–9.000 lei', src: 0 },
      { item: 'Coroană din zirconiu', range: 'aprox. 1.500–2.500 lei', src: 0 },
      { item: 'All-on-4 / All-on-6, pe arcadă', range: 'aprox. 25.000–50.000 lei', src: 0 },
    ],
    sources: [S.catcostain],
    travelH2: 'Călătoria din România',
    airports: [
      { from: 'București (OTP)', time: '≈ 1 h 30 min' },
      { from: 'Cluj-Napoca (CLJ)', time: '≈ 2 h' },
      { from: 'Timișoara (TSR)', time: '≈ 2 h' },
      { from: 'Iași (IAS)', time: '≈ 1 h 45 min' },
    ],
    faqH2: 'Întrebări de la pacienții din România',
    faq: [
      { q: 'Cât timp trebuie să planific în total?', a: 'Pentru implanturi sunt necesare două șederi: mai întâi 5–6 zile, iar după vindecare (de obicei câteva luni) încă 4–5 zile. Coroanele sau fațetele necesită de regulă o singură ședere de 5–7 zile. Programul exact îl primiți în scris după consultația online.' },
      { q: 'Pot veni cu mașina?', a: 'Da. Spuneți-ne cum ajungeți, iar coordonatorul stabilește împreună cu dumneavoastră logistica până la clinică.' },
      { q: 'CNAS sau o asigurare privată acoperă o parte din costuri?', a: 'Implanturile nu sunt, de regulă, decontate din asigurarea publică, iar tratamentul planificat în afara UE nu este, de obicei, rambursat. Verificați condițiile la asigurătorul dumneavoastră înainte de călătorie. La cerere, vă trimitem dinainte planul de tratament în scris.' },
      { q: 'Cine se ocupă de mine după întoarcerea în România?', a: 'Coordonatorul și Dt. Abdullayev rămân disponibili pe WhatsApp – adesea fotografiile sunt suficiente pentru o primă evaluare. Primiți documentația cu radiografiile și marca și dimensiunea implanturilor, astfel încât controalele pot fi făcute și de un medic dentist din apropiere.' },
      { q: 'Se șlefuiesc mult dinții sănătoși pentru coroane sau fațete?', a: 'Cât țesut dentar trebuie îndepărtat depinde de situație și de material. Dt. Abdullayev planifică digital și vă explică dinainte ce soluție protejează cel mai bine dinții – chiar dacă asta înseamnă tratarea mai puținor dinți.' },
      { q: 'Vorbiți română?', a: 'Da. Vorbim, printre altele, română – comunicarea cu coordonatorul este posibilă în limba română.' },
    ],
    wa: 'Bună ziua, locuiesc în România și aș dori o consultație online gratuită despre implanturi dentare.',
  },
  // ───────────── Portugal
  {
    id: 'pt-PT', locale: 'pt', ui: 'pt', htmlLang: 'pt-PT', country: 'PT', dial: '351', flag: '🇵🇹',
    slug: 'implantes-dentarios-turquia-istambul',
    navLabel: 'Pacientes de Portugal',
    title: 'Implantes dentários na Turquia – para pacientes de Portugal',
    description: 'Implantes dentários em Istambul, a cerca de 4 h 30 de voo de Lisboa: tratamento pelo Dt. Nizam Abdullayev, planeamento digital, garantia de 10 anos. Consulta online gratuita.',
    eyebrow: 'Para pacientes de Portugal',
    h1: 'Implantes dentários em Istambul – a cerca de 4 h 30 de voo de Lisboa',
    lead: 'Um médico dentista, um plano digital, garantia por escrito: na nossa pequena clínica, o Dt. Nizam Abdullayev trata-o pessoalmente – após uma consulta online gratuita, antes de comprar o bilhete.',
    priceH2: 'Quanto custa habitualmente um implante em Portugal',
    priceCol: 'Valor habitual em Portugal',
    priceIntro: 'Segundo a DECO PROteste, o Estado não comparticipa próteses fixas sobre implantes. Valores indicativos recolhidos em clínicas de Lisboa:',
    prices: [
      { item: 'Substituição de um dente (implante + coroa, com consultas e RX)', range: 'cerca de 920 – 3190 € (média ≈ 1600 €)', src: 0 },
      { item: 'Coroa (inclui pilar)', range: 'cerca de 380 – 1050 €', src: 0 },
    ],
    sources: [S.deco],
    travelH2: 'Viajar a partir de Portugal',
    airports: [
      { from: 'Lisboa (LIS)', time: '≈ 4 h 30 min' },
      { from: 'Porto (OPO)', time: '≈ 4 h 40 min' },
      { from: 'Faro (FAO)', time: 'normalmente com escala' },
    ],
    faqH2: 'Perguntas de pacientes de Portugal',
    faq: [
      { q: 'Quanto tempo devo prever no total?', a: 'Para implantes são necessárias duas estadias: primeiro 5–6 dias e, após a cicatrização (normalmente alguns meses), mais 4–5 dias. Coroas ou facetas exigem normalmente uma estadia de 5–7 dias. Recebe o calendário exato por escrito após a consulta online.' },
      { q: 'Os preços em Portugal não são já acessíveis? Porquê Istambul?', a: 'Depende do caso. Não prometemos “o preço mais baixo”: o que oferecemos é um médico dentista que acompanha todo o tratamento, planeamento digital e garantia por escrito. Após a consulta gratuita recebe um plano escrito e pode comparar com calma.' },
      { q: 'O seguro de saúde comparticipa?', a: 'Alguns seguros cobrem parte dos tratamentos dentários, muitas vezes com limites baixos, e o tratamento programado fora da UE pode não estar incluído. Confirme com a sua seguradora antes de viajar. A pedido, enviamos antecipadamente o plano escrito.' },
      { q: 'Quem me acompanha depois de regressar a Portugal?', a: 'O seu coordenador e o Dt. Abdullayev continuam contactáveis por WhatsApp – muitas vezes as fotografias bastam para uma primeira avaliação. Leva consigo a documentação com as radiografias e a marca e medida dos implantes, para que um médico dentista perto de si possa fazer as consultas de controlo.' },
      { q: 'Como funciona a garantia se não vivo em Istambul?', a: 'Recebe as condições da garantia por escrito juntamente com o plano. As intervenções ao abrigo da garantia são feitas na nossa clínica em Istambul; os detalhes são combinados previamente com o seu coordenador.' },
      { q: 'Em que língua comunicamos?', a: 'Não falamos português. Comunicamos em inglês ou espanhol, e tudo o que for combinado é-lhe enviado por escrito.' },
    ],
    wa: 'Olá, vivo em Portugal e gostaria de uma consulta online gratuita sobre implantes dentários.',
  },
];

// x-default: the UK English page (broadest English audience).
export const X_DEFAULT_ID = 'en-GB';

export function landingPath(l: CountryLanding): string {
  return l.locale === 'en' ? `/${l.slug}/` : `/${l.locale}/${l.slug}/`;
}

export function landingsForLocale(locale: string): CountryLanding[] {
  return COUNTRY_LANDINGS.filter((l) => l.locale === locale);
}

// Footer column heading for the country links (only locales that have landings).
export const FOOTER_HEADING: Record<string, string> = {
  en: 'International patients',
  de: 'Internationale Patienten',
  nl: 'Internationale patiënten',
  fr: 'Patients internationaux',
  no: 'Internasjonale pasienter',
  pl: 'Pacjenci zagraniczni',
  cs: 'Zahraniční pacienti',
  bg: 'Чуждестранни пациенти',
  ro: 'Pacienți internaționali',
  pt: 'Pacientes internacionais',
};

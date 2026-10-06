#!/usr/bin/env python3
"""Graphify semantik katmani (stdlib, deterministik, ag/LLM yok).

Graphify'in yerel AST grafina (graphify-out/graph.json) kodun "ne ise yaradigi" katmanini ekler:
  route:  HTTP/API uclari (FastAPI dekoratoru, Next.js route.ts, server action) -> handler, auth
  env:    ortam degiskeni ADLARI (deger asla okunmaz/yazilmaz) -> kullanan sembol
  ext:    dis entegrasyonlar (Anthropic, Meta, Telegram, Evolution...) -> cagiran sembol
  table:  veritabani tablolari, FK iliskileri, okuyan/yazan semboller
  job:    arka plan dongu/zamanlayici/cron/systemd timer -> calistirdigi fonksiyon
  page:   Next.js sayfalari -> dosya
  test:   test dosyasi -> test ettigi uretim dosyasi/sembol
  domain: is alani (Hasta, Lead, Teklif...) -> dosya/tablo/route
  entry:  giris noktalari
Kullanim:
  python3 -I katman.py <repo> [--graph PATH]          # katmani grafa ekle (eski katmani siler)
  python3 -I katman.py <repo> --etiket --rapor        # topluluk adlari + KOD_HARITASI.md
Guvenlik: dosyalardan yalniz ad/yol/satir alinir; kod, yorum, string degeri, sir degeri grafa yazilmaz.
"""
from __future__ import annotations

import ast
import collections
import json
import os
import re
import sys
from pathlib import Path

KAYNAK = "katman"
KOD_UZANTI = (".py", ".ts", ".tsx", ".js", ".mjs", ".jsx", ".sh", ".sql")
ATLA_DIZIN = re.compile(r"(^|/)(node_modules|\.next|dist|build|coverage|\.cache|venv|\.venv|__pycache__|graphify-out|"
                        r"yedek[^/]*|sunucu_yedek|_to_delete|Obsidian|Belgeler|documents|gelen_kutusu|kopru|veri|data|drizzle/meta)(/|$)")
ATLA_DOSYA = re.compile(r"(^|/)\.env|secret|token[^/]*\.json$|\.min\.js$|package-lock\.json$")
KENDISI = re.compile(r"(^|/)(moduller|scripts)/graphify/")   # bu modulun kendi desenleri sahte eslesme uretmesin
SQL_ANAHTAR = {"if", "for", "not", "exists", "as", "with", "select", "from", "where", "set", "values", "table", "the", "a", "an",
               "temp", "temporary", "into", "on", "by", "and", "or", "each", "row", "all", "only", "lateral", "unnest", "jsonb_each",
               "json_each", "generate_series", "dual", "sqlite_master", "information_schema", "pg_catalog", "blogu"}
TEST_DOSYA = re.compile(r"(^|/)(tests?/|__tests__/)|(^|/)test_[^/]+\.py$|_test\.py$|\.(test|spec)\.[tj]sx?$")
GIZLI_AD = re.compile(r"KEY|TOKEN|SECRET|PASS|SIFRE|PRIVATE|CREDENTIAL|DSN|WEBHOOK_SECRET|_URL_OWNER", re.I)

# --------------------------------------------------------------------------- dis entegrasyon kurallari
# (ad, aciklama, satir deseni) — satir deseni import/URL/env adi/SDK cagrisi uzerinde calisir.
ENTEGRASYON = [
    ("anthropic", "Anthropic Claude API (LLM)", r"\bimport anthropic\b|from anthropic\b|@anthropic-ai/sdk|api\.anthropic\.com|ANTHROPIC_[A-Z_]+|\.messages\.create\("),
    ("openai", "OpenAI API", r"\bfrom openai\b|\bimport openai\b|['\"]openai['\"]|api\.openai\.com|OPENAI_[A-Z_]+"),
    ("gemini", "Google Gemini / Live API", r"generativelanguage\.googleapis|GEMINI_[A-Z_]+|@google/genai|google\.genai"),
    ("meta", "Meta Graph API (Facebook/Instagram/Lead Ads/CAPI)", r"graph\.facebook\.com|META_[A-Z_]+|FB_[A-Z_]+|INSTAGRAM_[A-Z_]+|facebook\.com/tr"),
    ("whatsapp-evolution", "Evolution API (WhatsApp)", r"EVOLUTION_[A-Z_]+|https?://evolution|/message/send(Text|Media|WhatsAppAudio)|/chat/find"),
    ("whatsapp-cloud", "WhatsApp Cloud API (resmi)", r"WHATSAPP_CLOUD|WA_CLOUD|WA_PHONE_ID|whatsapp_cloud"),
    ("telegram", "Telegram Bot API / Telethon", r"api\.telegram\.org|\btelethon\b|TELEGRAM_[A-Z_]+|\bTG_[A-Z_]+"),
    ("google", "Google APIs (Sheets/GA4/Drive/Search Console)", r"googleapis\.com|GOOGLE_[A-Z_]+|\bGA4_[A-Z_]+|google_sheets|SHEETS_[A-Z_]+|GSC_[A-Z_]+"),
    ("ikas", "ikas e-ticaret API (Tadelya)", r"myikas\.com|IKAS_[A-Z_]+"),
    ("n8n", "n8n otomasyon", r"https?://n8n\b|N8N_[A-Z_]+"),
    ("ntfy", "ntfy bildirim", r"\bntfy\b|NTFY_[A-Z_]+"),
    ("langfuse", "Langfuse LLM gozlem", r"langfuse|LANGFUSE_[A-Z_]+"),
    ("github", "GitHub", r"api\.github\.com|GITHUB_[A-Z_]+|\bGH_TOKEN\b"),
    ("clinic-os", "Clinic OS paneli (botun kopru API'si)", r"\bSAAS_URL\b|\bCLINICOS_[A-Z_]+|\bCOS_[A-Z_]+|clinicospanel\.com|SAAS_KOPRU"),
    ("cloudflare", "Cloudflare Workers", r"workers\.dev|CLOUDFLARE_[A-Z_]+|\bCF_[A-Z_]+"),
    ("openstreetmap", "OpenStreetMap / Overpass", r"openstreetmap\.org|overpass"),
    ("hermes", "Hermes ajan motoru", r"https?://hermes|HERMES_[A-Z_]+"),
    ("openclaw", "OpenClaw ajan motoru", r"https?://openclaw|OPENCLAW_[A-Z_]+"),
    ("ses-servisi", "Ses servisi (STT/TTS)", r"https?://ses\b|SES_URL|whisper|ELEVENLABS_[A-Z_]+"),
    ("postgres", "PostgreSQL", r"\bpsycopg2?\b|\basyncpg\b|from ['\"]pg['\"]|DATABASE_URL|drizzle-orm/node-postgres"),
    ("sqlite", "SQLite", r"\bsqlite3\b"),
    ("redis", "Redis", r"\bredis\b|REDIS_[A-Z_]+"),
    ("email", "E-posta (SMTP/Resend/IMAP)", r"\bsmtplib\b|\bimaplib\b|SMTP_[A-Z_]+|RESEND_[A-Z_]+|nodemailer|IMAP_[A-Z_]+"),
    ("odeme", "Odeme saglayicisi", r"\bimport stripe\b|from stripe\b|['\"]stripe['\"]|STRIPE_[A-Z_]+|iyzipay|PAYTR_[A-Z_]+"),
    ("solana", "Solana / kripto", r"@solana/|\bfrom solana\b|\bimport solana\b|SOLANA_[A-Z_]+|HELIUS_[A-Z_]+|api\.helius|quote-api\.jup\.ag"),
    ("borsa-veri", "Borsa veri saglayicilari", r"yfinance|alpaca|polygon\.io|finnhub|ALPACA_[A-Z_]+|FINNHUB_[A-Z_]+|twelvedata"),
]
ENT_RE = [(a, d, re.compile(p)) for a, d, p in ENTEGRASYON]
LLM_CAGRI = re.compile(r"\.messages\.create\(|\.messages\.stream\(|chat\.completions\.create|generateContent|ask_agent\(|claude_cagir|llm_cagir|_ask_claude|anthropic\.")

# --------------------------------------------------------------------------- is alanlari (domain)
DOMAIN = [
    ("Hasta", r"hasta|patient|profil|lead_profile|leadprofile|portal"),
    ("Lead", r"\blead|aday|lost.?lead|pipeline|funnel"),
    ("Teklif", r"teklif|quote|quotation|offer|fiyat|price|pricing"),
    ("Tedavi plani", r"tedavi|treatment|tooth|dis_plan|plan_video|implant|clinical|klinik_on"),
    ("Randevu", r"randevu|appointment|waitlist|takvim|calendar|slot"),
    ("Doktor", r"doktor|doctor|hekim|dentist"),
    ("Odeme", r"odeme|payment|invoice|fatura|tahsil|deposit|kapora"),
    ("Klinik / Tenant", r"tenant|clinic(?!al)|klinik(?!_on)|white.?label"),
    ("Kimlik / Yetki", r"auth|login|session|oturum|sifre|password|totp|2fa|permission|yetki|role|izin|token"),
    ("Mesajlasma", r"whatsapp|evolution|mesaj|message|inbox|dm\b|instagram_dm|telegram|tg_|channel|kanal"),
    ("Otomasyon / Is", r"otomasyon|automation|zamanli|scheduler|job|worker|cron|loop|outbox"),
    ("Ajan / AI", r"ajan|agent|beceri|skill|llm|claude|anthropic|openai|copilot|assistant|asistan|bafici|jarvis|hermes|openclaw|prompt"),
    ("Reklam / Pazarlama", r"reklam|ads?_|meta_lead|capi|pazarlama|marketing|kampanya|campaign|gtm|ga4|seo"),
    ("Pazar / Firsat zekasi", r"pazar|market.?intel|kesif|discovery|firsat|opportunity"),
    ("Borsa", r"borsa|trading|hisse|stock|portfoy"),
    ("Tadelya / E-ticaret", r"tadelya|ikas|siparis|order|urun|product|stok"),
    ("Price On / Alisa", r"alisa|priceon|price_on"),
    ("Project OS / Ajans", r"projeos|proje_os|project.?os|ajans|agency|gorev|karar"),
    ("Ops / Yedek / Izleme", r"yedek|backup|restore|saglik|health|izleme|monitor|denetim|audit|nobetci|olay|incident|yayin|deploy"),
    ("Konusma zekasi", r"konusma_zeka|conversation.?intel|scorecard|objection|itiraz"),
    ("Belge / Medya", r"document|belge|media|medya|foto|photo|upload|xray|rontgen|video|visual"),
    ("Bildirim", r"notify|bildirim|notification|alert|uyari"),
]
DOMAIN_RE = [(a, re.compile(p, re.I)) for a, p in DOMAIN]

AUTH_AD = re.compile(r"(auth|yetki|izinli|token_ok|saas_ok|panel_ok|require|assert_?can|current_?user|getsession|withtenant|"
                     r"oturum|_gerek$|or_login|login_required|csrf|verify\w*token|_dogrula|^ic_ok$|_ok$|izin|guard|gizli_ok|imza|local_request|_ctx$|ctx_or)", re.I)
AUTH_HARIC = re.compile(r"rate|oturum_ac|auth_sayfa", re.I)


# =========================================================================== yardimcilar
def norm_id(s: str) -> str:
    """Graphify'in normalize_id kurali (graphify/ids.py) ile ayni: graf yeniden yuklendiginde id degismez/carpismaz."""
    import unicodedata
    cur = s
    for _ in range(6):
        nxt = unicodedata.normalize("NFKC", cur.casefold())
        if nxt == cur:
            break
        cur = nxt
    cur = re.sub(r"[^\w]+", "_", cur, flags=re.UNICODE)
    return re.sub(r"_+", "_", cur).strip("_")


def _rel(root: Path, p: Path) -> str:
    return p.relative_to(root).as_posix()


def kod_dosyalari(root: Path) -> list[str]:
    out = []
    for p in root.rglob("*"):
        if not p.is_file():
            continue
        r = _rel(root, p)
        if r.startswith(".git/") or ATLA_DIZIN.search(r) or ATLA_DOSYA.search(r):
            continue
        if KENDISI.search(r):
            continue
        if r.endswith(KOD_UZANTI) or p.name.endswith((".timer", ".service")) or r.startswith(".github/workflows/"):
            out.append(r)
    return sorted(out)


def _oku(root: Path, r: str) -> str:
    try:
        return (root / r).read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""


def _satir(loc) -> int:
    m = re.match(r"L(\d+)", str(loc or ""))
    return int(m.group(1)) if m else 0


def _kisa(label: str) -> str:
    return re.sub(r"\(\)$", "", (label or "").lstrip("."))


class Graf:
    def __init__(self, data: dict):
        self.d = data
        if "links" not in data and "edges" in data:   # extract --no-cluster ciktisi
            data["links"] = data.pop("edges")
        data["nodes"] = [n for n in data["nodes"] if n.get("_origin") != KAYNAK]
        ids = {n["id"] for n in data["nodes"]}
        data["links"] = [e for e in data.get("links", []) if e.get("_origin") != KAYNAK and e["source"] in ids and e["target"] in ids]
        self.nodes = {n["id"]: n for n in data["nodes"]}
        self.edge_set = set()
        self.dosya_dugum: dict[str, str] = {}
        self.semboller: dict[str, list] = collections.defaultdict(list)   # dosya -> [(satir, id, ad)]
        self.ad_index: dict[str, list] = collections.defaultdict(list)    # kisa ad -> [id]
        for n in data["nodes"]:
            sf = n.get("source_file") or ""
            if not sf or n.get("file_type") != "code":
                continue
            lb = n.get("label") or ""
            if lb and _satir(n.get("source_location")) <= 1 and (sf == lb or sf.endswith("/" + lb)):
                self.dosya_dugum.setdefault(sf, n["id"])
                continue
            if _satir(n.get("source_location")) > 0:   # fonksiyon, sinif, metod ve TS const (arrow/sarmalayici) sembolleri
                self.semboller[sf].append((_satir(n.get("source_location")), n["id"], _kisa(n.get("label", ""))))
                self.ad_index[_kisa(n.get("label", ""))].append(n["id"])
        for v in self.semboller.values():
            v.sort()
        self.eklenen_dugum = 0
        self.eklenen_kenar = 0
        self.idmap: dict[str, str] = {}   # ham katman id'si -> normalize id
        self.proje = ""
        self.kok = Path(".")

    def c(self, x: str) -> str:
        return self.idmap.get(x, x)

    # ----- dugum/kenar
    def dugum(self, nid: str, label: str, kategori: str, **ek) -> str:
        ham = nid
        if nid in self.idmap:
            nid = self.idmap[nid]
        elif nid not in self.nodes:   # yeni katman dugumu: graphify kuralinda normalize, carpisirsa sonek
            taban = norm_id(nid)
            nid, i = taban, 2
            while nid in self.nodes and self.nodes[nid].get("_ham") != ham:
                nid, i = f"{taban}_{i}", i + 1
            self.idmap[ham] = nid
        if nid not in self.nodes:
            sf, loc = ek.pop("source_file", ""), ek.pop("source_location", "")
            n = {"id": nid, "label": label, "norm_label": label.lower(), "file_type": "concept", "_origin": KAYNAK,
                 "kategori": kategori, "_ham": ham, "source_file": "", "source_location": ""}
            if kategori == "dosya":
                n["source_file"], n["source_location"] = sf, loc
            elif sf:   # graphify source_file'li kavram dugumlerini dosyaya gore yeniden adlandirir/birlestirir: konum ayri alanda
                n["konum"] = sf + (":" + loc[1:] if loc.startswith("L") else "")
            n.update({k: v for k, v in ek.items() if v not in (None, "", [], {})})
            self.d["nodes"].append(n)
            self.nodes[nid] = n
            self.eklenen_dugum += 1
        else:
            for k, v in ek.items():
                if k in ("source_file", "source_location"):
                    continue
                if v not in (None, "", [], {}) and k not in self.nodes[nid]:
                    self.nodes[nid][k] = v
        return nid

    def kenar(self, s: str, t: str, rel: str, kesin: bool = True, sf: str = "", satir: int = 0) -> None:
        s, t = self.c(s), self.c(t)
        if not s or not t or s == t or s not in self.nodes or t not in self.nodes:
            return
        k = (s, t, rel)
        if k in self.edge_set:
            return
        self.edge_set.add(k)
        self.d["links"].append({"source": s, "target": t, "relation": rel, "confidence": "EXTRACTED" if kesin else "INFERRED",
                                "confidence_score": 1.0 if kesin else 0.7, "weight": 1.0, "_origin": KAYNAK,
                                "source_file": sf, "source_location": f"L{satir}" if satir else "", "context": ""})
        self.eklenen_kenar += 1

    def dosya(self, sf: str) -> str:
        if sf in self.dosya_dugum:
            return self.dosya_dugum[sf]
        nid = self.dugum("dosya:" + sf, os.path.basename(sf), "dosya", source_file=sf, source_location="L1")
        self.dosya_dugum[sf] = nid
        return nid

    def sembol_satirda(self, sf: str, satir: int, py_aralik: list | None = None) -> tuple[str, bool]:
        """satiri iceren sembol; Python'da kesin aralik, digerlerinde en yakin onceki sembol (INFERRED)."""
        if py_aralik:
            ic = [a for a in py_aralik if a[0] <= satir <= a[1]]
            if ic:
                bas, _, ad = max(ic, key=lambda a: a[0])
                for s, nid, nad in self.semboller.get(sf, []):
                    if s == bas and nad.split(".")[-1] == ad:
                        return nid, True
                for s, nid, nad in self.semboller.get(sf, []):
                    if s == bas:
                        return nid, True
            return self.dosya(sf), True
        once = [x for x in self.semboller.get(sf, []) if x[0] <= satir]
        if once:
            return once[-1][1], False
        return self.dosya(sf), True

    def sembol_adla(self, sf: str, ad: str) -> str | None:
        for _, nid, nad in self.semboller.get(sf, []):
            if nad.split(".")[-1] == ad:
                return nid
        return None


def py_araliklar(kaynak: str) -> list:
    try:
        agac = ast.parse(kaynak)
    except (SyntaxError, ValueError):
        return []
    out = []
    for n in ast.walk(agac):
        if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            out.append((n.lineno, getattr(n, "end_lineno", n.lineno) or n.lineno, n.name))
    return out


def _yol_kalibi(p: str) -> str:
    p = re.sub(r"\{[^}]+\}|\[\.\.\.[^\]]+\]|\[[^\]]+\]|:\w+|\$\{[^}]+\}", "*", p.split("?")[0])
    return re.sub(r"/+$", "", p) or "/"


# =========================================================================== dedektorler
def routes_fastapi(g: Graf, root: Path, sf: str, src: str, aralik: list) -> None:
    try:
        agac = ast.parse(src)
    except (SyntaxError, ValueError):
        return
    sabit = {}   # P = "/saas" gibi on ek sabitleri
    for a in ast.walk(agac):
        if isinstance(a, ast.Assign) and len(a.targets) == 1 and isinstance(a.targets[0], ast.Name) \
                and isinstance(a.value, ast.Constant) and isinstance(a.value.value, str) and a.value.value.startswith("/"):
            sabit.setdefault(a.targets[0].id, a.value.value)

    def yol_coz(x):
        if isinstance(x, ast.Constant) and isinstance(x.value, str):
            return x.value
        if isinstance(x, ast.Name):
            return sabit.get(x.id)
        if isinstance(x, ast.BinOp) and isinstance(x.op, ast.Add):
            a, b = yol_coz(x.left), yol_coz(x.right)
            return a + b if a is not None and b is not None else None
        if isinstance(x, ast.JoinedStr):
            return "".join(v.value if isinstance(v, ast.Constant) else "{x}" for v in x.values)
        return None
    for n in ast.walk(agac):
        if not isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)):
            continue
        for d in n.decorator_list:
            if not (isinstance(d, ast.Call) and isinstance(d.func, ast.Attribute)):
                continue
            meth = d.func.attr.lower()
            if meth not in ("get", "post", "put", "delete", "patch", "api_route", "websocket", "head", "options"):
                continue
            yol = yol_coz(d.args[0]) if d.args else None
            if not yol:
                continue
            yontemler = [meth.upper()]
            if meth == "api_route":
                yontemler = ["ANY"]
                for kw in d.keywords:
                    if kw.arg == "methods" and isinstance(kw.value, (ast.List, ast.Tuple)):
                        yontemler = [e.value for e in kw.value.elts if isinstance(e, ast.Constant)]
            handler = g.sembol_adla(sf, n.name) or g.dosya(sf)
            cagrilar = {c.func.id if isinstance(c.func, ast.Name) else c.func.attr
                        for c in ast.walk(n) if isinstance(c, ast.Call) and isinstance(c.func, (ast.Name, ast.Attribute))}
            for y in yontemler:
                rid = g.dugum(f"route:{y} {yol}", f"{y} {yol}", "route", source_file=sf, source_location=f"L{n.lineno}",
                              yontem=y, yol=yol, kalip=_yol_kalibi(yol), cerceve="fastapi")
                g.kenar(rid, handler, "handled_by", True, sf, n.lineno)
                for c in sorted(cagrilar):
                    if AUTH_AD.search(c) and not AUTH_HARIC.search(c):
                        hedef = g.sembol_adla(sf, c) or next(iter(g.ad_index.get(c, [])), None)
                        if hedef:
                            g.kenar(rid, hedef, "requires_auth", True, sf, n.lineno)
                            g.nodes[rid]["auth"] = True


def routes_next(g: Graf, root: Path, sf: str, src: str) -> None:
    m = re.match(r"(?:src/)?app/(.*)", sf)
    if not m:
        return
    parca = [p for p in m.group(1).split("/")[:-1] if not (p.startswith("(") and p.endswith(")")) and not p.startswith("@")]
    yol = "/" + "/".join(parca)
    ad = os.path.basename(sf)
    if re.match(r"route\.[tj]sx?$", ad):
        for mm in re.finditer(r"export\s+(?:async\s+)?(?:function|const)\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b(?:\s*=\s*(\w+)\s*;)?", src):
            y = mm.group(1)
            satir = src[:mm.start()].count("\n") + 1
            rid = g.dugum(f"route:{y} {yol}", f"{y} {yol}", "route", source_file=sf, source_location=f"L{satir}",
                          yontem=y, yol=yol, kalip=_yol_kalibi(yol), cerceve="next-route")
            hedef = g.sembol_adla(sf, y)
            if mm.group(2):   # export const GET = overviewRoute;  -> import edilen modulde tanimli handler
                im = re.search(r"import\s*\{[^}]*\b" + re.escape(mm.group(2)) + r"\b[^}]*\}\s*from\s*['\"]([^'\"]+)['\"]", src)
                if im:
                    yolu = im.group(1)
                    taban = "src/" + yolu[2:] if yolu.startswith("@/") else os.path.normpath(os.path.join(os.path.dirname(sf), yolu))
                    hsf = next((taban + u for u in (".ts", ".tsx", "/index.ts", ".js") if (root / (taban + u)).exists()), None)
                    if hsf:
                        hsrc = _oku(root, hsf)
                        tm = re.search(r"export\s+(?:const|async\s+function|function)\s+" + re.escape(mm.group(2)) + r"\b", hsrc)
                        if tm:
                            son = hsrc.find("\nexport ", tm.end())
                            _ts_auth(g, rid, hsf, hsrc[tm.start(): son if son > 0 else len(hsrc)])
                            hedef = g.sembol_satirda(hsf, hsrc[:tm.start()].count("\n") + 1)[0]
                            if g.nodes[hedef].get("source_file") != hsf:
                                hedef = g.dosya(hsf)
            g.kenar(rid, hedef or g.dosya(sf), "handled_by", True, sf, satir)
            _ts_auth(g, rid, sf, src)
    elif re.match(r"(page|layout)\.[tj]sx?$", ad):
        tur = "page" if ad.startswith("page") else "layout"
        pid = g.dugum(f"{tur}:{yol}", f"{tur} {yol}", tur, source_file=sf, source_location="L1", yol=yol, kalip=_yol_kalibi(yol))
        g.kenar(pid, g.dosya(sf), "rendered_by", True, sf, 1)


TS_AUTH = re.compile(r"\b(assertCan\w*|requireUser|requireRole\w*|requireClinic\w*|requirePlatform\w*|requireAuth\w*|getCurrentUser|"
                     r"getSession|withTenant|requireSession|requirePortal\w*|verify\w*(?:Token|Signature)\w*|with\w*Ctx|apiRoute|"
                     r"\w*(?:[Ff]orm|[Jj]son)Action\w*|ops\w*Action|userTenantRunner|requireOps\w*|getPortalSession|withPatientCtx)\s*[(<]")


def _ts_auth(g: Graf, rid: str, sf: str, src: str) -> None:
    for c in sorted(set(re.findall(TS_AUTH, src))):
        g.nodes[rid]["auth"] = True
        g.nodes[rid].setdefault("auth_kanit", c)
        hedef = next(iter(g.ad_index.get(c, [])), None)
        if hedef:
            g.kenar(rid, hedef, "requires_auth", True, sf)


def astro_netlify(g: Graf, root: Path) -> None:
    """Astro sayfalari (src/pages/**/*.astro) ve Netlify fonksiyonlari (netlify/functions/*)."""
    for p in sorted(root.glob("src/pages/**/*.astro")):
        sf = _rel(root, p)
        yol = "/" + re.sub(r"(^|/)index$", "", sf[len("src/pages/"):-len(".astro")])
        pid = g.dugum(f"page:{yol}", f"page {yol}", "page", source_file=sf, source_location="L1", yol=yol, kalip=_yol_kalibi(yol), cerceve="astro")
        g.kenar(pid, g.dosya(sf), "rendered_by", True, sf, 1)
    for p in sorted(list(root.glob("netlify/functions/*.*")) + list(root.glob("netlify/edge-functions/*.*"))):
        if p.suffix not in (".js", ".mjs", ".ts"):
            continue
        sf = _rel(root, p)
        yol = ("/.netlify/functions/" if "/functions/" in sf else "/edge/") + p.stem
        rid = g.dugum(f"route:ANY {yol}", f"ANY {yol}", "route", source_file=sf, source_location="L1", yontem="ANY", yol=yol,
                      kalip=_yol_kalibi(yol), cerceve="netlify-function")
        g.kenar(rid, g.dosya(sf), "handled_by", True, sf, 1)


_SAR_CACHE: dict = {}


def _sarmalayici_yetkili(g: "Graf", sf: str, src: str, ad: str) -> bool:
    """import { ad } from "@/x" -> x dosyasinda ad tanimi govdesinde oturum/yetki kontrolu var mi."""
    im = re.search(r"import\s*\{[^}]*\b" + re.escape(ad) + r"\b[^}]*\}\s*from\s*['\"]([^'\"]+)['\"]", src)
    if not im:
        return False
    yolu = im.group(1)
    taban = "src/" + yolu[2:] if yolu.startswith("@/") else os.path.normpath(os.path.join(os.path.dirname(sf), yolu))
    anahtar = (taban, ad)
    if anahtar not in _SAR_CACHE:
        sonuc = False
        for u in (".ts", ".tsx", "/index.ts", ".js"):
            p = g.kok / (taban + u)
            if p.exists():
                h = p.read_text(encoding="utf-8", errors="replace")
                tm = re.search(r"export\s+(?:async\s+)?(?:function|const)\s+" + re.escape(ad) + r"\b", h)
                if tm:
                    son = h.find("\nexport ", tm.end())
                    sonuc = bool(TS_AUTH.search(h[tm.start(): son if son > 0 else len(h)]))
                break
        _SAR_CACHE[anahtar] = sonuc
    return _SAR_CACHE[anahtar]


def server_actions(g: Graf, sf: str, src: str) -> None:
    if not re.search(r"^\s*['\"]use server['\"]", src[:400], re.M):
        return
    yerel_auth = set()
    bloklar = list(re.finditer(r"^(?:export\s+)?(?:async\s+)?function\s+(\w+)|^(?:export\s+)?const\s+(\w+)\s*=", src, re.M))
    for i, b in enumerate(bloklar):
        govde = src[b.end(): bloklar[i + 1].start() if i + 1 < len(bloklar) else len(src)]
        if not src[b.start():b.start() + 6] == "export" and TS_AUTH.search(govde):
            yerel_auth.add(b.group(1) or b.group(2))
    for mm in re.finditer(r"export\s+async\s+function\s+(\w+)|export\s+const\s+(\w+)\s*=\s*(?:\w+Action\w*|async)\b", src):
        ad = mm.group(1) or mm.group(2)
        satir = src[:mm.start()].count("\n") + 1
        rid = g.dugum(f"route:ACTION {sf}#{ad}", f"ACTION {ad}", "route", source_file=sf, source_location=f"L{satir}",
                      yontem="ACTION", yol=f"{sf}#{ad}", cerceve="next-server-action")
        g.kenar(rid, g.sembol_adla(sf, ad) or g.dosya(sf), "handled_by", True, sf, satir)
        # yetki: govdedeki kontrol ya da sarmalayici (export const x = formAction(...)), bir sonraki export'a kadar
        son = src.find("\nexport ", mm.end())
        govde = src[mm.start(): son if son > 0 else len(src)]
        _ts_auth(g, rid, sf, govde)
        sar = re.match(r"export\s+const\s+\w+\s*=\s*(\w+)\s*[(<]", govde)
        if sar and not g.nodes[rid].get("auth") and _sarmalayici_yetkili(g, sf, src, sar.group(1)):
            g.nodes[rid]["auth"] = True   # import edilen sarmalayici (orn. defineAction) kendi icinde oturum/yetki kontrol ediyor
            g.nodes[rid].setdefault("auth_kanit", sar.group(1))
        for yardimci in yerel_auth:   # ayni dosyadaki yetki kontrollu yardimci (orn. withRunner -> getCurrentUser)
            if re.search(r"\b" + re.escape(yardimci) + r"\s*[(<]", govde):
                g.nodes[rid]["auth"] = True
                g.nodes[rid].setdefault("auth_kanit", yardimci)


def env_ve_entegrasyon(g: Graf, sf: str, src: str, aralik: list | None) -> None:
    env_re = re.compile(r"os\.(?:getenv|environ\.get)\(\s*['\"]([A-Z][A-Z0-9_]+)['\"]|os\.environ\[\s*['\"]([A-Z][A-Z0-9_]+)['\"]\s*\]|"
                        r"process\.env\.([A-Z][A-Z0-9_]+)|process\.env\[\s*['\"]([A-Z][A-Z0-9_]+)['\"]\s*\]|"
                        r"\b_env\(\s*['\"]([A-Z][A-Z0-9_]+)['\"]")
    py = sf.endswith(".py")
    for i, line in enumerate(src.splitlines(), 1):
        if sf.endswith(".sh") or sf.endswith(".sql"):
            break
        for m in env_re.finditer(line):
            ad = next(x for x in m.groups() if x)
            sym, kesin = g.sembol_satirda(sf, i, aralik if py else None)
            eid = g.dugum(f"env:{ad}", ad, "env", gizli=bool(GIZLI_AD.search(ad)))
            g.kenar(sym, eid, "reads_env", kesin, sf, i)
        for ent, acik, rx in ENT_RE:
            if ent == g.proje:   # projenin kendi adi (orn. clinic-os icinde CLINICOS_*) dis entegrasyon degildir
                continue
            if rx.search(line):
                sym, kesin = g.sembol_satirda(sf, i, aralik if py else None)
                xid = g.dugum(f"ext:{ent}", ent, "entegrasyon", aciklama=acik)
                g.kenar(sym, xid, "integrates", kesin, sf, i)
        if LLM_CAGRI.search(line):
            sym, kesin = g.sembol_satirda(sf, i, aralik if py else None)
            g.dugum("ext:llm", "LLM cagrisi", "entegrasyon", aciklama="Model cagiran semboller (Anthropic/OpenAI/Gemini)")
            g.kenar(sym, "ext:llm", "calls_llm", kesin, sf, i)


def env_entegrasyon_bagla(g: Graf) -> None:
    """env -> entegrasyon (ad uzerinden)."""
    for nid, n in list(g.nodes.items()):
        if n.get("kategori") == "env":
            for ent, _, rx in ENT_RE:
                if ent != g.proje and rx.search(n["label"]):
                    g.kenar(nid, g.dugum(f"ext:{ent}", ent, "entegrasyon"), "configures", True)


# ----- Python modul takma adi cagrilari (import agents as A; A.f(...) / to_thread(A.f, ...))
def _modul_dosyasi(root: Path, sf: str, modul: str, dosya_set: set) -> str | None:
    parca = modul.replace(".", "/")
    adaylar = [str(Path(sf).parent / f"{parca}.py"), f"{parca}.py", f"webhook/{parca}.py",
               str(Path(sf).parent / parca / "__init__.py"), f"{parca}/__init__.py", f"webhook/{parca}/__init__.py"]
    for a in adaylar:
        a = os.path.normpath(a)
        if a in dosya_set:
            return a
    return None


def modul_alias_kenarlari(g: Graf, root: Path, dosyalar: list[str]) -> None:
    dosya_set = {d for d in dosyalar if d.endswith(".py")}
    tanim_cache: dict[str, dict] = {}

    def tanimlar(hedef: str) -> dict:
        if hedef not in tanim_cache:
            try:
                agac = ast.parse(_oku(root, hedef))
                tanim_cache[hedef] = {n.name: n.lineno for n in agac.body if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef))}
            except (SyntaxError, ValueError):
                tanim_cache[hedef] = {}
        return tanim_cache[hedef]

    for sf in sorted(dosya_set):
        src = _oku(root, sf)
        try:
            agac = ast.parse(src)
        except (SyntaxError, ValueError):
            continue
        alias = {}
        for n in ast.walk(agac):
            if isinstance(n, ast.Import):
                for a in n.names:
                    hedef = _modul_dosyasi(root, sf, a.name, dosya_set)
                    if hedef and hedef != sf:
                        alias[a.asname or a.name.split(".")[0]] = hedef
            elif isinstance(n, ast.ImportFrom) and n.module is None:
                for a in n.names:
                    hedef = _modul_dosyasi(root, sf, a.name, dosya_set)
                    if hedef and hedef != sf:
                        alias[a.asname or a.name] = hedef
        if not alias:
            continue
        aralik = py_araliklar(src)
        cagri_func = {id(n.func) for n in ast.walk(agac) if isinstance(n, ast.Call)}
        for n in ast.walk(agac):
            if not (isinstance(n, ast.Attribute) and isinstance(n.value, ast.Name) and n.value.id in alias):
                continue
            hedef = alias[n.value.id]
            satir_t = tanimlar(hedef).get(n.attr)
            if not satir_t:
                continue
            hid = next((nid for s_, nid, ad in g.semboller.get(hedef, []) if s_ == satir_t), None)
            if not hid:
                continue
            kaynak, _ = g.sembol_satirda(sf, n.lineno, aralik)
            g.kenar(kaynak, hid, "calls" if id(n) in cagri_func else "references", True, sf, n.lineno)


# ----- tablolar
SQL_CREATE = re.compile(r"CREATE\s+(?:UNLOGGED\s+)?TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[\"`]?(?:\w+\.)?([a-zA-Z_][\w]*)", re.I)
SQL_FK = re.compile(r"REFERENCES\s+[\"`]?(?:\w+\.)?([a-zA-Z_]\w*)", re.I)
SQL_YAZ = re.compile(r"\b(?:INSERT\s+(?:OR\s+\w+\s+)?INTO|UPDATE|DELETE\s+FROM|REPLACE\s+INTO|UPSERT\s+INTO)\s+[\"`]?(?:\w+\.)?([a-zA-Z_]\w*)", re.I)
SQL_OKU = re.compile(r"\b(?:FROM|JOIN)\s+[\"`]?(?:\w+\.)?([a-zA-Z_]\w*)", re.I)
PG_TABLE = re.compile(r"export\s+const\s+(\w+)\s*=\s*pgTable\(\s*['\"](\w+)['\"]")
DRZ_YAZ = re.compile(r"\.(insert|update|delete)\(\s*(\w+)\s*\)")
DRZ_OKU = re.compile(r"\.(from|innerJoin|leftJoin|rightJoin|fullJoin)\(\s*(\w+)\b|\.query\.(\w+)\.find")


def tablolari_topla(root: Path, dosyalar: list[str]) -> tuple[dict, dict]:
    """(sql_tablolar: ad->(dosya,satir), drizzle: degisken->(tablo,dosya,satir))"""
    sql_t, drz = {}, {}
    for sf in dosyalar:
        if not sf.endswith((".sql", ".py", ".ts", ".js", ".sh")):
            continue
        src = _oku(root, sf)
        for m in SQL_CREATE.finditer(src):
            if m.group(1).lower() not in SQL_ANAHTAR and len(m.group(1)) > 1:
                sql_t.setdefault(m.group(1).lower(), (sf, src[:m.start()].count("\n") + 1))
        for m in PG_TABLE.finditer(src):
            drz[m.group(1)] = (m.group(2).lower(), sf, src[:m.start()].count("\n") + 1)
            sql_t.setdefault(m.group(2).lower(), (sf, src[:m.start()].count("\n") + 1))
    return sql_t, drz


def tablo_katmani(g: Graf, root: Path, dosyalar: list[str], sql_t: dict, drz: dict) -> None:
    var_ad = {t: v for v, (t, _, _) in drz.items()}
    ayni = collections.defaultdict(list)   # tablo adi -> AST dugumleri (.sql tablosu, drizzle const)
    for nid, n in g.nodes.items():
        if n.get("file_type") == "code" and n.get("source_file", "").endswith((".sql", ".ts", ".py")):
            lb = _kisa(n.get("label", "")).lower()
            if lb in sql_t and (n["source_file"].endswith(".sql") or n["source_file"] == sql_t[lb][0]):
                ayni[lb].append(nid)
    for t, v in var_ad.items():
        for nid in g.ad_index.get(v, []):
            if g.nodes[nid].get("source_file") == drz[v][1]:
                ayni[t].append(nid)
    for ad, (sf, satir) in sql_t.items():
        tid = g.dugum(f"table:{ad}", ad, "tablo", source_file=sf, source_location=f"L{satir}")
        g.kenar(tid, g.dosya(sf), "defined_in", True, sf, satir)
        for nid in ayni.get(ad, [])[:12]:
            g.kenar(tid, nid, "same_as", True)
    # FK: CREATE TABLE blogu ve pgTable blogu icinden
    for sf in dosyalar:
        if not sf.endswith((".sql", ".py", ".ts")):
            continue
        src = _oku(root, sf)
        for m in SQL_CREATE.finditer(src):
            blok = src[m.end(): src.find(";", m.end()) if src.find(";", m.end()) > 0 else m.end() + 4000]
            for fk in SQL_FK.findall(blok):
                if fk.lower() in sql_t:
                    g.kenar(f"table:{m.group(1).lower()}", f"table:{fk.lower()}", "fk", True, sf)
        for m in PG_TABLE.finditer(src):
            son = src.find("\nexport const", m.end())
            blok = src[m.end(): son if son > 0 else len(src)]
            for ref in re.findall(r"references\(\s*\(\)\s*(?::\s*\w+\s*)?=>\s*(\w+)\.", blok):
                if ref in drz:
                    g.kenar(f"table:{m.group(2).lower()}", f"table:{drz[ref][0]}", "fk", True, sf)
    # okuyan/yazan semboller
    for sf in dosyalar:
        if sf.endswith((".sql", ".sh")) or TEST_DOSYA.search(sf):
            continue
        src = _oku(root, sf)
        py = sf.endswith(".py")
        aralik = py_araliklar(src) if py else None
        if py:
            try:
                stringler = [(n.lineno, n.value) for n in ast.walk(ast.parse(src)) if isinstance(n, ast.Constant) and isinstance(n.value, str)]
            except (SyntaxError, ValueError):
                stringler = []
            for satir, s in stringler:
                if not re.search(r"\b(SELECT|INSERT|UPDATE|DELETE|CREATE)\b", s, re.I):
                    continue
                _sql_kenar(g, sf, satir, s, sql_t, aralik)
        else:
            for i, line in enumerate(src.splitlines(), 1):
                if re.search(r"\b(SELECT|INSERT INTO|UPDATE|DELETE FROM)\b", line):
                    _sql_kenar(g, sf, i, line, sql_t, None)
                for m in DRZ_YAZ.finditer(line):
                    if m.group(2) in drz:
                        sym, kesin = g.sembol_satirda(sf, i)
                        g.kenar(sym, f"table:{drz[m.group(2)][0]}", "writes", kesin, sf, i)
                for m in DRZ_OKU.finditer(line):
                    v = m.group(2) or m.group(3)
                    if v in drz:
                        sym, kesin = g.sembol_satirda(sf, i)
                        g.kenar(sym, f"table:{drz[v][0]}", "reads", kesin, sf, i)


def _sql_kenar(g: Graf, sf: str, satir: int, s: str, sql_t: dict, aralik) -> None:
    sym, kesin = g.sembol_satirda(sf, satir, aralik)
    for t in SQL_YAZ.findall(s):
        if t.lower() in sql_t:
            g.kenar(sym, f"table:{t.lower()}", "writes", kesin, sf, satir)
    for t in SQL_OKU.findall(s):
        if t.lower() in sql_t:
            g.kenar(sym, f"table:{t.lower()}", "reads", kesin, sf, satir)


# ----- frontend -> API
PY_ISTEK = re.compile(r"""\b(?:get|post|put|patch|delete|request|saas_call|bot_call|_api|api_call|istek)\(\s*(?:["'](?:GET|POST|PUT|PATCH|DELETE)["']\s*,\s*)?(?:\w+\s*\+\s*)?f?["'](/[\w/{}\-.]+)""")
FETCH = re.compile(r"""\b(?:fetch|api|apiFetch|axios\.(?:get|post|put|patch|delete)|_api|istek|getJSON|postJSON|req)\(\s*[`'"]([^`'"]*?)[`'"?]""")


def istemci_api(g: Graf, root: Path, dosyalar: list[str]) -> None:
    # server action tuketicileri: action'i import eden / cagiran semboller
    handler = {e["target"]: e["source"] for e in g.d["links"] if e.get("_origin") == KAYNAK and e["relation"] == "handled_by"
               and g.nodes[e["source"]].get("cerceve") == "next-server-action"}
    for e in list(g.d["links"]):
        if e["target"] in handler and e["relation"] in ("imports_from", "imports", "calls", "references", "uses") \
                and g.nodes.get(e["source"], {}).get("source_file") != g.nodes[e["target"]].get("source_file"):
            g.kenar(e["source"], handler[e["target"]], "calls_api", True, e.get("source_file", ""))
    routes = [(n["kalip"], nid) for nid, n in g.nodes.items() if n.get("kategori") == "route" and n.get("kalip")]
    if not routes:
        return
    for sf in dosyalar:
        if not sf.endswith((".js", ".mjs", ".ts", ".tsx", ".jsx", ".html", ".py")) or TEST_DOSYA.search(sf):
            continue
        src = _oku(root, sf)
        py = sf.endswith(".py")
        aralik = py_araliklar(src) if py else None
        desen = PY_ISTEK if py else FETCH
        for i, line in enumerate(src.splitlines(), 1):
            if py and line.lstrip().startswith("@"):   # route tanimi (dekorator) istemci cagrisi degildir
                continue
            for m in desen.finditer(line):
                yol = re.sub(r"^\$\{[^}]*\}", "", m.group(1))
                if not yol.startswith("/"):
                    continue
                kal = _yol_kalibi(yol)
                eslesen = [nid for k, nid in routes if _kalip_eslesir(k, kal)]
                if not eslesen:
                    continue
                sym, kesin = g.sembol_satirda(sf, i, aralik)
                for nid in eslesen[:4]:
                    if (g.nodes[nid].get("konum") or "").split(":")[0] == sf and not py:
                        continue
                    g.kenar(sym, nid, "calls_api", False, sf, i)


def _kalip_eslesir(route: str, istek: str) -> bool:
    """Tam eslesme; ya da istemci on ek (orn. P='/saas') olmadan cagiriyorsa route'un son parcalariyla eslesme."""
    a, b = route.strip("/").split("/"), istek.strip("/").split("/")
    if len(a) < len(b) or not b or b == [""]:
        return False
    if len(a) > len(b):
        if len(a) - len(b) > 1 or b[0] in ("*", ""):
            return False
        a = a[len(a) - len(b):]
    if not any(x == y and x != "*" for x, y in zip(a, b)):   # en az bir sabit parca birebir eslesmeli
        return False
    return all(x == y or x == "*" or y == "*" for x, y in zip(a, b))


# ----- isler / zamanlayicilar
def isler(g: Graf, root: Path, dosyalar: list[str]) -> None:
    for sf in dosyalar:
        src = _oku(root, sf)
        if sf.endswith(".py") and ("_spawn(" in src or "_every(" in src):
            try:
                agac = ast.parse(src)
            except (SyntaxError, ValueError):
                agac = None
            for n in (agac.body if agac else []):
                if not (isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)) and n.name in ("lifespan", "background_loop", "main")):
                    continue
                for c in ast.walk(n):
                    if not (isinstance(c, ast.Call) and isinstance(c.func, ast.Name)):
                        continue
                    if c.func.id == "_spawn" and c.args and isinstance(c.args[0], ast.Call) and isinstance(c.args[0].func, ast.Name):
                        fn = c.args[0].func.id
                        _is(g, sf, c.lineno, fn, fn, "baslangicta surekli dongu (lifespan)")
                    if c.func.id == "_every" and len(c.args) >= 3:
                        ad = c.args[0].value if isinstance(c.args[0], ast.Constant) else "every"
                        aralik = c.args[1].value if isinstance(c.args[1], ast.Constant) else ""
                        for e in getattr(c.args[2], "elts", []):
                            fn = e.func.id if isinstance(e, ast.Call) and isinstance(e.func, ast.Name) else (e.id if isinstance(e, ast.Name) else "")
                            if fn:
                                _is(g, sf, c.lineno, f"{ad}:{fn}", fn, f"background_loop her {aralik} sn" if aralik != "" else "background_loop periyodik")
        if sf.endswith((".ts", ".js", ".mjs")):
            for m in re.finditer(r"(?:async\s+)?function\s+(\w+Loop)\s*\(", src):
                yorum = ""
                mm = re.search(r"every\s+([\d.]+\s*[a-z]+)\s+[^\n]*" + re.escape(m.group(1).replace("Loop", "")[:5]), src, re.I)
                if mm:
                    yorum = "her " + mm.group(1)
                _is(g, sf, src[:m.start()].count("\n") + 1, m.group(1), m.group(1), yorum or "worker dongusu")
            for m in re.finditer(r"setInterval\(\s*(\w+)\s*,\s*([\w_.*\s]+)\)", src):
                _is(g, sf, src[:m.start()].count("\n") + 1, m.group(1), m.group(1), f"setInterval {m.group(2).strip()}")
        if sf.endswith(".timer"):
            oc = re.search(r"OnCalendar=(.+)", src)
            ad = os.path.basename(sf)
            jid = g.dugum(f"job:systemd:{ad}", f"systemd {ad}", "is", source_file=sf, zamanlama=(oc.group(1).strip() if oc else ""))
            g.kenar(jid, g.dosya(sf), "defined_in", True, sf)
            svc = sf[:-6] + ".service"
            if svc in dosyalar:
                g.kenar(jid, g.dosya(svc), "runs", True, sf)
                ex = re.search(r"ExecStart=(.+)", _oku(root, svc))
                if ex:
                    for p in re.findall(r"[\w./-]+\.(?:sh|py|js|ts)", ex.group(1)):
                        hedef = next((d for d in dosyalar if d.endswith(p.split("/opt/")[-1].split("/", 1)[-1])), None)
                        if hedef:
                            g.kenar(jid, g.dosya(hedef), "runs", False, svc)
        if sf.startswith(".github/workflows/"):
            for m in re.finditer(r"cron:\s*['\"]([^'\"]+)['\"]", src):
                jid = g.dugum(f"job:gh:{sf}:{m.group(1)}", f"GitHub Actions {os.path.basename(sf)}", "is", source_file=sf, zamanlama=m.group(1))
                g.kenar(jid, g.dosya(sf), "defined_in", True, sf)
        if sf.endswith(".sh"):
            for i, line in enumerate(src.splitlines(), 1):
                m = re.match(r"\s*['\"]?((?:[\d*/,-]+\s+){4}[\d*/,-]+)\s+(?:root\s+)?(.*)$", line)
                if m and re.search(r"\.(sh|py)\b|python3|bash", m.group(2)):
                    jid = g.dugum(f"job:cron:{sf}:{i}", f"cron {m.group(1)}", "is", source_file=sf, source_location=f"L{i}", zamanlama=m.group(1))
                    g.kenar(jid, g.dosya(sf), "defined_in", True, sf, i)
                    for p in re.findall(r"([\w-]+\.(?:sh|py))\b", m.group(2)):
                        hedef = next((d for d in dosyalar if d.endswith("/" + p) or d == p), None)
                        if hedef:
                            g.kenar(jid, g.dosya(hedef), "runs", False, sf, i)


def _is(g: Graf, sf: str, satir: int, ad: str, fn: str, yorum: str) -> None:
    jid = g.dugum(f"job:{ad}", f"is {ad}", "is", source_file=sf, source_location=f"L{satir}", zamanlama=yorum)
    hedef = g.sembol_adla(sf, fn) or next(iter(g.ad_index.get(fn, [])), None)
    if hedef:
        g.kenar(jid, hedef, "runs", True, sf, satir)


# ----- testler
def testler(g: Graf) -> None:
    dosya_id = {v: k for k, v in g.dosya_dugum.items()}
    sym_dosya = {nid: n.get("source_file", "") for nid, n in g.nodes.items()}
    say = collections.Counter()
    for e in list(g.d["links"]):
        if e.get("_origin") == KAYNAK or e["relation"] not in ("imports", "imports_from", "calls", "references", "uses"):
            continue
        sfa, sfb = sym_dosya.get(e["source"], ""), sym_dosya.get(e["target"], "")
        if not sfa or not sfb or sfa == sfb or not TEST_DOSYA.search(sfa) or TEST_DOSYA.search(sfb):
            continue
        tid = g.dosya(sfa)
        g.dugum(tid, os.path.basename(sfa), "dosya")
        g.nodes[tid]["test"] = True
        g.kenar(tid, g.dosya(sfb), "tests", True, sfa)
        if e["relation"] == "calls" and say[tid] < 300 and e["target"] not in dosya_id:
            g.kenar(tid, e["target"], "tests", True, sfa)
            say[tid] += 1


# ----- domain
def domainler(g: Graf, dosyalar: list[str]) -> None:
    for ad, rx in DOMAIN_RE:
        did = g.dugum(f"domain:{ad}", ad, "domain")
        for sf in dosyalar:
            if TEST_DOSYA.search(sf):
                continue
            yol_es = bool(rx.search(sf))
            sym_es = sum(1 for _, _, s in g.semboller.get(sf, []) if rx.search(s))
            if yol_es or sym_es >= 3:
                g.kenar(did, g.dosya(sf), "includes", yol_es, sf)
        for nid, n in list(g.nodes.items()):
            if n.get("kategori") in ("tablo", "route", "page", "is") and rx.search(n.get("label", "") + " " + n.get("yol", "")):
                g.kenar(did, nid, "includes", False)


# ----- giris noktalari
def giris_noktalari(g: Graf, root: Path, dosyalar: list[str]) -> None:
    for sf in dosyalar:
        src = _oku(root, sf)
        neden = ""
        if sf.endswith(".py"):
            if re.search(r"^\s*app\s*=\s*FastAPI\(", src, re.M):
                neden = "FastAPI uygulamasi"
            elif re.search(r"^if __name__ == ['\"]__main__['\"]", src, re.M) and not TEST_DOSYA.search(sf):
                neden = "komut satiri (__main__)"
        elif re.search(r"(^|/)(middleware|instrumentation)\.[tj]s$", sf):
            neden = "Next.js " + os.path.basename(sf).split(".")[0]
        elif re.search(r"(^|/)src/worker/main\.[tj]s$|(^|/)worker/index\.[tj]s$", sf):
            neden = "arka plan worker"
        elif re.search(r"(^|/)app/layout\.[tj]sx$", sf):
            neden = "Next.js kok layout"
        elif sf.endswith(".service"):
            neden = "systemd servisi"
        if neden:
            eid = g.dugum(f"entry:{sf}", f"giris {sf}", "giris", source_file=sf, aciklama=neden)
            g.kenar(eid, g.dosya(sf), "starts", True, sf)


# =========================================================================== etiket + rapor
def etiketle(data: dict) -> dict:
    uyeler = collections.defaultdict(list)
    for n in data["nodes"]:
        if n.get("community") is not None:
            uyeler[n["community"]].append(n)
    derece = collections.Counter()
    for e in data["links"]:
        derece[e["source"]] += 1
        derece[e["target"]] += 1
    etiket = {}
    for cid, ns in uyeler.items():
        dirs = collections.Counter("/".join((n.get("source_file") or "").split("/")[:2]) for n in ns if n.get("source_file"))
        kod = [n for n in ns if n.get("file_type") == "code" and n.get("source_file")]
        hub = max(kod, key=lambda n: derece[n["id"]], default=None) or max(ns, key=lambda n: derece[n["id"]])
        yer = dirs.most_common(1)[0][0] if dirs else (hub.get("kategori") or "katman")
        etiket[str(cid)] = f"{yer} · {_kisa(hub.get('label', ''))}"[:80]
    for n in data["nodes"]:
        if n.get("community") is not None:
            n["community_name"] = etiket.get(str(n["community"]), n.get("community_name"))
    return etiket


def _dongu_bul(kenarlar: dict) -> list[list[str]]:
    """Tarjan SCC: dosya import donguleri."""
    idx, low, st, on, out, sayac = {}, {}, [], set(), [], [0]
    sys.setrecursionlimit(100000)

    def sc(v):
        idx[v] = low[v] = sayac[0]; sayac[0] += 1; st.append(v); on.add(v)
        for w in kenarlar.get(v, ()):
            if w not in idx:
                sc(w); low[v] = min(low[v], low[w])
            elif w in on:
                low[v] = min(low[v], idx[w])
        if low[v] == idx[v]:
            comp = []
            while True:
                w = st.pop(); on.discard(w); comp.append(w)
                if w == v:
                    break
            if len(comp) > 1:
                out.append(sorted(comp))
    for v in list(kenarlar):
        if v not in idx:
            sc(v)
    return out


AKIS_REL = {"calls", "indirect_call", "handled_by", "integrates", "calls_llm", "calls_api", "writes", "reads", "runs", "references",
            "uses", "method", "contains", "starts", "requires_auth", "rendered_by"}


def _akis_dosyasi(root: Path) -> dict | None:
    for p in (Path(__file__).resolve().parent / "akislar.json", root / "graphify-akislar.json"):
        if p.exists():
            try:
                return json.loads(p.read_text(encoding="utf-8"))
            except (OSError, ValueError):
                return None
    return None


def _durak_coz(nodes: dict, d: str) -> str | None:
    if d in nodes:
        return d
    for n in nodes.values():
        if n.get("_ham") == d or (n.get("_origin") == KAYNAK and n.get("label") in (d, d.split(":", 1)[-1])):
            return n["id"]
    if norm_id(d) in nodes:
        return norm_id(d)
    if "::" in d:
        sf, ad = d.split("::", 1)
        for nid, n in nodes.items():
            if n.get("source_file") == sf and _kisa(n.get("label", "")).split(".")[-1] == ad and n.get("_callable"):
                return nid
    for nid, n in nodes.items():
        if _kisa(n.get("label", "")) == d and n.get("_callable"):
            return nid
    return None


def _akis_yolu(nodes: dict, giden: dict, duraklar: list) -> tuple[list, str]:
    ids = [_durak_coz(nodes, d) for d in duraklar]
    for d, i in zip(duraklar, ids):
        if i is None:
            return [], f"durak bulunamadi: {d}"
    tam = [ids[0]]
    for a, b in zip(ids, ids[1:]):
        onceki = {a: None}
        kuyruk = collections.deque([(a, 0)])
        while kuyruk:
            v, der = kuyruk.popleft()
            if v == b or der >= 10:
                continue
            for e in giden.get(v, ()):
                if e["relation"] == "contains" and nodes[e["target"]].get("source_file") != nodes[v].get("source_file"):
                    continue   # dosya -> baska dosya kisayolu yaniltici; yalniz dosyanin kendi sembollerine in
                if e["relation"] in AKIS_REL and e["target"] not in onceki:
                    onceki[e["target"]] = v
                    kuyruk.append((e["target"], der + 1))
        if b not in onceki:
            return tam, f"{_kisa(nodes[a]['label'])} → {_kisa(nodes[b]['label'])}"
        yol, v = [], b
        while v is not None and v != a:
            yol.append(v)
            v = onceki[v]
        tam += list(reversed(yol))
    return tam, ""


TEKNOLOJI = [  # (ad, kategori, desen: package.json bagimliligi ya da python import adi)
    ("Next.js", "frontend/fullstack framework", r"^next$"), ("React", "UI", r"^react$"), ("Tailwind CSS", "stil", r"^tailwindcss$"),
    ("Drizzle ORM", "ORM", r"^drizzle-orm$"), ("node-postgres (pg)", "veritabani istemcisi", r"^pg$"), ("Zod", "dogrulama", r"^zod$"),
    ("Vitest", "test", r"^vitest$"), ("Playwright", "e2e test", r"^@?playwright"), ("Three.js", "3B", r"^three$"),
    ("Anthropic SDK", "LLM", r"^@anthropic-ai/sdk$|^anthropic$"), ("OpenAI SDK", "LLM", r"^openai$"), ("sharp", "gorsel isleme", r"^sharp$"),
    ("FastAPI", "backend framework", r"^fastapi$"), ("httpx", "HTTP istemcisi", r"^httpx$"), ("Telethon", "Telegram", r"^telethon$"),
    ("psycopg", "PostgreSQL istemcisi", r"^psycopg2?$"), ("SQLite", "gomulu veritabani", r"^sqlite3$"), ("Pillow", "gorsel isleme", r"^PIL$"),
    ("pydantic", "dogrulama", r"^pydantic$"), ("uvicorn", "ASGI sunucu", r"^uvicorn$"), ("redis", "onbellek", r"^redis$"),
    ("Leaflet", "harita", r"^leaflet$"), ("MediaPipe", "goruntu AI", r"mediapipe"),
]


def _teknoloji(root: Path, kod_dos: list, data: dict) -> list:
    out = []
    uz = collections.Counter(Path(d).suffix for d in kod_dos)
    out.append("- Diller: " + ", ".join(f"{k or '-'} {v}" for k, v in uz.most_common(8)))
    bag = set()
    pj = root / "package.json"
    if pj.exists():
        try:
            j = json.loads(pj.read_text(encoding="utf-8"))
            bag |= set((j.get("dependencies") or {}).keys()) | set((j.get("devDependencies") or {}).keys())
            if (j.get("engines") or {}).get("node"):
                out.append(f"- Calisma ortami: Node {j['engines']['node']}")
        except (OSError, ValueError):
            pass
    py_imp = collections.Counter()
    for d in kod_dos:
        if d.endswith(".py"):
            for m in re.finditer(r"^\s*(?:from|import)\s+([A-Za-z_][\w]*)", _oku(root, d), re.M):
                py_imp[m.group(1)] += 1
    bag |= set(py_imp)
    js_txt = " ".join(_oku(root, d)[:4000] for d in kod_dos if d.endswith((".js", ".mjs")) and "/static/" in d)
    bulunan = [(a, k) for a, k, rx in TEKNOLOJI if any(re.search(rx, b) for b in bag) or (a in ("Leaflet", "MediaPipe") and re.search(rx, js_txt, re.I))]
    if bulunan:
        out.append("- Cerceve/kutuphane: " + ", ".join(f"{a} ({k})" for a, k in bulunan))
    for f, ad in (("Dockerfile", "Docker"), ("docker-compose.yml", "Docker Compose"), ("sunucu/docker-compose.yml", "Docker Compose"),
                  ("sunucu/Caddyfile", "Caddy"), ("deploy/systemd", "systemd"), (".github/workflows", "GitHub Actions"), ("netlify.toml", "Netlify")):
        if (root / f).exists():
            out.append(f"- Dagitim: {ad} (`{f}`)")
    ext = [n["label"] for n in data["nodes"] if n.get("kategori") == "entegrasyon"]
    if ext:
        out.append("- Dis servisler: " + ", ".join(sorted(ext)))
    return out


def _betik_yolu(root: Path) -> str:
    try:
        return Path(__file__).resolve().parent.relative_to(root).as_posix()
    except ValueError:
        return "graphify"


def _sf(n: dict) -> str:
    return n.get("source_file") or (n.get("konum") or "").split(":")[0]


def rapor(root: Path, data: dict, dosyalar: list[str], proje: str) -> str:
    nodes = {n["id"]: n for n in data["nodes"]}
    E = data["links"]
    gelen, giden = collections.defaultdict(list), collections.defaultdict(list)
    for e in E:
        giden[e["source"]].append(e)
        gelen[e["target"]].append(e)
    kat = collections.defaultdict(list)
    for n in data["nodes"]:
        if n.get("_origin") == KAYNAK:
            kat[n.get("kategori")].append(n)

    def yer(nid):
        n = nodes.get(nid, {})
        s = _satir(n.get("source_location"))
        return f"{n.get('source_file', '')}:{s}" if s else n.get("source_file", "")

    L = [f"# Kod haritasi — {proje}", "",
         f"> Otomatik uretilir (`{_betik_yolu(root)}/guncelle.sh`). Elle duzenleme; yeniden uretilince silinir.",
         "> Once burayi ve `graphify query` kullan; kaynak kodu ancak implementasyon gerekince ve SADECE ilgili satir araligini oku.", ""]
    kod_n = [n for n in data["nodes"] if n.get("file_type") == "code"]
    kapsanan = {n.get("source_file") for n in kod_n}
    kod_dos = [d for d in dosyalar if d.endswith(KOD_UZANTI)]
    kap = sum(1 for d in kod_dos if d in kapsanan)
    L += ["## Ozet", f"- Kod dosyasi: {len(kod_dos)} · grafta: {kap} (%{round(100 * kap / max(1, len(kod_dos)))})",
          f"- Dugum: {len(data['nodes'])} · kenar: {len(E)} · sembol: {sum(1 for n in kod_n if n.get('_callable'))}",
          "- Katman: " + ", ".join(f"{k} {len(v)}" for k, v in sorted(kat.items(), key=lambda x: str(x[0]))),
          f"- Graf commit: `{data.get('built_at_commit', '?')}`", ""]
    L += ["## Sorgu rehberi (token ucuzdan pahaliya)",
          "1. Bu dosya (KOD_HARITASI.md) → hangi alan/dosya/route/tablo",
          "2. `graphify explain \"<sembol | route etiketi (POST /webhook) | id (table_leads, ext_anthropic, env_database_url, domain_hasta)>\"` → komsular, dosya:satir",
          "3. `graphify affected \"<sembol>\" --depth 2` → blast radius (kim etkilenir)",
          "4. `graphify path \"A\" \"B\"` → iki nokta arasi yol (orn. route → table)",
          "5. `graphify query \"<soru>\" --budget 1500` → ilgili alt graf",
          "6. Sonra yalniz gosterilen satir araligini oku. Graf ile kaynak celisirse KAYNAK KOD ESASTIR.",
          "- Katman dugum id'leri (normalize): `route_get_yol`, `table_ad`, `env_ad`, `ext_anthropic`, `job_ad`, `domain_hasta`, `page_yol`. Etiketle sorgu daha kolay: `POST /webhook`, `leads`, `anthropic`.", ""]

    # klasor yapisi (ust iki seviye) + teknoloji haritasi
    kls = collections.Counter("/".join(d.split("/")[:2]) if d.count("/") >= 2 else d.split("/")[0] for d in kod_dos)
    L += ["## Klasor yapisi (kod dosyasi sayisi)", ", ".join(f"`{k}` {v}" for k, v in kls.most_common(30)), ""]
    L += ["## Teknoloji haritasi"] + _teknoloji(root, kod_dos, data) + [""]

    L += ["## Giris noktalari"]
    for n in sorted(kat.get("giris", []), key=_sf):
        L.append(f"- `{_sf(n)}` — {n.get('aciklama', '')}")
    L.append("")

    L += ["## Is alanlari (domain → en onemli dosyalar)"]
    for n in sorted(kat.get("domain", []), key=lambda n: -len(giden[n["id"]])):
        dos = [e["target"] for e in giden[n["id"]] if nodes[e["target"]].get("source_file") and nodes[e["target"]].get("kategori") in (None, "dosya")]
        dos.sort(key=lambda t: -(len(gelen[t]) + len(giden[t])))
        ek = collections.Counter(nodes[e["target"]].get("kategori") for e in giden[n["id"]])
        if not dos and not ek:
            continue
        L.append(f"- **{n['label']}** ({len(dos)} dosya, {ek.get('route', 0)} route, {ek.get('tablo', 0)} tablo): "
                 + ", ".join(f"`{nodes[t]['source_file']}`" for t in dos[:6]))
    L.append("")

    rts = sorted(kat.get("route", []), key=lambda n: (n.get("yol", ""), n.get("yontem", "")))
    L += [f"## API ({len(rts)})", "| Yontem | Yol | Handler | Auth | Istemci |", "|---|---|---|---|---|"]
    for n in rts[:400]:
        h = next((e["target"] for e in giden[n["id"]] if e["relation"] == "handled_by"), "")
        ist = len({e["source"] for e in gelen[n["id"]] if e["relation"] == "calls_api"})
        yol = n.get("yol", "") if n.get("yontem") != "ACTION" else n.get("yol", "").split("#")[-1]
        L.append(f"| {n.get('yontem', '')} | `{yol}` | `{yer(h)}` | {'evet' if n.get('auth') else '—'} | {ist or '—'} |")
    if len(rts) > 400:
        L.append(f"| … | {len(rts) - 400} route daha | `graphify explain \"route:...\"` | | |")
    L.append("")

    tb = sorted(kat.get("tablo", []), key=lambda n: n["label"])
    L += [f"## Veritabani tablolari ({len(tb)})", "| Tablo | Tanim | FK → | Okuyan | Yazan |", "|---|---|---|---|---|"]
    for n in tb:
        fk = [nodes[e["target"]]["label"] for e in giden[n["id"]] if e["relation"] == "fk"]
        ok = len({e["source"] for e in gelen[n["id"]] if e["relation"] == "reads"})
        yz = len({e["source"] for e in gelen[n["id"]] if e["relation"] == "writes"})
        L.append(f"| `{n['label']}` | `{_sf(n)}` | {', '.join(sorted(set(fk))[:6]) or '—'} | {ok} | {yz} |")
    L.append("")

    L += ["## Dis entegrasyonlar"]
    for n in sorted(kat.get("entegrasyon", []), key=lambda n: n["label"]):
        cag = {e["source"] for e in gelen[n["id"]] if e["relation"] in ("integrates", "calls_llm")}
        envs = sorted(nodes[e["source"]]["label"] for e in gelen[n["id"]] if e["relation"] == "configures")
        dos = collections.Counter(nodes[s].get("source_file", "") for s in cag)
        if not cag and not envs:
            continue
        L.append(f"- **{n['label']}** ({n.get('aciklama', '')}): {len(cag)} cagri noktasi; dosyalar: "
                 + ", ".join(f"`{d}`" for d, _ in dos.most_common(5)) + (f"; env: {', '.join(envs[:8])}" if envs else ""))
    L.append("")

    L += ["## Arka plan isleri / zamanlayicilar"]
    for n in sorted(kat.get("is", []), key=lambda n: n["id"]):
        r = next((e["target"] for e in giden[n["id"]] if e["relation"] == "runs"), "")
        L.append(f"- `{n['label']}` — {n.get('zamanlama', '')} → `{yer(r) if r else n.get('konum', '')}`")
    L.append("")

    envs = sorted(kat.get("env", []), key=lambda n: n["label"])
    L += [f"## Ortam degiskenleri ({len(envs)}; yalniz ADLAR, deger yok)",
          ", ".join(f"`{n['label']}`{'🔒' if n.get('gizli') else ''}" for n in envs), ""]

    sayfalar = sorted(kat.get("page", []), key=lambda n: n.get("yol", ""))
    if sayfalar:
        L += [f"## Sayfalar ({len(sayfalar)})", ", ".join(f"`{n.get('yol')}`" for n in sayfalar), ""]

    tdos = [n for n in data["nodes"] if n.get("test")]
    L += [f"## Testler ({len(tdos)} test dosyasi)",
          "- Bir sembolun testleri: `graphify explain \"<sembol>\"` icinde `tests` kenarlari; ya da asagidaki dosya eslesmesi."]
    hedef_say = collections.Counter()
    for t in tdos:
        for e in giden[t["id"]]:
            if e["relation"] == "tests" and nodes[e["target"]].get("label", "").endswith(KOD_UZANTI):
                hedef_say[nodes[e["target"]].get("source_file", "")] += 1
    L.append("- En cok test edilen dosyalar: " + ", ".join(f"`{d}` ({c})" for d, c in hedef_say.most_common(12)))
    testsiz = [d for d in kod_dos if not TEST_DOSYA.search(d) and d not in hedef_say and d.endswith((".py", ".ts", ".tsx"))]
    L.append(f"- Hic test dosyasi tarafindan kullanilmayan uretim dosyasi: {len(testsiz)}")
    L.append("")

    # import donguleri (dosya duzeyi)
    imp = collections.defaultdict(set)
    for e in E:
        if e["relation"] in ("imports", "imports_from"):
            a, b = nodes.get(e["source"], {}).get("source_file"), nodes.get(e["target"], {}).get("source_file")
            if a and b and a != b:
                imp[a].add(b)
    dong = _dongu_bul(imp)
    L += [f"## Dongusel bagimliliklar ({len(dong)})"] + [f"- {' ↔ '.join(f'`{x}`' for x in c[:6])}{' …' if len(c) > 6 else ''}" for c in dong[:15]] + [""]

    # potansiyel legacy: hicbir yerden import edilmeyen, giris/test olmayan dosyalar
    giris = {_sf(n) for n in kat.get("giris", [])}
    hedefler = set().union(*imp.values()) if imp else set()
    script = re.compile(r"(^|/)(kurulum|scripts?|sunucu|deploy|bin)/|\.sh$|\.sql$|(^|/)app/|route\.[tj]s$|page\.tsx$|layout\.tsx$|\.(service|timer)$|(^|/)static/")
    pot = [d for d in kod_dos if d not in hedefler and d not in giris and not TEST_DOSYA.search(d) and not script.search(d)
           and d.endswith((".py", ".ts", ".tsx", ".js"))]
    L += [f"## POTANSIYEL LEGACY ({len(pot)}; emin degil — import edilmeyen, giris/test/script olmayan dosyalar)",
          ", ".join(f"`{d}`" for d in pot[:60]) + (" …" if len(pot) > 60 else ""), ""]

    # kritik akislar (akislar.json): duraklar arasi yonlu en kisa yol
    ak = _akis_dosyasi(root)
    if ak:
        L += ["## Kritik akislar (graf uzerinde dogrulanir)"]
        for a in ak.get("akislar", []):
            zincir, kopuk = _akis_yolu(nodes, giden, a.get("duraklar", []))
            L.append(f"- **{a.get('ad')}**" + (" — ⚠️ BAGLANTI YOK: " + kopuk + (f" ({a['not']})" if a.get("not") else "") if kopuk else ""))
            if zincir:
                L.append("  " + " → ".join(f"`{_kisa(nodes[z]['label'])}`" + (f" ({yer(z)})" if nodes[z].get("source_file") and nodes[z].get("file_type") == "code" else "") for z in zincir))
        L.append("")

    # merkez semboller
    der = collections.Counter()
    for e in E:
        if e["relation"] in ("calls", "imports", "imports_from", "references", "uses"):
            der[e["target"]] += 1
    L += ["## Merkez semboller (en cok kullanilan; degistirirken blast radius YUKSEK)"]
    L += [f"- `{_kisa(nodes[i]['label'])}` — {yer(i)} ({c})" for i, c in der.most_common(40)
          if nodes.get(i, {}).get("file_type") == "code" and nodes[i].get("_callable")][:25]
    L.append("")
    # icindekiler: dosyanin tamamini okumamak icin bolum satir numaralari (sed -n A,Bp ile yalniz gereken bolum)
    bas = [i for i, x in enumerate(L) if x.startswith("## ")]
    ek = 2 + len(bas)
    ic = ["## Icindekiler (TAMAMINI OKUMA: yalniz gereken bolumu `sed -n A,Bp` ile oku)"]
    for j, i in enumerate(bas):
        son = (bas[j + 1] if j + 1 < len(bas) else len(L)) + ek
        ic.append(f"- {L[i][3:]}: satir {i + 1 + ek}-{son}")
    L[4:4] = ic + [""]
    return "\n".join(L) + "\n"


# =========================================================================== ana
def katman_ekle(root: Path, gp: Path) -> dict:
    data = json.loads(gp.read_text(encoding="utf-8"))
    g = Graf(data)
    g.proje = root.name
    g.kok = root
    _SAR_CACHE.clear()
    dosyalar = kod_dosyalari(root)
    for sf in dosyalar:
        src = _oku(root, sf)
        aralik = py_araliklar(src) if sf.endswith(".py") else None
        if sf.endswith(".py"):
            routes_fastapi(g, root, sf, src, aralik)
        if sf.endswith((".ts", ".tsx", ".js")):
            routes_next(g, root, sf, src)
            server_actions(g, sf, src)
        if not TEST_DOSYA.search(sf):
            env_ve_entegrasyon(g, sf, src, aralik)
    astro_netlify(g, root)
    env_entegrasyon_bagla(g)
    modul_alias_kenarlari(g, root, dosyalar)
    sql_t, drz = tablolari_topla(root, dosyalar)
    tablo_katmani(g, root, dosyalar, sql_t, drz)
    istemci_api(g, root, dosyalar)
    isler(g, root, dosyalar)
    testler(g)
    giris_noktalari(g, root, dosyalar)
    domainler(g, dosyalar)
    gp.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    return {"eklenen_dugum": g.eklenen_dugum, "eklenen_kenar": g.eklenen_kenar,
            "kategori": dict(collections.Counter(n.get("kategori") for n in data["nodes"] if n.get("_origin") == KAYNAK))}


def main(argv: list[str]) -> int:
    if not argv or argv[0].startswith("-"):
        print(__doc__)
        return 2
    root = Path(argv[0]).resolve()
    gp = Path(argv[argv.index("--graph") + 1]) if "--graph" in argv else root / "graphify-out" / "graph.json"
    if not gp.exists():
        print(f"graf yok: {gp} (once: graphify extract {root} --code-only)")
        return 1
    if "--etiket" in argv or "--rapor" in argv:
        data = json.loads(gp.read_text(encoding="utf-8"))
        if "--etiket" in argv:
            et = etiketle(data)
            (gp.parent / ".graphify_labels.json").write_text(json.dumps(et, ensure_ascii=False, indent=0), encoding="utf-8")
            gp.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
            rp = gp.parent / "GRAPH_REPORT.md"
            if rp.exists():   # rapordaki "Community N" yer tutucularini adla degistir (uzun numara once)
                metin = rp.read_text(encoding="utf-8")
                metin = re.sub(r"\bCommunity (\d+)\b", lambda m: f"C{m.group(1)} {et.get(m.group(1), '')}".strip(), metin)
                rp.write_text(metin, encoding="utf-8")
            print(f"etiket: {len(et)} topluluk")
        if "--rapor" in argv:
            proje = argv[argv.index("--proje") + 1] if "--proje" in argv else root.name
            metin = rapor(root, data, kod_dosyalari(root), proje)
            (gp.parent / "KOD_HARITASI.md").write_text(metin, encoding="utf-8")
            print(f"rapor: {gp.parent / 'KOD_HARITASI.md'} ({metin.count(chr(10))} satir)")
        return 0
    print(json.dumps(katman_ekle(root, gp), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

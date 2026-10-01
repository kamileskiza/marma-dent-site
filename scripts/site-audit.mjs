#!/usr/bin/env node
// Site audit for the built site (dist/). No dependencies.
// Run after `npm run build`:  node scripts/site-audit.mjs  [--json report.json]
// Exits with code 1 if any ERROR-level problem is found, so it can gate deploys.
//
// Checks: title / description / canonical / robots / og / lang on every page,
// hreflang (self, reciprocal, x-default, targets exist), sitemap (only canonical,
// indexable, existing URLs; every indexable page listed), robots.txt, JSON-LD
// validity, internal links (broken), WhatsApp + phone links (number, encoding),
// duplicate titles/descriptions per language, H1 count, images without alt.
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://dtnizamabdullayev.com';
const DIST = path.resolve(process.argv.includes('--dist') ? process.argv[process.argv.indexOf('--dist') + 1] : 'dist');
const PHONE = '905551901034';

const errors = [];
const warns = [];
const err = (code, page, msg) => errors.push({ code, page, msg });
const warn = (code, page, msg) => warns.push({ code, page, msg });

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
const toUrl = (file) => {
  let rel = path.relative(DIST, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
};
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[2] ?? m[3]) : null;
};
const decode = (s) => (s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

// Redirect sources (from Netlify _redirects) count as valid internal targets but are flagged.
const redirects = new Map();
const rf = path.join(DIST, '_redirects');
if (fs.existsSync(rf)) {
  for (const line of fs.readFileSync(rf, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const [from, to] = t.split(/\s+/);
    redirects.set(from, to);
  }
}

// every redirect must land on a real page
for (const [from, to] of redirects) {
  const t = decodeURIComponent(to);
  if (!fs.existsSync(path.join(DIST, t, 'index.html')) && !fs.existsSync(path.join(DIST, t))) err('redirect', from, `redirect target missing: ${to}`);
}
const files = walk(DIST).filter((f) => !f.endsWith('404.html') && !/google[0-9a-f]+\.html$/.test(f));
const pages = new Map(); // url -> info
for (const f of files) {
  const html = fs.readFileSync(f, 'utf-8');
  const url = toUrl(f);
  const head = html.split(/<\/head>/i)[0] || '';
  const info = { url, file: f };
  info.lang = (html.match(/<html[^>]*\slang="([^"]+)"/i) || [])[1] || null;
  info.title = decode((head.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '').trim();
  const metas = head.match(/<meta\b[^>]*>/gi) || [];
  const metaBy = (k, v) => metas.find((m) => (attr(m, k) || '').toLowerCase() === v);
  info.description = decode(attr(metaBy('name', 'description') || '', 'content') || '').trim();
  info.robots = (attr(metaBy('name', 'robots') || '', 'content') || '').toLowerCase();
  info.og = ['og:title', 'og:description', 'og:image', 'og:url'].filter((k) => !metaBy('property', k));
  const links = head.match(/<link\b[^>]*>/gi) || [];
  const canon = links.find((l) => (attr(l, 'rel') || '').toLowerCase() === 'canonical');
  info.canonical = canon ? attr(canon, 'href') : null;
  info.hreflang = links
    .filter((l) => (attr(l, 'rel') || '').toLowerCase() === 'alternate' && attr(l, 'hreflang'))
    .map((l) => ({ lang: attr(l, 'hreflang'), href: attr(l, 'href') }));
  info.charsetPos = html.search(/<meta\s+charset/i);
  info.ld = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  info.h1 = (html.match(/<h1\b/gi) || []).length;
  const body = html.slice(head.length);
  info.anchors = [...body.matchAll(/<a\b[^>]*>/gi)].map((m) => attr(m[0], 'href')).filter(Boolean);
  info.imgsNoAlt = [...body.matchAll(/<img\b[^>]*>/gi)].filter((m) => attr(m[0], 'alt') === null).length;
  pages.set(url, info);
}

const exists = (p) => pages.has(p) || fs.existsSync(path.join(DIST, decodeURIComponent(p)));

// ---- per-page checks
const byLangTitle = new Map();
const byLangDesc = new Map();
for (const p of pages.values()) {
  const u = p.url;
  if (!p.lang) err('lang', u, 'missing <html lang>');
  if (!p.title) err('title', u, 'missing <title>');
  if (!p.description) err('description', u, 'missing meta description');
  if (p.og.length) warn('og', u, 'missing ' + p.og.join(', '));
  if (p.charsetPos > 1024) warn('charset', u, `<meta charset> at byte ${p.charsetPos} (should be in first 1024)`);
  if (p.h1 !== 1) warn('h1', u, `${p.h1} <h1> elements`);
  if (p.imgsNoAlt) warn('img-alt', u, `${p.imgsNoAlt} <img> without alt`);
  const noindex = p.robots.includes('noindex');
  p.noindex = noindex;
  if (!p.canonical) err('canonical', u, 'missing canonical');
  else if (p.canonical !== SITE + u) err('canonical', u, `canonical points elsewhere: ${p.canonical}`);
  for (const blk of p.ld) { try { JSON.parse(blk); } catch { err('jsonld', u, 'invalid JSON-LD'); } }
  // hreflang
  if (!noindex) {
    if (!p.hreflang.length) err('hreflang', u, 'no hreflang');
    const self = p.hreflang.find((h) => h.href === SITE + u);
    if (p.hreflang.length && !self) err('hreflang', u, 'no self-referencing hreflang');
    if (self && p.lang && self.lang !== p.lang && self.lang !== 'x-default') err('hreflang', u, `self hreflang "${self.lang}" ≠ html lang "${p.lang}"`);
    if (p.hreflang.length && !p.hreflang.some((h) => h.lang === 'x-default')) warn('hreflang', u, 'no x-default');
    const seen = new Set();
    for (const h of p.hreflang) {
      if (h.lang !== 'x-default' && seen.has(h.lang)) err('hreflang', u, `duplicate hreflang ${h.lang}`);
      seen.add(h.lang);
      if (!h.href.startsWith(SITE)) { err('hreflang', u, `external hreflang ${h.href}`); continue; }
      const tp = h.href.slice(SITE.length);
      const t = pages.get(tp);
      if (!t) { err('hreflang', u, `hreflang ${h.lang} → missing page ${tp}`); continue; }
      if (h.lang !== 'x-default' && t.lang && t.lang !== h.lang) err('hreflang', u, `hreflang ${h.lang} → page with lang ${t.lang} (${tp})`);
      if (h.lang !== 'x-default' && !t.hreflang.some((b) => b.href === SITE + u)) err('hreflang-reciprocal', u, `${tp} does not link back`);
    }
  }
  // duplicates
  const k1 = p.lang + '|' + p.title; byLangTitle.set(k1, [...(byLangTitle.get(k1) || []), u]);
  const k2 = p.lang + '|' + p.description; byLangDesc.set(k2, [...(byLangDesc.get(k2) || []), u]);
  // links
  for (const raw of p.anchors) {
    const href = decode(raw);
    if (href.startsWith('https://wa.me/') || href.includes('api.whatsapp.com')) {
      const num = (href.match(/wa\.me\/(\d+)/) || href.match(/phone=(\d+)/) || [])[1];
      if (num !== PHONE) err('whatsapp', u, `WhatsApp number ${num} ≠ ${PHONE}`);
      try { new URL(href); } catch { err('whatsapp', u, 'malformed WhatsApp URL'); }
      continue;
    }
    if (href.startsWith('tel:')) {
      if (href.replace(/[^\d]/g, '') !== PHONE) err('phone', u, `tel link ${href}`);
      continue;
    }
    let target = null;
    if (href.startsWith(SITE)) target = href.slice(SITE.length) || '/';
    else if (href.startsWith('/') && !href.startsWith('//')) target = href;
    if (!target) continue;
    target = target.split('#')[0].split('?')[0];
    if (!target) continue;
    if (redirects.has(target)) { warn('link-redirect', u, `${target} redirects to ${redirects.get(target)}`); continue; }
    if (!exists(target)) err('broken-link', u, target);
    else if (!target.endsWith('/') && !path.extname(target)) warn('link-slash', u, `${target} (no trailing slash → redirect)`);
  }
}
for (const [k, us] of byLangTitle) if (us.length > 1 && k.split('|')[1]) warn('dup-title', us[0], `${us.length} pages share title "${k.split('|')[1]}"`);
for (const [k, us] of byLangDesc) if (us.length > 1 && k.split('|')[1]) warn('dup-description', us[0], `${us.length} pages share description`);

// ---- orphan pages (no internal link from any other page)
const inbound = new Map();
for (const p of pages.values()) for (const raw of p.anchors) {
  let h = decode(raw);
  if (h.startsWith(SITE)) h = h.slice(SITE.length) || '/';
  if (!h.startsWith('/')) continue;
  h = h.split('#')[0].split('?')[0];
  if (h !== p.url) inbound.set(h, (inbound.get(h) || 0) + 1);
}
for (const p of pages.values()) if (!p.noindex && !inbound.get(p.url)) warn('orphan', p.url, 'no internal links point here');

// ---- sitemap
const smFiles = fs.readdirSync(DIST).filter((f) => /^sitemap-\d+\.xml$/.test(f));
const smUrls = new Set();
for (const f of smFiles) for (const m of fs.readFileSync(path.join(DIST, f), 'utf-8').matchAll(/<loc>([^<]+)<\/loc>/g)) smUrls.add(m[1]);
if (!smFiles.length) err('sitemap', '/', 'no sitemap files');
for (const loc of smUrls) {
  const u = loc.startsWith(SITE) ? decodeURIComponent(loc.slice(SITE.length)) || '/' : null;
  const p = u && pages.get(u);
  if (!p) { err('sitemap', loc, 'URL in sitemap has no page'); continue; }
  if (p.noindex) err('sitemap', loc, 'noindex page in sitemap');
  if (p.canonical && decodeURI(p.canonical) !== decodeURI(loc)) err('sitemap', loc, `non-canonical URL in sitemap (canonical ${p.canonical})`);
}
const smDecoded = new Set([...smUrls].map((l) => decodeURI(l)));
for (const p of pages.values()) if (!p.noindex && !smDecoded.has(SITE + p.url)) err('sitemap', p.url, 'indexable page missing from sitemap');
for (const p of pages.values()) if (/[^\x00-\x7F]/.test(p.url)) warn('non-ascii-url', p.url, 'URL contains non-ASCII characters');

// ---- robots.txt
const robotsTxt = fs.existsSync(path.join(DIST, 'robots.txt')) ? fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf-8') : '';
if (!robotsTxt) err('robots', '/robots.txt', 'missing');
else {
  if (!/Sitemap:\s*https:\/\/dtnizamabdullayev\.com\/sitemap-index\.xml/i.test(robotsTxt)) err('robots', '/robots.txt', 'sitemap line missing/wrong');
  if (/Disallow:\s*\/\s*$/m.test(robotsTxt)) err('robots', '/robots.txt', 'Disallow: / blocks the whole site');
}

// ---- report
const count = (arr) => arr.reduce((m, x) => ((m[x.code] = (m[x.code] || 0) + 1), m), {});
const summary = {
  pages: pages.size,
  sitemapUrls: smUrls.size,
  languages: [...new Set([...pages.values()].map((p) => p.lang))].length,
  errors: count(errors),
  warnings: count(warns),
};
console.log(JSON.stringify(summary, null, 2));
const show = (label, arr) => {
  const byCode = {};
  for (const x of arr) (byCode[x.code] ||= []).push(x);
  for (const [code, xs] of Object.entries(byCode)) {
    console.log(`\n${label} ${code} (${xs.length})`);
    for (const x of xs.slice(0, 5)) console.log(`  ${x.page} — ${x.msg}`);
  }
};
show('ERROR', errors);
show('WARN', warns);
const jIdx = process.argv.indexOf('--json');
if (jIdx > -1) fs.writeFileSync(process.argv[jIdx + 1], JSON.stringify({ summary, errors, warnings: warns }, null, 1));
console.log(errors.length ? `\nAUDIT: FAIL (${errors.length} errors)` : '\nAUDIT: PASS');
process.exit(errors.length ? 1 : 0);

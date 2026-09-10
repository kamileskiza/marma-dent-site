// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { REDIRECTS } from './src/i18n/redirects.ts';

const LOCALES = [
  'en','tr','ru','de','ar','az','uk','bg','nl','fr','pl','ro','it','el','es',
  'cs','sk','hu','lt','lv','et','pt','sv','da','fi','hr','sl','sr','no',
];
const DEFAULT_LOCALE = 'en';

function localePathForRedirects(code, p) {
  const clean = p.replace(/^\/+/, '');
  return code === DEFAULT_LOCALE ? `/${clean}` : `/${code}/${clean}`;
}

// Writes dist/_redirects from src/i18n/redirects.ts on every build, so a slug
// rename only ever requires editing that one data file — see the comment
// block at the top of redirects.ts for how to add an entry.
function slugRedirectsIntegration() {
  return {
    name: 'slug-redirects',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const lines = ['# Auto-generated from src/i18n/redirects.ts — do not edit by hand.', ''];
        let count = 0;
        for (const [locale, entries] of Object.entries(REDIRECTS)) {
          for (const { from, to } of entries) {
            const fromPath = localePathForRedirects(locale, from);
            const toPath = localePathForRedirects(locale, to);
            lines.push(`${fromPath}  ${toPath}  301`);
            count++;
          }
        }
        const outPath = path.join(dir.pathname, '_redirects');
        fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf-8');
        if (count > 0) console.log(`[slug-redirects] Wrote ${count} redirect(s) to dist/_redirects`);
      },
    },
  };
}

export default defineConfig({
  site: 'https://dtnizamabdullayev.com',
  trailingSlash: 'always',
  build: {
    assets: 'assets', // avoid a leading-underscore folder name (_astro/) — some
    // manual/drag-and-drop static hosts silently drop underscore-prefixed
    // directories, which breaks all CSS/JS on the deployed site.
  },
  i18n: {
    defaultLocale: 'en',
    locales: LOCALES,
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: Object.fromEntries(LOCALES.map((l) => [l, l])),
      },
    }),
    slugRedirectsIntegration(),
  ],
});


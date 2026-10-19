/** Gera HTML estático por rota (SEO) + sitemap.xml (com imagens) + robots.txt + 404.html + manifest. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve('.');
const dist = path.join(root, 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const entry = pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href;
const { render, routes, siteConfig, products } = await import(entry);

// Metatags de verificação do Google Search Console / Bing Webmaster Tools (site.config.js)
const v = siteConfig.verification || {};
const verify = [
  v.google && `<meta name="google-site-verification" content="${v.google}" />`,
  v.bing && `<meta name="msvalidate.01" content="${v.bing}" />`,
].filter(Boolean);

const write = (url, file) => {
  const { html, head } = render(url);
  const out = template.replace('<!--head-->', [...verify, head].join('\n')).replace('<!--app-->', html);
  const target = path.join(dist, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, out);
  console.log('  ok', url, '->', file);
};

for (const url of routes) write(url, url === '/' ? 'index.html' : `${url.slice(1)}/index.html`);
write('/404', '404.html');

const xml = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const images = (r) => {
  const p = products.find((x) => r === `/produtos/${x.slug}`);
  if (!p) return '';
  return p.screens
    .filter((s) => s.image)
    .map((s) => `<image:image><image:loc>${siteConfig.siteUrl}${s.image}</image:loc><image:title>${xml(`${p.name}: ${s.name}`)}</image:title></image:image>`)
    .join('');
};
const today = new Date().toISOString().slice(0, 10);
const priority = (r) => (r === '/' ? '1.0' : r.startsWith('/produtos') ? '0.9' : '0.6');
const urls = routes
  .map((r) => `  <url><loc>${siteConfig.siteUrl}${r}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${priority(r)}</priority>${images(r)}</url>`)
  .join('\n');
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`
);
fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /download/\n\nSitemap: ${siteConfig.siteUrl}/sitemap.xml\n`
);
fs.writeFileSync(
  path.join(dist, 'manifest.webmanifest'),
  JSON.stringify({
    name: siteConfig.siteName,
    short_name: 'VuCore',
    lang: 'pt-BR',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0e1a',
    theme_color: '#0a0e1a',
    icons: [{ src: '/favicon.png', sizes: '256x256', type: 'image/png' }],
  }, null, 2)
);
// IndexNow: arquivo de chave na raiz (o envio de URLs é feito por scripts/indexnow.js)
if (siteConfig.indexNowKey) fs.writeFileSync(path.join(dist, `${siteConfig.indexNowKey}.txt`), siteConfig.indexNowKey);

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`Pré-render concluído: ${routes.length} páginas + 404 + sitemap.xml + robots.txt + manifest`);

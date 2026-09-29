/** Gera HTML estático por rota (SEO) + sitemap.xml + robots.txt + 404.html. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve('.');
const dist = path.join(root, 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const entry = pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href;
const { render, routes, siteConfig } = await import(entry);

const write = (url, file) => {
  const { html, head } = render(url);
  const out = template.replace('<!--head-->', head).replace('<!--app-->', html);
  const target = path.join(dist, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, out);
  console.log('  ok', url, '->', file);
};

for (const url of routes) write(url, url === '/' ? 'index.html' : `${url.slice(1)}/index.html`);
write('/404', '404.html');

const today = new Date().toISOString().slice(0, 10);
const priority = (r) => (r === '/' ? '1.0' : r.startsWith('/produtos') ? '0.9' : '0.6');
const urls = routes
  .map((r) => `  <url><loc>${siteConfig.siteUrl}${r}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${priority(r)}</priority></url>`)
  .join('\n');
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /download/\n\nSitemap: ${siteConfig.siteUrl}/sitemap.xml\n`
);
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`Pré-render concluído: ${routes.length} páginas + 404 + sitemap.xml + robots.txt`);

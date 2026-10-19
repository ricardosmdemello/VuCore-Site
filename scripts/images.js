/**
 * Otimização de imagens (roda antes do build):
 *  - gera .webp ao lado de cada .png em public/images (até 1600px de largura)
 *  - gera imagens Open Graph 1200×630 em public/og/ (home + uma por produto)
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { products } from '../src/data/products.js';
import siteConfig from '../src/config/site.config.js';

const pub = path.resolve('public');
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));

for (const file of walk(path.join(pub, 'images')).filter((f) => f.endsWith('.png') && !f.endsWith('logo.png'))) {
  const out = file.replace(/\.png$/, '.webp');
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(file).mtimeMs) continue;
  await sharp(file).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
  console.log('  webp', path.relative(pub, out));
}

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const wrap = (text, max) => {
  const lines = [''];
  for (const w of text.split(' ')) {
    if ((lines.at(-1) + ' ' + w).trim().length > max) lines.push(w);
    else lines[lines.length - 1] = (lines.at(-1) + ' ' + w).trim();
  }
  return lines.slice(0, 3);
};
const ogSvg = ({ title, subtitle, color }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="g" cx="15%" cy="0%" r="80%"><stop offset="0" stop-color="${color}" stop-opacity=".45"/><stop offset="1" stop-color="#0a0e1a" stop-opacity="0"/></radialGradient>
    <linearGradient id="m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6d7cff"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a0e1a"/><rect width="1200" height="630" fill="url(#g)"/>
  <rect x="80" y="80" width="64" height="64" rx="16" fill="url(#m)"/>
  <text x="112" y="122" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="800" font-size="26" fill="#fff">Vu</text>
  <text x="164" y="122" font-family="Segoe UI, Arial" font-weight="700" font-size="30" fill="#eef1f8">${esc(siteConfig.siteName)}</text>
  ${wrap(title, 26).map((l, i) => `<text x="80" y="${270 + i * 84}" font-family="Segoe UI, Arial" font-weight="800" font-size="76" fill="#eef1f8">${esc(l)}</text>`).join('')}
  ${wrap(subtitle, 58).slice(0, 2).map((l, i) => `<text x="80" y="${500 + i * 44}" font-family="Segoe UI, Arial" font-size="32" fill="#a1abc6">${esc(l)}</text>`).join('')}
  <rect x="0" y="618" width="1200" height="12" fill="${color}"/>
</svg>`;

fs.mkdirSync(path.join(pub, 'og'), { recursive: true });
const cards = [
  { file: 'default', title: 'Software que trabalha para você', subtitle: 'Ferramentas desktop rápidas e privadas, com IA 100% local.', color: '#6d7cff' },
  ...products.map((p) => ({ file: p.slug, title: p.name, subtitle: p.tagline, color: p.color })),
];
for (const c of cards) await sharp(Buffer.from(ogSvg(c))).png().toFile(path.join(pub, 'og', `${c.file}.png`));
console.log(`  og ${cards.length} imagens`);

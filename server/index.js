/**
 * Servidor de produção:
 *  - serve o site estático pré-renderizado (dist/)
 *  - GET  /download/:slug        -> conta +1 e entrega o arquivo de server/downloads/
 *  - GET  /api/downloads/:slug   -> contador público de um produto
 *  - GET  /api/stats?token=XXX   -> todos os contadores + histórico (protegido por STATS_TOKEN)
 */
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../src/data/products.js';
import { isVisible } from '../src/config/site.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const DOWNLOADS = path.join(__dirname, 'downloads');
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'downloads.json');
const PORT = process.env.PORT || 3001;
const STATS_TOKEN = process.env.STATS_TOKEN || 'troque-este-token';

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(DOWNLOADS, { recursive: true });

const load = () => {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { return { totals: {}, log: [] }; }
};
let db = load();
let saveTimer;
const save = () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const tmp = DB_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
    fs.renameSync(tmp, DB_FILE);
  }, 200);
};

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);

app.get('/download/:slug', (req, res) => {
  const product = products.find((p) => p.slug === req.params.slug);
  if (!product || !isVisible(product.slug) || !product.download?.file) return res.status(404).send('Download não encontrado');
  const file = path.join(DOWNLOADS, path.basename(product.download.file));
  if (!fs.existsSync(file)) return res.status(404).send('Arquivo ainda não disponível. Tente novamente mais tarde.');

  db.totals[product.slug] = (db.totals[product.slug] || 0) + 1;
  db.log.push({ slug: product.slug, at: new Date().toISOString(), ref: req.get('referer') || null, ua: req.get('user-agent') || null });
  if (db.log.length > 50000) db.log = db.log.slice(-50000);
  save();

  res.set('X-Robots-Tag', 'noindex');
  res.download(file);
});

app.get('/api/downloads/:slug', (req, res) => res.json({ slug: req.params.slug, count: db.totals[req.params.slug] || 0 }));

app.get('/api/stats', (req, res) => {
  if (req.query.token !== STATS_TOKEN) return res.status(401).json({ error: 'token inválido' });
  const byDay = {};
  for (const e of db.log) {
    const d = e.at.slice(0, 10);
    byDay[d] ??= {};
    byDay[d][e.slug] = (byDay[d][e.slug] || 0) + 1;
  }
  res.json({ totals: db.totals, byDay, last: db.log.slice(-50).reverse() });
});

// URLs limpas (/produtos/x) servidas sem redirecionar para barra final (mantém a URL canônica)
app.use((req, res, next) => {
  if (req.method !== 'GET' || path.extname(req.path)) return next();
  const clean = req.path.replace(/\/+$/, '');
  if (clean && req.path !== clean) return res.redirect(301, clean);
  const page = path.join(DIST, clean, 'index.html');
  if (page.startsWith(DIST) && fs.existsSync(page)) return res.sendFile(page);
  next();
});
app.use(express.static(DIST, { redirect: false, index: false, maxAge: '1h' }));
app.use((req, res) => {
  const nf = path.join(DIST, '404.html');
  res.status(404);
  fs.existsSync(nf) ? res.sendFile(nf) : res.send('404');
});

app.listen(PORT, () => console.log(`VuCore Site em http://localhost:${PORT}`));

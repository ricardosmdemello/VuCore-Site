import { visibleProducts } from './data/products.js';
import { isVisible } from './config/site.config.js';

/** Todas as rotas públicas (usadas no pré-render e no sitemap.xml). */
export const routes = [
  '/',
  ...(isVisible('downloads') ? ['/downloads'] : []),
  ...(isVisible('sobre') ? ['/sobre'] : []),
  ...visibleProducts().map((p) => `/produtos/${p.slug}`),
];

/**
 * Configuração central do site.
 *
 * - `siteUrl`: domínio público (usado em canonical, sitemap, Open Graph).
 * - `pages`: liga/desliga páginas. `false` = a página NÃO é gerada, não aparece
 *   no menu, na home, nem no sitemap.xml (e a rota retorna 404).
 *
 * A chave de cada produto é o `slug` definido em src/data/products.js.
 */
const siteConfig = {
  siteName: 'VuCore Platform',
  siteUrl: 'https://www.vucore.com.br',
  author: 'VuCore Platform',
  contactEmail: 'vucoreplatform@gmail.com',
  defaultLocale: 'pt_BR',
  /** Perfis oficiais (GitHub, LinkedIn, YouTube…) — reforçam a entidade no Google (Knowledge Graph). */
  sameAs: [],
  /** Verificação dos buscadores: cole aqui os códigos do Google Search Console e Bing Webmaster Tools. */
  verification: { google: '', bing: '' },
  /** Chave IndexNow (Bing, Yandex, Seznam…): string hex de 8–128 caracteres. Vazio = desativado. */
  indexNowKey: '',

  pages: {
    // Gratuitos
    'portugol-studio': true,
    'vucore-desktop-merge': true,
    'vucore-explorer': true,
    'vucore-inspector': true,
    'vucore-digest': true,
    // Pagos
    'vucore-crm': true,
    'chess-vs-llm': true,
    'vucore-db-designer': true,
    // Páginas institucionais
    downloads: true,
    sobre: true,
  },
};

export const isVisible = (key) => siteConfig.pages[key] !== false;
export default siteConfig;

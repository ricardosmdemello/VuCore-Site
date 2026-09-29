# VuCore Site

Site institucional dos produtos VuCore, em React + JavaScript (Vite), com páginas pré-renderizadas para SEO e contador interno de downloads.

## Comandos

```bash
npm install
npm run dev      # Vite (http://localhost:5173) + servidor de downloads (porta 3001)
npm run build    # build + pré-render de todas as páginas + sitemap.xml + robots.txt
npm start        # servidor de produção (dist/ + downloads + contagem) na porta 3001
```

Variáveis de ambiente do servidor: `PORT` (padrão 3001) e `STATS_TOKEN` (token do relatório de downloads).

## Ocultar páginas

Edite `src/config/site.config.js`:

```js
pages: {
  'chess-vs-llm': false,   // a página deixa de existir (menu, home, sitemap e downloads)
  sobre: false,
}
```

Depois rode `npm run build` de novo.

## Produtos

O conteúdo de cada página (descrição, funcionalidades, telas, FAQ, requisitos, preço) fica em `src/data/products.js`.
As imagens ficam em `public/images/<produto>/`. Uma tela sem `image` aparece com um marcador visual.

## Downloads e contagem

1. Coloque o instalador em `server/downloads/`, com o mesmo nome definido em `download.file` do produto.
2. Os botões apontam para `/download/<slug>`: o servidor soma +1 e entrega o arquivo.
3. Os contadores ficam em `server/data/downloads.json` (total por produto e histórico com data, referer e user-agent).
4. `GET /api/downloads/<slug>` devolve o contador público. O botão exibe esse número.
5. `GET /api/stats?token=<STATS_TOKEN>` devolve os totais, os totais por dia e os últimos 50 downloads.

## SEO

- Um HTML estático por rota (o conteúdo aparece para robôs sem precisar de JavaScript), com hidratação do React.
- `title`, `description`, `keywords`, `canonical`, Open Graph e Twitter Card por página.
- JSON-LD: `Organization`, `WebSite` e `ItemList` na home; `SoftwareApplication`, `BreadcrumbList` e `FAQPage` nos produtos.
- `sitemap.xml` e `robots.txt` são gerados só com as páginas visíveis.
- Ajuste `siteUrl` em `site.config.js` para o domínio real e cadastre o sitemap no Google Search Console e no Bing Webmaster Tools.

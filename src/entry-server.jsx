import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';

export { routes } from './routes.js';
export { default as siteConfig } from './config/site.config.js';

export function render(url) {
  const helmetContext = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );
  const { helmet } = helmetContext;
  const head = [helmet.title, helmet.meta, helmet.link, helmet.script].map((h) => h.toString()).join('\n');
  const htmlAttrs = helmet.htmlAttributes.toString();
  return { html, head, htmlAttrs };
}

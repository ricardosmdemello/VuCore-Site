import React from 'react';
import { Helmet } from 'react-helmet-async';
import siteConfig from '../config/site.config.js';

/** Corta no limite de palavra (Google exibe ~60 caracteres no título e ~155 na descrição). */
export const clip = (s, max) => (s.length <= max ? s : s.slice(0, s.lastIndexOf(' ', max - 1)).replace(/[\s,.:;–-]+$/, '') + '…');

export default function Seo({ title, description, path = '/', image, imageAlt, type = 'website', keywords, jsonLd, noindex }) {
  const url = siteConfig.siteUrl + (path === '/' ? '/' : path);
  const fullTitle = title ? `${title} | ${siteConfig.siteName}` : siteConfig.siteName;
  const desc = clip(description, 160);
  const img = siteConfig.siteUrl + (image || '/og/default.png');
  return (
    <Helmet>
      <html lang="pt-BR" />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={siteConfig.author} />
      <meta name="robots" content={noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'} />
      {!noindex && <link rel="canonical" href={url} />}
      {!noindex && <link rel="alternate" hrefLang="pt-BR" href={url} />}
      {!noindex && <link rel="alternate" hrefLang="x-default" href={url} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.siteName} />
      <meta property="og:locale" content={siteConfig.defaultLocale} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt || fullTitle} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}

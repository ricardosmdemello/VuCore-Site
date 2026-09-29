import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { visibleProducts } from '../data/products.js';
import siteConfig, { isVisible } from '../config/site.config.js';

export default function Home() {
  const free = visibleProducts('free');
  const paid = visibleProducts('paid');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', name: siteConfig.siteName, url: siteConfig.siteUrl, logo: siteConfig.siteUrl + '/favicon.png', email: siteConfig.contactEmail },
      { '@type': 'WebSite', name: siteConfig.siteName, url: siteConfig.siteUrl, inLanguage: 'pt-BR' },
      {
        '@type': 'ItemList',
        itemListElement: visibleProducts().map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${siteConfig.siteUrl}/produtos/${p.slug}`, name: p.name })),
      },
    ],
  };

  return (
    <>
      <Seo
        title="Software para Windows: desenvolvimento, segurança, educação e vendas"
        description="Baixe o Portugol Studio .NET, VuCore Explorer, VuCore Inspector, VuCore Desktop Merge, VuCore Digest e conheça o VuCore Desktop CRM, DB Designer e Chess vs LLM. Software rápido, privado e com IA local."
        keywords="software windows, ferramentas para desenvolvedores, portugol studio, explorador de arquivos, decompilador, crm offline, download grátis"
        jsonLd={jsonLd}
      />
      <section className="hero">
        <div className="container">
          <p className="eyebrow">Feito no Brasil · IA 100% local · Privacidade em primeiro lugar</p>
          <h1>Software que trabalha para você, <span className="grad">não para a nuvem.</span></h1>
          <p className="lead">
            Ferramentas desktop rápidas e privadas para quem programa, estuda, analisa e vende. Tudo roda no seu
            computador, sem assinatura escondida e sem enviar seus dados para terceiros.
          </p>
          <div className="actions">
            <a href="#produtos" className="btn btn-primary">Conhecer os produtos</a>
            {isVisible('downloads') && <Link to="/downloads" className="btn btn-ghost">Ir para downloads</Link>}
          </div>
          <ul className="stats">
            <li><strong>{visibleProducts().length}</strong> produtos</li>
            <li><strong>{free.length}</strong> gratuitos</li>
            <li><strong>100%</strong> offline</li>
          </ul>
        </div>
      </section>

      <section id="produtos" className="section container">
        {free.length > 0 && (
          <>
            <h2>Gratuitos</h2>
            <p className="muted">Baixe e use sem custo.</p>
            <div className="grid">{free.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
          </>
        )}
        {paid.length > 0 && (
          <>
            <h2 className="mt">Profissionais</h2>
            <p className="muted">Soluções completas para empresas, com versão de avaliação.</p>
            <div className="grid">{paid.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
          </>
        )}
      </section>

      <section className="section container why">
        <h2>Por que VuCore?</h2>
        <div className="grid">
          <div className="feature"><h3>⚡ Nativo e rápido</h3><p className="muted">Aplicativos .NET 10 nativos, que abrem em segundos e não pesam no seu PC.</p></div>
          <div className="feature"><h3>🔒 Seus dados ficam com você</h3><p className="muted">Nada é enviado para servidores externos. IA e indexação rodam localmente.</p></div>
          <div className="feature"><h3>🇧🇷 Em português</h3><p className="muted">Interfaces, documentação e suporte em português do Brasil.</p></div>
        </div>
      </section>
    </>
  );
}

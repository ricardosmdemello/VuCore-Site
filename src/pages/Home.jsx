import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Icon from '../components/Icon.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { visibleProducts } from '../data/products.js';
import siteConfig, { isVisible } from '../config/site.config.js';

const pillars = [
  { icon: 'zap', title: 'Nativo e rápido', text: 'Aplicativos .NET 10 nativos que abrem em segundos e não pesam no seu computador.' },
  { icon: 'shield', title: 'Seus dados ficam com você', text: 'Nada é enviado para servidores externos. IA e indexação rodam localmente.' },
  { icon: 'globe', title: 'Em português', text: 'Interfaces, documentação e suporte em português do Brasil.' },
];

export default function Home() {
  const free = visibleProducts('free');
  const paid = visibleProducts('paid');
  const showcase = visibleProducts().find((p) => p.heroImage && !p.heroImage.endsWith('.svg'));
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
        <div className="container hero-split">
          <div>
            <p className="pill"><span className="dot" aria-hidden="true" /> Feito no Brasil · IA 100% local</p>
            <h1>Software que trabalha para você, <span className="grad">não para a nuvem.</span></h1>
            <p className="lead">
              Ferramentas desktop rápidas e privadas para quem programa, estuda, analisa e vende. Tudo roda no seu
              computador, sem assinatura escondida e sem enviar seus dados para terceiros.
            </p>
            <div className="actions">
              <Link to={{ pathname: '/', hash: '#produtos' }} className="btn btn-primary">Conhecer os produtos <Icon name="arrow" size={18} /></Link>
              {isVisible('downloads') && <Link to="/downloads" className="btn btn-ghost">Ir para downloads</Link>}
            </div>
            <ul className="stats">
              <li><strong>{visibleProducts().length}</strong> produtos</li>
              <li><strong>{free.length}</strong> gratuitos</li>
              <li><strong>0</strong> dados enviados à nuvem</li>
            </ul>
          </div>
          {showcase && (
            <Link to={`/produtos/${showcase.slug}`} className="showcase" aria-label={`Ver ${showcase.name}`}>
              <div className="window">
                <div className="window-bar" aria-hidden="true"><i /><i /><i /><span>{showcase.name}</span></div>
                <img src={showcase.heroImage} alt={`Tela do ${showcase.name}`} width="960" height="540" fetchpriority="high" />
              </div>
            </Link>
          )}
        </div>
      </section>

      <section id="produtos" className="section container">
        {free.length > 0 && (
          <>
            <header className="section-head">
              <p className="kicker">Gratuitos</p>
              <h2>Baixe e use sem custo</h2>
              <p className="muted">Ferramentas completas para estudar, desenvolver e analisar, sem cadastro.</p>
            </header>
            <div className="grid">{free.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
          </>
        )}
        {paid.length > 0 && (
          <>
            <header className="section-head mt">
              <p className="kicker">Profissionais</p>
              <h2>Soluções completas para empresas</h2>
              <p className="muted">Todos com versão de avaliação para você testar antes de comprar.</p>
            </header>
            <div className="grid">{paid.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
          </>
        )}
      </section>

      <section className="section container">
        <header className="section-head">
          <p className="kicker">Por que VuCore</p>
          <h2>Construído com três princípios</h2>
        </header>
        <div className="grid grid-3">
          {pillars.map((x) => (
            <div className="feature" key={x.title}>
              <span className="feature-icon"><Icon name={x.icon} size={22} /></span>
              <h3>{x.title}</h3>
              <p className="muted">{x.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="cta-band">
          <div>
            <h2>Precisa de licença para sua empresa?</h2>
            <p className="muted">Fale com a gente sobre licenças comerciais, suporte e parcerias.</p>
          </div>
          <div className="actions">
            <a className="btn btn-primary" href={`mailto:${siteConfig.contactEmail}`}><Icon name="mail" size={18} /> Falar com vendas</a>
            {isVisible('downloads') && <Link to="/downloads" className="btn btn-ghost">Ver downloads</Link>}
          </div>
        </div>
      </section>
    </>
  );
}

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import DownloadButton from '../components/DownloadButton.jsx';
import NotFound from './NotFound.jsx';
import { findProduct } from '../data/products.js';
import siteConfig from '../config/site.config.js';

export default function Product() {
  const { slug } = useParams();
  const p = findProduct(slug);
  if (!p) return <NotFound />;

  const path = `/produtos/${p.slug}`;
  const url = siteConfig.siteUrl + path;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: p.name,
        description: p.description[0],
        applicationCategory: p.category,
        operatingSystem: p.requirements[0],
        url,
        image: siteConfig.siteUrl + (p.heroImage || '/favicon.png'),
        downloadUrl: p.download?.file ? `${siteConfig.siteUrl}/download/${p.slug}` : undefined,
        featureList: p.features.map((x) => x.title).join(', '),
        inLanguage: 'pt-BR',
        author: { '@type': 'Person', name: siteConfig.author },
        ...(p.pricing === 'free' ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' } } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: siteConfig.siteUrl + '/' },
          { '@type': 'ListItem', position: 2, name: p.name, item: url },
        ],
      },
      ...(p.faq?.length
        ? [{ '@type': 'FAQPage', mainEntity: p.faq.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })) }]
        : []),
    ],
  };

  return (
    <article style={{ '--accent': p.color }}>
      <Seo
        title={`${p.name}: ${p.tagline}`.slice(0, 65)}
        description={p.description[0].slice(0, 158)}
        keywords={p.keywords}
        path={path}
        image={p.heroImage}
        jsonLd={jsonLd}
      />
      <section className="hero product-hero">
        <div className="container hero-split">
          <div>
            <nav className="crumbs" aria-label="Trilha"><Link to="/">Início</Link> / <span>{p.name}</span></nav>
            <p className="eyebrow">
              <span className={`badge ${p.pricing}`}>{p.pricing === 'free' ? 'Gratuito' : 'Profissional'}</span>
              {p.status && <span className="badge beta">{p.status}</span>}
            </p>
            <h1>{p.icon} {p.name}</h1>
            <p className="lead">{p.tagline}</p>
            <div className="actions">
              <DownloadButton product={p} />
              {p.pricing === 'paid' && (
                <a className="btn btn-ghost" href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent('Licença ' + p.name)}`}>
                  💼 Comprar licença
                </a>
              )}
            </div>
            {p.download?.label && <p className="muted small">{p.download.label} · {p.requirements.join(' · ')}</p>}
            {p.pricing === 'paid' && p.price && <p className="price">{p.price}</p>}
          </div>
          {p.heroImage && <img className="hero-img" src={p.heroImage} alt={`Tela do ${p.name}`} width="960" height="540" />}
        </div>
      </section>

      <section className="section container narrow">
        <h2>O que é o {p.name}?</h2>
        {p.description.map((d, i) => <p key={i}>{d}</p>)}
        {p.audience && (
          <>
            <h3>Para quem é</h3>
            <ul className="checks">{p.audience.map((a) => <li key={a}>{a}</li>)}</ul>
          </>
        )}
      </section>

      <section className="section container">
        <h2>Funcionalidades</h2>
        <div className="grid">
          {p.features.map((x) => (
            <div className="feature" key={x.title}><h3>{x.title}</h3><p className="muted">{x.text}</p></div>
          ))}
        </div>
      </section>

      <section className="section container">
        <h2>Telas</h2>
        <div className="screens">
          {p.screens.map((s) => (
            <figure className="screen" key={s.name}>
              {s.image ? (
                <img src={s.image} alt={`${p.name}: ${s.name}`} loading="lazy" width="800" height="450" />
              ) : (
                <div className="screen-ph" aria-hidden="true"><span>{p.icon}</span></div>
              )}
              <figcaption><strong>{s.name}</strong><span className="muted">{s.text}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section container two-col">
        <div>
          <h2>Requisitos</h2>
          <ul className="checks">{p.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
        <div>
          <h2>Tecnologia</h2>
          <ul className="tags">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          {p.license && <p className="muted">Licença: {p.license}</p>}
        </div>
      </section>

      {p.faq?.length > 0 && (
        <section className="section container narrow">
          <h2>Perguntas frequentes</h2>
          {p.faq.map((x) => (
            <details key={x.q} className="faq"><summary>{x.q}</summary><p>{x.a}</p></details>
          ))}
        </section>
      )}

      <section className="section container cta">
        <h2>Pronto para experimentar o {p.name}?</h2>
        <div className="actions center"><DownloadButton product={p} /></div>
      </section>
    </article>
  );
}

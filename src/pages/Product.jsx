import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Icon from '../components/Icon.jsx';
import ProductIcon from '../components/ProductIcon.jsx';
import DownloadButton from '../components/DownloadButton.jsx';
import NotFound from './NotFound.jsx';
import { findProduct } from '../data/products.js';
import siteConfig from '../config/site.config.js';

/** Visualizador de telas em tela cheia; Esc fecha, setas navegam. */
function Lightbox({ shots, index, onClose, onMove }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove(1);
      if (e.key === 'ArrowLeft') onMove(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onMove]);
  const s = shots[index];
  const move = (d) => (e) => { e.stopPropagation(); onMove(d); };
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={s.name} onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={s.image} alt={s.name} />
        <figcaption><strong>{s.name}</strong> <span className="muted">{s.text}</span></figcaption>
      </figure>
      <button className="lb-close" aria-label="Fechar" autoFocus onClick={onClose}><Icon name="close" size={22} /></button>
      {shots.length > 1 && (
        <>
          <button className="lb-nav prev" aria-label="Anterior" onClick={move(-1)}><Icon name="arrow" size={22} /></button>
          <button className="lb-nav next" aria-label="Próxima" onClick={move(1)}><Icon name="arrow" size={22} /></button>
        </>
      )}
    </div>
  );
}

export default function Product() {
  const { slug } = useParams();
  const p = findProduct(slug);
  const [shot, setShot] = useState(null);
  if (!p) return <NotFound />;

  const path = `/produtos/${p.slug}`;
  const url = siteConfig.siteUrl + path;
  const shots = p.screens.filter((s) => s.image);
  const salesMail = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent('Licença ' + p.name)}`;
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

  const sections = [
    ['visao-geral', 'Visão geral'],
    ['funcionalidades', 'Funcionalidades'],
    ['telas', 'Telas'],
    ['requisitos', 'Requisitos'],
    ...(p.faq?.length ? [['faq', 'Perguntas']] : []),
  ];

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
        <div className={`container ${p.heroImage ? 'hero-split' : ''}`}>
          <div>
            <nav aria-label="Trilha">
              <ol className="crumbs">
                <li><Link to="/">Início</Link></li>
                <li><Link to={{ pathname: '/', hash: '#produtos' }}>Produtos</Link></li>
                <li aria-current="page">{p.name}</li>
              </ol>
            </nav>
            <div className="product-title">
              <ProductIcon product={p} size="lg" />
              <div>
                <p className="badges">
                  <span className={`badge ${p.pricing}`}>{p.pricing === 'free' ? 'Gratuito' : 'Profissional'}</span>
                  {p.status && <span className="badge beta">{p.status}</span>}
                </p>
                <h1>{p.name}</h1>
              </div>
            </div>
            <p className="lead">{p.tagline}</p>
            <div className="actions">
              <DownloadButton product={p} />
              {p.pricing === 'paid' && (
                <a className="btn btn-ghost" href={salesMail}><Icon name="briefcase" size={18} /> Comprar licença</a>
              )}
            </div>
            <ul className="meta">
              {p.download?.label && <li><Icon name="download" size={16} /> {p.download.label}</li>}
              <li><Icon name="monitor" size={16} /> {p.requirements[0]}</li>
              {p.pricing === 'paid' && p.price && <li><Icon name="briefcase" size={16} /> {p.price}</li>}
              {p.license && <li><Icon name="shield" size={16} /> Licença {p.license}</li>}
            </ul>
          </div>
          {p.heroImage && (
            <div className="window">
              <div className="window-bar" aria-hidden="true"><i /><i /><i /><span>{p.name}</span></div>
              <img src={p.heroImage} alt={`Tela do ${p.name}`} width="960" height="540" fetchpriority="high" />
            </div>
          )}
        </div>
      </section>

      <nav className="subnav" aria-label="Seções da página">
        <div className="container subnav-inner">
          {sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          <span className="subnav-cta"><DownloadButton product={p} showCount={false} className="btn btn-primary btn-sm" /></span>
        </div>
      </nav>

      <section id="visao-geral" className="section container narrow">
        <h2>O que é o {p.name}?</h2>
        {p.description.map((d, i) => <p key={i} className="prose">{d}</p>)}
        {p.audience && (
          <>
            <h3 className="mt-sm">Para quem é</h3>
            <ul className="checks">{p.audience.map((a) => <li key={a}><Icon name="check" size={18} />{a}</li>)}</ul>
          </>
        )}
      </section>

      <section id="funcionalidades" className="section container">
        <header className="section-head">
          <p className="kicker">Funcionalidades</p>
          <h2>Tudo o que o {p.name} faz</h2>
        </header>
        <div className="grid grid-3">
          {p.features.map((x) => (
            <div className="feature" key={x.title}>
              <h3><span className="feature-dot" aria-hidden="true" />{x.title}</h3>
              <p className="muted">{x.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="telas" className="section container">
        <header className="section-head">
          <p className="kicker">Telas</p>
          <h2>Conheça a interface</h2>
        </header>
        <div className="screens">
          {p.screens.map((s) => (
            <figure className="screen" key={s.name}>
              {s.image ? (
                <button className="screen-btn" onClick={() => setShot(shots.indexOf(s))} aria-label={`Ampliar: ${s.name}`}>
                  <img src={s.image} alt={`${p.name}: ${s.name}`} loading="lazy" width="800" height="450" />
                </button>
              ) : (
                <div className="screen-ph" aria-hidden="true">
                  <Icon name="image" size={28} />
                  <span>Captura em breve</span>
                </div>
              )}
              <figcaption><strong>{s.name}</strong><span className="muted">{s.text}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="requisitos" className="section container">
        <div className="specs">
          <div>
            <h2>Requisitos</h2>
            <ul className="checks">{p.requirements.map((r) => <li key={r}><Icon name="check" size={18} />{r}</li>)}</ul>
          </div>
          <div>
            <h2>Tecnologia</h2>
            <ul className="tags">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
            {p.license && <p className="muted small mt-sm">Licença: {p.license}</p>}
          </div>
        </div>
      </section>

      {p.faq?.length > 0 && (
        <section id="faq" className="section container narrow">
          <h2>Perguntas frequentes</h2>
          {p.faq.map((x) => (
            <details key={x.q} className="faq"><summary>{x.q}</summary><p>{x.a}</p></details>
          ))}
        </section>
      )}

      <section className="section container">
        <div className="cta-band">
          <div>
            <h2>Pronto para experimentar o {p.name}?</h2>
            <p className="muted">{p.download?.label}{p.pricing === 'free' ? ' · gratuito, sem cadastro' : ' · avaliação completa'}</p>
          </div>
          <div className="actions">
            <DownloadButton product={p} showCount={false} />
            {p.pricing === 'paid' && <a className="btn btn-ghost" href={salesMail}>Falar com vendas</a>}
          </div>
        </div>
      </section>

      {shot !== null && (
        <Lightbox
          shots={shots}
          index={shot}
          onClose={() => setShot(null)}
          onMove={(d) => setShot((i) => (i + d + shots.length) % shots.length)}
        />
      )}
    </article>
  );
}

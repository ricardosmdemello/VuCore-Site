import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import DownloadButton from '../components/DownloadButton.jsx';
import { visibleProducts } from '../data/products.js';

const Table = ({ items }) => (
  <div className="dl-list">
    {items.map((p) => (
      <div className="dl-row" key={p.slug} style={{ '--accent': p.color }}>
        <span className="card-icon" aria-hidden="true">{p.icon}</span>
        <div className="dl-info">
          <Link className="stretched" to={`/produtos/${p.slug}`}><strong>{p.name}</strong></Link>
          <span className="muted small">{p.download?.label} · {p.requirements[0]}</span>
        </div>
        <DownloadButton product={p} className="btn btn-primary btn-sm" />
      </div>
    ))}
  </div>
);

export default function Downloads() {
  return (
    <section className="section container narrow">
      <Seo
        title="Downloads"
        description="Baixe grátis o Portugol Studio .NET, VuCore Explorer, VuCore Inspector, VuCore Desktop Merge, VuCore Digest e versões de avaliação dos produtos profissionais VuCore."
        path="/downloads"
        keywords="download, baixar grátis, portugol studio download, vucore download"
      />
      <h1>Downloads</h1>
      <p className="lead">Escolha o software e clique em baixar. Todas as versões são para Windows x64, salvo indicação.</p>
      <h2>Gratuitos</h2>
      <Table items={visibleProducts('free')} />
      <h2 className="mt">Profissionais (avaliação)</h2>
      <Table items={visibleProducts('paid')} />
    </section>
  );
}

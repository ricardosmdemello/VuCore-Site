import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import DownloadButton from '../components/DownloadButton.jsx';
import ProductIcon from '../components/ProductIcon.jsx';
import { visibleProducts } from '../data/products.js';

const Table = ({ items }) => (
  <div className="dl-list">
    {items.map((p) => (
      <div className="dl-row" key={p.slug} style={{ '--accent': p.color }}>
        <ProductIcon product={p} />
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
      <header className="page-head">
        <p className="kicker">Downloads</p>
        <h1>Baixe o software VuCore</h1>
        <p className="lead">Escolha o produto e clique em baixar. Todas as versões são para Windows x64, salvo indicação.</p>
      </header>
      <h2 className="list-title">Gratuitos</h2>
      <Table items={visibleProducts('free')} />
      <h2 className="list-title mt">Profissionais <span className="muted small">· versão de avaliação</span></h2>
      <Table items={visibleProducts('paid')} />
    </section>
  );
}

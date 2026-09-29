import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <article className="card" style={{ '--accent': product.color }}>
      <div className="card-top">
        <span className="card-icon" aria-hidden="true">{product.icon}</span>
        <span className={`badge ${product.pricing}`}>{product.pricing === 'free' ? 'Gratuito' : 'Profissional'}</span>
      </div>
      <h3><Link className="stretched" to={`/produtos/${product.slug}`}>{product.name}</Link></h3>
      <p className="muted">{product.tagline}</p>
      <span className="card-link" aria-hidden="true">Saiba mais →</span>
    </article>
  );
}

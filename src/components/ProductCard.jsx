import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import ProductIcon from './ProductIcon.jsx';

export default function ProductCard({ product }) {
  return (
    <article className="card" style={{ '--accent': product.color }}>
      <div className="card-top">
        <ProductIcon product={product} />
        <span className="badges">
          {product.status && <span className="badge beta">{product.status}</span>}
          <span className={`badge ${product.pricing}`}>{product.pricing === 'free' ? 'Gratuito' : 'Profissional'}</span>
        </span>
      </div>
      <h3><Link className="stretched" to={`/produtos/${product.slug}`}>{product.name}</Link></h3>
      <p className="muted">{product.tagline}</p>
      <span className="card-link" aria-hidden="true">Ver detalhes <Icon name="arrow" size={16} /></span>
    </article>
  );
}

import React from 'react';
import Icon from './Icon.jsx';

/** Logo do produto quando existir; senão, ícone SVG na cor de destaque. */
export default function ProductIcon({ product, size = 'md' }) {
  return (
    <span className={`card-icon ${size}`} style={{ '--accent': product.color }} aria-hidden="true">
      {product.logo ? <img src={product.logo} alt="" width="28" height="28" /> : <Icon name={product.icon} size={size === 'lg' ? 30 : 24} />}
    </span>
  );
}

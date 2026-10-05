import React, { useEffect, useState } from 'react';
import Icon from './Icon.jsx';

/** Link para /download/:slug — o servidor incrementa o contador e entrega o arquivo. */
export default function DownloadButton({ product, showCount = true, className = 'btn btn-primary' }) {
  const [count, setCount] = useState(null);
  const refresh = () =>
    fetch(`/api/downloads/${product.slug}`)
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});

  useEffect(() => {
    if (showCount) refresh();
  }, [product.slug]);

  if (!product.download?.file) return null;
  const label = product.pricing === 'paid' ? 'Baixar avaliação' : 'Baixar grátis';
  return (
    <span className="download-wrap">
      <a
        href={`/download/${product.slug}`}
        className={className}
        rel="nofollow"
        aria-label={`${label}: ${product.name}`}
        onClick={() => setTimeout(refresh, 1500)}
      >
        <Icon name="download" size={18} /> {label}
      </a>
      {showCount && count > 0 && <small className="muted">{count.toLocaleString('pt-BR')} downloads</small>}
    </span>
  );
}

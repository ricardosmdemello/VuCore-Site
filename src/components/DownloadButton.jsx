import React, { useEffect, useState } from 'react';

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
  return (
    <span className="download-wrap">
      <a href={`/download/${product.slug}`} className={className} rel="nofollow" onClick={() => setTimeout(refresh, 1500)}>
        ⬇ {product.pricing === 'paid' ? 'Baixar avaliação' : 'Baixar grátis'}
      </a>
      {showCount && count !== null && <small className="muted">{count.toLocaleString('pt-BR')} downloads</small>}
    </span>
  );
}

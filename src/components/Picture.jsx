import React from 'react';

/** <img> com fonte WebP gerada por scripts/images.js para PNGs de /images (fallback no PNG original). */
export default function Picture({ src, ...img }) {
  const webp = src.startsWith('/images/') && src.endsWith('.png') && !src.endsWith('logo.png') ? src.replace(/\.png$/, '.webp') : null;
  if (!webp) return <img src={src} decoding="async" {...img} />;
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img src={src} decoding="async" {...img} />
    </picture>
  );
}

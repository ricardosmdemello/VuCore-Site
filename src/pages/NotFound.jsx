import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { isVisible } from '../config/site.config.js';

export default function NotFound() {
  return (
    <section className="section container narrow center not-found">
      <Seo title="Página não encontrada" description="A página que você procura não existe." path="/404" noindex />
      <p className="kicker">Erro 404</p>
      <h1>Página não encontrada</h1>
      <p className="lead">O endereço pode ter mudado ou o produto não está mais disponível.</p>
      <div className="actions center">
        <Link to="/" className="btn btn-primary">Voltar ao início</Link>
        {isVisible('downloads') && <Link to="/downloads" className="btn btn-ghost">Ver downloads</Link>}
      </div>
    </section>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function NotFound() {
  return (
    <section className="section container narrow center">
      <Seo title="Página não encontrada" description="A página que você procura não existe." path="/404" noindex />
      <h1>404</h1>
      <p className="lead">Página não encontrada.</p>
      <Link to="/" className="btn btn-primary">Voltar ao início</Link>
    </section>
  );
}

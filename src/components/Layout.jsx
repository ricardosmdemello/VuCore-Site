import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import siteConfig, { isVisible } from '../config/site.config.js';
import { visibleProducts } from '../data/products.js';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand" onClick={close}>
            <span className="brand-mark" aria-hidden="true">V</span>
            {siteConfig.siteName}
          </Link>
          <button className="menu-btn" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
          <nav className={`nav ${open ? 'open' : ''}`} aria-label="Principal">
            <NavLink to="/" end onClick={close}>Início</NavLink>
            <a href="/#produtos" onClick={close}>Produtos</a>
            {isVisible('downloads') && <NavLink to="/downloads" onClick={close}>Downloads</NavLink>}
            {isVisible('sobre') && <NavLink to="/sobre" onClick={close}>Sobre</NavLink>}
          </nav>
        </div>
      </header>
      <main id="conteudo">{children}</main>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <strong>{siteConfig.siteName}</strong>
            <p className="muted">Software para desenvolvedores, estudantes e empresas, feito no Brasil.</p>
            <p><a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></p>
          </div>
          <div>
            <strong>Gratuitos</strong>
            <ul>{visibleProducts('free').map((p) => <li key={p.slug}><Link to={`/produtos/${p.slug}`}>{p.name}</Link></li>)}</ul>
          </div>
          <div>
            <strong>Profissionais</strong>
            <ul>{visibleProducts('paid').map((p) => <li key={p.slug}><Link to={`/produtos/${p.slug}`}>{p.name}</Link></li>)}</ul>
          </div>
        </div>
        <div className="container copy muted">© {new Date().getFullYear()} {siteConfig.author}. Todos os direitos reservados.</div>
      </footer>
    </>
  );
}

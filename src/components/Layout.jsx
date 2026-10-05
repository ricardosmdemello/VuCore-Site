import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import siteConfig, { isVisible } from '../config/site.config.js';
import { visibleProducts } from '../data/products.js';
import Icon from './Icon.jsx';

/** Volta ao topo ao trocar de página e rola até a âncora (#produtos) quando houver. */
function useScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) return el.scrollIntoView({ behavior: 'smooth' });
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);
  useScrollManager();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="brand" onClick={close} aria-label={`${siteConfig.siteName}, página inicial`}>
            <span className="brand-mark" aria-hidden="true">Vu</span>
            <span>{siteConfig.siteName}</span>
          </Link>
          <button className="menu-btn" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
          <nav id="menu" className={`nav ${open ? 'open' : ''}`} aria-label="Principal">
            <NavLink to="/" end onClick={close}>Início</NavLink>
            <Link to={{ pathname: '/', hash: '#produtos' }} onClick={close}>Produtos</Link>
            {isVisible('sobre') && <NavLink to="/sobre" onClick={close}>Sobre</NavLink>}
            {isVisible('downloads') && (
              <NavLink to="/downloads" className="btn btn-primary btn-sm nav-cta" onClick={close}>
                <Icon name="download" size={16} /> Downloads
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1}>{children}</main>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <Link to="/" className="brand"><span className="brand-mark" aria-hidden="true">Vu</span>{siteConfig.siteName}</Link>
            <p className="muted footer-about">Software desktop para desenvolvedores, estudantes e empresas. Rápido, privado e feito no Brasil.</p>
            <a className="footer-mail" href={`mailto:${siteConfig.contactEmail}`}><Icon name="mail" size={16} /> {siteConfig.contactEmail}</a>
          </div>
          <div>
            <h2 className="footer-title">Gratuitos</h2>
            <ul>{visibleProducts('free').map((p) => <li key={p.slug}><Link to={`/produtos/${p.slug}`}>{p.name}</Link></li>)}</ul>
          </div>
          <div>
            <h2 className="footer-title">Profissionais</h2>
            <ul>{visibleProducts('paid').map((p) => <li key={p.slug}><Link to={`/produtos/${p.slug}`}>{p.name}</Link></li>)}</ul>
          </div>
          <div>
            <h2 className="footer-title">Empresa</h2>
            <ul>
              {isVisible('sobre') && <li><Link to="/sobre">Sobre</Link></li>}
              {isVisible('downloads') && <li><Link to="/downloads">Downloads</Link></li>}
              <li><a href={`mailto:${siteConfig.contactEmail}`}>Contato</a></li>
            </ul>
          </div>
        </div>
        <div className="container copy muted">
          <span>© {new Date().getFullYear()} {siteConfig.author}. Todos os direitos reservados.</span>
          <span>Feito no Brasil</span>
        </div>
      </footer>
    </>
  );
}

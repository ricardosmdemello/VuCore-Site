import React from 'react';
import Seo from '../components/Seo.jsx';
import Icon from '../components/Icon.jsx';
import siteConfig from '../config/site.config.js';

const principles = [
  { icon: 'zap', title: 'Desempenho nativo', text: 'Aplicativos .NET modernos, sem navegador embutido, que respondem na hora.' },
  { icon: 'shield', title: 'Privacidade total', text: 'Recursos de IA rodam no seu computador. Seus dados não vão para a nuvem.' },
  { icon: 'globe', title: 'Em português', text: 'Interfaces, documentação e suporte pensados para quem fala português.' },
];

export default function About() {
  return (
    <section className="section container narrow">
      <Seo title="Sobre" description={`Conheça a ${siteConfig.siteName}: software desktop brasileiro, rápido, privado e com IA local.`} path="/sobre" />
      <header className="page-head">
        <p className="kicker">Sobre</p>
        <h1>Sobre a {siteConfig.siteName}</h1>
        <p className="lead">
          A {siteConfig.siteName} desenvolve software desktop para desenvolvedores, estudantes, profissionais de segurança e
          empresas.
        </p>
      </header>
      <p className="prose">
        Todos os produtos são construídos em .NET moderno por {siteConfig.author}. Recursos de inteligência artificial rodam
        no próprio computador do usuário, sem enviar dados para a nuvem.
      </p>
      <div className="grid grid-3 mt-sm">
        {principles.map((x) => (
          <div className="feature" key={x.title}>
            <span className="feature-icon"><Icon name={x.icon} size={22} /></span>
            <h3>{x.title}</h3>
            <p className="muted">{x.text}</p>
          </div>
        ))}
      </div>
      <div className="cta-band mt">
        <div>
          <h2>Contato</h2>
          <p className="muted">Licenças, suporte e parcerias.</p>
        </div>
        <a className="btn btn-primary" href={`mailto:${siteConfig.contactEmail}`}><Icon name="mail" size={18} /> {siteConfig.contactEmail}</a>
      </div>
    </section>
  );
}

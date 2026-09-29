import React from 'react';
import Seo from '../components/Seo.jsx';
import siteConfig from '../config/site.config.js';

export default function About() {
  return (
    <section className="section container narrow">
      <Seo title="Sobre" description={`Conheça a ${siteConfig.siteName}: software desktop brasileiro, rápido, privado e com IA local.`} path="/sobre" />
      <h1>Sobre a {siteConfig.siteName}</h1>
      <p className="lead">
        A {siteConfig.siteName} desenvolve software desktop para desenvolvedores, estudantes, profissionais de segurança e
        empresas, com três princípios: desempenho nativo, privacidade total e interface em português.
      </p>
      <p>
        Todos os produtos são construídos em .NET moderno por {siteConfig.author}. Recursos de inteligência artificial rodam
        no próprio computador do usuário, sem enviar dados para a nuvem.
      </p>
      <h2>Contato</h2>
      <p>Licenças, suporte e parcerias: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></p>
    </section>
  );
}

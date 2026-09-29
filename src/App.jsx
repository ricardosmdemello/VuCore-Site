import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Downloads from './pages/Downloads.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import { isVisible } from './config/site.config.js';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos/:slug" element={<Product />} />
        {isVisible('downloads') && <Route path="/downloads" element={<Downloads />} />}
        {isVisible('sobre') && <Route path="/sobre" element={<About />} />}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

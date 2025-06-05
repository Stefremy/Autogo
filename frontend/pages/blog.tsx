import React from 'react';

import Layout from "./MainLayout";
export default function Blog() {
  return (
    <Layout>
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ color: '#1a237e' }}>Blog</h1>
      <hr />
      <p>Artigos e novidades sobre o mundo automóvel.</p>
      {/* TODO: Adicione aqui a lista de artigos */}
    </main>
    </Layout>
  );
}
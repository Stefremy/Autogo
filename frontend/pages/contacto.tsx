import React from 'react';
import Layout from "./MainLayout";

export default function Contacto() {
  return (
    <Layout>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ color: '#1a237e' }}>Contacto</h1>
        <hr />
        <p>Entre em contacto connosco ou preencha o formulário abaixo.</p>
        {/* TODO: Adicione aqui o formulário e informações de contacto */}
      </main>
    </Layout>
  );
}
import React from 'react';
import Layout from "./MainLayout";

export default function Viaturas() {
  return (
    <Layout>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ color: '#1a237e' }}>Viaturas</h1>
        <hr />
        <p>Lista de todos os carros disponíveis.</p>
        {/* TODO: Adicione aqui a listagem dinâmica dos carros */}
      </main>
    </Layout>
  );
}
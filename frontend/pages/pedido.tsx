import React from 'react';
import Layout from "../components/MainLayout";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Pedido() {
  return (
    <Layout>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ color: '#1a237e' }}>Pedido de Carro</h1>
        <hr />
        <p>Faça o seu pedido personalizado de viatura.</p>
        {/* TODO: Adicione aqui o formulário de pedido */}
      </main>
    </Layout>
  );}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
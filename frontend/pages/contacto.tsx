import React from 'react';
import Layout from "../components/MainLayout";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Contacto() {
  const { t } = useTranslation('common');
  return (
    <Layout>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ color: '#1a237e' }}>{t('Contacto')}</h1>
        <hr />
        <p>{t('Entre em contacto connosco ou preencha o formulário abaixo.')}</p>
        {/* TODO: Adicione aqui o formulário e informações de contacto */}
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
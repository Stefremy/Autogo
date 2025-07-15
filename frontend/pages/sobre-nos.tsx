import React from 'react';
import MainLayout from "../components/MainLayout";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function SobreNos() {
  return (
    <MainLayout>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ color: '#1a237e' }}>Sobre nós</h1>
        <hr />
        <p>
          A AutoGo.pt é especializada na importação de carros europeus, oferecendo um serviço transparente, rápido e sem complicações. Nossa missão é entregar o carro dos seus sonhos, legalizado e pronto a rolar em Portugal.
        </p>
        {/* Adicione mais conteúdo sobre a empresa, equipa, valores, etc. */}
      </main>
    </MainLayout>
  );}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
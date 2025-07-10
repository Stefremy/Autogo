import React from 'react';
import Layout from "../components/MainLayout";

export default function ComoFunciona() {
  return (
    <Layout>
      <div className="relative w-full min-h-screen overflow-hidden">
        {/* Video watermark background behind only the header */}
        <div className="relative">
          <div className="absolute inset-0 w-full h-32 md:h-40 overflow-hidden rounded-b-3xl z-0">
            <video
              className="w-full h-full object-cover opacity-30 blur-sm pointer-events-none"
              src="/images/reboque.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-white/60" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto pt-12 pb-8 px-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e] drop-shadow-lg mb-4">Como Funciona</h1>
            <hr className="mb-6 border-[#1a237e]/30" />
          </div>
        </div>
        <main className="relative z-20 max-w-3xl mx-auto py-8 px-6">
          <p className="mb-8 text-lg text-gray-800">Veja os passos do processo de importação de viaturas.</p>
          {/* TODO: Adicione aqui os passos do processo */}
        </main>
      </div>
    </Layout>
  );}
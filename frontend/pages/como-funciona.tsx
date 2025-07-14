import React from 'react';
import Layout from "../components/MainLayout";

export default function ComoFunciona() {
  const [openStep, setOpenStep] = React.useState<number | null>(null);
  const steps = [
    {
      title: 'Veículos em Stock e Pré-seleção',
      content: (
        <>
          <p>A Autogo mantém um <b>stock de viaturas importadas</b>, criteriosamente selecionadas nos principais mercados da UE (como Alemanha, França, Bélgica e Holanda) ou até fora da UE, conforme a disponibilidade e interesse. Qualquer veículo em stock pode ser <b>reservado de imediato</b>, garantindo prioridade no envio.</p>
        </>
      ),
    },
    {
      title: 'Reserva de Viaturas “à Medida”',
      content: (
        <>
          <p>Se procuras um modelo específico, nova versão ou versão limitada, a Autogo pode tratar da importação por encomenda diretamente ao fornecedor:</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Procuramos e validamos o veículo junto do fornecedor (concessionário ou plataforma de vendas).</li>
            <li>Confirmamos todos os detalhes: make, modelo, ano, quilometragem e estado documental (incluindo o Certificado de Conformidade – COC).</li>
            <li>Após validação, reservamos o veículo e iniciamos o processo de compra.</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Transporte e Logística',
      content: (
        <>
          <p>Depois da compra, o veículo é enviado para Portugal utilizando métodos adaptados à origem:</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li><b>Dentro da UE</b>, o transporte é mais rápido e sem taxas adicionais.</li>
            <li><b>Fora da UE</b>, utiliza-se transporte marítimo (Ro‑Ro ou contentor), incluindo seguros e desembaraço aduaneiro.</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Documentação e Legalização em Portugal',
      content: (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-[#b42121]/20 rounded-xl mb-2">
              <thead>
                <tr className="bg-[#fbe9e9] text-[#b42121]">
                  <th className="p-2 text-left">Fase</th>
                  <th className="p-2 text-left">O que acontece</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#b42121]/10">
                  <td className="p-2 font-semibold">Registo Aduaneiro (DAV)</td>
                  <td className="p-2">Declaração Aduaneira de Veículos (DAV) no Portal das Finanças, habilita circulação temporária. <b>Prazo: 20 dias após chegada</b></td>
                </tr>
                <tr className="border-b border-[#b42121]/10">
                  <td className="p-2 font-semibold">Inspeção Técnica (IPO/Inspeção B)</td>
                  <td className="p-2">Obrigatória em veículos &gt;4 anos. O veículo é inspecionado e recebe o Certificado Modelo 112.</td>
                </tr>
                <tr className="border-b border-[#b42121]/10">
                  <td className="p-2 font-semibold">Homologação do COC</td>
                  <td className="p-2">O Certificado de Conformidade é homologado no IMT para garantir conformidade técnica com o veículo.</td>
                </tr>
                <tr className="border-b border-[#b42121]/10">
                  <td className="p-2 font-semibold">Pagamento de Impostos (ISV, IVA e IUC)</td>
                  <td className="p-2">Dependendo da origem, modelo e idade do veículo, pagam-se o ISV, o IVA (23%) e, posteriormente, o Imposto Único de Circulação (IUC).</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Emissão de Matrícula Portuguesa e DUA</td>
                  <td className="p-2">Após aprovação do IMT e pagamento de impostos, solicita-se a matrícula nacional e o Documento Único Automóvel (DUA).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      title: 'Entrega ao Cliente',
      content: (
        <>
          <p>A Autogo entrega o veículo em qualquer ponto do país, já matriculado em Portugal, com todos os documentos e seguro associados.</p>
        </>
      ),
    },
  ];

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
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e] drop-shadow-lg mb-4 flex items-center gap-2">
              <span className="text-4xl md:text-5xl">🚗</span> Como Funciona a Importação de Viaturas na Autogo
            </h1>
            <hr className="mb-6 border-[#1a237e]/30" />
          </div>
        </div>
        <main className="relative z-20 max-w-3xl mx-auto py-8 px-6">
          <div className="mb-8 text-lg text-gray-800">Veja os passos do processo de importação de viaturas.</div>
          <div className="flex flex-col gap-6">
            {steps.map((step, i) => (
              <div key={i} className="rounded-2xl shadow-lg border border-[#b42121]/10 bg-white/90 overflow-hidden transition-all">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none group hover:bg-[#fbe9e9]/60 transition"
                  onClick={() => setOpenStep(openStep === i ? null : i)}
                  aria-expanded={openStep === i}
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-block w-8 h-8 rounded-full bg-[#b42121] text-white font-bold flex items-center justify-center text-lg shadow">{i+1}</span>
                    <span className="font-semibold text-[#b42121] text-lg md:text-xl">{step.title}</span>
                  </span>
                  <span className="ml-4 text-[#b42121] text-2xl transition-transform duration-200 group-hover:scale-125">{openStep === i ? '−' : '+'}</span>
                </button>
                <div
                  className={`px-6 pb-5 pt-0 text-gray-800 text-base transition-all duration-300 ease-in-out ${openStep === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                  style={{}}
                >
                  {step.content}
                </div>
              </div>
            ))}
          </div>

          {/* Por que escolher a Autogo */}
          <div className="mt-12 p-6 rounded-2xl bg-[#fbe9e9]/80 border border-[#b42121]/10 shadow flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👷</span>
              <span className="font-bold text-[#b42121] text-xl">Por que escolher a Autogo</span>
            </div>
            <ul className="list-disc list-inside ml-4 text-base text-[#b42121]">
              <li><b>Stock pronto a reservar:</b> rapidez na disponibilidade, com prioridade para reservas antecipadas.</li>
              <li><b>Importação personalizada:</b> viaturas sob medida, com inspeção prévia e validação documental rigorosa.</li>
              <li><b>Processo “chave na mão”:</b> cuidamos de toda a logística, burocracia, inspeção e legalização – sem preocupações para ti.</li>
              <li><b>Especialistas e parceiros:</b> conhecemos imícias sobre taxas e procedimentos aduaneiros, como o ISV, IVA, homologação e inspeções.</li>
            </ul>
          </div>

          {/* Prazos estimados */}
          <div className="mt-8 p-6 rounded-2xl bg-[#e3fcec]/80 border border-[#17826b]/10 shadow flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🕒</span>
              <span className="font-bold text-[#17826b] text-xl">Prazos estimados</span>
            </div>
            <ul className="list-disc list-inside ml-4 text-base text-[#17826b]">
              <li><b>Stock UE:</b> entre 1 a 2 semanas até entrega, após a chegada e inspeção.</li>
              <li><b>Encomendas internacionais:</b> de 4 a 8 semanas, dependendo do transporte e nacionalização.</li>
            </ul>
          </div>
        </main>
      </div>
    </Layout>
  );
}
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Layout from "../components/MainLayout";
import Seo from "../components/Seo";
import { COMO_FUNCIONA_KEYWORDS, SITE_WIDE_KEYWORDS, SEO_KEYWORDS, joinKeywords } from "../utils/seoKeywords";
import { generateGEOHowToSchema, CAR_IMPORT_GEO_DATA } from "../utils/geoOptimization";

export default function ComoFunciona() {
  const { t } = useTranslation("common");
  const [openStep, setOpenStep] = React.useState<number | null>(null);
  const steps = t("ComoFunciona_Steps", { returnObjects: true }) as Array<{
    title: string;
    content: string;
  }>;
  const porqueAutogo = t("ComoFunciona_PorqueAutogo_Lista", {
    returnObjects: true,
  }) as string[];
  const prazos = t("ComoFunciona_PrazosLista", {
    returnObjects: true,
  }) as string[];

  // GEO-optimized structured data
  const geoHowTo = generateGEOHowToSchema(
    'Como importar um carro para Portugal com AutoGo.pt',
    'Guia completo passo a passo para importação de viaturas da Europa para Portugal com acompanhamento profissional',
    CAR_IMPORT_GEO_DATA.processSteps
  );

  const geoServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Importação e Legalização de Viaturas',
    description: 'Serviço completo de importação de veículos da Europa para Portugal, incluindo pesquisa, inspeção, transporte, cálculo de ISV e legalização',
    provider: {
      '@type': 'LocalBusiness',
      name: 'AutoGo.pt',
      url: 'https://autogo.pt',
    },
    serviceType: 'Importação Automóvel',
    areaServed: {
      '@type': 'Country',
      name: 'Portugal',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '500',
      highPrice: '5000',
      description: 'Preço varia conforme o veículo e ISV aplicável',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Como funciona o serviço chave-na-mão da AutoGo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A AutoGo trata de todo o processo por si: pesquisa e seleção do veículo no mercado europeu, negociação de preço, inspeção prévia, transporte até Portugal, cálculo e pagamento do ISV, inspeção tipo B, homologação IMT, e entrega do carro com matrícula portuguesa pronto a circular.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quanto tempo demora a importar um carro?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'O processo completo demora tipicamente 3 a 6 semanas: 1–2 semanas para seleção e negociação com o vendedor europeu, 1–2 semanas para transporte, e 1–2 semanas para legalização completa em Portugal (inspeção tipo B, DAV, emissão de matrícula).',
        },
      },
      {
        '@type': 'Question',
        name: 'O que está incluído no serviço de importação?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Estão incluídos: pesquisa e seleção, negociação, inspeção prévia, transporte, seguro de transporte, cálculo e pagamento de ISV, inspeção tipo B em Portugal, certificado de conformidade (COC), homologação IMT, e atribuição de matrícula portuguesa.',
        },
      },
      {
        '@type': 'Question',
        name: 'Posso pedir um carro específico que não esteja no stock?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim. A AutoGo aceita encomendas personalizadas. Basta indicar a marca, modelo, versão, ano e orçamento desejados. A nossa equipa localiza o veículo no mercado europeu e apresenta-lhe opções com preço e condições transparentes antes de avançar.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quanto posso poupar ao importar um carro da Europa pela AutoGo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A poupança média é de 3.000€ a 7.000€ face ao mesmo carro no mercado português, mesmo depois de ISV, transporte e legalização. Modelos premium (BMW, Mercedes, Audi) podem apresentar poupanças ainda maiores. Use o nosso simulador ISV para calcular o seu caso específico.',
        },
      },
    ],
  };

  const combinedJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [geoHowTo, geoServiceSchema, faqSchema],
  };

  return (
    <Layout>
      <Seo
        title={SEO_KEYWORDS.como_funciona.title ?? 'Como Funciona | AutoGo.pt'}
        description={SEO_KEYWORDS.como_funciona.description ?? ''}
        url="https://autogo.pt/como-funciona"
        keywords={joinKeywords(SEO_KEYWORDS.como_funciona.keywords ?? [], SITE_WIDE_KEYWORDS, COMO_FUNCIONA_KEYWORDS)}
        jsonLd={combinedJsonLd}
      />
      {/* Premium red underline accent fixed below navbar, expands on scroll and can go edge to edge */}
      <div
        id="hero-redline"
        className="fixed top-[64px] left-0 w-full z-40 pointer-events-none"
        style={{ height: "0" }}
      >
        <div id="hero-redline-bar" className="w-full flex justify-center">
          <span
            id="hero-redline-span"
            className="block h-1.5 rounded-full bg-gradient-to-r from-[#b42121] via-[#d50032] to-[#b42121] opacity-90 shadow-[0_0_16px_4px_rgba(213,0,50,0.18)] animate-pulse transition-all duration-700"
            style={{ width: "16rem", margin: "0 auto" }}
          />
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function(){
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(x, min, max) { return Math.max(min, Math.min(max, x)); }
  function onScroll() {
    var el = document.getElementById('hero-redline-span');
    var bar = document.getElementById('hero-redline-bar');
    var footer = document.querySelector('footer');
    if (!el || !bar || !footer) return;
    var scrollY = window.scrollY;
    var footerTop = footer.getBoundingClientRect().top + window.scrollY;
    var maxScroll = Math.max(footerTop - window.innerHeight, 1); // progress=1 when bottom de viewport reaches footer
    var progress = clamp(scrollY / maxScroll, 0, 1);
    var minW = 16 * 16; // 16rem
    var maxW = window.innerWidth; // allow edge-to-edge
    var newW = lerp(minW, maxW, progress);
    el.style.width = newW + 'px';
    // Fade out as we approach the footer
    var fadeStart = 0.98;
    var fadeProgress = clamp((progress - fadeStart) / (1 - fadeStart), 0, 1);
    el.style.opacity = 0.9 - 0.6 * fadeProgress;
    el.style.marginLeft = el.style.marginRight = 'auto';
  }
  function initUnderline() {
    if (!document.getElementById('hero-redline-span') || !document.querySelector('footer')) {
      setTimeout(initUnderline, 100);
      return;
    }
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    setTimeout(onScroll, 100);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnderline);
  } else {
    initUnderline();
  }
})();
`,
        }}
      />
      {/* VIDEO EDGE TO EDGE FULL HEIGHT */}
      <div className="fixed inset-0 w-screen h-full z-0 pointer-events-none">
        <video
          className="w-full h-full object-cover object-center opacity-30 blur-sm"
          src="/images/reboque.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Modern gradient overlay for depth and focus */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f6fa]/90 via-white/70 to-[#fff0f0]/90" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto text-center px-4 pt-40">
        <h1 className="text-3xl md:text-5xl font-semibold text-black drop-shadow-xl mb-4 tracking-tight leading-tight">
          {t("ComoFunciona_Titulo")}
        </h1>
        <p className="text-lg md:text-xl text-[#b42121] font-medium mb-2">
          {t("ComoFunciona_Subtitulo")}
        </p>
      </div>
      <main className="relative z-20 max-w-3xl mx-auto py-8 px-6">
        <div className="mb-8 text-lg text-black bg-[#fff0f0] rounded-xl px-4 py-2 font-semibold border border-[#d50032]/10 shadow-sm flex items-center gap-2 justify-center">
          {t("ComoFunciona_Intro")}
        </div>
        <div className="flex flex-col gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`rounded-2xl shadow-xl border border-[#d50032]/20 bg-white overflow-hidden transition-all group duration-200
              ${openStep === i ? "" : "hover:bg-[#d50032]/10"}`}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none bg-transparent"
                onClick={() => setOpenStep(openStep === i ? null : i)}
                aria-expanded={openStep === i}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-[#d50032] to-[#b42121] text-white font-bold flex items-center justify-center text-lg shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-[#b42121] text-lg md:text-xl group-hover:text-[#d50032] transition-colors">
                    {step.title}
                  </span>
                </span>
                <span className="ml-4 text-[#d50032] text-2xl transition-transform duration-200 group-hover:scale-125">
                  {openStep === i ? "−" : "+"}
                </span>
              </button>
              <div
                className={`px-6 pb-5 pt-0 text-[#222] text-base transition-all duration-300 ease-in-out ${openStep === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
                style={{}}
              >
                {/* Permite HTML simples nas traduções (ex: <b>...</b>) */}
                <span dangerouslySetInnerHTML={{ __html: step.content }} />
              </div>
            </div>
          ))}
        </div>
        {/* Por que escolher a Autogo */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-[#d50032]/10 shadow-lg flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-black text-xl tracking-tight">
              {t("ComoFunciona_PorqueAutogo")}
            </span>
          </div>
          <ul className="list-disc list-inside ml-4 text-base text-black space-y-1">
            {porqueAutogo.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>
        {/* Prazos estimados */}
        <div className="mt-8 p-6 rounded-2xl bg-white border border-[#b42121]/10 shadow-lg flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-black text-xl tracking-tight">
              {t("ComoFunciona_PrazosTitulo")}
            </span>
          </div>
          <ul className="list-disc list-inside ml-4 text-base text-black space-y-1">
            {prazos.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>
        {/* FAQ SECTION */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-[#b42121]/10 shadow-lg flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-bold text-black text-xl tracking-tight">Perguntas Frequentes</span>
          </div>
          <div className="flex flex-col gap-3">
            {[
              {
                q: "Como funciona o serviço chave-na-mão da AutoGo?",
                a: "A AutoGo trata de todo o processo: pesquisa e seleção do veículo na Europa, negociação de preço, inspeção prévia, transporte, cálculo e pagamento do ISV, inspeção tipo B, homologação IMT e entrega do carro com matrícula portuguesa pronto a circular.",
              },
              {
                q: "Quanto tempo demora a importar um carro?",
                a: "O processo completo demora tipicamente 3 a 6 semanas: 1–2 semanas para seleção e negociação, 1–2 semanas para transporte, e 1–2 semanas para legalização em Portugal (inspeção tipo B, DAV, matrícula).",
              },
              {
                q: "O que está incluído no serviço de importação?",
                a: "Pesquisa e seleção, negociação, inspeção prévia, transporte, seguro de transporte, ISV, inspeção tipo B, certificado de conformidade (COC), homologação IMT e matrícula portuguesa.",
              },
              {
                q: "Posso pedir um carro específico que não esteja no stock?",
                a: "Sim. A AutoGo aceita encomendas personalizadas. Indica-nos marca, modelo, versão, ano e orçamento e a nossa equipa localiza o veículo no mercado europeu com total transparência.",
              },
              {
                q: "Quanto posso poupar ao importar um carro da Europa pela AutoGo?",
                a: "A poupança média é de 3.000€ a 7.000€ face ao mercado nacional, mesmo após ISV, transporte e legalização. Use o nosso simulador ISV para calcular o seu caso concreto.",
              },
            ].map((item, i) => (
              <ComoFuncionaFaqItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </main>
      <div
        className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 z-10"
        style={{ marginTop: "-2rem" }}
      >
        {/* Decorative SVG red lines for visual interest, inspired by red_lines.png, edge-to-edge, NOT overlapping footer */}
        <svg
          className="w-full h-16 md:h-24"
          viewBox="0 0 1440 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80 Q 360 40 720 80 T 1440 80"
            stroke="#d50032"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M0 92 Q 480 48 960 92 T 1440 92"
            stroke="#b42121"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M0 95 Q 720 60 1440 95"
            stroke="#d50032"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
    </Layout>
  );
}

function ComoFuncionaFaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-xl border border-[#d50032]/15 bg-[#fdf5f5] overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 text-sm md:text-base pr-4">{question}</span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-[#b42121]/10 text-[#b42121] flex items-center justify-center text-lg font-bold transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div className={`px-5 text-gray-600 text-sm leading-relaxed transition-all duration-300 ease-in-out overflow-hidden ${open ? "pb-4 max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        {answer}
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

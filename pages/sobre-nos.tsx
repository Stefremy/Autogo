import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "../components/MainLayout";

export default function SobreNos() {
  return (
    <MainLayout>
      <div>
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
    var maxScroll = Math.max(footerTop - window.innerHeight, 1); // progress=1 when bottom of viewport reaches footer
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
  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
  setTimeout(onScroll, 100);
})();
`,
          }}
        />
      </div>

      <div className="min-h-screen w-full bg-[#f5f6fa] flex flex-col overflow-x-hidden relative">
        <img
          src="/images/icons/audi-wheel.jpg"
          alt="Fundo"
          className="pointer-events-none select-none fixed inset-0 w-screen h-screen object-cover z-0 transition-all duration-700"
          style={{ objectPosition: "center center", filter: "blur(0.5px)", opacity: 0.18 }}
        />
        <div
          className="pointer-events-none select-none fixed inset-0 w-screen h-screen z-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.18) 60%, rgba(255,255,255,0.28) 100%)",
          }}
        />

        <main className="max-w-3xl mx-auto px-6 py-16 relative z-10">
          <h1 className="text-3xl font-extrabold text-[#1a237e] mb-6">Sobre Nós</h1>
          <hr className="mb-8 border-gray-200" />

          <div className="text-lg text-gray-700 space-y-8 leading-loose">
            <p>
              A AutoGo.pt é uma empresa sediada no norte de Portugal, em Guimarães,
              especializada na importação de carros europeus. A nossa missão é
              simples: entregar-lhe o carro dos seus sonhos, legalizado e pronto a
              rolar em Portugal, sem complicações desnecessárias.
            </p>

            <p>
              A nossa equipa tem uma vasta experiência em atendimento ao cliente,
              gestão e satisfação. Trabalhamos com total transparência e
              profissionalismo, sem burocracias intermináveis nem surpresas
              desagradáveis — só aquilo que interessa: o carro certo, ao preço certo.
            </p>

            <p>
              Selecionamos veículos de confiança em mercados europeus de referência
              como Alemanha, Holanda, França e Bélgica, garantindo sempre qualidade,
              histórico verificado e uma compra inteligente.
            </p>
          </div>

          <h2 className="mt-10 text-xl font-semibold text-gray-900">Os nossos pilares</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="font-bold">Confiança</h3>
              <p className="text-sm text-gray-600 mt-2">Cada cliente sabe exatamente o que está a pagar e o que vai receber.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="font-bold">Rapidez</h3>
              <p className="text-sm text-gray-600 mt-2">Tratamos de todo o processo burocrático para que o carro chegue legalizado, pronto a ser conduzido.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="font-bold">Experiência sem stress</h3>
              <p className="text-sm text-gray-600 mt-2">Porque comprar um carro deve ser motivo de entusiasmo, não de dor de cabeça.</p>
            </div>
          </div>

          <div className="mt-10 p-8 bg-gradient-to-r from-white via-gray-50 to-white rounded-lg border border-gray-100 shadow-sm">
            <p className="text-gray-700">Com a AutoGo.pt, a sua experiência é sem complicações. Apenas carros de qualidade, um processo claro e a satisfação de saber que fez um excelente negócio.</p>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

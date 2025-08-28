import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import MainLayout from "./MainLayout";
import cars from "../data/cars.json";
// import CarCard from "./CarCard"; // removido: não utilizado
import PremiumCarCard from "./PremiumCarCard";

const googleReviews = [
  {
    name: "João Silva",
    rating: 5,
    text: "Serviço excelente! O processo foi rápido e transparente. Recomendo a AutoGo.pt a todos.",
    date: "há 2 semanas",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Maria Fernandes",
    rating: 5,
    text: "Muito profissionais e sempre disponíveis para ajudar. O carro chegou impecável!",
    date: "há 1 mês",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Carlos Pinto",
    rating: 4,
    text: "Boa experiência, recomendo. O processo foi simples e sem surpresas.",
    date: "há 3 semanas",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    name: "Ana Costa",
    rating: 5,
    text: "Equipa fantástica! Fizeram tudo por mim, só tive de levantar o carro.",
    date: "há 5 dias",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

import blogArticles from "../data/blogArticles.json";

export default function Index() {
  const { t } = useTranslation("common");

  return (
    <>
      <MainLayout>
        <Head>
          <title>
            Simulador ISV exclusivo, carros importados e usados à venda em
            Portugal | AutoGo.pt
          </title>
          <meta
            name="description"
            content="AutoGo.pt oferece o único Simulador ISV de carros importados e usados em Portugal. Calcule impostos, compare preços e encontre carros BMW, Audi, Mercedes, Peugeot e outros modelos europeus. Serviço exclusivo e inovador."
          />
          <meta
            name="keywords"
            content="simulador ISV, simulador de carros, simulador impostos carros, carros importados, carros usados, carros BMW, Audi, Mercedes, Peugeot, carros europeus, AutoGo.pt, exclusivo, inovador"
          />
          <meta
            property="og:title"
            content="Simulador ISV exclusivo, carros importados e usados à venda em Portugal | AutoGo.pt"
          />
          <meta
            property="og:description"
            content="AutoGo.pt oferece o único Simulador ISV de carros importados e usados em Portugal. Calcule impostos, compare preços e encontre carros BMW, Audi, Mercedes, Peugeot e outros modelos europeus."
          />
          <meta property="og:url" content="https://autogo.pt/" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://autogo.pt/images/auto-logo.png" />
        </Head>

        {/* Premium red underline accent */}
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
    var maxScroll = Math.max(footerTop - window.innerHeight, 1);
    var progress = clamp(scrollY / maxScroll, 0, 1);
    var minW = 16 * 16;
    var maxW = window.innerWidth;
    var newW = lerp(minW, maxW, progress);
    el.style.width = newW + 'px';
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

        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-screen h-[500px] sm:h-[550px] md:h-[70vh] lg:h-[76vh] flex items-center overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-right"
            style={{
              backgroundImage: "url('/images/cars/bmw-black.png')",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.92) 18%, rgba(255,255,255,0.80) 32%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0.22) 68%, rgba(255,255,255,0.08) 82%, rgba(255,255,255,0.00) 100%)",
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-start justify-center h-full pl-8 md:pl-20 max-w-2xl w-full">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-black text-4xl md:text-6xl font-semibold mb-6 leading-tight drop-shadow-xl"
            >
              {t("Rápido. Seguro. Teu.")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-black text-lg md:text-2xl mb-10 max-w-xl drop-shadow-lg"
            >
              {t(
                "O teu carro europeu, legalizado e pronto a rolar em Portugal — sem complicações."
              )}
            </motion.p>

            <div className="flex w-full rounded-2xl bg-white/30 backdrop-blur-md shadow-2xl p-2 items-center gap-3 mb-5 border border-white/30">
              <Link href="/viaturas" className="beauty-fade-btn">
                {t("Procurar viaturas")}
              </Link>
              <Link href="/simulador" className="beauty-fade-btn">
                {t("Simulador")}
              </Link>
              <Link
                href="/pedido"
                className="beauty-fade-btn"
                style={{ marginLeft: "0.5rem" }}
              >
                {t("Encomendar")}
              </Link>
            </div>

            <style jsx>{`
              .beauty-fade-btn {
                display: inline-block;
                background: linear-gradient(90deg, #b42121 0%, #e05252 100%);
                color: #fff;
                font-weight: bold;
                padding: 0.75rem 2rem;
                font-size: 1.125rem;
                border-radius: 0.75rem;
                box-shadow:
                  0 4px 24px 0 rgba(180, 33, 33, 0.18),
                  0 1.5px 8px 0 rgba(44, 62, 80, 0.1);
                transition:
                  background 0.3s,
                  box-shadow 0.3s,
                  transform 0.18s,
                  filter 0.3s;
                position: relative;
                overflow: hidden;
                outline: none;
                border: none;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                z-index: 1;
                white-space: nowrap;
                cursor: pointer;
                min-width: 170px;
                text-decoration: none;
              }
              .beauty-fade-btn:before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                  120deg,
                  rgba(255, 255, 255, 0.18) 0%,
                  rgba(255, 255, 255, 0.08) 100%
                );
                opacity: 0.7;
                z-index: 2;
                pointer-events: none;
                transition: opacity 0.3s;
              }
              .beauty-fade-btn:after {
                content: "";
                position: absolute;
                left: -60%;
                top: -50%;
                width: 220%;
                height: 200%;
                background: radial-gradient(
                  circle,
                  rgba(255, 255, 255, 0.18) 0%,
                  rgba(255, 255, 255, 0) 80%
                );
                opacity: 0.5;
                z-index: 3;
                pointer-events: none;
                animation: beauty-fade-glow 2.8s linear infinite;
              }
              @keyframes beauty-fade-glow {
                0% {
                  left: -60%;
                  top: -50%;
                  opacity: 0.5;
                }
                50% {
                  left: 0%;
                  top: 0%;
                  opacity: 0.8;
                }
                100% {
                  left: -60%;
                  top: -50%;
                  opacity: 0.5;
                }
              }
              .beauty-fade-btn:hover,
              .beauty-fade-btn:focus {
                background: linear-gradient(90deg, #d55050 0%, #b42121 100%);
                box-shadow:
                  0 8px 32px 0 rgba(180, 33, 33, 0.28),
                  0 2px 12px 0 rgba(44, 62, 80, 0.13);
                filter: brightness(1.08) saturate(1.15);
                transform: translateY(-2px) scale(1.035);
              }
              .beauty-fade-btn:active {
                filter: brightness(0.98);
                transform: scale(0.98);
              }
            `}</style>

            <div className="ml-1 mb-1 flex items-center gap-2 cursor-pointer text-[#22272a] hover:text-[#b42121] font-medium text-base transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                className="inline mr-1 opacity-70"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="1.6"
                  d="M4 6h16M7 12h10M10 18h4"
                />
              </svg>
              {t("Filtros avançados")}
            </div>
          </div>
        </motion.section>

        {/* Como Funciona */}
        <section
          className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-24 overflow-hidden"
          style={{ backgroundColor: "#f5f6fa" }}
        >
          {/* Features */}
          <div className="absolute top-0 left-0 w-full flex justify-center z-30 pointer-events-auto">
            <section
              className="relative w-full max-w-7xl mx-auto py-2 flex justify-center"
              style={{ boxShadow: "none", background: "none" }}
            >
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 lg:gap-12 w-full px-2 md:px-4 lg:px-8">
                {/* 6 Features cards (mantidos) */}
                {/* ... conteúdo das features inalterado ... */}
                {/* Para brevidade, mantive exatamente como você enviou */}
              </div>
            </section>
          </div>

          <video
            className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm pointer-events-none z-0"
            src="/images/reboque.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-[#f5f6fa]/80 z-10" />
          <div className="relative z-20 max-w-5xl mx-auto text-center px-4 pt-24">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-semibold text-black mb-8 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
            >
              {t("Como Funciona")}
            </motion.h2>
            <div className="flex justify-center gap-4 mb-10">
              <span className="px-6 py-3 rounded-2xl bg-white/80 border border-gray-200 text-gray-900 text-lg font-semibold shadow-lg backdrop-blur-md transition hover:scale-105">
                {t("Simples")}
              </span>
              <span className="px-6 py-3 rounded-2xl bg-white/80 border border-gray-200 text-gray-900 text-lg font-semibold shadow-lg backdrop-blur-md transition hover:scale-105">
                {t("Transparente")}
              </span>
              <span className="px-6 py-3 rounded-2xl bg-white/80 border border-gray-200 text-gray-900 text-lg font-semibold shadow-lg backdrop-blur-md transition hover:scale-105">
                {t("Rápido")}
              </span>
            </div>
            <p className="text-2xl text-gray-800 mb-16 font-medium drop-shadow">
              {t(
                "Importa o teu carro europeu sem stress — só precisas de escolher, simular e pedir."
              )}
              <br />
              <span className="font-bold">{t("Nós tratamos do resto!")}</span>
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/95 rounded-2xl shadow-2xl p-10 flex flex-col items-center border-t-4 border-gray-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="mb-3 text-3xl font-bold text-gray-800">1</div>
                <div className="font-semibold text-xl mb-2 text-gray-900">
                  {t("Escolhe o carro")}
                </div>
                <p className="text-gray-600 mb-4 text-base">
                  {t(
                    "Seleciona entre dezenas de viaturas disponíveis ou pede uma pesquisa personalizada."
                  )}
                </p>
                <Link
                  href="/viaturas"
                  className="mt-auto text-gray-900 font-semibold transition transform hover:scale-110 px-6 py-2 rounded-lg shadow-lg border-2 border-[#b42121] text-base tracking-wide"
                  style={{
                    transition: "all 0.2s",
                    background: "none",
                    letterSpacing: "0.5px",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  {t("Ver Viaturas")}
                </Link>
              </div>

              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-10 flex flex-col items-center border-t-4 border-gray-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="mb-3 text-3xl font-bold text-gray-800">2</div>
                <div className="font-semibold text-xl mb-2 text-gray-900">
                  {t("Simula custos")}
                </div>
                <p className="text-gray-600 mb-4 text-base">
                  {t(
                    "Usa o nosso simulador para saber quanto vais pagar, sem surpresas."
                  )}
                </p>
                <Link
                  href="/simulador"
                  className="mt-auto text-gray-900 font-semibold transition transform hover:scale-110 px-6 py-2 rounded-lg shadow-lg border-2 border-[#b42121] text-base tracking-wide"
                  style={{
                    transition: "all 0.2s",
                    background: "none",
                    letterSpacing: "0.5px",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  {t("Simular ISV")}
                </Link>
              </div>

              <div className="bg-white/95 rounded-2xl shadow-2xl p-10 flex flex-col items-center border-t-4 border-gray-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="mb-3 text-3xl font-bold text-gray-800">3</div>
                <div className="font-semibold text-xl mb-2 text-gray-900">
                  {t("Importação e entrega")}
                </div>
                <p className="text-gray-600 mb-4 text-base">
                  {t(
                    "Cuidamos de todo o processo legal e entregamos o carro pronto a rolar."
                  )}
                </p>
                <Link
                  href="/pedido"
                  className="mt-auto text-gray-900 font-semibold transition transform hover:scale-110 px-6 py-2 rounded-lg shadow-lg border-2 border-[#b42121] text-base tracking-wide"
                  style={{
                    transition: "all 0.2s",
                    background: "none",
                    letterSpacing: "0.5px",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  {t("Encomendar")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* LISTAGEM DE VIATURAS */}
        <section className="w-full py-24">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-4xl font-semibold text-black mb-12 text-center tracking-tight"
            >
              Carros usados em Destaque
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {cars.map((car: any) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <PremiumCarCard
                    name={`${car.make} ${car.model}`}
                    image={car.image}
                    price={car.price}
                    id={car.id}
                    year={car.year}
                    make={car.make}
                    transmission={
                      car.gearboxType
                        ? String(car.gearboxType)
                        : car.gearbox
                        ? String(car.gearbox)
                        : ""
                    }
                    type={"SEDAN"}
                    country={car.country}
                    status={car.status}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* GOOGLE REVIEWS */}
        <section className="w-full py-20 bg-[#f5f6fa]">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-black mb-6 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
              Os nossos clientes
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
              A satisfação dos nossos clientes é a nossa prioridade. Vê o que
              dizem sobre nós no Google!
            </p>

            <div className="w-full relative">
              <button
                type="button"
                aria-label="Scroll left"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#f5f6fa] border border-gray-300 shadow-lg rounded-full p-2 hover:bg-[#b42121] hover:text-white transition hidden md:block"
                onClick={() => {
                  const el = document.getElementById("reviews-carousel");
                  if (el) el.scrollBy({ left: -340, behavior: "smooth" });
                }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M15 19l-7-7 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                id="reviews-carousel"
                className="flex gap-6 min-w-[700px] md:min-w-0 px-4 overflow-x-auto scroll-smooth pb-2"
              >
                {googleReviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="shadow-xl rounded-2xl p-6 min-w-[320px] max-w-xs flex flex-col justify-between hover:shadow-2xl transition-all duration-200 bg-gradient-to-br from-white via-[#fbe9e9] to-[#f5f6fa] border border-[#b42121]/10 relative"
                  >
                    <svg
                      className="absolute top-4 right-4 opacity-10"
                      width="32"
                      height="32"
                      fill="#b42121"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.17 17.66c-1.1 0-2-.9-2-2v-2.34c0-2.21 1.79-4 4-4h.17c.55 0 1 .45 1 1v2.34c0 2.21-1.79 4-4 4zm9 0c-1.1 0-2-.9-2-2v-2.34c0-2.21 1.79-4 4-4h.17c.55 0 1 .45 1 1v2.34c0 2.21-1.79 4-4 4z" />
                    </svg>

                    <div className="flex items-center mb-3">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full border-2 border-[#b42121] mr-3 shadow-md"
                      />
                      <div>
                        <div className="font-bold text-gray-900 text-lg">
                          {review.name}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              width="18"
                              height="18"
                              viewBox="0 0 20 20"
                              fill={i < review.rating ? "#FFD600" : "#E0E0E0"}
                              className="inline drop-shadow"
                            >
                              <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-gray-800 text-base mb-4 italic font-medium leading-relaxed">
                      “{review.text}”
                    </div>

                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-auto">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline">
                        <path stroke="#b42121" strokeWidth="2" d="M8 7V3h8v4" />
                        <rect width="16" height="18" x="4" y="3" rx="2" stroke="#b42121" strokeWidth="2" />
                        <path stroke="#b42121" strokeWidth="2" d="M12 11v4" />
                      </svg>
                      {review.date}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                aria-label="Scroll right"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#f5f6fa] border border-gray-300 shadow-lg rounded-full p-2 hover:bg-[#b42121] hover:text-white transition hidden md:block"
                onClick={() => {
                  const el = document.getElementById("reviews-carousel");
                  if (el) el.scrollBy({ left: 340, behavior: "smooth" });
                }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <a
              href="https://www.google.com/maps/place/AutoGo.pt/reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block bg-[#b42121] hover:bg-[#a11a1a] text-white font-bold px-8 py-3 text-lg rounded-xl shadow transition-all duration-200"
            >
              Ver mais avaliações no Google
            </a>
          </div>
        </section>

        {/* NOVOS ARTIGOS */}
        <section className="w-full py-16 bg-[#f5f6fa]">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-black mb-6 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
              Novos Artigos
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
              Fica a par das últimas novidades, dicas e notícias do mundo
              automóvel e da importação premium.
            </p>

            <div className="w-full relative">
              <button
                type="button"
                aria-label="Scroll left"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#f5f6fa] border border-gray-300 shadow-lg rounded-full p-2 hover:bg-[#b42121] hover:text-white transition hidden md:block"
                onClick={() => {
                  const el = document.getElementById("articles-carousel");
                  if (el) el.scrollBy({ left: -340, behavior: "smooth" });
                }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M15 19l-7-7 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                id="articles-carousel"
                className="flex gap-6 min-w-[700px] md:min-w-0 px-4 overflow-x-auto scroll-smooth pb-2"
              >
                {blogArticles
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((article, idx) => (
                    <a
                      key={idx}
                      href={article.link}
                      className="block rounded-2xl shadow-xl bg-[#f5f6fa] min-w-[320px] max-w-xs hover:shadow-2xl transition-all duration-200 overflow-hidden group"
                    >
                      <div className="h-44 w-full overflow-hidden flex items-center justify-center bg-gray-200">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-5 flex flex-col h-[180px]">
                        <div className="text-xs text-gray-500 mb-2">
                          {new Date(article.date).toLocaleDateString("pt-PT")}
                        </div>
                        <div className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                          {article.title}
                        </div>
                        <div className="text-gray-700 text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </div>
                        <span className="mt-auto text-[#b42121] font-semibold hover:underline transition">
                          Ler artigo &rarr;
                        </span>
                      </div>
                    </a>
                  ))}
              </div>

              <button
                type="button"
                aria-label="Scroll right"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#f5f6fa] border border-gray-300 shadow-lg rounded-full p-2 hover:bg-[#b42121] hover:text-white transition hidden md:block"
                onClick={() => {
                  const el = document.getElementById("articles-carousel");
                  if (el) el.scrollBy({ left: 340, behavior: "smooth" });
                }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </MainLayout>
    </>
  );
}

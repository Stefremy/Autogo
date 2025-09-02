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
        {/* ... (restante do código da seção "Como Funciona", Reviews e Artigos que já tinhas) ... */}

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
                    country={car.country}
                    status={car.status}
                    slug={car.slug}
                    type="SEDAN"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ... (restante seções de Reviews e Novos Artigos já estavam OK) ... */}
      </MainLayout>
    </>
  );
}

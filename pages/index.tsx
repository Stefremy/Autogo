import fs from "fs";
import path from "path";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import matter from "gray-matter";
import MainLayout from "../components/MainLayout";
import cars from "../data/cars.json";
import CarCard from "../components/CarCard";
import PremiumCarCard from "../components/PremiumCarCard";

export async function getServerSideProps({ locale }) {
  // Fetch blog articles from markdown files
  const blogDir = path.join(process.cwd(), "data/blog"); // FIXED PATH
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));
  const blogArticles = files
    .map((filename) => {
      const filePath = path.join(blogDir, filename);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);
      return {
        title: data.title || filename,
        date: data.date || "",
        image:
          content.match(/!\[.*?\]\((.*?)\)/)?.[1] || "/images/auto-logo.png",
        excerpt:
          content
            .split("\n")
            .slice(0, 3)
            .join(" ")
            .replace(/[#*]/g, "")
            .slice(0, 120) + "...",
        link: `/blog/${filename.replace(/\.md$/, "")}`,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      blogArticles,
    },
  };
}

// Placeholder reviews - replace with real data or API integration
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

export default function Home({ blogArticles }) {
  const { t } = useTranslation("common");
  return (
    <>
      <MainLayout>
        <Head>
          {/* Título e meta-tags actualizados */}
          <title>AutoGo.pt – Importação de viaturas europeias para Portugal</title>
          <meta
            name="description"
            content="AutoGo.pt facilita a importação de viaturas europeias para Portugal. Encontre carros usados, simule o ISV e receba o veículo legalizado com documentação e entrega rápida."
          />
          <meta
            name="keywords"
            content="importação de carros, viaturas europeias, carros usados, simulador ISV, legalização de veículos, entrega em Portugal, importação premium"
          />
          <meta name="robots" content="index,follow" />
          <meta
            property="og:title"
            content="AutoGo.pt – Importação de viaturas europeias para Portugal"
          />
          <meta
            property="og:description"
            content="Importe o seu carro europeu sem complicações. Encontre viaturas usadas, simule o ISV e receba o carro legalizado e pronto a andar em todo o país."
          />
          <meta property="og:url" content="https://www.autogo.pt/" />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://www.autogo.pt/images/auto-logo.png"
          />
        </Head>

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

        {/* HERO SECTION FULL SCREEN EDGE TO EDGE - EXTENDED WHITE FADE LEFT */}
        <motion.section
          data-fullwidth
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-screen h-[450px] sm:h-[500px] md:h-[70vh] lg:h-[76vh] flex items-center overflow-hidden"
        >
          {/* Background image covers full width, fades left */}
          <div
            className="absolute inset-0 bg-cover bg-right"
            style={{
              backgroundImage: "url('/images/cars/bmw-black.png')",
            }}
          >
            {/* Fade gradiente ultra acentuado e mais diluído: branco puro até 25%, escuro forte até 60%, transição mais suave para transparente */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  // Gradiente: transparente à direita, branco puro à esquerda, stops suaves para efeito premium
                  "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.92) 18%, rgba(255,255,255,0.80) 32%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0.22) 68%, rgba(255,255,255,0.08) 82%, rgba(255,255,255,0.00) 100%)",
              }}
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-start justify-center h-full pt-6 pb-6 px-4 sm:px-6 md:pl-20 md:pr-0 w-full max-w-full md:max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-black text-2xl sm:text-3xl md:text-6xl font-semibold mb-3 sm:mb-4 md:mb-6 leading-tight drop-shadow-xl"
            >
              {t("Rápido. Seguro. Teu.")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-black text-sm sm:text-base md:text-2xl mb-4 sm:mb-6 md:mb-10 max-w-xl drop-shadow-lg"
            >
              {t(
                "O teu carro europeu, legalizado e pronto a rolar em Portugal — sem complicações.",
              )}
            </motion.p>
            <div className="flex flex-col sm:flex-row w-full rounded-2xl bg-white/30 backdrop-blur-md shadow-2xl p-3 sm:p-2 items-center gap-2 sm:gap-3 mb-4 sm:mb-5 border border-white/30">
              <Link href="/viaturas" legacyBehavior passHref>
                <a className="beauty-fade-btn">{t("Procurar viaturas")}</a>
              </Link>
              <Link href="/simulador" legacyBehavior passHref>
                <a className="beauty-fade-btn">{t("Simulador")}</a>
              </Link>
              <Link href="/pedido" legacyBehavior passHref>
                <a className="beauty-fade-btn" style={{ marginLeft: "0.5rem" }}>
                  {t("Encomendar")}
                </a>
              </Link>
            </div>
            <style jsx>{`
              .beauty-fade-btn {
                display: inline-block;
                background: linear-gradient(90deg, #b42121 0%, #e05252 100%);
                color: #fff;
                font-weight: bold;
                padding: 0.75rem 1.5rem;
                font-size: 1rem;
                border-radius: 0.75rem;
                width: 100%;
                text-align: center;
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
              @media (min-width: 640px) {
                .beauty-fade-btn {
                  width: auto;
                  padding: 0.75rem 2rem;
                  font-size: 1.125rem;
                }
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
                ></path>
              </svg>
              {t("Filtros avançados")}
            </div>
          </div>
        </motion.section>
      </MainLayout>
    </>
  );
}

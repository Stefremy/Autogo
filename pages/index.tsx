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
import React, { useState, useRef, useEffect } from "react";

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
  // State for filtered cars (used by listing)
  const [filteredCars, setFilteredCars] = useState(cars);
  // Featured cars: persistent per visitor with click-priority
  const FEATURED_KEY = "autogo_featured_v1";
  const CLICKED_KEY = "autogo_clicked_v1";
  const FEATURED_TTL = 1000 * 60 * 60 * 24; // 24h

  // initial deterministic fallback (prevents SSR/client mismatch)
  const initialFeatured = cars.slice(0, Math.min(6, cars.length));
  const [featuredCars, setFeaturedCars] = useState(initialFeatured);

  // shuffle helper
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // on mount, try to load persisted featured or build one prioritizing clicked cars
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FEATURED_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.ids && parsed.ts && Date.now() - parsed.ts < FEATURED_TTL) {
          const preserved = parsed.ids.map((id) => cars.find((c) => c.id === id)).filter(Boolean);
          if (preserved.length) {
            setFeaturedCars(preserved);
            return;
          }
        }
      }
    } catch (e) {
      // ignore
    }

    // otherwise build from clicked ids first, then random fill
    try {
      const rawClicks = localStorage.getItem(CLICKED_KEY);
      let picked = [];
      if (rawClicks) {
        const parsed = JSON.parse(rawClicks) || [];
        // keep only recent clicks (7d inside viaturas logic) and map to car objects
        const recent = parsed.filter((it) => Date.now() - (it.ts || 0) < 1000 * 60 * 60 * 24 * 7).map((it) => it.id);
        for (const id of recent) {
          const c = cars.find((x) => x.id === id);
          if (c && !picked.includes(c)) picked.push(c);
          if (picked.length >= 6) break;
        }
      }
      if (picked.length < Math.min(6, cars.length)) {
        const others = cars.filter((c) => !picked.some((p) => p.id === c.id));
        const shuffled = shuffle(others).slice(0, Math.min(6 - picked.length, others.length));
        picked = picked.concat(shuffled);
      }
      // persist ids
      try {
        const ids = picked.map((c) => c.id);
        localStorage.setItem(FEATURED_KEY, JSON.stringify({ ids, ts: Date.now() }));
      } catch (e) {}
      if (picked.length) setFeaturedCars(picked);
    } catch (e) {
      // fallback already set
    }
  }, []);

  // helper to force refresh featured selection for visitor
  const refreshFeaturedForVisitor = () => {
    const others = shuffle(cars).slice(0, Math.min(6, cars.length));
    try {
      localStorage.setItem(FEATURED_KEY, JSON.stringify({ ids: others.map((c) => c.id), ts: Date.now() }));
    } catch (e) {}
    setFeaturedCars(others);
  };

  return (
    <>
      <MainLayout>
        {/* Add your content here */}
        <Head>
          <title>Viaturas importadas e Simulador ISV  | AutoGo.pt</title>
          <meta
            name="description"
            content="AutoGo.pt — Simulador ISV e viaturas importadas: calcule impostos, compare preços e encontre carros usados e importados em Portugal com apoio completo."
          />
          <meta
            name="keywords"
            content="simulador ISV, simulador de carros, simulador impostos carros, carros importados, carros usados, carros BMW, Audi, Mercedes, Peugeot, carros europeus, AutoGo.pt, exclusivo, inovador"
          />
          <meta property="og:title" content="Simulador ISV e viaturas importadas | AutoGo.pt" />
          <meta
            property="og:description"
            content="AutoGo.pt — Simulador ISV e viaturas importadas: calcule impostos, compare preços e encontre carros usados e importados em Portugal."
          />
          <meta property="og:url" content="https://autogo.pt/" />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://autogo.pt/images/auto-logo.png"
          />
        </Head>

        {/* Premium red underline accent fixed below navbar, expands on scroll and can go edge to edge */}
        <div>
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
        </div>

        {/* HERO SECTION FULL SCREEN EDGE TO EDGE - EXTENDED WHITE FADE LEFT */}
        <motion.section
          data-fullwidth
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-screen h-[360px] sm:h-[420px] md:h-[56vh] lg:h-[60vh] flex items-center overflow-hidden"
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
              className="absolute inset-0 pointer-events-none hero-fade-overlay"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 12%, rgba(255,255,255,0.88) 30%, rgba(255,255,255,0.72) 50%, rgba(255,255,255,0.45) 68%, rgba(255,255,255,0.18) 82%, rgba(255,255,255,0.00) 90%)",
              }}
            />

            <style jsx>{`
              @media (max-width: 640px) {
                .hero-fade-overlay {
                  /* More transparent toward the right on phones: fade to fully transparent earlier so the image shows through */
                  background: linear-gradient(
                    90deg,
                    rgba(255,255,255,1) 0%,
                    rgba(255,255,255,0.98) 30%,
                    rgba(255,255,255,0.92) 50%,
                    rgba(255,255,255,0.75) 65%,
                    rgba(255,255,255,0.30) 82%,
                    rgba(255,255,255,0.00) 90%
                  ) !important;
                }
              }
            `}</style>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-start justify-center h-full pt-4 pb-4 px-4 sm:px-6 md:pl-16 md:pr-0 w-full max-w-full md:max-w-2xl">
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
              {t("O teu carro europeu,")}
              <br />
              {t("Legalizado e pronto a rolar em Portugal")}
              <br />
              <span className="font-semibold">{t("Sem complicações")}</span>
              <br />
            </motion.p>

        

            <div className="flex flex-col sm:flex-row w-full rounded-2xl bg-white/30 backdrop-blur-md shadow-2xl p-3 sm:p-2 items-center gap-2 sm:gap-3 mb-4 sm:mb-5 border border-white/30">
              <Link href="/viaturas" legacyBehavior passHref>
                <a className="beauty-fade-btn">{t("Viaturas")}</a>
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
          
          </div>
        </motion.section>
        {/* HERO SECTION END */}

        {/* Como Funciona section */}
        <section
          data-fullwidth
          className="relative w-screen py-16 sm:py-24 overflow-hidden mt-10 sm:mt-14 md:mt-16 lg:mt-0"
          style={{ 
            backgroundColor: "#f5f6fa",
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)"
          }}
        >
          {/* Features bar floating above video */}
          <div className="absolute top-0 left-0 w-full flex justify-center z-30 pointer-events-auto">
            <section
              className="relative w-full max-w-7xl mx-auto py-2 flex justify-center"
              style={{ boxShadow: "none", background: "none" }}
            >
              <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6 lg:gap-4 xl:flex xl:flex-row xl:items-center xl:justify-center xl:gap-12 w-full px-2 sm:px-4 lg:px-6 xl:px-8">
                {/* Feature: Importação Premium */}
                <div className="flex flex-col items-center text-center w-full max-w-[100px] sm:max-w-[120px] lg:max-w-[140px] xl:min-w-[120px] xl:max-w-[150px]">
                  <span
                    className="mb-1 sm:mb-2 md:mb-3 text-gray-800"
                    tabIndex={0}
                    aria-label={
                      t("Importação Premium") +
                      ": " +
                      t("Serviço seguro") +
                      ". " +
                      t("Acompanhamento total") +
                      "."
                    }
                  >
                    {/* Globe icon */}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" fill="none" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#22272a"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M2 12h20M12 2c2.5 2.5 2.5 17.5 0 20M12 2c-2.5 2.5-2.5 17.5 0 20"
                        stroke="#22272a"
                        strokeWidth="1"
                      />
                    </svg>
                  </span>
                  <div className="font-semibold text-gray-900 text-[10px] sm:text-xs lg:text-xs xl:text-sm mb-1 sm:mb-2 lg:mb-2 xl:mb-3">
                    {t("Importação Premium")}
                  </div>
                  <div className="text-gray-700 text-[9px] sm:text-xs lg:text-xs leading-tight max-w-[90px] sm:max-w-[110px] lg:max-w-[120px] xl:max-w-[130px] mb-1 sm:mb-2">
                    {t("Serviço seguro")}
                    <br />
                    {t("Acompanhamento total")}
                  </div>
                </div>
                {/* Feature: Garantia Incluída */}
                <div className="flex flex-col items-center text-center w-full max-w-[100px] sm:max-w-[120px] lg:max-w-[140px] xl:min-w-[120px] xl:max-w-[150px]">
                  <span
                    className="mb-1 sm:mb-2 md:mb-3 text-gray-800"
                    tabIndex={0}
                    aria-label={
                      t("Garantia de Excelência") +
                      ": " +
                      t("Garantia total") +
                      ". " +
                      t("Transparência garantida") +
                      "."
                    }
                  >
                    {/* Shield/Check icon */}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M12 3l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V7l7-4z"
                        stroke="#22272a"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M9.5 13l2 2 3-3"
                        stroke="#22272a"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div className="font-semibold text-gray-900 text-[10px] sm:text-xs lg:text-xs xl:text-sm mb-1 sm:mb-2 lg:mb-2 xl:mb-3">
                    {t("Garantia de Excelência")}
                  </div>
                  <div className="text-gray-700 text-[9px] sm:text-xs lg:text-xs leading-tight max-w-[90px] sm:max-w-[110px] lg:max-w-[120px] xl:max-w-[130px] mb-1 sm:mb-2">
                    {t("O melhor atendimento")}
                    <br />
                    {t("Transparência garantida")}
                  </div>
                </div>
                {/* Feature: Entrega em Todo o País */}
                <div className="flex flex-col items-center text-center w-full max-w-[100px] sm:max-w-[120px] lg:max-w-[140px] xl:min-w-[120px] xl:max-w-[150px]">
                  <span
                    className="mb-1 sm:mb-2 md:mb-3 text-gray-800"
                    tabIndex={0}
                    aria-label={
                      t("Entrega em Todo o País") +
                      ": " +
                      t("Entrega flexível") +
                      ". " +
                      t("Todo Portugal") +
                      "."
                    }
                  >
                    {/* Truck icon */}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" fill="none" viewBox="0 0 24 24">
                      <rect
                        x="3"
                        y="7"
                        width="13"
                        height="10"
                        rx="2"
                        stroke="#22272a"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M16 13h2.28a2 2 0 0 1 1.79 1.11l1.43 2.86A1 1 0 0 1 20.66 18H19a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3"
                        stroke="#22272a"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                  <div className="font-semibold text-gray-900 text-[10px] sm:text-xs lg:text-xs xl:text-sm mb-1 sm:mb-2 lg:mb-2 xl:mb-3">
                    {t("Entrega em Todo o País")}
                  </div>
                  <div className="text-gray-700 text-[9px] sm:text-xs lg:text-xs leading-tight max-w-[90px] sm:max-w-[110px] lg:max-w-[120px] xl:max-w-[130px] mb-1 sm:mb-2">
                    {t("Entrega flexível")}
                    <br />
                    {t("Todo Portugal")}
                  </div>
                </div>
                {/* Feature: Apoio ao Cliente */}
                <div className="flex flex-col items-center text-center w-full max-w-[100px] sm:max-w-[120px] lg:max-w-[140px] xl:min-w-[120px] xl:max-w-[150px]">
                  <span
                    className="mb-1 sm:mb-2 md:mb-3 text-gray-800"
                    tabIndex={0}
                    aria-label={
                      t("Apoio ao Cliente") +
                      ": " +
                      t("Equipa dedicada para ajudar") +
                      ". " +
                      t("Resolvemos tudo por ti") +
                      "."
                    }
                  >
                    {/* Headset/Support icon */}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M12 3a9 9 0 0 0-9 9v3a3 3 0 0 0 3 3h1v-4H6a1 1 0 0 1-1-1v-1a7 7 0 0 1 14 0v1a1 1 0 0 1-1 1h-1v4h1a3 3 0 0 0 3-3v-3a9 9 0 0 0-9-9Z"
                        stroke="#22272a"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="12"
                        cy="17"
                        r="2"
                        stroke="#22272a"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                  <div className="font-semibold text-gray-900 text-[10px] sm:text-xs lg:text-xs xl:text-sm mb-1 sm:mb-2 lg:mb-2 xl:mb-3">
                    {t("Apoio ao Cliente")}
                  </div>
                  <div className="text-gray-700 text-[9px] sm:text-xs lg:text-xs leading-tight max-w-[90px] sm:max-w-[110px] lg:max-w-[120px] xl:max-w-[130px] mb-1 sm:mb-2">
                    {t("Equipa dedicada para ajudar")}
                    <br />
                    {t("Resolvemos tudo por ti")}
                  </div>
                </div>
                {/* Feature: Sem Complicações */}
                <div className="flex flex-col items-center text-center w-full max-w-[100px] sm:max-w-[120px] lg:max-w-[140px] xl:min-w-[120px] xl:max-w-[150px]">
                  <span
                    className="mb-1 sm:mb-2 md:mb-3 text-gray-800"
                    tabIndex={0}
                    aria-label={
                      t("Sem Complicações") +
                      ": " +
                      t("Processo simples e rápido") +
                      ". " +
                      t("Tu escolhes, nós tratamos") +
                      "."
                    }
                  >
                    {/* Check/No stress icon */}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" fill="none" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#22272a"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 12l2 2 4-4"
                        stroke="#22272a"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div className="font-semibold text-gray-900 text-[10px] sm:text-xs lg:text-xs xl:text-sm mb-1 sm:mb-2 lg:mb-2 xl:mb-3">
                    {t("Sem Complicações")}
                  </div>
                  <div className="text-gray-700 text-[9px] sm:text-xs lg:text-xs leading-tight max-w-[90px] sm:max-w-[110px] lg:max-w-[120px] xl:max-w-[130px] mb-1 sm:mb-2">
                    {t("Processo simples e rápido")}
                    <br />
                    {t("Tu escolhes, nós tratamos")}
                  </div>
                </div>
                {/* Feature: Melhor Preço */}
                <div className="flex flex-col items-center text-center w-full max-w-[100px] sm:max-w-[120px] lg:max-w-[140px] xl:min-w-[120px] xl:max-w-[150px]">
                  <span
                    className="mb-1 sm:mb-2 md:mb-3 text-gray-800"
                    tabIndex={0}
                    aria-label={
                      t("Melhor Preço") +
                      ": " +
                      t("Garantimos o melhor valor") +
                      ". " +
                      t("Sem custos escondidos") +
                      "."
                    }
                  >
                    {/* Tag/Best price icon */}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M3 12V7a2 2 0 0 1 2-2h5l9 9-7 7-9-9Z"
                        stroke="#22272a"
                        strokeWidth="1.5"
                      />
                      <circle cx="7.5" cy="7.5" r="1.5" fill="#22272a" />
                    </svg>
                  </span>
                  <div className="font-semibold text-gray-900 text-[10px] sm:text-xs lg:text-xs xl:text-sm mb-1 sm:mb-2 lg:mb-2 xl:mb-3">
                    {t("Melhor Preço")}
                  </div>
                  <div className="text-gray-700 text-[9px] sm:text-xs lg:text-xs leading-tight max-w-[90px] sm:max-w-[110px] lg:max-w-[120px] xl:max-w-[130px] mb-1 sm:mb-2">
                    {t("Garantimos o melhor valor")}
                    <br />
                    {t("Sem custos escondidos")}
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* Video watermark background edge-to-edge */}
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm pointer-events-none z-0"
            src="/images/reboque.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-[#f5f6fa]/80 z-10" />
          <div className="relative z-20 max-w-5xl mx-auto text-center px-2 sm:px-4 pt-40 sm:pt-48 md:pt-56 lg:pt-32">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-semibold text-black mb-8 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
            >
              {t("Como Funciona")}
            </motion.h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-10">
              <span className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-white/80 border border-gray-200 text-gray-900 text-sm sm:text-lg font-semibold shadow-lg backdrop-blur-md transition hover:scale-105">
                {t("Simples")}
              </span>
              <span className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-white/80 border border-gray-200 text-gray-900 text-sm sm:text-lg font-semibold shadow-lg backdrop-blur-md transition hover:scale-105">
                {t("Transparente")}
              </span>
              <span className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-white/80 border border-gray-200 text-gray-900 text-sm sm:text-lg font-semibold shadow-lg backdrop-blur-md transition hover:scale-105">
                {t("Rápido")}
              </span>
            </div>
            {/* Increased top margin for tagline/intro on mobile/tablet */}
            <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-8"></div>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-800 mb-12 sm:mb-16 font-medium drop-shadow">
              {t(
                "Importa o teu carro europeu sem stress — só precisas de escolher, simular e pedir.",
              )}
              <br />
              <span className="font-bold">{t("Nós tratamos do resto!")}</span>
            </p>
            {/* Add extra space below intro for mobile/tablet */}
            <div className="block mb-8 sm:mb-12 md:mb-16 lg:mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white/95 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 flex flex-col items-center border-t-4 border-gray-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="mb-3 text-3xl font-bold text-gray-800">1</div>
                <div className="font-semibold text-xl mb-2 text-gray-900">
                  {t("Escolhe o carro")}
                </div>
                <p className="text-gray-600 mb-4 text-base">
                  {t(
                    "Seleciona entre dezenas de viaturas disponíveis ou pede uma pesquisa personalizada.",
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
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(213, 80, 80, 1)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.boxShadow =
                      "0 6px 24px 0 rgba(213,80,80,0.18)";
                    e.currentTarget.style.borderColor = "#b42121";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = "#222";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px 0 rgba(44,62,80,0.10)";
                    e.currentTarget.style.borderColor = "#b42121";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  {t("Ver Viaturas")}
                </Link>
              </div>
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 flex flex-col items-center border-t-4 border-gray-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="mb-3 text-3xl font-bold text-gray-800">2</div>
                <div className="font-semibold text-xl mb-2 text-gray-900">
                  {t("Simula custos")}
                </div>
                <p className="text-gray-600 mb-4 text-base">
                  {t(
                    "Usa o nosso simulador para saber quanto vais pagar, sem surpresas.",
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
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(213, 80, 80, 1)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.boxShadow =
                      "0 6px 24px 0 rgba(213,80,80,0.18)";
                    e.currentTarget.style.borderColor = "#b42121";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = "#222";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px 0 rgba(44,62,80,0.10)";
                    e.currentTarget.style.borderColor = "#b42121";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  {t("Simular ISV")}
                </Link>
              </div>
              <div className="bg-white/95 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 flex flex-col items-center border-t-4 border-gray-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="mb-3 text-3xl font-bold text-gray-800">3</div>
                <div className="font-semibold text-xl mb-2 text-gray-900">
                  {t("Importação e entrega")}
                </div>
                <p className="text-gray-600 mb-4 text-base">
                  {t(
                    "Cuidamos de todo o processo legal e entregamos o carro pronto a rolar.",
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
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(213, 80, 80, 1)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.boxShadow =
                      "0 6px 24px 0 rgba(213,80,80,0.18)";
                    e.currentTarget.style.borderColor = "#b42121";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = "#222";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px 0 rgba(44,62,80,0.10)";
                    e.currentTarget.style.borderColor = "#b42121";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  {t("Encomendar")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* LISTAGEM DE VIATURAS */}
        <section
          data-fullwidth
          className="relative w-screen py-16 sm:py-20"
          style={{
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-2 sm:px-7 lg:px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-4xl font-semibold text-black mb-12 text-center tracking-tight"
            >
              Carros usados em Destaque
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {featuredCars.map((car) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative">
                    {/* Recent-view badge (minimal) */}
                    {/* rendered client-side only: we'll derive recent clicks in an effect */}
                    {typeof window !== "undefined" && (
                      <RecentBadge carId={car.id} />
                    )}
                    <PremiumCarCard
                      name={`${car.make} ${car.model}`}
                      image={car.image}
                      price={car.price}
                      id={car.id}
                      year={car.year}
                      make={car.make}
                          mileage={car.mileage}
                      transmission={
                        car.gearboxType
                          ? car.gearboxType.toString()
                          : car.gearbox
                            ? car.gearbox.toString()
                            : ""
                      }
                      type={"SEDAN"}
                      country={car.country}
                      status={car.status}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

  {/* GOOGLE REVIEWS SECTION - ORGANIC CAROUSEL */}
  {/* Increase top padding so this section doesn't sit too close to the featured cars above */}
  <section data-fullwidth className="w-full py-8 sm:py-12 bg-[#f5f6fa]">
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
                className="flex gap-6 min-w-[700px] md:min-w-0 px-2 sm:px-4 overflow-x-auto scroll-smooth pb-2"
              >
                {googleReviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="shadow-xl rounded-2xl p-6 min-w-[320px] max-w-xs flex flex-col justify-between hover:shadow-2xl transition-all duration-200 bg-gradient-to-br from-white via-[#fbe9e9] to-[#f5f6fa] border border-[#b42121]/10 relative"
                  >
                    {/* Decorative quote icon */}
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
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline"
                      >
                        <path stroke="#b42121" strokeWidth="2" d="M8 7V3h8v4" />
                        <rect
                          width="16"
                          height="18"
                          x="4"
                          y="3"
                          rx="2"
                          stroke="#b42121"
                          strokeWidth="2"
                        />
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

  {/* NOVOS ARTIGOS SECTION - SCROLLABLE CAROUSEL */}
  <section data-fullwidth className="w-full py-10 sm:py-14 bg-[#f5f6fa]">
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
                className="flex gap-6 min-w-[700px] md:min-w-0 px-2 sm:px-4 overflow-x-auto scroll-smooth pb-2"
              >
                {blogArticles.map((article, idx) => (
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
                    <div className="p-4 flex flex-col h-[180px]">
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(article.date).toLocaleDateString("pt-PT")}
                      </div>
                      <div
                        className="font-bold text-lg text-gray-900 mb-1"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "normal",
                          // use em-based line height so the clamp scales with font-size
                          lineHeight: "1.2em",
                          maxHeight: `calc(1.2em * 2)`,
                          boxSizing: "border-box",
                        }}
                      >
                        {article.title}
                      </div>
                      <div
                        className="text-gray-700 text-sm mb-4"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "normal",
                          lineHeight: "1rem",
                          maxHeight: `calc(1rem * 3)`,
                          boxSizing: "border-box",
                        }}
                      >
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

// Small component: shows a minimal 'Visto recentemente' badge if this car id exists in localStorage clicks (7d TTL)
function RecentBadge({ carId }) {
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("autogo_clicked_v1");
      if (!raw) return;
      const parsed = JSON.parse(raw) || [];
      const TTL = 1000 * 60 * 60 * 24 * 7;
      const found = parsed.find((it) => it.id === carId && Date.now() - (it.ts || 0) < TTL);
      if (found) setSeen(true);
    } catch (e) {
      // ignore
    }
  }, [carId]);

  if (!seen) return null;
  return (
    <span className="absolute top-3 left-3 bg-white/90 text-[#b42121] px-3 py-1 rounded-full text-xs font-semibold shadow-sm" style={{ backdropFilter: 'blur(4px)' }}>
      Visto recentemente
    </span>
  );
}

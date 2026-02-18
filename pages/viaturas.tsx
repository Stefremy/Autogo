import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
// Icons moved to sub-components, removed unused imports
// (FaTachometerAlt, FaSearch removed)
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SimuladorTabela from "../components/SimuladorTabela";
import styles from "../components/PremiumCarCard.module.css";
// cars.json import removed to reduce bundle size
import MainLayout from "../components/MainLayout";
import { VIATURAS_KEYWORDS, SITE_WIDE_KEYWORDS, SEO_KEYWORDS, joinKeywords } from "../utils/seoKeywords";
import Seo from "../components/Seo";
import { generateGEOFAQSchema } from "../utils/geoOptimization";
import { normalizeMake, parseMileage, parsePrice } from "../utils/carProcessors";
import ViaturasFilterBar from "../components/ViaturasFilterBar";
import ViaturasGrid from "../components/ViaturasGrid";
import { Car } from "../types/car";

export default function Viaturas({ cars = [] }: { cars: Car[] }) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [mes, setMes] = useState("");
  const [dia, setDia] = useState("");
  const [km, setKm] = useState("");
  const [showSimulador, setShowSimulador] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  // Sorting state: relevance, alphabetical, yearDesc, priceAsc, mileageAsc
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [showSortMenu, setShowSortMenu] = useState(false);
  // Load strategy: load N rows at a time. Grid columns determine items per row.
  const ROWS_PER_BATCH = 2; // user request: load 2 rows per load
  const [columnsCount, setColumnsCount] = useState(4); // default to desktop columns
  const itemsPerBatch = columnsCount * ROWS_PER_BATCH; // computed items to load per action
  const [itemsLoaded, setItemsLoaded] = useState(itemsPerBatch);
  const PAGE_SIZE = itemsPerBatch;
  void PAGE_SIZE; // intentionally unused derived constant

  // compute columns by listening to window width (matches Tailwind breakpoints used in grid)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const calc = () => {
      const w = window.innerWidth;
      let cols = 1;
      if (w >= 1280) cols = 4; // xl
      else if (w >= 768) cols = 3; // md
      else if (w >= 640) cols = 2; // sm
      else cols = 1;
      setColumnsCount(cols);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // ensure we always have at least one batch loaded when columns change
  useEffect(() => {
    setItemsLoaded((prev) => Math.max(prev, itemsPerBatch));
  }, [itemsPerBatch]);

  // Persist logic for recent clicks
  const onCarClick = (car: Car) => {
    try {
      const KEY = "autogo_clicked_v1";
      const TTL = 1000 * 60 * 60 * 24 * 7; // 7 days
      const raw = localStorage.getItem(KEY);
      let arr: any[] = [];
      if (raw) {
        arr = JSON.parse(raw) || [];
        // filter out expired entries due to TTL
        arr = arr.filter((it: any) => Date.now() - (it.ts || 0) < TTL);
      }
      // remove existing for this id
      arr = arr.filter((it: any) => it.id !== car.id);
      // add to front
      arr.unshift({ id: car.id, ts: Date.now() });
      // cap size
      if (arr.length > 50) arr = arr.slice(0, 50);
      localStorage.setItem(KEY, JSON.stringify(arr));
    } catch {
      // ignore
    }
  };

  // Normalize make strings using shared utility
  // (local function removed in favor of import)

  // Persist and restore filter inputs so user values are remembered across visits
  const STORAGE_KEY = "autogo_filters_v1";

  // Restore saved filters on first client render (only runs in browser)
  useEffect(() => {
    if (typeof window === 'undefined' || !router.isReady) return;
    try {
      const q = router.query;
      const hasUrlParams = !!(q.marca || q.modelo || q.minPrice || q.maxPrice || q.ano || q.page);

      if (hasUrlParams) {
        if (q.marca) setMarca(String(q.marca));
        if (q.modelo) setModelo(String(q.modelo));
        if (q.ano) setAno(String(q.ano));
        if (q.minPrice) setMinPrice(String(q.minPrice));
        if (q.maxPrice) setMaxPrice(String(q.maxPrice));
        if (q.page) {
          const p = parseInt(String(q.page), 10);
          if (!isNaN(p) && p > 0) setItemsLoaded(p * itemsPerBatch);
        }
        return; // URL params take priority
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw || "{}");
      if (saved) {
        if (saved.marca) setMarca(saved.marca);
        if (saved.modelo) setModelo(saved.modelo);
        if (saved.ano) setAno(saved.ano);
        if (saved.mes) setMes(saved.mes);
        if (saved.dia) setDia(saved.dia);
        if (saved.km) setKm(saved.km);
        if (saved.countryFilter) setCountryFilter(saved.countryFilter);
        if (saved.minPrice) setMinPrice(String(saved.minPrice));
        if (saved.maxPrice) setMaxPrice(String(saved.maxPrice));
        if (saved.itemsLoaded) setItemsLoaded(Number(saved.itemsLoaded) || itemsPerBatch);
      }
    } catch {
      // ignore parse errors
    }
  }, [router.isReady, router.query, itemsPerBatch]);

  // Save filters whenever they change so the user's inputs are remembered
  useEffect(() => {
    if (typeof window === "undefined" || !router.isReady) return;
    try {
      const toSave = {
        marca,
        modelo,
        ano,
        mes,
        dia,
        km,
        countryFilter,
        minPrice,
        maxPrice,
        itemsLoaded,
        ts: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));

      // Sync to URL query parameters for back-button persistence and sharing
      const query: any = { ...router.query };
      const update = (key: string, val: string | number | null | undefined) => {
        if (val) query[key] = String(val); else delete query[key];
      };
      update("marca", marca);
      update("modelo", modelo);
      update("minPrice", minPrice);
      update("maxPrice", maxPrice);
      update("ano", ano);
      const pageNum = Math.ceil(itemsLoaded / itemsPerBatch);
      if (pageNum > 1) query.page = String(pageNum); else delete query.page;

      router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
    } catch {
      // ignore storage errors
    }
  }, [marca, modelo, ano, mes, dia, km, countryFilter, minPrice, maxPrice, itemsLoaded, itemsPerBatch, router]);

  // Unique options for selects
  const marcas = Array.from(
    new Set(cars.map((car) => String((car as any).make ?? ""))),
  ).filter(Boolean);
  const modelos = Array.from(
    new Set(
      cars
        .filter((car) => !marca || String((car as any).make ?? "") === marca)
        .map((car) => String((car as any).model ?? "")),
    ),
  ).filter(Boolean);
  // Normalize year values to numbers (handles strings like "2019-12-10")
  const anos: number[] = Array.from(
    new Set(
      cars
        .map((car) => {
          const y = (car as any).year;
          if (typeof y === 'number') return y;
          if (typeof y === 'string') {
            const m = y.match(/^(\d{4})/);
            if (m) return Number(m[1]);
            const n = Number(y);
            if (!Number.isNaN(n)) return n;
          }
          return null;
        })
        .filter((v) => v !== null) as number[],
    ),
  ).sort((a, b) => Number(b) - Number(a));
  const meses = Array.from({ length: 12 }, (_, i) => i + 1);
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);

  // Reset loaded items when filters change
  React.useEffect(() => {
    setItemsLoaded(itemsPerBatch);
  }, [marca, modelo, ano, mes, km, minPrice, maxPrice, itemsPerBatch]);

  // Reset loaded items when country filter changes
  React.useEffect(() => {
    setItemsLoaded(itemsPerBatch);
  }, [countryFilter, itemsPerBatch]);

  // Reset itemsLoaded when sort changes so user sees top of sorted list
  React.useEffect(() => {
    setItemsLoaded(itemsPerBatch);
  }, [sortBy, itemsPerBatch]);

  // Filtering logic por dia, mês e ano (campos day, month, year)
  const filteredCars = cars.map((car, index) => ({ ...car, originalIndex: index })).filter((car) => {
    const carCountry = String(car.country ?? "").toLowerCase();
    const cf = String(countryFilter ?? "").toLowerCase();

    // normalize year for comparison
    const carYearStr = (() => {
      const y = (car as any).year;
      if (typeof y === 'number') return String(y);
      if (typeof y === 'string') {
        const m = y.match(/^(\d{4})/);
        if (m) return m[1];
        const n = Number(y);
        if (!Number.isNaN(n)) return String(n);
      }
      return '';
    })();

    // safe mileage number
    const mileageNum = parseMileage((car as any).mileage);

    // safe numeric price for filtering
    const priceNum = parsePrice((car as any).price);

    return (
      (!marca || normalizeMake((car as any).make) === normalizeMake(marca)) &&
      (!modelo || car.model === modelo) &&
      (!countryFilter || carCountry === cf) &&
      (!ano || carYearStr === ano) &&
      (!mes || (car.hasOwnProperty('month') && String((car as any).month).padStart(2, '0') === mes.padStart(2, '0'))) &&
      (!km || (mileageNum !== null && mileageNum <= parseInt(km, 10))) &&
      (!minPrice || (priceNum !== null && priceNum >= parseInt(minPrice || '0', 10))) &&
      (!maxPrice || (priceNum !== null && priceNum <= parseInt(maxPrice || '0', 10)))
    );
  });

  // Apply sorting to filtered results before slicing for infinite scroll
  const sortedCars = useMemo(() => {
    const copy = Array.from(filteredCars);
    const num = (v: any) => {
      if (v == null) return null;
      if (typeof v === 'number') return v;
      const n = Number(String(v).replace(/[^0-9.-]/g, ''));
      return Number.isFinite(n) ? n : null;
    };
    copy.sort((a: any, b: any) => {
      const priceA = num(a.price);
      const priceB = num(b.price);
      const yearA = (() => { const y = a.year; return typeof y === 'number' ? y : (typeof y === 'string' && /^\d{4}/.test(y) ? Number(String(y).match(/^(\d{4})/)[1]) : null); })();
      const yearB = (() => { const y = b.year; return typeof y === 'number' ? y : (typeof y === 'string' && /^\d{4}/.test(y) ? Number(String(y).match(/^(\d{4})/)[1]) : null); })();
      const milA = (() => { const v = a.mileage; if (v == null) return null; if (typeof v === 'number') return v; const n = Number(String(v).replace(/[^0-9]/g, '')); return Number.isFinite(n) ? n : null; })();
      const milB = (() => { const v = b.mileage; if (v == null) return null; if (typeof v === 'number') return v; const n = Number(String(v).replace(/[^0-9]/g, '')); return Number.isFinite(n) ? n : null; })();
      const aStr = ((a.make || '') + ' ' + (a.model || '')).toString().toLowerCase();
      const bStr = ((b.make || '') + ' ' + (b.model || '')).toString().toLowerCase();

      switch (sortBy) {
        case 'priceAsc': return (priceA ?? Infinity) - (priceB ?? Infinity);
        case 'priceDesc': return (priceB ?? -Infinity) - (priceA ?? -Infinity);
        case 'yearAsc': return (yearA ?? Infinity) - (yearB ?? Infinity);
        case 'yearDesc': return (yearB ?? -Infinity) - (yearA ?? -Infinity);
        case 'mileageAsc': return (milA ?? Infinity) - (milB ?? Infinity);
        case 'mileageDesc': return (milB ?? -Infinity) - (milA ?? -Infinity);
        case 'alphabetical': return aStr.localeCompare(bStr);
        case 'newToOld': return b.originalIndex - a.originalIndex;
        default: return 0; // relevance: keep original filtered order
      }
    });
    return copy;
  }, [filteredCars, sortBy]);

  // Displayed cars for infinite scroll (slice the sorted list up to itemsLoaded)
  // Apply query matching: if a searchQuery is present, filter using matchesQuery helper
  // (matchesQuery uses normalize/tokenize and supports aliases like "segunda mao"/"usados").
  const [searchQuery, setSearchQuery] = React.useState("");
  // lazy-import helper to avoid blocking initial render
  const { matchesQuery } = (function tryImport() {
    try {
      return require('../utils/search');
    } catch {
      // fallback stub
      return { matchesQuery: (c: any, q: string) => !q || String(q).trim() === '' };
    }
  })();

  const displayedCars = sortedCars.filter((c) => matchesQuery(c, searchQuery)).slice(0, itemsLoaded);

  // Infinite scroll: load more when there is empty space using a sentinel
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const sentinel = document.getElementById('viaturas-sentinel');
    if (!sentinel) return; // sentinel not in DOM yet
    if (itemsLoaded >= filteredCars.length) return; // nothing to load

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setItemsLoaded((prev) => Math.min(filteredCars.length, prev + itemsPerBatch));
          }
        });
      },
      {
        root: null,
        // Become visible a bit before the bottom so content loads early when there's empty space
        rootMargin: '0px 0px 300px 0px',
        threshold: 0.01,
      },
    );

    io.observe(sentinel);

    // If the page is already short (sentinel in viewport), trigger load once synchronously
    try {
      const rect = sentinel.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setItemsLoaded((prev) => Math.min(filteredCars.length, prev + itemsPerBatch));
      }
    } catch {
      // ignore
    }

    return () => io.disconnect();
  }, [itemsLoaded, filteredCars.length, itemsPerBatch]);

  // Status translation map
  // Status labels and colors moved to ViaturasGrid component

  // Keep a stable reference to the runtime-mapped CSS class name so effects
  // don't need to list the `styles` module in dependency arrays.
  const animClassRef = React.useRef<string | null>(styles['card-anim'] || null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    // Use the cached class name from the ref so the effect does not read `styles` directly
    const animClass = animClassRef.current;
    if (!animClass) return;
    const selector = `.${animClass}`;
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!els.length) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            // Add in-view immediately; --enter-delay controls CSS stagger
            if (!cancelled) el.classList.add('in-view');
            io.unobserve(el);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [displayedCars.length, animClassRef]);

  // GEO-optimized structured data for "carros importados" and "carros usados"
  const viaturasGEOSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        '@id': 'https://autogo.pt/viaturas#carlist',
        name: 'Carros Importados e Usados em Portugal',
        description: 'Catálogo de carros importados da Europa e viaturas usadas à venda em Portugal pela AutoGo.pt',
        numberOfItems: filteredCars.length,
        itemListElement: displayedCars.slice(0, 10).map((car, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Car',
            '@id': `https://autogo.pt/cars/${car.slug}`,
            name: `${car.make} ${car.model}`,
            brand: {
              '@type': 'Brand',
              name: car.make,
            },
            model: car.model,
            vehicleModelDate: car.year,
            mileageFromOdometer: {
              '@type': 'QuantitativeValue',
              value: car.mileage,
              unitCode: 'KMT',
            },
            offers: {
              '@type': 'Offer',
              price: car.price,
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
              seller: {
                '@id': 'https://autogo.pt/#organization',
              },
            },
            image: car.image?.startsWith('http') ? car.image : `https://autogo.pt${car.image}`,
            url: `https://autogo.pt/cars/${car.slug}`,
          },
        })),
      },
      generateGEOFAQSchema([
        {
          question: 'Onde comprar carros importados em Portugal?',
          answer: 'A AutoGo.pt especializa-se em carros importados da Europa para Portugal. Oferecemos BMW, Mercedes-Benz, Audi, Peugeot e outras marcas com preços competitivos. Todos os veículos incluem transporte, legalização completa e matrícula portuguesa.',
          keywords: ['carros importados', 'comprar carros', 'Portugal', 'Europa'],
        },
        {
          question: 'Carros importados são confiáveis?',
          answer: 'Sim. Carros importados da União Europeia passam por inspeção técnica rigorosa antes da compra e após chegarem a Portugal (inspeção IMT tipo B). A AutoGo.pt verifica o histórico, estado mecânico e documentação antes de importar.',
          keywords: ['confiáveis', 'qualidade', 'inspeção', 'garantia'],
        },
        {
          question: 'Qual a diferença entre carros importados e nacionais?',
          answer: 'Carros importados geralmente têm preços mais competitivos devido ao mercado europeu. A diferença está na origem e processo de legalização (ISV, IMT), mas a qualidade e garantias são equivalentes. Todos ficam com matrícula portuguesa.',
          keywords: ['diferença', 'nacional', 'importado', 'preço'],
        },
        {
          question: 'Carros usados importados valem a pena?',
          answer: 'Sim. Carros usados importados oferecem excelente relação qualidade-preço. O ISV tem descontos progressivos (10%-80% conforme idade), tornando viaturas semi-novas muito mais acessíveis que modelos equivalentes nacionais.',
          keywords: ['carros usados', 'vale a pena', 'vantagens', 'ISV desconto'],
        },
        {
          question: 'Quanto custa um BMW importado em Portugal?',
          answer: 'O preço varia conforme modelo e ano. Na AutoGo.pt encontra BMW Série 3 desde €15.000, BMW X5 desde €25.000, sempre com preço final incluindo ISV, transporte e legalização. Use os nossos filtros para comparar opções.',
          keywords: ['BMW', 'preço', 'custo', 'valores'],
        },
      ]),
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://autogo.pt/viaturas#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Início',
            item: 'https://autogo.pt',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Carros Importados',
            item: 'https://autogo.pt/viaturas',
          },
        ],
      },
    ],
  };

  return (
    <>
      <Seo
        title={SEO_KEYWORDS.viaturas?.title ?? 'Carros Importados Portugal | AutoGo.pt'}
        description={SEO_KEYWORDS.viaturas?.description ?? ''}
        url={`https://autogo.pt/viaturas`}
        image={`https://autogo.pt/images/auto-logo.webp`}
        keywords={joinKeywords(SEO_KEYWORDS.viaturas?.keywords ?? [], SITE_WIDE_KEYWORDS, VIATURAS_KEYWORDS)}
        jsonLd={viaturasGEOSchema}
      />
      <div className="min-h-screen w-full bg-gradient-to-br from-[#f5f6fa] via-[#fbe9e9] to-[#f5f6fa] flex flex-col">
        <img
          src="/images/viaturas-fundo.webp"
          alt="Fundo"
          className="pointer-events-none select-none fixed inset-0 w-screen h-screen object-cover object-center opacity-25 md:opacity-35 z-0 transition-all duration-700"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            filter: "blur(1px)",
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
            maxHeight: "100vh",
          }}
        />
        <div
          className="pointer-events-none select-none fixed inset-0 w-screen h-screen z-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(245,246,250,0.92) 0%, rgba(245,246,250,0.18) 60%, rgba(245,246,250,0.92) 100%)",
          }}
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
        {/* Soft gradient overlay for extra depth */}
        <div
          className="pointer-events-none select-none fixed inset-0 w-screen h-screen z-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(245,246,250,0.80) 0%, rgba(251,233,233,0.65) 60%, rgba(245,246,250,0.80) 100%)",
          }}
        />
        <MainLayout>
          <section className="w-full px-0 py-12 bg-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
              <h1
                className="text-4xl font-semibold text-center sm:text-left text-black"
                style={{
                  color: "#000",
                  fontWeight: 600,
                  zIndex: 10,
                  position: "relative",
                }}
              >
                {t("Viaturas Disponíveis")}
              </h1>
              <div className="flex gap-2 justify-center sm:justify-end relative">
                {/* Sort dropdown button */}
                <div className="mr-2 relative inline-block text-left">
                  <button
                    type="button"
                    onClick={() => setShowSortMenu((s) => !s)}
                    className="sort-toggle inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-[#e8e8e8] shadow-sm hover:shadow-md text-sm transition-transform duration-150"
                    aria-expanded={showSortMenu}
                    aria-haspopup="menu"
                  >
                    {t('Ordenar')}
                    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.354a.75.75 0 111.02 1.1l-4.25 3.842a.75.75 0 01-1.02 0L5.21 8.33a.75.75 0 01.02-1.12z" clipRule="evenodd" /></svg>
                  </button>
                  {showSortMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-md shadow-lg z-40 menu-pop">
                      <ul className="py-1">
                        <li>
                          <button onClick={() => { setSortBy('mileageAsc'); setShowSortMenu(false); }} className="sort-menu-item w-full text-left px-3 py-2 text-sm">{t('Kilometragem ↑')}</button>
                        </li>
                        <li>
                          <button onClick={() => { setSortBy('mileageDesc'); setShowSortMenu(false); }} className="sort-menu-item w-full text-left px-3 py-2 text-sm">{t('Kilometragem ↓')}</button>
                        </li>
                        <li>
                          <button onClick={() => { setSortBy('yearDesc'); setShowSortMenu(false); }} className="sort-menu-item w-full text-left px-3 py-2 text-sm">{t('Ano ↓')}</button>
                        </li>
                        <li>
                          <button onClick={() => { setSortBy('newToOld'); setShowSortMenu(false); }} className="sort-menu-item w-full text-left px-3 py-2 text-sm">{t('Mais Recente Online')}</button>
                        </li>
                        <li>
                          <button onClick={() => { setSortBy('yearAsc'); setShowSortMenu(false); }} className="sort-menu-item w-full text-left px-3 py-2 text-sm">{t('Ano ↑')}</button>
                        </li>
                        <li>
                          <button onClick={() => { setSortBy('alphabetical'); setShowSortMenu(false); }} className="sort-menu-item w-full text-left px-3 py-2 text-sm">{t('Alfabético')}</button>
                        </li>
                        <li>
                          <button onClick={() => { setSortBy('priceAsc'); setShowSortMenu(false); }} className="sort-menu-item w-full text-left px-3 py-2 text-sm">{t('Preço ↑')}</button>
                        </li>
                        <li>
                          <button onClick={() => { setSortBy('priceDesc'); setShowSortMenu(false); }} className="sort-menu-item w-full text-left px-3 py-2 text-sm">{t('Preço ↓')}</button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <style>{` 
                  @keyframes pulse-sleek {
                    0%,
                    100% {
                      box-shadow:
                        0 4px 18px 0 rgba(213, 80, 80, 0.18),
                        0 0 0 0 rgba(213, 80, 80, 0.25);
                    }
                    50% {
                      box-shadow:
                        0 4px 28px 0 rgba(213, 80, 80, 0.28),
                        0 0 0 8px rgba(213, 80, 80, 0.1);
                    }
                  }

                  /* dropdown open animation */
                  @keyframes menu-pop { from { opacity: 0; transform: translateY(-6px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
                  .menu-pop { animation: menu-pop 220ms cubic-bezier(.2,.9,.2,1); transform-origin: top right; will-change: transform, opacity; }

                  /* toggle tactile effect */
                  .sort-toggle:active { transform: scale(0.98); }
                  .sort-toggle:focus { outline: none; box-shadow: 0 8px 24px rgba(180,33,33,0.12); }

                  @media (prefers-reduced-motion: reduce) {
                    .menu-pop { animation: none !important; }
                    .sort-toggle { transition: none !important; }
                  }

                  /* Clickable open effect for car info area */
                  .clickable-open { transition: transform 160ms cubic-bezier(.2,.9,.2,1), box-shadow 160ms; will-change: transform; }
                  .clickable-open:active { transform: scale(0.992); }
                  .clickable-open:focus { outline: none; box-shadow: 0 10px 30px rgba(0,0,0,0.08); transform: translateY(-2px) scale(1.002); }
                  .clickable-open img { transition: transform 260ms cubic-bezier(.2,.9,.2,1); }
                  .clickable-open:active img { transform: scale(0.98); }
                  .clickable-open:hover img { transform: translateY(-4px) scale(1.02); }

                  @media (prefers-reduced-motion: reduce) {
                    .clickable-open, .clickable-open img { transition: none !important; transform: none !important; box-shadow: none !important; }
                  }

                  /* Enhanced hover/focus for sort menu items */
                  .sort-menu-item { 
                    display: flex; 
                    align-items: center; 
                    gap: 8px; 
                    position: relative; 
                    padding-left: 14px; 
                    transition: background 180ms cubic-bezier(.2,.9,.2,1), transform 140ms cubic-bezier(.2,.9,.2,1), color 160ms; 
                    color: #111827; /* tailwind gray-900 */
                  }
                  .sort-menu-item::before {
                    content: "";
                    position: absolute;
                    left: 8px;
                    width: 4px;
                    height: 16px;
                    border-radius: 2px;
                    background: transparent;
                    transform-origin: center;
                    transform: scaleY(0.6);
                    opacity: 0;
                    transition: background 180ms, transform 180ms, opacity 180ms;
                  }
                  .sort-menu-item:hover, .sort-menu-item:focus {
                    background: linear-gradient(90deg, rgba(180,33,33,0.06), rgba(213,80,80,0.04));
                    transform: translateX(6px);
                    color: #b42121;
                    outline: none;
                  }
                  .sort-menu-item:hover::before, .sort-menu-item:focus::before {
                    background: linear-gradient(180deg, #b42121, #d50032);
                    transform: scaleY(1);
                    opacity: 1;
                  }
                  @media (prefers-reduced-motion: reduce) {
                    .sort-menu-item, .sort-menu-item::before { transition: none !important; transform: none !important; }
                  }
                `}</style>
                <Link
                  href="/pedido"
                  className="rounded-full py-2 px-6 font-bold text-base shadow-lg transition-all duration-200 text-white border-0 animate-[pulse-sleek_1.6s_ease-in-out_infinite]"
                  style={{
                    background: "rgba(213, 80, 80, 0.85)",
                    color: "#fff",
                    opacity: 1,
                    boxShadow: "0 4px 18px 0 rgba(213,80,80,0.18)",
                    zIndex: 20,
                    position: "relative",
                    isolation: "isolate",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "rgba(213, 80, 80, 1)")
                  }
                  onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(213, 80, 80, 0.85)")
                  }
                >
                  {t("Encomendar")}
                </Link>
              </div>
            </div>
            {/* (Pagination moved below the cards, right-aligned for a cleaner UI) */}
            {/* Filtros estilizados */}
            {/* Filtros estilizados - Extracted to ViaturasFilterBar */}
            <ViaturasFilterBar
              marca={marca} setMarca={setMarca}
              modelo={modelo} setModelo={setModelo}
              minPrice={minPrice} setMinPrice={setMinPrice}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              dia={dia} setDia={setDia}
              mes={mes} setMes={setMes}
              ano={ano} setAno={setAno}
              km={km} setKm={setKm}
              marcas={marcas} modelos={modelos}
              meses={meses} dias={dias} anos={anos}
              onClearFilters={() => {
                setMarca(""); setModelo(""); setAno(""); setMes(""); setDia(""); setKm("");
                setCountryFilter(""); setMinPrice(""); setMaxPrice("");
                try { localStorage.removeItem(STORAGE_KEY); } catch { }
              }}
            />
            {/* Grid de resultados - Extracted to ViaturasGrid */}
            <ViaturasGrid
              cars={displayedCars as any}
              styles={styles}
              onCarClick={onCarClick}
            />

            {/* sentinel element observed by IntersectionObserver to auto-load more when there is empty space */}
            <div id="viaturas-sentinel" style={{ height: 1 }} />

            {/* IntersectionObserver to reveal cards smoothly as they scroll into view */}
            <script /* injected for client-only observer */ />
            {
              /* Client-only effect: observe .card-anim and add .in-view when intersecting */
            }
            {process.browser && null}
            {/* infinite-scroll: no page selector — more items load as the user scrolls */}
            <div className="max-w-7xl mx-auto mt-6 px-4 text-center text-gray-500">
              {itemsLoaded < filteredCars.length ? (
                <span className="loading-dots" role="status" aria-live="polite">
                  {t('A carregar')}
                  <span className="dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </span>
              ) : (
                t('Todos os resultados carregados')
              )}
              <style jsx>{`
                .loading-dots { display: inline-flex; align-items: center; gap: 8px; font-weight: 500; }
                .dots { display: inline-flex; gap: 6px; margin-left: 6px; align-items: center; }
                .dots span { display: inline-block; width: 7px; height: 7px; background: currentColor; border-radius: 50%; opacity: 0.25; transform: translateY(0); animation: dot-bounce 1s infinite ease-in-out; }
                .dots span:nth-child(1) { animation-delay: 0s; }
                .dots span:nth-child(2) { animation-delay: 0.12s; }
                .dots span:nth-child(3) { animation-delay: 0.24s; }
                @keyframes dot-bounce {
                  0% { opacity: 0.25; transform: translateY(0); }
                  30% { opacity: 1; transform: translateY(-6px); }
                  60% { opacity: 0.25; transform: translateY(0); }
                  100% { opacity: 0.25; transform: translateY(0); }
                }
                @media (prefers-reduced-motion: reduce) {
                  .dots span { animation: none; opacity: 0.6; transform: none; }
                }
              `}</style>
            </div>
          </section>
        </MainLayout>

        {/* Widget flutuante AutoGo logo */}
        <button
          onClick={() => setShowSimulador(true)}
          className="fixed bottom-6 right-6 z-50 bg-white rounded-full shadow-xl border-4 border-white p-2 hover:scale-110 transition-all"
          style={{
            width: 70,
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label={t("Abrir simulador ISV")}
        >
          <img
            src="/images/auto-logo.webp"
            alt={t("Abrir simulador ISV")}
            className="w-12 h-12 object-contain"
          />
        </button>

        {/* Drawer do simulador */}
        <div
          className={`fixed right-4 bottom-4 z-50 transition-transform duration-500 ${showSimulador ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}
          style={{ minWidth: 320, maxWidth: 380, width: "90vw" }}
        >
          <div className="bg-white/95 rounded-3xl shadow-2xl border border-[#b42121]/10 backdrop-blur-md p-4 sm:p-6 flex flex-col items-center relative">
            <button
              onClick={() => setShowSimulador(false)}
              className="absolute top-3 right-4 text-[#b42121] text-2xl font-bold hover:scale-125 transition"
              aria-label={t("Fechar simulador")}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-2 text-[#b42121]">
              {t("Simulador ISV")}
            </h2>
            {/* Simulador ISV compacto (apenas tabela) */}
            <div className="w-full">
              <SimuladorTabela />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  try {
    const locale = context.locale || context.defaultLocale || 'pt';

    // Load cars data server-side only
    // We use require here to avoid bundling the large JSON on the client
    const carsData = require('../data/cars.json');

    // Map to lightweight structure for list view
    const lightCars = carsData.map(car => ({
      id: car.id,
      make: car.make,
      model: car.model,
      price: car.price,
      priceDisplay: car.priceDisplay || null,
      year: car.year,
      month: car.month || null,
      mileage: car.mileage,
      slug: car.slug,
      country: car.country,
      status: car.status || null,
      image: car.image || null,
      // Only send first 5 images for thumbnails to save bandwidth
      images: Array.isArray(car.images) ? car.images.slice(0, 5) : [],
    }));

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        cars: lightCars,
      },
    };
  } catch (error) {
    console.error("Error in getStaticProps /viaturas:", error);
    return {
      props: {
        cars: [], // fallback to empty list to avoid crashing
        error: "Failed to load cars",
      }
    };
  }
}
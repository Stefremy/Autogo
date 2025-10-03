import Link from "next/link";
import React, { useState } from "react";
import {
  FaCarSide,
  FaCalendarAlt,
  FaTachometerAlt,
  FaSearch,
} from "react-icons/fa";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import SimuladorTabela from "../components/SimuladorTabela";
import styles from "../components/PremiumCarCard.module.css";
import cars from "../data/cars.json";
import MainLayout from "../components/MainLayout";
import MakeLogo from "../components/MakeLogo";

export default function Viaturas() {
  const { t } = useTranslation("common");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [mes, setMes] = useState("");
  const [dia, setDia] = useState("");
  const [km, setKm] = useState("");
  const [showSimulador, setShowSimulador] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("1000");
  const [maxPrice, setMaxPrice] = useState("10000");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

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

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [marca, modelo, ano, mes, km, minPrice, maxPrice]);

  // Reset page when country filter changes
  React.useEffect(() => {
    setPage(1);
  }, [countryFilter]);

  // Filtering logic por dia, mês e ano (campos day, month, year)
  const filteredCars = cars.filter((car) => {
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
    const mileageNum = (() => {
      const v = (car as any).mileage;
      if (v == null) return null;
      if (typeof v === 'number') return v;
      const n = parseInt(String(v).replace(/[^0-9]/g, ''), 10);
      return Number.isFinite(n) ? n : null;
    })();

    // safe numeric price for filtering
    const priceNum = (() => {
      const v = (car as any).price;
      if (v == null) return null;
      if (typeof v === 'number') return Number.isFinite(v) ? v : null;
      if (typeof v === 'string') {
        const digits = String(v).replace(/[^0-9.-]/g, '');
        const n = Number(digits);
        return Number.isFinite(n) ? n : null;
      }
      return null;
    })();

    return (
      (!marca || car.make === marca) &&
      (!modelo || car.model === modelo) &&
      (!countryFilter || carCountry === cf) &&
      (!ano || carYearStr === ano) &&
      (!mes || (car.hasOwnProperty('month') && String((car as any).month).padStart(2, '0') === mes.padStart(2, '0'))) &&
      (!km || (mileageNum !== null && mileageNum <= parseInt(km, 10))) &&
      (!minPrice || (priceNum !== null && priceNum >= parseInt(minPrice || '0', 10))) &&
      (!maxPrice || (priceNum !== null && priceNum <= parseInt(maxPrice || '0', 10)))
    );
  });

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredCars.length / PAGE_SIZE));
  const clampedPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (clampedPage - 1) * PAGE_SIZE;
  const paginatedCars = filteredCars.slice(startIndex, startIndex + PAGE_SIZE);
  // Pagination button state helpers to improve affordance
  const prevDisabled = clampedPage <= 1;
  const nextDisabled = clampedPage >= totalPages;

  // Status translation map
  const statusLabels = {
    disponivel: t("Disponível"),
    vendido: t("Vendido"),
    sob_consulta: t("Sob Consulta"),
    novidade: t("Novidade"), // Added novidade label
  };
  const statusColors = {
    disponivel: "bg-green-500",
    vendido: "bg-gray-400",
    sob_consulta: "bg-yellow-400",
    novidade: "bg-blue-500", // Added novidade color
  };

  return (
    <>
      <Head>
        <title>
          Carros importados europeus, BMW, Audi, Mercedes, Peugeot à venda em
          Portugal | AutoGo.pt
        </title>
        <meta
          name="description"
          content="Encontra carros importados europeus, BMW, Audi, Mercedes, Peugeot, Volkswagen, Renault, Citroën e outros modelos populares à venda em Portugal. Carros usados e seminovos com garantia e financiamento."
        />
        <meta
          name="keywords"
          content="carros importados, carros europeus, carros BMW usados, Audi usados, Mercedes usados, Peugeot usados, Volkswagen usados, Renault usados, Citroën usados, carros importados à venda, carros importados Portugal, carros usados europeus, carros seminovos europeus"
        />
        <meta
          property="og:title"
          content="Carros importados europeus, BMW, Audi, Mercedes, Peugeot à venda em Portugal | AutoGo.pt"
        />
        <meta
          property="og:description"
          content="Encontra carros importados europeus, BMW, Audi, Mercedes, Peugeot, Volkswagen, Renault, Citroën e outros modelos populares à venda em Portugal. Carros usados e seminovos com garantia e financiamento."
        />
        <meta property="og:url" content="https://autogo.pt/viaturas" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://autogo.pt/images/auto-logo.png"
        />
      </Head>
      <div className="min-h-screen w-full bg-gradient-to-br from-[#f5f6fa] via-[#fbe9e9] to-[#f5f6fa] flex flex-col">
        <img
          src="/images/viaturas-fundo.jpg"
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
              <div className="flex gap-2 justify-center sm:justify-end">
                <style jsx>{`
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
            <div
              id="filtros-viaturas"
              className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-center mb-10 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-[#b42121]/10 transition-all duration-300 hover:shadow-2xl"
              style={{ color: "rgba(210, 56, 56, 0.85)" }}
            >
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow border border-[#b42121]/10 focus-within:ring-2 focus-within:ring-[#b42121]/30 transition-all">
                <FaCarSide className="text-[#b42121] text-lg" />
                <select
                  value={marca}
                  onChange={(e) => {
                    setMarca(e.target.value);
                    setModelo("");
                  }}
                  className="bg-transparent outline-none border-none text-base"
                >
                  <option value="">{t("Marca")}</option>
                  {marcas.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow border border-[#b42121]/10 focus-within:ring-2 focus-within:ring-[#b42121]/30 transition-all">
                <FaSearch className="text-[#b42121] text-lg" />
                <select
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  disabled={!marca}
                  aria-disabled={!marca}
                  title={!marca ? 'Selecione uma marca primeiro' : undefined}
                  className={`bg-transparent outline-none border-none text-base w-32 ${!marca ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <option value="">{t("Modelo")}</option>
                  {marca && modelos.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {/* Price range inputs placed next to model select */}
                <div className="flex items-center gap-2 ml-2">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min €"
                    className="bg-transparent outline-none border-none text-sm w-20 px-2 py-1 rounded text-right"
                    aria-label="Preço mínimo"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max €"
                    className="bg-transparent outline-none border-none text-sm w-20 px-2 py-1 rounded text-right"
                    aria-label="Preço máximo"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow border border-[#b42121]/10 focus-within:ring-2 focus-within:ring-[#b42121]/30 transition-all">
                <FaCalendarAlt className="text-[#b42121] text-lg" />
                <select
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                  className="bg-transparent outline-none border-none text-base w-16"
                >
                  <option value="">{t("Dia")}</option>
                  {dias.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  className="bg-transparent outline-none border-none text-base w-20"
                >
                  <option value="">{t("Mês")}</option>
                  {meses.map((m) => (
                    <option key={m} value={m}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <select
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  className="bg-transparent outline-none border-none text-base w-24"
                >
                  <option value="">{t("Ano")}</option>
                  {anos.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow border border-[#b42121]/10 focus-within:ring-2 focus-within:ring-[#b42121]/30 transition-all">
                <FaTachometerAlt className="text-[#b42121] text-lg" />
                <input
                  type="number"
                  min="0"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  placeholder={t("Máx. KM")}
                  className="bg-transparent outline-none border-none text-base w-24"
                />
              </div>
              <button
                className="flex items-center gap-2 rounded-xl px-6 py-2 font-bold shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#b42121]/60 focus:ring-offset-2 border-0"
                style={{ background: "rgba(213, 80, 80, 0.85)", color: "#fff" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "rgba(213, 80, 80, 1)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "rgba(213, 80, 80, 0.85)")
                }
              >
                <FaSearch />
                {t("Filtrar")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMarca("");
                  setModelo("");
                  setAno("");
                  setMes("");
                  setDia("");
                  setKm("");
                  setCountryFilter("");
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="flex items-center gap-2 bg-white border border-[#b42121]/30 text-[#b42121] rounded-xl px-6 py-2 font-bold shadow transition-all duration-200 hover:bg-[#b42121] hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#b42121]/30 focus:ring-offset-2"
              >
                {t("Limpar Filtros")}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
              {paginatedCars.map((car) => (
                <div key={car.id} className={styles["premium-car-card"]}>
                  {/* Status badge */}
                  {car.status && (
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow z-20 text-white ${statusColors[car.status] || "bg-gray-400"}`}
                      style={{
                        letterSpacing: "0.5px",
                        minWidth: 90,
                        textAlign: "center",
                      }}
                    >
                      {statusLabels[car.status] || car.status}
                    </span>
                  )}
                  {/* Mobile: existing horizontal thumbnail scroller (leave as-is) */}
                  <div className="w-full h-44 mb-4 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#b42121]/60 scrollbar-track-gray-200 bg-transparent md:hidden">
                    {(car.images || [car.image]).map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="focus:outline-none"
                        onClick={() => {
                          const modal = document.getElementById(
                            `modal-img-${car.id}-${idx}`,
                          );
                          if (modal) (modal as HTMLDialogElement).showModal();
                        }}
                      >
                        <img
                          src={img}
                          alt={`${car.make} ${car.model} foto ${idx + 1}`}
                          className={styles["premium-car-image"]}
                          style={{ minWidth: "11rem" }}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Desktop: center the main picture with the car card (keep mobile unchanged)
                      increase top padding and align to start so image sits slightly lower */}
                  <div className="w-full mb-4 hidden md:flex items-start justify-center pt-4">
                    {(() => {
                      const mainImg = (car.images || [car.image])[0];
                      return (
                        <button
                          type="button"
                          className="focus:outline-none"
                          onClick={() => {
                            const modal = document.getElementById(
                              `modal-img-${car.id}-0`,
                            );
                            if (modal) (modal as HTMLDialogElement).showModal();
                          }}
                        >
                          <img
                            src={mainImg}
                            alt={`${car.make} ${car.model} foto principal`}
                            className={styles["premium-car-image"]}
                            style={{
                              // slightly smaller so card borders are visible on the sides
                              height: "13rem",
                              width: "auto",
                              maxWidth: "21rem",
                              objectFit: "cover",
                              borderRadius: "0.75rem",
                              marginTop: "0.5rem",
                            }}
                          />
                        </button>
                      );
                    })()}
                  </div>

                  {/* Modais para expandir imagens (render for all viewports) */}
                  {(car.images || [car.image]).map((img, idx) => (
                    <dialog
                      key={idx}
                      id={`modal-img-${car.id}-${idx}`}
                      className="backdrop:bg-black/70 rounded-xl p-0 border-none max-w-3xl w-full"
                    >
                      <div className="flex flex-col items-center">
                        <img
                          src={img}
                          alt="Foto expandida"
                          className="max-h-[80vh] w-auto rounded-xl shadow-lg"
                        />
                        <button
                          onClick={(e) =>
                            (
                              e.currentTarget.closest(
                                "dialog",
                              ) as HTMLDialogElement
                            )?.close()
                          }
                          className="mt-4 mb-2 px-6 py-2 bg-[#b42121] text-white rounded-full font-bold hover:bg-[#a11a1a] transition"
                        >
                          {t("Fechar")}
                        </button>
                      </div>
                    </dialog>
                  ))}
                  <div className="relative flex flex-col items-center">
                    {/* Use shared MakeLogo to handle camelCase/hyphen variants and fallback cleanly */}
                    <div className="mb-2">
                      {/* @ts-ignore */}
                      <MakeLogo make={String((car as any).make ?? "")} size={36} className="h-12 w-auto mx-auto" />
                    </div>
                    <h2
                      className="text-xl font-semibold mb-1 text-[#222] text-center px-2 w-full flex items-center justify-center gap-2"
                      style={{ minHeight: "2.5rem" }}
                    >
                      {String((car as any).make ?? "")} {String((car as any).model ?? "")}
                    </h2>
                  </div>
                  <div className="text-gray-500 mb-1 text-center px-2">
                    {String((car as any).year ?? "")} · {String((car as any).mileage ?? "")} km
                  </div>
                  <div className="font-bold text-black text-lg mb-3 text-center px-2">
                    {(() => {
                      // use format helper to render price or textual fallback
                      const rawPrice = (car as any).price;
                      const priceDisplay = (car as any).priceDisplay;
                      let numeric = null as number | null;
                      if (typeof rawPrice === 'number' && Number.isFinite(rawPrice)) numeric = rawPrice;
                      else if (typeof rawPrice === 'string' && rawPrice.trim().length > 0) {
                        const parsed = Number(String(rawPrice).replace(/[^0-9.-]/g, ''));
                        if (!Number.isNaN(parsed) && Number.isFinite(parsed)) numeric = parsed;
                      }
                      const { formatPriceDisplay } = require('../utils/formatPrice');
                      return formatPriceDisplay(numeric, priceDisplay ?? (typeof rawPrice === 'string' ? rawPrice : undefined));
                    })()}
                  </div>
  <div className="flex gap-2 w-full mt-auto justify-center">
  <Link
        href={`/cars/${car.slug || car.id}`}
      className="rounded-full py-1.5 px-6 sm:px-4 font-bold text-sm shadow-lg transition-all duration-200 text-center w-full sm:w-auto transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#b42121]/60 focus:ring-offset-2 border-0"
          onClick={() => {
            // Persist a list of recently clicked car ids for this visitor (7d TTL)
            try {
              const KEY = "autogo_clicked_v1";
              const TTL = 1000 * 60 * 60 * 24 * 7; // 7 days
              const raw = localStorage.getItem(KEY);
              let arr = [];
              if (raw) {
                arr = JSON.parse(raw) || [];
                // filter out expired entries
                arr = arr.filter((it) => Date.now() - (it.ts || 0) < TTL);
              }
              // remove existing for this id
              arr = arr.filter((it) => it.id !== car.id);
              // add to front
              arr.unshift({ id: car.id, ts: Date.now() });
              // cap size
              if (arr.length > 50) arr = arr.slice(0, 50);
              localStorage.setItem(KEY, JSON.stringify(arr));
            } catch (e) {
              // ignore
            }
          }}
                      style={{
                        background: "rgba(210, 56, 56, 0.85)",
                        color: "#fff",
                        letterSpacing: "0.5px",
                        boxShadow: "0 4px 18px 0 rgba(213, 80, 80, 0.18)",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(213, 80, 80, 0.85)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(213, 80, 80, 0.85)")
                      }
                    >
                      {t("Ver detalhes")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {/* Right-aligned pagination bar placed below the grid and above the footer */}
            <div className="max-w-7xl mx-auto mt-8 px-4">
              <div className="flex justify-end">
                <nav className="inline-flex items-center gap-3 bg-white/90 shadow-md rounded-xl p-2 border border-[#e9e9e9] relative z-[60] pointer-events-auto">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={prevDisabled}
                    aria-label="Anterior"
                    className={`px-3 py-1 rounded-md text-sm font-semibold ${prevDisabled ? 'text-gray-400 bg-white/90 border border-gray-200 cursor-not-allowed opacity-90' : 'text-[#b42121] bg-white border border-[#b42121]/10 shadow-md hover:shadow-lg cursor-pointer'} transition-all duration-150`}
                  >
                    ← {t("Anterior")}
                  </button>
                  <div className="px-3 py-1 text-sm text-gray-700">
                    {t("Página")} {clampedPage} / {totalPages}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={nextDisabled}
                    aria-label="Seguinte"
                    className={`px-3 py-1 rounded-md text-sm font-semibold ${nextDisabled ? 'text-white bg-[#b42121]/60 cursor-not-allowed opacity-90' : 'text-white bg-[#b42121] hover:bg-[#a11a1a] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer'} transition-all duration-150`}
                  >
                    {t("Seguinte")} →
                  </button>
                </nav>
              </div>
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
            src="/images/auto-logo.png"
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

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

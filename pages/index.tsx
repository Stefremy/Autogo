// pages/index.tsx
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import MainLayout from "../components/MainLayout";
import PremiumCarCard from "../components/PremiumCarCard";

import cars from "../data/cars.json";
import blogArticles from "../data/blogArticles.json";

// i18n no lado do servidor
export const getServerSideProps = async ({ locale }: { locale?: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "pt-PT", ["common"])),
    },
  };
};

const googleReviews = [
  {
    name: "João Silva",
    rating: 5,
    text:
      "Serviço excelente! O processo foi rápido e transparente. Recomendo a AutoGo.pt a todos.",
    date: "há 2 semanas",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Maria Fernandes",
    rating: 5,
    text:
      "Muito profissionais e sempre disponíveis para ajudar. O carro chegou impecável!",
    date: "há 1 mês",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Carlos Pinto",
    rating: 4,
    text:
      "Boa experiência, recomendo. O processo foi simples e sem surpresas.",
    date: "há 3 semanas",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    name: "Ana Costa",
    rating: 5,
    text:
      "Equipa fantástica! Fizeram tudo por mim, só tive de levantar o carro.",
    date: "há 5 dias",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function Home() {
  const { t } = useTranslation("common");

  return (
    <MainLayout>
      <Head>
        <title>AutoGo.pt – Importação de viaturas europeias para Portugal</title>
        <meta
          name="description"
          content="AutoGo.pt facilita a importação de viaturas europeias para Portugal. Encontre carros usados, simule o ISV e receba o veículo legalizado e pronto a andar em todo o país."
        />
        <meta name="robots" content="index,follow" />
        <meta
          property="og:title"
          content="AutoGo.pt – Importação de viaturas europeias para Portugal"
        />
        <meta
          property="og:description"
          content="Importe o seu carro europeu sem complicações. Encontre viaturas usadas, simule o ISV e receba o carro legalizado e pronto a andar."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.autogo.pt/" />
        <meta
          property="og:image"
          content="https://www.autogo.pt/images/auto-logo.png"
        />
      </Head>

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-screen h-[500px] sm:h-[550px] md:h-[70vh] lg:h-[76vh] flex items-center overflow-hidden bg-[var(--bg)]"
      >
        {/* Imagem de fundo */}
        <div
          className="absolute inset-0 bg-cover bg-right"
          style={{ backgroundImage: "url('/images/cars/bmw-black.png')" }}
        />
        {/* Degradê branco da esquerda para a direita */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/90 to-transparent" />
        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col items-start justify-center h-full pl-8 md:pl-20 max-w-2xl w-full text-[var(--text)]">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-4xl md:text-6xl font-semibold mb-6 leading-tight"
          >
            {t("Rápido. Seguro. Teu.")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-lg md:text-2xl mb-8 max-w-xl"
          >
            {t(
              "O teu carro europeu, legalizado e pronto a rolar em Portugal — sem complicações."
            )}
          </motion.p>

          {/* Botões vermelhos */}
          <div className="flex w-full flex-wrap items-center gap-3">
            <Link
              href="/viaturas"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-white font-semibold border border-white/80 shadow-md transition bg-[#b42121] hover:bg-[#d55050] active:scale-95"
            >
              {t("Procurar viaturas")}
            </Link>
            <Link
              href="/simulador"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-white font-semibold border border-white/80 shadow-md transition bg-[#b42121] hover:bg-[#d55050] active:scale-95"
            >
              {t("Simulador")}
            </Link>
            <Link
              href="/pedido"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-white font-semibold border border-white/80 shadow-md transition bg-[#b42121] hover:bg-[#d55050] active:scale-95"
            >
              {t("Encomendar")}
            </Link>
          </div>
        </div>
      </motion.section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="w-full py-14 sm:py-16 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Features topo */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-8 text-center">
            <div><div className="text-2xl">🚗</div><div className="font-semibold mt-1">Importação Premium</div><div className="text-sm text-gray-500">Acompanhamento total</div></div>
            <div><div className="text-2xl">✅</div><div className="font-semibold mt-1">Garantia de Excelência</div><div className="text-sm text-gray-500">Transparência garantida</div></div>
            <div><div className="text-2xl">🇵🇹</div><div className="font-semibold mt-1">Entrega em Todo o País</div><div className="text-sm text-gray-500">Flexível e rápida</div></div>
            <div><div className="text-2xl">🤝</div><div className="font-semibold mt-1">Apoio ao Cliente</div><div className="text-sm text-gray-500">Estamos sempre contigo</div></div>
            <div><div className="text-2xl">⚡</div><div className="font-semibold mt-1">Sem Complicações</div><div className="text-sm text-gray-500">Processo simples</div></div>
            <div><div className="text-2xl">💶</div><div className="font-semibold mt-1">Melhor Preço</div><div className="text-sm text-gray-500">Sem custos escondidos</div></div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text)]">Como Funciona</h2>
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <span className="px-4 py-2 rounded-full bg-white shadow border border-[var(--border)]">Simples</span>
              <span className="px-4 py-2 rounded-full bg-white shadow border border-[var(--border)]">Transparente</span>
              <span className="px-4 py-2 rounded-full bg-white shadow border border-[var(--border)]">Rápido</span>
            </div>
            <p className="mt-5 text-gray-600 max-w-3xl mx-auto">
              Importa o teu carro europeu sem stress — só precisas de escolher, simular e pedir. <strong>Nós tratamos do resto!</strong>
            </p>
          </div>

          {/* 3 passos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow border border-[var(--border)]">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg)] font-bold mb-3">1</div>
              <h3 className="font-semibold text-lg mb-2">Escolhe a viatura</h3>
              <p className="text-gray-600 text-sm">Vê o stock ou envia-nos o link do carro que encontraste.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow border border-[var(--border)]">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg)] font-bold mb-3">2</div>
              <h3 className="font-semibold text-lg mb-2">Simula e confirma</h3>
              <p className="text-gray-600 text-sm">Calculamos ISV e custos. Aprovas quando estiver tudo ok.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow border border-[var(--border)]">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg)] font-bold mb-3">3</div>
              <h3 className="font-semibold text-lg mb-2">Recebe legalizado</h3>
              <p className="text-gray-600 text-sm">Tratamos da importação e entrega em Portugal, pronto a rolar.</p>
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
            className="text-3xl md:text-4xl font-semibold text-[var(--text)] mb-12 text-center tracking-tight"
          >
            Carros usados em Destaque
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {(cars as any[]).map((car) => (
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
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NOVOS ARTIGOS SECTION - SCROLLABLE CAROUSEL (código enviado pelo chefe) */}
      <section className="w-full py-16 bg-[#f5f6fa]">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-black mb-6 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
            Novos Artigos
          </h2>
          <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
            Fica a par das últimas novidades, dicas e notícias do mundo automóvel e da importação premium.
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
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div id="articles-carousel" className="flex gap-6 min-w-[700px] md:min-w-0 px-4 overflow-x-auto scroll-smooth pb-2">
              {(blogArticles as any[])
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((article: any, idx: number) => (
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
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.src = "/images/auto-logo.png";
                          img.style.objectFit = "contain";
                          (img.parentElement as HTMLElement).style.background = "#d55050";
                        }}
                      />
                    </div>
                    <div className="p-5 flex flex-col h-[180px]">
                      <div className="text-xs text-gray-500 mb-2">
                        {new Date(article.date).toLocaleDateString("pt-PT")}
                      </div>
                      <div className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{article.title}</div>
                      <div className="text-gray-700 text-sm mb-4 line-clamp-3">{article.excerpt}</div>
                      <span className="mt-auto text-[#b42121] font-semibold hover:underline transition">Ler artigo &rarr;</span>
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
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* GOOGLE REVIEWS (podes manter ou mover para baixo dos artigos) */}
      <section className="w-full py-20 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text)] mb-6 text-center">
            Os nossos clientes
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-2" id="reviews-carousel">
            {googleReviews.map((r, i) => (
              <div key={i} className="min-w-[320px] max-w-xs bg-white rounded-2xl p-6 shadow">
                <div className="flex items-center mb-3">
                  <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-full mr-3" />
                  <div>
                    <div className="font-bold">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.date}</div>
                  </div>
                </div>
                <p className="text-gray-800 italic">“{r.text}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

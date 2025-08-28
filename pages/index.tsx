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

export default function Home() {
  const { t } = useTranslation("common");

  return (
    <MainLayout>
      <Head>
        <title>
          AutoGo.pt – Importação de viaturas europeias para Portugal
        </title>
        <meta
          name="description"
          content="AutoGo.pt facilita a importação de viaturas europeias para Portugal. Encontre carros usados, simule o ISV e receba o veículo legalizado e pronto a andar em todo o país."
        />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="AutoGo.pt – Importação de viaturas europeias para Portugal" />
        <meta
          property="og:description"
          content="Importe o seu carro europeu sem complicações. Encontre viaturas usadas, simule o ISV e receba o carro legalizado e pronto a andar."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.autogo.pt/" />
        <meta property="og:image" content="https://www.autogo.pt/images/auto-logo.png" />
      </Head>

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-screen h-[500px] sm:h-[550px] md:h-[70vh] lg:h-[76vh] flex items-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-right"
          style={{ backgroundImage: "url('/images/cars/bmw-black.png')" }}
        />
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
            {t("O teu carro europeu, legalizado e pronto a rolar em Portugal — sem complicações.")}
          </motion.p>

          <div className="flex w-full rounded-2xl bg-white/30 backdrop-blur-md shadow-2xl p-2 items-center gap-3 mb-5 border border-white/30">
            <Link href="/viaturas" className="beauty-fade-btn">
              {t("Procurar viaturas")}
            </Link>
            <Link href="/simulador" className="beauty-fade-btn">
              {t("Simulador")}
            </Link>
            <Link href="/pedido" className="beauty-fade-btn">
              {t("Encomendar")}
            </Link>
          </div>
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
            transition: background 0.3s, box-shadow 0.3s, transform 0.18s, filter 0.3s;
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
            inset: 0;
            background: linear-gradient(120deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.08) 100%);
            opacity: .7;
            z-index: 2;
            pointer-events: none;
            transition: opacity .3s;
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
            filter: brightness(.98);
            transform: scale(.98);
          }
        `}</style>
      </motion.section>

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
                    car.gearboxType ? String(car.gearboxType) :
                    car.gearbox ? String(car.gearbox) : ""
                  }
                  country={car.country}
                  status={car.status}
                  slug={car.slug} // <- URLs amigáveis
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GOOGLE REVIEWS (resumo) */}
      <section className="w-full py-20 bg-[#f5f6fa]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-black mb-6 text-center">
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

      {/* BLOG (resumo) */}
      <section className="w-full py-16 bg-[#f5f6fa]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-black mb-6 text-center">
            Novos Artigos
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {(blogArticles as any[])
              .slice()
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((article, idx) => (
                <a
                  key={idx}
                  href={article.link}
                  className="block rounded-2xl bg-white shadow hover:shadow-lg transition overflow-hidden"
                >
                  <div className="h-44 bg-gray-200">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-gray-500 mb-2">
                      {new Date(article.date).toLocaleDateString("pt-PT")}
                    </div>
                    <div className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </div>
                    <div className="text-gray-700 text-sm line-clamp-3">
                      {article.excerpt}
                    </div>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

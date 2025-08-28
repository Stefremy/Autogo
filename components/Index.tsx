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
              <Link href="/pedido" className="beauty-fade-btn">
                {t("Encomendar")}
              </Link>
            </div>
          </div>
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
                    slug={car.slug}   // ✅ amigável
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* GOOGLE REVIEWS */}
        {/* ... mantém igual ao seu código ... */}

        {/* NOVOS ARTIGOS */}
        {/* ... mantém igual ao seu código ... */}
      </MainLayout>
    </>
  );
}

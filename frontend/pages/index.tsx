import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../pages/MainLayout';
import cars from '../data/cars.json';
import CarCard from '../components/CarCard';
// Se quiseres animação, ativa a linha abaixo
import { motion } from "framer-motion";

export default function Home() {
  return (
    <MainLayout>
      <Head>
        <title>AutoGo.pt - Importação de Carros Europeus</title>
        <meta
          name="description"
          content="O teu carro europeu, legalizado e pronto a rolar em Portugal — sem complicações."
        />
      </Head>

      {/* HERO SECTION COM ANIMAÇÃO */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-[80vh] bg-black flex items-center px-8 overflow-hidden rounded-2xl shadow-2xl max-w-6xl mx-auto mt-10"
      >
        {/* Imagem de fundo com overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/cars/bmw-black.png')" }}
        >
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>

        {/* Conteúdo principal */}
        <div className="relative z-10 flex flex-col items-start max-w-3xl">
          <h1 className="text-white text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Rápido. Seguro. Teu.
          </h1>
          <p className="text-white text-xl md:text-2xl mb-10 drop-shadow">
            O teu carro europeu, legalizado e pronto a rolar em Portugal — sem complicações.
          </p>
          <div className="flex gap-6 mb-8">
            <Link
              href="/viaturas"
              className="bg-[#b42121] hover:bg-[#a11a1a] text-white font-bold px-10 py-4 rounded-lg text-xl shadow-lg transition-all duration-200 hover:scale-105"
            >
              Ver Viaturas
            </Link>
            <Link
              href="/simulador"
              className="border-2 border-white text-white font-bold px-10 py-4 rounded-lg text-xl shadow-lg transition-all duration-200 hover:bg-white hover:text-black hover:scale-105"
            >
              Simular Importação
            </Link>
          </div>

          {/* Linhas decorativas centrais */}
          <img src="/images/red_lines.png" alt="Linhas decorativas" className="mt-6 w-32" />
        </div>

        {/* Logótipo no canto superior direito */}
        <img
          src="/images/auto-logo.png"
          alt="AutoGo.pt"
          className="absolute top-6 right-10 w-40 opacity-90"
        />

        {/* Decoração adicional (opcional) */}
        <img
          src="/images/red_lines.png"
          alt="Decoração superior esquerda"
          className="absolute top-8 left-8 w-20 opacity-20 rotate-45"
        />
        <img
          src="/images/red_lines.png"
          alt="Decoração inferior direita"
          className="absolute bottom-10 right-10 w-28 opacity-80"
        />
      </motion.div>

      {/* LISTAGEM DE VIATURAS */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">
            Viaturas Disponíveis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {cars.map(car => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <CarCard
                  name={`${car.make} ${car.model}`}
                  image={car.image}
                  description={`${car.year} • ${car.mileage} km`}
                  price={car.price}
                  id={car.id}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../pages/MainLayout';
import cars from '../data/cars.json';
import CarCard from '../components/CarCard';
import { motion } from "framer-motion";
import { IndexNavbar } from "../components/IndexNavbar";

export default function Home() {
  return (
    <>
      <IndexNavbar />
      <MainLayout>
        <Head>
          <title>AutoGo.pt - Importação de Carros Europeus</title>
          <meta
            name="description"
            content="O teu carro europeu, legalizado e pronto a rolar em Portugal — sem complicações."
          />
        </Head>

        {/* HERO SECTION FULL SCREEN EDGE TO EDGE - EXTENDED WHITE FADE LEFT */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-screen h-[550px] md:h-[76vh] flex items-center overflow-hidden"
          style={{ borderRadius: "0 0 32px 32px" }}
        >
          {/* Background image covers full width, fades left */}
          <div
            className="absolute inset-0 bg-cover bg-right"
            style={{
              backgroundImage: "url('/images/cars/bmw-black.png')",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%, rgba(0,0,0,1) 100%)",
              }}
            />
          </div>

          {/* Red lines decorativas */}
          <img
            src="/images/red_lines.png"
            alt="Decoração superior esquerda"
            className="absolute top-8 left-8 w-20 opacity-20 rotate-45 z-20"
          />
          <img
            src="/images/red_lines.png"
            alt="Decoração inferior direita"
            className="absolute bottom-10 right-10 w-28 opacity-80 z-20"
          />
          {/* (Opcional) logotipo no canto superior direito */}
          <img
            src="/images/auto-logonb.png"
            alt="AutoGo.pt"
            className="absolute top-6 right-10 w-40 opacity-90 z-20"
          />

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-start justify-center h-full pl-8 md:pl-20 max-w-2xl w-full">
            <h1 className="text-neutral-900 text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Rápido. Seguro. Teu.
            </h1>
            <p className="text-neutral-700 text-lg md:text-2xl mb-10 max-w-xl">
              O teu carro europeu, legalizado e pronto a rolar em Portugal — sem complicações.
            </p>
            <div className="flex w-full rounded-2xl bg-white/95 shadow-lg p-2 items-center gap-3 mb-5">
              <Link
                href="/viaturas"
                className="bg-[#b42121] hover:bg-[#a11a1a] text-white font-bold px-8 py-3 text-lg rounded-xl shadow transition-all duration-200 whitespace-nowrap"
              >
                Procurar viaturas
              </Link>
              <Link
                href="/simulador"
                className="bg-[#b42121] hover:bg-[#a11a1a] text-white font-bold px-8 py-3 text-lg rounded-xl shadow transition-all duration-200 whitespace-nowrap"
              >
                Simulador
              </Link>
            </div>
            <div className="ml-1 mb-1 flex items-center gap-2 cursor-pointer text-neutral-800 hover:text-[#b42121] font-medium text-base transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" className="inline mr-1 opacity-70" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.6" d="M4 6h16M7 12h10M10 18h4"></path></svg>
              Filtros avançados
            </div>
          </div>
        </motion.section>

        {/* Como Funciona section */}
        <section
          className="py-16 bg-gradient-to-b from-white to-gray-100"
        >
          <div className="max-w-4xl mx-auto text-center z-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight drop-shadow-xl">
              Como Funciona
            </h2>
            <div className="flex justify-center gap-4 mb-8">
              <span className="px-4 py-2 rounded-2xl bg-red-600 text-white text-lg font-semibold shadow-lg transition hover:scale-105">Simples</span>
              <span className="px-4 py-2 rounded-2xl bg-white/80 border border-gray-200 text-gray-900 text-lg font-semibold shadow-lg backdrop-blur-md transition hover:scale-105">Transparente</span>
              <span className="px-4 py-2 rounded-2xl bg-green-600 text-white text-lg font-semibold shadow-lg transition hover:scale-105">Rápido</span>
            </div>
            <p className="text-xl text-gray-800 mb-12 font-medium drop-shadow">
              Importa o teu carro europeu sem stress — só precisas de escolher, simular e pedir.<br />
              <span className="font-bold">Nós tratamos do resto!</span>
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/95 rounded-2xl shadow-xl p-8 flex flex-col items-center border-t-4 border-red-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="mb-3 text-2xl font-bold text-red-600">1</div>
                <div className="font-semibold text-lg mb-2 text-gray-900">Escolhe o carro</div>
                <p className="text-gray-600 mb-4">
                  Seleciona entre dezenas de viaturas disponíveis ou pede uma pesquisa personalizada.
                </p>
                <Link href="/viaturas" className="mt-auto text-red-600 font-semibold hover:underline transition transform hover:scale-110 hover:text-white hover:bg-red-600 px-4 py-2 rounded-lg shadow">
                  Ver Viaturas
                </Link>
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 flex flex-col items-center border-t-4 border-gray-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="mb-3 text-2xl font-bold text-gray-800">2</div>
                <div className="font-semibold text-lg mb-2 text-gray-900">Simula custos</div>
                <p className="text-gray-600 mb-4">
                  Usa o nosso simulador para saber quanto vais pagar, sem surpresas.
                </p>
                <Link href="/simulador" className="mt-auto text-gray-900 font-semibold hover:underline transition transform hover:scale-110 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-lg shadow">
                  Simular ISV
                </Link>
              </div>
              <div className="bg-white/95 rounded-2xl shadow-xl p-8 flex flex-col items-center border-t-4 border-green-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="mb-3 text-2xl font-bold text-green-600">3</div>
                <div className="font-semibold text-lg mb-2 text-gray-900">Importação e entrega</div>
                <p className="text-gray-600 mb-4">
                  Cuidamos de todo o processo legal e entregamos o carro pronto a rolar.
                </p>
                <Link href="/pedido" className="mt-auto text-green-600 font-semibold hover:underline transition transform hover:scale-110 hover:text-white hover:bg-green-600 px-4 py-2 rounded-lg shadow">
                  Fazer Pedido
                </Link>
              </div>
            </div>
          </div>
        </section>

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
    </>
  );
}

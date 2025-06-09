import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../pages/MainLayout';
// import cars from '../data/cars.json';
import CarCard from "../components/CarCard";
import cars from '../data/cars.json';

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

      {/* Hero Section */}
      <div className="relative h-screen bg-black flex items-center px-8">
        {/* Background image with darker overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bmw-black.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>
        <div className="relative z-10 flex flex-col items-start max-w-3xl">
          <h1 className="text-white text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
            Rápido. Seguro. Teu.
          </h1>
          <p className="text-white text-2xl md:text-3xl mb-10">
            O teu carro europeu, legalizado e pronto a rolar em Portugal — sem complicações.
          </p>
          <div className="flex gap-6 mb-8">
            <Link
              href="/viaturas"
              className="bg-[#b42121] hover:bg-[#a11a1a] text-white font-bold px-10 py-4 rounded-lg text-xl shadow-lg transition"
            >
              Ver Viaturas
            </Link>
            <Link
              href="/simulador"
              className="border-2 border-white text-white font-bold px-10 py-4 rounded-lg text-xl shadow-lg transition hover:bg-white hover:text-black"
            >
              Simular Importação
            </Link>
          </div>

          <img src="/images/red-lines.png" className="mt-6 w-32" />
        </div>
        {/* Optional: Logo at top right */}
        <img src="/images/autogo-logo.png" />
      </div>

      {/* Car Listing Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Viaturas Disponíveis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {cars.map(car => (
              <CarCard
                key={car.id}
                name={`${car.make} ${car.model}`}
                image={car.image}
                description={`${car.year} • ${car.mileage} km`}
                price={car.price}
                id={car.id}
              />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
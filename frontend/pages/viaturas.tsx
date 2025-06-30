import MainLayout from './MainLayout';
import cars from '../data/cars.json';
import Link from 'next/link'; // Add this at the top if not already imported

export default function Viaturas() {
  return (
    <MainLayout>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center text-[#b42121]">
          Viaturas Disponíveis
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-all duration-300 relative group"
            >
              <img
                src={car.image}
                alt={`${car.make} ${car.model}`}
                className="rounded-xl object-cover w-full h-44 mb-4 group-hover:scale-105 transition"
              />
              <span className="absolute top-3 left-3 bg-[#b42121] text-white px-4 py-1 rounded-full text-xs font-bold shadow">
                {car.country === "DE" ? "Importado da Alemanha" : "Nacional"}
              </span>
              <h2 className="text-xl font-bold mb-1 text-[#222]">
                {car.make} {car.model}
              </h2>
              <div className="text-gray-500 mb-1">
                {car.year} · {car.mileage} km
              </div>
        <div className="font-bold text-green-700 text-lg mb-3">
          {car.price}
        </div>
        <Link
          href={`/cars/${car.id}`}
          className="bg-[#0055b8] hover:bg-[#003e8a] text-white rounded-full py-2 px-8 font-bold text-base shadow transition mt-auto text-center"
        >
          Ver detalhes
        </Link>
      </div>
    ))}
  </div>
</section>
    </MainLayout>
  );
}

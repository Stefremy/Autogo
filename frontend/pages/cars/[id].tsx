import { useRouter } from 'next/router';
import cars from '../../data/cars.json';
import Layout from '../MainLayout';

export default function CarDetail() {
  const router = useRouter();
  const { id } = router.query;
  const car = cars.find(c => String(c.id) === id);

  if (!car) {
    return (
      <Layout>
        <div className="p-8">Car not found.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <header className="p-8 bg-blue-900 text-white text-center relative">
          <h1 className="text-4xl font-bold mb-2">{car.make} {car.model}</h1>
          {/* Badge de país no header */}
          {car.country && (
            <span className="absolute top-8 right-8 bg-[#b42121] text-white px-3 py-1 rounded-full text-xs font-bold shadow flex items-center gap-2">
              {/* Bandeira pequenina no badge */}
              <img
                src={`/images/flags/${car.country.toLowerCase()}.png`}
                alt={car.country}
                className="inline-block w-6 h-6 rounded-full border border-white mr-2"
                style={{ marginRight: 8 }}
              />
              {car.country === "DE"
                ? "Importado da Alemanha"
                : car.country === "PT"
                ? "Nacional"
                : car.country === "FR"
                ? "Importado de França"
                : `Importado de ${car.country}`}
            </span>
          )}
        </header>
        <main className="max-w-3xl mx-auto p-8">
          <div className="relative mb-6">
            {/* Imagem do carro */}
            <img src={car.image} alt={`${car.make} ${car.model}`} className="w-full h-64 object-cover rounded" />
            {/* Bandeira por cima da imagem, canto superior esquerdo */}
            {car.country && (
              <img
                src={`/images/flags/${car.country.toLowerCase()}.png`}
                alt={car.country}
                className="absolute top-4 left-4 w-10 h-10 rounded-full shadow border-2 border-white"
                title={
                  car.country === "DE"
                    ? "Alemanha"
                    : car.country === "FR"
                    ? "França"
                    : car.country === "PT"
                    ? "Portugal"
                    : car.country
                }
              />
            )}
          </div>
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-2xl font-semibold mb-2">{car.year} {car.make} {car.model}</h2>
            <p className="text-gray-700 mb-4">{car.description}</p>
            <ul className="mb-4">
              <li><strong>Year:</strong> {car.year}</li>
              <li><strong>Mileage:</strong> {car.mileage} km</li>
              <li><strong>Price:</strong> €{car.price.toLocaleString()}</li>
            </ul>
            <a href="/viaturas" className="text-blue-700 hover:underline">&larr; Back to all cars</a>
          </div>
        </main>
        <footer className="p-4 bg-gray-200 text-center text-gray-600">
          &copy; 2025 Autogo. All rights reserved.
        </footer>
      </div>
    </Layout>
  );
}


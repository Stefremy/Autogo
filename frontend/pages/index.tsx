import cars from '../data/cars.json';
import MainLayout from '../pages/MainLayout';
import CarCard from "../components/CarCard";

export default function Home() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <header className="p-8 bg-blue-900 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">Autogo</h1>
          <p className="text-xl">Your trusted car reseller</p>
        </header>
        <main className="max-w-5xl mx-auto p-8">
          <h2 className="text-2xl font-semibold mb-6">Available Cars</h2>
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
        </main>
        <footer className="p-4 bg-gray-200 text-center text-gray-600">
          &copy; 2025 Autogo. All rights reserved.
        </footer>
      </div>
    </MainLayout>
  );
}
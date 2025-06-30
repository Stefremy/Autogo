import { useRouter } from 'next/router';
import cars from '../../data/cars.json';
import Layout from '../MainLayout';
import { FaCalendarAlt, FaTachometerAlt, FaMoneyBillWave, FaGasPump, FaCogs, FaCarSide, FaDoorOpen, FaRoad, FaFlag, FaPalette, FaBolt, FaUsers, FaHashtag, FaGlobeEurope, FaRegCalendarCheck, FaLayerGroup, FaCloud } from "react-icons/fa";
import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  images?: string[];
  description: string;
  mileage: number;
  country: string;
  fuel?: string;
  gearboxType?: string;
  gearbox?: number;
  category?: string;
  doors?: number;
  engineSize?: string;
  origin?: string;
  color?: string;
  power?: string;
  places?: number;
  unitNumber?: string;
  firstRegistration?: string;
  emissionClass?: string;
  co2?: string;
};

export default function CarDetail() {
  const router = useRouter();
  const { id } = router.query;
  const car = (cars as Car[]).find(c => String(c.id) === id);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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
            {/* Grid Masonry/Justified Grid de imagens do carro */}
            <div className="columns-1 sm:columns-2 gap-4 [column-fill:_balance]">
              {(car.images || [car.image]).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${car.make} ${car.model} foto ${idx + 1}`}
                  className="mb-4 w-full rounded-xl object-cover shadow transition-transform duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-[#b42121]"
                  style={{ breakInside: 'avoid', maxHeight: '320px' }}
                  onClick={() => {
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }}
                />
              ))}
            </div>
            {/* Lightbox for images with zoom plugin */}
            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              slides={(car.images || [car.image]).map(img => ({ src: img }))}
              index={lightboxIndex}
              plugins={[Zoom]}
              zoom={{ maxZoomPixelRatio: 3 }}
            />
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
            <ul className="mb-4 space-y-2">
              <li className="flex items-center gap-2"><FaCarSide className="text-[#b42121]" /> <strong>Marca e Modelo:</strong> {car.make} {car.model}</li>
              {car.gearboxType && <li className="flex items-center gap-2"><FaCogs className="text-[#b42121]" /> <strong>Tipo de Caixa de Velocidades:</strong> {car.gearboxType}</li>}
              {car.gearbox && <li className="flex items-center gap-2"><FaLayerGroup className="text-[#b42121]" /> <strong>Caixa de Velocidades:</strong> {car.gearbox}</li>}
              {car.category && <li className="flex items-center gap-2"><FaCarSide className="text-[#b42121]" /> <strong>Categoria:</strong> {car.category}</li>}
              {car.engineSize && <li className="flex items-center gap-2"><FaRoad className="text-[#b42121]" /> <strong>Cilindrada:</strong> {car.engineSize}</li>}
              {car.power && <li className="flex items-center gap-2"><FaBolt className="text-[#b42121]" /> <strong>Potência:</strong> {car.power}</li>}
              {car.places && <li className="flex items-center gap-2"><FaUsers className="text-[#b42121]" /> <strong>Número de Lugares:</strong> {car.places}</li>}
              {car.unitNumber && <li className="flex items-center gap-2"><FaHashtag className="text-[#b42121]" /> <strong>Nº de Unidade:</strong> {car.unitNumber}</li>}
              {car.origin && <li className="flex items-center gap-2"><FaGlobeEurope className="text-[#b42121]" /> <strong>País de Origem:</strong> {car.origin}</li>}
              {car.firstRegistration && <li className="flex items-center gap-2"><FaRegCalendarCheck className="text-[#b42121]" /> <strong>Data da Primeira Matrícula:</strong> {car.firstRegistration}</li>}
              {car.doors && <li className="flex items-center gap-2"><FaDoorOpen className="text-[#b42121]" /> <strong>Portas:</strong> {car.doors}</li>}
              {car.fuel && <li className="flex items-center gap-2"><FaGasPump className="text-[#b42121]" /> <strong>Combustível:</strong> {car.fuel}</li>}
              {car.emissionClass && <li className="flex items-center gap-2"><FaLayerGroup className="text-[#b42121]" /> <strong>Classe de Emissões:</strong> {car.emissionClass}</li>}
              {car.co2 && <li className="flex items-center gap-2"><FaCloud className="text-[#b42121]" /> <strong>CO₂:</strong> {car.co2}</li>}
              {car.color && <li className="flex items-center gap-2"><FaPalette className="text-[#b42121]" /> <strong>Cor:</strong> {car.color}</li>}
            </ul>
            <a href="/viaturas" className="text-blue-700 hover:underline">&larr; Voltar às viaturas</a>
          </div>
        </main>
        <footer className="p-4 bg-gray-200 text-center text-gray-600">
          &copy; 2025 Autogo. All rights reserved.
        </footer>
      </div>
    </Layout>
  );
}


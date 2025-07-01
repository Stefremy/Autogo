import { useRouter } from 'next/router';
import cars from '../../data/cars.json';
import Layout from '../MainLayout';
import { FaCalendarAlt, FaTachometerAlt, FaMoneyBillWave, FaGasPump, FaCogs, FaCarSide, FaDoorOpen, FaRoad, FaFlag, FaPalette, FaBolt, FaUsers, FaHashtag, FaGlobeEurope, FaRegCalendarCheck, FaLayerGroup, FaCloud, FaChevronDown, FaChevronUp, FaStar } from "react-icons/fa";
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
  equipamento_opcoes?: {
    [categoria: string]: string[];
  };
};

export default function CarDetail() {
  const router = useRouter();
  const { id } = router.query;
  const car = (cars as Car[]).find(c => String(c.id) === id);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  // Fun facts dinâmicos
  const funFacts = [
    car?.engineSize && car.engineSize.includes('1.2') && "Motor premiado pela eficiência na Europa.",
    car?.fuel && car.fuel === "Gasolina" && "ISV reduzido devido às baixas emissões.",
    car?.power && Number(car.power.replace(/\D/g, '')) > 100 && "Performance de referência para o segmento.",
    "Disponível com Apple CarPlay / Android Auto.",
    car?.country === "FR" && "Tecnologia inspirada pelo legado Citroën no WRC."
  ].filter(Boolean);

  if (!car) {
    return (
      <Layout>
        <div className="p-8">Car not found.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <main className="max-w-4xl mx-auto px-2 py-10 space-y-8">
          {/* HERO */}
          <section className="flex flex-col md:flex-row gap-8 items-start">
            {/* Hero Image + Gallery */}
            <div className="flex-1 relative">
              <img
                src={(car.images && car.images[0]) || car.image}
                alt={car.make + ' ' + car.model}
                className="rounded-2xl shadow-2xl w-full max-w-md object-cover aspect-video ring-4 ring-white hover:ring-[#b42121] transition-all duration-300 cursor-zoom-in"
                style={{ maxHeight: 340, background: '#eee' }}
                onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
              />
              {/* Bandeira sobreposta */}
              {car.country && (
                <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-xl shadow flex items-center gap-2 border border-gray-200 backdrop-blur-sm">
                  <img
                    src={`/images/flags/${car.country.toLowerCase()}.png`}
                    alt={car.country}
                    className="w-6 h-6 rounded-full border border-white"
                  />
                  <span className="text-xs font-bold text-gray-700">
                    {car.country === "DE"
                      ? "Importado da Alemanha"
                      : car.country === "PT"
                        ? "Nacional"
                        : car.country === "FR"
                          ? "Importado de França"
                          : `Importado de ${car.country}`}
                  </span>
                </span>
              )}
              {/* Mini galeria horizontal */}
              <div className="flex gap-2 mt-3">
                {(car.images || [car.image]).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${car.make} ${car.model} galeria ${idx + 1}`}
                    className={`rounded-lg object-cover w-20 h-14 shadow cursor-pointer border-2 transition-all duration-300 ${lightboxIndex === idx ? "border-[#b42121] scale-105" : "border-transparent hover:border-[#b42121] hover:scale-105"}`}
                    onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                  />
                ))}
              </div>
              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={(car.images || [car.image]).map(img => ({ src: img }))}
                index={lightboxIndex}
                plugins={[Zoom]}
                zoom={{ maxZoomPixelRatio: 3 }}
              />
            </div>
            {/* Detalhes principais */}
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl font-extrabold mb-2 tracking-tight text-gray-900 drop-shadow-sm">
                {car.make} {car.model} <span className="text-[#b42121]">{car.year}</span>
              </h1>
              <div className="flex flex-wrap gap-2 text-sm mb-4">
                <span className="bg-gray-100 rounded-xl px-3 py-1 font-medium shadow-sm flex items-center gap-2">
                  <FaCalendarAlt className="text-[#b42121]" /> {car.year}
                </span>
                <span className="bg-gray-100 rounded-xl px-3 py-1 font-medium shadow-sm flex items-center gap-2">
                  <FaTachometerAlt className="text-[#b42121]" /> {car.mileage?.toLocaleString()} km
                </span>
                {car.engineSize && (
                  <span className="bg-gray-100 rounded-xl px-3 py-1 font-medium shadow-sm flex items-center gap-2">
                    <FaRoad className="text-[#b42121]" /> {car.engineSize}
                  </span>
                )}
                {car.fuel && (
                  <span className="bg-gray-100 rounded-xl px-3 py-1 font-medium shadow-sm flex items-center gap-2">
                    <FaGasPump className="text-[#b42121]" /> {car.fuel}
                  </span>
                )}
                {car.gearboxType && (
                  <span className="bg-gray-100 rounded-xl px-3 py-1 font-medium shadow-sm flex items-center gap-2">
                    <FaCogs className="text-[#b42121]" /> {car.gearboxType}
                  </span>
                )}
                {car.power && (
                  <span className="bg-gray-100 rounded-xl px-3 py-1 font-medium shadow-sm flex items-center gap-2">
                    <FaBolt className="text-[#b42121]" /> {car.power}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-blue-700 drop-shadow-sm">{car.price.toLocaleString()} €</div>
              {/* Botão ver mais detalhes */}
              <button
                className="flex items-center gap-2 mt-2 mb-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl shadow font-semibold text-gray-700 transition-all duration-200"
                onClick={() => setShowMore(v => !v)}
                aria-expanded={showMore}
              >
                <span>Ver mais detalhes</span>
                {showMore ? <FaChevronUp className="text-[#b42121]" /> : <FaChevronDown className="text-[#b42121]" />}
              </button>
              {/* Detalhes extra, animados */}
              <div
                className={`overflow-hidden transition-all duration-500 ${showMore ? 'max-h-96 opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'}`}
                style={{ willChange: 'max-height, opacity' }}
              >
                <ul className="space-y-2 py-2">
                  {car.category && <li className="flex items-center gap-2 text-gray-700"><FaCarSide className="text-[#b42121]" /> <strong>Categoria:</strong> {car.category}</li>}
                  {car.gearbox && <li className="flex items-center gap-2 text-gray-700"><FaLayerGroup className="text-[#b42121]" /> <strong>Caixa de Velocidades:</strong> {car.gearbox}</li>}
                  {car.origin && <li className="flex items-center gap-2 text-gray-700"><FaGlobeEurope className="text-[#b42121]" /> <strong>País de Origem:</strong> {car.origin}</li>}
                  {car.unitNumber && <li className="flex items-center gap-2 text-gray-700"><FaHashtag className="text-[#b42121]" /> <strong>Nº de Unidade:</strong> {car.unitNumber}</li>}
                  {car.firstRegistration && <li className="flex items-center gap-2 text-gray-700"><FaRegCalendarCheck className="text-[#b42121]" /> <strong>Data da Primeira Matrícula:</strong> {car.firstRegistration}</li>}
                  {car.emissionClass && <li className="flex items-center gap-2 text-gray-700"><FaLayerGroup className="text-[#b42121]" /> <strong>Classe de Emissões:</strong> {car.emissionClass}</li>}
                </ul>
              </div>
              {/* Botões de ação */}
              <div className="flex gap-3 mt-4">
                <button className="bg-[#b42121] hover:bg-[#a31212] text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-all duration-200">Simular ISV</button>
                <button className="bg-white border border-[#b42121] text-[#b42121] font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-[#b42121] hover:text-white transition-all duration-200">WhatsApp</button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-all duration-200">Pedir Contacto</button>
              </div>
            </div>
          </section>

          {/* CARDS DE CARACTERÍSTICAS */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {car.doors && (
              <div className="bg-white rounded-2xl shadow flex flex-col items-center p-4 hover:shadow-xl transition-all duration-200">
                <FaDoorOpen className="text-2xl text-[#b42121] mb-1" />
                <span className="font-bold">{car.doors}</span>
                <span className="text-xs text-gray-500">Portas</span>
              </div>
            )}
            {car.color && (
              <div className="bg-white rounded-2xl shadow flex flex-col items-center p-4 hover:shadow-xl transition-all duration-200">
                <FaPalette className="text-2xl text-[#b42121] mb-1" />
                <span className="font-bold">{car.color}</span>
                <span className="text-xs text-gray-500">Cor</span>
              </div>
            )}
            {car.emissionClass && (
              <div className="bg-white rounded-2xl shadow flex flex-col items-center p-4 hover:shadow-xl transition-all duration-200">
                <FaLayerGroup className="text-2xl text-[#b42121] mb-1" />
                <span className="font-bold">{car.emissionClass}</span>
                <span className="text-xs text-gray-500">Classe Emissões</span>
              </div>
            )}
            {car.co2 && (
              <div className="bg-white rounded-2xl shadow flex flex-col items-center p-4 hover:shadow-xl transition-all duration-200">
                <FaCloud className="text-2xl text-[#b42121] mb-1" />
                <span className="font-bold">{car.co2}</span>
                <span className="text-xs text-gray-500">CO₂</span>
              </div>
            )}
          </section>

          {/* SECÇÃO CAR CARETRISTICS */}
          <section className="bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow p-6 mt-8">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><FaCarSide className="text-[#b42121]" /> Curiosidades & Vantagens</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              {funFacts.length
                ? funFacts.map((f, i) => <li key={i}>{f}</li>)
                : <li>Carro muito equilibrado para o mercado português.</li>
              }
            </ul>
          </section>

          {/* SECÇÃO EQUIPAMENTO & OPÇÕES */}
          {car.equipamento_opcoes && (
            <section className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow p-6 mt-8">
              <h3 className="text-2xl font-extrabold mb-6 flex items-center gap-3 text-black tracking-tight">
                <FaCarSide className="text-[#b42121] text-2xl" /> Equipamento & Opções
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(car.equipamento_opcoes).map(([categoria, lista]) => (
                  Array.isArray(lista) && lista.length > 0 && (
                    <div key={categoria} className="mb-2 bg-[#f7f7fa] rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block bg-[#b42121] text-white text-sm font-bold px-4 py-1 rounded-full shadow capitalize tracking-wide">
                          {categoria.replace(/_/g, ' ').replace('opcoes', 'opções')}
                        </span>
                      </div>
                      <ul className="list-none pl-0 space-y-2 text-gray-900 text-base">
                        {lista.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${categoria === 'opcoes_valor_elevado' ? 'bg-yellow-400' : 'bg-[#b42121]'}`}></span>
                            {categoria === 'opcoes_valor_elevado' && <FaStar className="text-yellow-400" title="Opção de valor elevado" />}
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}
          <a href="/viaturas" className="text-blue-700 hover:underline block mt-6">&larr; Voltar às viaturas</a>
        </main>
        <footer className="p-4 bg-gray-200 text-center text-gray-600 mt-8">
          &copy; 2025 Autogo. All rights reserved.
        </footer>
      </div>
    </Layout>
  );
}


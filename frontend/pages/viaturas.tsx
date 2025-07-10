import MainLayout from '../components/MainLayout';
import cars from '../data/cars.json';
import Link from 'next/link';
import styles from '../components/PremiumCarCard.module.css';
import React, { useState } from 'react';
import { FaCarSide, FaCalendarAlt, FaTachometerAlt, FaSearch } from 'react-icons/fa';

export default function Viaturas() {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [km, setKm] = useState('');

  // Unique options for selects
  const marcas = Array.from(new Set(cars.map(car => car.make)));
  const modelos = Array.from(new Set(cars.filter(car => !marca || car.make === marca).map(car => car.model)));
  const anos = Array.from(new Set(cars.map(car => car.year))).sort((a, b) => b - a);

  // Filtering logic
  const filteredCars = cars.filter(car =>
    (!marca || car.make === marca) &&
    (!modelo || car.model === modelo) &&
    (!ano || String(car.year) === ano) &&
    (!km || car.mileage <= parseInt(km))
  );

  return (
    <MainLayout>
      <section className="w-full px-0 py-12 bg-[#f5f6fa]">
        <h1 className="text-4xl font-bold mb-10 text-center text-black">
          Viaturas Disponíveis
        </h1>
        {/* Filtros estilizados */}
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-center mb-10 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-[#b42121]/10 transition-all duration-300 hover:shadow-2xl" style={{ color: 'rgba(210, 56, 56, 0.85)' }}>
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow border border-[#b42121]/10 focus-within:ring-2 focus-within:ring-[#b42121]/30 transition-all">
            <FaCarSide className="text-[#b42121] text-lg" />
            <select value={marca} onChange={e => { setMarca(e.target.value); setModelo(''); }} className="bg-transparent outline-none border-none text-base">
              <option value="">Marca</option>
              {marcas.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow border border-[#b42121]/10 focus-within:ring-2 focus-within:ring-[#b42121]/30 transition-all">
            <FaSearch className="text-[#b42121] text-lg" />
            <select value={modelo} onChange={e => setModelo(e.target.value)} className="bg-transparent outline-none border-none text-base">
              <option value="">Modelo</option>
              {modelos.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow border border-[#b42121]/10 focus-within:ring-2 focus-within:ring-[#b42121]/30 transition-all">
            <FaCalendarAlt className="text-[#b42121] text-lg" />
            <select value={ano} onChange={e => setAno(e.target.value)} className="bg-transparent outline-none border-none text-base">
              <option value="">Ano</option>
              {anos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow border border-[#b42121]/10 focus-within:ring-2 focus-within:ring-[#b42121]/30 transition-all">
            <FaTachometerAlt className="text-[#b42121] text-lg" />
            <input type="number" min="0" value={km} onChange={e => setKm(e.target.value)} placeholder="Máx. KM" className="bg-transparent outline-none border-none text-base w-24" />
          </div>
          <button
            className="flex items-center gap-2 rounded-xl px-6 py-2 font-bold shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#b42121]/60 focus:ring-offset-2 border-0"
            style={{ background: 'rgba(213, 80, 80, 0.85)', color: '#fff' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(213, 80, 80, 1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(213, 80, 80, 0.85)'}
          >
            <FaSearch />
            Filtrar
          </button>
          <button
            type="button"
            onClick={() => { setMarca(''); setModelo(''); setAno(''); setKm(''); }}
            className="flex items-center gap-2 bg-white border border-[#b42121]/30 text-[#b42121] rounded-xl px-6 py-2 font-bold shadow transition-all duration-200 hover:bg-[#b42121] hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#b42121]/30 focus:ring-offset-2"
          >
            Limpar Filtros
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className={styles['premium-car-card']}
            >
              {/* Galeria dinâmica de imagens com efeito */}
              <div className="w-full h-44 mb-4 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#b42121]/60 scrollbar-track-gray-200 bg-transparent">
                {(car.images || [car.image]).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => {
                      const modal = document.getElementById(`modal-img-${car.id}-${idx}`);
                      if (modal) (modal as HTMLDialogElement).showModal();
                    }}
                  >
                    <img
                      src={img}
                      alt={`${car.make} ${car.model} foto ${idx + 1}`}
                      className={styles['premium-car-image']}
                      style={{ minWidth: '11rem' }}
                    />
                  </button>
                ))}
                {/* Modais para expandir imagens */}
                {(car.images || [car.image]).map((img, idx) => (
                  <dialog key={idx} id={`modal-img-${car.id}-${idx}`} className="backdrop:bg-black/70 rounded-xl p-0 border-none max-w-3xl w-full">
                    <div className="flex flex-col items-center">
                      <img src={img} alt="Foto expandida" className="max-h-[80vh] w-auto rounded-xl shadow-lg" />
                      <button onClick={e => (e.currentTarget.closest('dialog') as HTMLDialogElement)?.close()} className="mt-4 mb-2 px-6 py-2 bg-[#b42121] text-white rounded-full font-bold hover:bg-[#a11a1a] transition">Fechar</button>
                    </div>
                  </dialog>
                ))}
              </div>
              <span className="absolute top-3 left-3 bg-[#ffbfae] text-white px-4 py-1 rounded-full text-xs font-bold shadow flex items-center gap-2">
                {car.country && (
                  <img
                    src={`/images/flags/${car.country.toLowerCase()}.png`}
                    alt={car.country}
                    className="w-5 h-5 rounded-full border border-white shadow"
                    style={{ display: 'inline-block' }}
                  />
                )}
              </span>
              <h2 className="text-xl font-bold mb-1 text-[#222] text-center px-2">
                {car.make} {car.model}
              </h2>
              <div className="text-gray-500 mb-1 text-center px-2">
                {car.year} · {car.mileage} km
              </div>
              <div className="font-bold text-green-700 text-lg mb-3 text-center px-2">
                €{car.price.toLocaleString()}
              </div>
              <div className="flex gap-2 w-full mt-4">
                <Link
                  href={`/cars/${car.id}`}
                  className="rounded-full py-2 px-8 font-bold text-base shadow-lg transition-all duration-200 mt-4 text-center w-full transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#b42121]/60 focus:ring-offset-2 border-0"
                  style={{
                    background: 'rgba(210, 56, 56, 0.85)',
                    color: '#fff',
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 18px 0 rgba(213, 80, 80, 0.18)'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(213, 80, 80, 0.85)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(213, 80, 80, 0.85)'}
                >
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

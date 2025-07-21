import React from "react";
import styles from "./CarCard.module.css";

type CarCardProps = {
  name: string;
  image: string;
  description: string;
  price: number;
  id: string | number;
  country?: string;
  status?: string;
};

const CarCard: React.FC<CarCardProps> = ({ name, image, description, price, id, country, status }) => (
  <a href={`/cars/${id}`} className="bg-white rounded shadow p-4 hover:shadow-lg transition block relative">
    {/* Status badge */}
    {status && status !== 'disponivel' && (
      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow z-20 text-white ${
        status === 'vendido' ? 'bg-gradient-to-r from-gray-500 via-gray-700 to-gray-900' : status === 'sob_consulta' ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900' : 'bg-gray-400'
      }`} style={{letterSpacing: '0.5px', minWidth: 90, textAlign: 'center', boxShadow: '0 4px 18px 0 rgba(44,62,80,0.13)'}}>
        {status === 'vendido' ? 'Vendido' : status === 'sob_consulta' ? 'Sob Consulta' : status}
      </span>
    )}
    {/* Bloco para imagem e bandeira */}
    <div className="relative">
      {/* Diagonal VENDIDO banner if sold */}
      {status === 'vendido' && (
        <span
          className="absolute left-0 top-1/2 w-full -translate-y-1/2 -rotate-12 bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700 text-white text-base font-extrabold py-2 shadow-2xl z-30 opacity-95 select-none pointer-events-none tracking-widest flex justify-center items-center border-2 border-white/70"
          style={{textShadow: '0 2px 12px rgba(0,0,0,0.22)', letterSpacing: '0.18em', fontSize: '1.15rem', filter: 'drop-shadow(0 4px 16px rgba(44,62,80,0.18))'}}
        >
          VENDIDO
        </span>
      )}
      <img src={image} alt={name} className="w-full h-40 object-cover rounded mb-4"/>
      {country && (
        <img
          src={`/images/flags/${country.toLowerCase()}.png`}
          alt={country}
          className="absolute top-2 left-2 w-7 h-7 rounded-full shadow border-2 border-white"
          title={
            country === "DE"
              ? "Alemanha"
              : country === "FR"
              ? "França"
              : country === "PT"
              ? "Portugal"
              : country
          }
        />
      )}
    </div>
    <h3 className="text-xl font-bold">{name}</h3>
    <p className="text-gray-600">{description}</p>
    <p className="text-blue-700 font-semibold mt-2">€{price.toLocaleString()}</p>
  </a>
);

export default CarCard;

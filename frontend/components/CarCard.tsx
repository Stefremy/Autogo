import React from "react";
import styles from "./CarCard.module.css";

type CarCardProps = {
  name: string;
  image: string;
  description: string;
  price: number;
  id: string | number;
  country?: string; // <-- tens isto certo!
};

const CarCard: React.FC<CarCardProps> = ({ name, image, description, price, id, country }) => (
  <a href={`/cars/${id}`} className="bg-white rounded shadow p-4 hover:shadow-lg transition block">
    {/* Bloco para imagem e bandeira */}
    <div className="relative">
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

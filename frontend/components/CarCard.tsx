import React from "react";
import styles from "./CarCard.module.css";
// ...use className={styles["car-card"]} instead of className="car-card"
type CarCardProps = {
  name: string;
  image: string;
  description: string;
  price: number;
  id: string | number;
};

const CarCard: React.FC<CarCardProps> = ({ name, image, description, price, id }) => (
  <a href={`/cars/${id}`} className="bg-white rounded shadow p-4 hover:shadow-lg transition block">
    <img src={image} alt={name} className="w-full h-40 object-cover rounded mb-4"/>
    <h3 className="text-xl font-bold">{name}</h3>
    <p className="text-gray-600">{description}</p>
    <p className="text-blue-700 font-semibold mt-2">€{price.toLocaleString()}</p>
  </a>
);

export default CarCard;
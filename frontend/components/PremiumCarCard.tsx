import React from "react";
import styles from "./PremiumCarCard.module.css";

type PremiumCarCardProps = {
  name: string;
  image: string;
  price: number;
  id: string | number;
  year: string | number;
  make: string;
  transmission?: string;
  type?: string;
  country?: string;
  bgColor?: string; // nova prop opcional
};

const PremiumCarCard: React.FC<PremiumCarCardProps> = ({ name, image, price, id, year, make, transmission, type = "SEDAN", country, bgColor }) => (
  <a
    href={`/cars/${id}`}
    className={styles["premium-car-card"]}
    style={bgColor ? { background: bgColor } : undefined}
  >
    <div style={{ position: 'relative' }}>
      <img src={image} alt={name} className={styles["premium-car-image"]} />
      {country && (
        <img
          src={`/images/flags/${country.toLowerCase()}.png`}
          alt={country}
          style={{ position: 'absolute', top: '0.9rem', left: '0.9rem', width: 32, height: 22, borderRadius: '0.2rem', border: '1.5px solid #fff', boxShadow: '0 2px 8px rgba(44,62,80,0.10)', zIndex: 2, background: '#fff', objectFit: 'cover' }}
        />
      )}
      <div className={styles["premium-car-price"]}>${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>
    <div className={styles["premium-car-info"]}>
      <div className={styles["premium-car-type"]}>{type}</div>
      <div className={styles["premium-car-title"]}>{name}</div>
      <div className={styles["premium-car-meta-row"]}>
        <div>
          <div className={styles["premium-car-meta-label"]}>Year</div>
          <div className={styles["premium-car-meta-value"]}>{year}</div>
        </div>
        <div>
          <div className={styles["premium-car-meta-label"]}>Make</div>
          <div className={styles["premium-car-meta-value"]}>{make}</div>
        </div>
        {transmission && (
          <div>
            <div className={styles["premium-car-meta-label"]}>Transmission</div>
            <div className={styles["premium-car-meta-value"]}>{transmission}</div>
          </div>
        )}
      </div>
    </div>
  </a>
);

export default PremiumCarCard;

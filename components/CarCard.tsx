import React from "react";
import MakeLogo from "./MakeLogo";
import _styles from "./CarCard.module.css";
import { formatPriceDisplay } from "../utils/formatPrice";

// reference `_styles` in a no-op to satisfy linter (style import kept for potential side-effects)
void _styles;

type CarCardProps = {
  name: string;
  image: string;
  description: string;
  price: number | string;
  priceDisplay?: string | null;
  id: string | number;
  slug?: string;
  country?: string;
  status?: string;
  make?: string; // optional explicit make (preferred)
};

const CarCard: React.FC<CarCardProps> = ({
  name,
  image,
  description,
  price,
  priceDisplay,
  id,
  slug,
  country,
  status,
  make,
}) => {
  const path = slug ? `/cars/${slug}` : `/cars/${id}`;

  // prefer numeric price; if not available, delegate to format helper
  let numericPrice: number | null = null;
  if (typeof price === "number" && Number.isFinite(price) && price > 0) numericPrice = price;
  else if (typeof price === "string" && price.trim().length > 0) {
    const p = Number(String(price).replace(/[^0-9.-]/g, ""));
    if (!Number.isNaN(p) && Number.isFinite(p) && p > 0) numericPrice = p;
  }
  const display = formatPriceDisplay(numericPrice, priceDisplay ?? (typeof price === "string" ? price : undefined));

  const isPriceAvailable = numericPrice !== null || (typeof priceDisplay === 'string' && priceDisplay.trim().length > 0);

  // simple SVG fallback so broken-image icon doesn't show
  const svgCarFallback =
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='160'%3E%3Crect fill='%23f8fafc' width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23959' font-size='18'%3Evehicle%3C/text%3E%3C/svg%3E";

  // If price is not available we render a non-clickable card and show "Sob Consulta"
  if (!isPriceAvailable) {
    return (
      <div className="bg-white rounded shadow p-4 transition block relative">
        {/* Status badge */}
        {status && (
          <span
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium shadow z-20 text-white ${
              status === "disponivel"
                ? "bg-green-500"
                : status === "vendido"
                  ? "bg-gray-400"
                  : status === "sob_consulta"
                    ? "bg-yellow-400"
                    : "bg-gray-400"
            }`}
            style={{ letterSpacing: "0.5px", minWidth: 90, textAlign: "center" }}
          >
            {status === "disponivel"
              ? "Disponível"
              : status === "vendido"
                ? "Vendido"
                : status === "sob_consulta"
                  ? "Sob Consulta"
                  : status}
          </span>
        )}

        <div className="relative shiftImageUp">
          <img
            src={image || svgCarFallback}
            alt={name}
            className="w-full h-40 md:h-[247px] lg:h-[282px] object-cover rounded mb-4"
            loading="lazy"
            width={1024}
            height={441}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.src && img.src.endsWith('.png')) {
                img.src = img.src.replace('.png', '.jpg');
                return;
              }
              if (!img.src.startsWith('data:image')) img.src = svgCarFallback;
            }}
          />

          <div style={{ position: "absolute", bottom: 8, left: 8, zIndex: 2 }}>
            {/* prefer explicit make prop if available, else take first word of name */}
            {/* @ts-ignore */}
            <MakeLogo make={make ?? name.split(" ")[0]} size={26} />
          </div>

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
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>

        <h3 className="text-xl font-medium">{name}</h3>
        <p className="text-gray-600">{description}</p>
        <p className="text-blue-700 font-medium mt-2">Sob Consulta</p>
      </div>
    );
  }

  return (
    <a href={path} className="bg-white rounded shadow p-4 hover:shadow-lg transition block relative">
      {/* Status badge */}
      {status && (
        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium shadow z-20 text-white ${
            status === "disponivel"
              ? "bg-green-500"
              : status === "vendido"
                ? "bg-gray-400"
                : status === "sob_consulta"
                  ? "bg-yellow-400"
                  : "bg-gray-400"
          }`}
          style={{ letterSpacing: "0.5px", minWidth: 90, textAlign: "center" }}
        >
          {status === "disponivel"
            ? "Disponível"
            : status === "vendido"
              ? "Vendido"
              : status === "sob_consulta"
                ? "Sob Consulta"
                : status}
        </span>
      )}
      {/* Bloco para imagem e bandeira */}
      <div className="relative shiftImageUp">
        <img
          src={image || svgCarFallback}
          alt={name}
          className="w-full h-40 md:h-[247px] lg:h-[282px] object-cover rounded mb-4"
          loading="lazy"
          width={1024}
          height={441}
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (img.src && img.src.endsWith('.png')) {
              img.src = img.src.replace('.png', '.jpg');
              return;
            }
            if (!img.src.startsWith('data:image')) img.src = svgCarFallback;
          }}
        />
        {/* make logo shown on top-left of image (if available) */}
        <div style={{ position: "absolute", bottom: 8, left: 8, zIndex: 2 }}>
          {/* prefer explicit make prop if available, else take first word of name */}
          {/* @ts-ignore */}
          <MakeLogo make={make ?? name.split(" ")[0]} size={26} />
        </div>
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
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        )}
      </div>
      <h3 className="text-xl font-medium">{name}</h3>
      <p className="text-gray-600">{description}</p>
      <p className="text-blue-700 font-medium mt-2">{display}</p>
    </a>
  );
};

export default CarCard;

import React from "react";
import { useTranslation } from "next-i18next";
import styles from "./PremiumCarCard.module.css";
import { formatPriceDisplay } from "../utils/formatPrice";

type PremiumCarCardProps = {
  name: string;
  image: string;
  price: number | string;
  priceDisplay?: string | null;
  id: string | number;
  slug?: string;
  year: string | number;
  make: string;
  mileage?: number | string;
  transmission?: string;
  type?: string;
  country?: string;
  bgColor?: string; // nova prop opcional
  status?: string;
};

const PremiumCarCard: React.FC<PremiumCarCardProps> = ({
  name,
  image,
  price,
  priceDisplay,
  id,
  slug,
  year,
  make,
  transmission,
  type = "SEDAN",
  country,
  bgColor,
  status,
  mileage,
}) => {
  const { t } = useTranslation("common");
  // Status translation
  const statusLabels: Record<string, string> = {
    disponivel: t("Disponível"),
    vendido: t("Vendido"),
    sob_consulta: t("Sob Consulta"),
    novidade: t("Novidade"),
  };
  const path = slug ? `/cars/${slug}` : `/cars/${id}`;

  // Normalize inputs and use shared formatter
  let numericPrice: number | null = null;
  if (typeof price === "number" && Number.isFinite(price)) numericPrice = price;
  // If price is a numeric string, try to parse it
  if (numericPrice === null && typeof price === "string" && price.trim().length > 0) {
    const p = Number(String(price).replace(/[^0-9.-]/g, ""));
    if (!Number.isNaN(p) && Number.isFinite(p)) numericPrice = p;
  }
  const display = formatPriceDisplay(numericPrice, priceDisplay ?? (typeof price === "string" ? price : undefined));

  // Display only the year portion (handles '2019-12-10' and numeric years)
  const displayYear = (() => {
    if (typeof year === 'number') return String(year);
    if (typeof year === 'string') {
      const m = year.match(/^(\d{4})/);
      return m ? m[1] : year;
    }
    return '';
  })();

  return (
    <a href={path} className={styles["premium-car-card"]} style={bgColor ? { background: bgColor } : undefined}>
      <div style={{ position: "relative" }}>
        {/* Status badge */}
        {status && (
          <span
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow z-20 text-white ${
              status === "disponivel"
                ? "bg-green-500"
                : status === "vendido"
                  ? "bg-gray-400"
                  : status === "sob_consulta"
                    ? "bg-yellow-400"
                    : status === "novidade"
                      ? "bg-blue-500"
                      : "bg-gray-400"
            }`}
            style={{
              letterSpacing: "0.5px",
              minWidth: 90,
              textAlign: "center",
            }}
          >
            {statusLabels[status] || status}
          </span>
        )}
        <img src={image} alt={name} className={styles["premium-car-image"]} />
        {country && (
          <img
            src={`/images/flags/${country.toLowerCase()}.png`}
            alt={country}
            style={{
              position: "absolute",
              top: "0.9rem",
              left: "0.9rem",
              width: 32,
              height: 22,
              borderRadius: "0.2rem",
              border: "1.5px solid #fff",
              boxShadow: "0 2px 8px rgba(44,62,80,0.10)",
              zIndex: 2,
              background: "#fff",
              objectFit: "cover",
            }}
          />
        )}
      </div>
      <div className={styles["premium-car-info"]}>
        <div
          className={styles["premium-car-type"]}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Car make logo with robust fallback for different filename patterns (hyphens, case, png/jpg) */}
            {make && (
              (() => {
                // build a prioritized list of possible filenames to try
                const sanitize = (s: string) =>
                  s.replace(/\s+/g, "-").replace(/[^A-Za-z0-9-]/g, "");
                const originalSan = sanitize(make); // keeps case and hyphens
                const lowerSan = originalSan.toLowerCase(); // lowercase with hyphens
                const noHyphen = originalSan.replace(/-/g, "");
                const candidates = [
                  `/images/carmake/${lowerSan}-logo.png`,
                  `/images/carmake/${lowerSan}-logo.jpg`,
                  `/images/carmake/${originalSan}-logo.png`,
                  `/images/carmake/${originalSan}-logo.jpg`,
                  `/images/carmake/${noHyphen}-logo.png`,
                  `/images/carmake/${noHyphen}-logo.jpg`,
                  `/images/carmake/${make}-logo.png`,
                  `/images/carmake/${make}-logo.jpg`,
                ];

                // start with first candidate
                const first = candidates[0];

                return (
                  <img
                    src={first}
                    data-candidates={JSON.stringify(candidates)}
                    data-attempt={"0"}
                    alt={make}
                    style={{
                      height: 30,
                      width: "auto",
                      maxWidth: 80,
                      objectFit: "contain",
                      display: "inline-block",
                      verticalAlign: "middle",
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.10))",
                    }}
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement & { dataset: any };
                      try {
                        const list: string[] = JSON.parse(img.dataset.candidates || "[]");
                        let idx = parseInt(img.dataset.attempt || "0", 10);
                        idx = Number.isNaN(idx) ? 0 : idx;
                        const next = idx + 1;
                        if (list && next < list.length) {
                          img.dataset.attempt = String(next);
                          img.src = list[next];
                        } else {
                          // none matched — hide the element so layout stays clean
                          img.style.display = "none";
                        }
                      } catch (err) {
                        img.style.display = "none";
                      }
                    }}
                  />
                );
              })()
            )}
              {/* Mileage next to the logo (thin Montserrat) */}
              {mileage !== undefined && (
                <div
                  style={{
                    marginLeft: "0.25rem",
                    fontFamily: "Montserrat, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
                    fontWeight: 300,
                    fontSize: "0.85rem",
                    color: "#4b5563",
                    whiteSpace: "nowrap",
                  }}
                >
                  {(typeof mileage === "number" ? mileage : Number(mileage))
                    .toLocaleString("pt-PT")}
                  &nbsp;km
                </div>
              )}
          </div>
          <div
            style={{
              fontWeight: 700,
              color: "#1a1a1a",
              fontSize: "1.15rem",
              letterSpacing: "0.5px",
              minWidth: 90,
              textAlign: "right",
            }}
          >
            {display}
          </div>
        </div>
        <div className={styles["premium-car-title"]}>{name}</div>
        <div className={styles["premium-car-meta-row"]}>
          <div>
            <div className={styles["premium-car-meta-label"]}>{t("Ano")}</div>
            <div className={styles["premium-car-meta-value"]}>{displayYear}</div>
          </div>
          <div>
            <div className={styles["premium-car-meta-label"]}>{t("Marca")}</div>
            <div className={styles["premium-car-meta-value"]}>{make}</div>
          </div>
          {transmission && (
            <div>
              <div className={styles["premium-car-meta-label"]}>
                {t("Transmissão")}
              </div>
              <div className={styles["premium-car-meta-value"]}>
                {transmission}
              </div>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

export default PremiumCarCard;

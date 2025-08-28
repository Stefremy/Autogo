import React from "react";
import { useTranslation } from "next-i18next";
import styles from "./PremiumCarCard.module.css";

type PremiumCarCardProps = {
  name: string;
  image: string;
  price: number;
  id: string | number;
  year: string | number;
  make: string;
  transmission?: string;
  type?: string; // compatibilidade; não usado
  country?: string;
  bgColor?: string;
  status?: string;
  slug: string; // 👈 agora é obrigatório
};

const PremiumCarCard: React.FC<PremiumCarCardProps> = ({
  name,
  image,
  price,
  id,
  year,
  make,
  transmission,
  type: _type,
  country,
  bgColor,
  status,
  slug,
}) => {
  const { t } = useTranslation("common");

  const statusLabels: Record<string, string> = {
    disponivel: t("Disponível"),
    vendido: t("Vendido"),
    sob_consulta: t("Sob Consulta"),
    novidade: t("Novidade"),
  };

  // usa sempre o slug
  const href = `/cars/${slug}`;

  return (
    <a
      href={href}
      className={styles["premium-car-card"]}
      style={bgColor ? { background: bgColor } : undefined}
    >
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
            style={{ letterSpacing: "0.5px", minWidth: 90, textAlign: "center" }}
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
            {make && (
              <img
                src={`/images/carmake/${make
                  .toLowerCase()
                  .replace(/[^a-z0-9]/gi, "")}-logo.png`}
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
                  const img = e.currentTarget as HTMLImageElement;
                  if (!img.src.endsWith(".jpg")) {
                    img.src = img.src.replace(".png", ".jpg");
                  } else {
                    img.style.display = "none";
                  }
                }}
              />
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
            €
            {price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className={styles["premium-car-title"]}>{name}</div>

        <div className={styles["premium-car-meta-row"]}>
          <div>
            <div className={styles["premium-car-meta-label"]}>{t("Ano")}</div>
            <div className={styles["premium-car-meta-value"]}>{year}</div>
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

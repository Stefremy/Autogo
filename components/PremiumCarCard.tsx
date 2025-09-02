import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import styles from "./PremiumCarCard.module.css";

type PremiumCarCardProps = {
  name: string;
  image: string;            // caminhos locais em /public/images/* ou URL externa configurada
  price: number;
  id: string | number;
  year: string | number;
  make: string;
  transmission?: string;
  type?: string;            // compatibilidade; não usado
  country?: string;
  bgColor?: string;
  status?: string;
  slug?: string;            // URL amigável
};

const PremiumCarCard: React.FC<PremiumCarCardProps> = ({
  name,
  image,
  price,
  id,
  year,
  make,
  transmission,
  type: _type, // evita warning do ESLint
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

  // ✅ usa /viaturas/{slug} ou /viaturas/{id}
  const href = slug ? `/viaturas/${slug}` : `/viaturas/${id}`;


  return (
    <Link
      href={href}
      className={styles["premium-car-card"]}
      style={bgColor ? { background: bgColor } : undefined}
      aria-label={`${name} - Ver detalhes`}
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

        {/* Imagem principal do carro (next/image) */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 220,            // altura fixa para evitar layout shift; ajuste se quiser
            overflow: "hidden",
            borderRadius: "0.75rem",
          }}
        >
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles["premium-car-image"]}
            priority={false}
          />
        </div>

        {/* Bandeira do país (next/image) */}
        {country && (
          <div
            style={{
              position: "absolute",
              top: "0.9rem",
              left: "0.9rem",
              zIndex: 2,
            }}
          >
            <Image
              src={`/images/flags/${country.toLowerCase()}.png`}
              alt={country}
              width={32}
              height={22}
              style={{
                borderRadius: "0.2rem",
                border: "1.5px solid #fff",
                boxShadow: "0 2px 8px rgba(44,62,80,0.10)",
                background: "#fff",
                objectFit: "cover",
              }}
            />
          </div>
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
            {/* Logo da marca */}
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
                    const originalCase = `/images/carmake/${make.replace(
                      /[^a-z0-9]/gi,
                      ""
                    )}-logo.png`;
                    if (img.src !== window.location.origin + originalCase) {
                      img.src = originalCase;
                    } else {
                      img.style.display = "none";
                    }
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
    </Link>
  );
};

export default PremiumCarCard;

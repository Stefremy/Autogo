import React from "react";

type MakeLogoProps = {
  make?: string;
  size?: number;
  className?: string;
};

// Small helper that tries several filename patterns for brand logos.
const MakeLogo: React.FC<MakeLogoProps> = ({ make, size = 28, className }) => {
  if (!make) return null;

  const sanitize = (s: string) => s.replace(/\s+/g, "-").replace(/[^A-Za-z0-9-]/g, "");
  const originalSan = sanitize(make);
  const lowerSan = originalSan.toLowerCase();
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

  return (
    <img
      src={candidates[0]}
      data-candidates={JSON.stringify(candidates)}
      data-attempt={"0"}
      alt={make}
      className={className}
      style={{
        height: size,
        width: "auto",
        objectFit: "contain",
        display: "inline-block",
      }}
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
            img.style.display = "none";
          }
        } catch (err) {
          img.style.display = "none";
        }
      }}
    />
  );
};

export default MakeLogo;

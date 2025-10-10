import React from "react";

type MakeLogoProps = {
  make?: string;
  size?: number;
  className?: string;
};

function MakeLogo(props: MakeLogoProps) {
  const { make, size = 28, className } = props;
  if (!make) return null;

  // Aliases para normalizar nomes de marcas
  const ALIASES: Record<string, string> = {
    mercedes: "Mercedes-Benz",
    "mercedes-benz": "Mercedes-Benz",
    mb: "Mercedes-Benz",
    mazda: "Mazda",
    mazd: "Mazda",
    mg: "MG", // Morris Garage
  };

  const resolvedMake = (ALIASES[(make || "").trim().toLowerCase()] || make).toString();

  // Gera candidatos de nomes de arquivo (variações comuns)
  const genCandidates = (s: string) => {
    const clean = s.replace(/[^A-Za-z0-9\s-]/g, "").trim();
    const withSpaces = clean.replace(/\s+/g, " ");
    const kebab = withSpaces.replace(/\s+/g, "-");
    const lowerKebab = kebab.toLowerCase();
    const camelHyphen = clean.replace(/([a-z])([A-Z])/g, "$1-$2");
    const lowerCamelHyphen = camelHyphen.toLowerCase();
    const noHyphen = clean.replace(/-/g, "");
    const lowerNoHyphen = noHyphen.toLowerCase();

    const bases = Array.from(
      new Set([s, kebab, lowerKebab, camelHyphen, lowerCamelHyphen, noHyphen, lowerNoHyphen])
    );

    const list: string[] = [];
    for (const b of bases) {
      list.push(`/images/carmake/${b}-logo.png`);
      list.push(`/images/carmake/${b}-logo.jpg`);
    }
    return list;
  };

  const candidates = (() => {
    const SPECIAL_CASES: Record<string, string[]> = {
      mazda: [
        "/images/carmake/mazda-logo.png",
        "/images/carmake/Mazda-logo.png",
        "/images/carmake/mazda-logo.jpg",
        "/images/carmake/Mazda-logo.jpg",
      ],
      mg: [
        "/images/carmake/MG-logo.jpg",
        "/images/carmake/MG-logo.png",
        "/images/carmake/mg-logo.jpg",
        "/images/carmake/mg-logo.png",
      ],
    };

    const key = (resolvedMake || "").toString().trim().toLowerCase();
    if (SPECIAL_CASES[key]) return SPECIAL_CASES[key];
    return genCandidates(resolvedMake);
  })();

  // Fallback SVG (placeholder neutro)
  const svgFallback =
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23959' font-size='10'%3Elogo%3C/text%3E%3C/svg%3E";

  return (
    <img
      src={candidates[0]}
      data-candidates={JSON.stringify(candidates)}
      data-attempt={"0"}
      alt={make}
      className={className}
      width={Math.round(size * 2.5)}
      height={size}
      style={{
        height: size,
        width: "auto",
        objectFit: "contain",
        display: "inline-block",
        opacity: 0,
        transition: "opacity 180ms ease-in-out, filter 180ms ease-in-out",
        background: "transparent",
      }}
      loading="lazy"
      onLoad={(e) => {
        try {
          const img = e.currentTarget as HTMLImageElement & { dataset: DOMStringMap };
          img.style.opacity = "1";
          img.style.filter = "none";
        } catch (_err) {
          // ignore
        }
      }}
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement & { dataset: DOMStringMap };
        try {
          const list = JSON.parse((img.dataset.candidates as string) || "[]") as string[];
          const attempt = parseInt((img.dataset.attempt as string) || "0", 10);
          const next = Number.isNaN(attempt) ? 1 : attempt + 1;

          if (Array.isArray(list) && next < list.length) {
            img.dataset.attempt = String(next);
            img.style.opacity = "0";
            setTimeout(() => {
              img.src = list[next];
            }, 80);
          } else {
            img.src = svgFallback;
            img.style.objectFit = "contain";
            img.style.background = "transparent";
            img.style.opacity = "1";
          }
        } catch (_err) {
          img.src = svgFallback;
          img.style.opacity = "1";
        }
      }}
    />
  );
}

export default MakeLogo;

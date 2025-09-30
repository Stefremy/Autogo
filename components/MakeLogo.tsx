import React from "react";

type MakeLogoProps = {
  make?: string;
  size?: number;
  className?: string;
};

// Small helper that tries several filename patterns for brand logos.
const MakeLogo: React.FC<MakeLogoProps> = ({ make, size = 28, className }) => {
  if (!make) return null;

  // generate a prioritized list of candidate filenames covering
  // spaces, hyphens, camelCase (insert hyphen between lowercase+Uppercase),
  // lowercase variants, and no-hyphen variants
  const genCandidates = (s: string) => {
    const clean = s.replace(/[^A-Za-z0-9\s-]/g, "").trim();
    const withSpaces = clean.replace(/\s+/g, " ");
    const kebab = withSpaces.replace(/\s+/g, "-"); // e.g. Mercedes-Benz
    const lowerKebab = kebab.toLowerCase(); // e.g. mercedes-benz
    const camelHyphen = clean.replace(/([a-z])([A-Z])/g, "$1-$2"); // MercedesBenz -> Mercedes-Benz
    const lowerCamelHyphen = camelHyphen.toLowerCase();
    const noHyphen = clean.replace(/-/g, ""); // MercedesBenz
    const lowerNoHyphen = noHyphen.toLowerCase();

    const bases = Array.from(new Set([
      lowerKebab,
      kebab,
      lowerCamelHyphen,
      camelHyphen,
      lowerNoHyphen,
      noHyphen,
      s,
    ]));

    const list: string[] = [];
    for (const b of bases) {
      list.push(`/images/carmake/${b}-logo.png`);
      list.push(`/images/carmake/${b}-logo.jpg`);
    }
    return list;
  };

  const candidates = genCandidates(make);

  // lightweight SVG fallback (keeps space visible instead of broken icon)
  const svgFallback =
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect fill='%23f3f4f6' width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23959' font-size='10'%3Elogo%3C/text%3E%3C/svg%3E";

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
      }}
      loading="eager"
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
            // final fallback: keep visible but show neutral placeholder (no hide)
            img.src = svgFallback;
            img.style.objectFit = "contain";
            img.style.background = "transparent";
          }
        } catch (err) {
          img.src = svgFallback;
        }
      }}
    />
  );
};

export default MakeLogo;

import React from "react";

type MakeLogoProps = {
  make?: string;
  size?: number;
  className?: string;
};

// Small helper that tries several filename patterns for brand logos.
const MakeLogo: React.FC<MakeLogoProps> = ({ make, size = 28, className }) => {
  if (!make) return null;

  // map common shorthand names to the canonical filename base present in /public/images/carmake
  const ALIASES: Record<string, string> = {
    mercedes: 'Mercedes-Benz',
    'mercedes-benz': 'Mercedes-Benz',
    mb: 'Mercedes-Benz',
    // common misspellings / lowercase variants to ensure the correct logo is resolved
    mazda: 'Mazda',
    mazd: 'Mazda',
    // shorthand for Morris Garage / MG
    mg: 'MG',
    // Cupra brand (added because repo contains cupra-logo.svg)
    cupra: 'Cupra',
  };

  const resolvedMake = (ALIASES[(make || '').trim().toLowerCase()] || make).toString();

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

    // Prioritize the exact resolved string (preserves original capitalization)
    // so filenames like `Mercedes-Benz-logo.jpg` are tried early.
    const bases = Array.from(new Set([
      s,
      kebab,
      lowerKebab,
      camelHyphen,
      lowerCamelHyphen,
      noHyphen,
      lowerNoHyphen,
    ]));

    const list: string[] = [];
    for (const b of bases) {
      // prefer SVG when available
      list.push(`/images/carmake/${b}-logo.svg`);
      list.push(`/images/carmake/${b}-logo.png`);
      list.push(`/images/carmake/${b}-logo.jpg`);
    }
    return list;
  };

  const candidates = (() => {
    // special-case prioritized lists for known logos present in /public/images/carmake
    const SPECIAL_CASES: Record<string, string[]> = {
      // prefer the svg/png paths first to get transparency where available
      mazda: [
        '/images/carmake/mazda-logo.svg',
        '/images/carmake/mazda-logo.png',
        '/images/carmake/Mazda-logo.png',
        '/images/carmake/mazda-logo.jpg',
        '/images/carmake/Mazda-logo.jpg',
      ],
      // MG provided as JPG in the repo; try PNG/SVG variants before JPG
      mg: [
        '/images/carmake/MG-logo.svg',
        '/images/carmake/MG-logo.png',
        '/images/carmake/MG-logo.jpg',
        '/images/carmake/mg-logo.jpg',
        '/images/carmake/mg-logo.png',
      ],
      // Cupra: repo has lowercase svg — prefer that first
      cupra: [
        '/images/carmake/cupra-logo.svg',
        '/images/carmake/Cupra-logo.svg',
        '/images/carmake/cupra-logo.png',
        '/images/carmake/Cupra-logo.png',
        '/images/carmake/cupra-logo.jpg',
      ],
    };

    const key = (resolvedMake || '').toString().trim().toLowerCase();
    if (SPECIAL_CASES[key]) return SPECIAL_CASES[key];
    return genCandidates(resolvedMake);
  })();

  // lightweight SVG fallback (keeps space visible instead of broken icon)
  const svgFallback =
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23959' font-size='10'%3Elogo%3C/text%3E%3C/svg%3E";

  // Helper: convert near-white pixels to transparent for same-origin raster logos (jpg/jpeg)
  const removeWhiteBackground = async (img: HTMLImageElement, threshold = 240) => {
    try {
      // avoid re-processing
      if ((img.dataset && img.dataset.processed) || !img.naturalWidth) return;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const t = Math.max(0, Math.min(255, threshold));
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // if pixel is near-white, make it fully transparent
        if (r >= t && g >= t && b >= t) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      // replace src with data URL (PNG) only if same-origin canvas not tainted
      try {
        const png = canvas.toDataURL('image/png');
        img.dataset.processed = '1';
        img.src = png;
      } catch {
        // canvas is tainted (cross-origin); ignore
      }
    } catch {
      // ignore any processing errors
    }
  };

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
        // start hidden and fade in when the real image has loaded to avoid flash
        opacity: 0,
        transition: "opacity 180ms ease-in-out, filter 180ms ease-in-out",
        backgroundColor: 'transparent',
      }}
      loading={"lazy"}
      onLoad={(e) => {
        try {
          const img = e.currentTarget as HTMLImageElement & { dataset: any };
          // reveal smoothly when loaded
          img.style.opacity = "1";
          img.style.filter = "none";
          // if the loaded asset is a JPG/JPEG from our own origin, attempt to remove white bg
          const src = (img.src || '').toLowerCase();
          if ((src.endsWith('.jpg') || src.endsWith('.jpeg')) && !img.dataset.processed) {
            // run async post-processing (no await) to avoid blocking rendering
            removeWhiteBackground(img).catch(() => {});
          }
        } catch { /* ignore */ }
      }}
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement & { dataset: any };
        try {
          const list: string[] = JSON.parse(img.dataset.candidates || "[]");
          let idx = parseInt(img.dataset.attempt || "0", 10);
          idx = Number.isNaN(idx) ? 0 : idx;
          const next = idx + 1;
          if (list && next < list.length) {
            // fade out slightly before swapping to reduce perceived flash
            img.dataset.attempt = String(next);
            img.style.opacity = "0";
            setTimeout(() => {
              try { img.src = list[next]; } catch { img.src = list[next]; }
            }, 80);
          } else {
            // final fallback: keep visible but show neutral placeholder (no hide)
            img.src = svgFallback;
            img.style.objectFit = "contain";
            img.style.backgroundColor = "transparent";
            img.style.opacity = "1";
          }
        } catch { img.src = svgFallback; img.style.opacity = "1"; }
      }}
    />
  );
};

export default MakeLogo;

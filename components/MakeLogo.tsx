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
    // DS brand variants
    ds: 'DS',
    'ds automobiles': 'DS',
    'ds-automobiles': 'DS',
  };

  // Map of normalized make (lowercase, minimal punctuation) to the exact filename in /public/images/carmake/
  // Verified via filesystem audit on 2026-02-16
  const KNOWN_LOGOS: Record<string, string> = {
    "abarth": "Abarth-logo.webp",
    "alfa romeo": "Alfa-Romeo-logo.webp",
    "alfaromeo": "Alfa-Romeo-logo.webp",
    "alpine": "Alpine-logo.webp",
    "amg": "AMG-logo.webp",
    "audi": "audi-logo.webp",
    "audi sport": "Audi-Sport-logo.webp",
    "bmw": "bmw-logo.webp",
    "bmw m": "BMW-M-logo.webp",
    "bugatti": "Bugatti-logo.webp",
    "byd": "BYD-logo.webp",
    "chery": "Chery-logo.webp",
    "chevrolet": "Chevrolet-logo.webp",
    "citroen": "Citroen-logo.webp",
    "cupra": "cupra-logo.svg",
    "dacia": "Dacia-logo.webp",
    "ds": "DS-logo.webp",
    "ferrari": "ferrari-logo.webp",
    "fiat": "Fiat-logo.webp",
    "ford": "ford-logo.webp",
    "honda": "honda-logo.webp",
    "hyundai": "hyundai-logo.webp",
    "jaguar": "jaguar-logo.webp",
    "jeep": "jeep-logo.webp",
    "kia": "Kia-logo.webp",
    "lamborghini": "lamborghini-logo.webp",
    "lancia": "Lancia-logo.webp",
    "land rover": "Land-Rover-logo.webp",
    "landrover": "Land-Rover-logo.webp",
    "lexus": "Lexus-logo.webp",
    "maserati": "maserati-logo.webp",
    "mazda": "mazda-logo.webp",
    "mclaren": "McLaren-logo.webp", // Hypothetical if added later
    "mercedes": "Mercedes-Benz-logo.webp",
    "mercedes-benz": "Mercedes-Benz-logo.webp",
    "mg": "MG-logo.webp",
    "mini": "Mini-logo.webp",
    "mitsubishi": "Mitsubishi-logo.webp",
    "nio": "nio-logo.webp",
    "nissan": "nissan-logo.webp",
    "opel": "Opel-logo.webp",
    "pagani": "Pagani-logo.webp",
    "peugeot": "Peugeot-logo.webp",
    "porsche": "porsche-logo.webp",
    "renault": "Renault-logo.webp",
    "seat": "SEAT-logo.webp",
    "skoda": "Skoda-logo.webp",
    "smart": "Smart-logo.webp",
    "suzuki": "Suzuki-logo.webp",
    "tata": "Tata-logo.webp",
    "tesla": "tesla-logo.webp",
    "toyota": "toyota-logo.webp",
    "volkswagen": "Volkswagen-logo.webp",
    "vw": "Volkswagen-logo.webp",
    "volvo": "Volvo-logo.webp"
  };

  const candidates = (() => {
    const key = (make || '').trim().toLowerCase();

    // Check known map first
    if (KNOWN_LOGOS[key]) {
      return [`/images/carmake/${KNOWN_LOGOS[key]}`];
    }

    // Check strict aliases if not found in map
    const alias = ALIASES[key];
    if (alias && KNOWN_LOGOS[alias.toLowerCase()]) {
      return [`/images/carmake/${KNOWN_LOGOS[alias.toLowerCase()]}`];
    }

    // Fallback (only for unknown makes)
    // We limit fallback to just .webp and .png to avoid 404 storms
    const resolved = alias || make || '';
    const clean = resolved.replace(/[^A-Za-z0-9\s-]/g, "").trim();
    return [
      `/images/carmake/${clean}-logo.webp`,
      `/images/carmake/${clean}-logo.png`
    ];
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
            removeWhiteBackground(img).catch(() => { });
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

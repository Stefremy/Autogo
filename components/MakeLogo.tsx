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
    // so filenames like Mercedes-Benz-logo.jpg are tried early.
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
      // ⬇⬇ CORRIGIDO: usar crases (template string) ⬇⬇
      list.push(`/images/carmake/${b}-logo.png`); 
      list.push(`/images/carmake/${b}-logo.jpg`); 
    } 
    return list; 
  }; 

  const candidates = (() => { 
    // special-case prioritized lists for known logos present in /public/images/carmake
    const SPECIAL_CASES: Record<string, string[]> = { 
      // prefer the lowercase png path the user mentioned, but include other variants too 
      mazda: [ 
        '/images/carmake/mazda-logo.png', 
        '/images/carmake/Mazda-logo.png', 
        '/images/carmake/mazda-logo.jpg', 
        '/images/carmake/Mazda-logo.jpg', 
      ], 
      // MG provided as JPG in the repo; try that first then other common variants 
      mg: [ 
        '/images/carmake/MG-logo.jpg', 
        '/images/carmake/MG-logo.png', 
        '/images/carmake/mg-logo.jpg', 
        '/images/carmake/mg-logo.png', 
      ], 
    }; 

    const key = (resolvedMake || '').toString().trim().toLowerCase(); 
    if (SPECIAL_CASES[key]) return SPECIAL_CASES[key]; 
    return genCandidates(resolvedMake); 
  })(); 

  // lightweight SVG fallback (keeps space visible instead of broken icon)
  const svgFallback = "data:imag

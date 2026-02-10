import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  FaTachometerAlt,
  FaGasPump,
  FaCogs,
  FaCarSide,
  FaDoorOpen,
  FaRoad,
  FaBolt,
  FaRegCalendarCheck,
  FaLayerGroup,
  FaChevronDown,
  FaChevronUp,
  FaBarcode,
  FaPalette,
  FaGlobeEurope,
  FaCloud,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import jsPDF from "jspdf";
import Head from "next/head";
import Layout from "../../components/MainLayout";
import Seo from '../../components/Seo';
import carsData from "../../data/cars.json";
import type { Car, MaintenanceItem } from '../../types/car.d';
import MakeLogo from "../../components/MakeLogo";
import { SITE_WIDE_KEYWORDS, joinKeywords } from "../../utils/seoKeywords";
import { parseNumber } from "../../utils/carProcessors";

// Static generation helpers: produce only valid paths and return 404 when car is missing.
export async function getStaticPaths() {
  // Create paths for each car with a slug when available, else use id
  const cars = (await import("../../data/cars.json")).default as any[];
  const paths: { params: { slug: string }; locale?: string }[] = [];
  // If i18n locales exist, Next will replicate paths per locale automatically when prerendering.
  for (const c of cars) {
    if (!c) continue;
    const key = c.slug && String(c.slug).trim().length > 0 ? String(c.slug) : String(c.id);
    if (!key || key === "undefined") continue;
    paths.push({ params: { slug: key } });
  }
  return {
    paths,
    fallback: false, // unknown slugs -> 404
  };
}

export async function getStaticProps({ params, locale }: { params: any; locale?: string }) {
  const slug = params?.slug;
  const cars = (await import("../../data/cars.json")).default as any[];
  const requested = String(slug).toLowerCase();
  const car = cars.find((c) => String(c.id) === requested || (c.slug && c.slug.toLowerCase() === requested));
  if (!car) {
    return { notFound: true };
  }

  // Local numeric coercion (avoid depending on module-level helpers here to keep getStaticProps self-contained)
  // UPDATED: Using shared utility for consistency
  const numifyLocal = parseNumber;

  // Build SEO-friendly keywords (site-wide + specific)
  const detailKeywords = (() => {
    try {
      if (car && Array.isArray(car.keywords) && car.keywords.length > 0) {
        return String(car.keywords).split(',').map((k: string) => String(k).trim()).join(', ');
      }
    } catch {
      /* ignore */
    }
    return joinKeywords(SITE_WIDE_KEYWORDS);
  })();

  // Safely build Vehicle/Product JSON-LD, ensuring no `undefined` values are present
  const priceNum = numifyLocal(car.price);
  const mileageNum = numifyLocal(car.mileage ?? car.odometer);

  const make = String(car.make || '');
  const model = String(car.model || '');

  // Derive canonical site origin from env or fallback to production origin
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://autogo.pt';

  // Normalize image URLs: leave absolute URLs untouched, prefix only when path is root-relative.
  const normalizeImage = (img: any): string | null => {
    if (!img) return null;
    if (typeof img !== 'string') return null;
    if (img.startsWith('data:')) return img;
    if (/^https?:\/\//i.test(img)) return img;
    if (img.startsWith('//')) return `https:${img}`; // protocol-relative -> prefer https
    if (img.startsWith('/')) return `${siteOrigin}${img}`;
    // fallback: treat as relative path under origin
    return `${siteOrigin}/${img.replace(/^\/+/, '')}`;
  };

  const images: string[] = [];
  try {
    if (Array.isArray(car.images) && car.images.length) {
      for (const img of car.images) {
        const n = normalizeImage(img);
        if (n) images.push(n);
      }
    }
    if (car.image) {
      const primary = normalizeImage(car.image);
      if (primary && images.indexOf(primary) === -1) images.unshift(primary);
    }
  } catch {
    /* ignore */
  }

  const vehicleJson: any = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${make} ${model}`.trim() || null,
    description: car.description ? String(car.description).slice(0, 300) : null,
    brand: make ? { '@type': 'Brand', name: make } : null,
    image: images.length ? images : null,
    url: `${siteOrigin}/cars/${car.slug || car.id}`,
    sku: car.id != null ? String(car.id) : null,
    mileageFromOdometer: mileageNum != null ? mileageNum : null,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: priceNum != null ? priceNum : null,
      availability: car.sold ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: `${siteOrigin}/cars/${car.slug || car.id}`,
    },
  };

  return {
    props: {
      ...(await serverSideTranslations(locale || "pt-PT", ["common"])),
      // minimal props: id for client use, plus SEO metadata and vehicle JSON-LD computed server-side
      carId: car.id,
      detailKeywords,
      vehicleJson,
    },
  };
}

function numify(v: any): number | null {
  return parseNumber(v);
}

function fmtNumber(v: any, opts?: Intl.NumberFormatOptions) {
  const n = numify(v);
  if (n == null) return String(v ?? '—');
  return n.toLocaleString(undefined, opts);
}

import { formatPriceDisplay } from '../../utils/formatPrice';

function fmtPriceOrText(v: any) {
  // reuse normalized numify + shared formatter so behaviour matches listing cards
  const n = numify(v);
  // try to pick up priceDisplay from the car object at callsites by falling back to v when it's a string
  const display = formatPriceDisplay(n, typeof v === 'string' ? v : undefined);
  // formatPriceDisplay returns '—' for unknown; the older behaviour used 'Sob Consulta' for nulls
  if ((v == null || (typeof v === 'string' && String(v).trim() === '')) && display === '—') return 'Sob Consulta';
  return display;
}

function fmtNumberForMeta(v: any) {
  const n = numify(v);
  if (n == null) return 'sob consulta';
  return n.toLocaleString(undefined, { minimumFractionDigits: 0 });
}

type Props = {
  detailKeywords: string;
  vehicleJson: any;
};

export default function CarDetail({ detailKeywords, vehicleJson }: Props) {
  const router = useRouter();
  const { slug } = router.query;

  // Always call hooks unconditionally
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  // watermark portal positioning is handled directly via DOM; no React state required
  // (removed unused watermarkStyle to satisfy lint)

  // Robust watermark: append into the lightbox/dialog container when present so the watermark
  // shares the same stacking context and can sit above the image. Fallback to body (fixed) if
  // no container is found. Uses RAF + resize/scroll listeners and measures the watermark after
  // it's appended so we can align bottom-right to the visible lightbox image.
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const padX = 8; // px gap from image edge
    const padY = 8;

    const visibleArea = (r: DOMRect) => {
      const left = Math.max(0, r.left);
      const top = Math.max(0, r.top);
      const right = Math.min(window.innerWidth, r.right);
      const bottom = Math.min(window.innerHeight, r.bottom);
      const w = Math.max(0, right - left);
      const h = Math.max(0, bottom - top);
      return w * h;
    };
    const isElementVisible = (el: Element) => {
      try {
        const style = getComputedStyle(el as Element);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
      } catch {
        /* ignore */
      }
      const rect = (el as HTMLElement).getBoundingClientRect();
      if (rect.width <= 8 || rect.height <= 8) return false;
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return false;
      if (rect.right <= 0 || rect.left >= window.innerWidth) return false;
      return true;
    };

    const getLightboxImage = (): HTMLImageElement | null => {
      const prioritySelectors = [
        'div[role="dialog"] img',
        '.yarl__slide img',
        '.yarl__container img',
        '.yet-another-react-lightbox img',
        '.lightbox img',
        '.ReactModal__Content img'
      ];
      for (const sel of prioritySelectors) {
        const found = Array.from(document.querySelectorAll(sel)).filter(isElementVisible) as HTMLImageElement[];
        if (found.length > 0) {
          found.sort((a, b) => visibleArea(b.getBoundingClientRect()) - visibleArea(a.getBoundingClientRect()));
          return found[0];
        }
      }
      // fallback: choose the largest visible img near viewport center
      const imgs = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];
      let best: HTMLImageElement | null = null;
      let bestScore = -Infinity;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      for (const img of imgs) {
        if (!isElementVisible(img)) continue;
        const r = img.getBoundingClientRect();
        const area = visibleArea(r);
        if (area <= 0) continue;
        const dist = Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy);
        const score = area - dist * 20;
        if (score > bestScore) {
          bestScore = score;
          best = img;
        }
      }
      return best;
    };

    const findContainer = (): HTMLElement | null => {
      const selectors = ['div[role="dialog"]', '.yarl__container', '.ReactModal__Content', '.yet-another-react-lightbox', '.lightbox', '.yarl__portal'];
      for (const s of selectors) {
        const el = document.querySelector(s);
        if (el && el instanceof HTMLElement) return el as HTMLElement;
      }
      return null;
    };

    let watermarkEl: HTMLImageElement | null = document.getElementById('autogo-watermark-portal') as HTMLImageElement | null;
    let appendedToContainer: HTMLElement | null = null;
    let containerPositionPatched = false;
    let rafId: number | null = null;
    let mo: MutationObserver | null = null;

    const createWatermark = () => {
      if (watermarkEl) return watermarkEl;
      const img = document.createElement('img');
      img.id = 'autogo-watermark-portal';
      img.src = '/images/autologonb.png';
      img.alt = 'AutoGo watermark';
      img.style.pointerEvents = 'none';
      img.style.opacity = '0.40';
      img.style.zIndex = '2147483647';
      img.style.display = 'block';
      img.style.userSelect = 'none';
      img.style.margin = '0';
      img.style.padding = '0';
      img.style.boxSizing = 'border-box';
      img.style.objectFit = 'contain';
      img.style.transform = 'none';
      img.style.transformOrigin = '100% 100%';
      img.style.willChange = 'transform, left, top, right, bottom';
      img.style.maxWidth = isMobileView ? '34vw' : '18vw';
      img.style.maxHeight = isMobileView ? '18vh' : '12vh';
      watermarkEl = img;
      return img;
    };

    const removeWatermark = () => {
      if (watermarkEl && watermarkEl.parentNode) watermarkEl.parentNode.removeChild(watermarkEl);
      watermarkEl = null;
      if (containerPositionPatched && appendedToContainer) {
        try { appendedToContainer.style.position = ''; } catch { /* ignore */ }
        containerPositionPatched = false;
      }
      appendedToContainer = null;
    };

    const positionWatermark = () => {
      if (!lightboxOpen) { removeWatermark(); return; }
      const targetImg = getLightboxImage();
      const el = createWatermark();

      // Try to attach to the lightbox container so the watermark shares stacking context.
      const container = findContainer();
      if (container) {
        // If container is not positioned, patch it temporarily to allow absolute placement.
        const computed = getComputedStyle(container).position;
        if (computed === 'static') {
          try { container.style.position = 'relative'; containerPositionPatched = true; } catch { /* ignore */ }
        }
        appendedToContainer = container;
        if (el.parentNode !== container) container.appendChild(el);
        el.style.position = 'absolute';
      } else {
        // fallback: attach to body and use fixed positioning
        appendedToContainer = null;
        if (el.parentNode !== document.body) document.body.appendChild(el);
        el.style.position = 'fixed';
      }

      // if no image found, anchor to bottom-right of container/viewport
      if (!targetImg) {
        if (appendedToContainer) {
          el.style.right = `${padX}px`;
          el.style.bottom = `${padY}px`;
          el.style.left = '';
          el.style.top = '';
        } else {
          el.style.right = isMobileView ? '12px' : '40px';
          el.style.bottom = isMobileView ? '80px' : '48px';
          el.style.left = '';
          el.style.top = '';
        }
        return;
      }

      const imgRect = targetImg.getBoundingClientRect();
      // intentionally not reading watermark rect (kept for future use)

      if (appendedToContainer) {
        const containerRect = appendedToContainer.getBoundingClientRect();
        // compute right/bottom relative to container box in pixels
        const rightPx = Math.max(0, Math.round(containerRect.right - imgRect.right + padX));
        const bottomPx = Math.max(0, Math.round(containerRect.bottom - imgRect.bottom + padY));
        el.style.right = `${rightPx}px`;
        el.style.bottom = `${bottomPx}px`;
        el.style.left = '';
        el.style.top = '';
      } else {
        // fixed relative to viewport
        const rightPx = Math.max(0, Math.round(window.innerWidth - imgRect.right + padX));
        const bottomPx = Math.max(0, Math.round(window.innerHeight - imgRect.bottom + padY));
        el.style.right = `${rightPx}px`;
        el.style.bottom = `${bottomPx}px`;
        el.style.left = '';
        el.style.top = '';
      }
    };

    const rafTick = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        try { positionWatermark(); } catch { /* swallow */ }
        rafId = null;
      });
    };

    // Observe DOM changes to detect when the lightbox container appears/disappears
    mo = new MutationObserver(() => rafTick());
    mo.observe(document.body, { childList: true, subtree: true });

    // initial run
    rafTick();

    // update on resize/scroll
    window.addEventListener('resize', rafTick);
    window.addEventListener('scroll', rafTick, true);

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', rafTick);
      window.removeEventListener('scroll', rafTick, true);
      if (mo) { mo.disconnect(); mo = null; }
      removeWatermark();
    };
  }, [lightboxOpen, lightboxIndex, isMobileView]);

  useEffect(() => {
    const check = () => {
      if (typeof window === 'undefined') return setIsMobileView(false);
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Treat small widths as mobile portrait. Also treat narrow landscape (common on phones) as mobile stack view.
      const isNarrowLandscape = w < 1024 && w > h; // width greater than height but still narrow overall
      setIsMobileView(w < 768 || isNarrowLandscape);
    };
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  const slidesToShow = isMobileView ? 1 : 3;
  const [similarExpanded, setSimilarExpanded] = useState(false);
  const similarRef = useRef<HTMLDivElement | null>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setShowStickyBar(rect.top < 56);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // If slug (or id) is not available yet, do not return early here (we rely on the carId prop
  // provided by getStaticProps as a stable fallback) so React hooks remain in the same order
  // across renders; this prevents conditional hook invocation during client-side navigation.

  // Allow accessing car by numeric id or by human-friendly slug (case-insensitive)
  const requested = String(slug).toLowerCase();
  // We assert non-null here with `!` to satisfy TypeScript - there's an
  // immediate runtime guard below that returns a 404 when `car` is missing,
  // so this assertion is safe and prevents many 'possibly undefined' warnings
  // in the JSX and event handlers.
  const car = (carsData as Car[]).find((c) => String(c.id) === requested || (c.slug && c.slug.toLowerCase() === requested))!;

  // Client-side image normalization (mirror server-side logic but safe for client runtime)
  const siteOriginClient = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://autogo.pt';
  const normalizeImageClient = useCallback((img: any): string | null => {
    if (!img) return null;
    if (typeof img !== 'string') return null;
    if (img.startsWith('data:')) return img;
    if (/^https?:\/\//i.test(img)) return img;
    if (img.startsWith('//')) return `https:${img}`;
    if (img.startsWith('/')) return `${siteOriginClient}${img}`;
    return `${siteOriginClient}/${img.replace(/^\/+/, '')}`;
  }, [siteOriginClient]);

  // Derive displayed images from server-side vehicleJson when available to avoid missing resources
  const displayedImages: string[] = React.useMemo(() => {
    try {
      if (Array.isArray(vehicleJson?.image) && vehicleJson.image.length) {
        return vehicleJson.image.map((s: any) => normalizeImageClient(s)).filter(Boolean) as string[];
      }
      if (vehicleJson?.image) {
        const v = normalizeImageClient(vehicleJson.image);
        return v ? [v] : [];
      }
      // fallback to raw car fields when vehicleJson not present
      const rawImgs: string[] = [];
      if (car?.image) rawImgs.push(car.image);
      if (car?.images && Array.isArray(car.images)) rawImgs.push(...car.images);
      return rawImgs.map(normalizeImageClient).filter(Boolean) as string[];
    } catch {
      return [];
    }
  }, [vehicleJson, car?.image, car?.images, normalizeImageClient]);

  const primaryImage = displayedImages.length ? displayedImages[0] : null;

  // Fun facts dinâmicos (include full model + description when available, de-duplicated)
  const fullModelLabel = [car.make, car.model, car.version].filter(Boolean).join(' ');
  const funFacts = [
    fullModelLabel ? `Modelo: ${fullModelLabel}` : null,
    car.description && car.description !== fullModelLabel ? car.description : null,
    car?.engineSize && car.engineSize.includes("1.2") && "Motor premiado pela eficiência na Europa.",
    car?.fuel && car.fuel === "Gasolina" && "ISV reduzido devido às baixas emissões.",
  ].filter(Boolean);
  // Compute similar cars deterministically without using React hooks.
  // Placed before the early return so hook call order remains stable.
  function computeSimilarCars(target: Car | null, pool: Car[], maxResults = 8): Car[] {
    if (!target) return [];
    const parseNum = (v?: any) => {
      if (v == null) return NaN;
      // remove common non-digit characters then parse
      const s = String(v).replace(/[,\.\s]/g, '').replace(/[^\d]/g, '');
      const n = Number(s);
      return Number.isFinite(n) ? n : NaN;
    };

    const tPower = parseNum(target.power);
    const tEngine = parseNum(target.engineSize);

    return pool
      .filter((c) => String(c.id) !== String(target.id))
      .map((c) => {
        let score = 0;
        if (c.make && target.make && c.make === target.make) score += 100;
        if (c.fuel && target.fuel && c.fuel === target.fuel) score += 40;
        const p = parseNum(c.power);
        if (!Number.isNaN(p) && !Number.isNaN(tPower)) {
          const diff = Math.abs(p - tPower);
          score += Math.max(0, 30 - Math.min(diff, 30));
        }
        const e = parseNum(c.engineSize);
        if (!Number.isNaN(e) && !Number.isNaN(tEngine)) {
          const diff = Math.abs(e - tEngine);
          score += Math.max(0, 20 - Math.min(diff, 20));
        }
        return { c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map((s) => s.c);
  }

  if (!car) {
    return (
      <Layout>
        <div className="p-8">Car not found.</div>
      </Layout>
    );
  }

  // Find similar cars (show all except current)
  const similarCars = computeSimilarCars(car, carsData as Car[]);

  // meta keywords are computed server-side and passed via props (detailKeywords)
  // (previous client-side computation removed to avoid duplication)

  // Download PDF handler
  async function handleDownloadPDF() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    // Utility: fetch with timeout
    const fetchWithTimeout = async (input: RequestInfo, ms = 10000): Promise<Response | null> => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), ms);
      try {
        const resp = await fetch(input, { signal: controller.signal as any });
        return resp;
      } catch {
        return null;
      } finally {
        clearTimeout(id);
      }
    };

    // Load image and convert to data URL with fallbacks. Fast-paths return quickly.
    const loadImageAsBase64 = async (url: string): Promise<string | null> => {
      if (!url) return null;
      if (typeof url === 'string' && url.startsWith('data:')) return url;

      try {
        const resp = await fetchWithTimeout(url, 10000);
        if (!resp || !resp.ok) throw new Error('fetch-failed');
        const blob = await resp.blob();

        // SVG: convert to PNG via canvas (kept simple)
        if (blob.type === 'image/svg+xml') {
          const svgText = await blob.text();
          return await new Promise<string | null>((resolve) => {
            const img = new Image();
            img.onload = () => {
              try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth || 1200;
                canvas.height = img.naturalHeight || 800;
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(null);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/png'));
              } catch {
                resolve(null);
              }
            };
            img.onerror = () => resolve(null);
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
          });
        }

        // If common formats, read directly
        if (['image/png', 'image/jpeg'].includes(blob.type)) {
          const base64 = await new Promise<string | null>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          });
          if (base64) return base64;
        }

        // For other types (webp, etc) convert via an Image + canvas
        try {
          const objectUrl = URL.createObjectURL(blob);
          const converted = await new Promise<string | null>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            let settled = false;
            const cleanup = () => {
              img.onload = null;
              img.onerror = null as any;
              try { URL.revokeObjectURL(objectUrl); } catch { /* ignore */ }
            };
            img.onload = () => {
              try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth || img.width || 800;
                canvas.height = img.naturalHeight || img.height || 600;
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(null);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                settled = true;
                cleanup();
                resolve(canvas.toDataURL('image/png'));
              } catch {
                cleanup();
                resolve(null);
              }
            };
            img.onerror = () => {
              cleanup();
              if (!settled) resolve(null);
            };
            img.src = objectUrl;
          });
          if (converted) return converted;
        } catch {
          // fallthrough
        }

        // final fallback: read as data URL
        const finalBase64 = await new Promise<string | null>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
        return finalBase64;
      } catch {
        // Last ditch: try loading via Image element (may fail due to CORS)
        return await new Promise<string | null>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          let settled = false;
          const to = setTimeout(() => {
            img.onload = null;
            img.onerror = null;
            if (!settled) resolve(null);
          }, 9000);
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth || img.width || 800;
              canvas.height = img.naturalHeight || img.height || 600;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                clearTimeout(to);
                return resolve(null);
              }
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/png');
              settled = true;
              clearTimeout(to);
              resolve(dataUrl);
            } catch {
              clearTimeout(to);
              resolve(null);
            }
          };
          img.onerror = () => {
            clearTimeout(to);
            if (!settled) resolve(null);
          };
          try {
            img.src = url;
          } catch {
            clearTimeout(to);
            resolve(null);
          }
        });
      }
    };

    // Non-blocking font load (do not delay PDF creation)
    (async () => {
      try {
        const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/Montserrat-Regular.ttf';
        const resp = await fetchWithTimeout(fontUrl, 5000);
        if (resp && resp.ok) {
          const fontBuf = await resp.arrayBuffer();
          const bytes = new Uint8Array(fontBuf);
          let binary = '';
          const chunkSize = 0x8000;
          for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)) as any);
          }
          const fontBase64 = btoa(binary);
          try {
            doc.addFileToVFS('Montserrat-Regular.ttf', fontBase64);
            doc.addFont('Montserrat-Regular.ttf', 'Montserrat', 'normal');
          } catch {
            /* ignore font errors */
          }
        }
      } catch {
        /* ignore */
      }
    })();

    // Place site logo top-right (use autologonb.png from public)
    const logoUrl = '/images/autologonb.png';
    const logoBase64 = await loadImageAsBase64(logoUrl);
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 40;
    const logoW = 90;
    const logoH = 45;
    const logoX = pageW - margin - logoW;
    const logoY = 32;
    if (logoBase64) {
      const logoFormat = logoBase64.startsWith('data:image/png') ? 'PNG' : logoBase64.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
      try {
        doc.addImage(logoBase64, logoFormat as any, logoX, logoY, logoW, logoH);
      } catch {
        // ignore
      }
    } else {
      doc.setFontSize(18);
      doc.setTextColor(30, 41, 59);
      doc.text('AutoGo.pt', logoX, logoY + 20);
    }

    // Prepare gallery images: include main `image` and any `images` array
    const gallerySrcs: string[] = [];
    if (car.image) gallerySrcs.push(car.image);
    if (car.images && Array.isArray(car.images)) {
      for (const s of car.images) if (s) gallerySrcs.push(s);
    }
    // dedupe and limit to 4 images for speed
    const uniqueGallery = Array.from(new Set(gallerySrcs)).slice(0, 4);

    // Prefetch base64s in parallel (small number, safe to run concurrently)
    const galleryBase64s = await Promise.all(uniqueGallery.map((s) => loadImageAsBase64(s).catch(() => null)));

    // helper to add images stacked vertically, centered (3 images per page originally)
    const addGalleryPages = async (base64s: (string | null)[]) => {
      if (!base64s || base64s.length === 0) return;
      const perPage = 3;
      const gap = 18;
      const usableW = pageW - margin * 2;
      const pageH = doc.internal.pageSize.getHeight();
      const maxImgH = (pageH - margin * 2 - gap * (perPage - 1)) / perPage;

      for (let i = 0; i < base64s.length; i += perPage) {
        doc.addPage();
        let yPos = margin;
        for (let k = 0; k < perPage; k++) {
          const idx = i + k;
          if (idx >= base64s.length) break;
          const base64 = base64s[idx];
          if (!base64) {
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text('(Imagem indisponível)', pageW / 2 - 40, yPos + maxImgH / 2);
            yPos += maxImgH + gap;
            continue;
          }

          // Measure actual image size by creating an Image element
          const dims = await new Promise<{ w: number; h: number }>((resolve) => {
            const img = new Image();
            img.onload = () => {
              resolve({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
            };
            img.onerror = () => resolve({ w: usableW, h: maxImgH });
            img.src = base64;
          });

          const ratio = Math.min(usableW / dims.w, maxImgH / dims.h, 1);
          const drawW = dims.w * ratio;
          const drawH = dims.h * ratio;
          const x = (pageW - drawW) / 2;
          const yCenter = yPos + (maxImgH - drawH) / 2;

          try {
            const format = base64.startsWith('data:image/png') ? 'PNG' : base64.startsWith('data:image/jpeg') ? 'JPEG' : 'JPEG';
            doc.addImage(base64, format as any, x, yCenter, drawW, drawH);
          } catch {
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text('(Imagem indisponível)', pageW / 2 - 40, yPos + maxImgH / 2);
          }

          yPos += maxImgH + gap;
        }
      }
    };

    // Title and info (same as before)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(180, 33, 33);
    doc.text(`${car.make} ${car.model} (${car.year})`, 40, 100);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text(`Preço: ${fmtPriceOrText(car.price)}`, 40, 125);
    doc.text(`Quilometragem: ${fmtNumber(car.mileage, { minimumFractionDigits: 0 })} km`, 40, 145);
    let y = 165;
    if (car.fuel) { doc.text(`Combustível: ${car.fuel}`, 40, y); y += 20; }
    if (car.power) { doc.text(`Potência: ${car.power}`, 40, y); y += 20; }
    if (car.engineSize) { doc.text(`Cilindrada: ${car.engineSize}`, 40, y); y += 20; }
    if (car.firstRegistration) { doc.text(`Primeira Matrícula: ${car.firstRegistration}`, 40, y); y += 20; }
    y += 10;
    // Descrição
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text("Descrição", 40, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(55, 65, 81);
    const descLines = doc.splitTextToSize(car.description, 480);
    doc.text(descLines, 40, y);
    y += descLines.length * 16 + 10;

    // Equipamento & Opções (unchanged)
    if (car.equipamento_opcoes) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(180, 33, 33);
      doc.text("Equipamento & Opções", 40, y);
      y += 18;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(55, 65, 81);
      for (const [categoria, lista] of Object.entries(car.equipamento_opcoes)) {
        if (y > 700) { doc.addPage(); y = 60; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(30, 41, 59);
        doc.text(
          categoria
            .replace(/_/g, " ")
            .replace("opcoes", "opções")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          50,
          y,
        );
        y += 15;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(55, 65, 81);
        for (const item of lista) {
          if (y > 780) { doc.addPage(); y = 60; }
          doc.circle(56, y - 3, 2, "F");
          doc.text(item, 65, y);
          y += 15;
        }
        y += 8;
      }
    }

    // Contactos section (unchanged)
    if (y > 700) { doc.addPage(); y = 60; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(180, 33, 33);
    doc.text("Contactos", 40, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(55, 65, 81);
    doc.text("Contacto: Gilberto Freitas", 40, y); y += 16;
    doc.text("Email: autogo.stand@gmail.com", 40, y); y += 16;
    doc.text("Tel: +351 935 179 591", 40, y); y += 16;
    doc.text("WhatsApp: +351 935 179 591", 40, y); y += 18;

    // Insert gallery images (limited set)
    if (galleryBase64s.length > 0) {
      try {
        await addGalleryPages(galleryBase64s);
      } catch (err) {
        console.warn('Failed adding gallery pages', err);
      }
    }

    doc.save(`${car.make}_${car.model}_${car.year}.pdf`);
  }

  // Sticky bar visually merges with navbar, seamless, premium animation
  return (
    <Layout>
      <Head>
        {primaryImage && <link rel="preload" as="image" href={primaryImage} />}
      </Head>
      {/* Premium red underline accent fixed below navbar, expands on scroll and can go edge to edge */}
      <div
        id="hero-redline"
        className="fixed top-[64px] left-0 w-full z-40 pointer-events-none"
        style={{ height: "0" }}
      />
      { /* Inject blur overlay styles only when the lightbox is open */}
      {lightboxOpen && (
        <style jsx global>{`
          /* Make common lightbox/dialog overlays translucent and blur the page behind them */
          /* Targets Yet Another React Lightbox, ReactModal and generic dialog overlays */
          .yarl__container,
          .yarl__portal,
          .yarl__backdrop,
          [role="dialog"],
          .ReactModal__Overlay {
            background: rgba(0,0,0,0.36) !important;
            backdrop-filter: blur(8px) saturate(105%) !important;
            -webkit-backdrop-filter: blur(8px) saturate(105%) !important;
          }

          /* Ensure the lightbox inner content (image, slides, controls) remain sharp */
          .yarl__container > *,
          .yarl__portal > *,
          [role="dialog"] > *,
          .ReactModal__Overlay > * {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          /* Slightly lift the overlay's opacity on mobile to keep contrast */
          @media (max-width: 768px) {
            .yarl__container,
            .yarl__portal,
            .ReactModal__Overlay {
              background: rgba(0,0,0,0.44) !important;
            }
          }
        `}</style>
      )}
      <script
        dangerouslySetInnerHTML={{
          __html: `
  (function(){
    function lerp(a, b, t) { return a + (b - a) * t; }
    function clamp(x, min, max) { return Math.max(min, Math.min(max, x)); }
    function onScroll() {
    var el = document.getElementById('hero-redline-span');
    var bar = document.getElementById('hero-redline-bar');
    var footer = document.querySelector('footer');
    if (!el || !bar || !footer) return;
    var scrollY = window.scrollY;
    var footerTop = footer.getBoundingClientRect().top + window.scrollY;
    var maxScroll = Math.max(footerTop - window.innerHeight, 1); // progress=1 when bottom of viewport reaches footer
    var progress = clamp(scrollY / maxScroll, 0, 1);
    var minW = 16 * 16; // 16rem
    var maxW = window.innerWidth; // allow edge-to-edge
    var newW = lerp(minW, maxW, progress);
    el.style.width = newW + 'px';
    // Fade out as we approach the footer
    var fadeStart = 0.98;
    var fadeProgress = clamp((progress - fadeStart) / (1 - fadeStart), 0, 1);
    el.style.opacity = 0.9 - 0.6 * fadeProgress;
    el.style.marginLeft = el.style.marginRight = 'auto';
    }
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    setTimeout(onScroll, 100);
  })();
  `,
        }}
      />
      {/* Main navbar stays at the very top, sticky bar is always below */}
      {/* Sticky bar: only car info, never navigation */}
      <div
        className={`fixed left-0 w-full z-40 hidden lg:flex items-center bg-white/80 backdrop-blur-xl transition-all duration-500 px-4 overflow-hidden
        ${showStickyBar ? "h-[120px] py-4" : "h-[60px] py-0"}
        shadow-xl border-b border-[#b42121]/20`}
        style={{
          top: 56,
          boxShadow: "0 2px 12px 0 rgba(180,33,33,0.08)",
        }}
      >
        {/* Car image: scales up with bar, stays contained */}
        <div
          className={`transition-all duration-500 flex items-center
        ${showStickyBar ? "opacity-100 translate-x-0 w-32 mr-6" : "opacity-80 -translate-x-4 w-16 mr-2"}
      `}
        >
          <img
            src={displayedImages[0] || '/images/auto-logo.png'}
            alt={car.make + " " + car.model}
            width={160}
            height={96}
            className={`object-cover rounded-xl shadow border-2 border-white bg-gray-100 ring-2 ring-[#b42121]/30 transition-all duration-500
            ${showStickyBar ? "h-24 w-40 scale-[1.03]" : "h-10 w-20 scale-100"}`}
            style={{ objectPosition: 'center top' }}
          />
        </div>
        <div
          className={`flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-6 transition-all duration-500
        ${showStickyBar ? "text-2xl" : "text-base"}`}
          style={{
            fontSize: showStickyBar ? "2rem" : "1rem",
            lineHeight: showStickyBar ? "2.5rem" : "1.25rem",
          }}
        >
          <span
            className={`font-bold text-[#b42121] drop-shadow-sm transition-all duration-500 ${showStickyBar ? "text-3xl" : "text-lg"}`}
          >
            {car.make} {car.model} {" "}
            <span
              className={`text-gray-700 font-normal transition-all duration-500 ${showStickyBar ? "text-2xl" : "text-base"}`}
            >
              {car.year}
            </span>
          </span>
          <span
            className={`text-blue-700 font-bold drop-shadow transition-all duration-500 ${showStickyBar ? "text-2xl" : "text-base"}`}
          >
            {fmtPriceOrText(car.price)}
          </span>
          <span
            className={`text-gray-600 flex items-center gap-2 transition-all duration-500 ${showStickyBar ? "text-xl" : "text-sm"}`}
          >
            <FaTachometerAlt className="text-[#b42121]" /> {fmtNumber(car.mileage, { minimumFractionDigits: 0 })} km
          </span>
          {car.fuel && (
            <span
              className={`text-gray-600 flex items-center gap-2 transition-all duration-500 ${showStickyBar ? "text-xl" : "text-sm"}`}
            >
              <FaGasPump className="text-[#b42121]" /> {car.fuel}
            </span>
          )}
          {car.power && (
            <span className="bg-gray-100 rounded-2xl px-3 py-2 font-medium shadow-sm flex items-center gap-2 w-full sm:w-auto">
              <FaBolt className="text-[#b42121]" />
              <span>{car.power}</span>
            </span>
          )}
          {car.engineSize && (
            <span
              className={`text-gray-600 flex items-center gap-2 transition-all duration-500 ${showStickyBar ? "text-xl" : "text-sm"}`}
            >
              <FaRoad className="text-[#b42121]" /> {car.engineSize}
            </span>
          )}
          {car.firstRegistration && (
            <span
              className={`text-gray-600 flex items-center gap-2 transition-all duration-500 ${showStickyBar ? "text-xl" : "text-sm"}`}
            >
              <FaRegCalendarCheck className="text-[#b42121]" /> {car.firstRegistration}
            </span>
          )}
        </div>
        {/* Action buttons aligned right */}
        <div className="flex gap-3 ml-auto">
          {/* Action buttons placeholder */}
        </div>
      </div>
      {/* Main content: dynamic padding to match sticky+navbar height */}
      <div
        className={`min-h-screen bg-[#f5f6fa] transition-all duration-500 pt-20 sm:pt-20 lg:pt-[116px] overflow-x-hidden`}
        style={{ transition: "padding-top 0.5s cubic-bezier(.4,0,.2,1)" }}
      >
        <main className="w-full px-0 py-0 space-y-12 overflow-x-hidden">
          {/* HERO */}
          <section
            ref={heroRef}
            className="w-full flex flex-col lg:flex-row gap-8 items-start px-4 lg:px-12 xl:px-24 pt-10"
          >
            {/* Hero Image + Gallery */}
            <div className="flex-1 relative flex flex-col items-center">
              {/* Mobile-only title above image */}
              <div className="w-full px-2 sm:px-0 block lg:hidden mb-3">
                <h2 className="text-2xl sm:text-xl font-semibold tracking-tight text-gray-900 whitespace-normal break-words leading-tight">
                  {car.make} {car.model} <span className="text-[#b42121]">{car.year}</span>
                </h2>
              </div>
              {/* Main image (first image) */}
              <img
                src={displayedImages[0] || '/images/giulia-2024.jpg'}
                alt={car.make + " " + car.model}
                width={1200}
                height={720}
                className="rounded-3xl shadow-2xl w-full object-cover ring-4 ring-white hover:ring-[#b42121] transition-all duration-300 cursor-zoom-in max-h-[180px] sm:max-h-[220px] md:max-h-[420px] lg:max-h-[480px] photo-hoverable main-photo"
                onClick={() => {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
                style={{ objectPosition: 'center top' }}
              />

              {/* Lightbox */}
              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={(displayedImages.length ? displayedImages : ["/images/giulia-2024.jpg"]).map((img) => ({
                  src: img,
                }))}
                index={lightboxIndex}
                plugins={[Zoom]}
                zoom={{ maxZoomPixelRatio: 3 }}
              />
            </div>
            {/* Detalhes principais */}
            <div className="flex-1 space-y-6 px-0 lg:px-8 xl:px-16 mt-6 lg:mt-0">
              {/* Hide the main H1 on small screens since we show a mobile title above the image */}
              <h1 className="hidden lg:block text-2xl sm:text-4xl md:text-5xl font-semibold mb-3 sm:mb-4 tracking-tight text-gray-900 drop-shadow-sm whitespace-normal break-words leading-tight">
                {car.make} {car.model} {" "}
                <span className="text-[#b42121]">{car.year}</span>
              </h1>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 text-sm sm:text-base mb-4">
                {/* Make logo replaces the year pill: no background, subtle drop shadow for a slick look */}
                <div className="flex items-center w-full sm:w-auto">
                  {/* size tuned to match previous visual weight of the year; change size prop if you prefer larger/smaller */}
                  <MakeLogo make={car.make} size={28} className="drop-shadow-md" />

                  {/* Mobile-only flag: placed next to MakeLogo, same style as desktop rectangular flag; hidden on lg to avoid duplicate with overlay */}
                  {car.country && (
                    <img
                      src={`/images/flags/${String((car as any).country ?? "").toLowerCase()}.png`}
                      alt={car.country}
                      title={car.country}
                      className="ml-3 lg:hidden inline-block"
                      style={{
                        width: 32,
                        height: 22,
                        borderRadius: '0.2rem',
                        border: '1.5px solid #fff',
                        boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
                        background: '#fff',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                </div>
                <span className="bg-gray-100 rounded-2xl px-3 py-2 font-medium shadow-sm flex items-center gap-2 text-sm w-full sm:w-auto">
                  <FaTachometerAlt className="text-[#b42121]" /> {fmtNumber(car.mileage, { minimumFractionDigits: 0 })} km
                </span>
                {car.engineSize && (
                  <span className="bg-gray-100 rounded-2xl px-3 py-2 font-medium shadow-sm flex items-center gap-2 w-full sm:w-auto">
                    <FaRoad className="text-[#b42121]" /> {car.engineSize}
                  </span>
                )}
                {car.fuel && (
                  <span className="bg-gray-100 rounded-2xl px-3 py-2 font-medium shadow-sm flex items-center gap-2 w-full sm:w-auto">
                    <FaGasPump className="text-[#b42121]" /> {car.fuel}
                  </span>
                )}
                {car.gearboxType && (
                  <span className="bg-gray-100 rounded-2xl px-3 py-2 font-medium shadow-sm flex items-center gap-2 w-full sm:w-auto">
                    <FaCogs className="text-[#b42121]" /> {car.gearboxType}
                  </span>
                )}
                {car.power && (
                  <span className="bg-gray-100 rounded-2xl px-3 py-2 font-medium shadow-sm flex items-center gap-2 w-full sm:w-auto">
                    <FaBolt className="text-[#b42121]" />
                    <span>{car.power}</span>
                  </span>
                )}
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black drop-shadow-md ml-2">
                {fmtPriceOrText(car.price)}
              </div>
              {/* Botão ver mais detalhes */}
              <button
                className="flex items-center justify-center sm:justify-start gap-2 mt-2 mb-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-2xl shadow font-semibold text-gray-700 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
                onClick={() => setShowMore((v) => !v)}
                aria-expanded={showMore}
              >
                <span>Ver mais detalhes</span>
                {showMore ? (
                  <FaChevronUp className="text-[#b42121]" />
                ) : (
                  <FaChevronDown className="text-[#b42121]" />
                )}
              </button>

              {/* Detalhes extra, animados */}
              <div
                className={`overflow-hidden transition-all duration-500 ${showMore ? "max-h-96 opacity-100 mb-2 bg-[#f5f6fa] px-6 py-4 rounded-2xl" : "max-h-0 opacity-0 mb-0"}`}
                style={{ willChange: "max-height, opacity" }}
              >
                <ul className="space-y-3 py-2">
                  {car.category && (
                    <li className="flex items-center gap-2 text-gray-700 text-lg">
                      <FaCarSide className="text-[#b42121]" /> <strong>Categoria:</strong> {car.category}
                    </li>
                  )}
                  {car.gearbox && (
                    <li className="flex items-center gap-2 text-gray-700 text-lg">
                      <FaLayerGroup className="text-[#b42121]" /> <strong>Caixa de Velocidades:</strong> {car.gearbox}
                    </li>
                  )}
                  {car.origin && (
                    <li className="flex items-center gap-2 text-gray-700 text-lg">
                      <FaGlobeEurope className="text-[#b42121]" /> <strong>País de Origem:</strong> {car.origin}
                    </li>
                  )}
                  {car.vin && (
                    <li className="flex items-center gap-2 text-gray-700 text-lg">
                      <FaBarcode className="text-[#b42121]" /> <strong>VIN:</strong> <span className="break-all">{car.vin}</span>
                    </li>
                  )}
                  {car.firstRegistration && (
                    <li className="flex items-center gap-2 text-gray-700 text-lg">
                      <FaRegCalendarCheck className="text-[#b42121]" /> <strong>Data da Primeira Matrícula:</strong> {car.firstRegistration}
                    </li>
                  )}
                  {car.emissionClass && (
                    <li className="flex items-center gap-2 text-gray-700 text-lg">
                      <FaLayerGroup className="text-[#b42121]" /> <strong>Classe de Emissões:</strong> {car.emissionClass}
                    </li>
                  )}
                </ul>
              </div>
              {/* Botões de ação - minimalist, side by side, no vibrant colors */}
              {/* Actions: responsive grid on mobile so 2/3 buttons fit per row, row on lg */}
              <div className="w-full flex justify-center">
                <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-3 mt-4 sm:mt-4 items-stretch">
                  <button
                    className="flex items-center justify-center w-full sm:w-auto gap-2 border border-gray-300 bg-white text-gray-700 font-semibold py-2 px-2 rounded-2xl shadow-sm hover:bg-gray-100 transition-all duration-200 text-sm"
                    onClick={async () => {
                      if (isSharing) return;
                      setIsSharing(true);
                      try {
                        if (navigator.share) {
                          await navigator.share({
                            title: `${car.make} ${car.model} (${car.year}) em AutoGo.pt`,
                            text: `Vê este carro: ${car.make} ${car.model} (${car.year})`,
                            url: window.location.href,
                          });
                        } else {
                          await navigator.clipboard.writeText(
                            window.location.href,
                          );
                          alert("Link copiado para a área de transferência!");
                        }
                      } catch {
                        // Optionally handle error
                      }
                      setIsSharing(false);
                    }}
                    aria-label="Partilhar esta viatura"
                    disabled={isSharing}
                  >
                    <img src="/images/icons/share_logo.png" alt="Partilhar" className="w-4 h-4" />
                    <span className="ml-1 text-sm">Partilhar</span>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center w-full sm:w-auto gap-2 border border-gray-300 bg-white text-gray-700 font-semibold py-2 px-2 rounded-2xl shadow-sm hover:bg-gray-100 transition-all duration-200 text-sm"
                  >
                    <img src="/images/icons/pdf_logo.png" alt="Download PDF" className="w-4 h-4" />
                    <span className="ml-1 text-sm">PDF</span>
                  </button>
                  <div className="mt-2 sm:mt-0 sm:ml-3 flex-shrink-0">
                    <button
                      className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 py-2 bg-[#b42121] hover:bg-[#a11a1a] text-white rounded-2xl shadow font-semibold transition-all duration-200 text-sm sm:text-base"
                      onClick={() => {
                        const subject = encodeURIComponent(`Pedido de informação: ${car.make} ${car.model} (${car.year})`);
                        const body = encodeURIComponent(`Olá,%0D%0A%0D%0ATenho interesse no veículo ${car.make} ${car.model} (${car.year}).%0D%0ALink: ${typeof window !== 'undefined' ? window.location.href : ''}%0D%0A%0D%0APodem entrar em contato comigo, por favor?%0D%0A%0D%0AObrigado.`);
                        window.location.href = `mailto:AutoGO.stand@gmail.com?subject=${subject}&body=${body}`;
                      }}
                    >
                      <span>Solicitar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CARDS DE CARACTERÍSTICAS */}
          <section className="w-full overflow-x-hidden">
            {/* Full-width on mobile so portrait shows 2 columns; center from md up */}
            <div className="w-full mx-0 md:mx-auto md:max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 px-4 md:px-12 lg:px-24 xl:px-32 justify-items-start box-border">
              {car.doors && (
                <div className="relative z-0 w-full min-w-0 max-w-full overflow-hidden bg-white rounded-xl shadow flex items-center gap-2 p-1.5 sm:p-2 md:p-2 lg:p-2 transform-gpu transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:z-10">
                  <FaDoorOpen className="text-sm sm:text-lg md:text-base lg:text-lg text-[#b42121] ml-0.5 sm:ml-1 md:ml-1 lg:ml-2 flex-shrink-0" />
                  <div className="flex-1 text-left py-1.5 md:py-1 lg:py-1 min-w-0">
                    <div className="font-medium text-sm md:text-sm lg:text-sm break-all whitespace-normal">{car.doors}</div>
                    <div className="text-[11px] md:text-xs lg:text-xs text-gray-500">Portas</div>
                  </div>
                </div>
              )}
              {car.color && (
                <div className="relative z-0 w-full min-w-0 max-w-full overflow-hidden bg-white rounded-xl shadow flex items-center gap-2 p-1.5 sm:p-2 md:p-2 lg:p-2 transform-gpu transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:z-10">
                  <FaPalette className="text-sm sm:text-lg md:text-base lg:text-lg text-[#b42121] ml-0.5 sm:ml-1 md:ml-1 lg:ml-2 flex-shrink-0" />
                  <div className="flex-1 text-left py-1.5 md:py-1 lg:py-1 min-w-0">
                    <div className="font-medium text-sm md:text-sm lg:text-sm break-all whitespace-normal">{car.color}</div>
                    <div className="text-[11px] md:text-xs lg:text-xs text-gray-500">Cor</div>
                  </div>
                </div>
              )}
              {car.emissionClass && (
                <div className="relative z-0 w-full min-w-0 max-w-full overflow-hidden bg-white rounded-xl shadow flex items-center gap-2 p-1.5 sm:p-2 md:p-2 lg:p-2 transform-gpu transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:z-10">
                  <FaLayerGroup className="text-sm sm:text-lg md:text-base lg:text-lg text-[#b42121] ml-0.5 sm:ml-1 md:ml-1 lg:ml-2 flex-shrink-0" />
                  <div className="flex-1 text-left py-1.5 md:py-1 lg:py-1 min-w-0">
                    <div className="font-medium text-sm md:text-sm lg:text-sm break-all whitespace-normal">{car.emissionClass}</div>
                    <div className="text-[11px] md:text-xs lg:text-xs text-gray-500">Classe Emissões</div>
                  </div>
                </div>
              )}
              {car.co2 && (
                <div className="relative z-0 w-full min-w-0 max-w-full overflow-hidden bg-white rounded-xl shadow flex items-center gap-2 p-1.5 sm:p-2 md:p-2 lg:p-2 transform-gpu transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:z-10">
                  <FaCloud className="text-sm sm:text-lg md:text-base lg:text-lg text-[#b42121] ml-0.5 sm:ml-1 md:ml-1 lg:ml-2 flex-shrink-0" />
                  <div className="flex-1 text-left py-1.5 md:py-1 lg:py-1 min-w-0">
                    <div className="font-medium text-sm md:text-sm lg:text-sm break-all whitespace-normal">{car.co2}</div>
                    <div className="text-[11px] md:text-xs lg:text-xs text-gray-500">CO₂</div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SECÇÃO CAR CARETRISTICS */}
          <section className="w-full bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow px-4 md:px-12 lg:px-24 xl:px-32 py-6 md:py-10 mt-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 whitespace-normal break-words leading-tight">
              Curiosidades & Vantagens
            </h3>
            <ul className="list-disc pl-6 sm:pl-8 space-y-2 text-gray-700 text-base sm:text-lg">
              {funFacts.length ? (
                funFacts.map((f, i) => (
                  <li key={i} className="break-words">
                    {f === car.description ? (
                      <span className="font-semibold">{f}</span>
                    ) : (
                      <span>{f}</span>
                    )}
                  </li>
                ))
              ) : (
                <li className="break-words">Carro muito equilibrado para o mercado português.</li>
              )}
            </ul>
          </section>

          {/* SECÇÃO EQUIPAMENTO & OPÇÕES */}
          {car.equipamento_opcoes && (
            <section className="w-full bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow p-10 mt-8 px-0 md:px-12 lg:px-24 xl:px-32">
              <h3 className="text-2xl sm:text-3xl font-semibold mb-8 flex items-center gap-3 text-black tracking-tight whitespace-normal break-words leading-tight">
                Equipamento & Opções
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {Object.entries(car.equipamento_opcoes).map(
                  ([categoria, lista]) => {
                    // Minimal, modern, grey icon mapping
                    const categoryIcons = {
                      conforto: <FaCogs className="text-gray-400 text-xl" />,
                      tecnologia: <FaBolt className="text-gray-400 text-xl" />,
                      seguranca: (
                        <FaRegCalendarCheck className="text-gray-400 text-xl" />
                      ),
                      opcoes_valor_elevado: (
                        <FaStar className="text-gray-400 text-xl" />
                      ),
                      exterior: <FaCarSide className="text-gray-400 text-xl" />,
                      interior: <FaPalette className="text-gray-400 text-xl" />,
                      assistencia: (
                        <FaUsers className="text-gray-400 text-xl" />
                      ),
                      outros: (
                        <FaLayerGroup className="text-gray-400 text-xl" />
                      ),
                    };
                    const icon = categoryIcons[categoria] || (
                      <FaLayerGroup className="text-gray-300 text-xl" />
                    );
                    return (
                      Array.isArray(lista) &&
                      lista.length > 0 && (
                        <div
                          key={categoria}
                          className="mb-2 bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex flex-col gap-2 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span>{icon}</span>
                            <span className="inline-block text-gray-700 text-base font-semibold capitalize tracking-wide">
                              {categoria
                                .replace(/_/g, " ")
                                .replace("opcoes", "opções")}
                            </span>
                          </div>
                          <ul className="list-none pl-0 space-y-1 text-gray-800 text-sm">
                            {lista.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                <span className="leading-tight">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    );
                  },
                )}
              </div>
            </section>
          )}

          {/* HISTÓRICO DE MANUTENÇÃO */}
          {car.maintenance && Array.isArray(car.maintenance) && car.maintenance.length > 0 && (
            <section className="w-full bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow p-10 mt-8 px-0 md:px-12 lg:px-24 xl:px-32">
              <h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-black tracking-tight whitespace-normal break-words leading-tight">
                Histórico de manutenção
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
                {car.maintenance.map((item, idx) => {
                  if (typeof item === 'string') {
                    return <li key={idx}>{item}</li>;
                  }
                  // Defensive object rendering
                  const mi = item as MaintenanceItem;
                  const km = mi.km ?? numify(mi.km) ?? mi['km'] ?? '';
                  const price = mi.price ?? numify(mi.price) ?? '';
                  return (
                    <li key={idx}>
                      {mi.date ?? '—'}{km ? ` — ${km} km` : ''}{mi.shop ? ` — ${mi.shop}` : ''}{mi.description ? ` — ${mi.description}` : ''}{price ? ` — € ${fmtNumber(price, { minimumFractionDigits: 2 })}` : ''}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* SECÇÃO CARROS SEMELHANTES - Swiper-like Carousel */}
          <section id="similar" className="mt-12" style={{ ['--accent' as any]: '#222' } as React.CSSProperties}>
            <div className="card rounded-3xl border-0 mb-3 shadow-sm flex flex-col bg-white/90">
              <div className="card-body pt-6 px-6">
                <h2
                  className="text-xl sm:text-2xl font-semibold mb-6 text-black tracking-tight whitespace-normal break-words leading-tight"
                  style={{ fontFamily: 'Montserrat, sans-serif', color: '#000' }}
                >
                  Carros semelhantes
                </h2>
                <div className="relative similar-swiper-container swiper-container-horizontal overflow-hidden">
                  {/* Navigation Arrows */}
                  {!isMobileView && (
                    <>
                      <button
                        className="arrow arrow--left absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 border border-gray-200 hover:bg-gray-100 hover:text-gray-800 transition-all"
                        aria-label="Anterior"
                        onClick={() => setSwiperIndex((i) => Math.max(i - 1, 0))}
                      >
                        <FaChevronDown className="rotate-90 text-2xl" />
                      </button>
                      <button
                        className="arrow arrow--right absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 border border-gray-200 hover:bg-gray-100 hover:text-gray-800 transition-all"
                        aria-label="Seguinte"
                        onClick={() =>
                          setSwiperIndex((i) =>
                            Math.min(i + 1, similarCars.length - slidesToShow),
                          )
                        }
                      >
                        <FaChevronDown className="-rotate-90 text-2xl" />
                      </button>
                    </>
                  )}
                  {/* Swiper Wrapper */}
                  {isMobileView ? (
                    // Mobile: show only first 3 items stacked vertically and make the container vertically scrollable
                    <div className="relative">
                      <div
                        ref={similarRef}
                        className="flex flex-col transition-all duration-300 gap-4 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300/40 scrollbar-track-gray-200"
                        style={{ maxHeight: similarExpanded ? `${Math.min(similarCars.length, 6) * 220}px` : `${Math.min(similarCars.length, 3) * 220}px` }}
                        onScroll={() => {
                          if (!similarRef.current) return;
                          const el = similarRef.current;
                          setCanScrollUp(el.scrollTop > 10);
                          setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 10);
                        }}
                      >
                        {similarCars.slice(0, similarExpanded ? 6 : 3).map((simCar) => (
                          <div
                            key={simCar.id}
                            className={`bg-white rounded-2xl shadow-lg w-full cursor-pointer group relative overflow-hidden transition-all duration-300 hover:shadow-2xl`}
                            data-id={simCar.id}
                          >
                            <a href={`/cars/${simCar.slug || simCar.id}`} className="block h-full">
                              <div className="similar-swiper-item relative">
                                <img
                                  src={normalizeImageClient(simCar.image) || '/images/auto-logo.png'}
                                  alt={`${simCar.make} ${simCar.model}`}
                                  loading="lazy"
                                  width={560}
                                  height={240}
                                  className="w-full h-40 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="slide-overlay absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                  <div className="car-info p-4 text-white w-full">
                                    <span className="make font-bold block text-lg">{simCar.make}</span>
                                    <span className="model block text-base">{simCar.model}</span>
                                    <span className="year block text-sm">{simCar.year}</span>
                                    <span className="km block text-sm">{fmtNumber(simCar.mileage, { minimumFractionDigits: 0 })} km</span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </div>
                        ))}
                      </div>
                      {/* top shadow */}
                      <div className={`pointer-events-none absolute left-0 right-0 top-0 h-6 transition-opacity ${canScrollUp ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="h-6 bg-gradient-to-b from-black/10 to-transparent" />
                      </div>
                      {/* bottom shadow */}
                      <div className={`pointer-events-none absolute left-0 right-0 bottom-0 h-6 transition-opacity ${canScrollDown ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="h-6 bg-gradient-to-t from-black/10 to-transparent" />
                      </div>
                      <div className="flex justify-center mt-2">
                        <button
                          className="block lg:hidden text-sm bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm hover:bg-gray-100"
                          onClick={() => {
                            setSimilarExpanded((v) => !v);
                            // after expanding, trigger scroll indicator recalculation
                            setTimeout(() => {
                              if (!similarRef.current) return;
                              const el = similarRef.current;
                              setCanScrollUp(el.scrollTop > 10);
                              setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 10);
                            }, 100);
                          }}
                        >
                          {similarExpanded ? 'Ver menos' : 'Ver mais'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`swiper-wrapper flex transition-transform duration-500 gap-4`}
                      style={{ transform: `translateX(-${swiperIndex * (100 / slidesToShow)}%)` }}
                    >
                      {similarCars.map((simCar) => (
                        <div
                          key={simCar.id}
                          className={`swiper-slide bg-white rounded-2xl shadow-lg flex-shrink-0 cursor-pointer group relative overflow-hidden transition-all duration-300 hover:shadow-2xl mx-2 ${'w-56 sm:w-60 md:w-72'}`}
                          data-id={simCar.id}
                        >
                          <a href={`/cars/${simCar.slug || simCar.id}`} className="block h-full">
                            <div className="similar-swiper-item relative">
                              <img
                                src={normalizeImageClient(simCar.image) || '/images/auto-logo.png'}
                                alt={`${simCar.make} ${simCar.model}`}
                                loading="lazy"
                                width={280}
                                height={160}
                                className="w-full h-40 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="slide-overlay absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                <div className="car-info p-4 text-white w-full">
                                  <span className="make font-bold block text-lg">{simCar.make}</span>
                                  <span className="model block text-base">{simCar.model}</span>
                                  <span className="year block text-sm">{simCar.year}</span>
                                  <span className="km block text-sm">{fmtNumber(simCar.mileage, { minimumFractionDigits: 0 })} km</span>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Pagination Fraction */}
                  <div className="swiper-pagination-fraction absolute right-6 bottom-2 bg-white/80 rounded px-3 py-1 text-sm font-semibold text-black shadow">
                    {swiperIndex + 1}/{similarCars.length}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <a
            href="/viaturas"
            className="text-blue-700 hover:underline block mt-6"
          >
            &larr; Voltar às viaturas
          </a>
        </main>
        <footer className="p-4 text-center text-gray-600 mt-8">
          &copy; 2025 Autogo. All rights reserved.
        </footer>
      </div>
      <Seo
        title={car ? `${car.make} ${car.model} importado europeu à venda em Portugal | AutoGo.pt` : 'Carro importado europeu à venda | AutoGo.pt'}
        description={
          car
            ? `${car.make} ${car.model} — €${fmtNumberForMeta(car.price)} — ${fmtNumber(car.mileage, { minimumFractionDigits: 0 })} km. Comprar carro importado europeu em AutoGo.pt.`
            : 'Carro importado europeu à venda em AutoGo.pt'
        }
        url={vehicleJson?.url ?? `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://autogo.pt'}/cars/${car.slug || car.id}`}
        image={Array.isArray(vehicleJson?.image) ? vehicleJson.image[0] : vehicleJson?.image}
        keywords={detailKeywords}
        ogType="product"
        jsonLd={vehicleJson}
      />
      {/* vehicleJson already injected via <Seo> above */}
    </Layout >
  );
}

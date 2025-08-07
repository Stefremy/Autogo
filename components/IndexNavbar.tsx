import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/viaturas", label: "Viaturas" },
  { href: "/simulador", label: "Simulador ISV" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/pedido", label: "Encomendar" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

// Dynamically generate available languages from /public/locales and match to flags
const LOCALE_TO_FLAG = {
  "pt-PT": { flag: "/images/flags/pt.png", label: "Português" },
  es: { flag: "/images/flags/es.png", label: "Español" },
  en: { flag: "/images/flags/en.png", label: "English" },
  fr: { flag: "/images/flags/fr.png", label: "Français" },
  de: { flag: "/images/flags/de.png", label: "Deutsch" },
};
const AVAILABLE_LANGS = Object.entries(LOCALE_TO_FLAG)
  .filter(([code]) => ["pt-PT", "es", "en", "fr", "de"].includes(code))
  .map(([code, { flag, label }]) => ({ code, flag, label }));

export function IndexNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const langSelectorRef = React.useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(
        window.innerWidth > window.innerHeight && window.innerWidth < 1024,
      );
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  const openMobileMenu = useCallback(() => {
    setIsMenuAnimating(true);
    setMobileMenuOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMenuAnimating(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsMenuAnimating(false);
    }, 300); // Match animation duration
  }, []);

  const toggleMobileMenu = useCallback(() => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }, [mobileMenuOpen, closeMobileMenu, openMobileMenu]);

  useEffect(() => {
    if (!langOpen) return;
    function handleClick(e) {
      if (
        langSelectorRef.current &&
        !langSelectorRef.current.contains(e.target)
      ) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [langOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    }
  }, [router.pathname, mobileMenuOpen, closeMobileMenu]);

  const currentLocale = router.locale || "pt-PT";
  const handleLocaleChange = (locale) => {
    if (locale !== currentLocale) {
      router.push(router.asPath, router.asPath, { locale });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 flex items-center justify-between px-2 sm:px-4 md:px-6 gap-2 sm:gap-4 md:gap-8 ${scrolled ? "backdrop-blur-xl shadow-xl" : "shadow-md"}`}
        style={{
          height: isLandscape ? "56px" : "64px",
          minWidth: 320,
          background: scrolled
            ? "rgba(255,255,255,0.92)"
            : "rgba(255,255,255,0.98)",
          borderBottom: "1.5px solid #ececec",
          boxShadow: scrolled
            ? "0 4px 24px 0 rgba(44,62,80,0.10)"
            : "0 2px 12px 0 rgba(44,62,80,0.06)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center relative">
          <Link href="/">
            <div className="relative flex items-center group h-full">
              <img
                src="/images/auto-logonb.png"
                alt="AutoGo.pt"
                className={`${isLandscape ? "h-24" : "h-32"} md:h-40 w-auto object-contain z-10 transition-transform duration-300 group-hover:scale-105`}
                style={{
                  maxWidth: isLandscape ? "240px" : "320px",
                  filter: "drop-shadow(0 4px 18px rgba(44,62,80,0.13))",
                }}
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-wrap items-center justify-end gap-6 flex-1 min-w-0">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative text-base font-medium transition-all duration-200 px-2 py-1 rounded-lg
                ${isActive ? "text-[#b42121] bg-[#f5f6fa] shadow-sm" : "text-[#22272a] hover:text-[#b42121] hover:bg-[#f5f6fa]"}
                focus:outline-none focus:ring-2 focus:ring-[#b42121]/30`}
                style={{ letterSpacing: 0.2, fontWeight: 500 }}
              >
                {t(label)}
              </Link>
            );
          })}
          {/* Red lines decoration */}
          <span className="flex flex-col justify-center ml-2 mr-2 gap-1">
            <span className="block w-8 h-1 rounded-full bg-[#b42121] opacity-90"></span>
            <span className="block w-6 h-1 rounded-full bg-[#b42121] opacity-70"></span>
            <span className="block w-4 h-1 rounded-full bg-[#b42121] opacity-50"></span>
          </span>
        </div>

        {/* Mobile/Tablet Menu Button */}
        <div
          className="lg:hidden flex items-center gap-1 sm:gap-2"
          style={{ display: "flex" }}
        >
          <div className="relative ml-1 sm:ml-2">
            <select
              value={currentLocale}
              onChange={(e) => handleLocaleChange(e.target.value)}
              className="bg-white border border-[#ececec] rounded-full px-1 sm:px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#b42121]/30 shadow-sm transition-all duration-200"
              style={{ minWidth: isLandscape ? 32 : 36, zIndex: 100 }}
              aria-label="Selecionar idioma"
            >
              {AVAILABLE_LANGS.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={toggleMobileMenu}
            className={`group relative p-2 sm:p-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-3 focus:ring-[#b42121]/30 ${
              mobileMenuOpen 
                ? "bg-[#b42121] shadow-lg scale-105" 
                : "bg-white hover:bg-[#f5f6fa] shadow-md hover:shadow-lg"
            }`}
            aria-label="Toggle mobile menu"
            style={{ display: "block", visibility: "visible" }}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center relative">
              <span
                className={`block w-4 sm:w-5 h-0.5 rounded-full transition-all duration-300 ease-in-out transform origin-center ${
                  mobileMenuOpen 
                    ? "bg-white rotate-45 translate-y-[2px] scale-110" 
                    : "bg-[#22272a] group-hover:bg-[#b42121] -translate-y-[3px]"
                }`}
              ></span>
              <span
                className={`block w-4 sm:w-5 h-0.5 rounded-full transition-all duration-300 ease-in-out ${
                  mobileMenuOpen 
                    ? "bg-white opacity-0 scale-0" 
                    : "bg-[#22272a] group-hover:bg-[#b42121] opacity-100 scale-100"
                }`}
              ></span>
              <span
                className={`block w-4 sm:w-5 h-0.5 rounded-full transition-all duration-300 ease-in-out transform origin-center ${
                  mobileMenuOpen 
                    ? "bg-white -rotate-45 -translate-y-[2px] scale-110" 
                    : "bg-[#22272a] group-hover:bg-[#b42121] translate-y-[3px]"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {(mobileMenuOpen || isMenuAnimating) && (
        <div
          className={`lg:hidden fixed left-0 w-full h-screen z-50 transition-all duration-300 ease-in-out ${
            mobileMenuOpen 
              ? "bg-black/50 opacity-100" 
              : "bg-black/0 opacity-0 pointer-events-none"
          }`}
          style={{ top: isLandscape ? "56px" : "64px" }}
          onClick={closeMobileMenu}
        >
          <div
            className={`bg-white shadow-2xl border-b border-gray-200 backdrop-blur-sm transition-all duration-300 ease-out transform ${
              mobileMenuOpen 
                ? "translate-y-0 opacity-100" 
                : "-translate-y-full opacity-0"
            } ${isLandscape ? "max-h-72" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 sm:px-4 py-4 sm:py-5 space-y-1 sm:space-y-2">
              {NAV_LINKS.map(({ href, label }, index) => {
                const isActive = router.pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`group block ${isLandscape ? "text-xs py-2" : "text-lg py-3"} font-medium transition-all duration-300 px-4 sm:px-5 rounded-xl transform hover:scale-[1.02] hover:translate-x-1 ${
                      mobileMenuOpen 
                        ? "translate-x-0 opacity-100" 
                        : "-translate-x-4 opacity-0"
                    }
                    ${isActive 
                      ? "text-white bg-gradient-to-r from-[#b42121] to-[#d55050] shadow-lg" 
                      : "text-[#22272a] hover:text-[#b42121] hover:bg-gradient-to-r hover:from-[#f5f6fa] hover:to-[#fbe9e9] hover:shadow-md"
                    }
                    focus:outline-none focus:ring-2 focus:ring-[#b42121]/30`}
                    style={{ 
                      letterSpacing: 0.2, 
                      fontWeight: 500,
                      transitionDelay: mobileMenuOpen ? `${index * 50}ms` : "0ms"
                    }}
                    onClick={closeMobileMenu}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isActive 
                          ? "bg-white scale-100" 
                          : "bg-[#b42121] scale-0 group-hover:scale-100"
                      }`}></span>
                      {t(label)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

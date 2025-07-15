import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';

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
  'pt-PT': { flag: '/images/flags/pt.png', label: 'Português' },
  'es': { flag: '/images/flags/es.png', label: 'Español' },
  'en': { flag: '/images/flags/en.png', label: 'English' },
  'fr': { flag: '/images/flags/fr.png', label: 'Français' },
  'de': { flag: '/images/flags/de.png', label: 'Deutsch' },
};
const AVAILABLE_LANGS = Object.entries(LOCALE_TO_FLAG)
  .filter(([code]) => ['pt-PT','es','en','fr','de'].includes(code))
  .map(([code, { flag, label }]) => ({ code, flag, label }));

export function IndexNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
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
    if (!langOpen) return;
    function handleClick(e) {
      if (langSelectorRef.current && !langSelectorRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [langOpen]);

  const currentLocale = router.locale || 'pt-PT';
  const handleLocaleChange = (locale) => {
    if (locale !== currentLocale) {
      router.push(router.asPath, router.asPath, { locale });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        flex items-center justify-between px-4 gap-8
        ${scrolled ? "backdrop-blur-md shadow-xl" : "shadow-lg"}`}
      style={{
        height: "56px",
        minWidth: 320,
        background: scrolled
          ? "linear-gradient(0deg, rgba(236,236,236,0.85) 0%, rgba(245,246,250,0.7) 100%)"
          : "linear-gradient(0deg, rgba(245,246,250,0.85) 0%, rgba(236,236,236,0.7) 100%)",
        borderBottom: "1.5px solid #e5e7eb",
        boxShadow: scrolled
          ? "0 4px 24px 0 rgba(213,0,50,0.10), 0 1.5px 0 0 #d50032"
          : "0 2px 16px 0 rgba(213,0,50,0.08), 0 1.5px 0 0 #d50032"
      }}
    >
      <div className="flex items-center relative">
        <Link href="/">
          <img
            src="/images/auto-logonb.png"
            alt="AutoGo.pt"
            className="h-full w-auto object-contain z-10 scale-x-110"
            style={{ maxWidth: "180px" }}
          />
        </Link>
        {/* 3 red lines next to logo */}
        <div className="flex flex-col justify-center ml-3 gap-1">
          <span className="block w-8 h-1 rounded-full bg-[#b42121] opacity-90"></span>
          <span className="block w-6 h-1 rounded-full bg-[#b42121] opacity-70"></span>
          <span className="block w-4 h-1 rounded-full bg-[#b42121] opacity-50"></span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-8 flex-1 min-w-0">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = router.pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative text-lg font-medium transition
                ${isActive ? "text-[#b42121] font-bold" : "text-[#b42121] hover:text-[#a11a1a]"}
                after:absolute after:left-0 after:-bottom-1 after:h-1
                after:bg-[#b42121] after:rounded-full
                ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
                after:transition-all after:duration-300
                px-2`}
            >
              {t(label)}
            </Link>
          );
        })}
      </div>
      {/* Simple language selector dropdown */}
      <select
        value={currentLocale}
        onChange={e => handleLocaleChange(e.target.value)}
        className="ml-2 bg-white border border-[#e5e7eb] rounded-full px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#b42121]"
        style={{ minWidth: 44, zIndex: 100 }}
        aria-label="Selecionar idioma"
      >
        {AVAILABLE_LANGS.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </nav>
  );
}

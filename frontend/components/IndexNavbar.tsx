import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/viaturas", label: "Viaturas" },
  { href: "/simulador", label: "Simulador ISV" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/pedido", label: "Pedido" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export function IndexNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled ? "backdrop-blur-md bg-white/60 shadow-lg" : "bg-white/95"}
        flex items-center justify-between px-4 gap-8`}
      style={{ height: "56px" }}
    >
      <div className="flex items-center">
        <Link href="/">
          <img
            src="/images/auto-logonb.png"
            alt="AutoGo.pt"
            className="h-full w-auto object-contain z-10 scale-x-110"
            style={{ maxWidth: "180px" }}
          />
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-8 flex-1">
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
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

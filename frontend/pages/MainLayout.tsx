import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/viaturas", label: "Viaturas" },
  { href: "/simulador", label: "Simulador ISV" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/pedido", label: "Pedido" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-[#1a1a1a]">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md flex flex-wrap items-center justify-center py-5 px-4 gap-8">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = router.pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative text-lg font-medium transition
                ${isActive ? "text-[#0055b8] font-bold" : "text-gray-700 hover:text-[#0055b8]"}
                after:absolute after:left-0 after:-bottom-1 after:h-1
                after:bg-[#0055b8] after:rounded-full
                ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
                after:transition-all after:duration-300
                px-2`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* CONTEÚDO */}
      <main className="max-w-7xl mx-auto px-4 md:px-0 py-12">{children}</main>
    </div>
  );
}

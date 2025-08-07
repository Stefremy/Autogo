import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";
import Footer from "./Footer";
import { IndexNavbar } from "./IndexNavbar";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/viaturas", label: "Viaturas" },
  { href: "/simulador", label: "Simulador ISV" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/pedido", label: "Encomendar" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6fa] text-[#1a1a1a] overflow-x-hidden">
      {/* NAVBAR */}
      <IndexNavbar />
      {/* CONTEÚDO */}
      <main className="pt-[64px] flex-1 flex flex-col overflow-x-hidden">
        {React.Children.map(children, (child) => {
          // If the child is a full-width section, render it outside the wrapper
          if (
            React.isValidElement(child) &&
            (child.props["data-fullwidth"] ||
              (typeof child.props === "object" &&
                child.props !== null &&
                "className" in child.props &&
                typeof child.props.className === "string" &&
                child.props.className.includes("w-screen")))
          ) {
            return child;
          }
          // Otherwise, wrap in the centered container
          return (
            <div className="max-w-7xl mx-auto px-1 sm:px-4 md:px-6 lg:px-0">
              {child}
            </div>
          );
        })}
      </main>
      <CookieConsent
        location="bottom"
        buttonText="Aceitar"
        declineButtonText="Rejeitar"
        enableDeclineButton
        style={{ background: "#222", color: "#fff", fontSize: "1rem" }}
        buttonStyle={{
          background: "#e53e3e",
          color: "#fff",
          fontWeight: "bold",
        }}
        declineButtonStyle={{
          background: "#aaa",
          color: "#222",
          fontWeight: "bold",
        }}
        cookieName="autogoCookieConsent"
      >
        Utilizamos cookies para melhorar a sua experiência. Saiba mais na nossa{" "}
        <a
          href="/cookie-policy"
          style={{ color: "#fff", textDecoration: "underline" }}
        >
          Política de Cookies
        </a>
        .
      </CookieConsent>
      <Footer />
    </div>
  );
}

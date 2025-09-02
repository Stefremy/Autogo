import React, { ReactNode } from "react";
import Head from "next/head";
import CookieConsent from "react-cookie-consent";
import Footer from "./Footer";
import { IndexNavbar } from "./IndexNavbar";

type MainLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  ogImage?: string;
};

export default function MainLayout({
  children,
  title = "AutoGo | Página inicial",
  description = "AutoGo.pt facilita a importação de viaturas europeias para Portugal. Encontre carros usados, simule o ISV e receba o veículo legalizado com documentação e entrega rápida.",
  ogImage = "https://www.autogo.pt/images/auto-logo.png",
}: MainLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>

        {/* SEO básico */}
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="importação de carros, viaturas europeias, carros usados, simulador ISV, legalização de veículos, entrega em Portugal, importação premium"
        />
        <meta name="robots" content="index,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={title || "AutoGo.pt — Importação de viaturas europeias para Portugal"}
        />
        <meta
          property="og:description"
          content="Importe o seu carro europeu sem complicações. Encontre viaturas usadas, simule o ISV e receba o carro legalizado e pronto a andar em todo o país."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content="https://www.autogo.pt" />

        {/* Tema claro garantido no render inicial */}
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#ffffff" />

        {/* Favicon */}
        <link rel="icon" href="/images/favicon.png" type="image/png" />
      </Head>

      {/* Wrapper principal: força cores do tema claro */}
      <div
        className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] overflow-x-hidden"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        {/* NAVBAR */}
        <IndexNavbar />

        {/* CONTEÚDO */}
        <main className="pt-[64px] flex-1 flex flex-col overflow-x-hidden">
          {React.Children.map(children, (child) => {
            if (
              React.isValidElement(child) &&
              (child.props["data-fullwidth"] ||
                (typeof child.props === "object" &&
                  child.props !== null &&
                  "className" in child.props &&
                  typeof (child.props as any).className === "string" &&
                  (child.props as any).className.includes("w-screen")))
            ) {
              return child;
            }
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
          buttonStyle={{ background: "#e53e3e", color: "#fff", fontWeight: "bold" }}
          declineButtonStyle={{ background: "#aaa", color: "#222", fontWeight: "bold" }}
          cookieName="autogoCookieConsent"
        >
          Utilizamos cookies para melhorar a sua experiência. Saiba mais na nossa{" "}
          <a href="/cookie-policy" style={{ color: "#fff", textDecoration: "underline" }}>
            Política de Cookies
          </a>
          .
        </CookieConsent>

        <Footer />
      </div>
    </>
  );
}

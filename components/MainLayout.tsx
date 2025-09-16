import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";
import Footer from "./Footer";
import { IndexNavbar } from "./IndexNavbar";
import Head from "next/head";

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
    <>
    <Head>
      {/* Google Consent Mode v2 & gtag.js (only when MEASUREMENT_ID is provided) */}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <>
          <script
            // Set default consent to denied so analytics/ad storage are blocked until user accepts
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('consent', 'default', { 'ad_storage': 'denied', 'analytics_storage': 'denied' });`,
            }}
          />
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', { send_page_view: false });`,
            }}
          />
        </>
      )}
    </Head>
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
        onAccept={() => {
          if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return;
          try {
            // grant both ad and analytics storage
            (window as any).gtag('consent', 'update', {
              ad_storage: 'granted',
              analytics_storage: 'granted',
            });
            // send a page_view now that analytics is allowed
            (window as any).gtag('event', 'page_view', { send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID });
          } catch (e) {
            // ignore if gtag is unavailable
          }
        }}
        onDecline={() => {
          if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return;
          try {
            (window as any).gtag('consent', 'update', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
            });
          } catch (e) {
            // ignore
          }
        }}
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
    </>
  );
}

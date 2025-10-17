import React, { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";
import Head from "next/head";
import Footer from "./Footer";
import { IndexNavbar } from "./IndexNavbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const scrolledRef = React.useRef(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [adsEnabled, setAdsEnabled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      scrolledRef.current = window.scrollY > 10;
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
          } catch {
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
          } catch {
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
      {/* Manage preferences floating button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          aria-label="Gerir preferências"
          onClick={() => {
            // open preferences panel and initialize toggles from cookie
            if (typeof document !== 'undefined') {
              try {
                const raw = document.cookie.split('; ').find((c) => c.startsWith('autogoCookieConsent='));
                if (raw) {
                  const val = decodeURIComponent(raw.split('=')[1] || '');
                  try {
                    const parsed = JSON.parse(val);
                    setAnalyticsEnabled(Boolean(parsed.analytics));
                    setAdsEnabled(Boolean(parsed.ads));
                  } catch {
                    // if cookie not JSON, default both to false
                    setAnalyticsEnabled(false);
                    setAdsEnabled(false);
                  }
                } else {
                  setAnalyticsEnabled(false);
                  setAdsEnabled(false);
                }
              } catch {
                setAnalyticsEnabled(false);
                setAdsEnabled(false);
              }
            }
            setPrefsOpen(true);
          }}
          className="bg-white border border-gray-200 rounded-full px-4 py-2 shadow hover:shadow-md text-sm"
        >
          Gerir preferências
        </button>

        {/* Inline preferences panel */}
        {prefsOpen && (
          <div className="mt-2 w-64 bg-white border border-gray-200 rounded p-3 shadow">
            <h4 className="text-sm font-semibold mb-2">Preferências de cookies</h4>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-medium">Analytics</div>
                <div className="text-xs text-gray-500">Coletas para melhorar o site</div>
              </div>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                aria-label="Ativar Analytics"
                className="w-5 h-5"
              />
            </div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-medium">Publicidade</div>
                <div className="text-xs text-gray-500">Personalização de anúncios</div>
              </div>
              <input
                type="checkbox"
                checked={adsEnabled}
                onChange={(e) => setAdsEnabled(e.target.checked)}
                aria-label="Ativar Publicidade"
                className="w-5 h-5"
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                className="text-sm text-gray-600 px-3 py-1 rounded hover:bg-gray-50"
                onClick={() => setPrefsOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="text-sm bg-[#e53e3e] text-white px-3 py-1 rounded"
                onClick={() => {
                  // save preferences into cookie and update gtag consent
                  try {
                    const cookieVal = JSON.stringify({ analytics: analyticsEnabled, ads: adsEnabled });
                    document.cookie = `autogoCookieConsent=${encodeURIComponent(cookieVal)}; path=/; max-age=${60 * 60 * 24 * 365}`;
                  } catch {
                    // ignore
                  }
                  if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && typeof (window as any) !== 'undefined') {
                    try {
                      (window as any).gtag('consent', 'update', {
                        analytics_storage: analyticsEnabled ? 'granted' : 'denied',
                        ad_storage: adsEnabled ? 'granted' : 'denied',
                      });
                      if (analyticsEnabled) {
                        (window as any).gtag('event', 'page_view', { send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID });
                      }
                    } catch {
                      // ignore
                    }
                  }
                  setPrefsOpen(false);
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

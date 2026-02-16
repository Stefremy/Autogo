import "../styles/globals.scss";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { appWithTranslation } from "next-i18next";
import type { UserConfig } from "next-i18next";
import type { AppProps } from "next/app";
import { SpeedInsights } from "@vercel/speed-insights/next";
import nextI18NextConfig from "../next-i18next.config.js";
import { IndexNavbar } from "../components/IndexNavbar";
import ErrorBoundary from "../components/ErrorBoundary";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Hide IndexNavbar on /viaturas and /cars/[id]
  const hideNavbar =
    router.pathname === "/viaturas" || router.pathname.startsWith("/cars");

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GTM_ID) return;

    const onRouteChange = (url: string) => {
      try {
        // Push a page_view event to dataLayer for GTM to consume
        // dataLayer is created by the GTM snippet in _document when configured
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({ event: 'page_view', page_path: url });
      } catch { }
    };

    router.events.on('routeChangeComplete', onRouteChange);
    return () => {
      router.events.off('routeChangeComplete', onRouteChange);
    };
  }, [router.events]);

  return (
    <ErrorBoundary>
      <div className={`${montserrat.variable} font-sans`}>
        {!hideNavbar && <IndexNavbar />}
        <Component {...pageProps} />
        {/* Speed Insights component (self-closing) - renders instrumentation for performance reporting */}
        <SpeedInsights />
      </div>
    </ErrorBoundary>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig as UserConfig);

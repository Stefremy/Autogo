// pages/_app.tsx
import "../styles/globals.css";
import "../styles/globals.scss";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import type { UserConfig } from "next-i18next";
import type { AppProps } from "next/app";
import nextI18NextConfig from "../next-i18next.config.js";
import { IndexNavbar } from "../components/IndexNavbar";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Hide IndexNavbar on /viaturas and /cars/[id]
  const hideNavbar =
    router.pathname === "/viaturas" || router.pathname.startsWith("/cars");

  return (
    <>
      <Head>
        {/* Google Search Console verification */}
        <meta
          name="google-site-verification"
          content="Gbbb61qlNK2IcN7uE1oKw8fwz2i5l-yCZazLR-I5uWU"
        />
      </Head>
      {!hideNavbar && <IndexNavbar />}
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig as UserConfig);

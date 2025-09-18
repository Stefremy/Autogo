import "../styles/globals.css";
import "../styles/globals.scss";
import { useRouter } from "next/router";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";
import type { UserConfig } from "next-i18next";
import type { AppProps } from "next/app";
import nextI18NextConfig from "../next-i18next.config.js";
import { IndexNavbar } from "../components/IndexNavbar";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Hide IndexNavbar on /viaturas and /cars/[id]
  const hideNavbar =
    router.pathname === "/viaturas" || router.pathname.startsWith("/cars");
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet" />
      </Head>
      {!hideNavbar && <IndexNavbar />}
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig as UserConfig);

import "../styles/globals.css";
import "../styles/globals.scss";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import type { UserConfig } from "next-i18next";
import type { AppProps } from "next/app";
import nextI18NextConfig from "../next-i18next.config.js";
import { IndexNavbar } from "../components/IndexNavbar";
import Head from "next/head";   // ✅ importa o Head

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Hide IndexNavbar on /viaturas and /cars/[id]
  const hideNavbar =
    router.pathname === "/viaturas" || router.pathname.startsWith("/cars");

  return (
    <>
      {/* ✅ Head global para todas as páginas */}
      <Head>
        <meta
          name="google-site-verification"
          content="google435fb1bad5f3fe11.html"
        />
      </Head>

      {!hideNavbar && <IndexNavbar />}
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig as UserConfig);

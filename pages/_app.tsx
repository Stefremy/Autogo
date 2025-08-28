import Head from "next/head";
import "../styles/globals.css";
import "../styles/globals.scss";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import type { UserConfig } from "next-i18next";
import type { AppProps } from "next/app";
import nextI18NextConfig from "../next-i18next.config.js";
import { IndexNavbar } from "../components/IndexNavbar";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hideNavbar =
    router.pathname === "/viaturas" || router.pathname.startsWith("/cars");

  return (
    <>
      {/* ✅ Meta tag de verificação Google */}
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

import '../styles/globals.css';
import '../styles/globals.scss';
import { useRouter } from 'next/router';
import { IndexNavbar } from '../components/IndexNavbar';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Hide IndexNavbar on /viaturas and /cars/[id]
  const hideNavbar = router.pathname === '/viaturas' || router.pathname.startsWith('/cars');
  return (
    <>
      {!hideNavbar && <IndexNavbar />}
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp);


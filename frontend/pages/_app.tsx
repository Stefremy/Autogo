import '../styles/globals.css';
import '../styles/globals.scss';
import { useRouter } from 'next/router';
import { IndexNavbar } from '../components/IndexNavbar';

export default function App({ Component, pageProps }) {
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


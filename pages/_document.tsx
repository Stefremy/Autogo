import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-PT">
        <Head>
          {/* Google Tag Manager (renders only when NEXT_PUBLIC_GTM_ID is set) */}
          {process.env.NEXT_PUBLIC_GTM_ID ? (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
              }}
            />
          ) : null}
          {/* Favicon and touch icons - place files in /public: */}
          <link rel="icon" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#b42121" />

          {/* Fonts — preconnect first so the browser can resolve DNS + TLS before the stylesheet request */}
          <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
          {/* Load Typekit non-render-blocking: preload then swap in with media trick */}
          <link
            rel="preload"
            as="style"
            href="https://use.typekit.net/mdg1mhk.css"
            // @ts-ignore — onLoad is valid on link[rel=preload] for font-swap technique
            onLoad="this.onload=null;this.rel='stylesheet'"
          />
          <noscript>
            <link rel="stylesheet" href="https://use.typekit.net/mdg1mhk.css" />
          </noscript>

          {/* Global Open Graph / Social defaults */}
          <meta property="og:site_name" content="AutoGo.pt" />
          <meta property="og:locale" content="pt_PT" />
          {/* Default Twitter card (can be overridden per-page) */}
          <meta name="twitter:card" content="summary_large_image" />

          {/* NOTE: analytics initialization has been moved to MainLayout (consent-aware). */}
        </Head>
        <body>
          {/* Google Tag Manager (noscript) - rendered only when NEXT_PUBLIC_GTM_ID is set */}
          {process.env.NEXT_PUBLIC_GTM_ID ? (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          ) : null}
          {/* End Google Tag Manager (noscript) */}
          {/*
            Defensive inline script: remove any client-inserted favicon link that
            points to the legacy `/images/favicon.png`. This runs early so that
            crawlers or JS-rendering clients won't see the old icon after
            hydration. Kept minimal and safe (no external deps).
          */}
          <script dangerouslySetInnerHTML={{ __html: `;(function(){try{var s=document.getElementsByTagName('link');for(var i=s.length-1;i>=0;--i){var el=s[i];if(el && el.rel && el.rel.indexOf('icon')!==-1 && el.href && el.href.indexOf('/images/favicon.png')!==-1){el.parentNode && el.parentNode.removeChild(el);} } }catch(e){} })();` }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

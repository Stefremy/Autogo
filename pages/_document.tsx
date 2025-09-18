import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-PT">
        <Head>
          {/* Favicon and touch icons - place files in /public: */}
          <link rel="icon" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#b42121" />
        </Head>
        <body>
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

import React from "react";
import Layout from "../components/MainLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ContactForm from "../components/ContactForm";

export default function Contacto() {
  const { t } = useTranslation("common");
  return (
    <Layout>
      {/* Premium red underline accent fixed below navbar, expands on scroll and can go edge to edge */}
      <div
        id="hero-redline"
        className="fixed top-[64px] left-0 w-full z-40 pointer-events-none"
        style={{ height: "0" }}
      >
        <div id="hero-redline-bar" className="w-full flex justify-center">
          <span
            id="hero-redline-span"
            className="block h-1.5 rounded-full bg-gradient-to-r from-[#b42121] via-[#d50032] to-[#b42121] opacity-90 shadow-[0_0_16px_4px_rgba(213,0,50,0.18)] animate-pulse transition-all duration-700"
            style={{ width: "16rem", margin: "0 auto" }}
          />
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function(){
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(x, min, max) { return Math.max(min, Math.min(max, x)); }
  function onScroll() {
    var el = document.getElementById('hero-redline-span');
    var bar = document.getElementById('hero-redline-bar');
    var footer = document.querySelector('footer');
    if (!el || !bar || !footer) return;
    var scrollY = window.scrollY;
    var footerTop = footer.getBoundingClientRect().top + window.scrollY;
    var maxScroll = Math.max(footerTop - window.innerHeight, 1); // progress=1 when bottom de viewport reaches footer
    var progress = clamp(scrollY / maxScroll, 0, 1);
    var minW = 16 * 16; // 16rem
    var maxW = window.innerWidth; // allow edge-to-edge
    var newW = lerp(minW, maxW, progress);
    el.style.width = newW + 'px';
    // Fade out as we approach the footer
    var fadeStart = 0.98;
    var fadeProgress = clamp((progress - fadeStart) / (1 - fadeStart), 0, 1);
    el.style.opacity = 0.9 - 0.6 * fadeProgress;
    el.style.marginLeft = el.style.marginRight = 'auto';
  }
  function initUnderline() {
    if (!document.getElementById('hero-redline-span') || !document.querySelector('footer')) {
      setTimeout(initUnderline, 100);
      return;
    }
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    setTimeout(onScroll, 100);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnderline);
  } else {
    initUnderline();
  }
})();
`,
        }}
      />
      <div className="min-h-screen w-full bg-gradient-to-br from-[#f5f6fa] via-[#fbe9e9] to-[#f5f6fa] flex flex-col overflow-x-hidden relative">
        <img
          src="/images/audi-scotland.jpg"
          alt="Fundo"
          className="pointer-events-none select-none fixed inset-0 w-screen h-screen object-cover opacity-60 z-0 transition-all duration-700"
          style={{ objectPosition: "center top", filter: "blur(0.5px)" }}
        />
        <div
          className="pointer-events-none select-none fixed inset-0 w-screen h-screen z-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(245,246,250,0.80) 0%, rgba(251,233,233,0.65) 60%, rgba(245,246,250,0.80) 100%)",
          }}
        />
        <main
          style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}
          className="relative z-10"
        >
          <hr />
          <section className="max-w-3xl mx-auto bg-white/95 rounded-2xl shadow-2xl border border-[#b42121]/10 p-8 my-10">
            <h2 className="text-2xl font-bold mb-6 text-[#b42121]">
              {t("Contacte-nos")}
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Contact Info + Google Maps */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center">
                  <span
                    className="mr-2 text-[#b42121] text-xl"
                    aria-label="Email"
                  >
                    @
                  </span>
                  <a
                    href="mailto:AutoGO.stand@gmail.com"
                    className="hover:underline"
                  >
                    AutoGO.stand@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <span
                    className="mr-2 text-[#b42121] text-xl"
                    aria-label="Telefone"
                  >
                    📱
                  </span>
                  <a href="tel:+351935179591" className="hover:underline">
                    +351 935 179 591
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-[#b42121]" aria-label="Morada">
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a6 6 0 016 6c0 4.418-6 10-6 10S4 12.418 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z"></path>
                    </svg>
                  </span>
                  <a
                    href="https://www.google.com/maps?q=R.+Rómulo+de+Carvalho+388+SITIO,+4800-019+Guimarães"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    R. Rómulo de Carvalho 388 SITIO, 4800-019 Guimarães
                  </a>
                </div>
                <a
                  href="https://wa.me/351935179591"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-[#25d366] text-white rounded-lg font-bold shadow hover:bg-[#1ebe57] transition"
                  aria-label="WhatsApp"
                >
                  <img
                    src="/images/whatsapp-logo.png"
                    alt="WhatsApp"
                    className="w-6 h-6"
                    style={{ display: "inline" }}
                  />
                  WhatsApp
                </a>
                <iframe
                  title="Localização AutoGo"
                  src="https://www.google.com/maps?q=R.+Rómulo+de+Carvalho+388+SITIO,+4800-019+Guimarães&output=embed"
                  width="100%"
                  height="200"
                  allowFullScreen
                  loading="lazy"
                  className="rounded-xl border"
                  aria-label="Mapa com a localização da empresa"
                ></iframe>
              </div>
              {/* Contact Form */}
              <ContactForm />
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../components/MainLayout";
import ContactForm from "../components/ContactForm";
import Seo from "../components/Seo";
import { SITE_WIDE_KEYWORDS, SEO_KEYWORDS, joinKeywords } from "../utils/seoKeywords";

export default function Contacto() {
  const contactoJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': 'https://autogo.pt/contacto',
        url: 'https://autogo.pt/contacto',
        name: 'Contacto — AutoGo.pt | Importação Automóvel Guimarães',
        description: 'Contacte a AutoGo.pt em Guimarães — especialistas em importação e legalização de carros europeus. WhatsApp disponível, resposta em 24h.',
        inLanguage: 'pt-PT',
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://autogo.pt/#organization',
        name: 'AutoGo.pt',
        alternateName: 'AutoGo Portugal',
        url: 'https://autogo.pt',
        telephone: '+351935179591',
        email: 'AutoGO.stand@gmail.com',
        image: 'https://autogo.pt/images/auto-logo.png',
        priceRange: '€€',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'R. Rómulo de Carvalho 388 SITIO',
          addressLocality: 'Guimarães',
          addressRegion: 'Braga',
          postalCode: '4800-019',
          addressCountry: 'PT',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 41.4444,
          longitude: -8.2962,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '09:00',
            closes: '13:00',
          },
        ],
        areaServed: { '@type': 'Country', name: 'Portugal' },
        sameAs: [
          'https://www.facebook.com/AutoGo.pt',
          'https://www.instagram.com/AutoGo.pt',
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+351935179591',
            contactType: 'customer service',
            areaServed: 'PT',
            availableLanguage: ['Portuguese', 'Spanish', 'English'],
            contactOption: 'TollFree',
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://autogo.pt/' },
          { '@type': 'ListItem', position: 2, name: 'Contacto', item: 'https://autogo.pt/contacto' },
        ],
      },
    ],
  };

  return (
    <Layout>
      <Seo
        title={SEO_KEYWORDS.contacto.title ?? 'Contacto | AutoGo.pt'}
        description={SEO_KEYWORDS.contacto.description ?? ''}
        url="https://autogo.pt/contacto"
        keywords={joinKeywords(SEO_KEYWORDS.contacto.keywords ?? [], SITE_WIDE_KEYWORDS)}
        jsonLd={contactoJsonLd}
      />

      {/* Red accent bar */}
      <div className="fixed top-[64px] left-0 w-full z-40 pointer-events-none">
        <span className="block h-1.5 bg-gradient-to-r from-[#b42121] via-[#d50032] to-[#b42121] opacity-90" />
      </div>

      {/* Full-screen Audi background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/audi-scotland.webp')" }}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-0"
        style={{ background: "linear-gradient(120deg, rgba(245,246,250,0.85) 0%, rgba(245,246,250,0.30) 60%, rgba(245,246,250,0.85) 100%)" }}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-0"
        style={{ background: "linear-gradient(120deg, rgba(245,246,250,0.70) 0%, rgba(251,233,233,0.40) 60%, rgba(245,246,250,0.70) 100%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block bg-[#b42121]/10 text-[#b42121] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Estamos aqui para ajudar
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Contacte-nos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fale connosco por email, telefone, WhatsApp ou pelo formulário abaixo.
              Respondemos <strong>em menos de 24 horas</strong>.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* ── Informações de contacto ── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#b42121] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Os nossos contactos
              </h2>

              <div className="space-y-5">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#b42121]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[#b42121]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Email</p>
                    <a href="mailto:AutoGO.stand@gmail.com" className="text-gray-800 font-medium hover:text-[#b42121] transition-colors">
                      AutoGO.stand@gmail.com
                    </a>
                  </div>
                </div>

                {/* Telefone */}
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#b42121]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[#b42121]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Telefone / WhatsApp</p>
                    <a href="tel:+351935179591" className="text-gray-800 font-medium hover:text-[#b42121] transition-colors">
                      +351 935 179 591
                    </a>
                  </div>
                </div>

                {/* Morada */}
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#b42121]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[#b42121]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Morada</p>
                    <a
                      href="https://www.google.com/maps?q=R.+Rómulo+de+Carvalho+388+SITIO,+4800-019+Guimarães"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 font-medium hover:text-[#b42121] transition-colors"
                    >
                      R. Rómulo de Carvalho 388 SITIO<br />4800-019 Guimarães
                    </a>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/351935179591"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full justify-center py-3 px-5 bg-[#25d366] hover:bg-[#1ebe57] text-white rounded-xl font-bold shadow-md transition-colors duration-200"
                >
                  <img src="/images/whatsapp-logo.webp" alt="WhatsApp" className="w-5 h-5" />
                  Falar no WhatsApp
                </a>

                {/* Business Profile button */}
                <a
                  href="https://www.google.com/search?q=Autogo&tbm=lcl#rlfi=hd:;si:953265091519708215,l,CgZBdXRvZ29I0pLTw-29gIAIWhYQABgAIgZhdXRvZ28qBAgCEAAyAnB0kgEPdXNlZF9jYXJfZGVhbGVy,y,luPQ412DPiQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 hover:border-[#4285F4] hover:text-[#4285F4] text-gray-700 rounded-xl font-semibold text-sm shadow-sm transition-colors duration-200"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Ver Perfil Google
                </a>

                {/* Map */}
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: 400 }}>
                  <iframe
                    title="Localização AutoGo"
                    src="https://storage.googleapis.com/maps-solutions-pzck4o9vqm/locator-plus/vrvt/locator-plus.html"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    aria-label="Mapa com a localização da empresa"
                    style={{ border: 0, display: 'block' }}
                  />
                </div>
              </div>
            </div>

            {/* ── Formulário ── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#b42121] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Envie-nos uma mensagem
              </h2>
              <ContactForm />
            </div>

          </div>

          {/* Info strip */}
          <div className="mt-10 grid sm:grid-cols-3 gap-4 text-center">
            {[
              {
                icon: (
                  <svg className="w-5 h-5 text-[#b42121]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Resposta rápida',
                desc: 'Respondemos em menos de 24h',
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-[#b42121]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Dados seguros',
                desc: 'A sua informação é confidencial',
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-[#b42121]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Baseados em Portugal',
                desc: 'Guimarães, norte de Portugal',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#f9fafb] border border-gray-100 rounded-xl px-5 py-4">
                <div className="flex justify-center mb-2">{icon}</div>
                <div className="font-semibold text-gray-800 text-sm">{title}</div>
                <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
              </div>
            ))}
          </div>

        </div>
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

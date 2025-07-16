import React from 'react';
import MainLayout from "../components/MainLayout";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function SobreNos() {
  return (
    <MainLayout>
      <div>
        {/* Premium red underline accent fixed below navbar, expands on scroll and can go edge to edge */}
        <div id="hero-redline" className="fixed top-[64px] left-0 w-full z-40 pointer-events-none" style={{height:'0'}}>
          <div id="hero-redline-bar" className="w-full flex justify-center">
            <span id="hero-redline-span" className="block h-1.5 rounded-full bg-gradient-to-r from-[#b42121] via-[#d50032] to-[#b42121] opacity-90 shadow-[0_0_16px_4px_rgba(213,0,50,0.18)] animate-pulse transition-all duration-700" style={{width:'16rem', margin:'0 auto'}} />
          </div>
        </div>
        <script dangerouslySetInnerHTML={{__html:`
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
    var maxScroll = Math.max(footerTop - window.innerHeight, 1); // progress=1 when bottom of viewport reaches footer
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
  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
  setTimeout(onScroll, 100);
})();
`}} />
      </div>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ color: '#1a237e' }}>Sobre nós</h1>
        <hr />
        <p>
          A AutoGo.pt é especializada na importação de carros europeus, oferecendo um serviço transparente, rápido e sem complicações. Nossa missão é entregar o carro dos seus sonhos, legalizado e pronto a rolar em Portugal.
        </p>
        {/* Adicione mais conteúdo sobre a empresa, equipa, valores, etc. */}
      </main>
    </MainLayout>
  );}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
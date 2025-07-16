import React, { useState } from 'react';
import Layout from "../components/MainLayout";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { FaUser, FaEnvelope, FaPhone, FaCarSide, FaCalendarAlt, FaEuroSign, FaGasPump, FaCogs, FaList, FaCommentDots, FaWhatsapp } from 'react-icons/fa';

export default function Pedido() {
  const { t } = useTranslation('common');
  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', marcaModelo: '', ano: '', orcamento: '', combustivel: '', caixa: '', extras: '', mensagem: '', whatsapp: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSend(e) {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess(false);
    // TODO: Integrar EmailJS ou backend seguro
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1200);
  }

  return (
    <Layout>
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
`}} />
      <div className="min-h-screen w-full bg-gradient-to-br from-[#f5f6fa] via-[#fbe9e9] to-[#f5f6fa] flex flex-col overflow-x-hidden relative">
        <img src="/images/viaturasfundo.jpg" alt="Fundo" className="pointer-events-none select-none fixed inset-0 w-screen h-screen object-cover opacity-30 z-0 transition-all duration-700" style={{objectPosition: 'center top', filter: 'blur(1px)'}} />
        <div className="pointer-events-none select-none fixed inset-0 w-screen h-screen z-0" style={{background: 'linear-gradient(120deg, rgba(245,246,250,0.95) 0%, rgba(251,233,233,0.85) 60%, rgba(245,246,250,0.95) 100%)'}} />
        <main className="relative z-10 max-w-2xl mx-auto mt-10 mb-16 p-0">
          <h1 className="text-4xl font-extrabold text-center text-black mb-2 drop-shadow-xl tracking-tight">{t('Pedido de Viatura à Medida')}</h1>
          <p className="text-lg text-center text-[#b42121] mb-6 font-medium">{t('Trazemos o carro dos teus sonhos da Europa para Portugal')}</p>
          <div className="bg-white/95 rounded-2xl shadow-2xl border border-[#b42121]/10 backdrop-blur-md p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-[#b42121]">{t('Formulário de Pedido Personalizado')}</h2>
            <form className="flex flex-col gap-4 w-full" onSubmit={handleSend}>
              <div className="flex items-center gap-2">
                <FaUser className="text-[#b42121] text-lg" />
                <input name="nome" required placeholder={t('Nome')} value={form.nome} onChange={handleChange} className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm" />
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-[#b42121] text-lg" />
                <input name="email" type="email" required placeholder={t('Email')} value={form.email} onChange={handleChange} className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm" />
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-[#b42121] text-lg" />
                <input name="telefone" type="tel" placeholder={t('Telefone (WhatsApp)')} value={form.telefone} onChange={handleChange} className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm" />
              </div>
              <div className="flex items-center gap-2">
                <FaCarSide className="text-[#b42121] text-lg" />
                <input name="marcaModelo" required placeholder={t('Marca e Modelo desejado')} value={form.marcaModelo} onChange={handleChange} className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-[#b42121] text-lg" />
                  <input name="ano" type="number" min="2010" max="2026" placeholder={t('Ano de fabrico pretendido')} value={form.ano} onChange={handleChange} className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <FaEuroSign className="text-[#b42121] text-lg" />
                  <input name="orcamento" type="number" min="0" placeholder={t('Orçamento máximo (€)')} value={form.orcamento} onChange={handleChange} className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <FaGasPump className="text-[#b42121] text-lg" />
                  <select name="combustivel" required value={form.combustivel} onChange={handleChange} className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm">
                    <option value="">{t('Tipo de combustível')}</option>
                    <option value="Gasolina">{t('Gasolina')}</option>
                    <option value="Diesel">{t('Diesel')}</option>
                    <option value="Híbrido">{t('Híbrido')}</option>
                    <option value="Elétrico">{t('Elétrico')}</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <FaCogs className="text-[#b42121] text-lg" />
                  <select name="caixa" required value={form.caixa} onChange={handleChange} className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm">
                    <option value="">{t('Caixa de velocidades')}</option>
                    <option value="Manual">{t('Manual')}</option>
                    <option value="Automático">{t('Automático')}</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaList className="text-[#b42121] text-lg" />
                <input name="extras" placeholder={t('Extras pretendidos')} value={form.extras} onChange={handleChange} className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm" />
              </div>
              <div className="flex items-center gap-2">
                <FaCommentDots className="text-[#b42121] text-lg" />
                <textarea name="mensagem" placeholder={t('Mensagem adicional')} value={form.mensagem} onChange={handleChange} className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm min-h-[60px]" />
              </div>
              <label className="flex items-center gap-2 mt-2">
                <input type="checkbox" name="whatsapp" checked={form.whatsapp} onChange={handleChange} className="accent-[#b42121] w-5 h-5" />
                <FaWhatsapp className="text-[#25d366] text-lg" />
                {t('Quero receber opções diretamente no WhatsApp')}
              </label>
              <button type="submit" disabled={loading} className="mt-4 bg-[#b42121] hover:bg-[#a11a1a] text-white font-bold rounded-xl py-3 px-8 shadow-lg transition-all duration-200 text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? t('A enviar...') : t('Pedir Viatura')}
              </button>
              {success && <div className="text-green-700 font-semibold text-center mt-2">{t('Pedido enviado com sucesso! Em breve entramos em contacto.')}</div>}
              {error && <div className="text-red-600 font-semibold text-center mt-2">{error}</div>}
            </form>
          </div>
          {/* Portal de fornecedor */}
          <div className="mt-8 max-w-xl mx-auto p-6 rounded-2xl bg-gray-50 shadow border border-[#b42121]/10">
            <h3 className="text-xl font-semibold mb-2 text-[#b42121]">{t('Acesso ao Stock Europeu')}</h3>
            <p className="mb-3">{t('Explora as viaturas disponíveis em tempo real no nosso portal parceiro:')}</p>
            <a href="https://www.ecarstrade.com/" target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all duration-200 inline-block">{t('Ver Stock Europeu')}</a>
          </div>
          {/* Copy inspiradora */}
          <div className="mt-10 text-center text-gray-700 text-base max-w-2xl mx-auto">
            <p className="mb-2 font-semibold">{t('Procuras um modelo específico? Faz o teu pedido personalizado – tratamos de todo o processo de importação, legalização e entrega em Portugal, sempre com transparência total.')}</p>
            <ul className="list-disc list-inside text-left mx-auto max-w-lg mb-2">
              <li>{t('Serviço premium com garantia incluída')}</li>
              <li>{t('Importação legalizada e pronta a rolar')}</li>
              <li>{t('Entrega em todo o país')}</li>
            </ul>
            <p className="mt-2">{t('Preenche o formulário ou acede ao nosso portal de parceiros para veres o stock europeu disponível.')}</p>
          </div>
        </main>
      </div>
    </Layout>
  );}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCarSide,
  FaCalendarAlt,
  FaEuroSign,
  FaGasPump,
  FaCogs,
  FaList,
  FaCommentDots,
  FaWhatsapp,
} from "react-icons/fa";
import emailjs from "emailjs-com";
import Layout from "../components/MainLayout";
import Seo from "../components/Seo";

export default function Pedido() {
  const { t } = useTranslation("common");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://autogo.pt";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Pedido de viatura importada AutoGo.pt",
    url: `${siteUrl}/pedido`,
    provider: {
      "@type": "Organization",
      name: "AutoGo.pt",
      url: siteUrl,
    },
    areaServed: "PT",
    serviceType: "Importação e legalização de viaturas",
  };
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    marcaModelo: "",
    ano: "",
    orcamento: "",
    combustivel: "",
    caixa: "",
    extras: "",
    mensagem: "",
    whatsapp: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSend(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    emailjs
      .send("service_ngduxdg", "template_1wwfd2v", form, "VzMmXG4l4EqvuhAIl")
      .then(() => {
        setLoading(false);
        setSuccess(true);
      })
      .catch(() => {
        setLoading(false);
        setError("Erro ao enviar. Tente novamente.");
      });
  }

  return (
    <Layout>
      <Seo
        title="Encomendar viatura importada | AutoGo.pt"
        description="Peça a importação da sua próxima viatura com a AutoGo.pt. Preencha o formulário de pedido e tratamos da pesquisa, compra e legalização por si."
        image="/images/auto-logo.png"
        keywords="encomendar carro importado, pedido AutoGo, importação viaturas Portugal"
        structuredData={structuredData}
      />
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
          src="/images/pedido-fundo.jpg"
          alt="Fundo"
          className="pointer-events-none select-none fixed inset-0 w-full h-full object-cover opacity-60 z-0 transition-all duration-700"
          style={{ objectPosition: "center top", filter: "blur(0.5px)" }}
        />
        <div
          className="pointer-events-none select-none fixed inset-0 w-screen h-screen z-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(245,246,250,0.80) 0%, rgba(251,233,233,0.65) 60%, rgba(245,246,250,0.80) 100%)",
          }}
        />
        <main className="relative z-10 max-w-2xl mx-auto mt-10 mb-16 p-0">
          <h1 className="text-4xl font-extrabold text-center text-black mb-2 drop-shadow-xl tracking-tight">
            {t("Pedido de Viatura à Medida")}
          </h1>
          <p className="text-lg text-center text-[#b42121] mb-6 font-medium">
            {t("Trazemos o carro dos teus sonhos da Europa para Portugal")}
          </p>
          <div className="bg-white/95 rounded-2xl shadow-2xl border border-[#b42121]/10 backdrop-blur-md p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-[#b42121]">
              {t("Formulário de Pedido Personalizado")}
            </h2>
            <form className="flex flex-col gap-4 w-full" onSubmit={handleSend}>
              <div className="flex items-center gap-2">
                <FaUser className="text-[#b42121] text-lg" />
                <input
                  name="nome"
                  required
                  aria-label={t("Nome")}
                  placeholder={t("Nome")}
                  value={form.nome}
                  onChange={handleChange}
                  className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-[#b42121] text-lg" />
                <input
                  name="email"
                  type="email"
                  required
                  aria-label={t("Email")}
                  placeholder={t("Email")}
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-[#b42121] text-lg" />
                <input
                  name="telefone"
                  type="tel"
                  aria-label={t("Telefone (WhatsApp)")}
                  placeholder={t("Telefone (WhatsApp)")}
                  value={form.telefone}
                  onChange={handleChange}
                  className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaCarSide className="text-[#b42121] text-lg" />
                <input
                  name="marcaModelo"
                  required
                  aria-label={t("Marca e Modelo desejado")}
                  placeholder={t("Marca e Modelo desejado")}
                  value={form.marcaModelo}
                  onChange={handleChange}
                  className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-[#b42121] text-lg" />
                  <input
                    name="ano"
                    type="number"
                    min="2010"
                    max="2026"
                    aria-label={t("Ano de fabrico pretendido")}
                    placeholder={t("Ano de fabrico pretendido")}
                    value={form.ano}
                    onChange={handleChange}
                    className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FaEuroSign className="text-[#b42121] text-lg" />
                  <input
                    name="orcamento"
                    type="number"
                    min="0"
                    aria-label={t("Orçamento máximo (€)")}
                    placeholder={t("Orçamento máximo (€)")}
                    value={form.orcamento}
                    onChange={handleChange}
                    className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <FaGasPump className="text-[#b42121] text-lg" />
                  <select
                    name="combustivel"
                    required
                    aria-label={t("Tipo de combustível")}
                    value={form.combustivel}
                    onChange={handleChange}
                    className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                  >
                    <option value="">{t("Tipo de combustível")}</option>
                    <option value="Gasolina">{t("Gasolina")}</option>
                    <option value="Diesel">{t("Diesel")}</option>
                    <option value="Híbrido">{t("Híbrido")}</option>
                    <option value="Elétrico">{t("Elétrico")}</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <FaCogs className="text-[#b42121] text-lg" />
                  <select
                    name="caixa"
                    required
                    aria-label={t("Caixa de velocidades")}
                    value={form.caixa}
                    onChange={handleChange}
                    className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                  >
                    <option value="">{t("Caixa de velocidades")}</option>
                    <option value="Manual">{t("Manual")}</option>
                    <option value="Automático">{t("Automático")}</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaList className="text-[#b42121] text-lg" />
                <input
                  name="extras"
                  aria-label={t("Extras pretendidos")}
                  placeholder={t("Extras pretendidos")}
                  value={form.extras}
                  onChange={handleChange}
                  className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaCommentDots className="text-[#b42121] text-lg" />
                <textarea
                  name="mensagem"
                  aria-label={t("Mensagem adicional")}
                  placeholder={t("Mensagem adicional")}
                  value={form.mensagem}
                  onChange={handleChange}
                  className="flex-1 rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm min-h-[60px]"
                />
              </div>
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  name="whatsapp"
                  aria-label={t("Quero receber opções diretamente no WhatsApp")}
                  checked={form.whatsapp}
                  onChange={handleChange}
                  className="accent-[#b42121] w-5 h-5"
                />
                <FaWhatsapp className="text-[#25d366] text-lg" />
                {t("Quero receber opções diretamente no WhatsApp")}
              </label>
              <button
                type="submit"
                aria-label={loading ? t("A enviar...") : t("Pedir Viatura")}
                disabled={loading}
                className="mt-4 bg-[#b42121] hover:bg-[#a11a1a] text-white font-bold rounded-xl py-3 px-8 shadow-lg transition-all duration-200 text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                )}
                {loading ? t("A enviar...") : t("Pedir Viatura")}
              </button>
              {success && (
                <div className="text-green-700 font-semibold text-center mt-2">
                  {t(
                    "Pedido enviado com sucesso! Em breve entramos em contacto.",
                  )}
                </div>
              )}
              {error && (
                <div className="text-red-600 font-semibold text-center mt-2">
                  {error}
                </div>
              )}
            </form>
          </div>
          {/* 'Portal de fornecedor' removed: external API not available yet */}
          {/* Copy inspiradora */}
          <div className="text-center text-gray-700 text-base max-w-2xl mx-auto mt-8">
            <p className="mb-2 font-semibold">
              {t(
                "Procuras um modelo específico? Faz o teu pedido personalizado – tratamos de todo o processo de importação, legalização e entrega em Portugal, sempre com transparência total.",
              )}
            </p>
            <ul className="list-disc list-inside text-left mx-auto max-w-lg mb-2">
              <li>{t("Serviço premium com garantia incluída")}</li>
              <li>{t("Importação legalizada e pronta a rolar")}</li>
              <li>{t("Entrega em todo o país")}</li>
            </ul>
            <p className="mt-2">
              {t(
                "Preenche o formulário ou acede ao nosso portal de parceiros para veres o stock europeu disponível.",
              )}
            </p>
            <p className="mt-4">
              <a
                href="mailto:AutoGO.stand@gmail.com"
                className="text-[#b42121] underline font-semibold hover:text-[#a11a1a] transition"
              >
                Contactar por email: AutoGO.stand@gmail.com
              </a>
            </p>
          </div>
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

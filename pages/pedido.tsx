import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Layout from "../components/MainLayout";
import Seo from "../components/Seo";
import { SITE_WIDE_KEYWORDS, SEO_KEYWORDS, joinKeywords } from "../utils/seoKeywords";

export default function Pedido() {
  const { t } = useTranslation("common");
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
    try {
      const emailjs = (await import("emailjs-com")).default;
      await emailjs.send("service_ngduxdg", "template_1wwfd2v", form, "VzMmXG4l4EqvuhAIl");
      setSuccess(true);
      setForm({ nome: "", email: "", telefone: "", marcaModelo: "", ano: "", orcamento: "", combustivel: "", caixa: "", extras: "", mensagem: "", whatsapp: false });
    } catch {
      setError("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b42121]/40 focus:border-[#b42121] bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <Layout>
      <Seo
        title={SEO_KEYWORDS.pedido.title ?? 'Pedir Importação | AutoGo.pt'}
        description={SEO_KEYWORDS.pedido.description ?? ''}
        url="https://autogo.pt/pedido"
        keywords={joinKeywords(SEO_KEYWORDS.pedido.keywords ?? [], SITE_WIDE_KEYWORDS)}
      />

      {/* Red accent bar */}
      <div className="fixed top-[64px] left-0 w-full z-40 pointer-events-none">
        <span className="block h-1.5 bg-gradient-to-r from-[#b42121] via-[#d50032] to-[#b42121] opacity-90" />
      </div>

      {/* Full-screen background image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/pedido-fundo.webp')" }}
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
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block bg-[#b42121]/10 text-[#b42121] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Serviço chave-na-mão
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {t("Pedido de Viatura à Medida")}
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              {t("Trazemos o carro dos teus sonhos da Europa para Portugal")} —{" "}
              <strong>tratamos de tudo</strong>.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* ── Sidebar info ── */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <h2 className="text-base font-bold text-gray-800 mb-4">O que está incluído</h2>
                <ul className="space-y-3 text-sm text-gray-600">
                  {[
                    "Pesquisa e seleção do veículo",
                    "Negociação de preço com o vendedor",
                    "Inspeção prévia ao carro",
                    "Transporte até Portugal",
                    "Cálculo e pagamento do ISV",
                    "Inspeção tipo B + homologação IMT",
                    "Matrícula portuguesa",
                    "Entrega pronto a circular",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-[#b42121] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="https://wa.me/351935179591"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-5 bg-[#25d366] hover:bg-[#1ebe57] text-white rounded-xl font-bold shadow-md transition-colors duration-200"
              >
                <img src="/images/whatsapp-logo.webp" alt="WhatsApp" className="w-5 h-5" />
                Falar no WhatsApp
              </a>

              <div className="bg-[#f9fafb] border border-gray-100 rounded-xl px-5 py-4 text-center">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Prazo médio</div>
                <div className="text-2xl font-bold text-gray-900">3–6 semanas</div>
                <div className="text-xs text-gray-500 mt-0.5">da pesquisa à entrega</div>
              </div>
            </div>

            {/* ── Form card ── */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#b42121] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Formulário de Pedido
              </h2>

              <form onSubmit={handleSend} className="space-y-5">

                {/* Nome */}
                <div>
                  <label htmlFor="nome" className={labelClass}>Nome *</label>
                  <input id="nome" name="nome" type="text" required className={inputClass}
                    value={form.nome} onChange={handleChange} placeholder="O seu nome" autoComplete="name" />
                </div>

                {/* Email + Telefone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className={labelClass}>Email *</label>
                    <input id="email" name="email" type="email" required className={inputClass}
                      value={form.email} onChange={handleChange} placeholder="O seu email" autoComplete="email" />
                  </div>
                  <div>
                    <label htmlFor="telefone" className={labelClass}>Telemóvel</label>
                    <input id="telefone" name="telefone" type="tel" className={inputClass}
                      value={form.telefone} onChange={handleChange} placeholder="+351 9XX XXX XXX" autoComplete="tel" />
                  </div>
                </div>

                {/* Marca / Modelo */}
                <div>
                  <label htmlFor="marcaModelo" className={labelClass}>Marca e Modelo desejado *</label>
                  <input id="marcaModelo" name="marcaModelo" type="text" required className={inputClass}
                    value={form.marcaModelo} onChange={handleChange} placeholder="ex: BMW Série 3, Volkswagen Golf…" />
                </div>

                {/* Ano + Orçamento */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ano" className={labelClass}>Ano (mínimo)</label>
                    <input id="ano" name="ano" type="number" min="2010" max="2026" className={inputClass}
                      value={form.ano} onChange={handleChange} placeholder="ex: 2020" />
                  </div>
                  <div>
                    <label htmlFor="orcamento" className={labelClass}>Orçamento máximo (€)</label>
                    <input id="orcamento" name="orcamento" type="number" min="0" className={inputClass}
                      value={form.orcamento} onChange={handleChange} placeholder="ex: 25000" />
                  </div>
                </div>

                {/* Combustível + Caixa */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="combustivel" className={labelClass}>Combustível *</label>
                    <select id="combustivel" name="combustivel" required className={inputClass}
                      value={form.combustivel} onChange={handleChange}>
                      <option value="">Selecionar…</option>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Elétrico">Elétrico</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="caixa" className={labelClass}>Caixa *</label>
                    <select id="caixa" name="caixa" required className={inputClass}
                      value={form.caixa} onChange={handleChange}>
                      <option value="">Selecionar…</option>
                      <option value="Manual">Manual</option>
                      <option value="Automático">Automático</option>
                    </select>
                  </div>
                </div>

                {/* Extras */}
                <div>
                  <label htmlFor="extras" className={labelClass}>Extras pretendidos</label>
                  <input id="extras" name="extras" type="text" className={inputClass}
                    value={form.extras} onChange={handleChange} placeholder="ex: teto de abrir, navegação, câmara de ré…" />
                </div>

                {/* Mensagem */}
                <div>
                  <label htmlFor="mensagem" className={labelClass}>Informação adicional</label>
                  <textarea id="mensagem" name="mensagem" rows={3} className={inputClass}
                    value={form.mensagem} onChange={handleChange} placeholder="Cor preferida, observações, urgência…" />
                </div>

                {/* WhatsApp checkbox */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" name="whatsapp" checked={form.whatsapp} onChange={handleChange}
                    className="w-4 h-4 accent-[#b42121] rounded" />
                  <span className="text-sm text-gray-700">Quero receber opções diretamente no WhatsApp</span>
                </label>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm" role="alert">
                    {error}
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2" role="status">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Pedido enviado com sucesso! Em breve entramos em contacto.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#b42121] hover:bg-[#9a1c1c] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading && (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  )}
                  {loading ? "A enviar…" : "Enviar Pedido"}
                </button>

              </form>
            </div>

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

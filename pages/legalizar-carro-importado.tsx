import { useState } from "react";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "../components/MainLayout";
import Seo from "../components/Seo";
import { SITE_WIDE_KEYWORDS, SEO_KEYWORDS, joinKeywords } from "../utils/seoKeywords";

// ─── JSON-LD ────────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Legalização de Carros Importados em Portugal",
      serviceType: "Legalização Automóvel",
      provider: {
        "@type": "LocalBusiness",
        name: "AutoGo",
        url: "https://autogo.pt",
        telephone: "+351935179591",
        address: {
          "@type": "PostalAddress",
          streetAddress: "R. Rómulo de Carvalho 388 SITIO",
          addressLocality: "Guimarães",
          postalCode: "4800-019",
          addressCountry: "PT",
        },
      },
      areaServed: "Portugal",
      description:
        "Serviço completo de legalização de carros importados em Portugal: DAV nas Finanças, inspeção Modelo 112, CoC, homologação IMT e matrícula portuguesa. Sem filas, sem erros.",
      url: "https://autogo.pt/legalizar-carro-importado",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", description: "Orçamento gratuito" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://autogo.pt" },
        { "@type": "ListItem", position: 2, name: "Importar Carros Portugal", item: "https://autogo.pt/importar-carros-portugal" },
        { "@type": "ListItem", position: 3, name: "Legalizar Carro Importado", item: "https://autogo.pt/legalizar-carro-importado" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Tenho prazo para legalizar o carro importado?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Após a entrada do veículo em Portugal, tem 20 dias úteis para iniciar o processo de legalização junto das Finanças (DAV). Ultrapassado este prazo, pode ser sujeito a coimas e juros compensatórios sobre o ISV em falta.",
          },
        },
        {
          "@type": "Question",
          name: "O que acontece se não legalizar o carro a tempo?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Circular com um carro estrangeiro sem legalização em Portugal pode resultar em coima por parte da GNR/PSP, apreensão do veículo e penalizações fiscais nas Finanças. O processo de legalização deve ser iniciado no prazo legal após a entrada do carro no país.",
          },
        },
        {
          "@type": "Question",
          name: "Posso conduzir o carro antes de ter matrícula portuguesa?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Durante o processo de legalização, pode circular com a matrícula de origem e o comprovativo de entrada no processo junto das Finanças. Contudo, não é recomendado conduzir sem confirmar com um especialista, pois as condições variam consoante o país de origem do veículo.",
          },
        },
        {
          "@type": "Question",
          name: "O que é a DAV e onde se faz?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A DAV (Declaração Aduaneira de Veículos) é o documento fiscal que despoleta o cálculo e pagamento do ISV. É submetida no Portal das Finanças ou presencialmente num serviço de finanças. Após a liquidação do ISV (10 dias úteis), é emitido o DUV que permite prosseguir com a inspeção e matrícula no IMT.",
          },
        },
        {
          "@type": "Question",
          name: "Preciso do CoC obrigatoriamente?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "O Certificado de Conformidade (CoC) é exigido pelo IMT para a homologação do veículo em Portugal. Sem ele, o processo de legalização não avança. Se não tiver o CoC, a AutoGo pode obtê-lo junto do fabricante ou representante autorizado por si.",
          },
        },
        {
          "@type": "Question",
          name: "Posso ter isenção de ISV por mudança de residência?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Cidadãos que transfiram residência para Portugal podem beneficiar de isenção total ou parcial de ISV, desde que o veículo esteja registado em seu nome há mais de 6 meses no país de origem e seja para uso pessoal. A AutoGo avalia a sua situação e prepara toda a documentação necessária.",
          },
        },
      ],
    },
  ],
};

// ─── Inline form ─────────────────────────────────────────────────────────────
function LegatizationForm() {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", viatura: "", situacao: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const emailjs = (await import("emailjs-com")).default;
      await emailjs.send(
        "service_ngduxdg",
        "template_1wwfd2v",
        {
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
          marcaModelo: form.viatura,
          orcamento: form.situacao,
          mensagem: `Pedido via landing page legalizar-carro-importado`,
        },
        "VzMmXG4l4EqvuhAIl"
      );
      setSuccess(true);
      setForm({ nome: "", email: "", telefone: "", viatura: "", situacao: "" });
    } catch {
      setError("Erro ao enviar. Por favor tente novamente ou contacte-nos pelo WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b42121]/40 focus:border-[#b42121] bg-white text-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-xl font-bold text-green-700 mb-2">Pedido recebido!</p>
        <p className="text-green-600 text-sm">
          Entraremos em contacto em menos de 24 horas com o seu orçamento de legalização.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nome *</label>
          <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="O seu nome" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@exemplo.com" required className={inputClass} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Telemóvel *</label>
          <input type="tel" name="telefone" value={form.telefone} onChange={handleChange} placeholder="+351 9XX XXX XXX" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Situação atual</label>
          <select name="situacao" value={form.situacao} onChange={handleChange} className={inputClass}>
            <option value="">Selecione</option>
            <option value="Já tenho o carro em Portugal">Já tenho o carro em Portugal</option>
            <option value="Vou importar em breve">Vou importar em breve</option>
            <option value="Estou a considerar importar">Estou a considerar importar</option>
            <option value="Mudança de residência">Mudança de residência (possível isenção ISV)</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Viatura (marca, modelo, ano)</label>
        <input type="text" name="viatura" value={form.viatura} onChange={handleChange} placeholder="ex: BMW 320d 2020, Alemanha" className={inputClass} />
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#b42121] hover:bg-[#9a1c1c] disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-xl transition-colors duration-200 shadow-md text-base"
      >
        {loading ? "A enviar…" : "Pedir Orçamento de Legalização Grátis"}
      </button>
      <p className="text-xs text-gray-400 text-center">Sem compromisso. Resposta em menos de 24 horas.</p>
    </form>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function LegalizarCarroImportado() {
  const processSteps = [
    {
      n: "01",
      title: "Inspeção Técnica (Modelo 112)",
      desc: "Primeira obrigação ao entrar em Portugal. Realizada num centro de inspeções aprovado — verifica se o veículo cumpre as normas técnicas nacionais.",
      detalhe: "~€128 · 1–3 dias úteis",
    },
    {
      n: "02",
      title: "Certificado de Conformidade (CoC)",
      desc: "Documento emitido pelo fabricante que certifica que o veículo foi produzido em conformidade com a homologação europeia. Exigido pelo IMT.",
      detalhe: "€100–€250 · 5–15 dias (se não tiver)",
    },
    {
      n: "03",
      title: "Declaração Aduaneira de Veículos (DAV)",
      desc: "Submetida no Portal das Finanças. Despoleta o cálculo do ISV com base na cilindrada, emissões CO₂ e ano de matrícula do veículo.",
      detalhe: "Gratuito · imediato",
    },
    {
      n: "04",
      title: "Pagamento do ISV",
      desc: "Após emissão da nota de liquidação pelas Finanças, o ISV deve ser pago no prazo de 10 dias úteis. O valor varia entre €500 e €10.000+ conforme o veículo.",
      detalhe: "€500–€10.000+ · 10 dias úteis",
    },
    {
      n: "05",
      title: "Homologação no IMT",
      desc: "Com o CoC e o comprovativo de pagamento do ISV, é submetido o pedido de homologação nacional no IMT. Atribui número de homologação português.",
      detalhe: "~€55 · 2–5 dias",
    },
    {
      n: "06",
      title: "Registo e Matrícula Portuguesa",
      desc: "Última etapa: emissão do Documento Único Automóvel (DUA) com matrícula portuguesa. O carro fica totalmente legalizado e pronto a circular.",
      detalhe: "€25–€40 (chapas) · 1–2 dias",
    },
  ];

  const costs = [
    { label: "DAV (Portal das Finanças)", estimate: "Gratuito", highlight: false },
    { label: "Inspeção Técnica Modelo 112", estimate: "~€128", note: "Obrigatória antes da homologação" },
    { label: "CoC (se não tiver)", estimate: "€100 – €250", note: "Via fabricante ou representante" },
    { label: "ISV", estimate: "€500 – €10.000+", note: "Maior variável — depende do motor e emissões", highlight: true },
    { label: "Registo IMT", estimate: "~€55", note: "Taxa de registo nacional" },
    { label: "Matrícula portuguesa", estimate: "€25 – €40", note: "Chapas incluídas" },
    { label: "Taxa urgência (se aplicável)", estimate: "€50 – €150", note: "Processamento prioritário" },
  ];

  const prazos = [
    { etapa: "Inspeção técnica", prazo: "1–3 dias" },
    { etapa: "Emissão CoC (se necessário)", prazo: "5–15 dias" },
    { etapa: "DAV + Liquidação ISV", prazo: "10 dias úteis" },
    { etapa: "Homologação IMT", prazo: "2–5 dias" },
    { etapa: "Registo e matrícula", prazo: "1–2 dias" },
    { etapa: "Total estimado", prazo: "3–5 semanas", bold: true },
  ];

  const faqs = [
    {
      q: "Tenho prazo para legalizar o carro importado?",
      a: "Sim. Após a entrada do veículo em Portugal, tem 20 dias úteis para iniciar o processo de legalização junto das Finanças (DAV). Ultrapassado este prazo, pode ser sujeito a coimas e juros compensatórios sobre o ISV em falta.",
    },
    {
      q: "O que acontece se não legalizar o carro a tempo?",
      a: "Circular com um carro estrangeiro sem legalização em Portugal pode resultar em coima por parte da GNR/PSP, apreensão do veículo e penalizações fiscais nas Finanças. O processo de legalização deve ser iniciado no prazo legal após a entrada do carro no país.",
    },
    {
      q: "Posso conduzir o carro antes de ter matrícula portuguesa?",
      a: "Durante o processo de legalização, pode circular com a matrícula de origem e o comprovativo de entrada no processo junto das Finanças. Contudo, não é recomendado conduzir sem confirmar com um especialista, pois as condições variam consoante o país de origem do veículo.",
    },
    {
      q: "O que é a DAV e onde se faz?",
      a: "A DAV (Declaração Aduaneira de Veículos) é o documento fiscal que despoleta o cálculo e pagamento do ISV. É submetida no Portal das Finanças ou presencialmente num serviço de finanças. Após a liquidação do ISV (10 dias úteis), é emitido o DUV que permite prosseguir com a inspeção e matrícula no IMT.",
    },
    {
      q: "Preciso do CoC obrigatoriamente?",
      a: "O Certificado de Conformidade (CoC) é exigido pelo IMT para a homologação do veículo em Portugal. Sem ele, o processo de legalização não avança. Se não tiver o CoC, a AutoGo pode obtê-lo junto do fabricante ou representante autorizado por si.",
    },
    {
      q: "Posso ter isenção de ISV por mudança de residência?",
      a: "Sim. Cidadãos que transfiram residência para Portugal podem beneficiar de isenção total ou parcial de ISV, desde que o veículo esteja registado em seu nome há mais de 6 meses no país de origem e seja para uso pessoal. A AutoGo avalia a sua situação e prepara toda a documentação necessária.",
    },
  ];

  return (
    <MainLayout>
      <Seo
        title={SEO_KEYWORDS.legalizar_carro_importado?.title ?? "Legalizar Carro Importado em Portugal 2026 | Serviço Completo | AutoGo.pt"}
        description={SEO_KEYWORDS.legalizar_carro_importado?.description ?? ""}
        url="https://autogo.pt/legalizar-carro-importado"
        keywords={joinKeywords(SEO_KEYWORDS.legalizar_carro_importado?.keywords ?? [], SITE_WIDE_KEYWORDS)}
        jsonLd={jsonLd}
      />

      {/* Red accent bar */}
      <div className="fixed top-[64px] left-0 w-full z-40 pointer-events-none">
        <span className="block h-1.5 bg-gradient-to-r from-[#b42121] via-[#d50032] to-[#b42121] opacity-90" />
      </div>

      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/viaturasfundo.webp')" }}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-0"
        style={{ background: "linear-gradient(120deg, rgba(245,246,250,0.96) 0%, rgba(245,246,250,0.50) 60%, rgba(245,246,250,0.96) 100%)" }}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-0"
        style={{ background: "linear-gradient(120deg, rgba(245,246,250,0.85) 0%, rgba(251,233,233,0.20) 60%, rgba(245,246,250,0.85) 100%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 min-h-screen">

        {/* ── HERO ── */}
        <section className="pt-28 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav className="flex justify-center gap-2 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#b42121] transition-colors">Início</Link>
              <span>›</span>
              <Link href="/importar-carros-portugal" className="hover:text-[#b42121] transition-colors">Importar Carros</Link>
              <span>›</span>
              <span className="text-gray-500">Legalizar Carro Importado</span>
            </nav>

            <span className="inline-block bg-[#b42121]/10 text-[#b42121] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
              Legalização Rápida · 2026
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Legalizar Carros Importados em Portugal —{" "}
              <span className="text-[#b42121]">Serviço Completo</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Já tem o carro ou está prestes a importar? A AutoGo trata de toda a legalização —{" "}
              <strong>DAV nas Finanças, inspeção, CoC, IMT e matrícula portuguesa.</strong>{" "}
              Sem filas, sem erros, sem stress.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a
                href="#orcamento"
                className="bg-[#b42121] hover:bg-[#9a1c1c] text-white font-bold py-4 px-8 rounded-xl text-base transition-colors shadow-lg"
              >
                Pedir Orçamento de Legalização
              </a>
              <a
                href="#documentos"
                className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 px-8 rounded-xl text-base transition-colors shadow-lg border border-gray-200"
              >
                Ver Documentos Necessários
              </a>
            </div>

            {/* Cross-link alert — "Ainda não importaste?" */}
            <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 text-sm text-gray-700">
              <span>Ainda não importaste?</span>
              <Link href="/importar-carros-portugal" className="text-[#b42121] font-bold hover:underline">
                Ver serviço de importação completo →
              </Link>
            </div>
          </div>
        </section>

        {/* ── PROCESSO TÉCNICO ── */}
        <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
              Como Funciona a Legalização Passo a Passo
            </h2>
            <p className="text-center text-gray-500 text-sm mb-12 max-w-2xl mx-auto">
              6 etapas obrigatórias para legalizar um carro estrangeiro em Portugal — a AutoGo trata de todas elas por si.
            </p>
            <div className="space-y-4">
              {processSteps.map((s) => (
                <div
                  key={s.n}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex gap-4 items-start transition-all duration-200 hover:shadow-md hover:border-[#b42121]/30 hover:-translate-y-0.5"
                >
                  <span className="w-10 h-10 flex-shrink-0 bg-[#b42121] text-white rounded-xl flex items-center justify-center font-black text-xs">
                    {s.n}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <p className="font-bold text-gray-800">{s.title}</p>
                      <span className="text-xs font-semibold text-[#b42121] bg-[#b42121]/5 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {s.detalhe}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CUSTOS ── */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
              Custos de Legalização de Carro Importado
            </h2>
            <p className="text-center text-gray-500 text-sm mb-10 max-w-2xl mx-auto">
              Apenas os custos burocráticos — transparentes e sem surpresas. O ISV é a maior variável e depende do veículo.
            </p>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="hidden sm:grid grid-cols-3 bg-gray-50 border-b border-gray-200 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span>Custo</span>
                <span className="text-center">Valor</span>
                <span className="text-right">Notas</span>
              </div>
              {costs.map((c, i) => (
                <div
                  key={i}
                  className={`grid sm:grid-cols-3 gap-1 sm:gap-0 px-6 py-4 border-b border-gray-100 last:border-0 items-center ${c.highlight ? "bg-[#b42121]/5" : ""}`}
                >
                  <div className="font-semibold text-gray-800 text-sm">{c.label}</div>
                  <div className={`text-center font-bold text-base ${c.highlight ? "text-[#b42121]" : "text-gray-700"}`}>{c.estimate}</div>
                  <div className="text-right text-xs text-gray-400">{c.note ?? ""}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-700 text-sm font-medium">
                Calcule o ISV do seu veículo antes de importar — grátis e instantâneo
              </p>
              <Link
                href="/simulador-isv"
                className="flex-shrink-0 bg-[#b42121] hover:bg-[#9a1c1c] text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-colors shadow"
              >
                Simulador ISV →
              </Link>
            </div>
          </div>
        </section>

        {/* ── PRAZOS ── */}
        <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
              Quanto Tempo Demora a Legalização?
            </h2>
            <p className="text-center text-gray-500 text-sm mb-10">
              Prazos médios para cada etapa do processo — contando que toda a documentação está em ordem.
            </p>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="hidden sm:grid grid-cols-2 bg-gray-50 border-b border-gray-200 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span>Etapa</span>
                <span className="text-right">Prazo Médio</span>
              </div>
              {prazos.map((p, i) => (
                <div
                  key={i}
                  className={`grid sm:grid-cols-2 gap-1 sm:gap-0 px-6 py-4 border-b border-gray-100 last:border-0 items-center ${p.bold ? "bg-gray-50 border-t-2 border-gray-200" : ""}`}
                >
                  <div className={`text-sm ${p.bold ? "font-bold text-gray-800" : "font-medium text-gray-700"}`}>{p.etapa}</div>
                  <div className={`text-right text-sm ${p.bold ? "font-black text-[#b42121]" : "font-semibold text-gray-600"}`}>{p.prazo}</div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
              * Prazos estimados. Atrasos na emissão do CoC ou na liquidação do ISV podem prolongar o processo.
            </p>
          </div>
        </section>

        {/* ── DOCUMENTOS ── */}
        <section id="documentos" className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
              Documentos Necessários para Legalizar Carro Estrangeiro
            </h2>
            <p className="text-center text-gray-500 text-sm mb-10">
              Tenha estes documentos preparados antes de iniciar o processo.
            </p>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-3">
              {[
                { doc: "Contrato de compra e venda do veículo", obg: true },
                { doc: "Título de registo do país de origem", obg: true },
                { doc: "Certificado de Conformidade (CoC)", obg: true },
                { doc: "Documento de identificação do proprietário (CC/NIF)", obg: true },
                { doc: "Comprovativo de morada em Portugal", obg: true },
                { doc: "Relatório de inspeção técnica (Modelo 112)", obg: true },
                { doc: "Comprovativo de pagamento do ISV (DUV das Finanças)", obg: true },
                { doc: "Procuração (se a AutoGo agir em seu nome)", obg: false },
              ].map(({ doc, obg }) => (
                <div key={doc} className="flex items-start gap-3">
                  <span className={`w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${obg ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    {obg ? "✓" : "○"}
                  </span>
                  <p className="text-gray-700 text-sm">
                    {doc}
                    {!obg && <span className="ml-2 text-xs text-gray-400">(se aplicável)</span>}
                  </p>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">A AutoGo orienta, obtém e verifica toda a documentação por si.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Perguntas Frequentes — Legalização de Carros Importados
            </h2>
            <div className="space-y-4">
              {faqs.map(({ q, a }, i) => (
                <details key={i} className="bg-blue-50 border border-blue-200 rounded-2xl overflow-hidden group">
                  <summary className="flex justify-between items-center px-5 py-4 cursor-pointer font-semibold text-gray-800 hover:bg-blue-100 transition-colors list-none">
                    <span>{q}</span>
                    <svg className="w-5 h-5 text-blue-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 py-4 text-gray-600 text-sm leading-relaxed bg-blue-50 border-t border-blue-200">{a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL + FORM ── */}
        <section id="orcamento" className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Pronto para Legalizar o Seu Carro?
              </h2>
              <p className="text-gray-600">
                Deixe os dados do veículo e da sua situação. A AutoGo prepara o orçamento de legalização em menos de 24 horas — sem compromisso.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
              <LegatizationForm />
            </div>
          </div>
        </section>

        {/* ── Internal links ── */}
        <section className="py-10 px-4 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-xs text-gray-900 mb-6 uppercase tracking-widest">Explore mais</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { href: "/importar-carros-portugal", label: "Importar Carros Portugal" },
                { href: "/simulador-isv", label: "Simulador ISV 2026" },
                { href: "/simulador-iuc", label: "Simulador IUC 2026" },
                { href: "/viaturas", label: "Carros em Stock" },
                { href: "/pedido", label: "Encomendar Viatura" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-[#b42121] hover:border-[#b42121]/30 transition-colors shadow-sm"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Breadcrumb bottom */}
        <div className="pb-10 flex flex-wrap gap-3 justify-center text-sm text-gray-900">
          <Link href="/" className="hover:text-[#b42121] transition-colors">Início</Link>
          <span>·</span>
          <Link href="/importar-carros-portugal" className="hover:text-[#b42121] transition-colors">Importar Carros</Link>
          <span>·</span>
          <Link href="/simulador-isv" className="hover:text-[#b42121] transition-colors">Simulador ISV</Link>
          <span>·</span>
          <Link href="/como-funciona" className="hover:text-[#b42121] transition-colors">Como Funciona</Link>
        </div>

      </div>
    </MainLayout>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

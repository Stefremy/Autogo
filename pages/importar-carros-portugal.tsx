import { useState } from "react";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "../components/MainLayout";
import Seo from "../components/Seo";
import { SITE_WIDE_KEYWORDS, joinKeywords } from "../utils/seoKeywords";

// ─── JSON-LD ────────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Importação de Carros para Portugal",
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
      serviceType: "Importação Automóvel",
      areaServed: "Portugal",
      description:
        "Serviço chave-na-mão de importação e legalização de carros importados da Europa para Portugal. Especialistas em carros usados, elétricos e premium.",
      url: "https://autogo.pt/importar-carros-portugal",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://autogo.pt" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Importar Carros Portugal",
          item: "https://autogo.pt/importar-carros-portugal",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Compensa importar carros usados da Europa para Portugal?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Os carros usados importados da Europa chegam em média 20–40% mais baratos face ao mercado nacional, especialmente modelos premium da Alemanha, Bélgica e Holanda.",
          },
        },
        {
          "@type": "Question",
          name: "Quais são os carros para importar mais procurados em 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Os modelos mais procurados para importar em 2026 são BMW Série 3 e 5, Mercedes Classe C e E, Audi A4 e A6, Volkswagen Golf e Passat, e elétricos como BMW iX e Tesla Model 3.",
          },
        },
        {
          "@type": "Question",
          name: "Como legalizar um carro estrangeiro em Portugal?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Para legalizar um carro estrangeiro em Portugal é necessário: inspeção técnica (Modelo 112), Certificado de Conformidade (CoC), Declaração Aduaneira (DAV) nas Finanças, pagamento do ISV e registo no IMT. A AutoGo trata de todo este processo por si.",
          },
        },
        {
          "@type": "Question",
          name: "É possível importar carros elétricos para Portugal?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Importar carros elétricos para Portugal é especialmente vantajoso — têm reduções significativas no ISV e a diferença de preço face ao mercado nacional pode ser considerável.",
          },
        },
        {
          "@type": "Question",
          name: "Quanto custa a importação de carros?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "O custo de importação de carros inclui: transporte (€500–€1.500), inspeção técnica (~€128), CoC (€100–€250), registo e matrícula (~€80) e ISV (€500–€10.000+ conforme o motor e emissões). Use o nosso simulador para calcular o ISV exato.",
          },
        },
        {
          "@type": "Question",
          name: "Os carros importados em Portugal têm garantia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Todos os veículos importados pela AutoGo são inspecionados antes da entrega e podem incluir garantia. Os carros novos mantêm a garantia de fábrica do fabricante.",
          },
        },
      ],
    },
  ],
};

const LANDING_KEYWORDS = [
  "importar carros portugal",
  "importação de carros portugal 2026",
  "importar carro alemanha portugal",
  "carros importados portugal",
  "carros para importar",
  "importar carros usados",
  "importar carros elétricos",
  "legalizar carro importado portugal",
  "legalizar carro estrangeiro",
  "custo importar carro portugal",
  "isv importação",
  "comprar carro na alemanha",
];

// ─── Inline form component ───────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    modelo: "",
    orcamento: "",
  });
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
          marcaModelo: form.modelo,
          orcamento: form.orcamento,
          mensagem: `Pedido via landing page importar-carros-portugal`,
        },
        "VzMmXG4l4EqvuhAIl"
      );
      setSuccess(true);
      setForm({ nome: "", email: "", telefone: "", modelo: "", orcamento: "" });
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
          Entraremos em contacto em menos de 24 horas com a sua proposta personalizada.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nome *</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="O seu nome"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@exemplo.com"
            required
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Telemóvel *</label>
          <input
            type="tel"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="+351 9XX XXX XXX"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Orçamento disponível</label>
          <select name="orcamento" value={form.orcamento} onChange={handleChange} className={inputClass}>
            <option value="">Selecione um intervalo</option>
            <option value="Até €10.000">Até €10.000</option>
            <option value="€10.000 – €20.000">€10.000 – €20.000</option>
            <option value="€20.000 – €35.000">€20.000 – €35.000</option>
            <option value="€35.000 – €50.000">€35.000 – €50.000</option>
            <option value="Mais de €50.000">Mais de €50.000</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Modelo pretendido</label>
        <input
          type="text"
          name="modelo"
          value={form.modelo}
          onChange={handleChange}
          placeholder="ex: BMW Série 3, Mercedes Classe C, Audi A4…"
          className={inputClass}
        />
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#b42121] hover:bg-[#9a1c1c] disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-xl transition-colors duration-200 shadow-md text-base"
      >
        {loading ? "A enviar…" : "Quero a Minha Proposta Grátis"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Sem compromisso. Resposta em menos de 24 horas.
      </p>
    </form>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ImportarCarrosPortugal() {
  const steps = [
    {
      num: "1",
      title: "Escolhe o Carro",
      desc: "Diz-nos o modelo, ano e orçamento. Encontramos os melhores carros para importar nos mercados europeus.",
    },
    {
      num: "2",
      title: "Nós Tratamos de Tudo",
      desc: "Transporte, inspeção, ISV, homologação e matrícula — sem burocracia da sua parte.",
    },
    {
      num: "3",
      title: "Recebe em Casa",
      desc: "Entrega em Guimarães ou em qualquer ponto de Portugal com toda a documentação em ordem.",
    },
  ];

  const costs = [
    { label: "Transporte da Alemanha", estimate: "€500 – €1.500", note: "Depende da distância e tipo de veículo" },
    { label: "Inspeção Técnica", estimate: "~€128", note: "Obrigatória para matrícula PT" },
    { label: "Documento Único (DUA)", estimate: "€55 – €65", note: "Online ou presencial" },
    { label: "Certificado de Conformidade (CoC)", estimate: "€100 – €250", note: "Exigido pelo IMT" },
    { label: "Registo + Matrícula", estimate: "~€80", note: "Chapas incluídas" },
    { label: "ISV (maior variável)", estimate: "€500 – €10.000+", note: "Depende do motor/emissões/ano", highlight: true },
  ];

  const processSteps = [
    { n: "01", title: "Seleção do veículo", desc: "Pesquisa em mercados europeus — Alemanha, Bélgica, França, Holanda." },
    { n: "02", title: "Compra e pagamento", desc: "Contrato de compra e venda + documentação do país de origem." },
    { n: "03", title: "Transporte para Portugal", desc: "Camião/reboque ou chapa de exportação temporária." },
    { n: "04", title: "Inspeção Técnica (Modelo 112)", desc: "Obrigatória antes da legalização." },
    { n: "05", title: "Homologação no IMT", desc: "Emissão do número de homologação nacional." },
    { n: "06", title: "Declaração Aduaneira (DAV)", desc: "Submetida no Portal das Finanças." },
    { n: "07", title: "Pagamento do ISV", desc: "Prazo de 10 dias úteis após emissão do documento." },
    { n: "08", title: "Registo e matrícula portuguesa", desc: "Emissão do Documento Único Automóvel (DUA)." },
  ];

  const faqs = [
    {
      q: "Compensa importar carros usados da Europa para Portugal?",
      a: "Sim. Os carros usados importados da Europa chegam em média 20–40% mais baratos face ao mercado nacional, especialmente modelos premium da Alemanha, Bélgica e Holanda.",
    },
    {
      q: "Quais são os carros para importar mais procurados em 2026?",
      a: "Os modelos mais procurados para importar em 2026 são BMW Série 3 e 5, Mercedes Classe C e E, Audi A4 e A6, Volkswagen Golf e Passat, e elétricos como BMW iX e Tesla Model 3.",
    },
    {
      q: "Como legalizar um carro estrangeiro em Portugal?",
      a: "Para legalizar um carro estrangeiro em Portugal é necessário: inspeção técnica (Modelo 112), Certificado de Conformidade (CoC), Declaração Aduaneira (DAV) nas Finanças, pagamento do ISV e registo no IMT. A AutoGo trata de todo este processo por si.",
    },
    {
      q: "É possível importar carros elétricos para Portugal?",
      a: "Sim. Importar carros elétricos para Portugal é especialmente vantajoso — têm reduções significativas no ISV e a diferença de preço face ao mercado nacional pode ser considerável.",
    },
    {
      q: "Quanto custa a importação de carros?",
      a: "O custo inclui: transporte (€500–€1.500), inspeção técnica (~€128), CoC (€100–€250), registo e matrícula (~€80) e ISV (€500–€10.000+ conforme o motor e emissões). Use o nosso simulador para calcular o ISV exato.",
    },
    {
      q: "Os carros importados em Portugal têm garantia?",
      a: "Sim. Todos os veículos importados pela AutoGo são inspecionados antes da entrega e podem incluir garantia. Os carros novos mantêm a garantia de fábrica do fabricante.",
    },
  ];

  const legalDocs = [
    "Contrato de compra e venda",
    "Certificado de Conformidade (CoC)",
    "Título de registo do país de origem",
    "Documento de identificação do comprador",
    "Comprovativo de morada em Portugal",
  ];

  return (
    <MainLayout>
      <Seo
        title="Importar Carros para Portugal em 2026 | Importação de Carros | AutoGo"
        description="Serviço completo de importação de carros para Portugal. Carros importados da Europa — usados, elétricos e premium. Legalização incluída. Simule grátis."
        url="https://autogo.pt/importar-carros-portugal"
        keywords={joinKeywords(LANDING_KEYWORDS, SITE_WIDE_KEYWORDS)}
        jsonLd={jsonLd}
      />

      {/* Red accent bar */}
      <div className="fixed top-[64px] left-0 w-full z-40 pointer-events-none">
        <span className="block h-1.5 bg-gradient-to-r from-[#b42121] via-[#d50032] to-[#b42121] opacity-90" />
      </div>

      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/audi-scotland.webp')" }}
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
            <nav className="flex justify-center gap-2 text-xs text-gray-400 font-normal mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#b42121] transition-colors">Início</Link>
              <span>›</span>
              <span className="text-gray-500">Importar Carros Portugal</span>
            </nav>

            <span className="inline-block bg-[#b42121]/10 text-[#b42121] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
              Serviço Chave-na-Mão · 2026
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Importar Carros para Portugal:<br className="hidden sm:block" />
              <span className="text-[#b42121]"> Serviço Completo Chave-na-Mão</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              A importação de carros para Portugal nunca foi tão simples. Na AutoGo tratamos de todo o processo — da compra na Alemanha até à matrícula portuguesa. Os carros importados chegam mais baratos, com mais equipamento e com{" "}
              <strong>garantia total de legalização.</strong>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link
                href="/simulador-isv"
                className="bg-[#b42121] hover:bg-[#9a1c1c] text-white font-bold py-4 px-8 rounded-xl text-base transition-colors shadow-lg"
              >
                Simular Custos Grátis
              </Link>
              <a
                href="#proposta"
                className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 px-8 rounded-xl text-base transition-colors shadow-lg border border-gray-200"
              >
                Pedir Proposta Gratuita
              </a>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-900">
              <span className="flex items-center gap-1.5">
                <span className="text-yellow-400">⭐⭐⭐⭐⭐</span> Avaliação 5 estrelas no Google
              </span>
              <span>Clientes satisfeitos em todo Portugal</span>
              <span>Especialistas no mercado alemão</span>
            </div>
          </div>
        </section>

        {/* ── COMO FUNCIONA ── */}
        <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
              Como Funciona a Importação de Carros com a AutoGo
            </h2>
            <p className="text-center text-gray-500 text-sm font-normal mb-12">
              3 passos simples — nós tratamos de toda a burocracia
            </p>
            <div className="grid sm:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div key={s.num} className="bg-white border border-gray-200 rounded-2xl shadow-lg p-7 text-center transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-[#b42121]/30">
                  <div className="w-9 h-9 bg-[#b42121] text-white rounded-full flex items-center justify-center font-black text-sm mx-auto mb-4">
                    {s.num}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DE ONDE IMPORTAMOS ── */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
              Importar Carros da Alemanha e da Europa
            </h2>
            <p className="text-center text-gray-900 font-normal text-sm mb-10 max-w-2xl mx-auto">
              A Alemanha é o mercado preferido para comprar carro na Europa — maior oferta, melhores preços e veículos bem conservados. Importamos também de Bélgica, França, Holanda e restante UE.
            </p>

            <h3 className="text-lg font-bold text-gray-800 text-center mb-6">Que Tipos de Carros Importamos</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Importar carros usados", desc: "Seminovos com baixa quilometragem a preços imbatíveis face ao mercado nacional." },
                { title: "Importar carros elétricos", desc: "Redução significativa no ISV para veículos zero emissões — poupança garantida." },
                { title: "Berlinas, SUVs e Comerciais", desc: "Toda a tipologia de veículos — familiar, urban, off-road ou comercial ligeiro." },
                { title: "Carros de luxo e premium", desc: "Mercedes, BMW, Audi, Volkswagen, Toyota e muitas outras marcas europeias." },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-gray-200 rounded-2xl p-5 flex gap-4 items-start shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[#b42121]/30">
                  <span className="w-2 h-2 mt-2 flex-shrink-0 rounded-full bg-[#b42121]" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm mb-0.5">{item.title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CUSTOS ── */}
        <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
              Quanto Custa a Importação de Carros para Portugal?
            </h2>
            <p className="text-center text-gray-500 font-normal text-sm mb-10 max-w-2xl mx-auto">
              Os carros importados em Portugal têm custos fixos e variáveis. Aqui está o que esperar — sem surpresas no final do processo.
            </p>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="hidden sm:grid grid-cols-3 bg-gray-50 border-b border-gray-200 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span>Componente</span>
                <span className="text-center">Custo Estimado</span>
                <span className="text-right">Notas</span>
              </div>
              {costs.map((c, i) => (
                <div
                  key={i}
                  className={`grid sm:grid-cols-3 gap-1 sm:gap-0 px-6 py-4 border-b border-gray-100 last:border-0 items-center ${c.highlight ? "bg-[#b42121]/5" : ""}`}
                >
                  <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">{c.label}</div>
                  <div className={`text-center font-bold text-base ${c.highlight ? "text-[#b42121]" : "text-gray-700"}`}>{c.estimate}</div>
                  <div className="text-right text-xs text-gray-400 font-normal">{c.note}</div>
                </div>
              ))}
            </div>

            {/* Inline CTA */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-700 text-sm font-medium">
                Use o simulador para calcular o ISV exato do seu carro
              </p>
              <Link
                href="/simulador-isv"
                className="flex-shrink-0 bg-[#b42121] hover:bg-[#9a1c1c] text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-colors shadow"
              >
                Simule agora grátis →
              </Link>
            </div>
          </div>
        </section>

        {/* ── LEGALIZAÇÃO ── */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
              Legalizar Carros Importados: Tudo Incluído
            </h2>
            <p className="text-center text-gray-900 font-normal text-sm mb-10 max-w-2xl mx-auto">
              Legalizar um carro estrangeiro em Portugal implica vários passos burocráticos. Com a AutoGo o processo de legalizar carros importados é 100% tratado pela nossa equipa — DAV nas Finanças, IMT, inspeção e matrícula.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {/* Passo a passo */}
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-4">Processo Passo a Passo</h3>
                <div className="space-y-3">
                  {processSteps.map((s) => (
                    <div key={s.n} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 items-start shadow-sm">
                      <span className="w-8 h-8 flex-shrink-0 bg-[#b42121]/10 text-[#b42121] rounded-lg flex items-center justify-center font-black text-xs">
                        {s.n}
                      </span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm mb-0.5">{s.title}</p>
                        <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documentos */}
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-4">Documentos Necessários para Legalizar Carro Estrangeiro</h3>
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-3">
                  {legalDocs.map((doc) => (
                    <div key={doc} className="flex items-start gap-3">
                      <span className="w-5 h-5 flex-shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
                      <p className="text-gray-700 text-sm">{doc}</p>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-100 mt-2">
                    <p className="text-xs text-gray-400 font-normal">A AutoGo orienta e trata de toda a documentação por si.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Perguntas Frequentes sobre Importar Carros
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
        <section id="proposta" className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Pronto para Importar o Seu Carro?
              </h2>
              <p className="text-gray-900 font-normal">
                Junte-se aos clientes que já pouparam com carros importados em Portugal pela AutoGo. Proposta personalizada em menos de 24 horas. Sem compromisso.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* ── Internal links ── */}
        <section className="py-10 px-4 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-xs text-gray-900 font-normal mb-6 uppercase tracking-widest">Explore mais</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { href: "/simulador-isv", label: "Simulador ISV 2026" },
                { href: "/simulador-iuc", label: "Simulador IUC 2026" },
                { href: "/legalizar-carro-importado", label: "Legalizar Carro Importado" },
                { href: "/viaturas", label: "Carros Importados em Stock" },
                { href: "/como-funciona", label: "Como Funciona" },
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
        <div className="pb-10 flex flex-wrap gap-3 justify-center text-sm text-gray-900 font-normal">
          <Link href="/" className="hover:text-[#b42121] transition-colors font-normal">Início</Link>
          <span>·</span>
          <Link href="/viaturas" className="hover:text-[#b42121] transition-colors font-normal">Viaturas</Link>
          <span>·</span>
          <Link href="/simulador-isv" className="hover:text-[#b42121] transition-colors font-normal">Simulador ISV</Link>
          <span>·</span>
          <Link href="/como-funciona" className="hover:text-[#b42121] transition-colors font-normal">Como Funciona</Link>
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

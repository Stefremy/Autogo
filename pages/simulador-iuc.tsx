import React, { useState } from "react";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "../components/MainLayout";
import Seo from "../components/Seo";
import {
  IUC_KEYWORDS,
  SITE_WIDE_KEYWORDS,
  SEO_KEYWORDS,
  joinKeywords,
} from "../utils/seoKeywords";

// ─── Tabelas IUC 2026 (Código do IUC — Lei n.º 22-A/2007, atualizado OE 2026) ──

// Categoria A — Automóveis de passageiros matriculados a partir de 01/07/2007
// Componente cilindrada (€/cm³)
const IUC_CAT_A_CIL = [
  { min: 0,    max: 1000, taxa: 0.01776 },
  { min: 1001, max: 1250, taxa: 0.02878 },
  { min: 1251, max: 1750, taxa: 0.05384 },
  { min: 1751, max: 2500, taxa: 0.10909 },
  { min: 2501, max: Infinity, taxa: 0.18031 },
];

// Componente ambiental (€/gCO2/km) — gasolina/GPL/GN
const IUC_CAT_A_CO2_GASOLINA = [
  { min: 0,   max: 120,  taxa: 0.0 },
  { min: 121, max: 140,  taxa: 0.82 },
  { min: 141, max: 160,  taxa: 2.26 },
  { min: 161, max: 180,  taxa: 4.59 },
  { min: 181, max: 200,  taxa: 9.89 },
  { min: 201, max: 250,  taxa: 20.19 },
  { min: 251, max: Infinity, taxa: 34.37 },
];

// Componente ambiental — diesel
const IUC_CAT_A_CO2_DIESEL = [
  { min: 0,   max: 100,  taxa: 0.0 },
  { min: 101, max: 120,  taxa: 0.82 },
  { min: 121, max: 140,  taxa: 2.26 },
  { min: 141, max: 160,  taxa: 4.59 },
  { min: 161, max: 180,  taxa: 9.89 },
  { min: 181, max: 200,  taxa: 20.19 },
  { min: 201, max: Infinity, taxa: 34.37 },
];

// Categoria B — Automóveis de passageiros matriculados antes de 01/07/2007
// (taxa única por escalão de cilindrada, anual)
const IUC_CAT_B = [
  { min: 0,    max: 1000, taxa: 9.12 },
  { min: 1001, max: 1250, taxa: 14.61 },
  { min: 1251, max: 1500, taxa: 23.65 },
  { min: 1501, max: 1750, taxa: 36.47 },
  { min: 1751, max: 2000, taxa: 55.23 },
  { min: 2001, max: 2500, taxa: 85.60 },
  { min: 2501, max: 3000, taxa: 141.65 },
  { min: 3001, max: Infinity, taxa: 219.99 },
];

// Coeficiente de desvalorização para Categoria A (antiguidade desde matrícula)
// Os valores finais de IUC Cat A são multiplicados por este coeficiente
const IUC_COEF_ANTIGUIDADE = [
  { min: 0,  max: 1,  coef: 1.00 },
  { min: 1,  max: 2,  coef: 0.95 },
  { min: 2,  max: 3,  coef: 0.90 },
  { min: 3,  max: 4,  coef: 0.85 },
  { min: 4,  max: 5,  coef: 0.80 },
  { min: 5,  max: 6,  coef: 0.75 },
  { min: 6,  max: 7,  coef: 0.70 },
  { min: 7,  max: 8,  coef: 0.65 },
  { min: 8,  max: 9,  coef: 0.60 },
  { min: 9,  max: 10, coef: 0.55 },
  { min: 10, max: Infinity, coef: 0.50 },
];

function getEscalao(tabela: { min: number; max: number; [k: string]: any }[], valor: number) {
  return tabela.find((e) => valor >= e.min && valor <= e.max) ?? tabela[tabela.length - 1];
}

function calcAnosDesdeMatricula(anoMatricula: number): number {
  return new Date().getFullYear() - anoMatricula;
}

type IUCResult = {
  componente_cilindrada: number;
  componente_co2: number;
  iuc_bruto: number;
  coef_antiguidade: number;
  iuc_final: number;
  categoria: 'A' | 'B' | 'eletrico';
  info: string[];
};

function calcularIUC(form: {
  cilindrada: string;
  co2: string;
  combustivel: string;
  anoMatricula: string;
}): IUCResult | null {
  const cil = Number(form.cilindrada);
  const co2 = Number(form.co2);
  const ano = Number(form.anoMatricula);

  if (!cil || !ano || isNaN(cil) || isNaN(ano)) return null;

  const info: string[] = [];

  // Veículos elétricos: IUC mínimo fixo (taxa fixa anual)
  if (form.combustivel === "eletrico") {
    return {
      componente_cilindrada: 0,
      componente_co2: 0,
      iuc_bruto: 0,
      coef_antiguidade: 1,
      iuc_final: 0,
      categoria: "eletrico",
      info: ["Veículos elétricos puros: isento de IUC em Portugal."],
    };
  }

  const anos = calcAnosDesdeMatricula(ano);

  // Categoria B: matriculados antes de 01/07/2007
  if (ano < 2007) {
    const esc = getEscalao(IUC_CAT_B, cil);
    // Para Cat B os valores já estão fixos por escalão — sem desvalorização por antiguidade
    return {
      componente_cilindrada: esc.taxa,
      componente_co2: 0,
      iuc_bruto: esc.taxa,
      coef_antiguidade: 1,
      iuc_final: esc.taxa,
      categoria: "B",
      info: [
        `Categoria B (anterior a 2007). Cilindrada ${cil}cm³ → escalão €${esc.taxa.toFixed(2)}/ano.`,
        "Componente ambiental não aplicável (Cat. B).",
      ],
    };
  }

  // Categoria A: matriculados a partir de 01/07/2007
  const escCil = getEscalao(IUC_CAT_A_CIL, cil);
  const compCil = cil * escCil.taxa;

  let compCO2 = 0;
  if (!isNaN(co2) && co2 > 0) {
    const tabelaCO2 =
      form.combustivel === "diesel"
        ? IUC_CAT_A_CO2_DIESEL
        : IUC_CAT_A_CO2_GASOLINA;
    const escCO2 = getEscalao(tabelaCO2, co2);
    compCO2 = co2 * escCO2.taxa;
    info.push(
      `CO₂: ${co2}g/km → taxa ${escCO2.taxa.toFixed(4)}€/g = €${compCO2.toFixed(2)}`
    );
  }

  const iucBruto = compCil + compCO2;

  // Coeficiente de antiguidade
  const escCoef = getEscalao(IUC_COEF_ANTIGUIDADE, anos);
  const coef = escCoef.coef;
  const iucFinal = iucBruto * coef;

  info.unshift(
    `Categoria A. Cilindrada ${cil}cm³ × €${escCil.taxa.toFixed(5)} = €${compCil.toFixed(2)}`,
    `Antiguidade: ${anos} anos → coeficiente ${(coef * 100).toFixed(0)}%`
  );

  return {
    componente_cilindrada: compCil,
    componente_co2: compCO2,
    iuc_bruto: iucBruto,
    coef_antiguidade: coef,
    iuc_final: iucFinal,
    categoria: "A",
    info,
  };
}

// ─── JSON-LD ────────────────────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Simulador IUC 2026 AutoGo.pt",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: "https://autogo.pt/simulador-iuc",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      description:
        "Calculadora gratuita do IUC (Imposto Único de Circulação) para Portugal, atualizada 2026. Categorias A e B, elétricos, com coeficiente de antiguidade.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "O que é o IUC?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "O IUC (Imposto Único de Circulação) é o imposto anual pago pelos proprietários de veículos em Portugal. Substitui o antigo Imposto de Circulação e Cadastro. O valor depende da cilindrada, das emissões de CO₂ e do ano de matrícula do veículo.",
          },
        },
        {
          "@type": "Question",
          name: "Como é calculado o IUC em 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Para veículos matriculados a partir de 01/07/2007 (Categoria A): IUC = (cilindrada × taxa de cilindrada) + (CO₂ × taxa ambiental), multiplicado por um coeficiente de antiguidade que vai de 100% (novo) a 50% (mais de 10 anos). Para veículos anteriores a 2007 (Categoria B): taxa fixa por escalão de cilindrada. Elétricos estão isentos.",
          },
        },
        {
          "@type": "Question",
          name: "Carros elétricos pagam IUC em Portugal?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Não. Veículos 100% elétricos estão isentos de IUC em Portugal, por despacho governamental como incentivo à mobilidade elétrica.",
          },
        },
        {
          "@type": "Question",
          name: "Qual a diferença entre ISV e IUC?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "O ISV (Imposto Sobre Veículos) é pago uma única vez no momento da primeira matrícula em Portugal (ou importação). O IUC é pago anualmente enquanto o veículo circular. Ambos dependem da cilindrada e emissões de CO₂, mas as tabelas e fórmulas são diferentes.",
          },
        },
        {
          "@type": "Question",
          name: "Quando se paga o IUC?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "O IUC é pago anualmente no mês do aniversário da matrícula do veículo. Pode ser pago nas Finanças, CTT, MB Way, ou homebanking. O não pagamento implica coimas e juros.",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      name: "Como calcular o IUC do meu carro",
      description: "Passos para estimar o IUC anual de um veículo em Portugal",
      step: [
        { "@type": "HowToStep", name: "Introduza a cilindrada", text: "Insira a cilindrada do motor em cm³ (encontra-se no documento único do veículo)" },
        { "@type": "HowToStep", name: "Indique as emissões CO₂", text: "Insira os g/km de CO₂ (para veículos Cat. A pós-2007)" },
        { "@type": "HowToStep", name: "Selecione o combustível", text: "Escolha gasolina, diesel, GPL/GN ou elétrico" },
        { "@type": "HowToStep", name: "Insira o ano de matrícula", text: "O ano determina a categoria (A ou B) e o coeficiente de antiguidade" },
        { "@type": "HowToStep", name: "Clique em Calcular", text: "Veja o IUC estimado, discriminado por componentes" },
      ],
    },
  ],
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function SimuladorIUC() {
  const [form, setForm] = useState({
    cilindrada: "",
    co2: "",
    combustivel: "gasolina",
    anoMatricula: "",
  });
  const [resultado, setResultado] = useState<IUCResult | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === "combustivel" && value === "eletrico") {
      setForm((f) => ({ ...f, combustivel: value, cilindrada: "0", co2: "0" }));
      return;
    }
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (form.combustivel !== "eletrico") {
      if (!form.cilindrada || isNaN(Number(form.cilindrada)) || Number(form.cilindrada) <= 0) {
        setErro("Introduza uma cilindrada válida (em cm³).");
        return;
      }
    }
    if (!form.anoMatricula || isNaN(Number(form.anoMatricula)) || Number(form.anoMatricula) < 1970 || Number(form.anoMatricula) > new Date().getFullYear()) {
      setErro("Introduza um ano de matrícula válido (ex: 2018).");
      return;
    }

    const r = calcularIUC(form);
    if (!r) {
      setErro("Não foi possível calcular. Verifique os dados introduzidos.");
      return;
    }
    setResultado(r);
  }

  function handleReset() {
    setForm({ cilindrada: "", co2: "", combustivel: "gasolina", anoMatricula: "" });
    setResultado(null);
    setErro(null);
  }

  const isEletrico = form.combustivel === "eletrico";

  return (
    <MainLayout>
      <Seo
        title={SEO_KEYWORDS.simulador_iuc.title ?? 'Simulador IUC 2026 GRÁTIS Portugal | Cálculo Instantâneo | AutoGo.pt'}
        description={SEO_KEYWORDS.simulador_iuc.description ?? ''}
        url="https://autogo.pt/simulador-iuc"
        keywords={joinKeywords(SEO_KEYWORDS.simulador_iuc.keywords ?? [], IUC_KEYWORDS, SITE_WIDE_KEYWORDS)}
        jsonLd={jsonLd}
      />

      {/* Red accent bar */}
      <div id="hero-redline" className="fixed top-[64px] left-0 w-full z-40 pointer-events-none" style={{ height: "0" }}>
        <div id="hero-redline-bar" className="w-full flex justify-center">
          <span className="block h-1.5 rounded-full bg-gradient-to-r from-[#b42121] via-[#d50032] to-[#b42121] opacity-90 shadow-[0_0_16px_4px_rgba(213,0,50,0.18)] transition-all duration-700" style={{ width: "100%" }} />
        </div>
      </div>

      <div className="min-h-screen bg-white pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block bg-[#b42121]/10 text-[#b42121] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Grátis · Atualizado 2026
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Simulador IUC 2026
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Calcule o <strong>Imposto Único de Circulação</strong> do seu veículo em segundos.
              Categorias A e B, elétricos isentos, coeficiente de antiguidade incluído.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* ── Formulário ── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#b42121] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Dados do Veículo
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Combustível */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tipo de Combustível
                  </label>
                  <select
                    name="combustivel"
                    value={form.combustivel}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b42121]/40 focus:border-[#b42121] bg-white"
                  >
                    <option value="gasolina">Gasolina / GPL / GN</option>
                    <option value="diesel">Diesel</option>
                    <option value="eletrico">Elétrico</option>
                  </select>
                </div>

                {/* Cilindrada */}
                {!isEletrico && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Cilindrada (cm³)
                    </label>
                    <input
                      type="number"
                      name="cilindrada"
                      value={form.cilindrada}
                      onChange={handleChange}
                      placeholder="ex: 1598"
                      min={1}
                      max={9999}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b42121]/40 focus:border-[#b42121]"
                    />
                    <p className="text-xs text-gray-400 mt-1">Encontra no Documento Único do veículo (campo N° de referência da motor)</p>
                  </div>
                )}

                {/* CO2 — só Cat A (pós 2007) */}
                {!isEletrico && Number(form.anoMatricula) >= 2007 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Emissões CO₂ (g/km) <span className="text-gray-400 font-normal text-xs">— apenas para veículos pós-2007</span>
                    </label>
                    <input
                      type="number"
                      name="co2"
                      value={form.co2}
                      onChange={handleChange}
                      placeholder="ex: 130"
                      min={0}
                      max={999}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b42121]/40 focus:border-[#b42121]"
                    />
                  </div>
                )}

                {/* Ano matrícula */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Ano de 1ª Matrícula
                  </label>
                  <input
                    type="number"
                    name="anoMatricula"
                    value={form.anoMatricula}
                    onChange={handleChange}
                    placeholder="ex: 2018"
                    min={1970}
                    max={new Date().getFullYear()}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b42121]/40 focus:border-[#b42121]"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Veículos matriculados antes de 2007 → Categoria B (taxa fixa)
                  </p>
                </div>

                {/* Erro */}
                {erro && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    {erro}
                  </div>
                )}

                {/* Botões */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-[#b42121] hover:bg-[#9a1c1c] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 shadow-md"
                  >
                    Calcular IUC
                  </button>
                  {resultado && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-5 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* ── Resultado ── */}
            <div>
              {!resultado ? (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-400 flex flex-col items-center justify-center min-h-[280px]">
                  <svg className="w-12 h-12 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="font-medium text-sm">Preencha os dados e clique em <br /><strong className="text-gray-600">Calcular IUC</strong></p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
                    Resultado
                  </h2>

                  {resultado.categoria === "eletrico" ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                      <div className="text-4xl mb-2">⚡</div>
                      <p className="text-2xl font-bold text-green-700 mb-1">IUC: Isento</p>
                      <p className="text-green-600 text-sm">Veículos 100% elétricos não pagam IUC em Portugal.</p>
                    </div>
                  ) : (
                    <>
                      {/* Valor final destaque */}
                      <div className="bg-[#b42121]/5 border border-[#b42121]/20 rounded-xl p-5 text-center mb-5">
                        <p className="text-sm text-gray-500 mb-1">IUC Anual Estimado</p>
                        <p className="text-4xl font-black text-[#b42121]">
                          {resultado.iuc_final.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Categoria {resultado.categoria} · {resultado.coef_antiguidade < 1 ? `Coef. antiguidade ${(resultado.coef_antiguidade * 100).toFixed(0)}%` : "Veículo novo"}
                        </p>
                      </div>

                      {/* Breakdown */}
                      {resultado.categoria === "A" && (
                        <div className="space-y-2 mb-5">
                          <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                            <span className="text-gray-600">Componente cilindrada</span>
                            <span className="font-semibold">€{resultado.componente_cilindrada.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                            <span className="text-gray-600">Componente CO₂</span>
                            <span className="font-semibold">€{resultado.componente_co2.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                            <span className="text-gray-600">IUC bruto</span>
                            <span className="font-semibold">€{resultado.iuc_bruto.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                            <span className="text-gray-600">Coef. antiguidade</span>
                            <span className="font-semibold text-green-600">× {(resultado.coef_antiguidade * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between text-base py-2 font-bold">
                            <span className="text-gray-800">IUC Final</span>
                            <span className="text-[#b42121]">€{resultado.iuc_final.toFixed(2)}</span>
                          </div>
                        </div>
                      )}

                      {/* Detalhes cálculo */}
                      {resultado.info.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                          {resultado.info.map((line, i) => (
                            <p key={i} className="text-xs text-gray-500">{line}</p>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Aviso legal */}
                  <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                    * Valor estimado com base nas tabelas do Código do IUC (OE 2026). Para valor exato consulte o Portal das Finanças ou a AT. Não inclui juros de mora ou coimas.
                  </p>
                </div>
              )}

              {/* CTA legalização */}
              <div className="mt-5 bg-gray-900 rounded-2xl p-5 text-white">
                <p className="text-sm font-semibold mb-1">A importar um carro?</p>
                <p className="text-xs text-gray-300 mb-3">
                  Para além do IUC anual, precisará de calcular também o <strong className="text-white">ISV</strong> (pago uma vez na importação). Use o nosso simulador ISV gratuito.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href="/simulador-isv"
                    className="flex-1 text-center bg-[#b42121] hover:bg-[#9a1c1c] text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-colors"
                  >
                    Simulador ISV →
                  </Link>
                  <Link
                    href="/pedido"
                    className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-colors"
                  >
                    Pedir Proposta Grátis
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── ISV vs IUC explainer ── */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">ISV vs IUC — Qual a diferença?</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 bg-[#b42121] text-white rounded-xl flex items-center justify-center font-black text-sm">ISV</span>
                  <div>
                    <p className="font-bold text-gray-800">Imposto Sobre Veículos</p>
                    <p className="text-xs text-gray-500">Pago uma única vez</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#b42121] font-bold mt-0.5">→</span>Pago no momento da 1ª matrícula em Portugal</li>
                  <li className="flex gap-2"><span className="text-[#b42121] font-bold mt-0.5">→</span>Calculado sobre cilindrada + CO₂</li>
                  <li className="flex gap-2"><span className="text-[#b42121] font-bold mt-0.5">→</span>Elétricos: isentos</li>
                  <li className="flex gap-2"><span className="text-[#b42121] font-bold mt-0.5">→</span>Usados: redução 10%–80% por idade</li>
                  <li className="flex gap-2"><span className="text-[#b42121] font-bold mt-0.5">→</span>Pode custar €0 a €10.000+</li>
                </ul>
                <Link href="/simulador-isv" className="mt-4 inline-block text-[#b42121] text-sm font-semibold hover:underline">
                  Calcular ISV →
                </Link>
              </div>
              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 bg-gray-800 text-white rounded-xl flex items-center justify-center font-black text-sm">IUC</span>
                  <div>
                    <p className="font-bold text-gray-800">Imposto Único de Circulação</p>
                    <p className="text-xs text-gray-500">Pago todos os anos</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-gray-800 font-bold mt-0.5">→</span>Pago anualmente no mês de aniversário da matrícula</li>
                  <li className="flex gap-2"><span className="text-gray-800 font-bold mt-0.5">→</span>Cat. A (pós-2007): cilindrada + CO₂ × coef. antiguidade</li>
                  <li className="flex gap-2"><span className="text-gray-800 font-bold mt-0.5">→</span>Cat. B (pré-2007): taxa fixa por escalão de cilindrada</li>
                  <li className="flex gap-2"><span className="text-gray-800 font-bold mt-0.5">→</span>Elétricos: isentos</li>
                  <li className="flex gap-2"><span className="text-gray-800 font-bold mt-0.5">→</span>Redução de 50% para veículos com +10 anos</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── FAQ visível ── */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Perguntas Frequentes — IUC</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                {
                  q: "O que é o IUC e quem tem de pagar?",
                  a: "O IUC (Imposto Único de Circulação) é pago anualmente por todos os proprietários de veículos matriculados em Portugal. O valor depende da cilindrada, CO₂ e ano de matrícula. Veículos elétricos estão isentos.",
                },
                {
                  q: "Quando e como se paga o IUC?",
                  a: "O IUC é pago anualmente no mês do aniversário da matrícula do veículo. Pode ser pago online no Portal das Finanças (AT), por Multibanco, nos CTT, ou via homebanking. O não pagamento gera coimas e juros.",
                },
                {
                  q: "O IUC de um carro importado é diferente?",
                  a: "Não. Após a legalização e atribuição de matrícula portuguesa, o IUC é calculado exactamente da mesma forma que para qualquer outro veículo nacional. O que muda é o ISV, pago uma única vez na importação.",
                },
                {
                  q: "Como reduzir o IUC que pago?",
                  a: "O IUC reduz naturalmente com a idade do veículo (coeficiente de antiguidade: -5% por ano até ao mínimo de 50% para veículos com +10 anos). A única forma de isenção total é ter um veículo 100% elétrico.",
                },
                {
                  q: "O simulador IUC é exato?",
                  a: "O simulador usa as tabelas oficiais do Código do IUC (OE 2026) e deve dar um valor muito próximo do real. Para o valor exato e definitivo, consulte o Portal das Finanças (AT) ou um técnico oficial.",
                },
              ].map(({ q, a }, i) => (
                <details key={i} className="border border-gray-200 rounded-xl overflow-hidden group">
                  <summary className="flex justify-between items-center px-5 py-4 cursor-pointer font-semibold text-gray-800 hover:bg-gray-50 transition-colors list-none">
                    <span>{q}</span>
                    <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 py-4 text-gray-600 text-sm leading-relaxed bg-gray-50 border-t border-gray-100">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* ── Breadcrumb + links ── */}
          <div className="mt-12 flex flex-wrap gap-3 justify-center text-sm text-gray-500">
            <Link href="/" className="hover:text-[#b42121] transition-colors">Início</Link>
            <span>·</span>
            <Link href="/simulador-isv" className="hover:text-[#b42121] transition-colors">Simulador ISV</Link>
            <span>·</span>
            <Link href="/viaturas" className="hover:text-[#b42121] transition-colors">Carros Importados</Link>
            <span>·</span>
            <Link href="/como-funciona" className="hover:text-[#b42121] transition-colors">Como Funciona</Link>
          </div>

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

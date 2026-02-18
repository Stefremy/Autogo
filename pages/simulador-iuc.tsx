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

// ─── Tabelas IUC 2026 (impostosobreveiculos.info) ───────────────────────────

// ── CATEGORIA A (1ª matrícula PT/UE/EEE até 30 Jun 2007) ────────────────────
// Colunas: t9607 = 1996–Jun2007 | t9095 = 1990–1995 | t8189 = 1981–1989
// Gasolina — taxa fixa por escalão de cilindrada × período
const IUC_CAT_A_GASOLINA: { max: number; t9607: number; t9095: number; t8189: number }[] = [
  { max: 1000,     t9607: 19.90,  t9095: 12.20,  t8189: 8.80  },
  { max: 1300,     t9607: 39.95,  t9095: 22.45,  t8189: 12.55 },
  { max: 1750,     t9607: 62.40,  t9095: 34.87,  t8189: 17.49 },
  { max: 2600,     t9607: 158.31, t9095: 83.49,  t8189: 36.09 },
  { max: 3500,     t9607: 287.49, t9095: 156.54, t8189: 79.72 },
  { max: Infinity, t9607: 512.23, t9095: 263.11, t8189: 120.90 },
];

// Gasóleo — taxa fixa (já inclui taxa adicional gasóleo)
const IUC_CAT_A_DIESEL: { max: number; t9607: number; t9095: number; t8189: number }[] = [
  { max: 1500,     t9607: 22.48,  t9095: 14.18, t8189: 10.19 },
  { max: 2000,     t9607: 45.13,  t9095: 25.37, t8189: 14.18 },
  { max: 3000,     t9607: 70.50,  t9095: 39.40, t8189: 19.76 },
  { max: Infinity, t9607: 178.86, t9095: 94.33, t8189: 40.77 },
];

// Elétricos Cat A (voltagem total)
const IUC_CAT_A_ELETRICO: { max: number; t9607: number; t9095: number; t8189: number }[] = [
  { max: 100,      t9607: 19.90, t9095: 12.55, t8189: 8.80  },
  { max: Infinity, t9607: 39.95, t9095: 22.45, t8189: 12.55 },
];

// ── CATEGORIA B (1ª matrícula PT/UE/EEE a partir de 1 Jul 2007) ─────────────
// Passo 1 — taxa cilindrada (igual gasolina e gasóleo)
const IUC_CAT_B_CIL: { max: number; taxa: number }[] = [
  { max: 1250,     taxa: 31.77  },
  { max: 1750,     taxa: 63.74  },
  { max: 2500,     taxa: 127.35 },
  { max: Infinity, taxa: 435.84 },
];

// Passo 2 — taxa CO₂ NEDC + taxa adicional (matrículas ≥ 2017)
const IUC_CAT_B_CO2_NEDC: { max: number; taxa: number; taxaAdicional: number }[] = [
  { max: 120,      taxa: 65.15,  taxaAdicional: 0     },
  { max: 180,      taxa: 97.63,  taxaAdicional: 0     },
  { max: 250,      taxa: 212.04, taxaAdicional: 31.77 },
  { max: Infinity, taxa: 363.25, taxaAdicional: 63.74 },
];

// Passo 2 — taxa CO₂ WLTP + taxa adicional (matrículas ≥ 2017)
const IUC_CAT_B_CO2_WLTP: { max: number; taxa: number; taxaAdicional: number }[] = [
  { max: 140,      taxa: 65.15,  taxaAdicional: 0     },
  { max: 205,      taxa: 97.63,  taxaAdicional: 0     },
  { max: 260,      taxa: 212.04, taxaAdicional: 31.77 },
  { max: Infinity, taxa: 363.25, taxaAdicional: 63.74 },
];

// Passo 3 — coeficiente ano matrícula Cat B
function getCatBCoef(ano: number): number {
  if (ano <= 2007) return 1.00;
  if (ano === 2008) return 1.05;
  if (ano === 2009) return 1.10;
  return 1.15; // 2010 e seguintes
}

// Passo 4 (gasóleo) — taxa adicional gasóleo Cat B
const IUC_CAT_B_DIESEL_ADICIONAL: { max: number; taxa: number }[] = [
  { max: 1250,     taxa: 5.02  },
  { max: 1750,     taxa: 10.07 },
  { max: 2500,     taxa: 20.12 },
  { max: Infinity, taxa: 68.85 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getEscalao<T extends { max: number }>(tabela: T[], valor: number): T {
  return tabela.find((e) => valor <= e.max) ?? tabela[tabela.length - 1];
}

function getCatAKey(ano: number): "t9607" | "t9095" | "t8189" | null {
  if (ano >= 1996) return "t9607";
  if (ano >= 1990) return "t9095";
  if (ano >= 1981) return "t8189";
  return null; // anterior a 1981 → isento
}

// ── Types ────────────────────────────────────────────────────────────────────
type BreakdownItem = { label: string; valor: number | null; texto?: string };

type IUCResult = {
  iuc_final: number;
  categoria: "A" | "B" | "isento";
  breakdown: BreakdownItem[];
  info: string[];
  isento: boolean;
  isentoRazao?: string;
};

// ── Lógica de cálculo ────────────────────────────────────────────────────────
function calcularIUC(form: {
  combustivel: string;
  cilindrada: string;
  co2: string;
  normaCO2: string;
  anoMatricula: string;
  origemUEEEE: string;
}): IUCResult | null {
  const ano = Number(form.anoMatricula);
  if (!ano || isNaN(ano)) return null;

  // Categoria A: 1ª matrícula PT/UE/EEE até 30 Jun 2007
  // Categoria B: tudo o resto (a partir de 1 Jul 2007, inclusive importados fora UE/EEE pós-Jul 2007)
  const isCatA = ano < 2007 || (ano === 2007 && form.origemUEEEE === "sim");

  // ── Elétrico Cat B → isento ──────────────────────────────────────────────
  if (form.combustivel === "eletrico" && !isCatA) {
    return {
      iuc_final: 0,
      categoria: "isento",
      breakdown: [],
      info: [],
      isento: true,
      isentoRazao: "Automóveis ligeiros exclusivamente elétricos (Cat. B, matrícula a partir de Jul 2007) estão isentos de IUC.",
    };
  }

  // ── Categoria A ──────────────────────────────────────────────────────────
  if (isCatA) {
    if (ano < 1981) {
      return {
        iuc_final: 0, categoria: "isento", breakdown: [], info: [],
        isento: true,
        isentoRazao: "Veículos com 1ª matrícula PT/UE/EEE anterior a 1981 estão isentos de IUC.",
      };
    }

    const key = getCatAKey(ano)!;
    const cil = Number(form.cilindrada);
    if (!cil || isNaN(cil) || cil <= 0) return null;

    let tabela = form.combustivel === "diesel"
      ? IUC_CAT_A_DIESEL
      : form.combustivel === "eletrico"
        ? IUC_CAT_A_ELETRICO
        : IUC_CAT_A_GASOLINA;

    const esc = getEscalao(tabela, cil);
    const valor = esc[key];
    const periodos = { t9607: "1996–Jun 2007", t9095: "1990–1995", t8189: "1981–1989" };
    const unidade = form.combustivel === "eletrico" ? "V" : "cm³";
    const labelComb = form.combustivel === "diesel" ? "Gasóleo" : form.combustivel === "eletrico" ? "Elétrico" : "Gasolina";

    const isIsentoVal = valor < 10;

    return {
      iuc_final: isIsentoVal ? 0 : valor,
      categoria: "A",
      breakdown: [{ label: `Taxa ${labelComb} (${cil}${unidade}, período ${periodos[key]})`, valor }],
      info: [
        `Categoria A — ${labelComb}. ${cil}${unidade}, matrícula ${ano} (período ${periodos[key]}).`,
        form.combustivel === "diesel" ? "Taxa inclui a taxa adicional gasóleo." : "",
      ].filter(Boolean),
      isento: isIsentoVal,
      isentoRazao: isIsentoVal ? "Valor inferior a €10 — isento." : undefined,
    };
  }

  // ── Categoria B ──────────────────────────────────────────────────────────
  const cil = Number(form.cilindrada);
  if (!cil || isNaN(cil) || cil <= 0) return null;

  const info: string[] = [];
  const breakdown: BreakdownItem[] = [];

  // Passo 1: taxa cilindrada
  const escCil = getEscalao(IUC_CAT_B_CIL, cil);
  const taxaCil = escCil.taxa;
  breakdown.push({ label: "Passo 1 — Taxa cilindrada", valor: taxaCil });
  info.push(`Passo 1: cilindrada ${cil}cm³ → €${taxaCil.toFixed(2)}`);

  // Passo 2: taxa CO₂
  const co2Val = Number(form.co2);
  let taxaCO2 = 0;
  let taxaCO2Adicional = 0;

  if (!isNaN(co2Val) && co2Val >= 0) {
    const tabelaCO2 = form.normaCO2 === "wltp" ? IUC_CAT_B_CO2_WLTP : IUC_CAT_B_CO2_NEDC;
    const escCO2 = getEscalao(tabelaCO2, co2Val);
    taxaCO2 = escCO2.taxa;
    const temAdicionalCO2 = ano >= 2017;
    taxaCO2Adicional = temAdicionalCO2 ? escCO2.taxaAdicional : 0;

    breakdown.push({ label: `Passo 2 — Taxa CO₂ (${form.normaCO2.toUpperCase()}, ${co2Val}g/km)`, valor: taxaCO2 });
    info.push(`Passo 2: ${co2Val}g/km (${form.normaCO2.toUpperCase()}) → €${taxaCO2.toFixed(2)}`);

    // Passo 3: taxa adicional CO₂ (só matrículas ≥ 2017)
    if (taxaCO2Adicional > 0) {
      breakdown.push({ label: "Passo 3 — Taxa adicional CO₂ (matrícula ≥ 2017)", valor: taxaCO2Adicional });
      info.push(`Passo 3: taxa adicional CO₂ (matrícula ≥ 2017) → €${taxaCO2Adicional.toFixed(2)}`);
    }
  } else {
    breakdown.push({ label: "Passo 2 — Taxa CO₂", valor: 0 });
    info.push("Passo 2: CO₂ não introduzido — usar 0.");
  }

  // Passo 4: coeficiente ano — multiplica (Passo 1 + Passo 2 + Passo 3)
  const coef = getCatBCoef(ano);
  const somaAntesCoef = taxaCil + taxaCO2 + taxaCO2Adicional;
  const base = somaAntesCoef * coef;
  const passoCoef = taxaCO2Adicional > 0 ? 4 : 3;
  breakdown.push({
    label: `Passo ${passoCoef} — × Coeficiente ano (${coef.toFixed(2)})`,
    valor: null,
    texto: `(€${taxaCil.toFixed(2)} + €${taxaCO2.toFixed(2)}${taxaCO2Adicional > 0 ? ` + €${taxaCO2Adicional.toFixed(2)}` : ""}) × ${coef.toFixed(2)} = €${base.toFixed(2)}`,
  });
  info.push(`Passo ${passoCoef}: (${taxaCil.toFixed(2)} + ${taxaCO2.toFixed(2)}${taxaCO2Adicional > 0 ? ` + ${taxaCO2Adicional.toFixed(2)}` : ""}) × ${coef.toFixed(2)} = €${base.toFixed(2)}`);

  // Passo 5 (gasóleo): taxa adicional gasóleo — adicionada depois do coeficiente
  let taxaDieselAdicional = 0;
  if (form.combustivel === "diesel") {
    const escD = getEscalao(IUC_CAT_B_DIESEL_ADICIONAL, cil);
    taxaDieselAdicional = escD.taxa;
    const passoDiesel = passoCoef + 1;
    breakdown.push({ label: `Passo ${passoDiesel} — Taxa adicional gasóleo`, valor: taxaDieselAdicional });
    info.push(`Passo ${passoDiesel} (gasóleo): ${cil}cm³ → €${taxaDieselAdicional.toFixed(2)}`);
  }

  const iucFinal = base + taxaDieselAdicional;

  return {
    iuc_final: iucFinal,
    categoria: "B",
    breakdown,
    info,
    isento: iucFinal < 10,
    isentoRazao: iucFinal < 10 ? "Valor inferior a €10 — isento." : undefined,
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
        "Calculadora gratuita do IUC (Imposto Único de Circulação) para Portugal, atualizada 2026. Categorias A e B, elétricos isentos, taxa adicional gasóleo, normas NEDC e WLTP.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "O que é o IUC?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "O IUC (Imposto Único de Circulação) é o imposto anual pago pelos proprietários de veículos em Portugal. O valor depende da cilindrada, das emissões de CO₂, do combustível e do ano de matrícula.",
          },
        },
        {
          "@type": "Question",
          name: "Como é calculado o IUC em 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Veículos Cat. A (até Jun 2007): taxa fixa por cilindrada e período de matrícula. Veículos Cat. B (a partir Jul 2007): (taxa cilindrada + taxa CO₂) × coeficiente ano + taxa adicional gasóleo. Elétricos Cat. B: isentos.",
          },
        },
        {
          "@type": "Question",
          name: "Carros elétricos pagam IUC em Portugal?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Automóveis ligeiros 100% elétricos com matrícula a partir de 01/07/2007 (Cat. B) estão isentos. Híbridos e plug-in não estão isentos.",
          },
        },
        {
          "@type": "Question",
          name: "As taxas do IUC aumentaram em 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Não. As taxas do IUC para 2026 são exatamente as mesmas de 2024 e 2025.",
          },
        },
        {
          "@type": "Question",
          name: "Qual a diferença entre ISV e IUC?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "O ISV é pago uma única vez na primeira matrícula em Portugal. O IUC é pago anualmente enquanto o veículo estiver matriculado.",
          },
        },
      ],
    },
  ],
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function SimuladorIUC() {
  const [form, setForm] = useState({
    combustivel: "gasolina",
    cilindrada: "",
    co2: "",
    normaCO2: "nedc",
    anoMatricula: "",
    origemUEEEE: "sim",
  });
  const [resultado, setResultado] = useState<IUCResult | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const ano = Number(form.anoMatricula);
  const validAno = !isNaN(ano) && ano >= 1970;
  const isCatA = validAno && (ano < 2007 || (ano === 2007 && form.origemUEEEE === "sim"));
  const isCatB = validAno && !isCatA;
  const isEletrico = form.combustivel === "eletrico";
  const isEletricoCatBIsento = isEletrico && isCatB;
  const isEletricoCatA = isEletrico && isCatA;
  const mostrarCO2 = !isEletrico && isCatB;
  const mostrarNorma = mostrarCO2;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => {
      const updated = { ...f, [name]: value };
      if (name === "anoMatricula") {
        const y = Number(value);
        if (y >= 2020) updated.normaCO2 = "wltp";
        else if (y > 0 && y <= 2017) updated.normaCO2 = "nedc";
      }
      return updated;
    });
    setResultado(null);
    setErro(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const anoNum = Number(form.anoMatricula);
    if (!form.anoMatricula || isNaN(anoNum) || anoNum < 1970 || anoNum > new Date().getFullYear()) {
      setErro("Introduza um ano de matrícula válido (ex: 2018).");
      return;
    }

    if (!isEletricoCatBIsento) {
      const cilNum = Number(form.cilindrada);
      if (!form.cilindrada || isNaN(cilNum) || cilNum <= 0) {
        setErro(isEletricoCatA ? "Introduza a voltagem total da bateria (V)." : "Introduza uma cilindrada válida (em cm³).");
        return;
      }
    }

    const r = calcularIUC(form);
    if (!r) {
      setErro("Não foi possível calcular. Verifique os dados introduzidos.");
      return;
    }
    setResultado(r);
  }

  function handleReset() {
    setForm({ combustivel: "gasolina", cilindrada: "", co2: "", normaCO2: "nedc", anoMatricula: "", origemUEEEE: "sim" });
    setResultado(null);
    setErro(null);
  }

  return (
    <MainLayout>
      <Seo
        title={SEO_KEYWORDS.simulador_iuc?.title ?? "Simulador IUC 2026 GRÁTIS Portugal | Cálculo Instantâneo | AutoGo.pt"}
        description={SEO_KEYWORDS.simulador_iuc?.description ?? ""}
        url="https://autogo.pt/simulador-iuc"
        keywords={joinKeywords(SEO_KEYWORDS.simulador_iuc?.keywords ?? [], IUC_KEYWORDS, SITE_WIDE_KEYWORDS)}
        jsonLd={jsonLd}
      />

      {/* Red accent bar */}
      <div className="fixed top-[64px] left-0 w-full z-40 pointer-events-none">
        <span className="block h-1.5 bg-gradient-to-r from-[#b42121] via-[#d50032] to-[#b42121] opacity-90" />
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
              Tabelas oficiais 2026 — Categorias A e B, elétricos isentos, taxa adicional gasóleo incluída.
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
                    <option value="diesel">Gasóleo</option>
                    <option value="eletrico">Elétrico (100% elétrico)</option>
                  </select>
                  {isEletrico && (
                    <p className="text-xs text-amber-600 mt-1.5 bg-amber-50 rounded px-2 py-1.5">
                      ⚠️ Híbridos e plug-in híbridos <strong>não</strong> estão isentos — selecione gasolina ou gasóleo.
                    </p>
                  )}
                </div>

                {/* Ano de matrícula */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Ano de 1ª Matrícula (PT/UE/EEE)
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
                    Importados UE/EEE: use a data da matrícula original (não a portuguesa).
                  </p>
                </div>

                {/* Origem UE/EEE — relevante para ano = 2007 */}
                {validAno && ano === 2007 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Primeira matrícula em Portugal, UE ou EEE?
                    </label>
                    <select
                      name="origemUEEEE"
                      value={form.origemUEEEE}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b42121]/40 focus:border-[#b42121] bg-white"
                    >
                      <option value="sim">Sim (PT/UE/EEE) — antes de Julho → Cat. A</option>
                      <option value="nao">Não (ex: Suíça, EUA…) → Cat. B</option>
                    </select>
                  </div>
                )}

                {/* Indicador de categoria */}
                {validAno && ano !== 2007 && (
                  <div className={`text-xs px-3 py-2 rounded-lg font-medium ${isCatA ? "bg-gray-100 text-gray-600" : "bg-[#b42121]/5 text-[#b42121]"}`}>
                    {isCatA
                      ? "📋 Categoria A — taxa fixa por cilindrada e período de matrícula"
                      : isEletricoCatBIsento
                        ? "⚡ Categoria B — Elétrico: isento de IUC"
                        : "📊 Categoria B — cálculo por cilindrada + CO₂ × coeficiente ano"}
                  </div>
                )}

                {/* Cilindrada / Voltagem */}
                {!isEletricoCatBIsento && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {isEletricoCatA ? "Voltagem total da bateria (V)" : "Cilindrada (cm³)"}
                    </label>
                    <input
                      type="number"
                      name="cilindrada"
                      value={form.cilindrada}
                      onChange={handleChange}
                      placeholder={isEletricoCatA ? "ex: 72" : "ex: 1598"}
                      min={1}
                      max={9999}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b42121]/40 focus:border-[#b42121]"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {isEletricoCatA ? "Voltagem total do sistema (campo no DUA)." : "Campo P.1 no Documento Único Automóvel (DUA)."}
                    </p>
                  </div>
                )}

                {/* CO₂ — só Cat B, não elétrico */}
                {mostrarCO2 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Emissões CO₂ (g/km)
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
                    <p className="text-xs text-gray-400 mt-1">
                      Campo V.7 no DUA. Em carros novos pós-2018 pode não estar — consulte o manual ou COC.
                    </p>
                  </div>
                )}

                {/* Norma CO₂ */}
                {mostrarNorma && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Norma de homologação CO₂
                    </label>
                    <select
                      name="normaCO2"
                      value={form.normaCO2}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b42121]/40 focus:border-[#b42121] bg-white"
                    >
                      <option value="nedc">NEDC (regra geral: até 2017, maioria de 2018)</option>
                      <option value="wltp">WLTP (regra geral: maioria de 2019, todos de 2020+)</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      NEDC: limites mais baixos. WLTP: limites mais altos. Em dúvida consulte o COC do veículo.
                    </p>
                  </div>
                )}

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

                  {resultado.isento ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                      <div className="text-4xl mb-2">{resultado.categoria === "isento" ? "⚡" : "✅"}</div>
                      <p className="text-2xl font-bold text-green-700 mb-2">IUC: Isento</p>
                      <p className="text-green-600 text-sm">{resultado.isentoRazao}</p>
                    </div>
                  ) : (
                    <>
                      {/* Valor final */}
                      <div className="bg-[#b42121]/5 border border-[#b42121]/20 rounded-xl p-5 text-center mb-5">
                        <p className="text-sm text-gray-500 mb-1">IUC Anual Estimado</p>
                        <p className="text-4xl font-black text-[#b42121]">
                          {resultado.iuc_final.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Categoria {resultado.categoria}</p>
                      </div>

                      {/* Breakdown */}
                      <div className="space-y-2 mb-5">
                        {resultado.breakdown.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-100">
                            <span className="text-gray-600">{item.label}</span>
                            <span className="font-semibold text-right">
                              {item.texto
                                ? <span className="text-xs">{item.texto}</span>
                                : item.valor != null
                                  ? `€${item.valor.toFixed(2)}`
                                  : "—"}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between text-base py-2 font-bold">
                          <span className="text-gray-800">IUC Final</span>
                          <span className="text-[#b42121]">€{resultado.iuc_final.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Info detalhada */}
                      {resultado.info.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                          {resultado.info.map((line, i) => (
                            <p key={i} className="text-xs text-gray-500">{line}</p>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                    * Valor estimado com base nas tabelas IUC 2026 (impostosobreveiculos.info / AT). Há isenção quando o valor calculado é inferior a €10. Para valor exato consulte o Portal das Finanças.
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-5 bg-gray-900 rounded-2xl p-5 text-white">
                <p className="text-sm font-semibold mb-1">A importar um carro?</p>
                <p className="text-xs text-gray-300 mb-3">
                  Para além do IUC anual, precisará de calcular também o <strong className="text-white">ISV</strong> (pago uma vez na importação). Use o nosso simulador ISV gratuito.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link href="/simulador-isv" className="flex-1 text-center bg-[#b42121] hover:bg-[#9a1c1c] text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-colors">
                    Simulador ISV →
                  </Link>
                  <Link href="/pedido" className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-colors">
                    Pedir Proposta Grátis
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Como se calcula ── */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Como se calcula o IUC em 2026?</h2>
            <p className="text-center text-gray-500 text-sm mb-8">As taxas não foram atualizadas em 2026 — são exatamente as mesmas de 2024 e 2025.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 bg-gray-700 text-white rounded-xl flex items-center justify-center font-black text-sm">A</span>
                  <div>
                    <p className="font-bold text-gray-800">Categoria A</p>
                    <p className="text-xs text-gray-500">1ª matrícula PT/UE/EEE até 30 Jun 2007</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="font-bold text-gray-700 mt-0.5">→</span>Taxa fixa por escalão de cilindrada</li>
                  <li className="flex gap-2"><span className="font-bold text-gray-700 mt-0.5">→</span>3 períodos: 1981–89 / 1990–95 / 1996–Jun 2007</li>
                  <li className="flex gap-2"><span className="font-bold text-gray-700 mt-0.5">→</span>Anterior a 1981: <strong>isento</strong></li>
                  <li className="flex gap-2"><span className="font-bold text-gray-700 mt-0.5">→</span>Gasóleo: taxa inclui adicional</li>
                  <li className="flex gap-2"><span className="font-bold text-gray-700 mt-0.5">→</span>Sem componente CO₂</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 bg-[#b42121] text-white rounded-xl flex items-center justify-center font-black text-sm">B</span>
                  <div>
                    <p className="font-bold text-gray-800">Categoria B</p>
                    <p className="text-xs text-gray-500">1ª matrícula PT/UE/EEE a partir de 1 Jul 2007</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#b42121] font-bold mt-0.5">1.</span>Taxa cilindrada (4 escalões: €31,77 a €435,84)</li>
                  <li className="flex gap-2"><span className="text-[#b42121] font-bold mt-0.5">2.</span>+ Taxa CO₂ (NEDC ou WLTP)</li>
                  <li className="flex gap-2"><span className="text-[#b42121] font-bold mt-0.5">3.</span>+ Taxa adicional CO₂ (se matrícula ≥ 2017)</li>
                  <li className="flex gap-2"><span className="text-[#b42121] font-bold mt-0.5">4.</span>× Coeficiente ano — multiplica (1+2+3) — (1,00 / 1,05 / 1,10 / 1,15)</li>
                  <li className="flex gap-2"><span className="text-[#b42121] font-bold mt-0.5">5.</span>+ Taxa adicional gasóleo (se gasóleo)</li>
                  <li className="flex gap-2"><span className="text-[#b42121] font-bold mt-0.5">→</span>Elétricos 100%: <strong>isentos</strong></li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── ISV vs IUC ── */}
          <section className="mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 mb-3">ISV vs IUC — Qual a diferença?</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">ISV — pago uma vez</p>
                  <p>Pago na 1ª matrícula em Portugal. Calculado sobre cilindrada + CO₂. Elétricos: isentos.</p>
                  <Link href="/simulador-isv" className="mt-2 inline-block text-[#b42121] font-semibold hover:underline text-xs">
                    Calcular ISV →
                  </Link>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">IUC — pago todos os anos</p>
                  <p>Pago anualmente no mês do aniversário da matrícula. Há isenção quando o valor é inferior a €10.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Perguntas Frequentes — IUC 2026</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                {
                  q: "O que é o IUC e quem tem de pagar?",
                  a: "O IUC (Imposto Único de Circulação) é pago anualmente por todos os proprietários de veículos matriculados em Portugal. Há isenção quando o valor calculado é inferior a €10, e para elétricos Cat. B.",
                },
                {
                  q: "As taxas do IUC aumentaram em 2026?",
                  a: "Não. As taxas do IUC para 2026 são exatamente as mesmas de 2024 e 2025. Não houve qualquer atualização.",
                },
                {
                  q: "O IUC de um carro importado da UE é calculado como?",
                  a: "Desde 2020, para usados importados de países da UE/EEE, é a data da primeira matrícula nesses países que conta. Para importados de fora da UE/EEE (ex: Suíça, EUA), usa-se sempre a data da matrícula portuguesa.",
                },
                {
                  q: "Quando e como se paga o IUC?",
                  a: "O pagamento deve ser feito entre o 1º dia do mês anterior ao mês da matrícula e o final do mês da matrícula. Na compra de carro novo ou importação: até 90 dias após a matrícula. Pode pagar no Portal das Finanças (AT), Multibanco, CTT ou homebanking.",
                },
                {
                  q: "Híbridos e plug-in híbridos estão isentos de IUC?",
                  a: "Não. Apenas os automóveis 100% elétricos com matrícula a partir de 01/07/2007 (Cat. B) estão isentos. Híbridos e plug-in pagam o valor normal como qualquer outro veículo.",
                },
                {
                  q: "O que é a norma NEDC vs WLTP no IUC?",
                  a: "São dois métodos de medição de emissões CO₂. Até 2017: NEDC. A partir de 2020: todos WLTP. Em 2018-2019 coexistiram. O IUC usa tabelas com limites diferentes para cada norma (WLTP tem limites mais altos porque mede mais emissões). Verifique no COC ou DUA do veículo.",
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

          {/* Breadcrumb */}
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

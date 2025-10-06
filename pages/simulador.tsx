import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "../components/MainLayout";
import Head from "next/head";

// Tabelas ISV Diário da República
const TABELA_CILINDRADA_A = [
  { min: 0, max: 1000, taxa: 1.09, abate: 849.03 },
  { min: 1001, max: 1250, taxa: 1.18, abate: 850.69 },
  { min: 1251, max: Infinity, taxa: 5.61, abate: 6194.88 },
];

const TABELA_AMBIENTAL_GASOLINA_NEDC = [
  { min: 0, max: 99, taxa: 4.62, abate: 427 },
  { min: 100, max: 115, taxa: 8.09, abate: 750.99 },
  { min: 116, max: 145, taxa: 52.56, abate: 5903.94 },
  { min: 146, max: 175, taxa: 61.24, abate: 7140.17 },
  { min: 176, max: 195, taxa: 155.97, abate: 23627.27 },
  { min: 196, max: Infinity, taxa: 205.65, abate: 33390.12 },
];

const TABELA_AMBIENTAL_GASOLINA_WLTP = [
  { min: 0, max: 110, taxa: 0.44, abate: 43.02 },
  { min: 111, max: 115, taxa: 1.1, abate: 115.8 },
  { min: 116, max: 120, taxa: 1.38, abate: 147.79 },
  { min: 121, max: 130, taxa: 5.27, abate: 619.17 },
  { min: 131, max: 145, taxa: 6.38, abate: 762.73 },
  { min: 146, max: 175, taxa: 41.54, abate: 5819.56 },
  { min: 176, max: 195, taxa: 51.38, abate: 7247.39 },
  { min: 196, max: 235, taxa: 193.01, abate: 34190.52 },
  { min: 236, max: Infinity, taxa: 233.81, abate: 41910.96 },
];

const TABELA_AMBIENTAL_DIESEL_NEDC = [
  { min: 0, max: 79, taxa: 5.78, abate: 439.04 },
  { min: 80, max: 95, taxa: 23.45, abate: 1848.58 },
  { min: 96, max: 120, taxa: 79.22, abate: 7195.63 },
  { min: 121, max: 140, taxa: 175.73, abate: 18924.92 },
  { min: 141, max: 160, taxa: 195.43, abate: 21720.92 },
  { min: 161, max: Infinity, taxa: 268.42, abate: 33447.9 },
];

const TABELA_AMBIENTAL_DIESEL_WLTP = [
  { min: 0, max: 110, taxa: 1.72, abate: 11.5 },
  { min: 111, max: 120, taxa: 18.96, abate: 1906.19 },
  { min: 121, max: 140, taxa: 65.04, abate: 7360.85 },
  { min: 141, max: 150, taxa: 127.4, abate: 16080.57 },
  { min: 151, max: 160, taxa: 160.81, abate: 21176.06 },
  { min: 161, max: 170, taxa: 221.69, abate: 29227.38 },
  { min: 171, max: 190, taxa: 274.08, abate: 36987.98 },
  { min: 191, max: Infinity, taxa: 282.35, abate: 38271.32 },
];

// Tabela B (Comerciais, autocaravanas, anteriores a 1970)
const TABELA_CILINDRADA_B = [
  { min: 0, max: 1250, taxa: 5.3, abate: 3331.68 },
  { min: 1251, max: Infinity, taxa: 12.58, abate: 12138.47 },
];

// Tabela Reduções Usados (Tabela D)
const REDUCOES_USADOS = [
  { min: 0, max: 1, reducao: 0.1 },
  { min: 1, max: 2, reducao: 0.2 },
  { min: 2, max: 3, reducao: 0.28 },
  { min: 3, max: 4, reducao: 0.35 },
  { min: 4, max: 5, reducao: 0.43 },
  { min: 5, max: 6, reducao: 0.52 },
  { min: 6, max: 7, reducao: 0.6 },
  { min: 7, max: 8, reducao: 0.65 },
  { min: 8, max: 9, reducao: 0.7 },
  { min: 9, max: 10, reducao: 0.75 },
  { min: 10, max: Infinity, reducao: 0.8 },
];

// Taxas intermédias
const TAXAS_INTERMEDIAS = [
  { key: "hibrido_full", label: "Híbrido >50km e <50g CO2/km", percent: 0.6 },
  { key: "misto_7lugar", label: "Misto >2500kg 7 lugares", percent: 0.4 },
  { key: "gas_natural", label: "Só gás natural", percent: 0.4 },
  { key: "plugin", label: "Plug-in >50km e <50g CO2/km", percent: 0.25 },
  {
    key: "plugin_2015_2020",
    label: "Plug-in UE 2015-2020 >25km",
    percent: 0.25,
  },
  { key: "comercial_4x4", label: "Comercial caixa aberta 4x4", percent: 0.5 },
];

// Ajuda função escalão
function getEscalao(tabela, valor) {
  return tabela.find((e) => valor >= e.min && valor <= e.max);
}

function getReducaoUsados(anos) {
  const r =
    REDUCOES_USADOS.find((e) => anos > e.min && anos <= e.max) ||
    REDUCOES_USADOS[REDUCOES_USADOS.length - 1];
  return r.reducao;
}

// Calcula anos de uso completos (arredondando para cima após cada aniversário)
function calcularAnosUsoCompletos(dia, mes, ano) {
  if (!dia || !mes || !ano) return "";
  const dataMatricula = new Date(Number(ano), Number(mes) - 1, Number(dia));
  const hoje = new Date();
  let anos = hoje.getFullYear() - dataMatricula.getFullYear();
  const m = hoje.getMonth() - dataMatricula.getMonth();
  const d = hoje.getDate() - dataMatricula.getDate();
  if (m > 0 || (m === 0 && d >= 0)) {
    anos += 1; // Já passou o aniversário este ano
  }
  // Se ainda não fez aniversário este ano, não soma
  return anos > 0 ? String(anos) : "1";
}

// export default function SimuladorISV() { ... }
// The SimuladorISV component is commented out or removed to avoid duplicate default exports.
// If you want to keep both simulators, export one as named and the other as default, or split into separate files.
const TABELA_AMBIENTAL_NEDC_GASOLINA = [
  { min: 0, max: 99, taxa: 4.62, abate: 427.0 },
  { min: 100, max: 115, taxa: 8.09, abate: 750.99 },
  { min: 116, max: 145, taxa: 52.56, abate: 5903.94 },
  { min: 146, max: 175, taxa: 61.24, abate: 7140.17 },
  { min: 176, max: 195, taxa: 155.97, abate: 23627.27 },
  { min: 196, max: Infinity, taxa: 205.65, abate: 33390.12 },
];
const TABELA_AMBIENTAL_NEDC_DIESEL = [
  { min: 0, max: 79, taxa: 5.78, abate: 439.04 },
  { min: 80, max: 95, taxa: 23.45, abate: 1848.58 },
  { min: 96, max: 120, taxa: 79.22, abate: 7195.63 },
  { min: 121, max: 140, taxa: 175.73, abate: 18924.92 },
  { min: 141, max: 160, taxa: 195.43, abate: 21720.92 },
  { min: 161, max: Infinity, taxa: 268.42, abate: 33447.9 },
];

function getEscalaoTabela(tabela, valor) {
  return tabela.find((e) => valor >= e.min && valor <= e.max);
}

function descontoIdade(ano) {
  const anoAtual = new Date().getFullYear();
  const idade = anoAtual - ano;
  if (idade <= 1) return 0.1;
  if (idade <= 2) return 0.2;
  if (idade <= 3) return 0.28;
  if (idade <= 4) return 0.35;
  if (idade <= 5) return 0.43;
  if (idade <= 6) return 0.52;
  if (idade <= 7) return 0.6;
  if (idade <= 8) return 0.65;
  if (idade <= 9) return 0.7;
  if (idade <= 10) return 0.75;
  return 0.8;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function Simulador() {
  const { t } = useTranslation("common");
  // State to toggle simulator card visibility
  const [simulatorOpen, setSimulatorOpen] = useState(true);
  const [logoAnim, setLogoAnim] = useState(false);
  // Estados do formulário, persistidos em localStorage
  const defaultForm = {
    tipo: "passageiro",
    cilindrada: "",
    combustivel: "gasolina",
    norma: "wltp",
    co2: "",
    ano: "",
    mes: "",
    dia: "",
    particulas: "nao",
    usado: "nao",
    anosUso: "",
    taxaIntermedia: "",
  };
  // TTL for persisted simulator form (milliseconds). Set to 10 minutes for quick forget behavior.
  const SIMULADOR_FORM_TTL_MS = 10 * 60 * 1000; // 10 minutes
  const [form, setForm] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("simuladorISVForm");
        if (raw) {
          const parsed = JSON.parse(raw);
          // Support legacy storage (plain form object) and new shape { savedAt, ...form }
          const savedAt = parsed && typeof parsed.savedAt === 'number' ? parsed.savedAt : null;
          const savedForm = parsed && typeof parsed === 'object' && parsed.savedAt ? (() => { const copy = { ...parsed }; delete (copy as any).savedAt; return copy; })() : parsed;
          if (savedAt) {
            const age = Date.now() - savedAt;
            if (age > SIMULADOR_FORM_TTL_MS) {
              // expired -> remove and fall through to default
              try { localStorage.removeItem('simuladorISVForm'); } catch (e) {}
            } else {
              return { ...defaultForm, ...savedForm };
            }
          } else {
            // legacy data without timestamp - treat as fresh and save again with timestamp
            return { ...defaultForm, ...savedForm };
          }
        }
      } catch {}
    }
    return defaultForm;
  });
  // Atualiza anos de uso completos automaticamente se usado e data preenchida
  React.useEffect(() => {
    if (form.usado === "sim" && form.dia && form.mes && form.ano) {
      const anos = calcularAnosUsoCompletos(form.dia, form.mes, form.ano);
      setForm((f) => {
        const updated = { ...f, anosUso: anos };
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("simuladorISVForm", JSON.stringify({ savedAt: Date.now(), ...updated }));
          } catch (e) {}
        }
        return updated;
      });
    }
  }, [form.usado, form.dia, form.mes, form.ano]);

  // Salva o estado do formulário sempre que mudar
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("simuladorISVForm", JSON.stringify({ savedAt: Date.now(), ...form }));
      } catch (e) {}
    }
  }, [form]);
  const [erroData, setErroData] = useState<string | null>(null);
  const [resultado, setResultado] = useState<any>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function calcularISV(e: React.FormEvent) {
    e.preventDefault();
    setErroData(null);
    if (!form.ano || !form.mes || !form.dia) {
      setErroData("Preencha o dia, mês e ano da 1ª matrícula.");
      return;
    }
    // Comerciais/autocaravanas/anteriores a 1970 -> Tabela B
    let isvCilindrada = 0;
    let isvAmbiental = 0;
    let isvBruto = 0;
    let info: string[] = [];
    if (form.tipo === "comercial") {
      const esc = getEscalao(TABELA_CILINDRADA_B, Number(form.cilindrada));
      isvCilindrada = Math.max(
        0,
        Number(form.cilindrada) * esc.taxa - esc.abate,
      );
      isvBruto = isvCilindrada;
      info.push("Tabela B: só componente cilindrada.");
    } else {
      // Passageiros/mistos -> Tabela A
      const escCil = getEscalao(TABELA_CILINDRADA_A, Number(form.cilindrada));
      isvCilindrada = Math.max(
        0,
        Number(form.cilindrada) * escCil.taxa - escCil.abate,
      );
      // Componente ambiental
      let escAmb;
      if (
        form.combustivel === "gasolina" ||
        form.combustivel === "gpl" ||
        form.combustivel === "gn"
      ) {
        escAmb = getEscalao(
          form.norma === "wltp"
            ? TABELA_AMBIENTAL_GASOLINA_WLTP
            : TABELA_AMBIENTAL_GASOLINA_NEDC,
          Number(form.co2),
        );
      } else {
        escAmb = getEscalao(
          form.norma === "wltp"
            ? TABELA_AMBIENTAL_DIESEL_WLTP
            : TABELA_AMBIENTAL_DIESEL_NEDC,
          Number(form.co2),
        );
      }
      isvAmbiental = Math.max(0, Number(form.co2) * escAmb.taxa - escAmb.abate);
      isvBruto = isvCilindrada + isvAmbiental;
      info.push("Tabela A: cilindrada + ambiental.");
    }
    // Partículas diesel
    if (
      form.combustivel === "diesel" &&
      form.particulas === "sim" &&
      form.tipo !== "comercial"
    ) {
      isvBruto += 500;
      info.push("+500€ por partículas.");
    }
    // Redução para usados
    let isvReduzido = isvBruto;
    if (form.usado === "sim" && form.anosUso) {
      const reducao = getReducaoUsados(Number(form.anosUso));
      isvReduzido = isvBruto * (1 - reducao);
      info.push(`Redução usados: -${(reducao * 100).toFixed(0)}%.`);
    }
    // Taxa intermédia
    let isvFinal = isvReduzido;
    if (form.taxaIntermedia) {
      const percent =
        TAXAS_INTERMEDIAS.find((t) => t.key === form.taxaIntermedia)?.percent ||
        1;
      isvFinal = isvReduzido * percent;
      info.push(`Taxa intermédia: x${(percent * 100).toFixed(0)}%.`);
    }
    // Custos legalização
    const legalizacao = 195;
    setResultado({
      isvCilindrada,
      isvAmbiental,
      isvBruto,
      isvFinal,
      legalizacao,
      info,
    });
  }

  return (
    <>
      <MainLayout>
        <Head>
          <title>Simulador ISV de importação automóvel | AutoGo.pt</title>
          <meta name="description" content="Simule o ISV (Imposto Sobre Veículos) em Portugal com o Simulador ISV AutoGo.pt — cálculo rápido e preciso para carros novos, usados, híbridos e elétricos. Único simulador prático e adaptado às tabelas oficiais." />
          <meta name="keywords" content="Simulador ISV, simulador ISV Portugal, calcular ISV, ISV Portugal, simulador impostos carros, simulador de carros, AutoGo.pt, cálculo ISV, importação de viaturas" />
          <meta property="og:title" content="Simulador ISV de importação automóvel | AutoGo.pt" />
          <meta property="og:description" content="Simule o ISV em Portugal com o simulador AutoGo.pt — rápido, preciso e baseado nas tabelas oficiais do Diário da República." />
          <meta property="og:image" content="https://autogo.pt/images/auto-logo.png" />
        </Head>
        <div className="relative w-full flex-1 z-10">
          <section className="relative w-full flex flex-col lg:flex-row items-start justify-between gap-16 py-6 px-2 sm:px-6 md:px-12 bg-transparent">
            {/* Info block */}
            <div className="w-full max-w-3xl mb-10 lg:mb-0 pr-8 pt-8 pb-8 flex flex-col items-start text-left lg:items-start lg:text-left z-10">
              <h3 className="text-3xl font-bold text-[#b42121] mb-6 leading-tight">
                {t("Simule o ISV da sua viatura em segundos!")}
              </h3>
              <p className="mb-4 text-lg font-bold">
                {t(
                  "Poupe tempo e evite surpresas, recorrendo à nossa experiência técnica.",
                )}
              </p>
              <p className="mb-4 text-lg">
                {t(
                  "O nosso simulador de ISV (Imposto Sobre Veículos) é a ferramenta mais prática e fiável para calcular o custo de legalização de um veículo importado.",
                )}
                <br />
                {t(
                  "Basta introduzir os dados essenciais da viatura e rapidamente obtém uma estimativa precisa do imposto a pagar.",
                )}
              </p>
              <p className="mb-4 text-lg">
                {t(
                  "Para um cálculo exato, vai precisar de alguns elementos da viatura — caso tenha dúvidas, pode contactar-nos por email e esclarecemos como usar o simulador.",
                )}
              </p>
              <p className="mb-4 font-semibold text-[#b42121] text-lg">
                {t("Dica AutoGo:")}{" "}
                <span className="font-normal text-black">
                  {t(
                    "Utilize sempre o simulador com todos os dados da viatura que pretende importar. Assim garante total transparência e evita custos inesperados.",
                  )}
                </span>
              </p>
              <p className="text-lg">
                {t(
                  "Conte connosco para o apoiar em todo o processo e tornar o seu negócio de importação ainda mais simples e seguro!",
                )}
              </p>
              <div className="relative w-full flex items-center mt-6">
                {/* 3 horizontal, thick, long CSS red stripes behind car */}
                <div
                  className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-0 pointer-events-none"
                  style={{ zIndex: 0, height: "100%" }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "-10%",
                      width: "110%",
                      top: "38%",
                      height: "22px",
                      background: "#b42121",
                      borderRadius: "12px",
                      opacity: 0.8,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: "0%",
                      width: "105%",
                      top: "50%",
                      height: "22px",
                      background: "#b42121",
                      borderRadius: "12px",
                      opacity: 0.7,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: "10%",
                      width: "100%",
                      top: "62%",
                      height: "22px",
                      background: "#b42121",
                      borderRadius: "12px",
                      opacity: 0.6,
                    }}
                  />
                </div>
                <img
                  src="/images/amgsimulador.png"
                  alt="Carro exemplo simulador ISV"
                  className="relative w-full max-w-4xl mx-auto object-cover z-10"
                  style={{
                    background: "none",
                    border: "none",
                    borderRadius: 0,
                    boxShadow: "none",
                  }}
                />
              </div>
            </div>
            {/* Simulator card toggleable by logo */}
            <div className="relative w-full max-w-lg ml-auto flex flex-col items-center pt-8">
              <button
                type="button"
                aria-label="Abrir/Fechar Simulador"
                onClick={() => {
                  setSimulatorOpen((v) => !v);
                  setLogoAnim(true);
                  setTimeout(() => setLogoAnim(false), 700);
                }}
                className="focus:outline-none mb-2"
                style={{ marginTop: 0 }}
              >
                <img
                  src="/images/autogoblack.png"
                  alt="AutoGo Logo"
                  className={`w-32 h-32 object-contain mx-auto drop-shadow-lg bg-white rounded-full border-4 border-white shadow-lg transition-transform duration-700 ${logoAnim ? "animate-spin-slow" : ""}`}
                />
              </button>
              <div
                className={`w-full transition-all duration-700 ${simulatorOpen ? "opacity-100 scale-100 max-h-[2000px] pointer-events-auto" : "opacity-0 scale-95 max-h-0 pointer-events-none overflow-hidden"}`}
              >
                <div className="bg-white/80 rounded-3xl shadow-2xl border border-[#b42121]/10 backdrop-blur-md p-2 sm:p-6 md:p-10 flex flex-col items-center w-full max-w-full overflow-x-auto">
                  <h2 className="text-3xl font-extrabold text-[#b42121] mb-8 text-center tracking-tight drop-shadow">
                    Simulador ISV Portugal
                  </h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      calcularISV(e);
                    }}
                    className="flex flex-col gap-5 w-full"
                  >
                    {/* ...existing form fields... */}
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-[#b42121]">
                        {t("Tipo de veículo")}
                      </label>
                      <select
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        className="rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                      >
                        <option value="passageiro">Passageiro / Misto</option>
                        <option value="comercial">
                          Comercial / Autocaravana / &lt;1970
                        </option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-[#b42121]">
                        {t("Cilindrada (cm³)")}
                      </label>
                      <input
                        name="cilindrada"
                        type="number"
                        value={form.cilindrada}
                        onChange={handleChange}
                        required
                        className="rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                      />
                    </div>
                    {form.tipo === "passageiro" && (
                      <>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-[#b42121]">
                            {t("Combustível")}
                          </label>
                          <select
                            name="combustivel"
                            value={form.combustivel}
                            onChange={handleChange}
                            className="rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                          >
                            <option value="gasolina">Gasolina</option>
                            <option value="gpl">GPL</option>
                            <option value="gn">Gás Natural</option>
                            <option value="diesel">Diesel</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-[#b42121]">
                            {t("Norma de homologação")}
                          </label>
                          <select
                            name="norma"
                            value={form.norma}
                            onChange={handleChange}
                            className="rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                          >
                            <option value="wltp">WLTP</option>
                            <option value="nedc">NEDC</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-[#b42121]">
                            {t("Emissões CO₂ (g/km)")}
                          </label>
                          <input
                            name="co2"
                            type="number"
                            value={form.co2}
                            onChange={handleChange}
                            required
                            className="rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                          />
                        </div>
                      </>
                    )}
                    {form.combustivel === "diesel" &&
                      form.tipo === "passageiro" && (
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-[#b42121]">
                            {t("Emite partículas &gt;0,001g/km?")}
                          </label>
                          <select
                            name="particulas"
                            value={form.particulas}
                            onChange={handleChange}
                            className="rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                          >
                            <option value="nao">Não</option>
                            <option value="sim">Sim</option>
                          </select>
                        </div>
                      )}
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-[#b42121]">
                        {t("Ano da 1ª matrícula (UE)")}
                      </label>
                      <div className="flex gap-2">
                        <select
                          name="dia"
                          value={form.dia}
                          onChange={handleChange}
                          className="rounded-xl border border-[#b42121]/20 px-2 py-2 w-1/4 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                          required
                        >
                          <option value="">Dia</option>
                          {[...Array(31)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <select
                          name="mes"
                          value={form.mes}
                          onChange={handleChange}
                          className="rounded-xl border border-[#b42121]/20 px-2 py-2 w-1/3 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                          required
                        >
                          <option value="">Mês</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {(i + 1).toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <input
                          name="ano"
                          type="number"
                          min="1970"
                          max="2025"
                          value={form.ano}
                          onChange={handleChange}
                          className="rounded-xl border border-[#b42121]/20 px-2 py-2 w-1/3 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                          required
                          placeholder="Ano"
                        />
                      </div>
                      {erroData && (
                        <div className="text-red-600 text-sm mt-1">
                          {erroData}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-[#b42121]">
                        {t("Veículo usado?")}
                      </label>
                      <select
                        name="usado"
                        value={form.usado}
                        onChange={handleChange}
                        className="rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm"
                      >
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                      </select>
                    </div>
                    {/* Anos de uso completos omitido da tabela, mas continua a ser calculado automaticamente */}
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-[#b42121]">
                        {t("Taxa intermédia")}
                      </label>
                      <select
                        name="taxaIntermedia"
                        value={form.taxaIntermedia}
                        onChange={handleChange}
                        className="rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm mb-2"
                      >
                        <option value="">{t("Nenhuma (normal)")}</option>
                        {TAXAS_INTERMEDIAS.map((t) => (
                          <option key={t.key} value={t.key}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="bg-[#b42121] text-white rounded-full py-3 px-8 font-bold text-lg shadow-lg hover:bg-[#a11a1a] hover:scale-105 transition-all duration-200 mt-2"
                    >
                      {t("Calcular ISV")}
                    </button>
                  </form>
                  {resultado && (
                    <div className="mt-8 p-6 bg-[#f5f6fa] rounded-2xl shadow-inner border border-[#b42121]/10 animate-fade-in w-full">
                      <h3 className="text-xl font-semibold mb-2 text-[#b42121]">
                        {t("Resultado")}
                      </h3>
                      <p>
                        <b>{t("Cilindrada")}:</b>{" "}
                        {resultado.isvCilindrada.toLocaleString("pt-PT", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </p>
                      {form.tipo === "passageiro" && (
                        <p>
                          <b>{t("Ambiental")}:</b>{" "}
                          {resultado.isvAmbiental.toLocaleString("pt-PT", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </p>
                      )}
                      <p>
                        <b>{t("ISV bruto")}:</b>{" "}
                        {resultado.isvBruto.toLocaleString("pt-PT", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </p>
                      <p>
                        <b>{t("ISV final (após reduções e taxas)")}:</b>{" "}
                        <span className="text-[#17826b] text-[#b42121] font-bold">
                          {resultado.isvFinal.toLocaleString("pt-PT", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </span>
                      </p>
                      <p>
                        <b>{t("Legalização/documentos")}:</b>{" "}
                        {resultado.legalizacao.toLocaleString("pt-PT", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </p>
                      <ul className="mt-2 text-xs text-[#b42121] list-disc list-inside">
                        {resultado.info.map((msg: string, i: number) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-6 text-xs text-[#b42121] text-center">
                    {t("Fonte")}: Diário da República / Portal ISV Gov.pt.
                    <a
                      href="https://www2.gov.pt/servicos/tratar-do-imposto-de-um-veiculo-comprado-no-estrangeiro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#b42121] transition"
                    >
                      {t("Mais info")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <style jsx global>{`
              @keyframes spin-slow {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
              .animate-spin-slow {
                animation: spin-slow 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55);
              }
            `}</style>
          </section>
        </div>
      </MainLayout>
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
    </>
  );
}

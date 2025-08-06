import React, { useState, useEffect } from "react";

const TABELA_CILINDRADA_A = [
  { min: 0, max: 1000, taxa: 1.09, abate: 849.03 },
  { min: 1001, max: 1250, taxa: 1.18, abate: 850.69 },
  { min: 1251, max: Infinity, taxa: 5.61, abate: 6194.88 },
];
const TABELA_CILINDRADA_B = [
  { min: 0, max: 1250, taxa: 5.3, abate: 3331.68 },
  { min: 1251, max: Infinity, taxa: 12.58, abate: 12138.47 },
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
function getEscalao(tabela, valor) {
  return tabela.find((e) => valor >= e.min && valor <= e.max);
}
function getReducaoUsados(anos) {
  const r =
    REDUCOES_USADOS.find((e) => anos > e.min && anos <= e.max) ||
    REDUCOES_USADOS[REDUCOES_USADOS.length - 1];
  return r.reducao;
}
function calcularAnosUsoCompletos(dia, mes, ano) {
  if (!dia || !mes || !ano) return "";
  const dataMatricula = new Date(Number(ano), Number(mes) - 1, Number(dia));
  const hoje = new Date();
  let anos = hoje.getFullYear() - dataMatricula.getFullYear();
  const m = hoje.getMonth() - dataMatricula.getMonth();
  const d = hoje.getDate() - dataMatricula.getDate();
  if (m > 0 || (m === 0 && d >= 0)) {
    anos += 1;
  }
  return anos > 0 ? String(anos) : "1";
}

export default function SimuladorTabela() {
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
  const [form, setForm] = useState(() => defaultForm);
  const [erroData, setErroData] = useState(null);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    if (form.usado === "sim" && form.dia && form.mes && form.ano) {
      const anos = calcularAnosUsoCompletos(form.dia, form.mes, form.ano);
      setForm((f) => ({ ...f, anosUso: anos }));
    }
  }, [form.usado, form.dia, form.mes, form.ano]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function calcularISV(e) {
    e.preventDefault();
    setErroData(null);
    if (!form.ano || !form.mes || !form.dia) {
      setErroData("Preencha o dia, mês e ano da 1ª matrícula.");
      return;
    }
    let isvCilindrada = 0;
    let isvAmbiental = 0;
    let isvBruto = 0;
    let info = [];
    if (form.tipo === "comercial") {
      const esc = getEscalao(TABELA_CILINDRADA_B, Number(form.cilindrada));
      isvCilindrada = Math.max(
        0,
        Number(form.cilindrada) * esc.taxa - esc.abate,
      );
      isvBruto = isvCilindrada;
      info.push("Tabela B: só componente cilindrada.");
    } else {
      const escCil = getEscalao(TABELA_CILINDRADA_A, Number(form.cilindrada));
      isvCilindrada = Math.max(
        0,
        Number(form.cilindrada) * escCil.taxa - escCil.abate,
      );
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
    if (
      form.combustivel === "diesel" &&
      form.particulas === "sim" &&
      form.tipo !== "comercial"
    ) {
      isvBruto += 500;
      info.push("+500€ por partículas.");
    }
    let isvReduzido = isvBruto;
    if (form.usado === "sim" && form.anosUso) {
      const reducao = getReducaoUsados(Number(form.anosUso));
      isvReduzido = isvBruto * (1 - reducao);
      info.push(`Redução usados: -${(reducao * 100).toFixed(0)}%.`);
    }
    let isvFinal = isvReduzido;
    if (form.taxaIntermedia) {
      const percent =
        TAXAS_INTERMEDIAS.find((t) => t.key === form.taxaIntermedia)?.percent ||
        1;
      isvFinal = isvReduzido * percent;
      info.push(`Taxa intermédia: x${(percent * 100).toFixed(0)}%.`);
    }
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
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={calcularISV} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-[#b42121]">
            Tipo de veículo
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
            Cilindrada (cm³)
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
                Combustível
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
                Norma de homologação
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
                Emissões CO₂ (g/km)
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
        {form.combustivel === "diesel" && form.tipo === "passageiro" && (
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-[#b42121]">
              Emite partículas &gt;0,001g/km?
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
            Ano da 1ª matrícula (UE)
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
            <div className="text-red-600 text-sm mt-1">{erroData}</div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-[#b42121]">Veículo usado?</label>
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
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-[#b42121]">
            Taxa intermédia
          </label>
          <select
            name="taxaIntermedia"
            value={form.taxaIntermedia}
            onChange={handleChange}
            className="rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm mb-2"
          >
            <option value="">Nenhuma (normal)</option>
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
          Calcular ISV
        </button>
      </form>
      {resultado && (
        <div className="mt-8 p-6 bg-[#f5f6fa] rounded-2xl shadow-inner border border-[#b42121]/10 animate-fade-in w-full">
          <h3 className="text-xl font-semibold mb-2 text-[#b42121]">
            Resultado
          </h3>
          <p>
            <b>Cilindrada:</b>{" "}
            {resultado.isvCilindrada.toLocaleString("pt-PT", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
          {form.tipo === "passageiro" && (
            <p>
              <b>Ambiental:</b>{" "}
              {resultado.isvAmbiental.toLocaleString("pt-PT", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
          )}
          <p>
            <b>ISV bruto:</b>{" "}
            {resultado.isvBruto.toLocaleString("pt-PT", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
          <p>
            <b>ISV final (após reduções e taxas):</b>{" "}
            <span className="text-[#17826b] text-[#b42121] font-bold">
              {resultado.isvFinal.toLocaleString("pt-PT", {
                style: "currency",
                currency: "EUR",
              })}
            </span>
          </p>
          <p>
            <b>Legalização/documentos:</b>{" "}
            {resultado.legalizacao.toLocaleString("pt-PT", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
          <ul className="mt-2 text-xs text-[#b42121] list-disc list-inside">
            {resultado.info.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 text-xs text-[#b42121] text-center">
        Fonte: Diário da República / Portal ISV Gov.pt.
        <a
          href="https://www2.gov.pt/servicos/tratar-do-imposto-de-um-veiculo-comprado-no-estrangeiro"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#b42121] transition"
        >
          Mais info
        </a>
      </div>
    </div>
  );
}

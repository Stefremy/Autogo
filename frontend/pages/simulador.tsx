import React, { useState } from "react";
import MainLayout from "../components/MainLayout";

// Tabelas ISV Diário da República
const TABELA_CILINDRADA_A = [
  { min: 0, max: 1000, taxa: 1.09, abate: 849.03 },
  { min: 1001, max: 1250, taxa: 1.18, abate: 850.69 },
  { min: 1251, max: Infinity, taxa: 5.61, abate: 6194.88 }
];

const TABELA_AMBIENTAL_GASOLINA_NEDC = [
  { min: 0, max: 99, taxa: 4.62, abate: 427 },
  { min: 100, max: 115, taxa: 8.09, abate: 750.99 },
  { min: 116, max: 145, taxa: 52.56, abate: 5903.94 },
  { min: 146, max: 175, taxa: 61.24, abate: 7140.17 },
  { min: 176, max: 195, taxa: 155.97, abate: 23627.27 },
  { min: 196, max: Infinity, taxa: 205.65, abate: 33390.12 }
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
  { min: 236, max: Infinity, taxa: 233.81, abate: 41910.96 }
];

const TABELA_AMBIENTAL_DIESEL_NEDC = [
  { min: 0, max: 79, taxa: 5.78, abate: 439.04 },
  { min: 80, max: 95, taxa: 23.45, abate: 1848.58 },
  { min: 96, max: 120, taxa: 79.22, abate: 7195.63 },
  { min: 121, max: 140, taxa: 175.73, abate: 18924.92 },
  { min: 141, max: 160, taxa: 195.43, abate: 21720.92 },
  { min: 161, max: Infinity, taxa: 268.42, abate: 33447.90 }
];

const TABELA_AMBIENTAL_DIESEL_WLTP = [
  { min: 0, max: 110, taxa: 1.72, abate: 11.5 },
  { min: 111, max: 120, taxa: 18.96, abate: 1906.19 },
  { min: 121, max: 140, taxa: 65.04, abate: 7360.85 },
  { min: 141, max: 150, taxa: 127.4, abate: 16080.57 },
  { min: 151, max: 160, taxa: 160.81, abate: 21176.06 },
  { min: 161, max: 170, taxa: 221.69, abate: 29227.38 },
  { min: 171, max: 190, taxa: 274.08, abate: 36987.98 },
  { min: 191, max: Infinity, taxa: 282.35, abate: 38271.32 }
];

// Tabela B (Comerciais, autocaravanas, anteriores a 1970)
const TABELA_CILINDRADA_B = [
  { min: 0, max: 1250, taxa: 5.3, abate: 3331.68 },
  { min: 1251, max: Infinity, taxa: 12.58, abate: 12138.47 }
];

// Tabela Reduções Usados (Tabela D)
const REDUCOES_USADOS = [
  { min: 0, max: 1, reducao: 0.10 },
  { min: 1, max: 2, reducao: 0.20 },
  { min: 2, max: 3, reducao: 0.28 },
  { min: 3, max: 4, reducao: 0.35 },
  { min: 4, max: 5, reducao: 0.43 },
  { min: 5, max: 6, reducao: 0.52 },
  { min: 6, max: 7, reducao: 0.60 },
  { min: 7, max: 8, reducao: 0.65 },
  { min: 8, max: 9, reducao: 0.70 },
  { min: 9, max: 10, reducao: 0.75 },
  { min: 10, max: Infinity, reducao: 0.80 }
];

// Taxas intermédias
const TAXAS_INTERMEDIAS = [
  { key: "hibrido_full", label: "Híbrido >50km e <50g CO2/km", percent: 0.6 },
  { key: "misto_7lugar", label: "Misto >2500kg 7 lugares", percent: 0.4 },
  { key: "gas_natural", label: "Só gás natural", percent: 0.4 },
  { key: "plugin", label: "Plug-in >50km e <50g CO2/km", percent: 0.25 },
  { key: "plugin_2015_2020", label: "Plug-in UE 2015-2020 >25km", percent: 0.25 },
  { key: "comercial_4x4", label: "Comercial caixa aberta 4x4", percent: 0.5 }
];

// Ajuda função escalão
function getEscalao(tabela, valor) {
  return tabela.find(e => valor >= e.min && valor <= e.max);
}

function getReducaoUsados(anos) {
  const r = REDUCOES_USADOS.find(e => anos > e.min && anos <= e.max) || REDUCOES_USADOS[REDUCOES_USADOS.length-1];
  return r.reducao;
}

// export default function SimuladorISV() { ... }
// The SimuladorISV component is commented out or removed to avoid duplicate default exports.
// If you want to keep both simulators, export one as named and the other as default, or split into separate files.
const TABELA_AMBIENTAL_NEDC_GASOLINA = [
  { min: 0, max: 99, taxa: 4.62, abate: 427.00 },
  { min: 100, max: 115, taxa: 8.09, abate: 750.99 },
  { min: 116, max: 145, taxa: 52.56, abate: 5903.94 },
  { min: 146, max: 175, taxa: 61.24, abate: 7140.17 },
  { min: 176, max: 195, taxa: 155.97, abate: 23627.27 },
  { min: 196, max: Infinity, taxa: 205.65, abate: 33390.12 }
];
const TABELA_AMBIENTAL_NEDC_DIESEL = [
  { min: 0, max: 79, taxa: 5.78, abate: 439.04 },
  { min: 80, max: 95, taxa: 23.45, abate: 1848.58 },
  { min: 96, max: 120, taxa: 79.22, abate: 7195.63 },
  { min: 121, max: 140, taxa: 175.73, abate: 18924.92 },
  { min: 141, max: 160, taxa: 195.43, abate: 21720.92 },
  { min: 161, max: Infinity, taxa: 268.42, abate: 33447.90 }
];

function getEscalaoTabela(tabela, valor) {
  return tabela.find(e => valor >= e.min && valor <= e.max);
}

function descontoIdade(ano) {
  const anoAtual = new Date().getFullYear();
  const idade = anoAtual - ano;
  if (idade <= 1) return 0.10;
  if (idade <= 2) return 0.20;
  if (idade <= 3) return 0.28;
  if (idade <= 4) return 0.35;
  if (idade <= 5) return 0.43;
  if (idade <= 6) return 0.52;
  if (idade <= 7) return 0.60;
  if (idade <= 8) return 0.65;
  if (idade <= 9) return 0.70;
  if (idade <= 10) return 0.75;
  return 0.80;
}

export default function Simulador() {
  // Estados do formulário
  const [form, setForm] = useState({
    tipo: 'passageiro',
    cilindrada: '',
    combustivel: 'gasolina',
    norma: 'wltp',
    co2: '',
    ano: '',
    mes: '',
    dia: '',
    particulas: 'nao',
    usado: 'nao',
    anosUso: '',
    taxaIntermedia: '',
  });
  const [erroData, setErroData] = useState<string | null>(null);
  const [resultado, setResultado] = useState<any>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function calcularISV(e: React.FormEvent) {
    e.preventDefault();
    setErroData(null);
    if (!form.ano || !form.mes || !form.dia) {
      setErroData('Preencha o dia, mês e ano da 1ª matrícula.');
      return;
    }
    // Comerciais/autocaravanas/anteriores a 1970 -> Tabela B
    let isvCilindrada = 0;
    let isvAmbiental = 0;
    let isvBruto = 0;
    let info: string[] = [];
    if (form.tipo === 'comercial') {
      const esc = getEscalao(TABELA_CILINDRADA_B, Number(form.cilindrada));
      isvCilindrada = Math.max(0, Number(form.cilindrada) * esc.taxa - esc.abate);
      isvBruto = isvCilindrada;
      info.push('Tabela B: só componente cilindrada.');
    } else {
      // Passageiros/mistos -> Tabela A
      const escCil = getEscalao(TABELA_CILINDRADA_A, Number(form.cilindrada));
      isvCilindrada = Math.max(0, Number(form.cilindrada) * escCil.taxa - escCil.abate);
      // Componente ambiental
      let escAmb;
      if (form.combustivel === 'gasolina' || form.combustivel === 'gpl' || form.combustivel === 'gn') {
        escAmb = getEscalao(
          form.norma === 'wltp' ? TABELA_AMBIENTAL_GASOLINA_WLTP : TABELA_AMBIENTAL_GASOLINA_NEDC,
          Number(form.co2)
        );
      } else {
        escAmb = getEscalao(
          form.norma === 'wltp' ? TABELA_AMBIENTAL_DIESEL_WLTP : TABELA_AMBIENTAL_DIESEL_NEDC,
          Number(form.co2)
        );
      }
      isvAmbiental = Math.max(0, Number(form.co2) * escAmb.taxa - escAmb.abate);
      isvBruto = isvCilindrada + isvAmbiental;
      info.push('Tabela A: cilindrada + ambiental.');
    }
    // Partículas diesel
    if (form.combustivel === 'diesel' && form.particulas === 'sim' && form.tipo !== 'comercial') {
      isvBruto += 500;
      info.push('+500€ por partículas.');
    }
    // Redução para usados
    let isvReduzido = isvBruto;
    if (form.usado === 'sim' && form.anosUso) {
      const reducao = getReducaoUsados(Number(form.anosUso));
      isvReduzido = isvBruto * (1 - reducao);
      info.push(`Redução usados: -${(reducao * 100).toFixed(0)}%.`);
    }
    // Taxa intermédia
    let isvFinal = isvReduzido;
    if (form.taxaIntermedia) {
      const percent = TAXAS_INTERMEDIAS.find(t => t.key === form.taxaIntermedia)?.percent || 1;
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
      info
    });
  }

  return (
    <MainLayout>
      <section className="w-full px-0 py-12 bg-[#f5f6fa] min-h-screen">
        <div className="p-8 max-w-xl mx-auto bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-teal-700 mb-4">Simulador ISV Portugal</h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              calcularISV(e);
            }}
          >
            <label>Tipo de veículo:</label>
            <select name="tipo" value={form.tipo} onChange={handleChange} className="mb-2">
              <option value="passageiro">Passageiro / Misto</option>
              <option value="comercial">Comercial / Autocaravana / &lt;1970</option>
            </select>

            <label>Cilindrada (cm³):</label>
            <input name="cilindrada" type="number" value={form.cilindrada} onChange={handleChange} required className="mb-2" />

            {form.tipo === "passageiro" && (
              <>
                <label>Combustível:</label>
                <select name="combustivel" value={form.combustivel} onChange={handleChange} className="mb-2">
                  <option value="gasolina">Gasolina</option>
                  <option value="gpl">GPL</option>
                  <option value="gn">Gás Natural</option>
                  <option value="diesel">Diesel</option>
                </select>
                <label>Norma de homologação:</label>
                <select name="norma" value={form.norma} onChange={handleChange} className="mb-2">
                  <option value="wltp">WLTP</option>
                  <option value="nedc">NEDC</option>
                </select>
                <label>Emissões CO₂ (g/km):</label>
                <input name="co2" type="number" value={form.co2} onChange={handleChange} required className="mb-2" />
              </>
            )}

            {form.combustivel === "diesel" && form.tipo === "passageiro" && (
              <>
                <label>Emite partículas &gt;0,001g/km?</label>
                <select name="particulas" value={form.particulas} onChange={handleChange} className="mb-2">
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
              </>
            )}

            <label>Ano da 1ª matrícula (UE):</label>
            <div className="flex gap-2 mb-2">
              <select name="dia" value={form.dia} onChange={handleChange} className="border rounded px-2 py-2 w-1/4" required>
                <option value="">Dia</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
              <select name="mes" value={form.mes} onChange={handleChange} className="border rounded px-2 py-2 w-1/3" required>
                <option value="">Mês</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={i+1}>{(i+1).toString().padStart(2, '0')}</option>
                ))}
              </select>
              <input name="ano" type="number" min="1970" max="2025" value={form.ano} onChange={handleChange} className="border rounded px-2 py-2 w-1/3" required placeholder="Ano" />
            </div>
            {erroData && <div className="text-red-600 text-sm mt-1">{erroData}</div>}

            <label>Veículo usado?</label>
            <select name="usado" value={form.usado} onChange={handleChange} className="mb-2">
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
            {form.usado === 'sim' && (
              <>
                <label>Anos de uso completos:</label>
                <input name="anosUso" type="number" value={form.anosUso} onChange={handleChange} min="0" max="30" className="mb-2" />
              </>
            )}

            <label>Taxa intermédia:</label>
            <select name="taxaIntermedia" value={form.taxaIntermedia} onChange={handleChange} className="mb-4">
              <option value="">Nenhuma (normal)</option>
              {TAXAS_INTERMEDIAS.map(t => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>

            <button type="submit" className="bg-[#b42121] text-white rounded-full py-3 px-8 font-bold text-lg shadow-lg hover:bg-[#a11a1a] transition">Calcular ISV</button>
          </form>

          {resultado && (
            <div className="mt-6 p-4 bg-teal-50 rounded">
              <h3 className="text-xl font-semibold mb-2">Resultado</h3>
              <p><b>Cilindrada:</b> {resultado.isvCilindrada.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}</p>
              {form.tipo === "passageiro" && (
                <p><b>Ambiental:</b> {resultado.isvAmbiental.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}</p>
              )}
              <p><b>ISV bruto:</b> {resultado.isvBruto.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}</p>
              <p><b>ISV final (após reduções e taxas):</b> <span className="text-teal-700">{resultado.isvFinal.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}</span></p>
              <p><b>Legalização/documentos:</b> {resultado.legalizacao.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}</p>
              <ul className="mt-2 text-xs text-gray-600 list-disc list-inside">
                {resultado.info.map((msg: string, i: number) => <li key={i}>{msg}</li>)}
              </ul>
            </div>
          )}
          <div className="mt-6 text-xs text-gray-500">
            Fonte: Diário da República / Portal ISV Gov.pt.  
            <a href="https://www2.gov.pt/servicos/tratar-do-imposto-de-um-veiculo-comprado-no-estrangeiro" target="_blank" rel="noopener noreferrer" className="underline">Mais info</a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "../components/MainLayout";
import Seo from "../components/Seo";
import { SITE_WIDE_KEYWORDS, SEO_KEYWORDS, joinKeywords } from "../utils/seoKeywords";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://autogo.pt/isv-portugal",
      headline: "ISV em Portugal 2026 — O que é e Como Calcular",
      description: "Tudo sobre o ISV em Portugal 2026 — tabelas oficiais, cálculo, isenções, elétricos e híbridos.",
      url: "https://autogo.pt/isv-portugal",
      inLanguage: "pt-PT",
      datePublished: "2026-02-20",
      dateModified: "2026-02-20",
      author: { "@type": "Organization", name: "AutoGo.pt", url: "https://autogo.pt" },
      publisher: {
        "@type": "Organization",
        name: "AutoGo.pt",
        url: "https://autogo.pt",
        logo: { "@type": "ImageObject", url: "https://autogo.pt/images/auto-logo.png" },
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://autogo.pt" },
        { "@type": "ListItem", position: 2, name: "ISV Portugal 2026", item: "https://autogo.pt/isv-portugal" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "O que é o ISV em Portugal?",
          acceptedAnswer: { "@type": "Answer", text: "O ISV — Imposto Sobre Veículos — é um imposto pago uma única vez na primeira matrícula de um carro em Portugal, calculado com base na cilindrada e nas emissões de CO₂." },
        },
        {
          "@type": "Question",
          name: "Quanto é o ISV em Portugal em 2026?",
          acceptedAnswer: { "@type": "Answer", text: "Depende da cilindrada, emissões de CO₂ e idade do veículo. Pode variar entre €500 para carros usados mais antigos e €10.000+ para veículos premium novos." },
        },
        {
          "@type": "Question",
          name: "Os carros elétricos pagam ISV em Portugal?",
          acceptedAnswer: { "@type": "Answer", text: "Não. Os veículos 100% elétricos estão totalmente isentos de ISV em Portugal em 2026." },
        },
        {
          "@type": "Question",
          name: "Qual a diferença entre ISV e IUC?",
          acceptedAnswer: { "@type": "Answer", text: "O ISV paga-se uma única vez ao importar ou matricular o carro. O IUC paga-se todos os anos enquanto o carro estiver em seu nome." },
        },
        {
          "@type": "Question",
          name: "Os híbridos plug-in têm desconto no ISV em 2026?",
          acceptedAnswer: { "@type": "Answer", text: "Sim, mantêm uma redução de 75% no ISV, desde que cumpram os critérios da norma Euro 6e-bis — autonomia mínima de 50km e emissões até 80g/km." },
        },
        {
          "@type": "Question",
          name: "Posso ter isenção de ISV ao importar um carro?",
          acceptedAnswer: { "@type": "Answer", text: "Sim, em casos de mudança de residência para Portugal, o veículo pode estar isento de ISV, desde que esteja registado no país de origem há mais de 6 meses e seja de uso pessoal." },
        },
      ],
    },
  ],
};

export default function IsvPortugal() {
  const cilindradaTable = [
    { range: "Até 1.000 cm³", taxa: "€1,09 / cm³", abate: "€849,03" },
    { range: "Até 1.250 cm³", taxa: "€5,30 / cm³", abate: "€3.331,68" },
    { range: "Mais de 1.250 cm³", taxa: "€12,58 / cm³", abate: "€12.138,47" },
  ];

  const descontosTable = [
    { idade: "Até 1 ano", desconto: "10%" },
    { idade: "Mais de 1 a 2 anos", desconto: "20%" },
    { idade: "Mais de 2 a 3 anos", desconto: "28%" },
    { idade: "Mais de 3 a 4 anos", desconto: "35%" },
    { idade: "Mais de 4 a 5 anos", desconto: "43%" },
    { idade: "Mais de 5 a 6 anos", desconto: "52%" },
    { idade: "Mais de 6 a 7 anos", desconto: "60%" },
    { idade: "Mais de 7 a 8 anos", desconto: "65%" },
    { idade: "Mais de 8 a 9 anos", desconto: "70%" },
    { idade: "Mais de 9 a 10 anos", desconto: "75%" },
    { idade: "Mais de 10 anos", desconto: "80%" },
  ];

  const phevTable = [
    { tipo: "PHEV sem Euro 6e-bis", limite: "< 50 g/km", reducao: "75% de redução" },
    { tipo: "PHEV com Euro 6e-bis", limite: "até 80 g/km", reducao: "75% de redução" },
    { tipo: "Híbridos não plug-in", limite: "requisitos específicos", reducao: "40% de redução" },
  ];

  const isencoesTable = [
    { situacao: "Veículos elétricos", isencao: "100%", condicoes: "Sem emissões de CO₂" },
    { situacao: "Mudança de residência", isencao: "Total", condicoes: "Carro registado no país de origem há +6 meses, uso pessoal" },
    { situacao: "Família numerosa", isencao: "50%", condicoes: "+3 dependentes, lotação mín. 6 lugares, CO₂ ≤ 173g/km WLTP, limite €7.800" },
    { situacao: "Portadores de deficiência", isencao: "Redução", condicoes: "Condições específicas por grau de incapacidade" },
  ];

  const faqs = [
    { q: "O que é o ISV em Portugal?", a: "O ISV — Imposto Sobre Veículos — é um imposto pago uma única vez na primeira matrícula de um carro em Portugal, calculado com base na cilindrada e nas emissões de CO₂." },
    { q: "Quanto é o ISV em Portugal em 2026?", a: "Depende da cilindrada, emissões de CO₂ e idade do veículo. Pode variar entre €500 para carros usados mais antigos e €10.000+ para veículos premium novos. Use o simulador AutoGo para calcular o valor exato." },
    { q: "Os carros elétricos pagam ISV?", a: "Não. Os veículos 100% elétricos estão totalmente isentos de ISV em Portugal em 2026." },
    { q: "Qual a diferença entre ISV e IUC?", a: "O ISV paga-se uma única vez ao importar ou matricular o carro. O IUC paga-se todos os anos enquanto o carro estiver em seu nome." },
    { q: "Os híbridos plug-in têm desconto no ISV em 2026?", a: "Sim, mantêm uma redução de 75% no ISV, desde que cumpram os critérios da norma Euro 6e-bis — autonomia mínima de 50km e emissões até 80g/km." },
    { q: "Posso ter isenção de ISV ao importar um carro?", a: "Sim, em casos de mudança de residência para Portugal, o veículo pode estar isento de ISV, desde que esteja registado no país de origem há mais de 6 meses e seja de uso pessoal." },
  ];

  return (
    <MainLayout>
      <Seo
        title={SEO_KEYWORDS.isv_portugal?.title ?? "ISV em Portugal 2026 | O que é, Como Calcular e Tabelas | AutoGo.pt"}
        description={SEO_KEYWORDS.isv_portugal?.description ?? ""}
        url="https://autogo.pt/isv-portugal"
        keywords={joinKeywords(SEO_KEYWORDS.isv_portugal?.keywords ?? [], SITE_WIDE_KEYWORDS)}
        jsonLd={jsonLd}
      />

      <div className="fixed top-[64px] left-0 w-full z-40 pointer-events-none">
        <span className="block h-1.5 bg-gradient-to-r from-[#b42121] via-[#d50032] to-[#b42121] opacity-90" />
      </div>

      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: "url('/images/viaturasfundo.webp')" }} aria-hidden="true" />
      <div className="fixed inset-0 z-0" style={{ background: "linear-gradient(120deg, rgba(245,246,250,0.96) 0%, rgba(245,246,250,0.50) 60%, rgba(245,246,250,0.96) 100%)" }} aria-hidden="true" />
      <div className="fixed inset-0 z-0" style={{ background: "linear-gradient(120deg, rgba(245,246,250,0.85) 0%, rgba(251,233,233,0.20) 60%, rgba(245,246,250,0.85) 100%)" }} aria-hidden="true" />

      <div className="relative z-10 min-h-screen">

        {/* HERO */}
        <section className="pt-28 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <nav className="flex justify-center gap-2 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#b42121] transition-colors">Início</Link>
              <span>›</span>
              <span className="text-gray-500">ISV Portugal</span>
            </nav>
            <span className="inline-block bg-[#b42121]/10 text-[#b42121] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
              Guia Completo · 2026
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              ISV em Portugal 2026 —{" "}
              <span className="text-[#b42121]">O que é e Como Calcular</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              O ISV (Imposto Sobre Veículos) é o imposto pago uma única vez ao importar ou matricular um carro em Portugal. É calculado com base na cilindrada e nas emissões de CO₂ do veículo.{" "}
              <strong>Em 2026 há novas regras para híbridos plug-in e descontos progressivos para carros usados importados.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/simulador-isv" className="bg-[#b42121] hover:bg-[#9a1c1c] text-white font-bold py-4 px-8 rounded-xl text-base transition-colors shadow-lg">
                Simular ISV Grátis →
              </Link>
              <Link href="/pedido" className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 px-8 rounded-xl text-base transition-colors shadow-lg border border-gray-200">
                Pedir Proposta de Importação →
              </Link>
            </div>
          </div>
        </section>

        {/* O QUE É O ISV */}
        <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">O que é o ISV — Imposto Sobre Veículos?</h2>
            <p className="text-center text-gray-500 text-sm mb-10 max-w-2xl mx-auto">
              O ISV é um imposto nacional obrigatório pago uma única vez na primeira matrícula de um veículo em Portugal, seja ele novo ou importado usado. Ao contrário do IUC — que se paga anualmente — o ISV é liquidado no momento da legalização junto das Finanças.
            </p>
            <p className="text-center text-gray-500 text-sm mb-6 max-w-2xl mx-auto">
              O ISV é um dos principais custos a considerar ao{" "}
              <Link href="/importar-carros-portugal" className="text-[#b42121] font-semibold hover:underline">
                importar carros para Portugal
              </Link>{" "}
              — seja da Alemanha, França ou outro país europeu.
            </p>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-6">ISV vs IUC — Qual a Diferença?</h3>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span></span>
                <span className="text-center font-bold text-[#b42121]">ISV</span>
                <span className="text-center font-bold text-blue-600">IUC</span>
              </div>
              {[
                { label: "Quando se paga", isv: "1x na importação/matrícula", iuc: "Todos os anos" },
                { label: "Base de cálculo", isv: "Cilindrada + CO₂", iuc: "Cilindrada + CO₂ + idade" },
                { label: "Elétricos", isv: "Isenção total", iuc: "Isenção total" },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 gap-0 px-6 py-4 border-b border-gray-100 last:border-0 items-center">
                  <div className="text-sm font-semibold text-gray-700">{row.label}</div>
                  <div className="text-center text-sm text-gray-600">{row.isv}</div>
                  <div className="text-center text-sm text-gray-600">{row.iuc}</div>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-0 px-6 py-4 items-center">
                <div className="text-sm font-semibold text-gray-700">Simulador AutoGo</div>
                <div className="text-center"><Link href="/simulador-isv" className="text-[#b42121] font-bold hover:underline text-sm">Simular ISV →</Link></div>
                <div className="text-center"><Link href="/simulador-iuc" className="text-blue-600 font-bold hover:underline text-sm">Simular IUC →</Link></div>
              </div>
            </div>
          </div>
        </section>

        {/* COMO CALCULAR */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Como Calcular o ISV em 2026</h2>
            <p className="text-center text-gray-500 text-sm mb-4 max-w-2xl mx-auto">O cálculo do ISV resulta da soma de 2 componentes: cilindrada e ambiental (CO₂).</p>
            <div className="flex justify-center mb-10">
              <div className="bg-gray-100 border border-gray-200 rounded-xl px-6 py-3 font-mono text-gray-800 text-sm font-bold">
                ISV = Componente Cilindrada + Componente Ambiental
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-5">Componente Cilindrada</h3>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden mb-10">
              <div className="hidden sm:grid grid-cols-3 bg-gray-50 border-b border-gray-200 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span>Cilindrada (cm³)</span>
                <span className="text-center">Taxa por cm³</span>
                <span className="text-right">Parcela a abater</span>
              </div>
              {cilindradaTable.map((row, i) => (
                <div key={i} className="grid sm:grid-cols-3 gap-1 sm:gap-0 px-6 py-4 border-b border-gray-100 last:border-0 items-center">
                  <div className="font-semibold text-gray-800 text-sm">{row.range}</div>
                  <div className="text-center font-bold text-[#b42121] text-base">{row.taxa}</div>
                  <div className="text-right text-sm text-gray-600 font-medium">{row.abate}</div>
                </div>
              ))}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Componente Ambiental (CO₂)</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-2xl">Calculada com base nas emissões oficiais NEDC ou WLTP. Um detalhe errado pode alterar significativamente o ISV final.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-700 text-sm font-medium">Não quer fazer as contas manualmente? Simule em segundos grátis</p>
              <Link href="/simulador-isv" className="bg-[#b42121] hover:bg-[#9a1c1c] text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-colors shadow flex-shrink-0">
                Simular ISV Grátis →
              </Link>
            </div>
          </div>
        </section>

        {/* DESCONTOS USADOS */}
        <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Descontos de ISV para Carros Importados Usados</h2>
            <p className="text-center text-gray-500 text-sm mb-10 max-w-2xl mx-auto">Os carros usados importados beneficiam de descontos progressivos de ISV consoante a idade do veículo.</p>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="hidden sm:grid grid-cols-2 bg-gray-50 border-b border-gray-200 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span>Idade do carro</span>
                <span className="text-right">Desconto ISV</span>
              </div>
              {descontosTable.map((row, i) => (
                <div key={i} className={`grid sm:grid-cols-2 gap-1 sm:gap-0 px-6 py-3.5 border-b border-gray-100 last:border-0 items-center ${i === descontosTable.length - 1 ? "bg-green-50" : ""}`}>
                  <div className="font-medium text-gray-800 text-sm">{row.idade}</div>
                  <div className={`text-right font-bold text-base ${i === descontosTable.length - 1 ? "text-green-600" : "text-[#b42121]"}`}>{row.desconto}</div>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-amber-800 text-sm font-semibold mb-1">Exemplo prático</p>
              <p className="text-amber-700 text-sm">Um carro de <strong>5 anos</strong> com ISV base de <strong>€8.000</strong> paga apenas <strong>€3.840</strong> após desconto de 52%.</p>
            </div>
          </div>
        </section>

        {/* O QUE MUDOU EM 2026 */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">O que Mudou no ISV em 2026</h2>
            <p className="text-center text-gray-500 text-sm mb-10 max-w-2xl mx-auto">Novas regras para híbridos plug-in com a norma Euro 6e-bis. Elétricos mantêm isenção total.</p>
            <h3 className="text-xl font-bold text-gray-800 mb-5">Híbridos Plug-in (PHEV) — Nova Regra Euro 6e-bis</h3>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden mb-10">
              <div className="hidden sm:grid grid-cols-3 bg-gray-50 border-b border-gray-200 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span>Tipo de PHEV</span>
                <span className="text-center">Limite CO₂</span>
                <span className="text-right">Redução ISV</span>
              </div>
              {phevTable.map((row, i) => (
                <div key={i} className="grid sm:grid-cols-3 gap-1 sm:gap-0 px-6 py-4 border-b border-gray-100 last:border-0 items-center">
                  <div className="font-semibold text-gray-800 text-sm">{row.tipo}</div>
                  <div className="text-center text-sm text-gray-600">{row.limite}</div>
                  <div className="text-right font-bold text-green-600 text-sm">{row.reducao}</div>
                </div>
              ))}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Elétricos — Continuam Isentos</h3>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex gap-4 items-start transition-all duration-200 hover:shadow-md hover:border-green-300 hover:-translate-y-0.5">
              <span className="w-10 h-10 flex-shrink-0 bg-green-500 text-white rounded-xl flex items-center justify-center text-lg font-bold">E</span>
              <div>
                <p className="font-bold text-gray-800 mb-1">Isenção total de ISV para veículos 100% elétricos</p>
                <p className="text-gray-600 text-sm">Os veículos 100% elétricos continuam totalmente isentos de ISV em 2026. É uma das maiores vantagens na importação de elétricos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ISENÇÕES */}
        <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Quem Pode Ter Isenção de ISV?</h2>
            <p className="text-center text-gray-500 text-sm mb-10 max-w-2xl mx-auto">Existem várias situações em que é possível obter isenção total ou parcial de ISV em Portugal.</p>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="hidden sm:grid grid-cols-3 bg-gray-50 border-b border-gray-200 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span>Situação</span>
                <span className="text-center">Isenção</span>
                <span className="text-right">Condições</span>
              </div>
              {isencoesTable.map((row, i) => (
                <div key={i} className="grid sm:grid-cols-3 gap-1 sm:gap-0 px-6 py-4 border-b border-gray-100 last:border-0 items-start">
                  <div className="font-semibold text-gray-800 text-sm">{row.situacao}</div>
                  <div className="text-center font-bold text-[#b42121] text-sm">{row.isencao}</div>
                  <div className="text-right text-xs text-gray-500">{row.condicoes}</div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-700 text-sm font-medium">Tens direito a isenção? A AutoGo verifica e trata do processo.</p>
              <Link href="/pedido" className="bg-[#b42121] hover:bg-[#9a1c1c] text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-colors shadow flex-shrink-0">
                Verificar Isenção →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Perguntas Frequentes sobre ISV em Portugal</h2>
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

        {/* CTA FINAL */}
        <section className="py-20 px-4 bg-white/60 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Calcule o ISV do Seu Carro Agora</h2>
            <p className="text-gray-600 mb-10 max-w-xl mx-auto">
              Mais de 9.000 utilizadores já simularam o ISV do seu carro na AutoGo.
              Não deixe o ISV ser uma surpresa — simule agora em segundos, grátis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/simulador-isv" className="bg-[#b42121] hover:bg-[#9a1c1c] text-white font-bold py-4 px-8 rounded-xl text-base transition-colors shadow-lg">
                Simular ISV Grátis →
              </Link>
              <Link href="/simulador-iuc" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-base transition-colors shadow-lg">
                Calcular IUC →
              </Link>
              <Link href="/pedido" className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 px-8 rounded-xl text-base transition-colors shadow-lg border border-gray-200">
                Importar com a AutoGo →
              </Link>
            </div>
          </div>
        </section>

        {/* Internal links */}
        <section className="py-10 px-4 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-xs text-gray-900 mb-6 uppercase tracking-widest">Explore mais</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { href: "/simulador-isv", label: "Simulador ISV 2026" },
                { href: "/simulador-iuc", label: "Simulador IUC 2026" },
                { href: "/importar-carros-portugal", label: "Importar Carros Portugal" },
                { href: "/legalizar-carro-importado", label: "Legalizar Carro Importado" },
                { href: "/viaturas", label: "Carros em Stock" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-[#b42121] hover:border-[#b42121]/30 transition-colors shadow-sm">
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
          <Link href="/simulador-isv" className="hover:text-[#b42121] transition-colors">Simulador ISV</Link>
          <span>·</span>
          <Link href="/simulador-iuc" className="hover:text-[#b42121] transition-colors">Simulador IUC</Link>
          <span>·</span>
          <Link href="/importar-carros-portugal" className="hover:text-[#b42121] transition-colors">Importar Carros</Link>
          <span>·</span>
          <Link href="/legalizar-carro-importado" className="hover:text-[#b42121] transition-colors">Legalizar Carro Importado</Link>
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

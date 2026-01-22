import React from 'react';

interface GEOFactsProps {
  facts: Array<{
    title: string;
    content: string;
    icon?: string;
  }>;
  className?: string;
}

/**
 * GEO Facts Component
 * Displays key facts in a structured format optimized for AI extraction
 * Uses clear, factual language that AI models can easily cite
 */
export default function GEOFacts({ facts, className = '' }: GEOFactsProps) {
  return (
    <div className={`geo-facts-container ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facts.map((fact, idx) => (
          <div
            key={idx}
            className="geo-fact-card bg-white rounded-lg shadow-md p-4 border-l-4 border-[#b42121] hover:shadow-lg transition-shadow"
            itemScope
            itemType="https://schema.org/Claim"
          >
            {fact.icon && (
              <div className="text-2xl mb-2" aria-hidden="true">
                {fact.icon}
              </div>
            )}
            <h3
              className="font-bold text-lg mb-2 text-gray-900"
              itemProp="name"
            >
              {fact.title}
            </h3>
            <p
              className="text-gray-700 leading-relaxed"
              itemProp="text"
            >
              {fact.content}
            </p>
            <meta itemProp="author" content="AutoGo.pt" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Pre-defined GEO facts for car imports
 */
export const CAR_IMPORT_FACTS = [
  {
    title: 'ISV para veículos elétricos',
    content: 'Veículos 100% elétricos estão completamente isentos de ISV em Portugal, tornando a importação mais económica.',
    icon: '⚡',
  },
  {
    title: 'Prazo de importação',
    content: 'O processo completo de importação demora entre 2 a 4 semanas, desde a pesquisa até à entrega com matrícula portuguesa.',
    icon: '⏱️',
  },
  {
    title: 'Documentação necessária',
    content: 'É obrigatório apresentar certificado de conformidade, DUA (Documento Único Automóvel), e comprovativo de inspeção técnica.',
    icon: '📄',
  },
  {
    title: 'Cálculo do ISV',
    content: 'O ISV é calculado com base em duas componentes: cilindrada do motor (em cm³) e emissões de CO2 (em g/km).',
    icon: '🔢',
  },
  {
    title: 'Inspeção IMT',
    content: 'Todos os veículos importados devem passar por inspeção tipo B no IMT antes de receberem matrícula portuguesa.',
    icon: '✅',
  },
  {
    title: 'Garantia legal',
    content: 'Veículos importados mantêm a garantia de fabricante válida em toda a União Europeia, desde que cumpridos os serviços.',
    icon: '🛡️',
  },
];

export const ISV_CALCULATOR_FACTS = [
  {
    title: 'Componente de cilindrada',
    content: 'A taxa sobre cilindrada aumenta progressivamente: até 1000cm³ paga menos, acima de 1250cm³ a taxa é significativamente maior.',
    icon: '🔧',
  },
  {
    title: 'Componente ambiental',
    content: 'Quanto maiores as emissões de CO2, maior o imposto. Veículos híbridos plug-in com autonomia elétrica superior a 25km têm desconto.',
    icon: '🌱',
  },
  {
    title: 'Desconto para usados',
    content: 'Veículos usados têm redução de ISV baseada na idade: 10% no primeiro ano, aumentando até 80% após 10 anos.',
    icon: '📉',
  },
  {
    title: 'Normas WLTP vs NEDC',
    content: 'Desde 2018, usa-se a norma WLTP que é mais realista. Veículos anteriores usam NEDC, com tabelas de conversão específicas.',
    icon: '📊',
  },
];

import Link from "next/link";
import { useTranslation } from "next-i18next";

export default function PoliticaDePrivacidade() {
  const { t } = useTranslation();
  const hoje = new Date();
  const dataAtual = hoje.toLocaleDateString("pt-PT");

  return (
    <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
  <p className="text-gray-700 mb-4">Na AutoGo.pt respeitamos a sua privacidade e procuramos ser transparentes sobre a forma como tratamos os seus dados pessoais. Esta página descreve as práticas que aplicamos em todas as interações realizadas através do nosso website.</p>
  <p className="text-gray-700 mb-6">Se tiver alguma dúvida sobre esta política ou sobre como processamos os seus dados, por favor contacte-nos pelo email <a href="mailto:autogo.stand@gmail.com" className="underline">autogo.stand@gmail.com</a> e teremos todo o gosto em esclarecer.</p>
  <p className="mb-6" />

      <h1 className="text-3xl font-extrabold text-[#b42121] mb-6">Política de Privacidade</h1>

      <p className="text-sm text-gray-600 mb-6">Última atualização: {dataAtual}</p>

      <p className="mb-4 text-gray-700">A sua privacidade é importante para nós. Esta Política de Privacidade explica como recolhemos, utilizamos e protegemos os seus dados pessoais, em conformidade com o Regulamento Geral de Proteção de Dados (RGPD - Regulamento (UE) 2016/679).</p>

      <h2 className="text-xl font-semibold mt-4">1. Responsável pelo Tratamento</h2>
      <p className="text-gray-700 mb-4">A empresa AutoGo.pt é responsável pelo tratamento dos seus dados pessoais. Pode contactar-nos através do email: <a href="mailto:autogo.stand@gmail.com" className="underline">autogo.stand@gmail.com</a>.</p>

      <h2 className="text-xl font-semibold mt-4">2. Dados que Recolhemos</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Nome, email e contacto telefónico (quando submete formulários no site)</li>
        <li>Informações sobre veículo pretendido ou vendido</li>
        <li>Dados de navegação no site (cookies, endereço IP, localização aproximada)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">3. Finalidades do Tratamento</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Processamento de pedidos de informação ou compra de veículos</li>
        <li>Gestão administrativa, legal e fiscal</li>
        <li>Comunicação de ofertas e campanhas (quando consentido)</li>
        <li>Melhorar a experiência de navegação no site</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">4. Base Legal</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Execução de contrato ou diligências pré-contratuais</li>
        <li>Cumprimento de obrigações legais</li>
        <li>Consentimento do utilizador</li>
        <li>Interesse legítimo na melhoria dos serviços</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">5. Partilha de Dados</h2>
      <p className="text-gray-700 mb-4">Os seus dados podem ser partilhados com:</p>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Entidades fiscais e autoridades competentes</li>
        <li>Parceiros de transporte e logística</li>
        <li>Plataformas de marketing e análise (Google, Meta, etc.), apenas mediante consentimento</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">6. Conservação dos Dados</h2>
      <p className="text-gray-700 mb-4">Os dados serão mantidos apenas pelo período necessário para cumprir as finalidades indicadas ou até que retire o consentimento.</p>

      <h2 className="text-xl font-semibold mt-4">7. Direitos do Utilizador</h2>
      <p className="text-gray-700 mb-4">Tem direito a:</p>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Aceder, corrigir ou eliminar os seus dados</li>
        <li>Retirar consentimento a qualquer momento</li>
        <li>Opor-se ao tratamento de dados</li>
        <li>Portabilidade dos dados</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">8. Segurança</h2>
      <p className="text-gray-700 mb-4">Adotamos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais contra acesso não autorizado, perda ou destruição.</p>

      <h2 className="text-xl font-semibold mt-4">9. Cookies</h2>
      <p className="text-gray-700 mb-4">Utilizamos cookies para melhorar a sua experiência e para fins de marketing e estatística. Pode gerir as suas preferências através do banner de cookies do site.</p>

      <h2 className="text-xl font-semibold mt-4">10. Contacto da Autoridade de Controlo</h2>
      <p className="text-gray-700 mb-8">Caso considere que os seus direitos foram violados, pode apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD) - <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" className="underline">www.cnpd.pt</a>.</p>

      <div className="mt-8">
        <Link href="/cookie-policy" className="text-sm text-gray-600 underline hover:text-[#b42121]">Política de Cookies</Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import MainLayout from "../components/MainLayout";
import Seo from "../components/Seo";

export default function PoliticaDePrivacidade() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://autogo.pt";
  const dataAtual = new Date().toLocaleDateString("pt-PT");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "Política de Privacidade AutoGo.pt",
    url: `${siteUrl}/politica-de-privacidade`,
  };

  return (
    <MainLayout>
      <Seo
        title="Política de Privacidade | AutoGo.pt"
        description="Saiba como a AutoGo.pt recolhe, utiliza e protege os seus dados pessoais em conformidade com o RGPD."
        image="/images/auto-logo.png"
        canonical={`${siteUrl}/politica-de-privacidade`}
        type="article"
        structuredData={structuredData}
      />
      <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <p className="text-gray-700 mb-4">
          Na AutoGo.pt respeitamos a sua privacidade e procuramos ser transparentes
          sobre a forma como tratamos os seus dados pessoais. Esta página descreve
          as práticas que aplicamos em todas as interações realizadas através do
          nosso website.
        </p>
        <p className="text-gray-700 mb-6">
          Se tiver alguma dúvida sobre esta política ou sobre como processamos os
          seus dados, contacte-nos pelo email
          {" "}
          <a href="mailto:autogo.stand@gmail.com" className="underline">
            autogo.stand@gmail.com
          </a>{" "}
          e teremos todo o gosto em esclarecer.
        </p>
        <p className="mb-6" />

        <h1 className="text-3xl font-extrabold text-[#b42121] mb-6">
          Política de Privacidade
        </h1>

        <p className="text-sm text-gray-600 mb-6">Última atualização: {dataAtual}</p>

        <p className="mb-4 text-gray-700">
          A sua privacidade é importante para nós. Esta Política de Privacidade
          explica como recolhemos, utilizamos e protegemos os seus dados pessoais,
          em conformidade com o Regulamento Geral de Proteção de Dados (RGPD -
          Regulamento (UE) 2016/679).
        </p>

        <h2 className="text-xl font-semibold mt-4">
          1. Responsável pelo Tratamento
        </h2>
        <p className="text-gray-700 mb-4">
          A AutoGo.pt é responsável pelo tratamento dos seus dados pessoais. Pode
          contactar-nos através do email
          {" "}
          <a href="mailto:autogo.stand@gmail.com" className="underline">
            autogo.stand@gmail.com
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold mt-4">2. Dados que Recolhemos</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Nome, email e contacto telefónico (quando submete formulários)</li>
          <li>Informações sobre o veículo pretendido ou vendido</li>
          <li>Dados de navegação (cookies, endereço IP, localização aproximada)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">3. Finalidades do Tratamento</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Processamento de pedidos de informação ou compra de veículos</li>
          <li>Gestão administrativa, legal e fiscal</li>
          <li>Comunicação de ofertas e campanhas (quando consentido)</li>
          <li>Melhoria contínua da experiência no site</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">4. Base Legal</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Consentimento do titular dos dados</li>
          <li>Execução de contrato ou diligências pré-contratuais</li>
          <li>Cumprimento de obrigações legais</li>
          <li>Interesse legítimo na melhoria dos serviços</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">
          5. Partilha de Dados com Terceiros
        </h2>
        <p className="text-gray-700 mb-4">
          A AutoGo.pt partilha dados pessoais apenas com:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            Parceiros comerciais e fornecedores envolvidos na importação e
            legalização de veículos
          </li>
          <li>Entidades financeiras e seguradoras (quando necessário)</li>
          <li>Autoridades fiscais, aduaneiras ou judiciais, quando exigido</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">6. Conservação dos Dados</h2>
        <p className="text-gray-700 mb-4">
          Conservamos os seus dados apenas pelo período necessário para cumprir as
          finalidades descritas ou enquanto existir obrigação legal.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          7. Direitos do Titular dos Dados
        </h2>
        <p className="text-gray-700 mb-4">
          O titular dos dados tem direito a:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Aceder, retificar ou eliminar os seus dados pessoais</li>
          <li>Limitar ou opor-se ao tratamento</li>
          <li>Retirar o consentimento a qualquer momento</li>
          <li>Solicitar a portabilidade dos dados para outra entidade</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">8. Segurança dos Dados</h2>
        <p className="text-gray-700 mb-4">
          Implementamos medidas técnicas e organizativas adequadas para proteger os
          seus dados contra acesso não autorizado, perda, divulgação ou destruição.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          9. Transferência de Dados para Fora da UE
        </h2>
        <p className="text-gray-700 mb-4">
          A AutoGo.pt pode transferir dados para fora da União Europeia apenas
          quando necessário e garantindo um nível de proteção adequado, conforme o
          RGPD.
        </p>

        <h2 className="text-xl font-semibold mt-4">10. Cookies</h2>
        <p className="text-gray-700 mb-4">
          Utilizamos cookies para melhorar a sua experiência. Consulte a nossa
          {" "}
          <Link href="/cookie-policy" className="underline">
            Política de Cookies
          </Link>
          .
        </p>

        <h2 className="text-xl font-semibold mt-4">11. Contactos</h2>
        <p className="text-gray-700 mb-4">
          Para exercer os seus direitos ou esclarecer dúvidas sobre esta política,
          contacte-nos através do email
          {" "}
          <a href="mailto:autogo.stand@gmail.com" className="underline">
            autogo.stand@gmail.com
          </a>
          .
        </p>

        <p className="text-gray-700">
          Esta política pode ser atualizada periodicamente. Recomendamos que a
          consulte regularmente.
        </p>
      </div>
    </MainLayout>
  );
}

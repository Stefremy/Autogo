import Link from "next/link";
import { useTranslation } from "next-i18next";

export default function PoliticaDePrivacidade() {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-[#b42121] mb-6">
        Política de Privacidade
      </h1>
      <p className="mb-4 text-gray-700">
        Esta é a política de privacidade da AutoGo.pt. Ainda estamos a preparar o
        conteúdo detalhado. Por enquanto esta página contém um resumo geral das
        práticas de privacidade. Atualizaremos com o texto completo em breve.
      </p>
      <section className="mb-4">
        <h2 className="text-xl font-semibold">Dados que recolhemos</h2>
        <p className="text-gray-700">Ex.: nome, email, telefone quando enviados via formulários.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold">Como usamos os seus dados</h2>
        <p className="text-gray-700">Para responder a pedidos, enviar informações sobre viaturas e melhorar os nossos serviços.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold">Contacte-nos</h2>
        <p className="text-gray-700">Por questões relativas à privacidade contacte-nos em <a href="mailto:AutoGO.stand@gmail.com" className="underline">AutoGO.stand@gmail.com</a>.</p>
      </section>
      <div className="mt-8">
        <Link href="/cookie-policy" className="text-sm text-gray-600 underline hover:text-[#b42121]">Política de Cookies</Link>
      </div>
    </div>
  );
}

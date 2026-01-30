import Link from "next/link";
import { useTranslation } from "next-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer
      className="w-full bg-[#f5f6fa] text-[#22223b] pt-4 pb-2 px-2 sm:pt-6 sm:pb-4 sm:px-4 shadow-2xl border-t-4 border-[#b42121]/20 relative overflow-hidden opacity-100"
      style={{ overflow: "hidden" }}
    >
      {/* Restored premium animated gradient overlay */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <img
          src="/images/giuliadisc.avif"
          alt={t("Footer Background", "Footer Background")}
          className="w-full h-full object-cover object-center opacity-25 blur-sm scale-105"
          style={{ minHeight: "100%", minWidth: "100%" }}
        />
        <div className="absolute inset-0 bg-black/0" />
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 border-b border-[#b42121]/10 pb-4 sm:pb-6 relative z-10 text-[1rem] sm:text-[1.15rem] md:text-[1.18rem]">
        <div>
          <h3
            className="text-2xl font-extrabold mb-3 text-[#b42121] drop-shadow-xl tracking-wide"
            style={{ letterSpacing: "0.04em" }}
          >
          </h3>
          <p className="text-lg text-gray-700 mb-4 font-medium italic">
            {t(
              "Importação premium de viaturas europeias, legalizadas e prontas a rolar em Portugal.",
            )}
          </p>
          <img
            src="/images/autologonb.png"
            alt="AutoGo.pt"
            className="w-32 sm:w-44 mb-2 drop-shadow-lg mt-0 rounded-xl"
          />
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">{t("Navegação")}</h4>
          <ul className="space-y-2 sm:space-y-3 text-gray-700 text-[0.95rem]">
            <li>
              <Link
                href="/"
                className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block font-medium no-underline shadow-sm"
              >
                {t("Início")}
              </Link>
            </li>
            <li>
              <Link
                href="/viaturas"
                className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block font-medium no-underline shadow-sm"
              >
                {t("Viaturas")}
              </Link>
            </li>
            <li>
              <Link
                href="/simulador-isv"
                className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block font-medium no-underline shadow-sm"
              >
                {t("Simulador ISV")}
              </Link>
            </li>
            <li>
              <Link
                href="/como-funciona"
                className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block font-medium no-underline shadow-sm"
              >
                {t("Como Funciona")}
              </Link>
            </li>
            <li>
              <Link
                href="/pedido"
                className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block font-medium no-underline shadow-sm"
              >
                {t("Encomendar")}
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block font-medium no-underline shadow-sm"
              >
                {t("Blog")}
              </Link>
            </li>
            <li>
              <Link
                href="/contacto"
                className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block font-medium no-underline shadow-sm"
              >
                {t("Contacto")}
              </Link>
            </li>
            <li>
              <Link
                href="/sobre-nos"
                className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block font-medium no-underline shadow-sm"
              >
                {t("Sobre Nós")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">{t("Serviços")}</h4>
          <ul className="space-y-2 sm:space-y-3 text-gray-700 text-[0.95rem]">
            <li>{t("Importação de carros")}</li>
            <li>{t("Legalização e documentação")}</li>
            <li>{t("Simulação de ISV")}</li>
            <li>{t("Entrega em todo o país")}</li>
            <li>{t("Garantia de Serviço")}</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">{t("Contactos")}</h4>
          <ul className="space-y-2 sm:space-y-3 text-gray-700 text-[0.95rem]">
            <li>
              {t("Email")}:{" "}
              <a
                href="mailto:AutoGO.stand@gmail.com"
                className="underline hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block"
              >
                AutoGO.stand@gmail.com
              </a>
            </li>
            <li>
              {t("Telefone")}:{" "}
              <a
                href="tel:+351935179591"
                className="underline hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block"
              >
                +351 935 179 591
              </a>
            </li>
            <li>
              {t("Morada")}: R. Rómulo de Carvalho 388 SITIO, 4800-019 Guimarães
            </li>
          </ul>
          <div className="flex space-x-2 sm:space-x-4 mt-2 sm:mt-4">
            <a
              href="https://wa.me/351935179591"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-full bg-white/40 backdrop-blur-md border border-[#b42121]/30 shadow-lg hover:ring-2 hover:ring-[#FFD700] transition-all duration-200 p-1 flex items-center justify-center"
            >
              <img
                src="/images/icons/icons8-whatsapp-48.png"
                alt="WhatsApp"
                className="h-6 w-6"
                aria-hidden="true"
              />
            </a>
            <a
              href="https://facebook.com/autogo.pt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-full bg-white/40 backdrop-blur-md border border-[#b42121]/30 shadow-lg hover:ring-2 hover:ring-[#FFD700] transition-all duration-200 p-1 flex items-center justify-center"
            >
              <img
                src="/images/icons/icons8-facebook-48.png"
                alt="Facebook"
                className="h-6 w-6"
                aria-hidden="true"
              />
            </a>
            <a
              href="https://www.instagram.com/autogo.pt/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full bg-white/40 backdrop-blur-md border border-[#b42121]/30 shadow-lg hover:ring-2 hover:ring-[#FFD700] transition-all duration-200 p-1 flex items-center justify-center"
            >
              <img
                src="/images/icons/icons8-instagram-48.png"
                alt="Instagram"
                className="h-6 w-6"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-2 sm:pt-4 text-xs sm:text-sm text-gray-600 relative z-10">
        <div className="flex flex-col items-center md:items-start gap-0">
          <span>
            &copy; {new Date().getFullYear()} AutoGo.pt{" "}
            {t("Todos os direitos reservados.")}
          </span>
          <div className="flex gap-3 items-center">
            <Link
              href="/cookie-policy"
              className="text-xs text-gray-500 hover:text-[#b42121] transition-colors duration-200 mt-1"
            >
              Políticas de Cookies
            </Link>
            <Link
              href="/politica-de-privacidade"
              className="text-xs text-gray-500 hover:text-[#b42121] transition-colors duration-200 mt-1"
            >
              Política de Privacidade
            </Link>
          </div>
        </div>
        <span className="mt-2 md:mt-0 flex items-center gap-2">
          Desenvolvido pela
          <a
            href="https://linke.pt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center group"
          >
            <img
              src="/images/linke-logo.png"
              alt="Linke.pt"
              className="h-6 w-auto ml-1 mr-1 align-middle group-hover:scale-110 transition-transform duration-200"
              style={{ display: "inline-block", verticalAlign: "middle" }}
            />
          </a>
          com paixão em Portugal
        </span>
      </div>
    </footer>
  );
}

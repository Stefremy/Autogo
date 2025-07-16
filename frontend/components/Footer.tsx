import Link from "next/link";
import { useTranslation } from 'next-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer
      className="w-full bg-[#f5f6fa] text-[#22223b] pt-12 pb-6 px-4 mt-16 shadow-2xl border-t-4 border-[#b42121]/20 relative overflow-hidden"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/images/giuliadisc.avif"
          alt={t('Footer Background', 'Footer Background')}
          className="w-full h-full object-cover object-center opacity-40"
          style={{ minHeight: '100%', minWidth: '100%' }}
        />
        <div className="absolute inset-0 bg-[#f5f6fa]/80" />
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-[#b42121]/10 pb-10 relative z-10">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-[#b42121] drop-shadow-xl">AutoGo.pt</h3>
          <p className="text-xl text-gray-700 mb-4">{t('Importação premium de viaturas europeias, legalizadas e prontas a rolar em Portugal.')}</p>
          <img src="/images/auto-logonb.png" alt="AutoGo.pt" className="w-52 mb-2 drop-shadow-lg mt-0" />
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">{t('Navegação')}</h4>
          <ul className="space-y-1 text-gray-700">
            <li><Link href="/" className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block">{t('Início')}</Link></li>
            <li><Link href="/viaturas" className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block">{t('Viaturas')}</Link></li>
            <li><Link href="/simulador" className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block">{t('Simulador ISV')}</Link></li>
            <li><Link href="/como-funciona" className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block">{t('Como Funciona')}</Link></li>
            <li><Link href="/pedido" className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block">{t('Encomendar')}</Link></li>
            <li><Link href="/blog" className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block">{t('Blog')}</Link></li>
            <li><Link href="/contacto" className="hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block">{t('Contacto')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">{t('Serviços')}</h4>
          <ul className="space-y-1 text-gray-700">
            <li>{t('Importação de carros')}</li>
            <li>{t('Legalização e documentação')}</li>
            <li>{t('Simulação de ISV')}</li>
            <li>{t('Entrega em todo o país')}</li>
            <li>{t('Garantia incluída')}</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">{t('Contactos')}</h4>
          <ul className="space-y-1 text-gray-700">
            <li>{t('Email')}: <a href="mailto:info@autogo.pt" className="underline hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block">info@autogo.pt</a></li>
            <li>{t('Telefone')}: <a href="tel:+351912345678" className="underline hover:text-[#b42121] transition-all duration-200 hover:scale-110 inline-block">+351 912 345 678</a></li>
            <li>{t('Morada')}: Lisboa, Portugal</li>
          </ul>
          <div className="flex space-x-4 mt-4">
            <a href="https://wa.me/351912345678" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:scale-110 transition-transform">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-[#25D366]">
                <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 1.85.504 3.58 1.38 5.07L2 22l5.13-1.35A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm0 18a7.95 7.95 0 0 1-4.07-1.13l-.29-.17-3.04.8.81-2.97-.19-.3A7.95 7.95 0 1 1 20 12c0 4.418-3.582 8-8 8Zm4.13-5.47c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.51.12-.15.23-.58.75-.71.9-.13.15-.26.17-.49.06-.23-.12-.97-.36-1.85-1.13-.68-.6-1.14-1.34-1.28-1.57-.13-.23-.01-.36.1-.48.1-.1.23-.26.34-.39.11-.13.15-.23.23-.38.08-.15.04-.29-.02-.41-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39-.13-.01-.29-.01-.45-.01-.16 0-.41.06-.62.29-.21.23-.81.79-.81 1.93 0 1.14.83 2.24.95 2.4.12.15 1.63 2.5 3.95 3.4.55.19.98.3 1.31.38.55.14 1.05.12 1.44.07.44-.07 1.36-.56 1.55-1.1.19-.54.19-1.01.13-1.1-.06-.09-.21-.15-.44-.27Z"/>
              </svg>
            </a>
            <a href="https://facebook.com/autogo.pt" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:scale-110 transition-transform">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-[#1877F3]">
                <path fill="currentColor" d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
              </svg>
            </a>
            <a href="https://instagram.com/autogo.pt" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:scale-110 transition-transform">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-[#C13584]">
                <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.783 2.295 7.15 2.233 8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.77.13 4.672.388 3.678 1.382 2.684 2.376 2.426 3.474 2.368 4.756.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.058 1.282.316 2.38 1.31 3.374.994.994 2.092 1.252 3.374 1.31C8.332 23.987 8.741 24 12 24c3.259 0 3.668-.013 4.948-.072 1.282-.058 2.38-.316 3.374-1.31.994-.994 1.252-2.092 1.31-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.058-1.282-.316-2.38-1.31-3.374-.994-.994-2.092-1.252-3.374-1.31C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div
        className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-6 text-sm text-gray-500 relative z-10"
      >
        <span>&copy; {new Date().getFullYear()} AutoGo.pt. {t('Todos os direitos reservados.')}</span>
        <span className="mt-2 md:mt-0">{t('Desenvolvido com paixão em Portugal.')}</span>
      </div>
    </footer>
  );
}

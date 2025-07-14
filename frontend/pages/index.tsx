import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../components/MainLayout';
import cars from '../data/cars.json';
import CarCard from '../components/CarCard';
import PremiumCarCard from '../components/PremiumCarCard';
import { motion } from "framer-motion";


// Placeholder reviews - replace with real data or API integration
const googleReviews = [
  {
    name: 'João Silva',
    rating: 5,
    text: 'Serviço excelente! O processo foi rápido e transparente. Recomendo a AutoGo.pt a todos.',
    date: 'há 2 semanas',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Maria Fernandes',
    rating: 5,
    text: 'Muito profissionais e sempre disponíveis para ajudar. O carro chegou impecável!',
    date: 'há 1 mês',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Carlos Pinto',
    rating: 4,
    text: 'Boa experiência, recomendo. O processo foi simples e sem surpresas.',
    date: 'há 3 semanas',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
  {
    name: 'Ana Costa',
    rating: 5,
    text: 'Equipa fantástica! Fizeram tudo por mim, só tive de levantar o carro.',
    date: 'há 5 dias',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

export default function Home() {
  return (
    <>
      <MainLayout>
        <Head>
          <title>AutoGo.pt - Importação de Carros Europeus</title>
          <meta
            name="description"
            content="O teu carro europeu, legalizado e pronto a rolar em Portugal — sem complicações."
          />
        </Head>

        {/* HERO SECTION FULL SCREEN EDGE TO EDGE - EXTENDED WHITE FADE LEFT */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-screen h-[550px] md:h-[76vh] flex items-center overflow-hidden"
          style={{ borderRadius: "0 0 32px 32px" }}
        >
          {/* Background image covers full width, fades left */}
          <div
            className="absolute inset-0 bg-cover bg-right"
            style={{
              backgroundImage: "url('/images/cars/bmw-black.png')",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(30,30,30,0.92) 0%, rgba(255,255,255,0) 70%, rgba(0,0,0,0.7) 100%)",
              }}
            />
          </div>

          {/* Red lines decorativas */}
          <img
            src="/images/red_lines.png"
            alt="Decoração superior esquerda"
            className="absolute top-8 left-8 w-20 opacity-20 rotate-45 z-20"
          />
          <img
            src="/images/red_lines.png"
            alt="Decoração inferior direita"
            className="absolute bottom-10 right-10 w-28 opacity-80 z-20"
          />
          {/* (Opcional) logotipo no canto superior direito */}
          <img
            src="/images/auto-logonb.png"
            alt="AutoGo.pt"
            className="absolute top-6 right-10 w-40 opacity-90 z-20"
          />

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-start justify-center h-full pl-8 md:pl-20 max-w-2xl w-full">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-neutral-50 text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-xl"
            >
              Rápido. Seguro. Teu.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-neutral-200 text-lg md:text-2xl mb-10 max-w-xl drop-shadow-lg"
            >
              O teu carro europeu, legalizado e pronto a rolar em Portugal — sem complicações.
            </motion.p>
            <div className="flex w-full rounded-2xl bg-white/30 backdrop-blur-md shadow-2xl p-2 items-center gap-3 mb-5 border border-white/30">
              <Link
                href="/viaturas"
                className="bg-[#b42121] hover:bg-[#a11a1a] text-white font-bold px-8 py-3 text-lg rounded-xl shadow transition-all duration-200 whitespace-nowrap"
              >
                Procurar viaturas
              </Link>
              <Link
                href="/simulador"
                className="bg-[#b42121] hover:bg-[#a11a1a] text-white font-bold px-8 py-3 text-lg rounded-xl shadow transition-all duration-200 whitespace-nowrap"
              >
                Simulador
              </Link>
            </div>
            <div className="ml-1 mb-1 flex items-center gap-2 cursor-pointer text-neutral-200 hover:text-[#b42121] font-medium text-base transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" className="inline mr-1 opacity-70" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.6" d="M4 6h16M7 12h10M10 18h4"></path></svg>
              Filtros avançados
            </div>
          </div>
        </motion.section>

        {/* PREMIUM FEATURES BAR */}
        <section className="w-full bg-transparent -mt-8 z-30 relative">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 px-6 py-6 rounded-2xl shadow-2xl bg-white/60 backdrop-blur-md border border-white/30">
            <div className="flex items-center gap-3">
              <span className="bg-[#b42121] text-white rounded-full p-2 shadow-lg">
                {/* Importação Premium: Globe/Import icon */}
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7"/><path d="M2 12h20M12 2c2.5 2.5 2.5 17.5 0 20M12 2c-2.5 2.5-2.5 17.5 0 20" stroke="currentColor" strokeWidth="1.7"/></svg>
              </span>
              <span className="font-semibold text-gray-800 text-lg">Importação Premium</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-green-600 text-white rounded-full p-2 shadow-lg">
                {/* Garantia Incluída: Shield/Check icon */}
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 3l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V7l7-4z" stroke="currentColor" strokeWidth="1.7"/><path d="M9.5 13l2 2 3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span className="font-semibold text-gray-800 text-lg">Garantia Incluída</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-700 text-white rounded-full p-2 shadow-lg">
                {/* Entrega em Todo o País: Delivery/Truck icon */}
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M16 13h2.28a2 2 0 0 1 1.79 1.11l1.43 2.86A1 1 0 0 1 20.66 18H19a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3" stroke="currentColor" strokeWidth="1.7"/></svg>
              </span>
              <span className="font-semibold text-gray-800 text-lg">Entrega em Todo o País</span>
            </div>
          </div>
        </section>

        {/* Como Funciona section */}
        <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-24 overflow-hidden" style={{backgroundColor: '#f5f6fa'}}>
          {/* Video watermark background edge-to-edge */}
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm pointer-events-none z-0"
            src="/images/reboque.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-[#f5f6fa]/80 z-10" />
          <div className="relative z-20 max-w-5xl mx-auto text-center px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-extrabold text-black mb-8 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
            >
              Como Funciona
            </motion.h2>
            <div className="flex justify-center gap-4 mb-10">
              <span className="px-6 py-3 rounded-2xl bg-red-600 text-white text-lg font-semibold shadow-lg transition hover:scale-105">Simples</span>
              <span className="px-6 py-3 rounded-2xl bg-white/80 border border-gray-200 text-gray-900 text-lg font-semibold shadow-lg backdrop-blur-md transition hover:scale-105">Transparente</span>
              <span className="px-6 py-3 rounded-2xl bg-green-600 text-white text-lg font-semibold shadow-lg transition hover:scale-105">Rápido</span>
            </div>
            <p className="text-2xl text-gray-800 mb-16 font-medium drop-shadow">
              Importa o teu carro europeu sem stress — só precisas de escolher, simular e pedir.<br />
              <span className="font-bold">Nós tratamos do resto!</span>
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/95 rounded-2xl shadow-2xl p-10 flex flex-col items-center border-t-4 border-red-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="mb-3 text-3xl font-bold text-red-600">1</div>
                <div className="font-semibold text-xl mb-2 text-gray-900">Escolhe o carro</div>
                <p className="text-gray-600 mb-4 text-base">
                  Seleciona entre dezenas de viaturas disponíveis ou pede uma pesquisa personalizada.
                </p>
                <Link href="/viaturas" className="mt-auto text-red-600 font-semibold hover:underline transition transform hover:scale-110 hover:text-white hover:bg-red-600 px-6 py-2 rounded-lg shadow">
                  Ver Viaturas
                </Link>
              </div>
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-10 flex flex-col items-center border-t-4 border-gray-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="mb-3 text-3xl font-bold text-gray-800">2</div>
                <div className="font-semibold text-xl mb-2 text-gray-900">Simula custos</div>
                <p className="text-gray-600 mb-4 text-base">
                  Usa o nosso simulador para saber quanto vais pagar, sem surpresas.
                </p>
                <Link href="/simulador" className="mt-auto text-gray-900 font-semibold hover:underline transition transform hover:scale-110 hover:text-white hover:bg-gray-800 px-6 py-2 rounded-lg shadow">
                  Simular ISV
                </Link>
              </div>
              <div className="bg-white/95 rounded-2xl shadow-2xl p-10 flex flex-col items-center border-t-4 border-green-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className="mb-3 text-3xl font-bold text-green-600">3</div>
                <div className="font-semibold text-xl mb-2 text-gray-900">Importação e entrega</div>
                <p className="text-gray-600 mb-4 text-base">
                  Cuidamos de todo o processo legal e entregamos o carro pronto a rolar.
                </p>
                <Link href="/pedido" className="mt-auto text-green-600 font-semibold hover:underline transition transform hover:scale-110 hover:text-white hover:bg-green-600 px-6 py-2 rounded-lg shadow">
                  Fazer Pedido
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* LISTAGEM DE VIATURAS */}
        <section className="w-full py-24">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-4xl font-extrabold text-black mb-12 text-center tracking-tight"
            >
              Carros usados em Destaque
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {cars.map(car => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <PremiumCarCard
                    name={`${car.make} ${car.model}`}
                    image={car.image}
                    price={car.price}
                    id={car.id}
                    year={car.year}
                    make={car.make}
                    transmission={
                      car.gearboxType
                        ? car.gearboxType.toString()
                        : car.gearbox
                        ? car.gearbox.toString()
                        : ""
                    }
                    type={"SEDAN"}
                    country={car.country}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* GOOGLE REVIEWS SECTION - ORGANIC CAROUSEL */}
        <section className="w-full py-20 bg-[#f5f6fa]">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-6 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">Os nossos clientes</h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">A satisfação dos nossos clientes é a nossa prioridade. Vê o que dizem sobre nós no Google!</p>
            <div className="w-full relative">
              <button
                type="button"
                aria-label="Scroll left"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#f5f6fa] border border-gray-300 shadow-lg rounded-full p-2 hover:bg-[#b42121] hover:text-white transition hidden md:block"
                onClick={() => {
                  const el = document.getElementById('reviews-carousel');
                  if (el) el.scrollBy({ left: -340, behavior: 'smooth' });
                }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div id="reviews-carousel" className="flex gap-6 min-w-[700px] md:min-w-0 px-4 overflow-x-auto scroll-smooth pb-2">
                {googleReviews.map((review, idx) => (
                  <div key={idx} className="shadow-xl rounded-2xl p-6 min-w-[320px] max-w-xs flex flex-col justify-between hover:shadow-2xl transition-all duration-200 bg-[#f5f6fa]">
                    <div className="flex items-center mb-3">
                      <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full border-2 border-[#b42121] mr-3" />
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{review.name}</div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="18" height="18" viewBox="0 0 20 20" fill={i < review.rating ? '#FFD600' : '#E0E0E0'} className="inline">
                              <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-800 text-base mb-4">“{review.text}”</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline"><path stroke="#b42121" strokeWidth="2" d="M8 7V3h8v4"/><rect width="16" height="18" x="4" y="3" rx="2" stroke="#b42121" strokeWidth="2"/><path stroke="#b42121" strokeWidth="2" d="M12 11v4"/></svg>
                      {review.date}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                aria-label="Scroll right"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#f5f6fa] border border-gray-300 shadow-lg rounded-full p-2 hover:bg-[#b42121] hover:text-white transition hidden md:block"
                onClick={() => {
                  const el = document.getElementById('reviews-carousel');
                  if (el) el.scrollBy({ left: 340, behavior: 'smooth' });
                }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <a
              href="https://www.google.com/maps/place/AutoGo.pt/reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block bg-[#b42121] hover:bg-[#a11a1a] text-white font-bold px-8 py-3 text-lg rounded-xl shadow transition-all duration-200"
            >
              Ver mais avaliações no Google
            </a>
          </div>
        </section>

        {/* NOVOS ARTIGOS SECTION - SCROLLABLE CAROUSEL */}
        <section className="w-full py-16 bg-[#f5f6fa]">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-6 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">Novos Artigos</h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">Fica a par das últimas novidades, dicas e notícias do mundo automóvel e da importação premium.</p>
            <div className="w-full relative">
              <button
                type="button"
                aria-label="Scroll left"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#f5f6fa] border border-gray-300 shadow-lg rounded-full p-2 hover:bg-[#b42121] hover:text-white transition hidden md:block"
                onClick={() => {
                  const el = document.getElementById('articles-carousel');
                  if (el) el.scrollBy({ left: -340, behavior: 'smooth' });
                }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div id="articles-carousel" className="flex gap-6 min-w-[700px] md:min-w-0 px-4 overflow-x-auto scroll-smooth pb-2">
                {/* Example articles - replace with real data or dynamic fetch if needed */}
                {[
                  {
                    title: 'Como importar um carro da Alemanha para Portugal',
                    date: '07 Julho 2025',
                    image: '/images/cars/bmw-black.png',
                    excerpt: 'Descobre o passo a passo para importar o teu próximo carro alemão, sem complicações e com total transparência.',
                    link: '/blog/como-importar-carro-alemanha',
                  },
                  {
                    title: 'ISV 2025: O que muda este ano?',
                    date: '02 Julho 2025',
                    image: '/images/cars/peugeot-3008.jpg',
                    excerpt: 'Fica a saber todas as alterações ao Imposto Sobre Veículos para 2025 e como te podem afetar.',
                    link: '/blog/isv-2025-mudancas',
                  },
                  {
                    title: 'Dicas para comprar um carro usado premium',
                    date: '28 Junho 2025',
                    image: '/images/cars/golf21.jpg',
                    excerpt: 'Os melhores conselhos para garantir uma compra segura e vantajosa no mercado de usados.',
                    link: '/blog/dicas-carro-usado-premium',
                  },
                  {
                    title: 'Vantagens da importação premium AutoGo.pt',
                    date: '20 Junho 2025',
                    image: '/images/cars/giulia.jpg',
                    excerpt: 'Descobre porque cada vez mais portugueses escolhem a AutoGo.pt para importar o seu automóvel.',
                    link: '/blog/vantagens-importacao-autogo',
                  },
                ].map((article, idx) => (
                  <a key={idx} href={article.link} className="block rounded-2xl shadow-xl bg-[#f5f6fa] min-w-[320px] max-w-xs hover:shadow-2xl transition-all duration-200 overflow-hidden group">
                    <div className="h-44 w-full overflow-hidden flex items-center justify-center bg-gray-200">
                      <img src={article.image} alt={article.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-5 flex flex-col h-[180px]">
                      <div className="text-xs text-gray-500 mb-2">{article.date}</div>
                      <div className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{article.title}</div>
                      <div className="text-gray-700 text-sm mb-4 line-clamp-3">{article.excerpt}</div>
                      <span className="mt-auto text-[#b42121] font-semibold hover:underline transition">Ler artigo &rarr;</span>
                    </div>
                  </a>
                ))}
              </div>
              <button
                type="button"
                aria-label="Scroll right"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#f5f6fa] border border-gray-300 shadow-lg rounded-full p-2 hover:bg-[#b42121] hover:text-white transition hidden md:block"
                onClick={() => {
                  const el = document.getElementById('articles-carousel');
                  if (el) el.scrollBy({ left: 340, behavior: 'smooth' });
                }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </section>
      </MainLayout>
    </>
  );
}

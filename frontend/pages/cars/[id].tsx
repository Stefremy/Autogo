import { useRouter } from 'next/router';
import cars from '../../data/cars.json';
import Layout from '../../components/MainLayout';
import { FaCalendarAlt, FaTachometerAlt, FaMoneyBillWave, FaGasPump, FaCogs, FaCarSide, FaDoorOpen, FaRoad, FaFlag, FaPalette, FaBolt, FaUsers, FaHashtag, FaGlobeEurope, FaRegCalendarCheck, FaLayerGroup, FaCloud, FaChevronDown, FaChevronUp, FaStar } from "react-icons/fa";
import React, { useState, useEffect, useRef } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import jsPDF from 'jspdf';

type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  images?: string[];
  description: string;
  mileage: number;
  country: string;
  fuel?: string;
  gearboxType?: string;
  gearbox?: number;
  category?: string;
  doors?: number;
  engineSize?: string;
  origin?: string;
  color?: string;
  power?: string;
  places?: number;
  unitNumber?: string;
  firstRegistration?: string;
  emissionClass?: string;
  co2?: string;
  equipamento_opcoes?: {
    [categoria: string]: string[];
  };
};

export default function CarDetail() {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null; // Guard clause to prevent hook mismatch
  const car = (cars as Car[]).find(c => String(c.id) === id);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      // Trigger sticky bar as soon as the navbar is out of view (navbar = 56px)
      setShowStickyBar(rect.top < 56);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fun facts dinâmicos
  const funFacts = [
    car?.engineSize && car.engineSize.includes('1.2') && "Motor premiado pela eficiência na Europa.",
    car?.fuel && car.fuel === "Gasolina" && "ISV reduzido devido às baixas emissões.",
    car?.power && Number(car.power.replace(/\D/g, '')) > 100 && "Performance de referência para o segmento.",
    "Disponível com Apple CarPlay / Android Auto.",
    car?.country === "FR" && "Tecnologia inspirada pelo legado Citroën no WRC."
  ].filter(Boolean);

  if (!car) {
    return (
      <Layout>
        <div className="p-8">Car not found.</div>
      </Layout>
    );
  }

  // Find similar cars (show all except current)
  const similarCars = (cars as Car[])
    .filter(c => String(c.id) !== String(car.id))
    .slice(0, 6); // limit to 6 similar cars

  // Swiper state
  const [swiperIndex, setSwiperIndex] = useState(0);
  const slidesToShow = 3;

  // Download PDF handler
  async function handleDownloadPDF() {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    // Load logo and car image as base64
    const loadImageAsBase64 = async (url: string) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    };
    // Logo
    const logoUrl = '/images/auto-logonb2.png';
    const logoBase64 = await loadImageAsBase64(logoUrl);
    doc.addImage(logoBase64, 'PNG', 40, 32, 90, 45);
    // Car image
    const carImgUrl = (car.images && car.images[0]) || car.image;
    const carImgBase64 = await loadImageAsBase64(carImgUrl);
    doc.addImage(carImgBase64, 'JPEG', 400, 32, 140, 90);
    // Title and info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(180, 33, 33);
    doc.text(`${car.make} ${car.model} (${car.year})`, 40, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text(`Preço: ${car.price.toLocaleString()} €`, 40, 125);
    doc.text(`Quilometragem: ${car.mileage?.toLocaleString()} km`, 40, 145);
    let y = 165;
    if (car.fuel) { doc.text(`Combustível: ${car.fuel}`, 40, y); y += 20; }
    if (car.power) { doc.text(`Potência: ${car.power}`, 40, y); y += 20; }
    if (car.engineSize) { doc.text(`Cilindrada: ${car.engineSize}`, 40, y); y += 20; }
    if (car.firstRegistration) { doc.text(`Primeira Matrícula: ${car.firstRegistration}`, 40, y); y += 20; }
    y += 10;
    // Descrição
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text('Descrição', 40, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(55, 65, 81);
    const descLines = doc.splitTextToSize(car.description, 480);
    doc.text(descLines, 40, y);
    y += descLines.length * 16 + 10;
    // Equipamento & Opções
    if (car.equipamento_opcoes) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(180, 33, 33);
      doc.text('Equipamento & Opções', 40, y);
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(55, 65, 81);
      for (const [categoria, lista] of Object.entries(car.equipamento_opcoes)) {
        if (y > 700) { doc.addPage(); y = 60; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(30, 41, 59);
        doc.text(categoria.replace(/_/g, ' ').replace('opcoes', 'opções').replace(/\b\w/g, l => l.toUpperCase()), 50, y);
        y += 15;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(55, 65, 81);
        for (const item of lista) {
          if (y > 780) { doc.addPage(); y = 60; }
          doc.circle(56, y - 3, 2, 'F');
          doc.text(item, 65, y);
          y += 15;
        }
        y += 8;
      }
    }
    // Contactos section (placeholder)
    if (y > 700) { doc.addPage(); y = 60; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(180, 33, 33);
    doc.text('Contactos', 40, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(55, 65, 81);
    doc.text('A preencher futuramente com os contactos da AutoGo.', 40, y);
    // Save
    doc.save(`${car.make}_${car.model}_${car.year}.pdf`);
  }

  // Sticky bar visually merges with navbar, seamless, premium animation
  return (
    <Layout>
      {/* Main navbar stays at the very top, sticky bar is always below */}
      {/* Sticky bar: only car info, never navigation */}
      <div
        className={`fixed left-0 w-full z-40 flex items-center bg-white/80 backdrop-blur-xl transition-all duration-500 px-4 overflow-hidden
          ${showStickyBar ? 'h-[120px] py-4' : 'h-[60px] py-0'}
          shadow-xl border-b border-[#b42121]/20`}
        style={{
          top: 56,
          boxShadow: '0 2px 12px 0 rgba(180,33,33,0.08)',
        }}
      >
        {/* Car image: scales up with bar, stays contained */}
        <div className={`transition-all duration-500 flex items-center
          ${showStickyBar ? 'opacity-100 translate-x-0 w-32 mr-6' : 'opacity-80 -translate-x-4 w-16 mr-2'}
        `}>
          <img
            src={(car.images && car.images[0]) || car.image}
            alt={car.make + ' ' + car.model}
            className={`object-cover rounded-xl shadow border-2 border-white bg-gray-100 ring-2 ring-[#b42121]/30 transition-all duration-500
              ${showStickyBar ? 'h-24 w-40 scale-110' : 'h-10 w-20 scale-100'}`}
            style={{ maxHeight: showStickyBar ? 96 : 40, maxWidth: showStickyBar ? 160 : 80 }}
          />
        </div>
        <div className={`flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-6 transition-all duration-500
          ${showStickyBar ? 'text-2xl' : 'text-base'}`}
          style={{ fontSize: showStickyBar ? '2rem' : '1rem', lineHeight: showStickyBar ? '2.5rem' : '1.25rem' }}
        >
          <span className={`font-bold text-[#b42121] drop-shadow-sm transition-all duration-500 ${showStickyBar ? 'text-3xl' : 'text-lg'}`}>{car.make} {car.model} <span className={`text-gray-700 font-normal transition-all duration-500 ${showStickyBar ? 'text-2xl' : 'text-base'}`}>{car.year}</span></span>
          <span className={`text-blue-700 font-bold drop-shadow transition-all duration-500 ${showStickyBar ? 'text-2xl' : 'text-base'}`}>{car.price.toLocaleString()} €</span>
          <span className={`text-gray-600 flex items-center gap-2 transition-all duration-500 ${showStickyBar ? 'text-xl' : 'text-sm'}`}><FaTachometerAlt className="text-[#b42121]" /> {car.mileage?.toLocaleString()} km</span>
          {car.fuel && <span className={`text-gray-600 flex items-center gap-2 transition-all duration-500 ${showStickyBar ? 'text-xl' : 'text-sm'}`}><FaGasPump className="text-[#b42121]" /> {car.fuel}</span>}
          {car.power && <span className={`text-gray-600 flex items-center gap-2 transition-all duration-500 ${showStickyBar ? 'text-xl' : 'text-sm'}`}><FaBolt className="text-[#b42121]" /> {car.power}</span>}
          {car.engineSize && <span className={`text-gray-600 flex items-center gap-2 transition-all duration-500 ${showStickyBar ? 'text-xl' : 'text-sm'}`}><FaRoad className="text-[#b42121]" /> {car.engineSize}</span>}
          {car.firstRegistration && <span className={`text-gray-600 flex items-center gap-2 transition-all duration-500 ${showStickyBar ? 'text-xl' : 'text-sm'}`}><FaRegCalendarCheck className="text-[#b42121]" /> {car.firstRegistration}</span>}
        </div>
        {/* Action buttons aligned right */}
        <div className="flex gap-3 ml-auto">
          {/* <button className="bg-white border border-[#b42121] text-[#b42121] font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-[#b42121] hover:text-white transition-all duration-200">WhatsApp</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-all duration-200">Pedir Contacto</button> */}
          {/* <button onClick={handleDownloadPDF} className="bg-[#b42121] hover:bg-[#a11a1a] text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-all duration-200">Download PDF</button> */}
        </div>
      </div>
      {/* Main content: dynamic padding to match sticky+navbar height */}
      <div className={`min-h-screen bg-[#f5f6fa] transition-all duration-500 pt-[116px]`} style={{ transition: 'padding-top 0.5s cubic-bezier(.4,0,.2,1)' }}>
        <main className="w-full px-0 py-0 space-y-12">
          {/* HERO */}
          <section ref={heroRef} className="w-full flex flex-col md:flex-row gap-12 items-start px-0 md:px-12 lg:px-24 xl:px-32 pt-10">
            {/* Hero Image + Gallery */}
            <div className="flex-1 relative flex flex-col items-center">
              <img
                src={(car.images && car.images[0]) || car.image}
                alt={car.make + ' ' + car.model}
                className="rounded-3xl shadow-2xl w-full object-cover aspect-video ring-4 ring-white hover:ring-[#b42121] transition-all duration-300 cursor-zoom-in"
                style={{ maxHeight: 420, background: '#eee' }}
                onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
              />
              {/* Bandeira sobreposta */}
              {car.country && (
                <span className="absolute top-6 left-6 bg-white/90 px-4 py-2 rounded-2xl shadow flex items-center gap-2 border border-gray-200 backdrop-blur-sm">
                  <img
                    src={`/images/flags/${car.country.toLowerCase()}.png`}
                    alt={car.country}
                    className="w-7 h-7 rounded-full border border-white"
                  />
                  <span className="text-sm font-bold text-gray-700">
                    {car.country === "DE"
                      ? "Importado da Alemanha"
                      : car.country === "PT"
                        ? "Nacional"
                        : car.country === "FR"
                          ? "Importado de França"
                          : `Importado de ${car.country}`}
                  </span>
                </span>
              )}
              {/* Mini galeria horizontal */}
              <div className="flex gap-3 mt-5">
                {(car.images || [car.image]).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${car.make} ${car.model} galeria ${idx + 1}`}
                    className={`rounded-xl object-cover w-24 h-16 shadow cursor-pointer border-2 transition-all duration-300 ${lightboxIndex === idx ? "border-[#b42121] scale-105" : "border-transparent hover:border-[#b42121] hover:scale-105"}`}
                    onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                  />
                ))}
              </div>
              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={(car.images || [car.image]).map(img => ({ src: img }))}
                index={lightboxIndex}
                plugins={[Zoom]}
                zoom={{ maxZoomPixelRatio: 3 }}
              />
            </div>
            {/* Detalhes principais */}
            <div className="flex-1 space-y-6 px-0 md:px-8 xl:px-16">
              <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-gray-900 drop-shadow-sm">
                {car.make} {car.model} <span className="text-[#b42121]">{car.year}</span>
              </h1>
              <div className="flex flex-wrap gap-3 text-base mb-6">
                <span className="bg-gray-100 rounded-2xl px-4 py-2 font-medium shadow-sm flex items-center gap-2">
                  <FaCalendarAlt className="text-[#b42121]" /> {car.year}
                </span>
                <span className="bg-gray-100 rounded-2xl px-4 py-2 font-medium shadow-sm flex items-center gap-2">
                  <FaTachometerAlt className="text-[#b42121]" /> {car.mileage?.toLocaleString()} km
                </span>
                {car.engineSize && (
                  <span className="bg-gray-100 rounded-2xl px-4 py-2 font-medium shadow-sm flex items-center gap-2">
                    <FaRoad className="text-[#b42121]" /> {car.engineSize}
                  </span>
                )}
                {car.fuel && (
                  <span className="bg-gray-100 rounded-2xl px-4 py-2 font-medium shadow-sm flex items-center gap-2">
                    <FaGasPump className="text-[#b42121]" /> {car.fuel}
                  </span>
                )}
                {car.gearboxType && (
                  <span className="bg-gray-100 rounded-2xl px-4 py-2 font-medium shadow-sm flex items-center gap-2">
                    <FaCogs className="text-[#b42121]" /> {car.gearboxType}
                  </span>
                )}
                {car.power && (
                  <span className="bg-gray-100 rounded-2xl px-4 py-2 font-medium shadow-sm flex items-center gap-2">
                    <FaBolt className="text-[#b42121]" /> {car.power}
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-blue-700 drop-shadow-sm">{car.price.toLocaleString()} €</div>
              {/* Botão ver mais detalhes */}
              <button
                className="flex items-center gap-2 mt-2 mb-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl shadow font-semibold text-gray-700 transition-all duration-200 text-lg"
                onClick={() => setShowMore(v => !v)}
                aria-expanded={showMore}
              >
                <span>Ver mais detalhes</span>
                {showMore ? <FaChevronUp className="text-[#b42121]" /> : <FaChevronDown className="text-[#b42121]" />}
              </button>
              {/* Detalhes extra, animados */}
              <div
                className={`overflow-hidden transition-all duration-500 ${showMore ? 'max-h-96 opacity-100 mb-2 bg-[#f5f6fa] px-6 py-4 rounded-2xl' : 'max-h-0 opacity-0 mb-0'}`}
                style={{ willChange: 'max-height, opacity' }}
              >
                <ul className="space-y-3 py-2">
                  {car.category && <li className="flex items-center gap-2 text-gray-700 text-lg"><FaCarSide className="text-[#b42121]" /> <strong>Categoria:</strong> {car.category}</li>}
                  {car.gearbox && <li className="flex items-center gap-2 text-gray-700 text-lg"><FaLayerGroup className="text-[#b42121]" /> <strong>Caixa de Velocidades:</strong> {car.gearbox}</li>}
                  {car.origin && <li className="flex items-center gap-2 text-gray-700 text-lg"><FaGlobeEurope className="text-[#b42121]" /> <strong>País de Origem:</strong> {car.origin}</li>}
                  {car.unitNumber && <li className="flex items-center gap-2 text-gray-700 text-lg"><FaHashtag className="text-[#b42121]" /> <strong>Nº de Unidade:</strong> {car.unitNumber}</li>}
                  {car.firstRegistration && <li className="flex items-center gap-2 text-gray-700 text-lg"><FaRegCalendarCheck className="text-[#b42121]" /> <strong>Data da Primeira Matrícula:</strong> {car.firstRegistration}</li>}
                  {car.emissionClass && <li className="flex items-center gap-2 text-gray-700 text-lg"><FaLayerGroup className="text-[#b42121]" /> <strong>Classe de Emissões:</strong> {car.emissionClass}</li>}
                </ul>
              </div>
              {/* Botões de ação - minimalist, side by side, no vibrant colors */}
              <div className="flex gap-4 mt-6">
                <button
                  className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 font-semibold py-3 px-6 rounded-2xl shadow-sm hover:bg-gray-100 transition-all duration-200 text-lg"
                  onClick={async () => {
                    if (isSharing) return;
                    setIsSharing(true);
                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: `${car.make} ${car.model} (${car.year}) em AutoGo.pt`,
                          text: `Vê este carro: ${car.make} ${car.model} (${car.year})`,
                          url: window.location.href,
                        });
                      } else {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('Link copiado para a área de transferência!');
                      }
                    } catch (e) {
                      // Optionally handle error
                    }
                    setIsSharing(false);
                  }}
                  aria-label="Partilhar esta viatura"
                  disabled={isSharing}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M15 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 10V5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 19H5V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>Partilhar</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 font-semibold py-3 px-6 rounded-2xl shadow-sm hover:bg-gray-100 transition-all duration-200 text-lg"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </section>

          {/* CARDS DE CARACTERÍSTICAS */}
          <section className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 px-0 md:px-12 lg:px-24 xl:px-32">
            {car.doors && (
              <div className="bg-white rounded-3xl shadow flex flex-col items-center p-6 hover:shadow-xl transition-all duration-200">
                <FaDoorOpen className="text-3xl text-[#b42121] mb-2" />
                <span className="font-bold text-lg">{car.doors}</span>
                <span className="text-xs text-gray-500">Portas</span>
              </div>
            )}
            {car.color && (
              <div className="bg-white rounded-3xl shadow flex flex-col items-center p-6 hover:shadow-xl transition-all duration-200">
                <FaPalette className="text-3xl text-[#b42121] mb-2" />
                <span className="font-bold text-lg">{car.color}</span>
                <span className="text-xs text-gray-500">Cor</span>
              </div>
            )}
            {car.emissionClass && (
              <div className="bg-white rounded-3xl shadow flex flex-col items-center p-6 hover:shadow-xl transition-all duration-200">
                <FaLayerGroup className="text-3xl text-[#b42121] mb-2" />
                <span className="font-bold text-lg">{car.emissionClass}</span>
                <span className="text-xs text-gray-500">Classe Emissões</span>
              </div>
            )}
            {car.co2 && (
              <div className="bg-white rounded-3xl shadow flex flex-col items-center p-6 hover:shadow-xl transition-all duration-200">
                <FaCloud className="text-3xl text-[#b42121] mb-2" />
                <span className="font-bold text-lg">{car.co2}</span>
                <span className="text-xs text-gray-500">CO₂</span>
              </div>
            )}
          </section>

          {/* SECÇÃO CAR CARETRISTICS */}
          <section className="w-full bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow p-10 mt-8 px-0 md:px-12 lg:px-24 xl:px-32">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">Curiosidades & Vantagens</h3>
            <ul className="list-disc pl-8 space-y-2 text-gray-700 text-lg">
              {funFacts.length
                ? funFacts.map((f, i) => <li key={i}>{f}</li>)
                : <li>Carro muito equilibrado para o mercado português.</li>
              }
            </ul>
          </section>

          {/* SECÇÃO EQUIPAMENTO & OPÇÕES */}
          {car.equipamento_opcoes && (
            <section className="w-full bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow p-10 mt-8 px-0 md:px-12 lg:px-24 xl:px-32">
              <h3 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-black tracking-tight">
                Equipamento & Opções
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {Object.entries(car.equipamento_opcoes).map(([categoria, lista]) => {
                  // Minimal, modern, grey icon mapping
                  const categoryIcons = {
                    conforto: <FaCogs className="text-gray-400 text-xl" />,
                    tecnologia: <FaBolt className="text-gray-400 text-xl" />,
                    seguranca: <FaRegCalendarCheck className="text-gray-400 text-xl" />,
                    opcoes_valor_elevado: <FaStar className="text-gray-400 text-xl" />,
                    exterior: <FaCarSide className="text-gray-400 text-xl" />,
                    interior: <FaPalette className="text-gray-400 text-xl" />,
                    assistencia: <FaUsers className="text-gray-400 text-xl" />,
                    outros: <FaLayerGroup className="text-gray-400 text-xl" />,
                  };
                  const icon = categoryIcons[categoria] || <FaLayerGroup className="text-gray-300 text-xl" />;
                  return Array.isArray(lista) && lista.length > 0 && (
                    <div key={categoria} className="mb-2 bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex flex-col gap-2 hover:shadow-md transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{icon}</span>
                        <span className="inline-block text-gray-700 text-base font-semibold capitalize tracking-wide">
                          {categoria.replace(/_/g, ' ').replace('opcoes', 'opções')}
                        </span>
                      </div>
                      <ul className="list-none pl-0 space-y-1 text-gray-800 text-sm">
                        {lista.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* SECÇÃO CARROS SEMELHANTES - Swiper-like Carousel */}
          <section id="similar" className="mt-12">
            <div className="card rounded-3xl border-0 mb-3 shadow-sm flex flex-col bg-white/90">
              <div className="card-body pt-6 px-6">
                <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3 text-[#b42121] tracking-tight">
                  <FaCarSide className="text-[#b42121] text-2xl" /> Carros semelhantes
                </h2>
                <div className="relative similar-swiper-container swiper-container-horizontal">
                  {/* Navigation Arrows */}
                  <button
                    className="arrow arrow--left absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow p-2 border border-gray-200 hover:bg-[#b42121] hover:text-white transition-all"
                    aria-label="Anterior"
                    onClick={() => setSwiperIndex(i => Math.max(i - 1, 0))}
                  >
                    <FaChevronDown className="rotate-90 text-2xl" />
                  </button>
                  <button
                    className="arrow arrow--right absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow p-2 border border-gray-200 hover:bg-[#b42121] hover:text-white transition-all"
                    aria-label="Seguinte"
                    onClick={() => setSwiperIndex(i => Math.min(i + 1, similarCars.length - slidesToShow))}
                  >
                    <FaChevronDown className="-rotate-90 text-2xl" />
                  </button>
                  {/* Swiper Wrapper */}
                  <div className="swiper-wrapper flex transition-transform duration-500" style={{ transform: `translateX(-${swiperIndex * (100 / slidesToShow)}%)` }}>
                    {similarCars.map((simCar, idx) => (
                      <div
                        key={simCar.id}
                        className="swiper-slide bg-white rounded-2xl shadow-lg w-72 flex-shrink-0 cursor-pointer group relative overflow-hidden transition-all duration-300 hover:shadow-2xl mx-2"
                        style={{ minWidth: '18rem', maxWidth: '18rem' }}
                        data-id={simCar.id}
                      >
                        <a href={`/cars/${simCar.id}`} className="block h-full">
                          <div className="similar-swiper-item relative">
                            <img
                              width="100%"
                              src={simCar.image}
                              alt={`${simCar.make} ${simCar.model}`}
                              className="w-full h-40 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="slide-overlay absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                              <div className="car-info p-4 text-white w-full">
                                <span className="make font-bold block text-lg">{simCar.make}</span>
                                <span className="model block text-base">{simCar.model}</span>
                                <span className="year block text-sm">{simCar.year}</span>
                                <span className="km block text-sm">{simCar.mileage?.toLocaleString()} km</span>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                  {/* Pagination Fraction */}
                  <div className="swiper-pagination-fraction absolute right-6 bottom-2 bg-white/80 rounded px-3 py-1 text-sm font-semibold text-[#b42121] shadow">
                    {swiperIndex + 1}/{similarCars.length}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <a href="/viaturas" className="text-blue-700 hover:underline block mt-6">&larr; Voltar às viaturas</a>
        </main>
        <footer className="p-4 bg-gray-200 text-center text-gray-600 mt-8">
          &copy; 2025 Autogo. All rights reserved.
        </footer>
      </div>
    </Layout>
  );
}


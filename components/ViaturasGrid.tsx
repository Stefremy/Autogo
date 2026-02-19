import React, { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Car } from '../types/car';
import MakeLogo from './MakeLogo';
import { formatPriceDisplay } from '../utils/formatPrice';
import OptimizedImage from './OptimizedImage';

// Define status constants to avoid magic strings
const STATUS_LABELS = {
    disponivel: "Disponível",
    vendido: "Vendido",
    sob_consulta: "Sob Consulta",
    novidade: "Novidade",
};

const STATUS_COLORS = {
    disponivel: "bg-green-500",
    vendido: "bg-gray-400",
    sob_consulta: "bg-yellow-400",
    novidade: "bg-blue-500",
};

interface ViaturasGridProps {
    cars: Car[];
    styles: Record<string, string>;
    onCarClick?: (car: Car) => void;
}

// Single shared lightbox — replaces N×5 <dialog> elements per render
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
    const { t } = useTranslation('common');
    // Close on backdrop click
    const handleBackdrop = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    }, [onClose]);
    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70"
            onClick={handleBackdrop}
        >
            <div className="flex flex-col items-center max-w-3xl w-full px-4">
                <img
                    src={src}
                    loading="lazy"
                    alt="Foto expandida"
                    className="max-h-[80vh] w-auto rounded-xl shadow-lg"
                />
                <button
                    onClick={onClose}
                    className="mt-4 mb-2 px-6 py-2 bg-[#b42121] text-white rounded-full font-bold hover:bg-[#a11a1a] transition"
                >
                    {t("Fechar")}
                </button>
            </div>
        </div>
    );
}

// Per-card component so useCallback handlers are stable per car identity
interface CarCardItemProps {
    car: Car;
    idx: number;
    styles: Record<string, string>;
    onCarClick?: (car: Car) => void;
    onOpenLightbox: (src: string) => void;
}

const CarCardItem = memo(function CarCardItem({ car, idx, styles, onCarClick, onOpenLightbox }: CarCardItemProps) {
    const mainImg = String((car.image || (car.images && car.images[0])) || "");
    const thumbImgs = (car.images || (car.image ? [car.image] : [])).slice(0, 5) as string[];

    const handleMainImgClick = useCallback(() => {
        onOpenLightbox(mainImg);
    }, [onOpenLightbox, mainImg]);

    const handleCarClick = useCallback(() => {
        onCarClick?.(car);
    }, [onCarClick, car]);

    const priceDisplay = (() => {
        const numeric = typeof car.price === 'number' ? car.price : null;
        return formatPriceDisplay(numeric, (car as any).priceDisplay);
    })();

    return (
        <div
            className={`${styles["premium-car-card"]} ${styles["card-anim"]}`}
            data-card-index={idx}
            data-enter-delay="true"
            style={{ ['--enter-delay' as any]: `${idx * 45}ms` } as React.CSSProperties}
        >
            {/* Status badge */}
            {car.status && (
                <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow z-20 text-white ${STATUS_COLORS[car.status as keyof typeof STATUS_COLORS] || "bg-gray-400"}`}
                    style={{ letterSpacing: "0.5px", minWidth: 90, textAlign: "center" }}
                >
                    {STATUS_LABELS[car.status as keyof typeof STATUS_LABELS] || car.status}
                </span>
            )}

            {/* Desktop Image (Main Only) */}
            <div className="w-full mb-4 hidden md:block">
                <button
                    type="button"
                    className="focus:outline-none w-full"
                    onClick={handleMainImgClick}
                >
                    <OptimizedImage
                        src={mainImg}
                        priority={idx < 4}
                        alt={`${car.make} ${car.model} foto principal`}
                        className={styles["premium-car-image"]}
                        width={400}
                        height={300}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover', aspectRatio: '4/3' }}
                    />
                </button>
            </div>

            {/* Mobile Image Scroller (Thumbnails) */}
            <div
                className="w-full h-44 mb-4 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#b42121]/60 scrollbar-track-gray-200 bg-transparent md:hidden"
                style={{ touchAction: 'pan-x', overscrollBehaviorX: 'contain' } as React.CSSProperties}
            >
                {thumbImgs.map((img, imgIdx) => {
                    const thumbSrc = Array.isArray(img) ? String((img as any)[0]) : String(img);
                    return (
                        <ThumbButton
                            key={imgIdx}
                            src={thumbSrc}
                            idx={imgIdx}
                            carMake={car.make}
                            carModel={car.model}
                            priority={idx < 2 && imgIdx === 0}
                            styleClass={styles["premium-car-image"]}
                            onOpen={onOpenLightbox}
                        />
                    );
                })}
            </div>

            {/* Car Info Link */}
            <Link
                href={`/cars/${car.slug || car.id}`}
                className="relative flex flex-col items-center w-full mt-2 text-inherit no-underline clickable-open"
                onClick={handleCarClick}
                aria-label={`Ver detalhes ${car.make} ${car.model}`}
            >
                <div className="mb-2">
                    <MakeLogo make={car.make} size={36} className="h-12 w-auto mx-auto" />
                </div>
                <h2
                    className="text-xl font-semibold mb-1 text-[#222] text-center px-2 w-full flex items-center justify-center gap-2"
                    style={{ minHeight: "2.5rem" }}
                >
                    {car.make} {car.model}
                </h2>
                <div className="text-gray-500 mb-1 text-center px-2">
                    {car.year} · {car.mileage} km
                </div>
                <div className="font-bold text-black text-lg mb-3 text-center px-2">
                    {priceDisplay}
                </div>
            </Link>
        </div>
    );
});

// Stable thumbnail button so its handler doesn't change unless src changes
interface ThumbButtonProps {
    src: string;
    idx: number;
    carMake: string;
    carModel: string;
    priority: boolean;
    styleClass: string;
    onOpen: (src: string) => void;
}
const ThumbButton = memo(function ThumbButton({ src, idx, carMake, carModel, priority, styleClass, onOpen }: ThumbButtonProps) {
    const handleClick = useCallback(() => onOpen(src), [onOpen, src]);
    return (
        <button
            type="button"
            className="focus:outline-none flex-shrink-0"
            onClick={handleClick}
        >
            <OptimizedImage
                src={src}
                priority={priority}
                alt={`${carMake} ${carModel} foto ${idx + 1}`}
                className={styleClass}
                width={300}
                height={200}
                style={{ minWidth: "11rem", height: "100%", objectFit: 'cover' }}
            />
        </button>
    );
});

function ViaturasGrid({ cars, styles, onCarClick }: ViaturasGridProps) {
    // Single lightbox state — null means closed
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const closeLightbox = useCallback(() => setLightboxSrc(null), []);
    // Stable handler passed down to all cards — only setLightboxSrc reference, no per-card closure
    const openLightbox = useCallback((src: string) => setLightboxSrc(src), []);

    return (
        <>
            {/* Single shared lightbox — avoids N×5 dialog elements in DOM */}
            {lightboxSrc && <Lightbox src={lightboxSrc} onClose={closeLightbox} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
                {cars.map((car, idx) => (
                    <CarCardItem
                        key={car.id}
                        car={car}
                        idx={idx}
                        styles={styles}
                        onCarClick={onCarClick}
                        onOpenLightbox={openLightbox}
                    />
                ))}
            </div>
        </>
    );
}

export default React.memo(ViaturasGrid);

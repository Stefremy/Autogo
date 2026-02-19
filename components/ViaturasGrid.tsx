import React, { useCallback, memo } from 'react';
import Link from 'next/link';
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

// Per-card component
interface CarCardItemProps {
    car: Car;
    idx: number;
    styles: Record<string, string>;
    onCarClick?: (car: Car) => void;
}

const CarCardItem = memo(function CarCardItem({ car, idx, styles, onCarClick }: CarCardItemProps) {
    const mainImg = String((car.image || (car.images && car.images[0])) || "");
    const thumbImgs = (car.images || (car.image ? [car.image] : [])).slice(0, 5) as string[];
    const carPath = `/cars/${car.slug || car.id}`;

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

            {/* Desktop Image — links to car page */}
            <div className="w-full mb-4 hidden md:block">
                <Link href={carPath} onClick={handleCarClick} aria-label={`Ver ${car.make} ${car.model}`}>
                    <OptimizedImage
                        src={mainImg}
                        priority={idx < 4}
                        alt={`${car.make} ${car.model} foto principal`}
                        className={styles["premium-car-image"]}
                        width={400}
                        height={300}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover', aspectRatio: '4/3' }}
                    />
                </Link>
            </div>

            {/* Mobile Image Scroller — each thumb links to car page */}
            <div
                className="w-full h-44 mb-4 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#b42121]/60 scrollbar-track-gray-200 bg-transparent md:hidden"
                style={{ touchAction: 'pan-x', overscrollBehaviorX: 'contain' } as React.CSSProperties}
            >
                {thumbImgs.map((img, imgIdx) => {
                    const thumbSrc = Array.isArray(img) ? String((img as any)[0]) : String(img);
                    return (
                        <Link
                            key={imgIdx}
                            href={carPath}
                            onClick={handleCarClick}
                            className="flex-shrink-0"
                            aria-label={`Ver ${car.make} ${car.model} foto ${imgIdx + 1}`}
                        >
                            <OptimizedImage
                                src={thumbSrc}
                                priority={idx < 2 && imgIdx === 0}
                                alt={`${car.make} ${car.model} foto ${imgIdx + 1}`}
                                className={styles["premium-car-image"]}
                                width={300}
                                height={200}
                                style={{ minWidth: "11rem", height: "100%", objectFit: 'cover' }}
                            />
                        </Link>
                    );
                })}
            </div>

            {/* Car Info Link */}
            <Link
                href={carPath}
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

function ViaturasGrid({ cars, styles, onCarClick }: ViaturasGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
            {cars.map((car, idx) => (
                <CarCardItem
                    key={car.id}
                    car={car}
                    idx={idx}
                    styles={styles}
                    onCarClick={onCarClick}
                />
            ))}
        </div>
    );
}

export default React.memo(ViaturasGrid);

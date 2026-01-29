import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Car } from '../types/car';
import MakeLogo from './MakeLogo';
import { formatPriceDisplay } from '../utils/formatPrice';

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

export default function ViaturasGrid({ cars, styles, onCarClick }: ViaturasGridProps) {
    const { t } = useTranslation('common');

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
            {cars.map((car, idx) => (
                <div
                    key={car.id}
                    className={`${styles["premium-car-card"]} ${styles["card-anim"]}`}
                    data-card-index={idx}
                    data-enter-delay="true"
                    style={{ ['--enter-delay' as any]: `${idx * 45}ms` } as React.CSSProperties}
                >
                    {/* Status badge */}
                    {car.status && (
                        <span
                            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow z-20 text-white ${STATUS_COLORS[car.status as keyof typeof STATUS_COLORS] || "bg-gray-400"}`}
                            style={{
                                letterSpacing: "0.5px",
                                minWidth: 90,
                                textAlign: "center",
                            }}
                        >
                            {t(STATUS_LABELS[car.status as keyof typeof STATUS_LABELS] || car.status)}
                        </span>
                    )}

                    {/* Desktop Image (Main Only) */}
                    <div className="w-full mb-4 hidden md:block">
                        {(() => {
                            const mainImg = (car && (car.image || (car.images && car.images[0]))) || "";
                            return (
                                <button
                                    type="button"
                                    className="focus:outline-none w-full"
                                    onClick={() => {
                                        // Using browser native dialog API
                                        const modalId = `modal-img-${car.id}-0`;
                                        const modal = document.getElementById(modalId) as HTMLDialogElement | null;
                                        if (modal) modal.showModal();
                                    }}
                                >
                                    <img
                                        src={String(mainImg)}
                                        loading="lazy"
                                        alt={`${car.make} ${car.model} foto principal`}
                                        className={styles["premium-car-image"]}
                                        style={{ width: '100%', height: undefined }}
                                    />
                                </button>
                            );
                        })()}
                    </div>

                    {/* Mobile Image Scroller (Thumbnails) */}
                    <div className="w-full h-44 mb-4 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#b42121]/60 scrollbar-track-gray-200 bg-transparent md:hidden">
                        {(() => {
                            const imgs = (car.images || (car.image ? [car.image] : [])).slice(0, 5);
                            return imgs.map((img, idx) => {
                                const thumbSrc = Array.isArray(img) ? String(img[0]) : String(img);
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        className="focus:outline-none"
                                        onClick={() => {
                                            const modalId = `modal-img-${car.id}-${idx}`;
                                            const modal = document.getElementById(modalId) as HTMLDialogElement | null;
                                            if (modal) modal.showModal();
                                        }}
                                    >
                                        <img
                                            src={thumbSrc}
                                            loading="lazy"
                                            alt={`${car.make} ${car.model} foto ${idx + 1}`}
                                            className={styles["premium-car-image"]}
                                            style={{ minWidth: "11rem" }}
                                        />
                                    </button>
                                );
                            });
                        })()}
                    </div>

                    {/* Dialogs for Images */}
                    {/* Note: In a pure React approach we might lift this to a global modal, 
              but preserving existing logic for now means keeping dialogs here. */}
                    {(() => {
                        const imgs = (car.images || (car.image ? [car.image] : [])).slice(0, 5);
                        return imgs.map((img, idx) => (
                            <dialog
                                key={idx}
                                id={`modal-img-${car.id}-${idx}`}
                                className="backdrop:bg-black/70 rounded-xl p-0 border-none max-w-3xl w-full"
                            >
                                <div className="flex flex-col items-center">
                                    <img
                                        src={String(img)}
                                        loading="lazy"
                                        alt="Foto expandida"
                                        className="max-h-[80vh] w-auto rounded-xl shadow-lg"
                                    />
                                    <button
                                        onClick={(e) => (e.currentTarget.closest("dialog") as HTMLDialogElement)?.close()}
                                        className="mt-4 mb-2 px-6 py-2 bg-[#b42121] text-white rounded-full font-bold hover:bg-[#a11a1a] transition"
                                    >
                                        {t("Fechar")}
                                    </button>
                                </div>
                            </dialog>
                        ));
                    })()}

                    {/* Car Info Link */}
                    <Link
                        href={`/cars/${car.slug || car.id}`}
                        className="relative flex flex-col items-center w-full mt-2 text-inherit no-underline clickable-open"
                        onClick={() => onCarClick?.(car)}
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
                            {(() => {
                                const numeric = typeof car.price === 'number' ? car.price : null;
                                // Use imported helper for consistent pricing
                                return formatPriceDisplay(numeric, (car as any).priceDisplay);
                            })()}
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

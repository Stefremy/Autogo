import React from 'react';
import Script from 'next/script';
import { motion } from 'framer-motion';

interface GoogleReviewsProps {
    widgetId?: string;
}

export default function GoogleReviews({
    widgetId = 'd41fa191-d79b-43fe-8f75-90157772dbd7'
}: GoogleReviewsProps) {
    const [showWidget, setShowWidget] = React.useState(false);

    React.useEffect(() => {
        // Delay loading the heavy Elfsight script by 5 seconds
        // This ensures TBT/LCP are not affected by this 3rd party script
        const timer = setTimeout(() => {
            setShowWidget(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            data-fullwidth
            className="relative w-screen py-16 sm:py-20 bg-[#f9f9f9]"
            style={{
                marginLeft: "calc(-50vw + 50%)",
                marginRight: "calc(-50vw + 50%)",
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-3xl md:text-4xl font-semibold text-black mb-12 text-center tracking-tight"
                >
                    O Que Dizem os Nossos Clientes
                </motion.h2>

                {/* Elfsight Widget Integration */}
                <div className="min-h-[400px]"> {/* Placeholder height to prevent layout shift */}
                    {showWidget && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8"
                        >
                            <Script
                                src="https://elfsightcdn.com/platform.js"
                                strategy="lazyOnload"
                            />
                            <div className={`elfsight-app-${widgetId}`} data-elfsight-app-lazy />
                        </motion.div>
                    )}
                </div>

                {/* Call-to-Action Button to View All Reviews */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center mt-10"
                >
                    <a
                        href={`https://www.google.com/search?newwindow=1&sca_esv=6bd904d33d0249b3&sxsrf=ANbL-n5rLyPhtxkGaDxnaIehE-5Hbn4zmw:1771006296741&kgmid=/g/11ywd79lbl&q=Autogo&shem=sumc,shrtsdl&shndl=30&source=sh/x/loc/uni/m1/1&kgs=5a7db454e0204e50&utm_source=sumc,shrtsdl,sh/x/loc/uni/m1/1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-4 bg-[#4285f4] text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:bg-[#3367d6] hover:shadow-xl hover:scale-105"
                        style={{
                            textDecoration: 'none',
                        }}
                    >
                        <span className="flex items-center gap-2">
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            Ver Todas as Avaliações no Google
                        </span>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}

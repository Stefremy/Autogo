import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, useMotionValue } from 'framer-motion';

interface HeroScrollAnimationProps {
    totalFrames?: number;
    "data-fullwidth"?: boolean;
}

export default function HeroScrollAnimation({
    totalFrames = 192
}: HeroScrollAnimationProps) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [prevFrame, setPrevFrame] = useState(-1);
    const [isMobile, setIsMobile] = useState(false);

    // We'll use a local motion value for the "locked" progress
    const lockedProgress = useMotionValue(0);
    const smoothLockedProgress = useSpring(lockedProgress, { stiffness: 100, damping: 30 });

    const framesRef = useRef<HTMLImageElement[]>([]);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Map progress to frame index - Clamp to 1.0 to ensure car stops rotating at the end
    const frameIndex = useTransform(smoothLockedProgress, [0, 1, 1.2], [0, totalFrames - 1, totalFrames - 1]);

    // Preload all frames - Using the verified % 3 pattern
    useEffect(() => {
        const loadFrames = async () => {
            const frames: HTMLImageElement[] = [];

            // Priority 1: Load frame 0 immediately and draw it
            const firstImg = new Image();
            firstImg.src = `/images/heroscroll/frame_000_delay-0.042s.jpg`;
            await new Promise<void>((resolve) => {
                firstImg.onload = () => {
                    frames[0] = firstImg;
                    requestAnimationFrame(() => drawFrame(0));
                    resolve();
                };
                firstImg.onerror = () => resolve();
            });

            // Priority 2: Load the rest
            const loadPromises: Promise<void>[] = [];
            for (let i = 1; i < totalFrames; i++) {
                const img = new Image();
                const frameNumber = String(i).padStart(3, '0');
                const delay = i % 3 === 1 ? '0.041s' : '0.042s';
                img.src = `/images/heroscroll/frame_${frameNumber}_delay-${delay}.jpg`;

                const promise = new Promise<void>((resolve) => {
                    img.onload = () => resolve();
                    img.onerror = () => {
                        const fallbackDelay = delay === '0.042s' ? '0.041s' : '0.042s';
                        img.src = `/images/heroscroll/frame_${frameNumber}_delay-${fallbackDelay}.jpg`;
                        img.onload = () => resolve();
                        img.onerror = () => resolve();
                    };
                });
                loadPromises.push(promise);
                frames[i] = img;
            }
            framesRef.current = frames;

            // Wait for a few more frames to mark as "imagesLoaded" for interaction
            await Promise.race([
                Promise.all(loadPromises.slice(0, 30)),
                new Promise(resolve => setTimeout(resolve, 2000))
            ]);
            setImagesLoaded(true);
        };
        loadFrames();
    }, [totalFrames]);

    // Optimized canvas drawing
    const drawFrame = useCallback((idx: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { alpha: false });
        if (!canvas || !ctx) return;

        let img = framesRef.current[idx];
        // If the frame isn't loaded yet, fallback to a nearby loaded one or frame 0
        if (!img || !img.complete || img.naturalWidth === 0) {
            img = framesRef.current[0];
        }
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const targetAspect = 16 / 9;
        const viewportAspect = viewportWidth / viewportHeight;

        let renderWidth, renderHeight;
        if (viewportAspect > targetAspect) {
            renderWidth = viewportWidth;
            renderHeight = viewportWidth / targetAspect;
        } else {
            renderHeight = viewportHeight;
            renderWidth = viewportHeight * targetAspect;
        }

        if (canvas.width !== viewportWidth || canvas.height !== viewportHeight) {
            canvas.width = viewportWidth;
            canvas.height = viewportHeight;
        }
        ctx.drawImage(img, (viewportWidth - renderWidth) / 2, (viewportHeight - renderHeight) / 2, renderWidth, renderHeight);
    }, []);

    // Frame update trigger
    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (isMobile) return; // No animation on mobile
        const idx = Math.min(totalFrames - 1, Math.floor(latest));
        if (idx !== prevFrame && imagesLoaded) {
            setPrevFrame(idx);
            requestAnimationFrame(() => drawFrame(idx));
        }
    });

    // --- HARD SCROLL LOCK LOGIC (Desktop Only) ---
    useEffect(() => {
        if (isMobile) return;

        let isActivated = false;
        let progress = 0;

        const handleWheel = (e: WheelEvent) => {
            if (!containerRef.current || !imagesLoaded) return;
            const rect = containerRef.current.getBoundingClientRect();

            if (rect.top <= 2 && rect.top >= -2 && progress < 1.2) {
                isActivated = true;
            }

            if (isActivated && progress < 1.2) {
                e.preventDefault();
                const sensitivity = 0.0008;
                progress = Math.max(0, Math.min(1.2, progress + e.deltaY * sensitivity));
                lockedProgress.set(progress);
                if (progress >= 1.2) {
                    isActivated = false;
                    window.scrollBy(0, 50);
                }
            } else if (isActivated && progress >= 1.2 && e.deltaY < 0) {
            }
        };

        const checkStatus = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            if (rect.top <= 0 && rect.bottom > window.innerHeight && progress < 1.2) {
                isActivated = true;
            } else if (progress >= 1.2) {
                isActivated = false;
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('scroll', checkStatus, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('scroll', checkStatus);
        };
    }, [imagesLoaded, lockedProgress, isMobile]);

    // Text & CTA Animations
    const word1Opacity = useTransform(smoothLockedProgress, [0.05, 0.15], [0, 1]);
    const word1Y = useTransform(smoothLockedProgress, [0.05, 0.15], [20, 0]);

    const word2Opacity = useTransform(smoothLockedProgress, [0.25, 0.35], [0, 1]);
    const word2Y = useTransform(smoothLockedProgress, [0.25, 0.35], [20, 0]);

    const word3Opacity = useTransform(smoothLockedProgress, [0.45, 0.55], [0, 1]);
    const word3Y = useTransform(smoothLockedProgress, [0.45, 0.55], [20, 0]);

    const ctaOpacity = useTransform(smoothLockedProgress, [0.8, 0.95], [0, 1]);
    const ctaY = useTransform(smoothLockedProgress, [0.8, 0.95], [30, 0]);

    return (
        <div
            ref={containerRef}
            className="relative w-screen bg-black overflow-visible"
            style={{
                height: '100vh',
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)'
            }}
        >
            <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black z-0">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ willChange: 'transform', touchAction: 'none' }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pointer-events-none">
                    <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
                        <motion.div style={isMobile ? { opacity: 1, y: 0 } : { opacity: word1Opacity, y: word1Y }} className="inline-block">Rápido</motion.div>{' '}
                        <motion.div style={isMobile ? { opacity: 1, y: 0 } : { opacity: word2Opacity, y: word2Y }} className="inline-block">Seguro</motion.div>{' '}
                        <motion.div style={isMobile ? { opacity: 1, y: 0 } : { opacity: word3Opacity, y: word3Y }} className="inline-block text-[#b42121]">Teu</motion.div>
                    </div>

                    <motion.div className="pointer-events-auto" style={isMobile ? { opacity: 1, y: 0 } : { opacity: ctaOpacity, y: ctaY }}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 drop-shadow-2xl">O teu carro europeu, Legalizado e pronto a rolar em Portugal</h2>
                        <div className="flex flex-wrap gap-4 justify-center mb-12">
                            <button onClick={() => router.push('/viaturas')} className="px-8 py-4 bg-[#b42121] hover:bg-[#8a1919] text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 active:scale-95">Ver Viaturas</button>
                        </div>
                    </motion.div>
                </div>

                {!imagesLoaded && !isMobile && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
                        <div className="text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-white/10 border-t-white"></div></div>
                    </div>
                )}
            </div>
        </div>
    );
}

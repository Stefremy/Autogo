import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, useMotionValue, animate } from 'framer-motion';
import { ShinyButton } from './ShinyButton';
import { AuroraText } from './AuroraText';
import { InteractiveHoverButton } from './InteractiveHoverButton';

interface HeroScrollAnimationProps {
    totalFrames?: number;
    "data-fullwidth"?: boolean;
}

// Internal component containing the heavy logic
function AnimatedHero({
    totalFrames = 192
}: HeroScrollAnimationProps) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [posterReady, setPosterReady] = useState(false);
    const [prevFrame, setPrevFrame] = useState(-1);
    const [isMobile, setIsMobile] = useState(false);

    // We'll use a local motion value for the "locked" progress on desktop
    const lockedProgress = useMotionValue(0);
    // Smoother spring for desktop (stiffness 80, damping 40 for fluid feel)
    const smoothLockedProgress = useSpring(lockedProgress, { stiffness: 80, damping: 40 });

    // For mobile, we'll use an auto-play progress
    const mobileProgress = useMotionValue(0);

    // Use smoothLockedProgress for desktop (lock-based) and mobileProgress for phone (auto-play)
    const activeProgress = isMobile ? mobileProgress : smoothLockedProgress;

    const framesRef = useRef<HTMLImageElement[]>([]);

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

    // Detect mobile & Handle Resize Redraw
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            // Force redraw of current frame to update canvas size
            if (framesRef.current.length > 0 && activeProgress) {
                const currentProgress = activeProgress.get();
                // Re-calculate index based on current progress
                const idx = Math.min(totalFrames - 1, Math.floor(currentProgress * (totalFrames - 1)));
                requestAnimationFrame(() => drawFrame(idx));
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [totalFrames, activeProgress, drawFrame]);

    // Map progress to frame index - Clamp to 1.0 to ensure car stops rotating at the end
    const frameIndex = useTransform(activeProgress, [0, 1, 1.2], [0, totalFrames - 1, totalFrames - 1]);

    // Preload frames in chunks to avoid blocking main thread and massive network spike
    useEffect(() => {
        let isMounted = true;

        const loadFrames = async () => {
            const frames: HTMLImageElement[] = [];

            // Priority 1: Load leader/poster frame immediately and draw it
            const firstImg = new Image();
            const posterSrc = `/images/heroscroll/frameeleder.webp`;
            firstImg.src = posterSrc;

            await new Promise<void>((resolve) => {
                const onFirstLoad = () => {
                    if (!isMounted) return;
                    frames[0] = firstImg;
                    framesRef.current = frames;
                    requestAnimationFrame(() => drawFrame(0));
                    setPosterReady(true);
                    resolve();
                };
                firstImg.onload = onFirstLoad;
                firstImg.onerror = () => {
                    const fallbackImg = new Image();
                    fallbackImg.src = `/images/heroscroll/frame_000_delay-0.042s.webp`;
                    fallbackImg.onload = () => {
                        if (!isMounted) return;
                        frames[0] = fallbackImg;
                        requestAnimationFrame(() => drawFrame(0));
                        setPosterReady(true);
                        resolve();
                    };
                    fallbackImg.onerror = () => {
                        setPosterReady(true);
                        resolve();
                    };
                };
            });

            if (!isMounted) return;

            // Priority 2: Load the rest in chunks
            const CHUNK_SIZE = 24; // Load 1 second of animation at a time

            for (let i = 1; i < totalFrames; i += CHUNK_SIZE) {
                if (!isMounted) break;

                const chunkPromises: Promise<void>[] = [];
                const end = Math.min(i + CHUNK_SIZE, totalFrames);

                for (let j = i; j < end; j++) {
                    const img = new Image();
                    const frameNumber = String(j).padStart(3, '0');
                    const delay = j % 3 === 1 ? '0.041s' : '0.042s';
                    img.src = `/images/heroscroll/frame_${frameNumber}_delay-${delay}.webp`;

                    // We don't await individual images, just the chunk batch
                    const p = new Promise<void>((resolve) => {
                        img.onload = () => resolve();
                        img.onerror = () => {
                            // try fallback if needed, but don't block
                            const fallbackDelay = delay === '0.042s' ? '0.041s' : '0.042s';
                            img.src = `/images/heroscroll/frame_${frameNumber}_delay-${fallbackDelay}.webp`;
                            img.onload = () => resolve();
                            img.onerror = () => resolve();
                        };
                    });

                    frames[j] = img;
                    chunkPromises.push(p);
                }

                // Wait for this chunk to settle before starting next one
                // This yields back to main thread between chunks
                await Promise.all(chunkPromises);

                // Extra yield to ensure UI responsiveness
                await new Promise(r => setTimeout(r, 50));

                // Update ref progressively so frames are available if user scrolls fast
                framesRef.current = [...frames];

                // If we have loaded enough initial frames, mark as ready for interaction
                if (i + CHUNK_SIZE >= 48 && !imagesLoaded) {
                    setImagesLoaded(true);
                }
            }

            if (isMounted) setImagesLoaded(true);
        };

        loadFrames();

        return () => { isMounted = false; };
    }, [totalFrames, drawFrame]);

    // Auto-play on mobile
    useEffect(() => {
        if (isMobile && imagesLoaded) {
            animate(mobileProgress, 1, {
                duration: 3.5, // Verify smoother mobile playback (less rushed)
                ease: "easeInOut",
            });
        }
    }, [isMobile, imagesLoaded, mobileProgress]);

    // Frame update trigger
    useMotionValueEvent(frameIndex, "change", (latest) => {
        // No animation guard removed to allow auto-play
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
        // Initialize from current motion value to prevent reset on re-renders
        let progress = lockedProgress.get();

        const handleWheel = (e: WheelEvent) => {
            if (!containerRef.current) return;
            // Removed !imagesLoaded check to allow locking immediately (poster/frame 0 fallback handles display)

            const rect = containerRef.current.getBoundingClientRect();

            // Broaden check to catch fast scrolls:
            // - rect.top <= 10: User has reached the top or scrolled past it
            // - rect.top >= -100: User hasn't scrolled *too* far past it (avoid locking if way down page)
            // - progress < 1.2: Animation isn't finished
            if (rect.top <= 10 && rect.top >= -100 && progress < 1.2) {
                isActivated = true;

                // If we caught it slightly off-target (fast scroll), snap to top immediately
                // but only if deviation is significant (> 1px) to avoid jitter
                if (Math.abs(rect.top) > 1) {
                    window.scrollTo({
                        top: window.scrollY + rect.top,
                        behavior: 'auto'
                    });
                }
            }

            if (isActivated && progress < 1.2) {
                e.preventDefault();
                const sensitivity = 0.0006; // Reduced sensitivity for smoother control
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

    // Text & CTA Animations - Using activeProgress for both desktop and mobile
    const word1Opacity = useTransform(activeProgress, [0.05, 0.15], [0, 1]);
    const word1Y = useTransform(activeProgress, [0.05, 0.15], [20, 0]);

    const word2Opacity = useTransform(activeProgress, [0.25, 0.35], [0, 1]);
    const word2Y = useTransform(activeProgress, [0.25, 0.35], [20, 0]);

    const word3Opacity = useTransform(activeProgress, [0.45, 0.55], [0, 1]);
    const word3Y = useTransform(activeProgress, [0.45, 0.55], [20, 0]);

    const ctaOpacity = useTransform(activeProgress, [0.8, 0.95], [0, 1]);
    const ctaY = useTransform(activeProgress, [0.8, 0.95], [30, 0]);

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
                {/* Poster image for instant initial load (server-rendered) */}
                <img
                    src="/images/heroscroll/frameeleder.webp"
                    alt="AutoGo Hero"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${imagesLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    style={{
                        objectPosition: 'center',
                        zIndex: 10
                    } as any}
                    fetchPriority="high"
                    loading="eager"
                />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ willChange: 'transform', touchAction: 'none' }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pointer-events-none">
                    <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
                        <motion.div style={{ opacity: word1Opacity, y: word1Y }} className="inline-block">Rápido</motion.div>{' '}
                        <motion.div style={{ opacity: word2Opacity, y: word2Y }} className="inline-block">Seguro</motion.div>{' '}
                        <motion.div style={{ opacity: word3Opacity, y: word3Y }} className="inline-block">
                            <AuroraText>Teu</AuroraText>
                        </motion.div>
                    </div>

                    <motion.div className="pointer-events-auto" style={{ opacity: ctaOpacity, y: ctaY }}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 drop-shadow-2xl">O teu carro europeu, Legalizado e pronto a rolar em Portugal</h2>
                        <div className="flex flex-col gap-6 justify-center items-center mb-12">
                            <ShinyButton
                                onClick={() => router.push('/viaturas')}
                                className="px-8 py-4 text-xl w-64"
                            >
                                Ver Viaturas
                            </ShinyButton>
                            <InteractiveHoverButton
                                onClick={() => router.push('/simulador-isv')}
                                className="px-8 py-4 text-xl w-64"
                            >
                                Simulador ISV
                            </InteractiveHoverButton>
                        </div>
                    </motion.div>
                </div>

                {!posterReady && !isMobile && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
                        <div className="text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-white/10 border-t-white"></div></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function HeroScrollAnimation(props: HeroScrollAnimationProps) {
    const [animationLoaded, setAnimationLoaded] = useState(false);
    const staticImage = '/images/heroscroll/frameeleder.webp'; // Using existing poster

    useEffect(() => {
        // Only load animation after page is ready + delay
        const timer = setTimeout(() => {
            setAnimationLoaded(true);
        }, 2000); // 2 seconds delay

        return () => clearTimeout(timer);
    }, []);

    if (!animationLoaded) {
        // Show static first frame/poster while waiting
        return (
            <div
                className="relative w-screen bg-black overflow-visible"
                style={{
                    height: '100vh',
                    marginLeft: 'calc(-50vw + 50%)',
                    marginRight: 'calc(-50vw + 50%)'
                }}
            >
                <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black z-0">
                    <img
                        src={staticImage}
                        alt="AutoGo Hero"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                            objectPosition: 'center',
                            zIndex: 10
                        }}
                        fetchPriority="high"
                        loading="eager"
                    />
                    {/* Overlay to ensure text readability if we decide to show text later, or just match visual style */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
                </div>
            </div>
        );
    }

    // Load full animation component after delay
    return <AnimatedHero {...props} />;
}

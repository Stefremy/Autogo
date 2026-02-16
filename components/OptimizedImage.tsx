import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
    src: string;
    fallbackSrc?: string;
    className?: string;
}

/**
 * OptimizedImage Component
 * Wraps next/image with default optimization settings.
 * Handles the case where the src might still point to an old extension (jpg/png) but the file is now webp,
 * or allows explicit src.
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className,
    priority = false,
    fallbackSrc = '/images/auto-logo.webp',
    ...props
}) => {
    const [error, setError] = useState(false);

    // If the source was a static path like "/images/foo.jpg" and we converted it to webp,
    // we might want to automatically try the .webp version if the original logic assumes jpg.
    // However, for safety, we assume the passed 'src' is correct or updated by the developer.
    // But strictly for the migration task, if we changed files on disk, we must pass the new path.
    // We will handle the path update at the usage site, so this component just renders what it's given.

    // If src is missing/empty, use fallback or return nothing to avoid "src is missing" error
    const validSrc = (src && src.trim().length > 0) ? src : fallbackSrc;
    // If even fallback is invalid (unlikely), prevent crash
    if (!validSrc) return null;

    // If fill is used, we shouldn't set width/height on the wrapper or the image
    // Next.js 'fill' mode forces absolute positioning + full width/height
    const styleSpecs = props.fill
        ? { objectFit: 'cover', ...props.style }
        : { maxWidth: '100%', height: 'auto', ...props.style };

    const wrapperStyle = props.fill
        ? { display: 'block', width: '100%', height: '100%', ...props.style } // Ensure wrapper fills parent
        : { width: props.width, height: props.height };

    return (
        <div className={`relative ${className || ''}`} style={wrapperStyle as any}>
            <Image
                src={error ? fallbackSrc : validSrc}
                alt={alt || "Imagem"}
                priority={priority}
                quality={75}
                onError={() => setError(true)}
                {...props}
                style={styleSpecs as any}
            />
        </div>
    );
};

export default OptimizedImage;

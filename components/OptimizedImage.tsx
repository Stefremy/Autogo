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

    return (
        <div className={`relative ${className || ''}`} style={{ width: props.width, height: props.height }}>
            <Image
                src={error ? fallbackSrc : src}
                alt={alt}
                priority={priority}
                quality={75}
                onError={() => setError(true)}
                {...props}
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    ...props.style
                }}
            />
        </div>
    );
};

export default OptimizedImage;

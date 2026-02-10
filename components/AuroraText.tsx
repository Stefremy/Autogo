"use client"

import React, { memo } from "react"

interface AuroraTextProps {
    children: React.ReactNode
    className?: string
    colors?: string[]
    speed?: number
}

export const AuroraText = memo(
    ({
        children,
        className = "",
        colors = ["#b42121", "#ff5f1f", "#fa8072"], // Red, Orange, Salmon
        speed = 1,
    }: AuroraTextProps) => {
        const gradientStyle = {
            backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]
                })`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animationDuration: `${10 / speed}s`,
            backgroundSize: "200% auto",
        } as React.CSSProperties

        return (
            <span className={`relative inline-block ${className}`}>
                <span className="sr-only">{children}</span>
                <span
                    className="animate-aurora relative bg-clip-text text-transparent"
                    style={gradientStyle}
                    aria-hidden="true"
                >
                    {children}
                </span>
            </span>
        )
    }
)

AuroraText.displayName = "AuroraText"

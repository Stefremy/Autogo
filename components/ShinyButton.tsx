"use client"

import React from "react"
import { motion, type MotionProps } from "framer-motion"
import { cn } from "../lib/utils"

const animationProps: MotionProps = {
    initial: { "--x": "100%", scale: 0.8 } as any,
    animate: { "--x": "-100%", scale: 1 } as any,
    whileTap: { scale: 0.95 },
    transition: {
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 1,
        type: "spring",
        stiffness: 20,
        damping: 15,
        mass: 2,
        scale: {
            type: "spring",
            stiffness: 200,
            damping: 5,
            mass: 0.5,
        },
    },
}

interface ShinyButtonProps
    extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>,
    MotionProps {
    children: React.ReactNode
    className?: string
}

export const ShinyButton = React.forwardRef<
    HTMLButtonElement,
    ShinyButtonProps
>(({ children, className, ...props }, ref) => {
    return (
        <motion.button
            ref={ref}
            className={cn(
                "relative cursor-pointer rounded-lg border px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow",
                "border-[#b42121]/30 bg-white text-[#b42121]", // White background and brand red text
                className
            )}
            {...animationProps}
            {...props}
        >
            <span
                className="relative block size-full text-sm tracking-wide text-[#b42121] uppercase font-bold"
                style={{
                    maskImage:
                        "linear-gradient(-75deg,#b42121 calc(var(--x) + 20%),transparent calc(var(--x) + 35%),#b42121 calc(var(--x) + 100%))",
                    WebkitMaskImage:
                        "linear-gradient(-75deg,#b42121 calc(var(--x) + 20%),transparent calc(var(--x) + 35%),#b42121 calc(var(--x) + 100%))",
                } as React.CSSProperties}
            >
                {children}
            </span>
            <span
                style={{
                    mask: "linear-gradient(#fff, #fff) content-box exclude, linear-gradient(#fff, #fff)",
                    WebkitMask:
                        "linear-gradient(#fff, #fff) content-box exclude, linear-gradient(#fff, #fff)",
                    backgroundImage:
                        "linear-gradient(-75deg,rgba(180,33,33,0.05) calc(var(--x)+20%),rgba(180,33,33,0.3) calc(var(--x)+25%),rgba(180,33,33,0.05) calc(var(--x)+100%))",
                } as React.CSSProperties}
                className="absolute inset-0 z-10 block rounded-[inherit] p-px"
            />
        </motion.button>
    )
})

ShinyButton.displayName = "ShinyButton"

"use client"

import React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../lib/utils"

export function InteractiveHoverButton({
    children,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                "group bg-white relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold transition-all duration-300",
                "border-[#b42121]/30 text-[#b42121]", // Brand red colors
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-2">
                {/* The dot that expands to cover the whole button */}
                <div className="bg-[#b42121] h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[120]"></div>
                <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
                    {children}
                </span>
            </div>

            {/* The content that reveals */}
            <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 text-white translate-x-12 group-hover:translate-x-0">
                <span>{children}</span>
                <ArrowRight className="w-4 h-4" />
            </div>
        </button>
    )
}

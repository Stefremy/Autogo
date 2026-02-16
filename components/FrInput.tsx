import React from "react";

interface FrInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function FrInput({ label, id, className, ...props }: FrInputProps) {
    return (
        <div className={`flex flex-col gap-1 ${className || ""}`}>
            <label htmlFor={id} className="font-semibold text-[#b42121]">
                {label}
            </label>
            <input
                id={id}
                className="rounded-xl border border-[#b42121]/20 px-4 py-2 focus:ring-2 focus:ring-[#b42121]/30 transition-all shadow-sm outline-none"
                {...props}
            />
        </div>
    );
}

import React from "react";
import { clsx } from "clsx";
import { ArrowRight } from "lucide-react";

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "icon";
    className?: string;
}

export default function RetroButton({
    children,
    variant = "primary",
    className,
    ...props
}: RetroButtonProps) {
    return (
        <button
            className={clsx(
                "relative group transition-transform active:translate-x-0.5 active:translate-y-0.5 outline-none",
                className
            )}
            {...props}
        >
            {/* Shadow Layer */}
            <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />

            {/* Button Content */}
            <div className={clsx(
                "relative border-2 border-black bg-[#FFFDF0] text-black font-bold uppercase tracking-wider flex items-center justify-center transition-colors hover:bg-[#FFF9C4]",
                variant === "primary" ? "px-8 py-3 text-sm gap-4" : "p-1.5"
            )}>
                {children}
                {variant === "primary" && (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                )}
            </div>
        </button>
    );
}

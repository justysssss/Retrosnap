"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";
import { BoardSettings } from "./types";

interface BoardFrameProps {
    children: ReactNode;
    settings: BoardSettings;
}

export default function BoardFrame({ children, settings }: BoardFrameProps) {
    const getBackgroundClass = () => {
        switch (settings.background) {
            case "felt-gray": return "bg-stone-700";
            case "felt-green": return "bg-emerald-800";
            case "cork":
            default: return "bg-[#e0c097]";
        }
    };

    const getFrameClass = () => {
        switch (settings.frame) {
            case "wood-light": return "border-[#deb887] bg-[#deb887]";
            case "metal": return "border-stone-400 bg-stone-300";
            case "wood-dark":
            default: return "border-[#5c4033] bg-[#5c4033]";
        }
    };

    return (
        <div className={clsx(
            "relative w-full min-h-[750px] rounded-xl shadow-2xl overflow-hidden border-[24px]",
            getFrameClass()
        )}>
            {/* Inner Frame Shadow */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />

            {/* Background Texture */}
            <div className={clsx("absolute inset-0", getBackgroundClass())}>
                {/* Grainy Texture Overlay */}
                <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} />

                {/* Cork Texture Overlay */}
                {settings.background === "cork" && (
                    <div className="absolute inset-0 opacity-60 mix-blend-multiply"
                        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cork-board.png')" }} />
                )}
                {/* Felt Texture Overlay */}
                {settings.background.startsWith("felt") && (
                    <div className="absolute inset-0 opacity-30"
                        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/felt.png')" }} />
                )}
            </div>

            {/* Content */}
            <div className="relative z-0 py-12">
                {children}
            </div>
        </div>
    );
}

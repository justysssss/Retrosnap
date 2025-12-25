"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";
import { BoardSettings } from "@/types/board";

interface BoardFrameProps {
  children: ReactNode;
  settings: BoardSettings;
}

export default function BoardFrame({ children, settings }: BoardFrameProps) {
  const getBackgroundClass = () => {
    switch (settings.background) {
      // Classic Textures
      case "felt-gray": return "bg-stone-700";
      case "felt-green": return "bg-emerald-800";
      case "cork": return "bg-[#e0c097]";

      // Modern / Minimalist
      case "white": return "bg-white";
      case "grid": return "bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]";
      case "dots": return "bg-stone-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px]";
      default: return "bg-[#e0c097]";
    }
  };

  const getFrameClass = () => {
    switch (settings.frame) {
      case "wood-light": return "border-[#deb887] bg-[#deb887]";
      case "metal": return "border-stone-400 bg-stone-300";
      case "wood-dark": return "border-[#5c4033] bg-[#5c4033]";
      case "none": return "border-0 shadow-none rounded-none"; // Modern look
      default: return "border-[#5c4033] bg-[#5c4033]";
    }
  };

  // Determine if we need specific overlay textures (only for classic styles)
  const isClassic = ["cork", "felt-gray", "felt-green"].includes(settings.background);

  return (
    <div className={clsx(
      "relative w-full min-h-[750px] overflow-hidden transition-all duration-300",
      settings.frame !== "none" && "rounded-xl shadow-2xl border-[24px]",
      getFrameClass()
    )}>
      {/* Inner Shadow (Only if framed) */}
      {settings.frame !== "none" && (
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />
      )}

      {/* Main Background Layer */}
      <div className={clsx("absolute inset-0", getBackgroundClass())}>

        {/* 1. Grainy Overlay (Adds realism to all) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: "url('[https://www.transparenttextures.com/patterns/stardust.png](https://www.transparenttextures.com/patterns/stardust.png)')" }} />

        {/* 2. Cork Texture */}
        {settings.background === "cork" && (
          <div className="absolute inset-0 opacity-60 mix-blend-multiply"
            style={{ backgroundImage: "url('[https://www.transparenttextures.com/patterns/cork-board.png](https://www.transparenttextures.com/patterns/cork-board.png)')" }} />
        )}

        {/* 3. Felt Texture */}
        {settings.background.startsWith("felt") && (
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "url('[https://www.transparenttextures.com/patterns/felt.png](https://www.transparenttextures.com/patterns/felt.png)')" }} />
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-0 py-12 h-full">
        {children}
      </div>
    </div>
  );
}

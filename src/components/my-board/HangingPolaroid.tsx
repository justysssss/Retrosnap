"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { Polaroid } from "@/types/studio";
import { useMemo } from "react";

interface HangingPolaroidProps {
    polaroid: Polaroid;
    rotation: number;
}

const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export default function HangingPolaroid({ polaroid, rotation }: HangingPolaroidProps) {
    const hoverRotation = useMemo(() => {
        const idSum = polaroid.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const random = pseudoRandom(idSum);
        return rotation + (random * 4 - 2);
    }, [rotation, polaroid.id]);

    return (
        <motion.div
            className="relative top-8 origin-top cursor-pointer group"
            style={{ rotate: rotation }}
            whileHover={{
                rotate: hoverRotation,
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 15 }
            }}
        >
            {/* The Wooden Clothespin */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-12 z-20 flex flex-col items-center">
                {/* Left Leg */}
                <div className="absolute left-0 top-0 w-1.5 h-10 bg-[#d4a373] rounded-sm shadow-sm transform -rotate-3 origin-bottom-left border-l border-[#b08050]" />
                {/* Right Leg */}
                <div className="absolute right-0 top-0 w-1.5 h-10 bg-[#d4a373] rounded-sm shadow-sm transform rotate-3 origin-bottom-right border-r border-[#b08050]" />

                {/* Metal Spring */}
                <div className="absolute top-4 w-5 h-3 bg-stone-400 rounded-sm shadow-sm z-10 border-t border-stone-300 flex items-center justify-center">
                    <div className="w-4 h-0.5 bg-stone-500/50" />
                </div>

                {/* Bottom Grip */}
                <div className="absolute bottom-0 w-3 h-3 bg-[#c69060] rounded-b-sm shadow-md" />
            </div>

            {/* The Polaroid */}
            <div className="relative bg-white p-3 pb-12 shadow-lg w-40 transition-shadow group-hover:shadow-2xl transform origin-top">
                <div className="aspect-square bg-stone-100 overflow-hidden mb-3 relative">
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] z-10 pointer-events-none" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={polaroid.imageSrc}
                        alt={polaroid.caption || "Polaroid"}
                        className={clsx("w-full h-full object-cover", polaroid.filter)}
                    />
                </div>
                {polaroid.caption && (
                    <div className="text-center px-1">
                        <p className="font-handwriting text-xl text-stone-800 leading-tight break-all">
                            {polaroid.caption}
                        </p>
                    </div>
                )}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 pointer-events-none" />
            </div>
        </motion.div>
    );
}

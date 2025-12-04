"use client";

import { Polaroid } from "@/types/studio";
import HangingPolaroid from "./HangingPolaroid";
import { clsx } from "clsx";
import { useMemo } from "react";

interface WireRowProps {
    polaroids: Polaroid[];
    rowIndex: number;
    isStaggered?: boolean;
}

const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export default function WireRow({ polaroids, isStaggered }: WireRowProps) {
    const rotations = useMemo(() => {
        return polaroids.map((p, index) => {
            const idSum = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const random = pseudoRandom(idSum + index);
            return (index % 2 === 0 ? 1 : -1) * (random * 4 + 2);
        });
    }, [polaroids]);

    return (
        <div className="relative w-full h-72 flex items-center px-12">
            {/* The Hanging Rope */}
            <div className="absolute left-0 right-0 top-8 h-16 pointer-events-none z-10">
                <svg width="100%" height="100%" viewBox="0 0 1000 40" preserveAspectRatio="none" className="overflow-visible">
                    {/* Main Rope */}
                    <path
                        d="M0,0 Q500,30 1000,0"
                        fill="none"
                        stroke="#8b5a2b"
                        strokeWidth="3"
                        vectorEffect="non-scaling-stroke"
                        className="drop-shadow-md"
                    />
                    {/* Rope Texture Details */}
                    <path
                        d="M0,0 Q500,30 1000,0"
                        fill="none"
                        stroke="#a07040"
                        strokeWidth="1"
                        strokeDasharray="4 2"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            </div>

            {/* Polaroids on this wire */}
            <div className={clsx(
                "relative w-full h-full flex items-start pt-8",
                isStaggered ? "justify-center gap-16 pl-32" : "justify-center gap-16 pr-32"
            )}>
                {polaroids.map((polaroid, index) => (
                    <div key={polaroid.id} className="relative">
                        <HangingPolaroid
                            polaroid={polaroid}
                            rotation={rotations[index] || 0}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

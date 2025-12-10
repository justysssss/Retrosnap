"use client";

import { Polaroid } from "@/types/studio";
import HangingPolaroid from "./HangingPolaroid";
import { clsx } from "clsx";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface WireRowProps {
    polaroids: Polaroid[];
    rowIndex: number;
    isStaggered?: boolean;
    wireColor?: string;
    clipColor?: string;
    clipVariant?: "wood" | "metal" | "plastic";
    onDelete?: (id: string) => void;
    isDraggable?: boolean;
    onPolaroidMove?: (polaroidId: string, newSlotIndex: number, rowIndex: number) => void;
}

const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export default function WireRow({
    polaroids,
    rowIndex,
    isStaggered,
    wireColor = "#8b5a2b",
    clipColor,
    clipVariant,
    onDelete,
    isDraggable = false,
    onPolaroidMove
}: WireRowProps) {
    const [draggedPolaroid, setDraggedPolaroid] = useState<string | null>(null);
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

    const rotations = useMemo(() => {
        return polaroids.map((p, index) => {
            const idSum = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const random = pseudoRandom(idSum + index);
            return (index % 2 === 0 ? 1 : -1) * (random * 4 + 2);
        });
    }, [polaroids]);

    // Create 4 slots per row
    const slots = Array(4).fill(null).map((_, index) => {
        return polaroids[index] || null;
    });

    return (
        <div className="relative w-full h-72 flex items-center px-12">
            {/* The Hanging Rope */}
            <div className="absolute left-0 right-0 top-8 h-16 pointer-events-none z-10">
                <svg width="100%" height="100%" viewBox="0 0 1000 40" preserveAspectRatio="none" className="overflow-visible">
                    {/* Main Rope */}
                    <path
                        d="M0,0 Q500,30 1000,0"
                        fill="none"
                        stroke={wireColor}
                        strokeWidth="3"
                        vectorEffect="non-scaling-stroke"
                        className="drop-shadow-md"
                    />
                    {/* Rope Texture Details */}
                    <path
                        d="M0,0 Q500,30 1000,0"
                        fill="none"
                        stroke={wireColor}
                        strokeWidth="1"
                        strokeDasharray="4 2"
                        vectorEffect="non-scaling-stroke"
                        className="brightness-125"
                    />
                </svg>
            </div>

            {/* Polaroids on this wire */}
            <div className={clsx(
                "relative w-full h-full flex items-start pt-8",
                isStaggered ? "justify-center gap-16 pl-32" : "justify-center gap-16 pr-32"
            )}>
                {slots.map((polaroid, slotIndex) => {
                    const variant = clipVariant || (() => {
                        if (!polaroid) return "wood";
                        const idSum = polaroid.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        const variantIndex = (idSum + slotIndex) % 3;
                        return ["wood", "metal", "plastic"][variantIndex] as "wood" | "metal" | "plastic";
                    })();

                    return (
                        <motion.div
                            key={`slot-${rowIndex}-${slotIndex}`}
                            className={clsx(
                                "relative w-40 h-full",
                                !polaroid && isDraggable && "border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-lg",
                                hoveredSlot === slotIndex && !polaroid && "border-blue-400 bg-blue-50/20"
                            )}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setHoveredSlot(slotIndex);
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                setHoveredSlot(null);
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (draggedPolaroid && onPolaroidMove) {
                                    onPolaroidMove(draggedPolaroid, slotIndex, rowIndex);
                                }
                                setDraggedPolaroid(null);
                                setHoveredSlot(null);
                            }}
                            animate={{
                                scale: hoveredSlot === slotIndex && draggedPolaroid && !polaroid ? 1.05 : 1
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            {polaroid ? (
                                <HangingPolaroid
                                    key={polaroid.id}
                                    polaroid={polaroid}
                                    rotation={rotations[slotIndex] || 0}
                                    clipColor={clipColor}
                                    clipVariant={variant}
                                    onDelete={onDelete}
                                    isDraggable={isDraggable}
                                    onDragStart={() => setDraggedPolaroid(polaroid.id)}
                                    onDragEnd={() => {
                                        setDraggedPolaroid(null);
                                        setHoveredSlot(null);
                                    }}
                                />
                            ) : isDraggable && (
                                <div className="flex items-center justify-center h-full text-stone-400 text-sm">
                                    Drop here
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

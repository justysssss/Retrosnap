"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { Polaroid } from "@/types/studio";
import { useMemo, useState, useRef } from "react";
import { Trash2 } from "lucide-react";

interface HangingPolaroidProps {
    polaroid: Polaroid;
    rotation: number;
    clipColor?: string;
    clipVariant?: "wood" | "metal" | "plastic";
    onDelete?: (id: string) => void;
    isDraggable?: boolean;
    onDragStart?: (id: string) => void;
    onDragEnd?: () => void;
}

const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export default function HangingPolaroid({
    polaroid,
    rotation,
    clipColor = "#d4a373",
    clipVariant = "wood",
    onDelete,
    isDraggable = false,
    onDragStart,
    onDragEnd
}: HangingPolaroidProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const hoverRotation = useMemo(() => {
        const idSum = polaroid.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const random = pseudoRandom(idSum);
        return rotation + (random * 4 - 2);
    }, [rotation, polaroid.id]);

    const handleDoubleClick = (e: React.MouseEvent) => {
        if (isDragging) return; // Prevent action while dragging
        e.stopPropagation();
        // Clear any pending single click
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
        }
        // Toggle flip
        setIsFlipped(!isFlipped);
    };

    const handleDelete = (e: React.MouseEvent) => {
        if (isDragging) return; // Prevent action while dragging
        e.stopPropagation();
        if (confirm("Delete this memory?")) {
            onDelete?.(polaroid.id);
        }
    };

    const handleDragStart = () => {
        setIsDragging(true);
        onDragStart?.(polaroid.id);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        onDragEnd?.();
    };

    return (
        <motion.div
            className="relative top-8 origin-top cursor-pointer group"
            style={{ rotate: rotation, perspective: "1000px" }}
            drag={isDraggable}
            dragMomentum={false}
            dragElastic={0.1}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            whileHover={!isDragging ? {
                rotate: hoverRotation,
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 15 }
            } : {}}
            whileDrag={{
                scale: 1.1,
                rotate: 0,
                zIndex: 100,
                cursor: "grabbing"
            }}
            animate={{
                x: 0,
                y: 0
            }}
            onDoubleClick={handleDoubleClick}
        >
            {/* The Clip */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-12 z-20 flex flex-col items-center">
                {clipVariant === "wood" && (
                    <>
                        {/* Left Leg */}
                        <div className="absolute left-0 top-0 w-1.5 h-10 rounded-sm shadow-sm transform -rotate-3 origin-bottom-left border-l border-black/20" style={{ backgroundColor: clipColor }} />
                        {/* Right Leg */}
                        <div className="absolute right-0 top-0 w-1.5 h-10 rounded-sm shadow-sm transform rotate-3 origin-bottom-right border-r border-black/20" style={{ backgroundColor: clipColor }} />
                        {/* Metal Spring */}
                        <div className="absolute top-4 w-5 h-3 bg-stone-400 rounded-sm shadow-sm z-10 border-t border-stone-300 flex items-center justify-center">
                            <div className="w-4 h-0.5 bg-stone-500/50" />
                        </div>
                        {/* Bottom Grip */}
                        <div className="absolute bottom-0 w-3 h-3 rounded-b-sm shadow-md" style={{ backgroundColor: clipColor, filter: 'brightness(0.9)' }} />
                    </>
                )}

                {clipVariant === "metal" && (
                    <div className="relative w-6 h-8 -top-2">
                        {/* Binder Clip Body */}
                        <div className="absolute bottom-0 w-full h-5 bg-stone-800 rounded-sm shadow-md border-t border-stone-600" />
                        {/* Handles */}
                        <div className="absolute -top-3 left-0.5 w-0.5 h-6 bg-stone-300 rotate-12 origin-bottom" />
                        <div className="absolute -top-3 right-0.5 w-0.5 h-6 bg-stone-300 -rotate-12 origin-bottom" />
                    </div>
                )}

                {clipVariant === "plastic" && (
                    <div className="relative w-5 h-8 bg-red-500 rounded-full shadow-md border-2 border-red-600 flex items-center justify-center -top-2" style={{ backgroundColor: clipColor }}>
                        <div className="w-2 h-2 bg-white/30 rounded-full mb-4" />
                    </div>
                )}
            </div>

            {/* The Polaroid with Flip Animation */}
            <motion.div
                className="relative bg-white p-3 pb-12 shadow-lg w-40 transition-shadow group-hover:shadow-2xl transform origin-top"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front Side */}
                <div
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                    }}
                >
                    {/* Delete button - top right corner of polaroid */}
                    {onDelete && !isFlipped && (
                        <button
                            onClick={handleDelete}
                            className="absolute top-2 right-2 z-20 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete memory"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}

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

                {/* Back Side */}
                <div
                    className="absolute inset-0 bg-[#1a1a1a] p-3 flex items-center justify-center"
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    <div className="w-full h-full border-2 border-stone-700/50 border-dashed rounded-lg p-4 flex items-center justify-center">
                        {polaroid.secretMessage ? (
                            <p className="text-stone-200 font-handwriting text-lg text-center break-words">
                                {polaroid.secretMessage}
                            </p>
                        ) : (
                            <p className="text-stone-500 font-handwriting text-sm italic text-center">
                                No secret message...
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

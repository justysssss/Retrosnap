"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { Polaroid } from "@/types/studio";
import { RefObject, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toPng } from "html-to-image";

interface DraggablePolaroidProps {
    polaroid: Polaroid;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<Polaroid>) => void;
    onDelete: () => void;
    containerRef: RefObject<HTMLDivElement | null>;
}

export default function DraggablePolaroid({
    polaroid,
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    containerRef,
}: DraggablePolaroidProps) {
    const polaroidRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (polaroidRef.current) {
            try {
                const dataUrl = await toPng(polaroidRef.current, { quality: 0.95, pixelRatio: 2 });
                const link = document.createElement("a");
                link.download = `retrosnap-${polaroid.id}.png`;
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error("Failed to download polaroid", err);
            }
        }
    };

    useEffect(() => {
        if (polaroid.downloadTrigger) {
            handleDownload();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [polaroid.downloadTrigger]);

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragConstraints={containerRef}
            initial={{ x: polaroid.x, y: polaroid.y, scale: 0.5, opacity: 0, rotate: polaroid.rotation }}
            animate={{
                scale: isSelected ? 1.1 : 1,
                opacity: 1,
                rotate: polaroid.rotation,
                zIndex: isSelected ? 50 : 10,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                onUpdate({ isFlipped: !polaroid.isFlipped });
            }}
            className="absolute w-64 h-80 cursor-grab active:cursor-grabbing"
            style={{ perspective: "1000px" }}
        >
            <motion.div
                ref={polaroidRef}
                className="w-full h-full relative shadow-xl bg-white"
                animate={{ rotateY: polaroid.isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Delete Button (Visible on Hover/Select) */}
                {isSelected && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="absolute -top-3 -right-3 z-50 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                        title="Delete Polaroid"
                        style={{ transform: "translateZ(20px)" }} // Ensure it floats above
                    >
                        <Trash2 size={16} />
                    </button>
                )}

                {/* Front Side */}
                <div
                    className="absolute inset-0 bg-white p-3 pb-12 flex flex-col"
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                    <div className="aspect-square bg-stone-100 overflow-hidden mb-3 relative">
                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] z-10 pointer-events-none" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={polaroid.imageSrc}
                            alt="Polaroid"
                            className={clsx("w-full h-full object-cover", polaroid.filter)}
                        />
                    </div>
                    <div className="flex-1 flex items-center justify-center text-center px-2">
                        <p className="font-handwriting text-2xl text-stone-800 leading-tight break-words w-full">
                            {polaroid.caption}
                        </p>
                    </div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-20 pointer-events-none mix-blend-multiply" />
                </div>

                {/* Back Side */}
                <div
                    className="absolute inset-0 bg-[#1a1a1a] p-6 flex flex-col items-center justify-center text-center"
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    {/* Add to Public Pinboard Button (Visual Only for now) */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full shadow-md transform -rotate-2 whitespace-nowrap z-20">
                        <span className="font-marker text-sm">Add to Public Pinboard</span>
                    </div>

                    <div className="w-full h-full border-2 border-stone-700/50 border-dashed rounded-lg p-4 flex items-center justify-center relative">
                        <textarea
                            value={polaroid.secretMessage}
                            onChange={(e) => onUpdate({ secretMessage: e.target.value })}
                            placeholder="Write a secret message..."
                            className="w-full h-full bg-transparent resize-none border-none focus:ring-0 text-stone-200 font-handwriting text-2xl text-center placeholder:text-stone-600"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Flip Icon Hint */}
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 bg-stone-700 rounded-full p-1 opacity-50">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-stone-600 font-mono uppercase tracking-widest">
                        RetroSnap Film
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

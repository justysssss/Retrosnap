"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface FlippablePolaroidProps {
    post: {
        id: string;
        image: {
            thumbnailUrl: string;
            fullUrl?: string;
        };
        message?: string;
        secretMessage?: string;
    };
    onClick?: () => void;
}

export default function FlippablePolaroid({ post, onClick }: FlippablePolaroidProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Clear any pending single click
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
        }
        setIsFlipped(!isFlipped);
    };

    const handleSingleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Don't open modal if already flipped
        if (isFlipped) return;

        // Wait 250ms to see if it's a double-click
        clickTimeoutRef.current = setTimeout(() => {
            if (onClick) {
                onClick();
            }
            clickTimeoutRef.current = null;
        }, 250);
    };

    return (
        <div
            className="cursor-pointer group relative w-full max-w-60 sm:max-w-[256px] lg:max-w-[280px]"
            onClick={handleSingleClick}
            onDoubleClick={handleDoubleClick}
            style={{ perspective: "1000px" }}
        >
            {/* Pushpin SVG - positioned at top of polaroid frame */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-8 h-8 pointer-events-none">
                <Image
                    src="/pushpin.svg"
                    alt="pin"
                    width={32}
                    height={32}
                    className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
                />
            </div>

            {/* Polaroid Frame with Flip Animation */}
            <motion.div
                className="w-full aspect-[4/5] relative"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front Side */}
                <div
                    className="absolute inset-0 bg-white p-3 pb-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rotate-1 group-hover:rotate-0 transition-all duration-300 border border-stone-100 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] group-hover:scale-[1.02] overflow-hidden"
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                    }}
                >
                    {/* Paper Texture Overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 pointer-events-none z-10" />

                    {/* Image - square aspect ratio matching studio */}
                    <div className="aspect-square bg-stone-100 overflow-hidden relative z-0 mb-3">
                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] z-10 pointer-events-none" />
                        <Image
                            src={post.image.thumbnailUrl}
                            alt={post.message || "Post"}
                            fill
                            className="object-cover"
                            loading="lazy"
                        />
                    </div>

                    {/* Caption area - only show if message exists */}
                    {post.message && (
                        <div className="flex-1 flex items-center justify-center px-2">
                            <p className="font-handwriting text-2xl text-center text-stone-800 leading-tight wrap-break-word w-full line-clamp-2">
                                {post.message}
                            </p>
                        </div>
                    )}
                </div>

                {/* Back Side */}
                <div
                    className="absolute inset-0 bg-[#1a1a1a] p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-stone-800"
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    <div className="w-full max-h-[70%] border-2 border-stone-700/50 border-dashed rounded-lg p-3 flex items-center justify-center overflow-y-auto">
                        {post.secretMessage ? (
                            <p className="text-stone-200 font-handwriting text-base sm:text-lg leading-relaxed wrap-break-word">
                                {post.secretMessage}
                            </p>
                        ) : (
                            <p className="text-stone-500 font-handwriting text-sm sm:text-base italic">
                                No secret message...
                            </p>
                        )}
                    </div>

                    {/* Hint text */}
                    <p className="text-stone-600 text-xs mt-2 italic">Double-click to flip back</p>
                </div>
            </motion.div>
        </div>
    );
}

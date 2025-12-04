"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import Image from "next/image";

// Define types for your decorations
export type DecorationType = "sticker" | "lottie" | "emoji";

export interface DecorationItem {
    id: string;
    type: DecorationType;
    src: string; // URL for image or JSON path for lottie
    x: number;
    y: number;
    scale: number;
}

interface DraggableDecorationProps {
    item: DecorationItem;
    isEditMode: boolean;
    onUpdate: (id: string, x: number, y: number, scale?: number) => void;
    onDelete: (id: string) => void;
}

export default function DraggableDecoration({ item, isEditMode, onUpdate, onDelete }: DraggableDecorationProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [position, setPosition] = useState({ x: item.x, y: item.y });
    const [scale, setScale] = useState(item.scale);
    const ref = useRef<HTMLDivElement>(null);
    const emojiRef = useRef<HTMLSpanElement>(null);
    const startResizePos = useRef({ x: 0, y: 0 });
    const startScale = useRef(1);

    // Update styles imperatively to avoid lint errors
    useEffect(() => {
        if (ref.current) {
            ref.current.style.left = `${position.x}px`;
            ref.current.style.top = `${position.y}px`;
            ref.current.style.width = `${150 * scale}px`;
            ref.current.style.height = `${150 * scale}px`;
        }
        if (emojiRef.current) {
            emojiRef.current.style.fontSize = `${100 * scale}px`;
        }
    }, [position.x, position.y, scale]);

    // Handle Dragging and Resizing Logic
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                // Calculate new position relative to parent
                const parent = ref.current?.offsetParent as HTMLElement;
                if (parent) {
                    const rect = parent.getBoundingClientRect();
                    const x = e.clientX - rect.left - (ref.current?.offsetWidth || 0) / 2;
                    const y = e.clientY - rect.top - (ref.current?.offsetHeight || 0) / 2;
                    setPosition({ x, y });
                }
            } else if (isResizing) {
                const deltaX = e.clientX - startResizePos.current.x;
                // Sensitivity factor
                const newScale = Math.max(0.5, Math.min(3, startScale.current + deltaX * 0.01));
                setScale(newScale);
            }
        };

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                onUpdate(item.id, position.x, position.y, scale);
            }
            if (isResizing) {
                setIsResizing(false);
                onUpdate(item.id, position.x, position.y, scale);
            }
        };

        if (isDragging || isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, isResizing, item.id, onUpdate, position.x, position.y, scale]);

    return (
        <div
            ref={ref}
            className={`absolute z-20 ${isEditMode ? "group" : ""}`}
            onMouseDown={(e) => {
                if (!isEditMode) return;
                e.preventDefault(); // Prevent text selection
                setIsDragging(true);
            }}
        >
            {isEditMode && (
                <>
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-lg pointer-events-none" />
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete decoration"
                    >
                        <X size={12} />
                    </button>
                    {/* Resize Handle */}
                    <div
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsResizing(true);
                            startResizePos.current = { x: e.clientX, y: e.clientY };
                            startScale.current = scale;
                        }}
                    />
                </>
            )}

            {item.type === "lottie" ? (
                <dotlottie-player
                    src={item.src}
                    background="transparent"
                    speed="1"
                    className="w-full h-full"
                    loop
                    autoplay
                />
            ) : item.type === "emoji" ? (
                <div className="w-full h-full flex items-center justify-center">
                    <span ref={emojiRef} className="text-[80px] leading-none select-none cursor-default">{item.src}</span>
                </div>
            ) : (
                <div className="relative w-full h-full">
                    <Image
                        src={item.src}
                        alt="decoration"
                        fill
                        className="object-contain drop-shadow-md"
                    />
                </div>
            )}
        </div>
    );
}

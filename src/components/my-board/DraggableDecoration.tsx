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

    // Refs for drag/resize calculations
    const dragStart = useRef({ mouseX: 0, mouseY: 0, itemX: 0, itemY: 0 });
    const resizeStart = useRef<{ mouseX: number; startScale: number }>({ mouseX: 0, startScale: 1 });

    // Update imperatively
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

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const parent = ref.current?.offsetParent as HTMLElement;
                if (!parent) return;

                const rect = parent.getBoundingClientRect();
                // Calculate scale of the parent (in case of zoom/transforms)
                const scaleX = parent.offsetWidth > 0 ? rect.width / parent.offsetWidth : 1;
                const scaleY = parent.offsetHeight > 0 ? rect.height / parent.offsetHeight : 1;

                const deltaX = (e.clientX - dragStart.current.mouseX) / scaleX;
                const deltaY = (e.clientY - dragStart.current.mouseY) / scaleY;

                setPosition({
                    x: dragStart.current.itemX + deltaX,
                    y: dragStart.current.itemY + deltaY
                });
            }
            // Note: Resizing is handled in handleResizeMove below
        };

        const handleResizeMove = (e: MouseEvent) => {
            if (isResizing) {
                const deltaX = e.clientX - resizeStart.current.mouseX;
                // Use a factor that feels right. 
                // If the user moves mouse 100px, maybe we want scale to increase by 1.
                // 150px * 1 = 150px.
                const currentScale = resizeStart.current.startScale;
                const newScale = Math.max(0.5, Math.min(3, currentScale + deltaX * 0.01));
                setScale(newScale);
            }
        }

        const handleMouseUp = () => {
            if (isDragging || isResizing) {
                setIsDragging(false);
                setIsResizing(false);
                onUpdate(item.id, position.x, position.y, scale);
            }
        };

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        if (isResizing) {
            window.addEventListener("mousemove", handleResizeMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousemove", handleResizeMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, isResizing, item.id, onUpdate, position.x, position.y, scale]); // dependency on scale/pos might causes re-bind, but refs handle the start values.

    return (
        <div
            ref={ref}
            className={`absolute z-20 ${isEditMode ? "cursor-move" : ""}`}
            onMouseDown={(e) => {
                if (!isEditMode) return;
                e.preventDefault();
                e.stopPropagation(); // Stop bubbling to board
                setIsDragging(true);
                dragStart.current = {
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                    itemX: position.x,
                    itemY: position.y
                };
            }}
        >
            {isEditMode && (
                <>
                    {/* Border - Always visible in edit mode */}
                    <div className="absolute inset-0 border-2 border-blue-400 border-dashed rounded-lg pointer-events-none" />

                    {/* Delete Button - Always visible in edit mode */}
                    <button
                        onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                        }}
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 z-30 flex items-center justify-center transition-transform hover:scale-110"
                        aria-label="Delete decoration"
                    >
                        <X size={14} />
                    </button>

                    {/* Resize Handle - Always visible in edit mode */}
                    <div
                        className="absolute -bottom-2 -right-2 w-5 h-5 bg-blue-500 border-2 border-white rounded-full cursor-se-resize z-30 shadow-sm"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsResizing(true);
                            setIsDragging(false); // Ensure we don't drag
                            resizeStart.current = {
                                mouseX: e.clientX,
                                startScale: scale
                            };
                        }}
                    />
                </>
            )}

            {/* Content with pointer-events-none to prevent interference, or handle carefully */}
            <div className={`w-full h-full ${isEditMode ? 'pointer-events-none' : ''}`}>
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
                            draggable={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

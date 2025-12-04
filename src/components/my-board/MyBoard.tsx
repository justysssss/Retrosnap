"use client";

import { useState, useEffect } from "react";
import { Polaroid } from "@/types/studio";
import BoardFrame from "./BoardFrame";
import WireRow from "./WireRow";
import { BoardSettings } from "./types";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoardControls from "./BoardControls";
import DraggableDecoration, { DecorationItem } from "./DraggableDecoration";

// Mock data generator
const generateMockPolaroids = (count: number): Polaroid[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `mock-${i}`,
        imageSrc: `https://picsum.photos/seed/${i + 123}/400/400`,
        x: 0, y: 0, rotation: 0,
        caption: `Memory #${i + 1}`,
        filter: "none",
        isFlipped: false,
        secretMessage: "",
        timestamp: Date.now(),
    }));
};

export default function MyBoard() {
    const [polaroids, setPolaroids] = useState<Polaroid[]>([]);
    const [settings, setSettings] = useState<BoardSettings>({
        background: "cork",
        frame: "wood-dark"
    });
    const [mounted, setMounted] = useState(false);

    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);
    const [wireColor, setWireColor] = useState("#8b5a2b");
    const [clipColor, setClipColor] = useState("#d4a373");
    const [decorations, setDecorations] = useState<DecorationItem[]>([]);

    useEffect(() => {
        // Load settings
        const savedBg = localStorage.getItem("board-background") as BoardSettings["background"];
        const savedFrame = localStorage.getItem("board-frame") as BoardSettings["frame"];

        // Load dotlottie player script
        const scriptId = "dotlottie-player-script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
            script.type = "module";
            document.body.appendChild(script);
        }

        setTimeout(() => {
            setMounted(true);
            if (savedBg || savedFrame) {
                setSettings(prev => ({
                    ...prev,
                    ...(savedBg && { background: savedBg }),
                    ...(savedFrame && { frame: savedFrame })
                }));
            }

            // Load polaroids (mock for now)
            setPolaroids(generateMockPolaroids(8));
        }, 0);
    }, []);

    const addDecoration = (type: "sticker" | "lottie" | "emoji", src: string) => {
        const newItem: DecorationItem = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            src,
            x: 100, // Default position
            y: 100,
            scale: 1
        };
        setDecorations([...decorations, newItem]);
    };

    const updateDecoration = (id: string, x: number, y: number, scale?: number) => {
        setDecorations(prev => prev.map(item => item.id === id ? { ...item, x, y, ...(scale && { scale }) } : item));
    };

    const deleteDecoration = (id: string) => {
        setDecorations(prev => prev.filter(item => item.id !== id));
    };

    // Group polaroids into rows of 4
    const rows = [];
    for (let i = 0; i < polaroids.length; i += 4) {
        rows.push(polaroids.slice(i, i + 4));
    }

    if (!mounted) return null;

    return (
        <div className="w-full max-w-[1400px] mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-marker text-stone-800 dark:text-stone-200">
                    {isEditMode ? "Editing Board..." : "My Private Board"}
                </h1>
                <div className="flex gap-3">
                    {!isEditMode && (
                        <Button
                            variant="outline"
                            onClick={() => setIsEditMode(true)}
                            className="gap-2"
                        >
                            <Settings size={18} />
                            Edit Board
                        </Button>
                    )}
                </div>
            </div>

            <div className="relative">
                <BoardControls
                    isOpen={isEditMode}
                    onClose={() => setIsEditMode(false)}
                    onAddDecoration={addDecoration}
                    wireColor={wireColor}
                    setWireColor={setWireColor}
                    clipColor={clipColor}
                    setClipColor={setClipColor}
                    onSave={() => setIsEditMode(false)}
                />

                <BoardFrame settings={settings}>
                    {/* Decorations Layer */}
                    {decorations.map(item => (
                        <DraggableDecoration
                            key={item.id}
                            item={item}
                            isEditMode={isEditMode}
                            onUpdate={updateDecoration}
                            onDelete={deleteDecoration}
                        />
                    ))}

                    {rows.map((rowPolaroids, index) => (
                        <WireRow
                            key={index}
                            polaroids={rowPolaroids}
                            rowIndex={index}
                            isStaggered={index % 2 !== 0}
                            wireColor={wireColor}
                            clipColor={clipColor}
                        />
                    ))}
                </BoardFrame>
            </div>
        </div>
    );
}

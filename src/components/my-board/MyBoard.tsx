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
import UploadToPrivateBoard from "./UploadToPrivateBoard";
import { deletePost } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface MyBoardProps {
    initialPolaroids?: Polaroid[];
}

export default function MyBoard({ initialPolaroids = [] }: MyBoardProps) {
    const router = useRouter();
    const [polaroids, setPolaroids] = useState<Polaroid[]>(initialPolaroids);
    const [settings, setSettings] = useState<BoardSettings>({
        background: "cork",
        frame: "wood-dark"
    });
    const [mounted, setMounted] = useState(false);

    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);
    const [wireColor, setWireColor] = useState("#8b5a2b");
    const [clipColor, setClipColor] = useState("#d4a373");
    const [clipVariant, setClipVariant] = useState<"wood" | "metal" | "plastic">("wood");
    const [decorations, setDecorations] = useState<DecorationItem[]>([]);

    useEffect(() => {
        // Sync with server data
        setPolaroids(initialPolaroids);
    }, [initialPolaroids]);

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

    const handleDeletePolaroid = async (id: string) => {
        try {
            const result = await deletePost(id);
            if (result.error) {
                alert(result.error);
                return;
            }
            // Optimistically remove from UI
            setPolaroids(prev => prev.filter(p => p.id !== id));
            // Refresh from server
            router.refresh();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete");
        }
    };

    const handleUploadSuccess = () => {
        // Refresh data from server
        router.refresh();
    };

    const handlePolaroidMove = (polaroidId: string, newSlotIndex: number, newRowIndex: number) => {
        setPolaroids(prevPolaroids => {
            const newGlobalIndex = newRowIndex * 4 + newSlotIndex;

            // Find current index of dragged polaroid
            const currentIndex = prevPolaroids.findIndex(p => p.id === polaroidId);
            if (currentIndex === -1) return prevPolaroids;

            // Don't move if dropping in same position
            if (currentIndex === newGlobalIndex) return prevPolaroids;

            // Create a copy of the array
            const result = [...prevPolaroids];

            // If target slot has a polaroid, swap them
            if (result[newGlobalIndex]) {
                // Swap positions
                [result[currentIndex], result[newGlobalIndex]] = [result[newGlobalIndex], result[currentIndex]];
            } else {
                // Move to empty slot
                const [movedItem] = result.splice(currentIndex, 1);
                result.splice(newGlobalIndex, 0, movedItem);
            }

            return result;
        });
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
                    <UploadToPrivateBoard onSuccess={handleUploadSuccess} />
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
                    clipVariant={clipVariant}
                    setClipVariant={setClipVariant}
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
                            clipVariant={clipVariant}
                            onDelete={isEditMode ? handleDeletePolaroid : undefined}
                            isDraggable={isEditMode}
                            onPolaroidMove={handlePolaroidMove}
                        />
                    ))}
                </BoardFrame>
            </div>
        </div>
    );
}

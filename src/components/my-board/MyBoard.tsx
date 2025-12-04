"use client";

import { useState, useEffect } from "react";
import { Polaroid } from "@/types/studio";
import BoardFrame from "./BoardFrame";
import WireRow from "./WireRow";
import { BoardSettings } from "./types";

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

    useEffect(() => {
        // Load settings
        const savedBg = localStorage.getItem("board-background") as BoardSettings["background"];
        const savedFrame = localStorage.getItem("board-frame") as BoardSettings["frame"];

        setTimeout(() => {
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

    // Group polaroids into rows of 4
    const rows = [];
    for (let i = 0; i < polaroids.length; i += 4) {
        rows.push(polaroids.slice(i, i + 4));
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto p-8">
            <BoardFrame settings={settings}>
                {rows.map((rowPolaroids, index) => (
                    <WireRow
                        key={index}
                        polaroids={rowPolaroids}
                        rowIndex={index}
                        isStaggered={index % 2 !== 0}
                    />
                ))}
            </BoardFrame>
        </div>
    );
}

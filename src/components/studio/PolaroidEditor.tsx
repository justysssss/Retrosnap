"use client";

import { Wand2, RotateCw, MessageSquare, Type, Download } from "lucide-react";
import { clsx } from "clsx";
import { Polaroid } from "@/app/studio/page";

interface PolaroidEditorProps {
    polaroid: Polaroid;
    onUpdate: (updates: Partial<Polaroid>) => void;
}

const FILTERS = [
    { name: "Normal", class: "none" },
    { name: "Grayscale", class: "grayscale" },
    { name: "Sepia", class: "sepia" },
    { name: "Vintage", class: "sepia-[.5] contrast-[1.2] brightness-[1.1] saturate-[1.2]" },
    { name: "Fade", class: "brightness-[1.1] contrast-[.9] saturate-[.8] sepia-[.2]" },
];

export default function PolaroidEditor({ polaroid, onUpdate }: PolaroidEditorProps) {
    return (
        <div className="space-y-8">
            {/* Filters */}
            <div>
                <h3 className="text-xl font-marker mb-4 flex items-center gap-2 text-stone-800">
                    <Wand2 className="w-5 h-5" />
                    Filters
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.name}
                            onClick={() => onUpdate({ filter: filter.class })}
                            className={clsx(
                                "px-3 py-2 rounded-lg text-sm font-bold transition-all",
                                polaroid.filter === filter.class
                                    ? "bg-stone-800 text-white shadow-md transform scale-105"
                                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            )}
                        >
                            {filter.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Caption */}
            <div>
                <h3 className="text-xl font-marker mb-4 flex items-center gap-2 text-stone-800">
                    <Type className="w-5 h-5" />
                    Caption
                </h3>
                <input
                    type="text"
                    value={polaroid.caption}
                    onChange={(e) => onUpdate({ caption: e.target.value })}
                    placeholder="Write a memory..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-stone-200 focus:border-stone-800 focus:outline-none font-handwriting text-2xl bg-transparent"
                    maxLength={40}
                />
            </div>

            {/* Secret Message */}
            <div>
                <h3 className="text-xl font-marker mb-4 flex items-center gap-2 text-stone-800">
                    <MessageSquare className="w-5 h-5" />
                    Secret Message
                </h3>
                <textarea
                    value={polaroid.secretMessage}
                    onChange={(e) => onUpdate({ secretMessage: e.target.value })}
                    placeholder="Something for the back..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-stone-200 focus:border-stone-800 focus:outline-none font-handwriting text-xl bg-transparent min-h-[100px] resize-none"
                    maxLength={100}
                />
                <p className="text-xs text-stone-400 mt-2 text-right">
                    {polaroid.secretMessage.length}/100
                </p>
            </div>

            {/* Flip Control */}
            <div className="space-y-3">
                <button
                    onClick={() => onUpdate({ isFlipped: !polaroid.isFlipped })}
                    className={clsx(
                        "w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all",
                        polaroid.isFlipped
                            ? "bg-stone-800 text-white shadow-md"
                            : "bg-white border-2 border-stone-200 text-stone-600 hover:bg-stone-50"
                    )}
                >
                    <RotateCw className={clsx("w-5 h-5 transition-transform", polaroid.isFlipped && "rotate-180")} />
                    {polaroid.isFlipped ? "Show Front" : "Flip to Back"}
                </button>

                <button
                    onClick={() => onUpdate({ downloadTrigger: Date.now() })}
                    className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                >
                    <Download className="w-5 h-5" />
                    Download Photo
                </button>
            </div>
        </div>
    );
}

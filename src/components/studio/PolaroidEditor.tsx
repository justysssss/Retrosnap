"use client";

import { RotateCw, MessageSquare, Type } from "lucide-react";
import { clsx } from "clsx";
import { Polaroid } from "@/types/studio";
import DownloadBtn from "./DownloadBtn";
import FilterSelector from "./FilterSelector";
import { getFilterById, PHOTO_FILTERS } from "@/lib/photoFilters";

interface PolaroidEditorProps {
    polaroid: Polaroid;
    onUpdate: (updates: Partial<Polaroid>) => void;
}

export default function PolaroidEditor({ polaroid, onUpdate }: PolaroidEditorProps) {
    const handleFilterSelect = (filterId: string) => {
        const filter = getFilterById(filterId);
        if (filter) {
            onUpdate({ filter: filter.cssFilter });
        }
    };

    // Get current filter ID from CSS string by comparing filter values
    const getCurrentFilterId = () => {
        const currentFilter = PHOTO_FILTERS.find(f => f.cssFilter === polaroid.filter);
        return currentFilter?.id || "normal";
    };

    return (
        <div className="space-y-8">
            {/* Filters */}
            <FilterSelector
                imageSrc={polaroid.imageSrc}
                selectedFilter={getCurrentFilterId()}
                onFilterSelect={handleFilterSelect}
                showCategories={true}
            />

            {/* Caption */}
            <div>
                <h3 className="text-xl font-marker mb-4 flex items-center gap-2 text-stone-800 dark:text-stone-100">
                    <Type className="w-5 h-5" />
                    Caption
                </h3>
                <input
                    type="text"
                    value={polaroid.caption}
                    onChange={(e) => onUpdate({ caption: e.target.value })}
                    placeholder="Write a memory..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-stone-200 focus:border-stone-800 focus:outline-none font-handwriting text-2xl bg-transparent dark:border-stone-600 dark:focus:border-stone-400 dark:text-stone-100 dark:placeholder-stone-500"
                    maxLength={40}
                />
            </div>

            {/* Secret Message */}
            <div>
                <h3 className="text-xl font-marker mb-4 flex items-center gap-2 text-stone-800 dark:text-stone-100">
                    <MessageSquare className="w-5 h-5" />
                    Secret Message
                </h3>
                <textarea
                    value={polaroid.secretMessage}
                    onChange={(e) => onUpdate({ secretMessage: e.target.value })}
                    placeholder="Something for the back..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-stone-200 focus:border-stone-800 focus:outline-none font-handwriting text-xl bg-transparent min-h-[80px] resize-none dark:border-stone-600 dark:focus:border-stone-400 dark:text-stone-100 dark:placeholder-stone-500"
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
                            ? "bg-stone-800 text-white shadow-md dark:bg-stone-200 dark:text-stone-900"
                            : "bg-white border-2 border-stone-200 text-stone-600 hover:bg-stone-50 dark:bg-stone-700 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-600"
                    )}
                >
                    <RotateCw className={clsx("w-5 h-5 transition-transform", polaroid.isFlipped && "rotate-180")} />
                    {polaroid.isFlipped ? "Show Front" : "Flip to Back"}
                </button>

                <DownloadBtn onClick={() => onUpdate({ downloadTrigger: Date.now() })} />
            </div>
        </div>
    );
}

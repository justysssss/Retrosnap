"use client";

import { useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import {
    PHOTO_FILTERS,
    FILTER_CATEGORIES,
    getFiltersByCategory,
    PhotoFilter
} from "@/lib/photoFilters";
import { Wand2, ChevronDown } from "lucide-react";

interface FilterSelectorProps {
    imageSrc: string;
    selectedFilter: string;
    onFilterSelect: (filterId: string) => void;
    showCategories?: boolean;
}

export default function FilterSelector({
    imageSrc,
    selectedFilter,
    onFilterSelect,
    showCategories = true,
}: FilterSelectorProps) {
    const [activeCategory, setActiveCategory] = useState<PhotoFilter["category"]>("classic");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const currentFilters = showCategories
        ? getFiltersByCategory(activeCategory)
        : PHOTO_FILTERS;

    const activeCategoryData = FILTER_CATEGORIES.find(c => c.id === activeCategory);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 text-stone-800 dark:text-stone-100">
                <Wand2 className="w-5 h-5" />
                <h3 className="text-xl font-marker">Filters</h3>
            </div>

            {/* Category Dropdown */}
            {showCategories && (
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full px-4 py-3 bg-stone-100 dark:bg-stone-700 rounded-lg flex items-center justify-between text-stone-800 dark:text-stone-200 font-semibold hover:bg-stone-200 dark:hover:bg-stone-600 transition-all cursor-pointer"
                    >
                        <span>{activeCategoryData?.name}</span>
                        <ChevronDown className={clsx(
                            "w-5 h-5 transition-transform",
                            isDropdownOpen && "rotate-180"
                        )} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-stone-800 rounded-lg shadow-xl border border-stone-200 dark:border-stone-600 z-50 overflow-hidden">
                            {FILTER_CATEGORIES.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setActiveCategory(category.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={clsx(
                                        "w-full px-4 py-3 text-left transition-all",
                                        activeCategory === category.id
                                            ? "bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900"
                                            : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                                    )}
                                >
                                    <div className="font-semibold">{category.name}</div>
                                    <div className="text-xs opacity-75 mt-0.5">{category.description}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Filter Grid - Larger 2 column layout with proper padding */}
            <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto px-1 py-1">
                {currentFilters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => onFilterSelect(filter.id)}
                        className={clsx(
                            "relative rounded-xl overflow-hidden transition-all",
                            selectedFilter === filter.id
                                ? "border-4 border-blue-500 shadow-xl"
                                : "border-2 border-stone-300 dark:border-stone-600 hover:border-blue-400 dark:hover:border-blue-500"
                        )}
                    >
                        {/* Preview Image with Filter */}
                        <div className="relative w-full aspect-square bg-stone-100 dark:bg-stone-800">
                            <Image
                                src={imageSrc}
                                alt={filter.name}
                                fill
                                className="object-cover"
                                style={{ filter: filter.cssFilter }}
                            />

                            {/* Selected Indicator */}
                            {selectedFilter === filter.id && (
                                <div className="absolute top-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Filter Name */}
                        <div className={clsx(
                            "px-3 py-2.5 text-center transition-colors",
                            selectedFilter === filter.id
                                ? "bg-blue-500 text-white"
                                : "bg-white dark:bg-stone-800"
                        )}>
                            <p className={clsx(
                                "text-sm font-semibold",
                                selectedFilter === filter.id
                                    ? "text-white"
                                    : "text-stone-700 dark:text-stone-300"
                            )}>
                                {filter.name}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

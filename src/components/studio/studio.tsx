"use client";

import { useState, useRef } from "react";
import { Upload, Camera as CameraIcon, X, Wand2, Type, MessageSquare, RotateCw, Download } from "lucide-react";
import { clsx } from "clsx";
import { v4 as uuidv4 } from 'uuid';
import CameraCapture from "@/components/studio/CameraCapture";
import PolaroidEditor from "@/components/studio/PolaroidEditor";
import DraggablePolaroid from "@/components/studio/DraggablePolaroid";
import ImageCropper from "@/components/studio/ImageCropper";
import FilterSelector from "@/components/studio/FilterSelector";
import { Polaroid } from "@/types/studio";
import { getFilterById, PHOTO_FILTERS } from "@/lib/photoFilters";

type MobileTab = 'filters' | 'text' | null;

export default function StudioPage() {
    const [polaroids, setPolaroids] = useState<Polaroid[]>([]);
    const [selectedPolaroidId, setSelectedPolaroidId] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isModeSelectionOpen, setIsModeSelectionOpen] = useState(false);
    const [rawImage, setRawImage] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [mobileActiveTab, setMobileActiveTab] = useState<MobileTab>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageCapture = (src: string) => {
        const newId = uuidv4();
        const newPolaroid: Polaroid = {
            id: newId,
            imageSrc: src,
            x: 400 + (Math.random() * 50), // Position it to the right of the camera
            y: 200 + (Math.random() * 50),
            rotation: (Math.random() - 0.5) * 10,
            caption: "",
            filter: "none",
            isFlipped: false,
            secretMessage: "",
            timestamp: Date.now(),
        };
        setPolaroids((prev) => [...prev, newPolaroid]);
        // Don't auto-select or close camera, allowing multiple shots
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setRawImage(e.target.result as string);
                    setShowCropper(true);
                }
            };
            reader.readAsDataURL(file);
        }
        setIsModeSelectionOpen(false);
    };

    const handleCropComplete = (croppedImage: string) => {
        const newId = uuidv4();
        const newPolaroid: Polaroid = {
            id: newId,
            imageSrc: croppedImage,
            x: window.innerWidth / 2 - 100,
            y: window.innerHeight / 2 - 150,
            rotation: 0,
            caption: "",
            filter: "none",
            isFlipped: false,
            secretMessage: "",
            timestamp: Date.now(),
        };
        setPolaroids((prev) => [...prev, newPolaroid]);
        setSelectedPolaroidId(newId);
        setShowCropper(false);
        setRawImage(null);
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setRawImage(null);
    };

    const updatePolaroid = (id: string, updates: Partial<Polaroid>) => {
        setPolaroids((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
    };

    const handleDeletePolaroid = (id: string) => {
        setPolaroids((prev) => prev.filter((p) => p.id !== id));
        if (selectedPolaroidId === id) {
            setSelectedPolaroidId(null);
        }
    };

    const selectedPolaroid = polaroids.find((p) => p.id === selectedPolaroidId);

    const handleFilterSelect = (filterId: string) => {
        if (!selectedPolaroid) return;
        const filter = getFilterById(filterId);
        if (filter) {
            updatePolaroid(selectedPolaroid.id, { filter: filter.cssFilter });
        }
    };

    const getCurrentFilterId = () => {
        if (!selectedPolaroid) return "normal";
        const currentFilter = PHOTO_FILTERS.find(f => f.cssFilter === selectedPolaroid.filter);
        return currentFilter?.id || "normal";
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f0f0f0] dark:bg-stone-900 transition-colors duration-300" ref={containerRef}>
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                aria-label="Upload Image"
            />

            {/* Background Texture - Removed missing image */}

            {/* Corkboard/Pinboard Effect */}
            <div className="absolute inset-0 pointer-events-none text-stone-400 dark:text-stone-500 opacity-50 dark:opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
            />

            {/* Toolbar */}
            <div className="absolute top-4 left-4 z-50 flex gap-2 md:gap-4">
                <button
                    onClick={() => setIsModeSelectionOpen(true)}
                    className="bg-stone-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold shadow-lg hover:bg-stone-700 transition-transform hover:scale-105 flex items-center gap-2 text-sm md:text-base dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-300"
                >
                    <CameraIcon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">New Photo</span>
                    <span className="sm:hidden">New</span>
                </button>
            </div>

            {/* Image Cropper Modal */}
            {showCropper && rawImage && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-stone-800 p-4 md:p-6 rounded-2xl shadow-2xl max-w-2xl w-full relative">
                        <button
                            onClick={handleCropCancel}
                            className="absolute top-2 right-2 md:top-4 md:right-4 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 z-10"
                            aria-label="Cancel crop"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl md:text-2xl font-marker text-center mb-4 text-stone-800 dark:text-stone-100">Crop Your Image</h2>
                        <ImageCropper
                            imageSrc={rawImage}
                            onCropComplete={handleCropComplete}
                            onCancel={handleCropCancel}
                        />
                    </div>
                </div>
            )}

            {/* Mode Selection Modal */}
            {isModeSelectionOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-2xl max-w-md w-full relative">
                        <button
                            onClick={() => setIsModeSelectionOpen(false)}
                            className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-3xl font-marker text-center mb-8 text-stone-800 dark:text-stone-100">How do you want to snap?</h2>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => {
                                    setIsModeSelectionOpen(false);
                                    setIsCameraOpen(true);
                                }}
                                className="flex items-center justify-center gap-3 w-full py-4 bg-stone-800 text-white rounded-xl font-bold text-lg hover:bg-stone-700 transition-transform hover:scale-[1.02] dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-300"
                            >
                                <CameraIcon className="w-6 h-6" />
                                Use Camera
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-stone-200 dark:border-stone-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400">Or</span>
                                </div>
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center justify-center gap-3 w-full py-4 border-2 border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 rounded-xl font-bold text-lg hover:bg-stone-50 dark:hover:bg-stone-700 hover:border-stone-300 dark:hover:border-stone-500 transition-all"
                            >
                                <Upload className="w-6 h-6" />
                                Upload Image
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Board Area - Adjust padding for mobile bottom toolbar */}
            <div className="w-full h-full min-h-screen relative pb-0 md:pb-0">
                {polaroids.map((polaroid) => (
                    <DraggablePolaroid
                        key={polaroid.id}
                        polaroid={polaroid}
                        isSelected={selectedPolaroidId === polaroid.id}
                        onSelect={() => setSelectedPolaroidId(polaroid.id)}
                        onUpdate={(updates) => updatePolaroid(polaroid.id, updates)}
                        onDelete={() => handleDeletePolaroid(polaroid.id)}
                        containerRef={containerRef}
                    />
                ))}
                {polaroids.length === 0 && !isCameraOpen && !isModeSelectionOpen && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
                        <div className="text-center text-stone-400 dark:text-stone-500">
                            <p className="font-marker text-2xl md:text-3xl mb-2">Your board is empty!</p>
                            <p className="font-handwriting text-lg md:text-xl">Click &quot;New Photo&quot; to start snapping.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Camera Overlay - Responsive positioning */}
            {isCameraOpen && (
                <div className="fixed bottom-4 left-4 md:bottom-12 md:left-28 lg:left-96 z-60 pointer-events-none origin-bottom-left transform scale-75 sm:scale-90 md:scale-110 lg:scale-125">
                    <div className="relative pointer-events-auto">
                        <button
                            onClick={() => setIsCameraOpen(false)}
                            className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-stone-800 text-white rounded-full p-1.5 md:p-2 hover:bg-stone-700 z-50 shadow-lg"
                            aria-label="Close camera"
                        >
                            <X className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <CameraCapture onImageCapture={handleImageCapture} />
                    </div>
                </div>
            )}

            {/* Editor Sidebar - Desktop: Right side, Mobile/Tablet: Bottom toolbar + modal */}

            {/* Desktop Editor - Right Sidebar (hidden on mobile & tablet) */}
            <div className={clsx(
                "hidden lg:block fixed top-0 right-0 h-full w-80 bg-white dark:bg-stone-800 shadow-2xl transform transition-transform duration-300 z-40 overflow-y-auto",
                selectedPolaroid ? "translate-x-0" : "translate-x-full"
            )}>
                {selectedPolaroid && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-marker text-2xl text-stone-800 dark:text-stone-100">Edit Photo</h2>
                            <button
                                onClick={() => setSelectedPolaroidId(null)}
                                aria-label="Close editor"
                                className="text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <PolaroidEditor
                            polaroid={selectedPolaroid}
                            onUpdate={(updates) => updatePolaroid(selectedPolaroid.id, updates)}
                        />
                    </div>
                )}
            </div>

            {/* Mobile/Tablet Bottom Toolbar (visible on mobile & tablet when polaroid selected) */}
            {selectedPolaroid && (
                <>
                    {/* Bottom Action Bar - Canva Style */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 z-[60] safe-area-pb">
                        <div className="grid grid-cols-4 gap-1 p-2">
                            <button
                                onClick={() => setMobileActiveTab(mobileActiveTab === 'filters' ? null : 'filters')}
                                className={clsx(
                                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                                    mobileActiveTab === 'filters' 
                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                                        : "text-stone-600 dark:text-stone-400"
                                )}
                            >
                                <Wand2 className="w-5 h-5" />
                                <span className="text-xs font-medium">Filters</span>
                            </button>

                            <button
                                onClick={() => setMobileActiveTab(mobileActiveTab === 'text' ? null : 'text')}
                                className={clsx(
                                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                                    mobileActiveTab === 'text' 
                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                                        : "text-stone-600 dark:text-stone-400"
                                )}
                            >
                                <Type className="w-5 h-5" />
                                <span className="text-xs font-medium">Text</span>
                            </button>

                            <button
                                onClick={() => {
                                    updatePolaroid(selectedPolaroid.id, { isFlipped: !selectedPolaroid.isFlipped });
                                }}
                                className={clsx(
                                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                                    selectedPolaroid.isFlipped 
                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                                        : "text-stone-600 dark:text-stone-400"
                                )}
                            >
                                <RotateCw className={clsx("w-5 h-5 transition-transform", selectedPolaroid.isFlipped && "rotate-180")} />
                                <span className="text-xs font-medium">Flip</span>
                            </button>

                            <button
                                onClick={() => updatePolaroid(selectedPolaroid.id, { downloadTrigger: Date.now() })}
                                className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-stone-600 dark:text-stone-400"
                            >
                                <Download className="w-5 h-5" />
                                <span className="text-xs font-medium">Save</span>
                            </button>
                        </div>
                    </div>                    {/* Mobile/Tablet Content Modal - Slides up when tab active */}
                    {mobileActiveTab && (
                        <div className="lg:hidden fixed inset-0 bg-black/50 z-[70] flex items-end" onClick={() => setMobileActiveTab(null)}>
                            <div
                                className="bg-white dark:bg-stone-800 rounded-t-3xl w-full max-h-[70vh] overflow-y-auto p-4 pb-6 relative z-[71]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Drag Handle */}
                                <div className="w-12 h-1 bg-stone-300 dark:bg-stone-600 rounded-full mx-auto mb-4" />

                                {mobileActiveTab === 'filters' && (
                                    <div>
                                        <h3 className="text-lg font-marker mb-4 text-stone-800 dark:text-stone-100">Choose Filter</h3>
                                        <FilterSelector
                                            imageSrc={selectedPolaroid.imageSrc}
                                            selectedFilter={getCurrentFilterId()}
                                            onFilterSelect={handleFilterSelect}
                                            showCategories={true}
                                        />
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => setMobileActiveTab(null)}
                                                className="flex-1 py-3 rounded-lg font-bold bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {mobileActiveTab === 'text' && (
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-marker mb-3 text-stone-800 dark:text-stone-100">Caption</h3>
                                            <input
                                                type="text"
                                                value={selectedPolaroid.caption}
                                                onChange={(e) => updatePolaroid(selectedPolaroid.id, { caption: e.target.value })}
                                                placeholder="Write a memory..."
                                                className="w-full px-4 py-3 rounded-lg border-2 border-stone-200 focus:border-stone-800 focus:outline-none font-handwriting text-lg bg-transparent dark:border-stone-600 dark:focus:border-stone-400 dark:text-stone-100 dark:placeholder-stone-500"
                                                maxLength={40}
                                                autoFocus
                                            />
                                            <p className="text-xs text-stone-400 mt-2 text-right">{selectedPolaroid.caption.length}/40</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-marker mb-3 text-stone-800 dark:text-stone-100">Secret Message</h3>
                                            <textarea
                                                value={selectedPolaroid.secretMessage}
                                                onChange={(e) => updatePolaroid(selectedPolaroid.id, { secretMessage: e.target.value })}
                                                placeholder="Something for the back..."
                                                className="w-full px-4 py-3 rounded-lg border-2 border-stone-200 focus:border-stone-800 focus:outline-none font-handwriting text-lg bg-transparent min-h-[80px] resize-none dark:border-stone-600 dark:focus:border-stone-400 dark:text-stone-100 dark:placeholder-stone-500"
                                                maxLength={100}
                                            />
                                            <p className="text-xs text-stone-400 mt-2 text-right">{selectedPolaroid.secretMessage.length}/100</p>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => setMobileActiveTab(null)}
                                                className="flex-1 py-3 rounded-lg font-bold border-2 border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => setMobileActiveTab(null)}
                                                className="flex-1 py-3 rounded-lg font-bold bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900"
                                            >
                                                OK
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

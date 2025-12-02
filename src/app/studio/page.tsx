"use client";

import { useState, useRef } from "react";
import { Upload, Camera as CameraIcon, X } from "lucide-react";
import { clsx } from "clsx";
import { v4 as uuidv4 } from 'uuid';
import CameraCapture from "@/components/studio/CameraCapture";
import PolaroidEditor from "@/components/studio/PolaroidEditor";
import DraggablePolaroid from "@/components/studio/DraggablePolaroid";

export type Polaroid = {
    id: string;
    imageSrc: string;
    x: number;
    y: number;
    rotation: number;
    caption: string;
    filter: string;
    isFlipped: boolean;
    secretMessage: string;
    timestamp: number;
};

export default function StudioPage() {
    const [polaroids, setPolaroids] = useState<Polaroid[]>([]);
    const [selectedPolaroidId, setSelectedPolaroidId] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isModeSelectionOpen, setIsModeSelectionOpen] = useState(false);
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
                    // For upload, we DO want to select it immediately
                    const newId = uuidv4();
                    const newPolaroid: Polaroid = {
                        id: newId,
                        imageSrc: e.target.result as string,
                        x: window.innerWidth / 2 - 100, // Center screen
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
                }
            };
            reader.readAsDataURL(file);
        }
        setIsModeSelectionOpen(false);
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

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f0f0f0]" ref={containerRef}>
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                aria-label="Upload Image"
            />

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-50 pointer-events-none"
                style={{ backgroundImage: 'url("/paper-texture.png")' }} />

            {/* Corkboard/Pinboard Effect */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#a8a29e 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    opacity: 0.2
                }}
            />

            {/* Toolbar */}
            <div className="absolute top-4 left-4 z-50 flex gap-4">
                <button
                    onClick={() => setIsModeSelectionOpen(true)}
                    className="bg-stone-800 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-stone-700 transition-transform hover:scale-105 flex items-center gap-2"
                >
                    <CameraIcon className="w-5 h-5" />
                    New Photo
                </button>
            </div>

            {/* Mode Selection Modal */}
            {isModeSelectionOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative">
                        <button
                            onClick={() => setIsModeSelectionOpen(false)}
                            className="absolute top-4 right-4 text-stone-400 hover:text-stone-800"
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-3xl font-marker text-center mb-8 text-stone-800">How do you want to snap?</h2>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => {
                                    setIsModeSelectionOpen(false);
                                    setIsCameraOpen(true);
                                }}
                                className="flex items-center justify-center gap-3 w-full py-4 bg-stone-800 text-white rounded-xl font-bold text-lg hover:bg-stone-700 transition-transform hover:scale-[1.02]"
                            >
                                <CameraIcon className="w-6 h-6" />
                                Use Camera
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-stone-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-stone-500">Or</span>
                                </div>
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center justify-center gap-3 w-full py-4 border-2 border-stone-200 text-stone-600 rounded-xl font-bold text-lg hover:bg-stone-50 hover:border-stone-300 transition-all"
                            >
                                <Upload className="w-6 h-6" />
                                Upload Image
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Board Area */}
            <div className="w-full h-full min-h-screen relative">
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
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center text-stone-400">
                            <p className="font-marker text-3xl mb-2">Your board is empty!</p>
                            <p className="font-handwriting text-xl">Click &quot;New Photo&quot; to start snapping.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Camera Overlay - Now positioned at bottom left, non-modal */}
            {isCameraOpen && (
                <div className="fixed bottom-12 left-28 md:left-96 z-[60] pointer-events-none origin-bottom-left transform scale-110 md:scale-125">
                    <div className="relative pointer-events-auto">
                        <button
                            onClick={() => setIsCameraOpen(false)}
                            className="absolute -top-4 -right-4 bg-stone-800 text-white rounded-full p-2 hover:bg-stone-700 z-50 shadow-lg"
                            aria-label="Close camera"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <CameraCapture onImageCapture={handleImageCapture} />
                    </div>
                </div>
            )}

            {/* Editor Sidebar (Slide over) */}
            <div className={clsx(
                "fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-40 overflow-y-auto",
                selectedPolaroid ? "translate-x-0" : "translate-x-full"
            )}>
                {selectedPolaroid && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-marker text-2xl">Edit Photo</h2>
                            <button onClick={() => setSelectedPolaroidId(null)} aria-label="Close editor">
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
        </div>
    );
}

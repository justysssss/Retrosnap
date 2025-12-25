"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Camera, X } from "lucide-react";

interface MobileCameraProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (imageData: string) => void;
}

export default function MobileCamera({ isOpen, onClose, onCapture }: MobileCameraProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        if (isOpen && navigator.mediaDevices) {
            navigator.mediaDevices
                .getUserMedia({ video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } } })
                .then((mediaStream) => {
                    setStream(mediaStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                })
                .catch((err) => console.error("Camera access denied:", err));
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [isOpen, facingMode]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                
                if (facingMode === "user") {
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                }
                
                ctx.drawImage(videoRef.current, 0, 0);
                const imageData = canvas.toDataURL("image/png");
                onCapture(imageData);
                onClose();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* 1. Video Preview */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`absolute inset-0 w-full h-full object-cover ${
                        facingMode === "user" ? "scale-x-[-1]" : ""
                    }`}
                />

                {/* 2. PNG Frame Overlay */}
                <img
                    src="/camera_types/frame_pic.png"
                    alt="Camera Frame"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
                />

                {/* 3. Close Button (X) - Fixed: button-type & discernible text */}
                <div className="absolute top-8 right-8 z-30">
                    <button
                        type="button"
                        onClick={onClose}
                        title="Close Camera"
                        aria-label="Close Camera"
                        className="w-10 h-10 rounded-full bg-[#ff3b3b] border-2 border-[#b32626] flex items-center justify-center text-white shadow-[0_4px_0_0_#851d1d] active:shadow-none active:translate-y-1 transition-all"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>

                {/* 4. Controls Bar - Positioned "More Up" and Symmetrical */}
                <div className="absolute bottom-31 left-0 right-0 z-30 px-6 sm:px-10">
                    <div className="w-full max-w-md mx-auto grid grid-cols-3 items-center">
                        
                        {/* Flip Button (Left) - Fixed: button-type & discernible text */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => setFacingMode(p => p === "user" ? "environment" : "user")}
                                title="Flip Camera"
                                aria-label="Flip Camera"
                                className="w-14 h-14 rounded-full bg-stone-900/80 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl active:scale-90 transition-transform"
                            >
                                <RotateCcw size={24} />
                            </button>
                        </div>

                        {/* Capture Button (Center) - Fixed: button-type & discernible text */}
                        <div className="flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-b from-gray-200 to-gray-500 p-1.5 shadow-[0_10px_20px_rgba(0,0,0,0.4),inset_0_2px_2px_rgba(255,255,255,0.5)]">
                                <button
                                    type="button"
                                    onClick={handleCapture}
                                    title="Take Photo"
                                    aria-label="Take Photo"
                                    className="w-full h-full rounded-full bg-gradient-to-b from-white to-gray-200 border-2 border-gray-400 flex items-center justify-center text-gray-700 shadow-inner active:from-gray-300 active:to-gray-400 active:scale-95 transition-all"
                                >
                                    <Camera size={32} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>

                        {/* Symmetry Spacer (Right) - Replaces the removed icon to keep center button centered */}
                        <div className="w-14 h-14" aria-hidden="true" />
                    </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />
            </motion.div>
        </AnimatePresence>
    );
}
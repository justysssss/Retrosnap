"use client";

import { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import { motion, useDragControls, PanInfo } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface CameraCaptureProps {
    onImageCapture: (imageSrc: string) => void;
}

export default function CameraCapture({ onImageCapture }: CameraCaptureProps) {
    const webcamRef = useRef<Webcam>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const dragControls = useDragControls();

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setCapturedImage(imageSrc);
        }
    }, [webcamRef]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        // If dragged up (negative Y) or to the right (positive X) significantly
        if ((info.offset.y < -100 || info.offset.x > 100) && capturedImage) {
            onImageCapture(capturedImage);
            setCapturedImage(null); // Reset for next photo
        }
    };

    const toggleCamera = () => {
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    };

    return (
        <div className="relative w-[400px] h-[400px] flex items-center justify-center">
            {/* Camera Body Container */}
            <div className="relative w-full h-full flex items-center justify-center">

                {/* Webcam Preview (Behind the camera image) */}
                {/* Adjusted for smaller container */}
                <div className="absolute top-[50px] left-[50px] w-[300px] h-[300px] rounded-full overflow-hidden z-10 bg-black">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            facingMode: facingMode,
                            aspectRatio: 1,
                        }}
                        className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                </div>

                {/* Camera Image Overlay (Front) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/cameras/pink_camera_cut.png"
                    alt="Retro Camera"
                    className="relative z-20 w-full pointer-events-none drop-shadow-2xl"
                />

                {/* Controls */}
                <div className="absolute top-8 right-8 z-30 flex gap-4">
                    <button
                        onClick={toggleCamera}
                        className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors"
                        aria-label="Toggle Camera"
                    >
                        <RefreshCw className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Shutter Button */}
                <button
                    onClick={capture}
                    className="absolute top-[68px] right-14 w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 transition-transform z-30 shadow-lg border-4 border-red-700 flex items-center justify-center group"
                    title="Take Photo"
                >
                    <div className="w-8 h-8 rounded-full border-2 border-white/30 group-hover:border-white/50 transition-colors" />
                </button>

                {/* Developing Photo Animation (Slides out from top/behind) */}
                {capturedImage && (
                    <motion.div
                        drag
                        dragControls={dragControls}
                        dragConstraints={{ top: -300, bottom: 0, left: 0, right: 300 }}
                        dragElastic={0.1}
                        onDragEnd={handleDragEnd}
                        initial={{ y: 40, opacity: 0, scale: 0.8, zIndex: 15 }}
                        animate={{ y: -140, opacity: 1, scale: 1, zIndex: 15 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
                    >
                        <div className="bg-white p-2 pb-8 shadow-xl w-44 transform -rotate-2">
                            <div className="aspect-square bg-black overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    className="w-full h-full object-cover grayscale brightness-50 animate-[develop_3s_ease-in-out_forwards]"
                                />
                            </div>
                            <p className="text-center mt-2 font-handwriting text-stone-400 text-xs animate-pulse">
                                Drag out to keep!
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";

const CAMERAS = [
    {
        id: "instax-mini-8-pink",
        name: "Fujifilm Instax Mini 8 (Pink)",
        color: "#ffc0cb",
        type: "modern",
        image: "/camera_types/pink_camera.png",
    },
    {
        id: "instax-mini-8-purple",
        name: "Fujifilm Instax Mini 8 (Purple)",
        color: "#e0b0ff",
        type: "modern",
        image: "/camera_types/purple_camera.png",
    },
    {
        id: "instax-mini-8-yellow",
        name: "Fujifilm Instax Mini 8 (Yellow)",
        color: "#ffff99",
        type: "modern",
        image: "/camera_types/yellow_cam.png",
    },
    {
        id: "old-polaroid",
        name: "Vintage Polaroid 600",
        color: "#333333",
        type: "vintage",
        image: "/camera_types/oldcam_pic.png",
    },
];

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [selectedCamera, setSelectedCamera] = useState("instax-mini-8-pink");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            // Load saved camera preference
            const savedCamera = localStorage.getItem("preferred-camera");
            if (savedCamera) {
                setSelectedCamera(savedCamera);
            }
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleCameraChange = (cameraId: string) => {
        setSelectedCamera(cameraId);
        localStorage.setItem("preferred-camera", cameraId);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#f0f0f0] dark:bg-stone-900 p-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-marker text-stone-800 dark:text-stone-100 mb-8">Settings</h1>

                <div className="grid gap-8">
                    {/* Theme Section */}
                    <section className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                            <Sun className="w-6 h-6" /> Appearance
                        </h2>
                        <div className="flex gap-4">
                            <Button
                                onClick={() => setTheme("light")}
                                variant={theme === "light" ? "default" : "outline"}
                                className={clsx(
                                    "flex-1 h-24 flex flex-col gap-2 relative border-2 transition-all",
                                    theme === "light"
                                        ? "bg-stone-800 text-white border-stone-800 ring-2 ring-stone-400 ring-offset-2 dark:ring-offset-stone-900"
                                        : "text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700"
                                )}
                            >
                                {theme === "light" && (
                                    <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                )}
                                <Sun className="w-8 h-8" />
                                Light Mode
                            </Button>
                            <Button
                                onClick={() => setTheme("dark")}
                                variant={theme === "dark" ? "default" : "outline"}
                                className={clsx(
                                    "flex-1 h-24 flex flex-col gap-2 relative border-2 transition-all",
                                    theme === "dark"
                                        ? "bg-stone-200 text-stone-900 border-stone-200 ring-2 ring-stone-500 ring-offset-2 dark:ring-offset-stone-900"
                                        : "text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700"
                                )}
                            >
                                {theme === "dark" && (
                                    <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                )}
                                <Moon className="w-8 h-8" />
                                Dark Mode
                            </Button>
                        </div>
                    </section>

                    {/* Camera Selection Section */}
                    <section className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                            <Camera className="w-6 h-6" /> Camera Model
                        </h2>
                        <p className="text-stone-600 dark:text-stone-400 mb-6">
                            Choose your preferred camera style for the studio.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {CAMERAS.map((camera) => (
                                <button
                                    key={camera.id}
                                    onClick={() => handleCameraChange(camera.id)}
                                    className={clsx(
                                        "relative p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-4 text-left overflow-hidden group",
                                        selectedCamera === camera.id
                                            ? "border-stone-800 bg-stone-50 dark:bg-stone-700 dark:border-stone-100"
                                            : "border-stone-200 hover:border-stone-400 dark:border-stone-600 dark:hover:border-stone-500"
                                    )}
                                >
                                    <div className="relative w-24 h-24 shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={camera.image}
                                            alt={camera.name}
                                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="z-10">
                                        <h3 className="font-bold text-stone-800 dark:text-stone-100">{camera.name}</h3>
                                        <p className="text-sm text-stone-500 dark:text-stone-400 capitalize">{camera.type}</p>
                                    </div>
                                    {selectedCamera === camera.id && (
                                        <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

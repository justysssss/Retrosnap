"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Plus, Loader2 } from "lucide-react";
import { getSignedUrl, createPostinPrivateWall } from "@/lib/actions";
import Image from "next/image";
import ImageCropper from "../studio/ImageCropper";
import { toast } from "sonner";

interface UploadToPrivateBoardProps {
    onSuccess?: () => void;
}

export default function UploadToPrivateBoard({ onSuccess }: UploadToPrivateBoardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [rawImage, setRawImage] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [message, setMessage] = useState("");
    const [secretMessage, setSecretMessage] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setRawImage(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedImage: string) => {
        setPreviewUrl(croppedImage);
        setShowCropper(false);
    };

    const handleCropCancel = () => {
        setRawImage(null);
        setSelectedFile(null);
        setShowCropper(false);
    };

    const handleUpload = () => {
        if (!previewUrl) return;

        startTransition(async () => {
            try {
                // Convert base64 to blob
                const response = await fetch(previewUrl);
                const blob = await response.blob();

                // Get signed URL
                const { url, filePath, error } = await getSignedUrl(
                    `private-${Date.now()}.jpg`,
                    "image/jpeg"
                );

                if (error || !url || !filePath) {
                    toast.error(error || "Failed to get upload URL");
                    return;
                }

                // Upload to storage
                const uploadResponse = await fetch(url, {
                    method: "PUT",
                    body: blob,
                    headers: { "Content-Type": "image/jpeg" },
                });

                if (!uploadResponse.ok) {
                    toast.error("Failed to upload image");
                    return;
                }

                // Create private post
                const result = await createPostinPrivateWall({
                    message: message || "",
                    secretMessage: secretMessage || undefined,
                    filePath: filePath,
                    aspectRatio: 1, // Square for polaroid
                });

                if (result.error) {
                    toast.error(result.error);
                    return;
                }

                toast.success("Memory added to your private board!");

                // Success - reset and close
                setIsOpen(false);
                setSelectedFile(null);
                setRawImage(null);
                setPreviewUrl(null);
                setShowCropper(false);
                setMessage("");
                setSecretMessage("");
                onSuccess?.();
            } catch (error) {
                console.error("Upload error:", error);
                toast.error("Upload failed");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                    <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Add Memory</span>
                    <span className="sm:hidden">Add</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogTitle>Add Memory to Your Board</DialogTitle>

                <div className="space-y-4">
                    {/* File Upload or Cropper */}
                    {showCropper && rawImage ? (
                        <div>
                            <button
                                type="button"
                                onClick={handleCropCancel}
                                className="text-sm text-stone-600 hover:text-stone-800 mb-3 flex items-center gap-1"
                            >
                                ← Cancel
                            </button>
                            <ImageCropper
                                imageSrc={rawImage}
                                onCropComplete={handleCropComplete}
                                onCancel={handleCropCancel}
                            />
                        </div>
                    ) : !previewUrl ? (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors">
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="w-8 h-8 text-stone-400" />
                                <span className="text-sm text-stone-500">Click to upload image</span>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                                disabled={isPending}
                            />
                        </label>
                    ) : (
                        <div className="relative w-full aspect-square bg-stone-100 rounded-lg overflow-hidden">
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                            <button
                                onClick={() => {
                                    setSelectedFile(null);
                                    setRawImage(null);
                                    setPreviewUrl(null);
                                }}
                                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                                disabled={isPending}
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Caption */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Caption</label>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Add a caption..."
                            className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isPending}
                        />
                    </div>

                    {/* Secret Message */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Secret Message (Back)</label>
                        <textarea
                            value={secretMessage}
                            onChange={(e) => setSecretMessage(e.target.value)}
                            placeholder="Add a secret message on the back..."
                            rows={3}
                            className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            disabled={isPending}
                        />
                    </div>

                    {/* Upload Button */}
                    <Button
                        onClick={handleUpload}
                        disabled={!previewUrl || isPending || showCropper}
                        className="w-full"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Add to Board"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import { useState } from "react";
import FileUpload from "../studio/FileUpload";
import ImageCropper from "../studio/ImageCropper";
import { Button } from "../ui/button";
import { Loader2, Image as ImageIcon, Camera, MessageSquare } from "lucide-react";
import { createPost, getSignedUrl } from "@/lib/actions";
import Image from "next/image";

export default function CreatePostForm({ onSuccess }: { onSuccess?: () => void }) {
    const [rawImage, setRawImage] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [caption, setCaption] = useState("");
    const [secretMessage, setSecretMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadMode, setUploadMode] = useState<"image" | "polaroid" | null>(null);
    const [showCropper, setShowCropper] = useState(false);

    const handleImageSelect = (selectedImage: string) => {
        if (uploadMode === "image") {
            // Show cropper for image mode
            setRawImage(selectedImage);
            setShowCropper(true);
        } else {
            // Direct upload for polaroid mode
            setImage(selectedImage);
        }
    };

    const handleCropComplete = (croppedImage: string) => {
        setImage(croppedImage);
        setShowCropper(false);
    };

    const handleCropCancel = () => {
        setRawImage(null);
        setShowCropper(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) return;

        setIsSubmitting(true);

        try {
            // Convert base64 to blob
            const response = await fetch(image);
            const blob = await response.blob();

            // Get signed URL
            const signedUrlResult = await getSignedUrl(
                `post-${Date.now()}.jpg`,
                "image/jpeg"
            );

            if (signedUrlResult.error || !signedUrlResult.url || !signedUrlResult.filePath) {
                throw new Error(signedUrlResult.error || "Failed to get upload URL");
            }

            // Upload to cloud storage
            await fetch(signedUrlResult.url, {
                method: "PUT",
                body: blob,
                headers: {
                    "Content-Type": "image/jpeg",
                },
            });

            // Create post
            const result = await createPost({
                message: caption,
                secretMessage: secretMessage || undefined,
                filePath: signedUrlResult.filePath,
                aspectRatio: 1, // 1:1 aspect ratio
            });

            if (result.error) {
                throw new Error(result.error);
            }

            // Reset form
            setImage(null);
            setRawImage(null);
            setCaption("");
            setSecretMessage("");
            setUploadMode(null);
            setShowCropper(false);

            // Close dialog after successful post
            onSuccess?.();
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h2 className="text-2xl font-bold font-marker text-stone-800">Share a Memory</h2>

            {!uploadMode ? (
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setUploadMode("image")}
                        className="p-6 border-2 border-stone-200 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-all group"
                    >
                        <ImageIcon className="w-12 h-12 mx-auto mb-3 text-stone-600 group-hover:text-stone-800" />
                        <p className="font-bold text-stone-800">Upload Image</p>
                        <p className="text-xs text-stone-500 mt-1">Auto-convert to polaroid</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setUploadMode("polaroid")}
                        className="p-6 border-2 border-stone-200 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-all group"
                    >
                        <Camera className="w-12 h-12 mx-auto mb-3 text-stone-600 group-hover:text-stone-800" />
                        <p className="font-bold text-stone-800">Upload Polaroid</p>
                        <p className="text-xs text-stone-500 mt-1">Direct upload</p>
                    </button>
                </div>
            ) : showCropper && rawImage ? (
                <div>
                    <button
                        type="button"
                        onClick={handleCropCancel}
                        className="text-sm text-stone-600 hover:text-stone-800 mb-3 flex items-center gap-1"
                    >
                        ← Cancel Crop
                    </button>
                    <ImageCropper
                        imageSrc={rawImage}
                        onCropComplete={handleCropComplete}
                        onCancel={handleCropCancel}
                    />
                </div>
            ) : !image ? (
                <div>
                    <button
                        type="button"
                        onClick={() => setUploadMode(null)}
                        className="text-sm text-stone-600 hover:text-stone-800 mb-3"
                    >
                        ← Back
                    </button>
                    <FileUpload onImageSelect={handleImageSelect} />
                </div>
            ) : (
                <>
                    <div>
                        <button
                            type="button"
                            onClick={() => {
                                setImage(null);
                                setRawImage(null);
                            }}
                            className="text-sm text-stone-600 hover:text-stone-800 mb-3 flex items-center gap-1"
                        >
                            ← Change Image
                        </button>
                    </div>

                    <div className="relative">
                        <Image src={image} alt="Preview" width={500} height={500} className="w-full rounded-lg border-4 border-white shadow-md aspect-square object-cover" />
                    </div>

                    <div>
                        <label htmlFor="caption" className="block text-sm font-medium text-stone-700 mb-2">Caption</label>
                        <textarea
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="w-full p-3 border-2 border-stone-200 rounded-lg focus:border-stone-800 focus:ring-0 transition-colors font-handwriting text-xl text-stone-800"
                            placeholder="Write something about this moment..."
                            rows={3}
                            maxLength={40}
                        />
                        <p className="text-xs text-stone-400 mt-1 text-right">{caption.length}/40</p>
                    </div>

                    <div>
                        <label htmlFor="secretMessage" className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                            <MessageSquare className="w-4 h-4" />
                            Secret Message (Back of Polaroid)
                        </label>
                        <textarea
                            id="secretMessage"
                            value={secretMessage}
                            onChange={(e) => setSecretMessage(e.target.value)}
                            className="w-full p-3 border-2 border-stone-200 rounded-lg focus:border-stone-800 focus:ring-0 transition-colors font-handwriting text-lg text-stone-800"
                            placeholder="Write a secret message for the back..."
                            rows={3}
                            maxLength={100}
                        />
                        <p className="text-xs text-stone-400 mt-1 text-right">{secretMessage.length}/100</p>
                    </div>
                </>
            )}

            <Button
                type="submit"
                disabled={!image || isSubmitting}
                className="w-full bg-stone-900 text-white hover:bg-stone-800"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                    </>
                ) : (
                    "Post to Wall"
                )}
            </Button>
        </form>
    );
}

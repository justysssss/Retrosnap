"use client";

import { useState, useEffect } from "react";
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
    const [appliedFilter, setAppliedFilter] = useState<string | null>(null);

    // Check for polaroid from studio
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('from') === 'studio') {
            const polaroidData = sessionStorage.getItem('studioPolaroid');
            if (polaroidData) {
                const data = JSON.parse(polaroidData);
                setImage(data.imageSrc);
                setCaption(data.caption || "");
                setSecretMessage(data.secretMessage || "");
                setAppliedFilter(data.filter || null);
                setUploadMode("polaroid");
                // Clear the session storage
                sessionStorage.removeItem('studioPolaroid');
                // Clean up URL
                window.history.replaceState({}, '', '/public-wall');
            }
        }
    }, []);

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
        <form onSubmit={handleSubmit} className="space-y-3 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-stone-200">
            <h2 className="text-lg sm:text-xl font-bold font-marker text-stone-800">Share a Memory</h2>

            {!uploadMode ? (
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setUploadMode("image")}
                        className="p-4 border-2 border-stone-200 rounded-lg hover:border-stone-400 hover:bg-stone-50 transition-all group"
                    >
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-stone-600 group-hover:text-stone-800" />
                        <p className="font-bold text-sm text-stone-800">Upload Image</p>
                        <p className="text-xs text-stone-500 mt-0.5">Auto-convert</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setUploadMode("polaroid")}
                        className="p-4 border-2 border-stone-200 rounded-lg hover:border-stone-400 hover:bg-stone-50 transition-all group"
                    >
                        <Camera className="w-8 h-8 mx-auto mb-2 text-stone-600 group-hover:text-stone-800" />
                        <p className="font-bold text-sm text-stone-800">Upload Polaroid</p>
                        <p className="text-xs text-stone-500 mt-0.5">Direct upload</p>
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
                            className="text-xs text-stone-600 hover:text-stone-800 mb-2 flex items-center gap-1"
                        >
                            ← Change Image
                        </button>
                    </div>

                    <div className="relative">
                        <Image 
                            src={image} 
                            alt="Preview" 
                            width={400} 
                            height={400} 
                            className="w-full rounded-lg border-2 border-white shadow-md aspect-square object-cover" 
                            style={appliedFilter ? { filter: appliedFilter } : undefined}
                        />
                    </div>

                    <div>
                        <label htmlFor="caption" className="block text-xs font-medium text-stone-700 mb-1">Caption</label>
                        <textarea
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="w-full p-2 border-2 border-stone-200 rounded-lg focus:border-stone-800 focus:ring-0 transition-colors font-handwriting text-base text-stone-800"
                            placeholder="Write something about this moment..."
                            rows={2}
                            maxLength={40}
                        />
                        <p className="text-xs text-stone-400 mt-0.5 text-right">{caption.length}/40</p>
                    </div>

                    <div>
                        <label htmlFor="secretMessage" className="flex items-center gap-1.5 text-xs font-medium text-stone-700 mb-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Secret Message (Back)
                        </label>
                        <textarea
                            id="secretMessage"
                            value={secretMessage}
                            onChange={(e) => setSecretMessage(e.target.value)}
                            className="w-full p-2 border-2 border-stone-200 rounded-lg focus:border-stone-800 focus:ring-0 transition-colors font-handwriting text-sm text-stone-800"
                            placeholder="Write a secret message for the back..."
                            rows={2}
                            maxLength={100}
                        />
                        <p className="text-xs text-stone-400 mt-0.5 text-right">{secretMessage.length}/100</p>
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

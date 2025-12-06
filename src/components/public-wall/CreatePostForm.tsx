"use client";

import { useState } from "react";
import FileUpload from "../studio/FileUpload";
import { Button } from "../ui/button";
import { Loader2, Image as ImageIcon, Camera } from "lucide-react";

export default function CreatePostForm({ onSuccess }: { onSuccess?: () => void }) {
    const [image, setImage] = useState<string | null>(null);
    const [caption, setCaption] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadMode, setUploadMode] = useState<"image" | "polaroid" | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) return;

        setIsSubmitting(true);
        // TODO: Implement server action to save post
        // uploadMode === "image" means auto-convert to polaroid format
        // uploadMode === "polaroid" means direct upload (already in polaroid format)
        console.log("Submitting post:", { image, caption, uploadMode });

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setImage(null);
        setCaption("");
        setUploadMode(null);

        // Close dialog after successful post
        onSuccess?.();
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
            ) : !image ? (
                <div>
                    <button
                        type="button"
                        onClick={() => setUploadMode(null)}
                        className="text-sm text-stone-600 hover:text-stone-800 mb-3"
                    >
                        ← Back
                    </button>
                    <FileUpload onImageSelect={setImage} />
                </div>
            ) : (
                <div className="relative">
                    <img src={image} alt="Preview" className="w-full rounded-lg border-4 border-white shadow-md" />
                    <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div>
                <label htmlFor="caption" className="block text-sm font-medium text-stone-700 mb-2">Caption</label>
                <textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full p-3 border-2 border-stone-200 rounded-lg focus:border-stone-800 focus:ring-0 transition-colors font-handwriting text-xl text-stone-800"
                    placeholder="Write something about this moment..."
                    rows={3}
                />
            </div>

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

"use client";

import { useCallback } from "react";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
    onImageSelect: (imageSrc: string) => void;
}

export default function FileUpload({ onImageSelect }: FileUploadProps) {
    const handleFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    onImageSelect(result);
                };
                reader.readAsDataURL(file);
            }
        },
        [onImageSelect]
    );

    return (
        <div className="w-full max-w-md">
            <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-12 h-12 mb-4 text-stone-400" />
                    <p className="mb-2 text-lg text-stone-500 font-handwriting">
                        <span className="font-bold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-stone-400">SVG, PNG, JPG or GIF</p>
                </div>
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </label>
        </div>
    );
}

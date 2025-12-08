"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "../ui/button";

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedImage: string) => void;
    onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        width: 90,
        height: 90,
        x: 5,
        y: 5,
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const size = Math.min(width, height);
        const x = (width - size) / 2;
        const y = (height - size) / 2;

        setCrop({
            unit: "px",
            width: size,
            height: size,
            x: x,
            y: y,
        });
    };

    const handleCropComplete = async () => {
        // Use completedCrop if available, otherwise use current crop
        const cropToUse = completedCrop || {
            x: typeof crop.x === 'number' ? crop.x : 0,
            y: typeof crop.y === 'number' ? crop.y : 0,
            width: typeof crop.width === 'number' ? crop.width : 0,
            height: typeof crop.height === 'number' ? crop.height : 0,
            unit: crop.unit || 'px'
        } as PixelCrop;

        if (!imgRef.current || !cropToUse.width || !cropToUse.height) return;

        const image = imgRef.current;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Set canvas to 1:1 aspect ratio with a reasonable size
        const outputSize = 1024; // 1024x1024 output
        canvas.width = outputSize;
        canvas.height = outputSize;

        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            image,
            cropToUse.x * scaleX,
            cropToUse.y * scaleY,
            cropToUse.width * scaleX,
            cropToUse.height * scaleY,
            0,
            0,
            outputSize,
            outputSize
        );

        canvas.toBlob((blob) => {
            if (!blob) return;
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                onCropComplete(reader.result as string);
            };
        }, "image/jpeg", 0.95);
    };

    return (
        <div className="space-y-3">
            <div className="bg-stone-100 rounded-lg p-2 sm:p-3 overflow-auto max-h-[50vh]">
                <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    circularCrop={false}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        ref={imgRef}
                        src={imageSrc}
                        alt="Crop preview"
                        onLoad={onImageLoad}
                        className="max-w-full h-auto"
                    />
                </ReactCrop>
            </div>

            <div className="flex gap-3 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="border-stone-300 text-stone-700 hover:bg-stone-100"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleCropComplete}
                    className="bg-stone-900 text-white hover:bg-stone-800"
                >
                    Apply Crop
                </Button>
            </div>
        </div>
    );
}

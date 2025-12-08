"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Download } from "lucide-react";
import { DeleteButton } from "../deleteTS";

interface PostOptionsMenuProps {
    postId: string;
    postUserId: string;
    currentUserId?: string;
    imageUrl: string;
}

export default function PostOptionsMenu({
    postId,
    postUserId,
    currentUserId,
    imageUrl,
}: PostOptionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isOwner = currentUserId && currentUserId === postUserId;

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `retrosnap-${postId}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setIsOpen(false);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download image");
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* 3-dot button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-stone-700/50 rounded-full transition-colors text-stone-300 hover:text-white"
                aria-label="Post options"
            >
                <MoreVertical size={20} />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 bg-stone-800 border border-stone-700 rounded-lg shadow-xl overflow-hidden min-w-[160px] z-50">
                    <div className="py-1">
                        {/* Download button - available to everyone */}
                        <button
                            onClick={handleDownload}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-stone-200 hover:text-white hover:bg-stone-700/50 transition-colors"
                        >
                            <Download size={16} />
                            <span className="text-sm font-medium">Download</span>
                        </button>

                        {/* Delete button - only for post owner */}
                        {isOwner && (
                            <div
                                className="border-t border-stone-700"
                                onClick={() => setIsOpen(false)}
                            >
                                <DeleteButton postId={postId} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

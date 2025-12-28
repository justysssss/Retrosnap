"use client";

import { useState } from "react";
import { MoreVertical, Download, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { deletePost } from "@/lib/actions";

interface PostOptionsMenuProps {
    postId: string;
    postUserId: string;
    currentUserId?: string;
    imageUrl: string;
    onDownload: () => void;
}

export default function PostOptionsMenu({
    postId,
    postUserId,
    currentUserId,
    imageUrl,
    onDownload,
}: PostOptionsMenuProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deletePost(postId);

            if (result.error) {
                throw new Error(result.error);
            }

            toast.success("Post deleted successfully");
            // Refresh the page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post");
        } finally {
            setIsDeleting(false);
        }
    };

    const isOwner = currentUserId && postUserId === currentUserId;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700/90 transition-colors text-white"
                    title="Options"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onDownload} className="cursor-pointer">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                </DropdownMenuItem>
                {isOwner && (
                    <DropdownMenuItem
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {isDeleting ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

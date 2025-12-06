"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ReactionButton from "./ReactionButton";
import Image from "next/image";

interface Post {
    id: string;
    image: {
        fullUrl?: string;
        thumbnailUrl: string;
    };
    message?: string;
    user?: {
        name: string;
        image?: string;
    };
    reactionCount?: number;
}

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
}

export default function PostModal({ isOpen, onClose, post }: PostModalProps) {
    if (!post) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none overflow-visible">
                <DialogTitle className="sr-only">Post by {post.user?.name || "User"}</DialogTitle>

                {/* Vertical layout: Large Polaroid on top, interactions below */}
                <div className="flex flex-col items-center gap-6">
                    {/* Top: Large Polaroid Frame - Consistent size for all images */}
                    <div className="bg-white shadow-2xl relative w-[700px] max-w-[90vw]">
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 pointer-events-none z-10" />

                        {/* Polaroid content */}
                        <div className="p-10 pb-24">
                            {/* Image Section - fixed square aspect ratio for consistency */}
                            <div className="w-full aspect-square bg-stone-100 overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] z-0">
                                <Image
                                    src={post.image.fullUrl || post.image.thumbnailUrl}
                                    alt={post.message || "Post image"}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Caption in polaroid style */}
                            <div className="mt-8 flex items-center justify-center min-h-20">
                                {post.message && (
                                    <p className="text-stone-800 font-handwriting text-4xl leading-relaxed text-center line-clamp-2">
                                        {post.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom: User Info & Reactions Card */}
                    <div className="bg-stone-900/95 backdrop-blur-sm rounded-lg shadow-xl p-6 w-[700px] max-w-[90vw]">
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-6 flex-1">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={post.user?.image || "/default-avatar.png"}
                                        alt={post.user?.name || "User"}
                                        width={56}
                                        height={56}
                                        className="rounded-full border-2 border-stone-600"
                                    />
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{post.user?.name || "Anonymous"}</h3>
                                        <p className="text-sm text-stone-400">Shared a memory</p>
                                    </div>
                                </div>

                                <div className="ml-4">
                                    <ReactionButton />
                                </div>
                            </div>

                            {/* Right: Like Count */}
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-red-100 border-2 border-stone-900 flex items-center justify-center text-sm">❤️</div>
                                    <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-stone-900 flex items-center justify-center text-sm">👍</div>
                                </div>
                                <div className="text-left">
                                    <span className="text-lg text-white font-bold block">{post.reactionCount || 0}</span>
                                    <span className="text-xs text-stone-400 uppercase tracking-wider">likes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

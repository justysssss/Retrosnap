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
            <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl p-0 bg-transparent border-none shadow-none overflow-visible">
                <DialogTitle className="sr-only">Post by {post.user?.name || "User"}</DialogTitle>

                {/* Vertical layout: Large Polaroid on top, interactions below */}
                <div className="flex flex-col items-center gap-4 md:gap-6">
                    {/* Top: Large Polaroid Frame - Responsive size */}
                    <div className="bg-white shadow-2xl relative w-full max-w-[450px] sm:max-w-[500px] md:max-w-[550px]">
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 pointer-events-none z-10" />

                        {/* Polaroid content */}
                        <div className="p-5 pb-14 sm:p-6 sm:pb-16 md:p-8 md:pb-20">
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
                            <div className="mt-4 sm:mt-6 md:mt-8 flex items-center justify-center min-h-12 sm:min-h-16 md:min-h-20">
                                {post.message && (
                                    <p className="text-stone-800 font-handwriting text-lg sm:text-xl md:text-2xl leading-relaxed text-center line-clamp-2">
                                        {post.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom: User Info & Reactions Card */}
                    <div className="bg-stone-900/95 backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-5 md:p-6 w-full max-w-[450px] sm:max-w-[500px] md:max-w-[550px]">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={post.user?.image || "/default-avatar.png"}
                                        alt={post.user?.name || "User"}
                                        width={44}
                                        height={44}
                                        className="rounded-full border-2 border-stone-600"
                                    />
                                    <div>
                                        <h3 className="font-bold text-white text-sm sm:text-base md:text-lg">{post.user?.name || "Anonymous"}</h3>
                                        <p className="text-xs sm:text-sm text-stone-400">Shared a memory</p>
                                    </div>
                                </div>

                                <div className="ml-auto sm:ml-2">
                                    <ReactionButton postId={post.id} />
                                </div>
                            </div>

                            {/* Right: Like Count */}
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto sm:ml-0">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-red-100 border-2 border-stone-900 flex items-center justify-center text-xs sm:text-sm">❤️</div>
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-blue-100 border-2 border-stone-900 flex items-center justify-center text-xs sm:text-sm">👍</div>
                                </div>
                                <div className="text-left">
                                    <span className="text-base sm:text-lg text-white font-bold block">{post.reactionCount || 0}</span>
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

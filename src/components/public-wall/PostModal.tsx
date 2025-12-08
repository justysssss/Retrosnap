"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ReactionButton from "./ReactionButton";
import Image from "next/image";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import PostOptionsMenu from "./PostOptionsMenu";

interface Post {
    id: string;
    userId: string;
    image: {
        fullUrl?: string;
        thumbnailUrl: string;
    };
    message?: string;
    secretMessage?: string;
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
    currentUserId?: string;
}

export default function PostModal({ isOpen, onClose, post, currentUserId }: PostModalProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    if (!post) return null;

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (post.secretMessage) {
            setIsFlipped(!isFlipped);
        }
    };

    // Reset flip state when modal closes
    const handleClose = () => {
        setIsFlipped(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl p-0 bg-transparent border-none shadow-none overflow-visible">
                <DialogTitle className="sr-only">Post by {post.user?.name || "User"}</DialogTitle>

                {/* Vertical layout: Large Polaroid on top, interactions below */}
                <div className="flex flex-col items-center gap-4 md:gap-6">
                    {/* Top: Large Flippable Polaroid Frame */}
                    <div
                        className="relative w-full max-w-[450px] sm:max-w-[500px] md:max-w-[550px]"
                        style={{ perspective: "1000px" }}
                        onDoubleClick={handleDoubleClick}
                    >
                        {/* Top controls */}
                        <div className="absolute -top-10 right-0 z-50 flex items-center gap-2">
                            {/* Flip hint - show if secret message exists */}
                            {post.secretMessage && (
                                <button
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    className="flex items-center gap-2 text-white bg-stone-800/80 px-3 py-1.5 rounded-full text-xs hover:bg-stone-700/90 transition-colors"
                                    title="Flip polaroid"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    {isFlipped ? "View Front" : "View Back"}
                                </button>
                            )}

                            {/* Options menu - shows download for all, delete for owner */}
                            <PostOptionsMenu
                                postId={post.id}
                                postUserId={post.userId}
                                currentUserId={currentUserId}
                                imageUrl={post.image.fullUrl || post.image.thumbnailUrl}
                            />
                        </div>

                        <motion.div
                            className="w-full relative shadow-2xl"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            {/* Front Side */}
                            <div
                                className="bg-white relative w-full"
                                style={{
                                    backfaceVisibility: "hidden",
                                    WebkitBackfaceVisibility: "hidden",
                                }}
                            >
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

                            {/* Back Side */}
                            <div
                                className="absolute inset-0 bg-[#1a1a1a] p-8 sm:p-10 md:p-12 flex items-center justify-center"
                                style={{
                                    backfaceVisibility: "hidden",
                                    WebkitBackfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)",
                                }}
                            >
                                <div className="w-full h-full border-2 border-stone-700/50 border-dashed rounded-lg p-6 sm:p-8 flex items-center justify-center">
                                    {post.secretMessage ? (
                                        <p className="text-stone-200 font-handwriting text-xl sm:text-2xl md:text-3xl leading-relaxed text-center wrap-break-word">
                                            {post.secretMessage}
                                        </p>
                                    ) : (
                                        <p className="text-stone-500 font-handwriting text-lg sm:text-xl italic">
                                            No secret message...
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
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

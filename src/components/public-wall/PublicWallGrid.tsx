"use client";

import { useState } from "react";
import PostModal from "./PostModal";
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

interface PublicWallGridProps {
    posts: Post[];
}

export default function PublicWallGrid({ posts }: PublicWallGridProps) {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    return (
        <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-8 p-6 justify-items-center">
                {posts.map((post, index) => (
                    <div
                        key={`${post.id}-${index}`}
                        className="cursor-pointer group relative w-64"
                        onClick={() => setSelectedPost(post)}
                    >
                        {/* Pushpin SVG - positioned at top of polaroid frame */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-8 h-8 pointer-events-none">
                            <Image
                                src="/pushpin.svg"
                                alt="pin"
                                width={32}
                                height={32}
                                className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
                            />
                        </div>

                        {/* Polaroid Frame - 256px x 320px (w-64 h-80) */}
                        <div className="w-64 h-80 bg-white p-3 pb-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rotate-1 hover:rotate-0 transition-all duration-300 border border-stone-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:scale-[1.02] relative overflow-hidden">
                            {/* Paper Texture Overlay */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 pointer-events-none z-10" />

                            {/* Image - square aspect ratio matching studio */}
                            <div className="aspect-square bg-stone-100 overflow-hidden relative z-0 mb-3">
                                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] z-10 pointer-events-none" />
                                <Image
                                    src={post.image.thumbnailUrl}
                                    alt={post.message || "Post"}
                                    fill
                                    className="object-cover"
                                    loading="lazy"
                                />
                            </div>

                            {/* Caption area - only show if message exists */}
                            {post.message && (
                                <div className="flex-1 flex items-center justify-center px-2">
                                    <p className="font-handwriting text-2xl text-center text-stone-800 leading-tight wrap-break-word w-full line-clamp-2">
                                        {post.message}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <PostModal
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                post={selectedPost}
            />
        </>
    );
}

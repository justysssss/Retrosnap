"use client";

import { useState } from "react";
import PostModal from "./PostModal";
import FlippablePolaroid from "./FlippablePolaroid";

interface Post {
    id: string;
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

interface PublicWallGridProps {
    posts: Post[];
}

export default function PublicWallGrid({ posts }: PublicWallGridProps) {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 p-4 sm:p-6 justify-items-center">
                {posts.map((post, index) => (
                    <FlippablePolaroid
                        key={`${post.id}-${index}`}
                        post={post}
                        onClick={() => setSelectedPost(post)}
                    />
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

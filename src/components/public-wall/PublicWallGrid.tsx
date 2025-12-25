"use client";

import { useState } from "react";
import PostModal from "./PostModal";
import FlippablePolaroid from "./FlippablePolaroid";

export interface Post {
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
  userReaction?: string,
}

interface PublicWallGridProps {
  posts: Post[];
  currentUserId?: string;
}

export default function PublicWallGrid({ posts, currentUserId }: PublicWallGridProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  console.log("The selectedPost reaction is:", selectedPost?.userReaction)

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
        currentUserId={currentUserId}
      />
    </>
  );
}

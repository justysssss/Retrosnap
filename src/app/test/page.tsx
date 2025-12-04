import { getGlobalFeed } from "@/lib/actions";
import Link from "next/link";

export default async function FeedPage() {
  // 1. Fetch data on the server
  const { data: posts } = await getGlobalFeed();

  return (
    <div className="max-w-xl mx-auto py-10 space-y-8">
      {posts.map(({ post, image, user, reactionCount }) => (
        <div key={post.id} className="border rounded-xl overflow-hidden bg-white shadow-sm">

          {/* Header */}
          <div className="flex items-center p-3 gap-3">
            <img
              src={user.image || "/default-avatar.png"}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-semibold text-sm">{user.name}</span>
          </div>

          {/* Image - Using Aspect Ratio to prevent layout shift */}
          {/* Note: We use <img> for simplicity with external URLs, 
              or Next.js <Image> if you configure domains in next.config.js */}
          <div
            className="relative w-full bg-gray-100"
            style={{ aspectRatio: image.aspectRatio || 1 }}
          >
            <img
              src={image.thumbnailUrl!} // Load the 720px version
              alt={post.message || "Post image"}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>

          {/* Footer */}
          <div className="p-3">
            <div className="flex gap-4 mb-2">
              <button>❤️ {reactionCount}</button>
              <button>💬 Comment</button>
            </div>
            <p>
              <span className="font-bold mr-2">{user.name}</span>
              {post.message}
            </p>
          </div>

        </div>
      ))}
    </div>
  );
}

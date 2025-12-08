import { getGlobalFeed } from "@/lib/actions";
import PublicWallGrid from "@/components/public-wall/PublicWallGrid";
import AddMemoryDialog from "@/components/public-wall/AddMemoryDialog";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function PublicWallPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const { data: posts } = await getGlobalFeed();

    // Debug logging
    console.log("Current user ID:", session?.user?.id);
    console.log("First post user ID:", posts?.[0]?.user?.id);

    // Transform data to match Post interface
    const transformedPosts = posts?.map((item) => ({
        id: item.post.id,
        userId: item.user.id,
        image: {
            thumbnailUrl: item.image.thumbnailUrl || "",
            fullUrl: item.image.fullUrl || undefined,
        },
        message: item.post.message || undefined,
        secretMessage: item.post.secretMessage || undefined,
        user: {
            name: item.user.name,
            image: item.user.image || undefined,
        },
        reactionCount: item.reactionCount,
    })) || [];

    return (
        <div className="min-h-screen bg-[#fdfbf7] dark:bg-stone-950 pt-20 pb-10 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] bg-size-[16px_16px] opacity-50 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-marker text-stone-900 dark:text-stone-100">Public Wall</h1>

                    <AddMemoryDialog />
                </div>

                <PublicWallGrid
                    posts={transformedPosts}
                    currentUserId={session?.user?.id}
                />
            </div>
        </div>
    );
}

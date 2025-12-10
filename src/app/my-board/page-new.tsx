import { getPrivateFeed } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import MyBoardClient from "@/components/my-board/MyBoardClient";
import { Polaroid } from "@/types/studio";

export default async function MyBoardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please log in to view your board</p>
            </div>
        );
    }

    const { data: posts } = await getPrivateFeed(20, 0, session.user.id);

    // Transform backend data to Polaroid format
    const polaroids: Polaroid[] = posts?.map((item) => ({
        id: item.post.id,
        imageSrc: item.image.thumbnailUrl || item.image.fullUrl || "",
        x: 0,
        y: 0,
        rotation: 0,
        caption: item.post.message || "",
        filter: "none",
        isFlipped: false,
        secretMessage: item.post.secretMessage || "",
        timestamp: new Date(item.post.createdAt).getTime(),
    })) || [];

    return <MyBoardClient initialPolaroids={polaroids} userId={session.user.id} />;
}

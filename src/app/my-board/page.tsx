import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MyBoard from "@/components/my-board/MyBoard"; // Ensure this path is correct
import { getBoard, getPrivateFeed } from "@/lib/actions"; // Verify if this is the correct path for feed actions
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Polaroid } from "@/types/studio";
import { BoardData } from "@/types/board"; // <--- Import the type for casting

export default async function MyBoardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  let polaroids: Polaroid[] = [];
  let boardData: BoardData | null = null; // <--- 2. Explicitly type the variable

  if (session) {
    // Run fetches in parallel for better performance
    const [feedResult, boardResult] = await Promise.all([
      getPrivateFeed(20, 0, session.user.id),
      getBoard() // <--- 3. Fetch the board settings/decorations
    ]);

    const posts = feedResult.data;

    // 4. FIX: Cast the DB result (generic strings) to your strict BoardData type
    // We use 'unknown' first because 'string' cannot be directly cast to 'BoardBackground' without validation
    if (boardResult) {
      boardData = boardResult as unknown as BoardData;
    }

    // Transform backend data to Polaroid format
    polaroids = posts?.map((item) => ({
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
  }

  return (
    <div className="min-h-screen font-poppins transition-colors duration-500 bg-[#f0f0f0] dark:bg-stone-900 p-4 md:p-8">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-50 dark:opacity-20 pointer-events-none"
        style={{ backgroundImage: 'url("/paper-texture.png")' }} />

      {/* Dot Pattern */}
      <div className="fixed inset-0 pointer-events-none text-stone-300 dark:text-stone-700 opacity-50 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative max-w-[1600px] mx-auto z-10">
        <header className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-stone-200 dark:border-stone-800"
          >
            <ArrowLeft className="w-6 h-6 text-stone-800 dark:text-stone-200" />
          </Link>
        </header>

        {!session ? (
          <div className="text-center py-20">
            <p className="text-xl text-stone-600 dark:text-stone-400">
              Please log in to view your private board
            </p>
          </div>
        ) : (
          <MyBoard
            initialPolaroids={polaroids}
            initialBoardData={boardData} // <--- 5. Pass the strictly typed data
          />
        )}
      </div>
    </div>
  );
}

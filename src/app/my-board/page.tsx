import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MyBoard from "@/components/my-board/MyBoard";

export default function MyBoardPage() {
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
                    {/* Title is now handled inside MyBoard for better state integration */}
                </header>

                <MyBoard />
            </div>
        </div>
    );
}

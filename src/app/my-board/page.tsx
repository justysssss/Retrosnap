import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MyBoard from "@/components/my-board/MyBoard";

export default function MyBoardPage() {
    return (
        <div className="min-h-screen paper-texture p-4 md:p-8">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-8 flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2 rounded-full hover:bg-stone-200 transition-colors bg-white/50 backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-6 h-6 text-stone-800" />
                    </Link>
                    <h1 className="text-4xl font-marker text-stone-800">My Private Board</h1>
                </header>

                <MyBoard />
            </div>
        </div>
    );
}

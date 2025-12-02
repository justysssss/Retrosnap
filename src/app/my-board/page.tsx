import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MyBoardPage() {
    return (
        <div className="min-h-screen paper-texture p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2 rounded-full hover:bg-stone-200 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-stone-800" />
                    </Link>
                    <h1 className="text-4xl font-marker text-stone-800">My Private Board</h1>
                </header>

                <div className="bg-stone-200/50 border-4 border-stone-300 border-dashed rounded-xl h-[600px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <p className="text-2xl font-handwriting text-stone-500">
                            Your private corkboard is coming soon...
                        </p>
                        <p className="text-stone-400">
                            (Drag and drop functionality to be implemented)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

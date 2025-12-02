import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PublicWallPage() {
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
                    <h1 className="text-4xl font-marker text-stone-800">Public Wall</h1>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {/* Placeholder Items */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="bg-white p-3 pb-12 shadow-lg transform hover:-translate-y-1 transition-transform duration-300 rotate-1 hover:rotate-0"
                        >
                            <div className="aspect-square bg-stone-100 mb-3 animate-pulse" />
                            <div className="h-4 bg-stone-100 rounded w-3/4 mx-auto animate-pulse" />
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-2xl font-handwriting text-stone-500">
                        Connect with the community soon...
                    </p>
                </div>
            </div>
        </div>
    );
}

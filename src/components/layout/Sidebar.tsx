"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Image, LayoutGrid } from "lucide-react";
import { clsx } from "clsx";

const NAV_ITEMS = [
    { name: "Studio", href: "/studio", icon: Camera },
    { name: "My Board", href: "/my-board", icon: LayoutGrid },
    { name: "Public Wall", href: "/public-wall", icon: Image },
]; export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-stone-900 text-stone-100 flex flex-col z-50 shadow-2xl transition-all duration-300">
            <Link href="/" className="p-6 flex items-center gap-3 border-b border-stone-800 hover:bg-stone-800 transition-colors">
                <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse" />
                <span className="font-marker text-2xl hidden md:block">RetroSnap</span>
            </Link>

            <nav className="flex-1 py-8 space-y-2 px-2 md:px-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-yellow-400 text-stone-900 font-bold shadow-lg transform scale-105"
                                    : "hover:bg-stone-800 text-stone-400 hover:text-stone-100"
                            )}
                        >
                            <item.icon className={clsx("w-6 h-6", isActive && "animate-bounce")} />
                            <span className="hidden md:block font-handwriting text-xl">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-stone-800 hidden md:block">
                <p className="text-xs text-stone-500 text-center font-mono">
                    v1.0.0 • Beta
                </p>
            </div>
        </aside>
    );
}

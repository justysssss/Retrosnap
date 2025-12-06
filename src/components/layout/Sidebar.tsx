"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Camera, Image, LayoutGrid, Settings, LogOut } from "lucide-react";
import { clsx } from "clsx";
import { authClient } from "@/lib/auth-client";

const NAV_ITEMS = [
    { name: "Studio", href: "/studio", icon: Camera },
    { name: "My Board", href: "/my-board", icon: LayoutGrid },
    { name: "Public Wall", href: "/public-wall", icon: Image },
    { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
    };

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

            <div className="p-4 border-t border-stone-800 flex flex-col gap-4">
                {session?.user && (
                    <div className="flex items-center gap-3 px-2 hidden md:flex">
                        {session.user.image ? (
                            <img
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-full border-2 border-stone-700 object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center text-stone-300 font-bold border-2 border-stone-600">
                                {session.user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold truncate text-stone-200">
                                {session.user.name}
                            </span>
                            <span className="text-xs text-stone-500 truncate">
                                {session.user.email}
                            </span>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 cursor-pointer py-2 rounded-xl hover:bg-red-900/20 text-stone-400 hover:text-red-400 transition-all duration-200 w-full"
                >
                    <LogOut className="w-6 h-6" />
                    <span className="hidden md:block font-handwriting text-xl">Logout</span>
                </button>

                <p className="text-xs text-stone-500 text-center font-mono hidden md:block">
                    v1.0.0 • Beta
                </p>
            </div>
        </aside>
    );
}

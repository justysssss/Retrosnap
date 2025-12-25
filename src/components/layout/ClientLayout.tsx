"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { clsx } from "clsx";
import { Toaster } from "sonner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    return (
        <div className="flex min-h-screen">
            {!isHomePage && <Sidebar />}
            <main className={clsx("flex-1 transition-all duration-300", !isHomePage && "ml-20 xl:ml-64")}>
                {children}
            </main>
            <Toaster />
        </div>
    );
}

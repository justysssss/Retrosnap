"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface SignInDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    callbackURL?: string;
}

function GoogleLogo() {
    return (
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
            <path fill="#EA4335" d="M12 11v3h7.1c-.3 1.8-2.1 5-7.1 5-4.3 0-7.8-3.6-7.8-8s3.5-8 7.8-8c2.4 0 4 1 4.9 1.9l2.1-2.1C17.6 1.3 15 .5 12 .5 5.7.5.6 5.6.6 12s5.1 11.5 11.4 11.5c6.6 0 10.9-4.6 10.9-11 0-.7-.1-1.3-.2-1.9H12z" />
            <path fill="#34A853" d="M3.2 7.3l3.3 2.4C7.5 7.2 9.6 5.5 12 5.5c2.4 0 3.9 1 4.8 1.8l2.1-2.1C17.6 3.4 15.5 2.5 12 2.5 7.9 2.5 4.4 4.9 3.2 7.3z" opacity=".001" />
            <path fill="#FBBC05" d="M12 22.5c3.5 0 6.5-1.2 8.6-3.2l-2.5-2.1c-1.2 1.1-2.9 1.8-5.1 1.8-4 0-7.4-2.6-8.6-6.1l-3.3 2.5c1.9 4.6 6.2 7.1 10.9 7.1z" />
            <path fill="#4285F4" d="M23 12c0-.7-.1-1.3-.2-1.9H12v3h6.9c-.3 1.8-2 5-6.9 5-3.9 0-7.2-3.1-7.8-7.1l-3.3 2.5C2.7 18.8 6.9 22.5 12 22.5c6.6 0 11-4.6 11-10.5z" />
        </svg>
    );
}

export default function SignInDialog({ open, onOpenChange, callbackURL = "/studio" }: SignInDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleSignInGoogle = async () => {
        try {
            setLoading(true);
            const result = await authClient.signIn.social({ provider: "google", callbackURL });
            if (result?.error) {
                console.error(result.error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-xl bg-[#fdfbf7] border-4 border-stone-900 rounded-lg shadow-[12px_12px_0_0_#1c1917] p-0"
            >
                {/* Header with pattern */}
                <div className="relative px-6 py-6 border-b-4 border-stone-900 bg-pink-200">
                    <div className="absolute inset-0 opacity-50 [background:radial-gradient(circle,_rgba(0,0,0,0.3)_1px,_transparent_1px)] [background-size:12px_12px]" />
                    <div className="relative flex items-center gap-4">
                        <div className="bg-white border-4 border-stone-900 rounded-md p-3 shadow-[6px_6px_0_0_#1c1917]">
                            <Camera className="size-8 text-stone-900" />
                        </div>
                        <DialogHeader className="flex-1">
                            <DialogTitle className="text-2xl md:text-3xl font-black tracking-wide text-stone-900">MEMBER ACCESS</DialogTitle>
                        </DialogHeader>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-8">
                    <p className="text-center text-stone-700 font-semibold mb-6">Unlock your creative studio.</p>

                    <div className="flex justify-center">
                        <Button
                            onClick={handleSignInGoogle}
                            disabled={loading}
                            className="w-full max-w-md justify-center gap-3 bg-white text-stone-900 border-4 border-stone-900 rounded-md shadow-[6px_6px_0_0_#1c1917] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-stone-100"
                        >
                            <GoogleLogo />
                            <span className="font-semibold">{loading ? "Connecting…" : "Continue with Google"}</span>
                        </Button>
                    </div>

                    <p className="mt-6 text-center text-stone-500 text-xs tracking-widest">SECURE • FAST • RETRO</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}

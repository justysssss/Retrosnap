"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { Camera } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignInGoogle = async () => {
    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/studio",
    });
    console.log(result);
    if (result.error) {
      console.log("Error while Login");
    } else {
      console.log(result.data);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffc0d3] border-b-4 border-stone-900">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo - Styled to match the image font (Geometric Sans) */}
          <div className="flex items-center gap-2">
            <span
              className="text-3xl tracking-tighter font-bold text-stone-900 select-none"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Retrosnap
            </span>
          </div>

          {/* Right side - Login Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-stone-900 text-[#ffc0d3] px-6 py-2 cursor-pointer rounded-none font-bold hover:bg-stone-800 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-stone-900"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Login Dialog - Retro/Polaroid Themed */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#fdfbf7] border-4 border-stone-900 rounded-none shadow-[12px_12px_0px_0px_rgba(28,25,23,1)] p-0 overflow-hidden max-w-sm sm:max-w-md gap-0">

          {/* Header Strip */}
          <div className="bg-[#ffc0d3] p-6 border-b-4 border-stone-900 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
            </div>

            <div className="relative z-10 bg-white p-3 border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
              <Camera className="w-8 h-8 text-stone-900" />
            </div>
            <DialogHeader className="mt-4 relative z-10">
              <DialogTitle className="text-3xl font-black text-stone-900 text-center tracking-tighter uppercase">
                Member Access
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-8 flex flex-col items-center gap-6 bg-[url('/paper-texture.png')]">
            <p className="text-center text-stone-600 font-bold text-lg">
              Unlock your creative studio.
            </p>

            <Button
              onClick={handleSignInGoogle}
              className="w-full bg-white border-2 cursor-pointer border-stone-900 text-stone-900 hover:bg-stone-50 py-6 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all flex items-center justify-center gap-3 rounded-none"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>

            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">
              Secure • Fast • Retro
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
// filepath: d:\Coding\retrosnap\src\components\landing\Header.tsx

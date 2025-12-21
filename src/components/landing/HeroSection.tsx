"use client";
"use no memo";

import { useRef, useEffect, useMemo, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

const images = [
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300&auto=format&fit=crop",
];

interface FloatingPolaroidProps {
  src: string;
  index: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

// Scattered positions over text - much wider spread
const polaroidPositions = [
  { top: "30%", left: "35%", initialRotation: -12 },
  { top: "28%", left: "62%", initialRotation: 8 },
  { top: "40%", left: "45%", initialRotation: 15 },
  { top: "42%", left: "28%", initialRotation: -18 },
  { top: "45%", left: "68%", initialRotation: 6 },
  { top: "52%", left: "50%", initialRotation: -10 },
  { top: "58%", left: "38%", initialRotation: 14 },
  { top: "60%", left: "60%", initialRotation: -8 },
  { top: "48%", left: "25%", initialRotation: 20 },
  { top: "35%", left: "72%", initialRotation: -15 },
];

function FloatingPolaroid({ src, index, containerRef }: FloatingPolaroidProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Use fixed position from array instead of random - wrapped in useMemo to prevent dependency changes
  const initialPos = useMemo(() =>
    polaroidPositions[index] || { top: "50%", left: "50%", initialRotation: 0 },
    [index]
  );

  const rotate = useMotionValue(initialPos.initialRotation);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate current position (initial + offset)
      const currentX = rect.width * (parseFloat(initialPos.left) / 100) + x.get();
      const currentY = rect.height * (parseFloat(initialPos.top) / 100) + y.get();

      const distX = mouseX - currentX;
      const distY = mouseY - currentY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      const maxDist = 200;

      if (distance < maxDist) {
        const angle = Math.atan2(distY, distX);
        // Push away continuously with stronger force
        const pushForce = ((maxDist - distance) / maxDist) * 30;
        const moveX = -Math.cos(angle) * pushForce;
        const moveY = -Math.sin(angle) * pushForce;

        x.set(x.get() + moveX);
        y.set(y.get() + moveY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [initialPos, containerRef, x, y]);

  const springX = useSpring(x, { stiffness: 120, damping: 30 });
  const springY = useSpring(y, { stiffness: 120, damping: 30 });

  // Memoize style object to satisfy React Compiler
  const positionStyle = useMemo(() => ({
    top: initialPos.top,
    left: initialPos.left,
  }), [initialPos.top, initialPos.left]);

  return (
    <div
      className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={positionStyle}
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
          rotate: rotate,
        }}
        className="w-24 md:w-40 p-2 md:p-3 bg-white shadow-xl transform-gpu"
      >
        <div className="aspect-4/5 bg-gray-200 overflow-hidden mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Polaroid" className="w-full h-full object-cover pointer-events-none" />
        </div>
        <div className="h-3 md:h-4 bg-transparent" />
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const handleSignInGoogle = async () => {
    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/studio",
    });
    // Optional: handle errors or log
    if (result?.error) {
      console.log("Error while Login");
    }
  };

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Light gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#ffe8d1] via-[#ffe0e8] to-[#e8dcff]" />

      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-20 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] mix-blend-overlay"></div>

      {/* Soft center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[radial-gradient(circle,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_70%)] pointer-events-none" />

      {/* Background Text */}
      {/* Z-Index lowered to 30 so polaroids (Z-40) float ABOVE it */}
      <div className="relative z-30 text-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-auto"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-marker text-stone-900 tracking-tighter mb-6 leading-none drop-shadow-sm select-none">
            RETRO
            <span className="text-orange-600 inline-block transform -rotate-2">SNAP</span>
          </h1>
          <p className="text-lg md:text-2xl text-stone-600 font-handwriting max-w-2xl mx-auto mb-10 rotate-1 select-none">
            Capture moments. Relive memories. <br /> The digital way to go analog.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-3 bg-stone-900 text-[#f0ebe6] px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-600 hover:scale-105 transition-all duration-300 shadow-2xl border-4 border-transparent hover:border-stone-900 z-50 pointer-events-auto cursor-pointer"
          >
            Start Creating <ArrowRight size={24} />
          </button>
        </motion.div>
      </div>

      {/* Scattered Polaroids */}
      {/* Z-Index increased to 40 so they cover the text (interaction pushes them away) */}
      <div className="absolute inset-0 z-40 overflow-hidden pointer-events-none">
        {images.map((src, i) => (
          <FloatingPolaroid key={i} src={src} index={i} containerRef={containerRef} />
        ))}
      </div>

      {/* Login Dialog - Copy from Header for exact match */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#fdfbf7] border-4 border-stone-900 rounded-none shadow-[12px_12px_0px_0px_rgba(28,25,23,1)] p-0 overflow-hidden max-w-sm sm:max-w-md gap-0">

          {/* Header Strip */}
          <div className="bg-[#ffc0d3] p-6 border-b-4 border-stone-900 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

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
            <p className="text-center text-stone-600 font-bold text-lg">Unlock your creative studio.</p>

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

            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Secure • Fast • Retro</p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
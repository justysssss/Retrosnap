"use client";
"use no memo";

import { useRef, useEffect, useMemo } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
          <Link href="/studio" className="inline-flex items-center gap-3 bg-stone-900 text-[#f0ebe6] px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-600 hover:scale-105 transition-all duration-300 shadow-2xl border-4 border-transparent hover:border-stone-900 z-50 pointer-events-auto">
            Start Creating <ArrowRight size={24} />
          </Link>
        </motion.div>
      </div>

      {/* Scattered Polaroids */}
      {/* Z-Index increased to 40 so they cover the text (interaction pushes them away) */}
      <div className="absolute inset-0 z-40 overflow-hidden pointer-events-none">
        {images.map((src, i) => (
          <FloatingPolaroid key={i} src={src} index={i} containerRef={containerRef} />
        ))}
      </div>
    </section>
  );
}
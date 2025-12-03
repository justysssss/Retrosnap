"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden flex items-center justify-center">
      {/* Vibrant Gradient Background matching the user's reference image */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" />
      
      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <div className="container mx-auto px-4 relative z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl md:text-9xl font-marker mb-8 drop-shadow-md">
            Start Snapping
          </h2>
          <p className="text-2xl md:text-3xl font-handwriting mb-12 max-w-2xl mx-auto drop-shadow-sm">
            Join thousands of creators turning their digital clutter into beautiful, tangible memories.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link 
              href="/studio" 
              className="px-10 py-5 bg-white text-stone-900 text-xl font-bold rounded-full shadow-lg hover:bg-stone-100 hover:scale-105 transition-all transform hover:-rotate-1"
            >
              Open Studio
            </Link>
            <Link 
              href="/gallery" 
              className="px-10 py-5 border-4 border-white text-white text-xl font-bold rounded-full hover:bg-white/10 transition-colors"
            >
              Explore Gallery
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Floating Elements (Abstract shapes) */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-64 h-64 border-4 border-white/20 rounded-full border-dashed" 
      />
      <motion.div 
        animate={{ rotate: -360 }} 
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -right-20 w-96 h-96 border-4 border-white/20 rounded-full border-dashed" 
      />
    </section>
  );
}
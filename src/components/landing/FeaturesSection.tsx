"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, Palette, Sticker } from "lucide-react";

const features = [
  {
    title: "Retro Filters",
    desc: "Authentic film grain, light leaks, and color grading inspired by 80s instant film.",
    icon: Sparkles,
    img: "https://images.unsplash.com/photo-1495571434110-38c20573e86c?q=80&w=400&fit=crop",
  },
  {
    title: "Multiplayer Canvas",
    desc: "Invite friends to a shared corkboard. Drag, drop, and stack photos in real-time.",
    icon: Users,
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&fit=crop",
  },
  {
    title: "Handwritten Notes",
    desc: "Use your mouse or stylus to scribble captions on the chin of your polaroids.",
    icon: Palette,
    img: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400&fit=crop",
  },
  {
    title: "Digital Stickers",
    desc: "Decorate your snaps with washi tape, stamps, and fun retro stickers.",
    icon: Sticker,
    img: "https://images.unsplash.com/photo-1615822365985-3e28447817eb?q=80&w=400&fit=crop",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-[#e8e4dc]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-marker text-stone-900 mb-4">
              Everything you need to <span className="text-orange-600">get creative.</span>
            </h2>
            <p className="text-xl text-stone-600 font-handwriting">
              Not just a photo app. A digital scrapbooking studio.
            </p>
          </div>
          <button className="px-6 py-2 border-2 border-stone-900 rounded-full font-bold hover:bg-stone-900 hover:text-white transition-colors">
            View all features
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white border-4 border-white shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Image Side */}
                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden relative">
                    <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors z-10"/>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={feature.img} 
                    alt={feature.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                {/* Content Side */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center bg-[url('https://www.transparenttextures.com/patterns/dust.png')]">
                  <feature.icon className="w-10 h-10 text-stone-800 mb-4" />
                  <h3 className="text-2xl font-bold font-sans text-stone-900 mb-2">{feature.title}</h3>
                  <p className="text-stone-600 font-handwriting text-xl leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
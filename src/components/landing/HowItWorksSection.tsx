"use client";

import { motion } from "framer-motion";
import { Camera, Image as ImageIcon, Share2 } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Snap It",
    desc: "Upload your digital photos or use your webcam to capture the moment.",
    color: "bg-blue-100",
    rotate: "-rotate-3",
  },
  {
    icon: ImageIcon,
    title: "Develop It",
    desc: "Apply retro filters, add handwritten notes, and shake to develop!",
    color: "bg-orange-100",
    rotate: "rotate-2",
  },
  {
    icon: Share2,
    title: "Pin It",
    desc: "Stick it on your collaborative board or share it with the world.",
    color: "bg-pink-100",
    rotate: "-rotate-1",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-stone-50 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-40"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block py-1 px-3 border-2 border-stone-800 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-white">
            Process
          </span>
          <h2 className="text-4xl md:text-5xl font-marker text-stone-900">
            From Digital to Analog
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 border-t-4 border-dashed border-stone-300 -z-10 transform -translate-y-1/2" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className={`flex flex-col items-center text-center ${step.rotate}`}
            >
              <div className={`w-32 h-32 ${step.color} rounded-full border-4 border-stone-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] mb-6`}>
                <step.icon size={48} className="text-stone-900" strokeWidth={1.5} />
              </div>
              <div className="bg-white p-6 shadow-lg border-2 border-stone-100 rotate-1 max-w-xs transform hover:scale-105 transition-transform">
                <h3 className="text-2xl font-bold font-marker mb-3 text-stone-800">{step.title}</h3>
                <p className="text-stone-600 font-handwriting text-xl leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
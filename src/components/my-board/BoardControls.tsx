"use client";

import Image from "next/image";
import { X, Sticker, Type, Save, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import RetroButton from "@/components/ui/RetroButton";
import { ClipVariant, DecorationType } from "@/types/board";

interface BoardControlsProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDecoration: (type: DecorationType, src: string) => void;
  wireColor: string;
  setWireColor: (c: string) => void;
  clipColor: string;
  setClipColor: (c: string) => void;
  clipVariant?: ClipVariant;
  setClipVariant?: (v: ClipVariant) => void;
  onSave: () => void;
  isSaving?: boolean;
}

const STICKERS = [
  { name: "Cat", src: "/Assets/Loader%20cat.lottie", type: "lottie" },
  { name: "Dog", src: "/Assets/Happy%20Dog.lottie", type: "lottie" },
  { name: "Plant", src: "/Assets/Hanging%20Plant%20-%20Gently%20Swinging.lottie", type: "lottie" },
  { name: "8bit Cat", src: "/Assets/8-bit%20Cat.lottie", type: "lottie" },
  { name: "Star", src: "⭐", type: "emoji" },
  { name: "Heart", src: "❤️", type: "emoji" },
];

export default function BoardControls({
  isOpen,
  onClose,
  onAddDecoration,
  wireColor,
  setWireColor,
  clipColor,
  setClipColor,
  clipVariant = "wood",
  setClipVariant,
  onSave,
  isSaving = false
}: BoardControlsProps) {

  return (
    <div className={clsx(
      "fixed top-0 right-0 h-full w-80 bg-white dark:bg-stone-800 shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto border-l border-stone-200 dark:border-stone-700 flex flex-col",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-marker text-2xl text-stone-800 dark:text-stone-200">Decorate</h3>
          <RetroButton variant="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </RetroButton>
        </div>

        <div className="space-y-8">
          {/* Stickers Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
              <Sticker className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Stickers</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STICKERS.map((sticker) => (
                <button
                  key={sticker.name}
                  onClick={() => onAddDecoration(sticker.type as DecorationType, sticker.src)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-stone-100 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-500 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-all group"
                >
                  <div className="w-16 h-16 mb-2 flex items-center justify-center bg-stone-100 dark:bg-stone-900 rounded-lg group-hover:scale-110 transition-transform overflow-hidden relative">
                    {sticker.type === "sticker" ? (
                      <Image src={sticker.src} alt={sticker.name} fill className="object-contain p-2" />
                    ) : sticker.type === "emoji" ? (
                      <span className="text-4xl">{sticker.src}</span>
                    ) : (
                      // @ts-ignore - dotlottie-player is a web component
                      <dotlottie-player
                        src={sticker.src}
                        background="transparent"
                        speed="1"
                        className="w-full h-full"
                        loop
                        autoplay
                      />
                    )}
                  </div>
                  <span className="text-sm font-medium text-stone-600 dark:text-stone-300">{sticker.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colors Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
              <Type className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Colors</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Wire Color</span>
                <div className="flex items-center gap-2 relative mt-1">
                  <div className="w-8 h-8 rounded-full border border-stone-200 shadow-sm" style={{ backgroundColor: wireColor }} />
                  <input
                    type="color"
                    value={wireColor}
                    onChange={(e) => setWireColor(e.target.value)}
                    className="opacity-0 absolute w-8 h-8 cursor-pointer inset-0"
                    aria-label="Choose wire color"
                  />
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Clip Color</span>
                <div className="flex items-center gap-2 relative mt-1">
                  <div className="w-8 h-8 rounded-full border border-stone-200 shadow-sm" style={{ backgroundColor: clipColor }} />
                  <input
                    type="color"
                    value={clipColor}
                    onChange={(e) => setClipColor(e.target.value)}
                    className="opacity-0 absolute w-8 h-8 cursor-pointer inset-0"
                    aria-label="Choose clip color"
                  />
                </div>
              </div>

              {/* Pin/Clip Style Selector */}
              {setClipVariant && (
                <div>
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 block">Pin Style</span>
                  <div className="flex gap-2">
                    {(["wood", "metal", "plastic"] as ClipVariant[]).map((variant) => (
                      <button
                        key={variant}
                        onClick={() => setClipVariant(variant)}
                        className={clsx(
                          "flex-1 px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium capitalize",
                          clipVariant === variant
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600"
                        )}
                      >
                        {variant}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
        <RetroButton
          onClick={onSave}
          className="w-full justify-center gap-2"
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </RetroButton>
      </div>
    </div>
  );
}

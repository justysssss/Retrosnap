"use client";

import Image from "next/image";
import { X, Sticker, Type, Palette, Save, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import RetroButton from "@/components/ui/RetroButton";
import {
  ClipVariant,
  DecorationType,
  BoardBackground,
  BoardFrameType
} from "@/types/board";

interface BoardControlsProps {
  isOpen: boolean;
  onClose: () => void;

  // Actions
  onAddDecoration: (type: DecorationType, src: string) => void;
  onSave: () => void;
  isSaving?: boolean;

  // State Props
  wireColor: string;
  setWireColor: (c: string) => void;
  clipColor: string;
  setClipColor: (c: string) => void;
  clipVariant: ClipVariant;
  setClipVariant: (v: ClipVariant) => void;

  // New Style Props
  background: BoardBackground;
  setBackground: (b: BoardBackground) => void;
  frame: BoardFrameType;
  setFrame: (f: BoardFrameType) => void;
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
  isOpen, onClose, onAddDecoration, onSave, isSaving = false,
  wireColor, setWireColor, clipColor, setClipColor, clipVariant, setClipVariant,
  background, setBackground, frame, setFrame
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

          {/* 1. Board Style Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
              <Palette className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Board Style</span>
            </div>

            <div className="space-y-4">
              {/* Background Selector */}
              <div>
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300 block mb-2">Background</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["cork", "white", "grid", "dots", "felt-gray", "felt-green"] as BoardBackground[]).map(bg => (
                    <button
                      key={bg}
                      onClick={() => setBackground(bg)}
                      aria-label={`Select ${bg} background`}
                      className={clsx(
                        "h-10 rounded border-2 transition-all text-xs font-medium capitalize",
                        background === bg ? "border-blue-500 ring-1 ring-blue-500" : "border-stone-200",
                        bg === 'cork' && "bg-[#e0c097]",
                        bg === 'felt-green' && "bg-emerald-800",
                        bg === 'felt-gray' && "bg-stone-700",
                        bg === 'white' && "bg-white"
                      )}
                    >
                      {bg === background && <span className="bg-white/80 px-1 rounded text-black text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Selector */}
              <div>
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300 block mb-2">Frame</label>
                <select
                  value={frame}
                  onChange={(e) => setFrame(e.target.value as BoardFrameType)}
                  aria-label="Select frame style"
                  className="w-full p-2 rounded border border-stone-300 bg-stone-50 text-sm"
                >
                  <option value="wood-dark">Dark Wood</option>
                  <option value="wood-light">Light Wood</option>
                  <option value="metal">Metal</option>
                  <option value="none">No Frame</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* 2. Stickers Section */}
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

          <hr className="border-stone-100" />

          {/* 3. Wire & Clips Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
              <Type className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Accents</span>
            </div>

            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="wire-color" className="text-sm font-medium text-stone-700 dark:text-stone-300">Wire</label>
                  <div className="relative mt-1 h-8">
                    {/* eslint-disable-next-line react/forbid-dom-props */}
                    <div className="w-full h-full rounded border border-stone-200 shadow-sm" style={{ backgroundColor: wireColor }} />
                    <input
                      id="wire-color"
                      type="color"
                      value={wireColor}
                      onChange={(e) => setWireColor(e.target.value)}
                      aria-label="Select wire color"
                      title="Wire color picker"
                      className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="clip-color" className="text-sm font-medium text-stone-700 dark:text-stone-300">Clip</label>
                  <div className="relative mt-1 h-8">
                    {/* eslint-disable-next-line react/forbid-dom-props */}
                    <div className="w-full h-full rounded border border-stone-200 shadow-sm" style={{ backgroundColor: clipColor }} />
                    <input
                      id="clip-color"
                      type="color"
                      value={clipColor}
                      onChange={(e) => setClipColor(e.target.value)}
                      aria-label="Select clip color"
                      title="Clip color picker"
                      className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 block">Clip Style</span>
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

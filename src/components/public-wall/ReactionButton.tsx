"use client";

import { useState, useTransition } from "react";
import Lottie from "lottie-react";
import { ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import your Lottie files
import heartAnimation from "../../../public/Reactions/heart_lottie.json";
import laughAnimation from "../../../public/Reactions/laugh_lottie.json";
import sadAnimation from "../../../public/Reactions/CryingEmoji.json";
import partyAnimation from "../../../public/Reactions/party_lottie.json";
import thumbsUpAnimation from "../../../public/Reactions/ThumbsUp.json";
import { ReactionType, toggleReaction } from "@/lib/actions";

// Mapped exactly to your DB Enum: heart, fire, cold, party, laughter, sad
const REACTIONS = [
  { id: "heart", label: "Love", animation: heartAnimation },
  { id: "fire", label: "Fire", animation: thumbsUpAnimation }, // Placeholder: Swap with a fire lottie later
  { id: "party", label: "Party", animation: partyAnimation },
  { id: "laughter", label: "Haha", animation: laughAnimation },
  { id: "sad", label: "Sad", animation: sadAnimation },
  { id: "cold", label: "Cold", animation: sadAnimation }, // Placeholder: Swap with a shivering/cold lottie
];

export default function ReactionButton({
  postId,
  initialReaction = null
}: {
  postId: string;
  initialReaction?: string | null
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(initialReaction);
  const [isPending, startTransition] = useTransition();

  const handleReaction = (type: string) => {
    // 1. Optimistic Update
    const newReaction = selectedReaction === type ? null : type;
    setSelectedReaction(newReaction);
    setIsHovered(false);

    // 2. Server Action
    startTransition(async () => {
      const result = await toggleReaction(postId, type as ReactionType);
      if (result.error) {
        // Revert UI if server fails
        setSelectedReaction(selectedReaction);
        console.error(result.error);
      }
    });
  };

  const currentReaction = REACTIONS.find((r) => r.id === selectedReaction);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* The Floating Menu */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 flex gap-2 bg-white p-2 rounded-full shadow-xl border border-stone-200 z-50"
          >
            {REACTIONS.map((reaction) => (
              <button
                key={reaction.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaction(reaction.id);
                }}
                className="w-10 h-10 hover:scale-125 transition-transform duration-200 flex items-center justify-center"
                title={reaction.label}
              >
                <div className="w-10 h-10">
                  <Lottie animationData={reaction.animation} loop={true} />
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Main Button */}
      <button
        onClick={() => handleReaction(selectedReaction || "heart")}
        disabled={isPending}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors border ${selectedReaction
          ? "text-blue-600 bg-blue-50 border-blue-200"
          : "text-white bg-stone-800 hover:bg-stone-700 border-stone-700"
          }`}
      >
        {selectedReaction && currentReaction ? (
          <div className="w-6 h-6">
            <Lottie
              animationData={currentReaction.animation}
              loop={false}
            />
          </div>
        ) : (
          <ThumbsUp className="w-5 h-5" />
        )}

        <span className="font-bold">
          {selectedReaction && currentReaction ? currentReaction.label : "Like"}
        </span>
      </button>
    </div>
  );
}

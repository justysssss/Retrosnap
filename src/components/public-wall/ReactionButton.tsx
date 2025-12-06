"use client";

import { useState } from "react";
import Lottie from "lottie-react";
import { ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import heartAnimation from "../../../public/Reactions/heart_lottie.json";
import laughAnimation from "../../../public/Reactions/laugh_lottie.json";
import sadAnimation from "../../../public/Reactions/CryingEmoji.json";
import partyAnimation from "../../../public/Reactions/party_lottie.json";
import thumbsUpAnimation from "../../../public/Reactions/ThumbsUp.json";

const REACTIONS = [
  { id: "heart", label: "Love", animation: heartAnimation },
  { id: "party", label: "Party", animation: partyAnimation },
  { id: "laughter", label: "Haha", animation: laughAnimation },
  { id: "sad", label: "Sad", animation: sadAnimation },
  { id: "thumbsup", label: "Like", animation: thumbsUpAnimation },
];

export default function ReactionButton(props: { postId: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
                onClick={() => setSelectedReaction(reaction.id)}
                className="w-10 h-10 hover:scale-125 transition-transform duration-200"
                title={reaction.label}
              >
                <Lottie animationData={reaction.animation} loop={true} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors border ${selectedReaction ? "text-blue-600 bg-blue-50 border-blue-200" : "text-white bg-stone-800 hover:bg-stone-700 border-stone-700"
          }`}
      >
        {selectedReaction ? (
          <div className="w-6 h-6">
            <Lottie animationData={REACTIONS.find(r => r.id === selectedReaction)?.animation} loop={false} />
          </div>
        ) : (
          <ThumbsUp className="w-5 h-5" />
        )}
        <span className="font-bold">Like</span>
      </button>
    </div>
  );
}

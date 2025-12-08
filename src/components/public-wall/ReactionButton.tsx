"use client";

import { useState, useTransition } from "react";
import Lottie from "lottie-react";
import { ThumbsUp, Flame, Snowflake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import your Lottie files
import heartAnimation from "../../../public/Reactions/heart_lottie.json";
import laughAnimation from "../../../public/Reactions/laugh_lottie.json";
import sadAnimation from "../../../public/Reactions/CryingEmoji.json";
import partyAnimation from "../../../public/Reactions/party_lottie.json";
import thumbsUpAnimation from "../../../public/Reactions/ThumbsUp.json";
import coldAnimation from "../../../public/Reactions/cold_lottie.json";
import { ReactionType, toggleReaction } from "@/lib/actions";

const REACTIONS = [
    { id: "heart", label: "Love", animation: heartAnimation, icon: null },
    { id: "fire", label: "Fire", animation: thumbsUpAnimation, icon: <Flame className="w-full h-full text-orange-500" /> },
    { id: "cold", label: "Cold", animation: coldAnimation, icon: null },
    { id: "party", label: "Party", animation: partyAnimation, icon: null },
    { id: "laughter", label: "Haha", animation: laughAnimation, icon: null },
    { id: "sad", label: "Sad", animation: sadAnimation, icon: null },
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
        const newReaction = selectedReaction === type ? null : type;
        setSelectedReaction(newReaction);
        setIsHovered(false);

        startTransition(async () => {
            const result = await toggleReaction(postId, type as ReactionType);
            if (result.error) {
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
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 flex gap-1.5 bg-white p-2 rounded-full shadow-xl border border-stone-200 z-50"
                    >
                        {REACTIONS.map((reaction) => (
                            <motion.button
                                key={reaction.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleReaction(reaction.id);
                                }}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform duration-200 rounded-full hover:bg-stone-50"
                                title={reaction.label}
                            >
                                {reaction.animation ? (
                                    <Lottie animationData={reaction.animation} loop={true} className="w-full h-full" />
                                ) : (
                                    reaction.icon
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Button */}
            <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm sm:text-base ${selectedReaction
                        ? "text-blue-600 bg-blue-50 border border-blue-200"
                        : "text-white bg-stone-800 hover:bg-stone-700 border border-stone-700"
                    }`}
                disabled={isPending}
            >
                {currentReaction ? (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                        {currentReaction.animation ? (
                            <Lottie animationData={currentReaction.animation} loop={false} className="w-full h-full" />
                        ) : (
                            currentReaction.icon
                        )}
                    </div>
                ) : (
                    <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span className="font-bold">Like</span>
            </button>
        </div>
    );
}

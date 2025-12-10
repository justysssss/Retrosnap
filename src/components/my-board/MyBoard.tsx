"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Polaroid } from "@/types/studio";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

// Components
import BoardFrame from "./BoardFrame";
import WireRow from "./WireRow";
import BoardControls from "./BoardControls";
import DraggableDecoration from "./DraggableDecoration";
import UploadToPrivateBoard from "./UploadToPrivateBoard";

// Actions & Types
import { deletePost, saveBoard } from "@/lib/actions";
import {
  BoardData,
  ClipVariant,
  DecorationItem,
  BoardBackground,
  BoardFrameType
} from "@/types/board";

// We define this interface to match what BoardFrame expects
export interface BoardSettings {
  background: BoardBackground;
  frame: BoardFrameType;
}

interface MyBoardProps {
  initialPolaroids?: Polaroid[];
  initialBoardData?: BoardData | null;
}

export default function MyBoard({ initialPolaroids = [], initialBoardData }: MyBoardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  // --- State ---
  const [polaroids, setPolaroids] = useState<Polaroid[]>(initialPolaroids);
  const [isEditMode, setIsEditMode] = useState(false);

  // Board Settings State (Individual states are easier to pass to controls)
  const [background, setBackground] = useState<BoardBackground>("cork");
  const [frame, setFrame] = useState<BoardFrameType>("wood-dark");

  // Accents State
  const [wireColor, setWireColor] = useState("#8b5a2b");
  const [clipColor, setClipColor] = useState("#d4a373");
  const [clipVariant, setClipVariant] = useState<ClipVariant>("wood");
  const [decorations, setDecorations] = useState<DecorationItem[]>([]);

  // 1. Sync Polaroids when server props change
  useEffect(() => {
    setPolaroids(initialPolaroids);
  }, [initialPolaroids]);

  // 2. Initialize Data (DB or LocalStorage fallback)
  useEffect(() => {
    if (initialBoardData) {
      // Cast strict types from DB string values
      setBackground((initialBoardData.background as BoardBackground) || "cork");
      setFrame((initialBoardData.frame as BoardFrameType) || "wood-dark");
      setWireColor(initialBoardData.wireColor);
      setClipColor(initialBoardData.clipColor);
      setClipVariant(initialBoardData.clipVariant);
      setDecorations(initialBoardData.decorations || []);
    } else {
      // Fallback
      const savedBg = localStorage.getItem("board-background") as BoardBackground;
      const savedFrame = localStorage.getItem("board-frame") as BoardFrameType;
      if (savedBg) setBackground(savedBg);
      if (savedFrame) setFrame(savedFrame);
    }

    // Initialize DotLottie
    const scriptId = "dotlottie-player-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
      script.type = "module";
      document.body.appendChild(script);
    }

    setMounted(true);
  }, [initialBoardData]);

  // 3. Save Handler
  const handleSave = () => {
    startTransition(async () => {
      const currentPostOrder = polaroids.map(p => p.id);

      const result = await saveBoard({
        background,
        frame,
        wireColor,
        clipColor,
        clipVariant,
        decorations,
        postOrder: currentPostOrder
      });

      if (result.error) {
        alert("Failed to save: " + result.error);
      } else {
        setIsEditMode(false);
        router.refresh();
      }
    });
  };

  // 4. Decoration Handlers
  const addDecoration = (type: "sticker" | "lottie" | "emoji", src: string) => {
    const newItem: DecorationItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      src,
      x: 100, // Default center-ish
      y: 100,
      scale: 1
    };
    setDecorations([...decorations, newItem]);
  };

  const updateDecoration = (id: string, x: number, y: number, scale?: number) => {
    setDecorations(prev => prev.map(item => item.id === id ? { ...item, x, y, ...(scale && { scale }) } : item));
  };

  const deleteDecoration = (id: string) => {
    setDecorations(prev => prev.filter(item => item.id !== id));
  };

  // 5. Polaroid Logic
  const handleDeletePolaroid = async (id: string) => {
    if (!confirm("Delete this polaroid?")) return;
    try {
      const result = await deletePost(id);
      if (result.error) {
        alert(result.error);
        return;
      }
      setPolaroids(prev => prev.filter(p => p.id !== id));
      router.refresh();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handlePolaroidMove = (polaroidId: string, newSlotIndex: number, newRowIndex: number) => {
    setPolaroids(prevPolaroids => {
      const newGlobalIndex = newRowIndex * 4 + newSlotIndex;
      const currentIndex = prevPolaroids.findIndex(p => p.id === polaroidId);
      if (currentIndex === -1 || currentIndex === newGlobalIndex) return prevPolaroids;

      const result = [...prevPolaroids];
      if (result[newGlobalIndex]) {
        [result[currentIndex], result[newGlobalIndex]] = [result[newGlobalIndex], result[currentIndex]];
      } else {
        const [movedItem] = result.splice(currentIndex, 1);
        result.splice(newGlobalIndex, 0, movedItem);
      }
      return result;
    });
  };

  const handleUploadSuccess = () => {
    router.refresh();
  };

  const rows = [];
  for (let i = 0; i < polaroids.length; i += 4) {
    rows.push(polaroids.slice(i, i + 4));
  }

  if (!mounted) return null;

  return (
    <div className="w-full max-w-[1400px] mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-marker text-stone-800 dark:text-stone-200">
          {isEditMode ? "Editing Board..." : "My Private Board"}
        </h1>
        <div className="flex gap-3">
          <UploadToPrivateBoard onSuccess={handleUploadSuccess} />
          {!isEditMode && (
            <Button
              variant="outline"
              onClick={() => setIsEditMode(true)}
              className="gap-2"
            >
              <Settings size={18} />
              Edit Board
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <BoardControls
          isOpen={isEditMode}
          onClose={() => setIsEditMode(false)}
          onAddDecoration={addDecoration}
          onSave={handleSave}
          isSaving={isPending}

          // Style Props (Fixed: Passing these was missing before)
          background={background}
          setBackground={setBackground}
          frame={frame}
          setFrame={setFrame}

          // Accent Props
          wireColor={wireColor}
          setWireColor={setWireColor}
          clipColor={clipColor}
          setClipColor={setClipColor}
          clipVariant={clipVariant}
          setClipVariant={setClipVariant}
        />

        {/* Board Display - We reconstruct the settings object here */}
        <BoardFrame settings={{ background, frame }}>
          {/* Draggable Decorations */}
          {decorations.map(item => (
            <DraggableDecoration
              key={item.id}
              item={item}
              isEditMode={isEditMode}
              onUpdate={updateDecoration}
              onDelete={deleteDecoration}
            />
          ))}

          {/* Draggable Polaroids */}
          {rows.map((rowPolaroids, index) => (
            <WireRow
              key={index}
              polaroids={rowPolaroids}
              rowIndex={index}
              isStaggered={index % 2 !== 0}
              wireColor={wireColor}
              clipColor={clipColor}
              clipVariant={clipVariant}
              onDelete={isEditMode ? handleDeletePolaroid : undefined}
              isDraggable={isEditMode}
              onPolaroidMove={handlePolaroidMove}
            />
          ))}
        </BoardFrame>
      </div>
    </div>
  );
}

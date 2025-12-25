export type DecorationType = "sticker" | "lottie" | "emoji";
export type ClipVariant = "wood" | "metal" | "plastic";

// Expanded Background Options
export type BoardBackground =
  | "cork"
  | "felt-gray"
  | "felt-green"
  | "white"
  | "grid"
  | "dots";

// Expanded Frame Options
export type BoardFrameType =
  | "wood-dark"
  | "wood-light"
  | "metal"
  | "none";

export interface DecorationItem {
  id: string;
  type: DecorationType;
  src: string;
  x: number;
  y: number;
  scale: number;
}

// Matches your Database Schema
export interface BoardData {
  background: BoardBackground;
  frame: BoardFrameType;
  wireColor: string;
  clipColor: string;
  clipVariant: ClipVariant;
  decorations: DecorationItem[];
  postOrder?: string[];
}

// UI State Interface
export interface BoardSettings {
  background: BoardBackground;
  frame: BoardFrameType;
}

import { Polaroid } from "@/types/studio";

export interface BoardSettings {
    background: "cork" | "felt-gray" | "felt-green";
    frame: "wood-dark" | "wood-light" | "metal";
}

export interface HangingPolaroidProps {
    polaroid: Polaroid;
    wireY: number; // The Y position of the wire relative to the row
    xOffset: number; // Position along the wire
    rotation: number; // Random rotation for natural look
}

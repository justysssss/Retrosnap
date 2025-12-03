export type Polaroid = {
    id: string;
    imageSrc: string;
    x: number;
    y: number;
    rotation: number;
    caption: string;
    filter: string;
    isFlipped: boolean;
    secretMessage: string;
    timestamp: number;
    downloadTrigger?: number;
};

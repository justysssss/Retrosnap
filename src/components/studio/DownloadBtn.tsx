"use client";

import { Download } from "lucide-react";

interface DownloadBtnProps {
    onClick: () => void;
}

export default function DownloadBtn({ onClick }: DownloadBtnProps) {
    return (
        <button
            onClick={onClick}
            className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all bg-blue-500 text-white hover:bg-blue-600 shadow-md"
        >
            <Download className="w-5 h-5" />
            Download Photo
        </button>
    );
}

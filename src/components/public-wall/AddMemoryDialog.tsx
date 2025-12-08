"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreatePostForm from "./CreatePostForm";

export default function AddMemoryDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-yellow-400 text-stone-900 hover:bg-yellow-500 font-bold rounded-full px-6 shadow-lg hover:shadow-xl transition-all">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Memory
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[420px] max-w-[95vw] bg-transparent border-none shadow-none p-0 max-h-[85vh] overflow-y-auto">
                <DialogTitle className="sr-only">Create New Post</DialogTitle>
                <CreatePostForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

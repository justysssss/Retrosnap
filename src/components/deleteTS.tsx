"use client";

import { deletePost } from "@/lib/actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function DeleteButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    startTransition(async () => {
      const result = await deletePost(postId);
      if (result.error) {
        alert(result.error);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
    >
      {isPending ? "..." : <Trash2 size={18} />}
    </button>
  );
}

"use client";

import { deletePost } from "@/lib/actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    startTransition(async () => {
      const result = await deletePost(postId);
      if (result.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-400 hover:text-red-300 hover:bg-stone-700/50 transition-colors disabled:opacity-50"
    >
      <Trash2 size={16} />
      <span className="text-sm font-medium">
        {isPending ? "Deleting..." : "Delete Post"}
      </span>
    </button>
  );
}

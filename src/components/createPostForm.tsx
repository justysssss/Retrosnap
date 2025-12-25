"use client";

import { getSignedUrl, createPost } from "@/lib/actions";
import { useState } from "react";
import { toast } from "sonner";

export function CreatePostForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      // 1. Server Action: Get the Signed URL
      const { success, url, filePath, error } = await getSignedUrl(
        file.name,
        file.type
      );

      if (!success || !url) {
        toast.error("Error: " + error);
        return;
      }

      // 2. Standard Fetch: Upload the ACTUAL file to Google Cloud
      // (This must happen on client side)
      const uploadRes = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) throw new Error("Upload to Google Cloud failed");

      // 3. Calculate Aspect Ratio (Optional but recommended)
      // For now we can just send 1, or calculate it using an Image() object
      const aspectRatio = 1;

      // 4. Server Action: Create the Post in DB
      const result = await createPost({
        message: "Hello World",
        secretMessage: "Secret!",
        filePath: filePath!, // Send the path we got from step 1
        aspectRatio: aspectRatio
      });

      if (result.success) {
        toast.success("Post created!");
        // Reset form / Redirect
      } else {
        toast.error("DB Error: " + result.error);
      }

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="file-upload">
        Choose Image File
      </label>
      <input
        id="file-upload" // <- New ID attribute to link with the label
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Post"}
      </button>
    </form>
  );
}

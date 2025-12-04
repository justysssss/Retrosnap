"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { v4 as uuidv4 } from "uuid";
import { storage, UPLOAD_BUCKET_NAME } from "./storage";
import { db } from "@/db";
import { post, postImage } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function getSignedUrl(filename: string, contentType: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const uniqueId = uuidv4();
    const extension = filename.split(".").pop();
    const filePath = `uploads/${session.user.id}/${uniqueId}.${extension}`;

    const [url] = await storage
      .bucket(UPLOAD_BUCKET_NAME)
      .file(filePath)
      .getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 60 * 1000,
        contentType: contentType
      });

    return { success: true, url, filePath };

  } catch (error) {
    console.error("Signed URL Error", error);
    return { error: "Failed to generate upload URL" };
  }
}

export async function createPost(formData: {
  message: string,
  secretMessage?: string,
  filePath: string,
  aspectRatio: number;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return { error: "Unauthorized" };
  }
  const { message, secretMessage, filePath, aspectRatio } = formData;

  if (!filePath) {
    return { error: "Image is required" };
  }

  try {
    const postId = uuidv4();

    await db.transaction(async (tx) => {
      await tx.insert(post).values({
        id: postId,
        userId: session.user.id,
        message: message,
        secretMessage: secretMessage,
        isPublic: true,
      });

      await tx.insert(postImage).values({
        id: uuidv4(),
        postId: postId,
        originalPath: filePath,
        status: "pending",
        aspectRatio: aspectRatio,
      })
    });
    revalidatePath("/studio")

    return { success: true, postId };


  } catch (error) {
    console.error("Create Post Error:", error);
    return { error: "Failed to save post" };
  }
}

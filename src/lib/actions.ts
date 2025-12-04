"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { v4 as uuidv4 } from "uuid";
import { storage, UPLOAD_BUCKET_NAME } from "./storage";
import { db } from "@/db";
import { post, postImage, reaction, user } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { and, desc, eq, sql } from "drizzle-orm";

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





export async function getGlobalFeed(limit = 20, offset = 0) {
  try {
    const data = await db
      .select({
        post: {
          id: post.id,
          message: post.message,
          createdAt: post.createdAt,
        },
        image: {
          id: postImage.id,
          thumbnailUrl: postImage.thumbnailUrl,
          fullUrl: postImage.fullUrl,
          aspectRatio: postImage.aspectRatio,
          width: postImage.width,
          height: postImage.height,
        },
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        reactionCount: sql<number>`count(${reaction.postId})`.mapWith(Number),
      })
      .from(post)
      .innerJoin(postImage, eq(post.id, postImage.postId))
      .innerJoin(user, eq(post.userId, user.id))
      .leftJoin(reaction, eq(post.id, reaction.postId))
      .where(
        and(
          eq(post.isPublic, true),
          eq(postImage.status, "completed")
        )
      )
      .groupBy(post.id, postImage.id, user.id)
      .orderBy(desc(post.createdAt))
      .limit(limit)
      .offset(offset);

    console.log(data);
    return { success: true, data };

  } catch (error) {
    console.error("Error fetching feed:", error);
    return { success: false, data: [] }
  }
}




export async function getUserPosts(userId: string) {
  try {
    const data = await db
      .select({
        post: {
          id: post.id,
          message: post.message,
          createdAt: post.createdAt,
        },
        image: {
          id: postImage.id,
          thumbnailUrl: postImage.thumbnailUrl,
          fullUrl: postImage.fullUrl,
          aspectRatio: postImage.aspectRatio,
        },
        reactionCount: sql<number>`count(${reaction.postId})`.mapWith(Number),
      })
      .from(post)
      .innerJoin(postImage, eq(post.id, postImage.postId))
      .leftJoin(reaction, eq(post.id, reaction.postId))
      .where(and(
        eq(post.userId, userId),
        eq(postImage.status, "completed")
      ))
      .groupBy(post.id, user.id)
      .orderBy(desc(post.createdAt));

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching user profile", error)
    return { success: false, data: [] };
  }
}

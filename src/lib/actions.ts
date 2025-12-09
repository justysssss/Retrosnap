"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { v4 as uuidv4 } from "uuid";
import { PUBLIC_BUCKET_NAME, storage, UPLOAD_BUCKET_NAME } from "./storage";
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
        isPrivate: false,
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


export async function createPostinPrivateWall(formData: {
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
        isPublic: false,
        isPrivate: true,
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




function getFilePathFromUrl(url: string, bucketName: string): string | null {
  try {
    const splitKey = `${bucketName}/`;
    const parts = url.split(splitKey);
    return parts.length > 1 ? parts[1] : null;
  } catch (error) {
    return null;
  }
}


export async function deletePost(postId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const existingPost = await db.query.post.findFirst({
      where: eq(post.id, postId),
      with: {
        image: true,
      }
    });

    if (!existingPost) {
      return { error: "Post not found " };
    }

    if (existingPost.userId !== session.user.id) {
      return { error: "You do not have permission to delete this post" };
    }

    if (existingPost.image) {
      const img = existingPost.image;

      if (img.originalPath) {
        await storage
          .bucket(UPLOAD_BUCKET_NAME)
          .file(img.originalPath)
          .delete()
          .catch((e) => console.error("Failed to delete raw file:", e));
      }

      if (img.thumbnailUrl) {
        const thumbPath = getFilePathFromUrl(img.thumbnailUrl, PUBLIC_BUCKET_NAME);
        if (thumbPath) {
          await storage
            .bucket(PUBLIC_BUCKET_NAME)
            .file(thumbPath)
            .delete()
            .catch((e) => console.error("Failed to delete thumb:", e));
        }
      }

      if (img.fullUrl) {
        const fullPath = getFilePathFromUrl(img.fullUrl, PUBLIC_BUCKET_NAME);
        if (fullPath) {
          await storage
            .bucket(PUBLIC_BUCKET_NAME)
            .file(fullPath)
            .delete()
            .catch((e) => console.error("Failed to delele full url", e))
        }
      }

    }

    await db.delete(post).where(eq(post.id, postId));
    //revalidatePath("/")
    //revalidatePath("/feed")

    return { success: true };
  } catch (error) {
    console.error("Delete Post Error:", error)
    return { error: "Failed to delete Post" };
  }
}


export async function getGlobalFeed(limit = 20, offset = 0) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const currentUserId = session?.user.id;
  try {
    const data = await db
      .select({
        post: {
          id: post.id,
          message: post.message,
          secretMessage: post.secretMessage,
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
        userReaction: sql<string | null>`
          MAX(CASE WHEN ${reaction.userId} = ${currentUserId || null} THEN ${reaction.type} ELSE NULL END)
        `.as("user_reaction"),
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

    return { success: true, data };

  } catch (error) {
    console.error("Error fetching feed:", error);
    return { success: false, data: [] }
  }
}



export async function getPrivateFeed(limit = 20, offset = 0, userId: string) {
  try {
    const data = await db
      .select({
        post: {
          id: post.id,
          message: post.message,
          secretMessage: post.secretMessage,
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
        userReaction: sql<string | null>`
          MAX(CASE WHEN ${reaction.userId} = ${userId || null} THEN ${reaction.type} ELSE NULL END)
        `.as("user_reaction"),

      })
      .from(post)
      .innerJoin(postImage, eq(post.id, postImage.postId))
      .innerJoin(user, eq(post.userId, user.id))
      .leftJoin(reaction, eq(post.id, reaction.postId))
      .where(
        and(
          eq(post.isPrivate, true),
          eq(postImage.status, "completed"),
          eq(post.userId, userId)
        )
      )
      .groupBy(post.id, postImage.id, user.id)
      .orderBy(desc(post.createdAt))
      .limit(limit)
      .offset(offset);

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
          secretMessage: post.secretMessage,
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

export type ReactionType = "heart" | "fire" | "cold" | "party" | "laughter" | "sad";
export async function toggleReaction(postId: string, type: ReactionType) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    // Check if reaction exists
    const existingReaction = await db.query.reaction.findFirst({
      where: and(
        eq(reaction.userId, userId),
        eq(reaction.postId, postId)
      ),
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // 1. Toggle Off (Remove)
        await db.delete(reaction).where(
          and(eq(reaction.userId, userId), eq(reaction.postId, postId))
        );
        revalidatePath("/");
        return { success: true, action: "removed" };
      } else {
        // 2. Switch Reaction (Update)
        await db.update(reaction)
          .set({ type: type })
          .where(
            and(eq(reaction.userId, userId), eq(reaction.postId, postId))
          );
        revalidatePath("/");
        return { success: true, action: "updated" };
      }
    } else {
      // 3. Add New Reaction
      await db.insert(reaction).values({
        userId: userId,
        postId: postId,
        type: type,
      });
      revalidatePath("/");
      return { success: true, action: "added" };
    }

  } catch (error) {
    console.error("Reaction Error:", error);
    return { error: "Failed to update reaction" };
  }
}

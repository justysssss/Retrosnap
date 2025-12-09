
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, integer, pgEnum, primaryKey, real } from "drizzle-orm/pg-core";

export const imageStatusEnum = pgEnum("image_status", [
  "pending", //Uploaded to Bucket 1, wating for cloud function,
  "processing", // Cloud Function is currently resizing,
  "completed", // Uploaded to Bucket 2, CDN URL ready,
  "failed", // Processing error,
])

export const reactionTypeEnum = pgEnum("reaction_type", [
  "heart",
  "fire",
  "cold",
  "party",
  "laughter",
  "sad",
])

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  post: many(post),
  reaction: many(reaction),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const post = pgTable("post", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  message: text("messsage"),
  secretMessage: text("secret_message"),
  isPublic: boolean("is_public").default(false).notNull(),
  isPrivate: boolean("is_private").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),

}, (table) => [index("post_user_idx").on(table.userId),
index("post_created_at_idx").on(table.createdAt)]
)

export const postImage = pgTable("post_image", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull().references(() => post.id, { onDelete: "cascade" }),

  //Bucket 1: The original upload (Private)
  originalPath: text("original_path").notNull(),

  // Public Feed URL (720px) for feed
  thumbnailUrl: text("low_res_cdn_url"),

  // Public HD URL (2048px)
  fullUrl: text("full_url"),

  aspectRatio: real("aspect_ratio"),

  status: imageStatusEnum("status").default("pending").notNull(),
  width: integer("width"),
  height: integer("height"),
})



export const reaction = pgTable("reaction", {
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  postId: text("post_id").notNull().references(() => post.id, { onDelete: "cascade" }),

  type: reactionTypeEnum("type").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.postId] }),
  postIdx: index("reaction_post_idx").on(t.postId),
})
)



export const postRelations = relations(post, ({ one, many }) => ({
  user: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
  image: one(postImage, {
    fields: [post.id],
    references: [postImage.postId],
  }),
  reactions: many(reaction),
}))

export const postImageRealtions = relations(postImage, ({ one }) => ({
  post: one(post, {
    fields: [postImage.postId],
    references: [post.id],
  })
}))

export const reactionRelations = relations(reaction, ({ one }) => ({
  user: one(user, {
    fields: [reaction.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [reaction.postId],
    references: [post.id],
  })
}))

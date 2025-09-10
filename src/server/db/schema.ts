import { relations, sql, type InferSelectModel } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  primaryKey,
  pgEnum,
  varchar,
  text,
  serial,
  integer,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Multi-project schema with `chance_` prefix.
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `chance_${name}`);

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const projectStatusEnum = pgEnum("project_status", [
  "open",
  "ongoing",
  "completed",
]);
export const visibilityEnum = pgEnum("visibility", ["public", "private"]);

// Users table (merged: client's detailed fields + your role and NextAuth compatibility)
export const users = createTable(
  "user",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => sql`gen_random_uuid()`),
    email: varchar("email", { length: 255 }).notNull().unique(),
    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    username: varchar("username", { length: 255 }).unique(),
    profileImageUrl: varchar("profile_image_url", { length: 255 }),
    school: varchar("school", { length: 255 }),
    bio: text("bio"),
    instagram: varchar("instagram", { length: 255 }),
    whatsappNumber: varchar("whatsapp_number", { length: 20 }),
    profileCompleted: boolean("profile_completed").default(false).notNull(),
    role: userRoleEnum("role").default("user").notNull(),
    influence: integer("influence").default(0).notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    emailVerified: timestamp("email_verified", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => sql`CURRENT_TIMESTAMP`,
    ),
  },
  (t) => [
    index("user_email_idx").on(t.email),
    index("user_username_idx").on(t.username),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  projectsCreated: many(projects, { relationName: "creator" }),
  projectMemberships: many(projectMembers),
  heartbeats: many(heartbeats),
  heartbeatLikes: many(heartbeatLikes),
  heartbeatComments: many(heartbeatComments),
  projectVotes: many(projectVotes),
  projectsCompleted: many(projectsCompleted),
  spotlight: many(spotlight),
  sharingLogs: many(sharingLogs),
}));

export type User = InferSelectModel<typeof users>;

// NextAuth tables
export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// Projects table (client's fields + your status enum + visibility)
export const projects = createTable(
  "project",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => sql`gen_random_uuid()`),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    impact: text("impact").notNull(),
    teamSize: integer("team_size").notNull(),
    effort: varchar("effort", { length: 100 }).notNull(),
    peopleInfluenced: integer("people_influenced"),
    typeOfPeople: varchar("type_of_people", { length: 255 }),
    requiredTools: text("required_tools")
      .array()
      .default(sql`'{}'::text[]`),
    actionPlan: text("action_plan")
      .array()
      .default(sql`'{}'::text[]`),
    collaboration: text("collaboration"),
    likes: integer("likes").default(0).notNull(),
    creatorId: varchar("creator_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    status: projectStatusEnum("status").default("open").notNull(),
    visibility: visibilityEnum("visibility").default("public").notNull(),
    adminNotes: text("admin_notes"), // For admin to add notes
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => sql`CURRENT_TIMESTAMP`,
    ),
  },
  (t) => [
    index("project_creator_id_idx").on(t.creatorId),
    index("project_title_idx").on(t.title),
    index("project_category_idx").on(t.category),
    index("project_status_idx").on(t.status),
  ],
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
  creator: one(users, {
    fields: [projects.creatorId],
    references: [users.id],
    relationName: "creator",
  }),
  members: many(projectMembers),
  votes: many(projectVotes),
  completions: many(projectsCompleted),
}));

export type Project = InferSelectModel<typeof projects>;

// Project Members (from your schema)
export const projectMembers = createTable(
  "project_member",
  {
    projectId: varchar("project_id", { length: 255 })
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.projectId, t.userId] }),
    index("project_member_project_id_idx").on(t.projectId),
    index("project_member_user_id_idx").on(t.userId),
  ],
);

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

// Project Votes (client's schema, renamed from projectUpvotes for clarity)
export const projectVotes = createTable(
  "project_vote",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => sql`gen_random_uuid()`),
    projectId: varchar("project_id", { length: 255 })
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    voteType: varchar("vote_type", { length: 50 }).notNull(), // e.g., "will-join", "will-join-after-tweaks"
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("project_vote_project_id_idx").on(t.projectId),
    index("project_vote_user_id_idx").on(t.userId),
  ],
);

export const projectVotesRelations = relations(projectVotes, ({ one }) => ({
  project: one(projects, {
    fields: [projectVotes.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectVotes.userId],
    references: [users.id],
  }),
}));

// Heartbeats (client's schema + your structure + visibility)
export const heartbeats = createTable(
  "heartbeat",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => sql`gen_random_uuid()`),
    content: text("content").notNull(),
    imageUrl: varchar("image_url", { length: 255 }),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    likes: integer("likes").default(0).notNull(),
    comments: integer("comments").default(0).notNull(),
    visibility: visibilityEnum("visibility").default("public").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => sql`CURRENT_TIMESTAMP`,
    ),
  },
  (t) => [
    index("heartbeat_user_id_idx").on(t.userId),
    index("heartbeat_created_at_idx").on(t.createdAt),
  ],
);

export const heartbeatsRelations = relations(heartbeats, ({ one, many }) => ({
  user: one(users, { fields: [heartbeats.userId], references: [users.id] }),
  likes: many(heartbeatLikes),
  comments: many(heartbeatComments),
}));

export type Heartbeat = InferSelectModel<typeof heartbeats>;

// Heartbeat Likes (client's schema)
export const heartbeatLikes = createTable(
  "heartbeat_like",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => sql`gen_random_uuid()`),
    heartbeatId: varchar("heartbeat_id", { length: 255 })
      .notNull()
      .references(() => heartbeats.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("heartbeat_like_heartbeat_id_idx").on(t.heartbeatId),
    index("heartbeat_like_user_id_idx").on(t.userId),
  ],
);

export const heartbeatLikesRelations = relations(heartbeatLikes, ({ one }) => ({
  heartbeat: one(heartbeats, {
    fields: [heartbeatLikes.heartbeatId],
    references: [heartbeats.id],
  }),
  user: one(users, {
    fields: [heartbeatLikes.userId],
    references: [users.id],
  }),
}));

// Heartbeat Comments (client's schema)
export const heartbeatComments = createTable(
  "heartbeat_comment",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => sql`gen_random_uuid()`),
    content: text("content").notNull(),
    heartbeatId: varchar("heartbeat_id", { length: 255 })
      .notNull()
      .references(() => heartbeats.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => sql`CURRENT_TIMESTAMP`,
    ),
  },
  (t) => [
    index("heartbeat_comment_heartbeat_id_idx").on(t.heartbeatId),
    index("heartbeat_comment_user_id_idx").on(t.userId),
  ],
);

export const heartbeatCommentsRelations = relations(
  heartbeatComments,
  ({ one }) => ({
    heartbeat: one(heartbeats, {
      fields: [heartbeatComments.heartbeatId],
      references: [heartbeats.id],
    }),
    user: one(users, {
      fields: [heartbeatComments.userId],
      references: [users.id],
    }),
  }),
);

export type HeartbeatComment = InferSelectModel<typeof heartbeatComments>;

// Projects Completed (client's schema)
export const projectsCompleted = createTable(
  "projects_completed",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectId: varchar("project_id", { length: 255 })
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("projects_completed_user_id_idx").on(t.userId),
    index("projects_completed_project_id_idx").on(t.projectId),
  ],
);

export const projectsCompletedRelations = relations(
  projectsCompleted,
  ({ one }) => ({
    user: one(users, {
      fields: [projectsCompleted.userId],
      references: [users.id],
    }),
    project: one(projects, {
      fields: [projectsCompleted.projectId],
      references: [projects.id],
    }),
  }),
);

// Spotlight (client's schema)
export const spotlight = createTable(
  "spotlight",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [index("spotlight_user_id_idx").on(t.userId)],
);

export const spotlightRelations = relations(spotlight, ({ one }) => ({
  user: one(users, {
    fields: [spotlight.userId],
    references: [users.id],
  }),
}));

// Sharing Logs (client's schema)
export const sharingLogs = createTable(
  "sharing_logs",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    shareType: varchar("share_type", { length: 50 }).notNull(), // Instagram, WhatsApp, LinkedIn, Download, Copy
    contentType: varchar("content_type", { length: 50 }).notNull(), // Project, Heartbeat, Profile, Spotlight
    contentId: varchar("content_id", { length: 255 }), // ID of shared content
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("sharing_logs_user_id_idx").on(t.userId),
    index("sharing_logs_content_type_idx").on(t.contentType),
  ],
);

export const sharingLogsRelations = relations(sharingLogs, ({ one }) => ({
  user: one(users, {
    fields: [sharingLogs.userId],
    references: [users.id],
  }),
}));

// Zod Schemas for Input Validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  emailVerified: true,
  influence: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likes: true,
});

export const insertHeartbeatSchema = createInsertSchema(heartbeats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likes: true,
  comments: true,
});

export const insertProjectVoteSchema = createInsertSchema(projectVotes).omit({
  id: true,
  createdAt: true,
});

export const insertHeartbeatLikeSchema = createInsertSchema(
  heartbeatLikes,
).omit({
  id: true,
  createdAt: true,
});

export const insertHeartbeatCommentSchema = createInsertSchema(
  heartbeatComments,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectCompletedSchema = createInsertSchema(
  projectsCompleted,
).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertSpotlightSchema = createInsertSchema(spotlight).omit({
  id: true,
  createdAt: true,
});

export const insertSharingLogSchema = createInsertSchema(sharingLogs).omit({
  id: true,
  createdAt: true,
});

// Types for Query Results
export type User = InferSelectModel<typeof users>;
export type Project = InferSelectModel<typeof projects>;
export type Heartbeat = InferSelectModel<typeof heartbeats>;
export type ProjectVote = InferSelectModel<typeof projectVotes>;
export type HeartbeatLike = InferSelectModel<typeof heartbeatLikes>;
export type HeartbeatComment = InferSelectModel<typeof heartbeatComments>;
export type ProjectCompleted = InferSelectModel<typeof projectsCompleted>;
export type Spotlight = InferSelectModel<typeof spotlight>;
export type SharingLog = InferSelectModel<typeof sharingLogs>;

// Insert Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertHeartbeat = z.infer<typeof insertHeartbeatSchema>;
export type InsertProjectVote = z.infer<typeof insertProjectVoteSchema>;
export type InsertHeartbeatLike = z.infer<typeof insertHeartbeatLikeSchema>;
export type InsertHeartbeatComment = z.infer<
  typeof insertHeartbeatCommentSchema
>;
export type InsertProjectCompleted = z.infer<
  typeof insertProjectCompletedSchema
>;
export type InsertSpotlight = z.infer<typeof insertSpotlightSchema>;
export type InsertSharingLog = z.infer<typeof insertSharingLogSchema>;

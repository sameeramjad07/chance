import { z } from "zod";
import { protectedProcedure, publicProcedure, createTRPCRouter } from "../trpc";
import { db } from "@/server/db";
import {
  heartbeats,
  heartbeatLikes,
  heartbeatComments,
  sharingLogs,
  users,
  insertHeartbeatSchema,
  insertHeartbeatCommentSchema,
} from "@/server/db/schema";
import { eq, and, desc, count, lt, sql, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";

// Instantiate UTApi
const utapi = new UTApi();

export const heartbeatRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
        userId: z.string().optional(), // Optional userId for context
      }),
    )
    .query(async ({ input, ctx }) => {
      // Base query for heartbeats
      const query = db
        .select({
          heartbeat: heartbeats,
          user: {
            id: users.id,
            name: users.name,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
          },
          likeCount: count(heartbeatLikes.id).as("likeCount"),
          commentCount: count(heartbeatComments.id).as("commentCount"),
        })
        .from(heartbeats)
        .innerJoin(users, eq(heartbeats.userId, users.id)) // Changed to innerJoin
        .leftJoin(heartbeatLikes, eq(heartbeats.id, heartbeatLikes.heartbeatId))
        .leftJoin(
          heartbeatComments,
          eq(heartbeats.id, heartbeatComments.heartbeatId),
        )
        .where(
          and(
            eq(heartbeats.visibility, "public"),
            input.cursor
              ? lt(heartbeats.createdAt, new Date(input.cursor))
              : undefined,
          ),
        )
        .groupBy(
          heartbeats.id,
          users.id,
          users.name,
          users.username,
          users.profileImageUrl,
        )
        .orderBy(desc(heartbeats.createdAt));

      const results = await query.limit(input.limit + 1);

      // Fetch user likes if user is authenticated
      let userLikes: { heartbeatId: string }[] = [];
      if (ctx.session?.user.id) {
        const heartbeatIds = results.map((r) => r.heartbeat.id);
        if (heartbeatIds.length > 0) {
          userLikes = await db
            .select({ heartbeatId: heartbeatLikes.heartbeatId })
            .from(heartbeatLikes)
            .where(
              and(
                eq(heartbeatLikes.userId, ctx.session.user.id),
                inArray(heartbeatLikes.heartbeatId, heartbeatIds),
              ),
            );
        }
      }

      const hasNextPage = results.length > input.limit;
      const heartbeatsData = hasNextPage
        ? results.slice(0, input.limit)
        : results;

      return {
        heartbeats: heartbeatsData.map((r) => ({
          ...r.heartbeat,
          user: r.user,
          likeCount: r.likeCount,
          commentCount: r.commentCount,
          isLikedByUser: userLikes.some(
            (like) => like.heartbeatId === r.heartbeat.id,
          ),
        })),
        nextCursor:
          hasNextPage && heartbeatsData.length > 0
            ? heartbeatsData[
                heartbeatsData.length - 1
              ]?.heartbeat.createdAt.toISOString()
            : undefined,
      };
    }),

  getById: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    // Fetch the heartbeat with user details, like count, and comment count
    const results = await db
      .select({
        heartbeat: {
          id: heartbeats.id,
          content: heartbeats.content,
          imageUrl: heartbeats.imageUrl,
          videoUrl: heartbeats.videoUrl,
          userId: heartbeats.userId,
          likes: heartbeats.likes,
          comments: heartbeats.comments,
          visibility: heartbeats.visibility,
          createdAt: heartbeats.createdAt,
          updatedAt: heartbeats.updatedAt,
        },
        user: {
          id: users.id,
          name: users.name,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        },
        likeCount: count(heartbeatLikes.id).as("likeCount"),
        commentCount: count(heartbeatComments.id).as("commentCount"),
      })
      .from(heartbeats)
      .innerJoin(users, eq(heartbeats.userId, users.id))
      .leftJoin(heartbeatLikes, eq(heartbeats.id, heartbeatLikes.heartbeatId))
      .leftJoin(
        heartbeatComments,
        eq(heartbeats.id, heartbeatComments.heartbeatId),
      )
      .where(eq(heartbeats.id, input))
      .groupBy(
        heartbeats.id,
        heartbeats.content,
        heartbeats.imageUrl,
        heartbeats.videoUrl,
        heartbeats.userId,
        heartbeats.likes,
        heartbeats.comments,
        heartbeats.visibility,
        heartbeats.createdAt,
        heartbeats.updatedAt,
        users.id,
        users.name,
        users.username,
        users.profileImageUrl,
      )
      .limit(1);

    if (results.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Heartbeat not found",
      });
    }

    const { heartbeat, user, likeCount, commentCount } = results[0]!;

    // Verify visibility permissions
    if (
      heartbeat.visibility === "private" &&
      ctx.session?.user.id !== heartbeat.userId
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to view this private heartbeat",
      });
    }

    // Check if the authenticated user has liked the heartbeat
    let isLikedByUser = false;
    if (ctx.session?.user.id) {
      const like = await db
        .select({ id: heartbeatLikes.id })
        .from(heartbeatLikes)
        .where(
          and(
            eq(heartbeatLikes.heartbeatId, input),
            eq(heartbeatLikes.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      isLikedByUser = like.length > 0;
    }

    return {
      ...heartbeat,
      user,
      likes: likeCount, // Use aggregated count for consistency
      comments: commentCount, // Use aggregated count for consistency
      isLikedByUser,
    };
  }),

  create: protectedProcedure
    .input(
      insertHeartbeatSchema.extend({
        image: z.string().optional(),
        video: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const values: typeof heartbeats.$inferInsert = {
        content: input.content,
        userId: ctx.session.user.id,
        visibility: input.visibility ?? "public",
        imageUrl: input.image,
        videoUrl: input.video,
      };
      const [newHeartbeat] = await db
        .insert(heartbeats)
        .values(values)
        .returning();

      return newHeartbeat;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const [heartbeat] = await db
        .select()
        .from(heartbeats)
        .where(eq(heartbeats.id, input))
        .limit(1);

      if (!heartbeat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Heartbeat not found",
        });
      }

      if (heartbeat.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the creator can delete this post",
        });
      }

      // Delete associated media from UploadThing
      if (heartbeat.imageUrl) {
        const fileKey = heartbeat.imageUrl.split("/").pop();
        if (fileKey) await utapi.deleteFiles(fileKey);
      }

      // Note: Add videoUrl deletion if supported by schema
      if (heartbeat.videoUrl) {
        const fileKey = heartbeat.videoUrl.split("/").pop();
        if (fileKey) await utapi.deleteFiles(fileKey);
      }

      await db.delete(heartbeats).where(eq(heartbeats.id, input));

      return { success: true };
    }),

  like: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existing = await db
        .select()
        .from(heartbeatLikes)
        .where(
          and(
            eq(heartbeatLikes.heartbeatId, input),
            eq(heartbeatLikes.userId, userId),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        // Unlike
        await db
          .delete(heartbeatLikes)
          .where(
            and(
              eq(heartbeatLikes.heartbeatId, input),
              eq(heartbeatLikes.userId, userId),
            ),
          );
        await db
          .update(heartbeats)
          .set({ likes: sql`${heartbeats.likes} - 1` })
          .where(eq(heartbeats.id, input));
        return { liked: false };
      }

      await db.insert(heartbeatLikes).values({
        heartbeatId: input,
        userId,
      });
      await db
        .update(heartbeats)
        .set({ likes: sql`${heartbeats.likes} + 1` })
        .where(eq(heartbeats.id, input));
      return { liked: true };
    }),

  comment: protectedProcedure
    .input(insertHeartbeatCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const [newComment] = await db
        .insert(heartbeatComments)
        .values({
          content: input.content,
          heartbeatId: input.heartbeatId,
          userId: ctx.session.user.id,
        })
        .returning();

      await db
        .update(heartbeats)
        .set({ comments: sql`${heartbeats.comments} + 1` })
        .where(eq(heartbeats.id, input.heartbeatId));

      return newComment;
    }),

  deleteComment: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const comment = await db
        .select()
        .from(heartbeatComments)
        .where(eq(heartbeatComments.id, input))
        .limit(1);

      if (comment.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      // ✅ safe after check
      const cmt = comment[0]!;

      if (cmt.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the comment author can delete this comment",
        });
      }

      await db.delete(heartbeatComments).where(eq(heartbeatComments.id, input));
      await db
        .update(heartbeats)
        .set({ comments: sql`${heartbeats.comments} - 1` })
        .where(eq(heartbeats.id, cmt.heartbeatId));

      return { success: true };
    }),

  getComments: publicProcedure.input(z.string()).query(async ({ input }) => {
    return db
      .select({
        comment: heartbeatComments,
        user: {
          id: users.id,
          name: users.name,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(heartbeatComments)
      .leftJoin(users, eq(heartbeatComments.userId, users.id))
      .where(eq(heartbeatComments.heartbeatId, input))
      .orderBy(desc(heartbeatComments.createdAt));
  }),

  share: protectedProcedure
    .input(
      z.object({
        heartbeatId: z.string(),
        shareType: z.enum(["instagram", "facebook", "whatsapp", "copy"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const shareUrl = `${process.env.NEXT_PUBLIC_ROOT_URL}/heartbeats/${input.heartbeatId}`;

      await db.insert(sharingLogs).values({
        userId: ctx.session.user.id,
        shareType: input.shareType,
        contentType: "Heartbeat",
        contentId: input.heartbeatId,
      });

      return { shareUrl };
    }),
});

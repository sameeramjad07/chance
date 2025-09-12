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
  insertHeartbeatLikeSchema,
  insertHeartbeatCommentSchema,
  insertSharingLogSchema,
} from "@/server/db/schema";
import { eq, and, desc, count, lt } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { utapi } from "@/server/uploadthing";

export const heartbeatRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const query = db
        .select({
          heartbeat: heartbeats,
          user: {
            id: users.id,
            name: users.name,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
          },
          likeCount: count(heartbeatLikes.id).as("like_count"),
          commentCount: count(heartbeatComments.id).as("comment_count"),
        })
        .from(heartbeats)
        .leftJoin(users, eq(heartbeats.userId, users.id))
        .leftJoin(heartbeatLikes, eq(heartbeats.id, heartbeatLikes.heartbeatId))
        .leftJoin(
          heartbeatComments,
          eq(heartbeats.id, heartbeatComments.heartbeatId),
        )
        .where(eq(heartbeats.visibility, "public"))
        .groupBy(
          heartbeats.id,
          users.id,
          users.name,
          users.username,
          users.profileImageUrl,
        )
        .orderBy(desc(heartbeats.createdAt));

      if (input.cursor) {
        query.where(lt(heartbeats.createdAt, new Date(input.cursor)));
      }

      const results = await query.limit(input.limit + 1);

      const hasNextPage = results.length > input.limit;
      const heartbeatsData = hasNextPage
        ? results.slice(0, input.limit)
        : results;

      return {
        heartbeats: heartbeatsData.map((r) => ({
          ...r.heartbeat,
          user: r.user,
          likeCount: r.like_count,
          commentCount: r.comment_count,
        })),
        nextCursor: hasNextPage
          ? heartbeatsData[
              heartbeatsData.length - 1
            ].heartbeat.createdAt.toISOString()
          : undefined,
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
        visibility: input.visibility || "public",
      };

      if (input.image) values.imageUrl = input.image;
      if (input.video) values.imageUrl = input.video; // Using imageUrl for both as per schema

      const [newHeartbeat] = await db
        .insert(heartbeats)
        .values(values)
        .returning();

      return newHeartbeat;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const heartbeat = await db
        .select()
        .from(heartbeats)
        .where(eq(heartbeats.id, input))
        .limit(1);

      if (heartbeat.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Heartbeat not found",
        });
      }

      if (heartbeat[0].userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the creator can delete this post",
        });
      }

      // Delete associated media from UploadThing
      if (heartbeat[0].imageUrl) {
        const fileKey = heartbeat[0].imageUrl.split("/").pop();
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

      if (comment[0].userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the comment author can delete this comment",
        });
      }

      await db.delete(heartbeatComments).where(eq(heartbeatComments.id, input));
      await db
        .update(heartbeats)
        .set({ comments: sql`${heartbeats.comments} - 1` })
        .where(eq(heartbeats.id, comment[0].heartbeatId));

      return { success: true };
    }),

  likeComment: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existing = await db
        .select()
        .from(heartbeatLikes)
        .where(
          and(
            eq(heartbeatLikes.commentId, input),
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
              eq(heartbeatLikes.commentId, input),
              eq(heartbeatLikes.userId, userId),
            ),
          );
        await db
          .update(heartbeatComments)
          .set({ likes: sql`${heartbeatComments.likes} - 1` })
          .where(eq(heartbeatComments.id, input));
        return { liked: false };
      }

      await db.insert(heartbeatLikes).values({
        commentId: input,
        userId,
      });
      await db
        .update(heartbeatComments)
        .set({ likes: sql`${heartbeatComments.likes} + 1` })
        .where(eq(heartbeatComments.id, input));
      return { liked: true };
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

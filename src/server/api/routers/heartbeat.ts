// // src/server/routers/heartbeat.ts (new)
// import { z } from "zod";
// import { protectedProcedure, publicProcedure, createTRPCRouter } from "../trpc";
// import { db } from "@/server/db";
// import {
//   heartbeats,
//   heartbeatLikes,
//   heartbeatComments,
// } from "@/server/db/schema";
// import { eq, and, desc, count } from "drizzle-orm";

// export const heartbeatRouter = createTRPCRouter({
//   getAll: publicProcedure
//     .input(
//       z.object({
//         limit: z.number().min(1).max(100).default(20),
//         cursor: z.number().optional(),
//       }),
//     )
//     .query(async ({ input }) => {
//       let query = db
//         .select({
//           heartbeat: heartbeats,
//           likeCount: count(heartbeatLikes.heartbeatId).as("like_count"),
//           commentCount: count(heartbeatComments.id).as("comment_count"),
//         })
//         .from(heartbeats)
//         .leftJoin(heartbeatLikes, eq(heartbeats.id, heartbeatLikes.heartbeatId))
//         .leftJoin(
//           heartbeatComments,
//           eq(heartbeats.id, heartbeatComments.heartbeatId),
//         )
//         .groupBy(heartbeats.id)
//         .orderBy(desc(heartbeats.createdAt));

//       if (input.cursor) {
//         query = query.where(lt(heartbeats.id, input.cursor));
//       }

//       const results = await query.limit(input.limit);

//       return results.map((r) => ({
//         ...r.heartbeat,
//         likeCount: r.like_count,
//         commentCount: r.comment_count,
//       }));
//     }),

//   create: protectedProcedure
//     .input(
//       z.object({
//         content: z.string().min(1),
//       }),
//     )
//     .mutation(async ({ ctx, input }) => {
//       const [newHeartbeat] = await db
//         .insert(heartbeats)
//         .values({
//           content: input.content,
//           userId: ctx.session.user.id,
//         })
//         .returning();
//       return newHeartbeat;
//     }),

//   like: protectedProcedure
//     .input(z.number())
//     .mutation(async ({ ctx, input }) => {
//       const userId = ctx.session.user.id;
//       const existing = await db
//         .select()
//         .from(heartbeatLikes)
//         .where(
//           and(
//             eq(heartbeatLikes.heartbeatId, input),
//             eq(heartbeatLikes.userId, userId),
//           ),
//         )
//         .limit(1);
//       if (existing.length > 0) return { success: true };

//       await db.insert(heartbeatLikes).values({
//         heartbeatId: input,
//         userId,
//       });
//       return { success: true };
//     }),

//   comment: protectedProcedure
//     .input(
//       z.object({
//         heartbeatId: z.number(),
//         content: z.string().min(1),
//       }),
//     )
//     .mutation(async ({ ctx, input }) => {
//       const [newComment] = await db
//         .insert(heartbeatComments)
//         .values({
//           content: input.content,
//           heartbeatId: input.heartbeatId,
//           userId: ctx.session.user.id,
//         })
//         .returning();
//       return newComment;
//     }),

//   getComments: publicProcedure.input(z.number()).query(async ({ input }) => {
//     return db
//       .select()
//       .from(heartbeatComments)
//       .where(eq(heartbeatComments.heartbeatId, input))
//       .orderBy(desc(heartbeatComments.createdAt));
//   }),
// });

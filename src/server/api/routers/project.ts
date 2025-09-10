// // src/server/routers/project.ts (new)
// import { z } from "zod";
// import { protectedProcedure, publicProcedure, createTRPCRouter } from "../trpc";
// import { db } from "@/server/db";
// import {
//   projects,
//   projectMembers,
//   projectUpvotes,
//   projectStatusEnum,
// } from "@/server/db/schema";
// import { eq, and, inArray, count, asc, desc } from "drizzle-orm";

// export const projectRouter = createTRPCRouter({
//   getAll: publicProcedure
//     .input(
//       z.object({
//         category: z.string().optional(),
//         sort: z.enum(["newest", "upvotes"]).optional(),
//         limit: z.number().min(1).max(100).default(20),
//         cursor: z.number().optional(),
//       }),
//     )
//     .query(async ({ input }) => {
//       let query = db
//         .select({
//           project: projects,
//           upvoteCount: count(projectUpvotes.projectId).as("upvote_count"),
//         })
//         .from(projects)
//         .leftJoin(projectUpvotes, eq(projects.id, projectUpvotes.projectId))
//         .groupBy(projects.id);

//       if (input.category) {
//         query = query.where(eq(projects.category, input.category));
//       }

//       if (input.sort === "upvotes") {
//         query = query.orderBy(desc(sql`upvote_count`));
//       } else {
//         query = query.orderBy(desc(projects.createdAt));
//       }

//       if (input.cursor) {
//         query = query.where(lt(projects.id, input.cursor));
//       }

//       const results = await query.limit(input.limit);

//       return results.map((r) => ({
//         ...r.project,
//         upvoteCount: r.upvote_count,
//       }));
//     }),

//   getById: publicProcedure.input(z.number()).query(async ({ input }) => {
//     const [project] = await db
//       .select()
//       .from(projects)
//       .where(eq(projects.id, input));
//     if (!project) throw new TRPCError({ code: "NOT_FOUND" });
//     return project;
//   }),

//   create: protectedProcedure
//     .input(
//       z.object({
//         title: z.string().min(1).max(256),
//         description: z.string().min(1),
//         category: z.string().max(100).optional(),
//       }),
//     )
//     .mutation(async ({ ctx, input }) => {
//       const [newProject] = await db
//         .insert(projects)
//         .values({
//           title: input.title,
//           description: input.description,
//           category: input.category,
//           creatorId: ctx.session.user.id,
//         })
//         .returning();

//       // Auto-join creator
//       await db.insert(projectMembers).values({
//         projectId: newProject.id,
//         userId: ctx.session.user.id,
//       });

//       return newProject;
//     }),

//   join: protectedProcedure
//     .input(z.number())
//     .mutation(async ({ ctx, input }) => {
//       const userId = ctx.session.user.id;
//       const existing = await db
//         .select()
//         .from(projectMembers)
//         .where(
//           and(
//             eq(projectMembers.projectId, input),
//             eq(projectMembers.userId, userId),
//           ),
//         )
//         .limit(1);
//       if (existing.length > 0) return { success: true }; // Already joined

//       await db.insert(projectMembers).values({
//         projectId: input,
//         userId,
//       });
//       return { success: true };
//     }),

//   upvote: protectedProcedure
//     .input(z.number())
//     .mutation(async ({ ctx, input }) => {
//       const userId = ctx.session.user.id;
//       const existing = await db
//         .select()
//         .from(projectUpvotes)
//         .where(
//           and(
//             eq(projectUpvotes.projectId, input),
//             eq(projectUpvotes.userId, userId),
//           ),
//         )
//         .limit(1);
//       if (existing.length > 0) return { success: true }; // Already upvoted

//       await db.insert(projectUpvotes).values({
//         projectId: input,
//         userId,
//       });
//       return { success: true };
//     }),

//   // Admin only: complete project and award points
//   completeAndAward: adminProcedure
//     .input(
//       z.object({
//         projectId: z.number(),
//         points: z.array(
//           z.object({ userId: z.string(), points: z.number().min(0) }),
//         ),
//       }),
//     )
//     .mutation(async ({ input }) => {
//       await db.transaction(async (tx) => {
//         await tx
//           .update(projects)
//           .set({ status: "completed" })
//           .where(eq(projects.id, input.projectId));

//         for (const award of input.points) {
//           await tx
//             .update(users)
//             .set({
//               influencePoints: sql`${users.influencePoints} + ${award.points}`,
//             })
//             .where(eq(users.id, award.userId));
//         }
//       });
//       return { success: true };
//     }),

//   // Get members for a project
//   getMembers: publicProcedure.input(z.number()).query(async ({ input }) => {
//     return db
//       .select({ user: users })
//       .from(projectMembers)
//       .innerJoin(users, eq(projectMembers.userId, users.id))
//       .where(eq(projectMembers.projectId, input));
//   }),
// });

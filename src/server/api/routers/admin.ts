// // src/server/routers/admin.ts (new)
// import { z } from "zod";
// import { adminProcedure, router } from "../trpc";
// import { db } from "@/server/db";
// import {
//   users,
//   projects,
//   heartbeats,
//   heartbeatComments,
// } from "@/server/db/schema";
// import { eq } from "drizzle-orm";

// export const adminRouter = router({
//   getAllUsers: adminProcedure.query(async () => {
//     return db.select().from(users);
//   }),

//   updateUserRole: adminProcedure
//     .input(
//       z.object({
//         userId: z.string(),
//         role: z.enum(["user", "admin"]),
//       }),
//     )
//     .mutation(async ({ input }) => {
//       await db
//         .update(users)
//         .set({ role: input.role })
//         .where(eq(users.id, input.userId));
//       return { success: true };
//     }),

//   deleteProject: adminProcedure
//     .input(z.number())
//     .mutation(async ({ input }) => {
//       await db.delete(projects).where(eq(projects.id, input));
//       return { success: true };
//     }),

//   deleteHeartbeat: adminProcedure
//     .input(z.number())
//     .mutation(async ({ input }) => {
//       await db.delete(heartbeats).where(eq(heartbeats.id, input));
//       return { success: true };
//     }),

//   deleteComment: adminProcedure
//     .input(z.number())
//     .mutation(async ({ input }) => {
//       await db.delete(heartbeatComments).where(eq(heartbeatComments.id, input));
//       return { success: true };
//     }),

//   // More admin actions can be added, e.g., manage points directly
//   adjustInfluence: adminProcedure
//     .input(
//       z.object({
//         userId: z.string(),
//         points: z.number(),
//       }),
//     )
//     .mutation(async ({ input }) => {
//       await db
//         .update(users)
//         .set({
//           influencePoints: sql`${users.influencePoints} + ${input.points}`,
//         })
//         .where(eq(users.id, input.userId));
//       return { success: true };
//     }),
// });

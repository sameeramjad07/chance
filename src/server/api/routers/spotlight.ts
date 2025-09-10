// // src/server/routers/spotlight.ts (new)
// import { z } from "zod";
// import { publicProcedure, createTRPCRouter } from "../trpc";
// import { db } from "@/server/db";
// import { users } from "@/server/db/schema";
// import { desc } from "drizzle-orm";

// export const spotlightRouter = createTRPCRouter({
//   getRankings: publicProcedure
//     .input(
//       z.object({
//         limit: z.number().min(1).max(100).default(20),
//       }),
//     )
//     .query(async ({ input }) => {
//       return db
//         .select({
//           id: users.id,
//           name: users.name,
//           influencePoints: users.influencePoints,
//         })
//         .from(users)
//         .where(ne(users.influencePoints, 0)) // Optional: exclude zero points
//         .orderBy(desc(users.influencePoints))
//         .limit(input.limit);
//     }),
// });

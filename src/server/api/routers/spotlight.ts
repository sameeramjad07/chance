import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { db } from "@/server/db";
import { users, projectsCompleted, heartbeats } from "@/server/db/schema";
import { desc, eq, count } from "drizzle-orm";

export const spotlightRouter = createTRPCRouter({
  getRankings: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        timeframe: z.enum(["weekly", "monthly", "allTime"]).default("allTime"),
      }),
    )
    .query(async ({ input }) => {
      const query = db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          influence: users.influence,
          projectsCompleted: count(projectsCompleted.id).as(
            "projects_completed",
          ),
          heartbeats: count(heartbeats.id).as("heartbeats_count"),
        })
        .from(users)
        .leftJoin(projectsCompleted, eq(users.id, projectsCompleted.userId))
        .leftJoin(heartbeats, eq(users.id, heartbeats.userId))
        .where(
          input.timeframe !== "allTime"
            ? eq(users.isVerified, true)
            : undefined,
        )
        .groupBy(
          users.id,
          users.name,
          users.username,
          users.profileImageUrl,
          users.influence,
        )
        .orderBy(desc(users.influence))
        .limit(input.limit);

      if (input.timeframe === "weekly") {
        query.where(
          sql`${users.updatedAt} >= CURRENT_DATE - INTERVAL '7 days'`,
        );
      } else if (input.timeframe === "monthly") {
        query.where(
          sql`${users.updatedAt} >= CURRENT_DATE - INTERVAL '30 days'`,
        );
      }

      const results = await query;

      return results.map((user, index) => ({
        rank: index + 1,
        id: user.id,
        user: {
          id: user.id,
          name: user.name ?? "Unknown User",
          username: user.username ?? `@user${user.id.slice(0, 8)}`,
          avatar: user.profileImageUrl ?? "/placeholder.svg",
        },
        influence: user.influence,
        projectsCompleted: user.projects_completed,
        heartbeats: user.heartbeats_count,
      }));
    }),
  getUserProfile: publicProcedure.input(z.string()).query(async ({ input }) => {
    const [userData] = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        profileImageUrl: users.profileImageUrl,
        influence: users.influence,
        createdAt: users.createdAt,
        projectsCompleted: count(projectsCompleted.id).as("projects_completed"),
        heartbeats: count(heartbeats.id).as("heartbeats_count"),
      })
      .from(users)
      .leftJoin(projectsCompleted, eq(users.id, projectsCompleted.userId))
      .leftJoin(heartbeats, eq(users.id, heartbeats.userId))
      .where(eq(users.id, input))
      .groupBy(
        users.id,
        users.name,
        users.username,
        users.profileImageUrl,
        users.influence,
        users.createdAt,
      )
      .limit(1);

    if (!userData) {
      throw new Error("User not found");
    }

    return {
      id: userData.id,
      name: userData.name ?? "Unknown User",
      username: userData.username ?? `@user${userData.id.slice(0, 8)}`,
      avatar: userData.profileImageUrl ?? "/placeholder.svg",
      influence: userData.influence,
      projectsCompleted: userData.projectsCompleted,
      heartbeats: userData.heartbeats,
      createdAt: userData.createdAt,
    };
  }),
});

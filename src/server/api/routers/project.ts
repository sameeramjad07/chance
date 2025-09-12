import { z } from "zod";
import { protectedProcedure, publicProcedure, createTRPCRouter } from "../trpc";
import { db } from "@/server/db";
import {
  projects,
  projectMembers,
  projectVotes,
  projectStatusEnum,
  users,
} from "@/server/db/schema";
import { eq, and, count, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        status: z.enum(projectStatusEnum.enumValues).optional(),
        sort: z.enum(["newest", "upvotes"]).optional().default("newest"),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      // Build up dynamic filters
      const conditions = [eq(projects.visibility, "public")];

      if (input.category) {
        conditions.push(eq(projects.category, input.category));
      }

      if (input.status) {
        conditions.push(eq(projects.status, input.status));
      }

      if (input.cursor) {
        conditions.push(sql`${projects.id} < ${input.cursor}`);
      }

      // Base query (NO orderBy/limit yet)
      const baseQuery = db
        .select({
          project: projects,
          voteCount: count(projectVotes.id).as("voteCount"),
          creator: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
          },
        })
        .from(projects)
        .leftJoin(projectVotes, eq(projects.id, projectVotes.projectId))
        .leftJoin(users, eq(projects.creatorId, users.id))
        .where(and(...conditions))
        .groupBy(projects.id, users.id);

      // Sorting + pagination
      const sortedQuery =
        input.sort === "upvotes"
          ? baseQuery.orderBy(desc(sql`voteCount`), desc(projects.createdAt))
          : baseQuery.orderBy(desc(projects.createdAt));

      const results = await sortedQuery.limit(input.limit + 1);

      const hasNextPage = results.length > input.limit;
      const projectsData = results.slice(0, input.limit);

      return {
        projects: projectsData.map((r) => ({
          ...r.project,
          voteCount: r.voteCount,
          creator: r.creator,
        })),
        nextCursor:
          hasNextPage && projectsData.length > 0
            ? projectsData[projectsData.length - 1]?.project.id
            : undefined,
      };
    }),

  getById: publicProcedure.input(z.string()).query(async ({ input }) => {
    const [result] = await db
      .select({
        project: projects,
        voteCount: count(projectVotes.id).as("voteCount"),
        creator: {
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(projects)
      .leftJoin(projectVotes, eq(projects.id, projectVotes.projectId))
      .leftJoin(users, eq(projects.creatorId, users.id))
      .where(eq(projects.id, input))
      .groupBy(projects.id, users.id);

    if (!result) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
    }

    return {
      ...result.project,
      voteCount: result.voteCount,
      creator: result.creator,
    };
  }),

  getUserProjects: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Collect conditions
      const conditions = [
        sql`${projects.creatorId} = ${userId} OR ${projectMembers.userId} = ${userId}`,
      ];

      if (typeof input.cursor === "string") {
        conditions.push(sql`${projects.id} < ${input.cursor}`);
      }

      const results = await db
        .select({
          project: projects,
          voteCount: count(projectVotes.id).as("voteCount"),
          isMember:
            sql<boolean>`CASE WHEN ${projectMembers.userId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
              "isMember",
            ),
          isCreator:
            sql<boolean>`CASE WHEN ${projects.creatorId} = ${userId} THEN TRUE ELSE FALSE END`.as(
              "isCreator",
            ),
          creator: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
          },
        })
        .from(projects)
        .leftJoin(projectVotes, eq(projects.id, projectVotes.projectId))
        .leftJoin(users, eq(projects.creatorId, users.id))
        .leftJoin(
          projectMembers,
          and(
            eq(projectMembers.projectId, projects.id),
            eq(projectMembers.userId, userId),
          ),
        )
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        // 👈 all conditions in one call
        .groupBy(projects.id, projectMembers.userId, users.id)
        .orderBy(desc(projects.createdAt))
        .limit(input.limit + 1);

      const hasNextPage = results.length > input.limit;
      const projectsData = results.slice(0, input.limit);

      return {
        projects: projectsData.map((r) => ({
          ...r.project,
          voteCount: r.voteCount,
          isMember: r.isMember,
          isCreator: r.isCreator,
          creator: r.creator,
        })),
        nextCursor:
          hasNextPage && projectsData.length > 0
            ? projectsData[projectsData.length - 1]?.project.id
            : undefined,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(256),
        description: z.string().min(1),
        category: z.string().max(100),
        impact: z.string().min(1),
        teamSize: z.number().min(1),
        effort: z.string().max(100),
        peopleInfluenced: z.number().min(1),
        typeOfPeople: z.string().max(255).optional(),
        requiredTools: z.array(z.string()).default([]),
        actionPlan: z.array(z.string()).default([]),
        collaboration: z.string().optional(),
        visibility: z.enum(["public", "private"]).default("public"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newProject] = await db
        .insert(projects)
        .values({
          ...input,
          creatorId: ctx.session.user.id,
          status: "open",
        })
        .returning();

      if (!newProject) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create project",
        });
      }

      await db.insert(projectMembers).values({
        projectId: newProject.id,
        userId: ctx.session.user.id,
      });

      return newProject;
    }),

  update: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string().min(1).max(256),
        description: z.string().min(1),
        category: z.string().max(100),
        impact: z.string().min(1),
        teamSize: z.number().min(1),
        effort: z.string().max(100),
        visibility: z.enum(["public", "private"]),
        status: z.enum(["open", "ongoing", "completed"]),
        peopleInfluenced: z.number().nullable().optional(),
        adminNotes: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, input.projectId))
        .limit(1);

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (project.creatorId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the project creator can update the project",
        });
      }

      const [updatedProject] = await db
        .update(projects)
        .set({
          title: input.title,
          description: input.description,
          category: input.category,
          impact: input.impact,
          teamSize: input.teamSize,
          effort: input.effort,
          peopleInfluenced: input.peopleInfluenced ?? null,
          visibility: input.visibility,
          status: input.status,
          adminNotes: input.adminNotes ?? null,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, input.projectId))
        .returning();

      if (!updatedProject) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update project",
        });
      }

      return updatedProject;
    }),

  delete: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, input.projectId))
        .limit(1);

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (project.creatorId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the project creator can delete the project",
        });
      }

      await db.transaction(async (tx) => {
        await tx
          .delete(projectMembers)
          .where(eq(projectMembers.projectId, input.projectId));
        await tx
          .delete(projectVotes)
          .where(eq(projectVotes.projectId, input.projectId));
        await tx.delete(projects).where(eq(projects.id, input.projectId));
      });

      return { success: true };
    }),
  join: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [existing] = await db
        .select()
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, input),
            eq(projectMembers.userId, userId),
          ),
        )
        .limit(1);

      if (existing) {
        return { success: true }; // Already joined
      }

      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, input))
        .limit(1);

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (project.status !== "open") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Project is not open for joining",
        });
      }

      await db.insert(projectMembers).values({
        projectId: input,
        userId,
      });

      return { success: true };
    }),

  leave: protectedProcedure
    .input(z.object({ projectId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [membership] = await db
        .select()
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, input.projectId),
            eq(projectMembers.userId, input.userId),
          ),
        )
        .limit(1);

      if (!membership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Membership not found",
        });
      }

      await db
        .delete(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, input.projectId),
            eq(projectMembers.userId, input.userId),
          ),
        );

      return { success: true };
    }),

  upvote: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [existing] = await db
        .select()
        .from(projectVotes)
        .where(
          and(
            eq(projectVotes.projectId, input),
            eq(projectVotes.userId, userId),
          ),
        )
        .limit(1);

      if (existing) {
        return { success: true }; // Already voted
      }

      await db.insert(projectVotes).values({
        projectId: input,
        userId,
        voteType: "upvote",
      });

      await db
        .update(projects)
        .set({ likes: sql`${projects.likes} + 1` })
        .where(eq(projects.id, input));

      return { success: true };
    }),

  // Admin only: complete project and award influence
  completeAndAward: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        points: z.array(
          z.object({ userId: z.string(), points: z.number().min(0) }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      await db.transaction(async (tx) => {
        await tx
          .update(projects)
          .set({ status: "completed" })
          .where(eq(projects.id, input.projectId));

        for (const award of input.points) {
          await tx
            .update(users)
            .set({
              influence: sql`${users.influence} + ${award.points}`,
            })
            .where(eq(users.id, award.userId));
        }
      });

      return { success: true };
    }),

  getMembers: publicProcedure.input(z.string()).query(async ({ input }) => {
    const members = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        username: users.username,
        profileImageUrl: users.profileImageUrl,
      })
      .from(projectMembers)
      .innerJoin(users, eq(projectMembers.userId, users.id))
      .where(eq(projectMembers.projectId, input));

    return members;
  }),
});

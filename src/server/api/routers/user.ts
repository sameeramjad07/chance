// src/server/routers/user.ts
import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import {
  users,
  projects,
  projectMembers,
  heartbeats,
} from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  getProfile: protectedProcedure
    .input(z.string().optional()) // Optional userId, defaults to self
    .query(async ({ ctx, input }) => {
      const userId = input || ctx.session.user.id;
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          school: users.school,
          bio: users.bio,
          instagram: users.instagram,
          whatsappNumber: users.whatsappNumber,
          profileCompleted: users.profileCompleted,
          role: users.role,
          influence: users.influence,
          isVerified: users.isVerified,
        })
        .from(users)
        .where(eq(users.id, userId));
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      return user;
    }),

  getMyProjects: protectedProcedure.query(async ({ ctx }) => {
    const results = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        category: projects.category,
        impact: projects.impact,
        teamSize: projects.teamSize,
        effort: projects.effort,
        peopleInfluenced: projects.peopleInfluenced,
        typeOfPeople: projects.typeOfPeople,
        requiredTools: projects.requiredTools,
        actionPlan: projects.actionPlan,
        collaboration: projects.collaboration,
        likes: projects.likes,
        creatorId: projects.creatorId,
        status: projects.status,
        visibility: projects.visibility,
        adminNotes: projects.adminNotes,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projectMembers)
      .innerJoin(projects, eq(projectMembers.projectId, projects.id))
      .where(eq(projectMembers.userId, ctx.session.user.id));
    return results.map((result) => result);
  }),

  getMyHeartbeats: protectedProcedure.query(async ({ ctx }) => {
    return db
      .select({
        id: heartbeats.id,
        content: heartbeats.content,
        imageUrl: heartbeats.imageUrl,
        userId: heartbeats.userId,
        likes: heartbeats.likes,
        comments: heartbeats.comments,
        visibility: heartbeats.visibility,
        createdAt: heartbeats.createdAt,
        updatedAt: heartbeats.updatedAt,
      })
      .from(heartbeats)
      .where(eq(heartbeats.userId, ctx.session.user.id))
      .orderBy(desc(heartbeats.createdAt));
  }),

  // Add signup mutation for email-based registration (if needed)
  signup: router.procedure
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        username: z.string().min(3).optional(),
        whatsappNumber: z.string().min(10, "WhatsApp number is required"),
      }),
    )
    .mutation(async ({ input }) => {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);
      if (existingUser.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      const [newUser] = await db
        .insert(users)
        .values({
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          username: input.username,
          whatsappNumber: input.whatsappNumber,
          profileCompleted: false,
          role: "user",
          isVerified: false,
        })
        .returning();
      return newUser;
    }),
});

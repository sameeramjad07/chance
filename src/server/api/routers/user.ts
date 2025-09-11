// src/server/routers/user.ts
import { z } from "zod";
import { protectedProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@/server/db";
import {
  users,
  projects,
  projectMembers,
  heartbeats,
} from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure
    .input(z.string().optional()) // Optional userId, defaults to self
    .query(async ({ ctx, input }) => {
      const userId = input ?? ctx.session.user.id;
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

  // ---------- Signup ----------
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        whatsappNumber: z.string().min(10, "WhatsApp number is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
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

      // Generate username
      const lastDigits = input.whatsappNumber.slice(-4);
      const baseUsername = `${input.firstName}${input.lastName}${lastDigits}`
        .replace(/\s+/g, "")
        .toLowerCase();

      let username = baseUsername;
      let counter = 1;
      while (
        (
          await db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1)
        ).length > 0
      ) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      // Hash password
      const hash = await bcrypt.hash(input.password, 10);

      const [newUser] = await db
        .insert(users)
        .values({
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          username,
          whatsappNumber: input.whatsappNumber,
          passwordHash: hash,
          profileCompleted: false,
          role: "user",
          isVerified: false,
        })
        .returning();

      return newUser;
    }),

  // ---------- Signin ----------
  signin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid email or password",
        });
      }

      const validPassword = await bcrypt.compare(
        input.password,
        user.passwordHash ?? "",
      );

      if (!validPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // At this point, user is authenticated
      // If you’re using NextAuth, you typically return the user and let NextAuth manage session
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
      };
    }),
});

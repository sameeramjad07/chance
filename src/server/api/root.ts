import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
// import { postRouter } from "@/server/api/routers/post";
// import { adminRouter } from "./routers/admin";
// import { heartbeatRouter } from "./routers/heartbeat";
// import { spotlightRouter } from "./routers/spotlight";
import { projectRouter } from "./routers/project";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // post: postRouter,
  // admin: adminRouter,
  // heartbeat: heartbeatRouter,
  // spotlight: spotlightRouter,
  project: projectRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

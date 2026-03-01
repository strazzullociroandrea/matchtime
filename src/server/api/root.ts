import { orarioRouter } from "@/server/api/routers/orario";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { NotificationRouter } from "@/server/api/routers/notification";

export const appRouter = createTRPCRouter({
  orario: orarioRouter,
  notification: NotificationRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

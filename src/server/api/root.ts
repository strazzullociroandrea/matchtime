import { orarioRouter } from "@/server/api/routers/orario";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
export const appRouter = createTRPCRouter({
	orarioRouter: orarioRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

import {createCallerFactory, createTRPCRouter} from "@/server/api/trpc";
import {orarioRouter} from "@/server/api/routers/orario";
export const appRouter = createTRPCRouter({
    orarioRouter: orarioRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { MatchSchema } from "@/lib/schemas/match-schema";
import asyncJob from "@/server/api/routers/api/asyncJob";
import fetchAndCache from "@/server/api/routers/api/getInfo/fetchAndCache";
import { env } from "@/env";

export const orarioRouter = createTRPCRouter({
  getInfo: publicProcedure
    .input(z.void())
    .output(
      z.object({
        matches: z.array(MatchSchema),
        lastUpdate: z.string(),
        team: z.string(),
        category: z.string().nullable(),
      }),
    )
    .query(async () => {
      try {
        const data = await asyncJob(
          "Fetching match data...",
          async () => {
            return await fetchAndCache(env.CATEGORY);
          },
          "Match data fetched successfully.",
        );

        return data;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve match data.",
          cause: error,
        });
      }
    }),
});

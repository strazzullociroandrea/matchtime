import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { subscriptions } from "@/lib/schemas/db-schema";
import { sendWeeklyReminder } from "@/server/api/routers/api/sendWeeklyReminder";
export const NotificationRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(
      z.object({
        subscription: z.object({
          endpoint: z.string(),
          keys: z.object({
            p256dh: z.string(),
            auth: z.string(),
          }),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { endpoint, keys } = input.subscription;

        await db
          .insert(subscriptions)
          .values({
            endpoint,
            p256dh: keys.p256dh,
            auth: keys.auth,
          })
          .onDuplicateKeyUpdate({
            set: {
              p256dh: keys.p256dh,
              auth: keys.auth,
            },
          });
        return { success: true };
      } catch (error) {
        console.error("Errore durante la sottoscrizione:", error);
      }
    }),
  sendWeeklyReminder: publicProcedure.mutation(async () => {
    return await sendWeeklyReminder();
  }),
});

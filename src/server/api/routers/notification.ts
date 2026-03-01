import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { subscriptions } from "@/lib/schemas/db-schema";
import { eq, is } from "drizzle-orm";
export const NotificationRouter = createTRPCRouter({
  manageSubscribtion: publicProcedure
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

        const existing = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.endpoint, endpoint))
          .limit(1);

        if (!existing || existing.length === 0) {
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
          return { operation: "subscribe", success: true };
        } else {
          await db
            .delete(subscriptions)
            .where(eq(subscriptions.endpoint, endpoint));
          return { operation: "unsubscribe", success: true };
        }
      } catch (error) {
        console.error("Errore durante la sottoscrizione:", error);
        throw error;
      }
    }),
});

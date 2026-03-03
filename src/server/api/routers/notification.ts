import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { subscriptions } from "@/lib/schemas/db-schema";
import { eq } from "drizzle-orm";

export const NotificationRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(
      z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await db
          .insert(subscriptions)
          .values({
            endpoint: input.endpoint,
            p256dh: input.keys.p256dh,
            auth: input.keys.auth,
          })
          .onConflictDoUpdate({
            target: subscriptions.endpoint,
            set: {
              p256dh: input.keys.p256dh,
              auth: input.keys.auth,
            },
          });
        console.log(
          "[LOG] User subscribed to push notifications successfully.",
        );
        return { success: true };
      } catch (error) {
        console.log(
          "[ERROR] It was not possible to subscribe the user to push notifications:",
          error,
        );
        throw new Error("Failed to subscribe");
      }
    }),
  unsubscribe: publicProcedure
    .input(z.object({ endpoint: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await db
          .delete(subscriptions)
          .where(eq(subscriptions.endpoint, input.endpoint));
        console.log("[LOG] User unsubscribed from push notifications.");
        return { success: true };
      } catch (error) {
        console.log(
          "[ERROR] It was not possible to unsubscribe the user from push notifications:",
          error,
        );
        throw new Error("Failed to unsubscribe");
      }
    }),

  isSubscribed: publicProcedure
    .input(z.object({ endpoint: z.string() }))
    .query(async ({ input }) => {
      try {
        const existing = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.endpoint, input.endpoint))
          .limit(1);
        console.log(
          "[LOG] Checked subscription status for endpoint successfully.",
        );
        return { isSubscribed: existing.length > 0 };
      } catch (error) {
        console.log(
          "[ERROR] It was not possible to check the subscription status:",
          error,
        );
        throw new Error("Failed to check subscription status");
      }
    }),
});

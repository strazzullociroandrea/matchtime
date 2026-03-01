import webpush from "web-push";
import { env } from "@/env";
import { db } from "@/server/db";
import { subscriptions } from "@/lib/schemas/db-schema";
webpush.setVapidDetails(
  "mailto:" + env.EMAIL_ADMIN,
  env.NEXT_PUBLIC_VAPID_KEY,
  env.PRIVATE_VAPID_KEY,
);

export const sendPushNotification = async (payload: string) => {
  const results = {
    successful: 0,
    failed: 0,
  };

  console.log("[LOG] Starting to send notifications");

  const allSubscriptions = await db.select().from(subscriptions);

  for (const subscription of allSubscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        payload,
      );

      console.log(
        "[LOG] Notification number " +
          (results.successful + 1) +
          " sent successfully.",
      );

      results.successful++;
    } catch (error) {
      console.log(
        "[ERROR] Failed to send notification number " +
          (results.failed + 1) +
          " cause: ",
        error,
      );
      results.failed++;
    }
  }
  return results;
};

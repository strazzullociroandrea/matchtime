import webpush from "web-push";
import { env } from "@/env";

/**
 * Set up VAPID keys for web push notifications.
 * In this setup, we use the administrator's email as the contact information,
 * along with the public and private keys defined in the environment variables.
 */
webpush.setVapidDetails(
  env.MAIL_ADMIN,
  env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY,
);

export async function sendPushNotification(
  userId: string,
  linkId: string,
  title: string,
  body: string,
) {
  console.log(
    `Invio notifica push a ${userId} con titolo "${title}" e corpo "${body}"`,
  );
  
  /*const subs = [];
    subs.forEach((sub) => {
      try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify({ title, body }),
      );

    } catch (error) {
      const webPushError = error as { statusCode?: number };
      if (webPushError.statusCode === 410 || webPushError.statusCode === 404) {
        // Subscription is no longer valid, remove it from the database
        console.log(`Subscription for user ${userId} is not valid. Removing it.`);
      } else {
        console.error("Push error:", error);
      }
    }
    }*/
}

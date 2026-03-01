import { TRPCError } from "@trpc/server";
import fetchAndCache from "@/server/api/routers/api/getInfo/fetchAndCache";
import { sendPushNotification } from "@/lib/web-push";

export const sendWeeklyReminder = async () => {
  try {
    const { matches } = await fetchAndCache();

    const filtered = matches.filter((match) => {
      if (match.status === "Conclusa" || match.status === "Rinviata")
        return false;

      const [day, month, year] = match.date.split("/").map(Number);
      if (!day || !month || !year) return false;
      const matchDate = new Date(year, month - 1, day);
      const today = new Date();
      const msForDay = 1000 * 60 * 60 * 24;
      const diff = Math.round(
        (matchDate.getTime() - today.getTime()) / msForDay,
      );
      return diff === 7;
    });

    for (const match of filtered) {
      await sendPushNotification(
        JSON.stringify({
          title: "Promemoria partita tra 7 giorni",
          body: `${match.home} vs ${match.guest} - ${match.date} ore ${match.hour}`,
          url: "/",
        }),
      );
    }
    return {
      sent: filtered.length > 0,
      reason: filtered.length === 0 ? "no_matches_in_7_days" : undefined,
    };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching matches data",
      cause: error instanceof Error ? error.message : String(error),
    });
  }
};

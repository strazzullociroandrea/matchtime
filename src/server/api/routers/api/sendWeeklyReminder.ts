import { TRPCError } from "@trpc/server";
import { sendPushNotification } from "@/lib/web-push";
import { PartitaVolley } from "@/lib/schemas/match-schema";

/**
 * Function to parse match date from "DD/MM/YYYY" format and return a Date object.
 * @param dateStr The date string in "DD/MM/YYYY" format.
 * @returns  A Date object if parsing is successful, or null if the format is invalid.
 */
const parseMatchDate = (dateStr: string): Date | null => {
  const [day, month, year] = dateStr.split("/").map(Number);

  if (!day || !month || !year) return null;

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;

  return date;
};

/**
 * Function to get the start of the day for a given date, used to calculate the difference in days between two dates.
 * @param date The date for which to calculate the start of the day.
 * @returns  A Date object representing the start of the day (00:00:00) for the given date.
 */
const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * Function to calculate the number of days until a given date from today, used to filter matches that are exactly 7 days away.
 * @param date  The date for which to calculate the number of days until from today.
 * @returns  The number of days until the given date from today, rounded to the nearest whole number.
 */
const daysUntil = (date: Date) => {
  const oneDayMs = 1000 * 60 * 60 * 24;
  return Math.round(
    (startOfDay(date).getTime() - startOfDay(new Date()).getTime()) / oneDayMs,
  );
};

/**
 * Function to send a weekly reminder notification for matches that are scheduled exactly 7 days from the current date.
 * @returns An object indicating whether the notification was sent, the reason if it was not sent, and the count of matches that triggered the notification.
 */
export const sendWeeklyReminder = async ({
  matches,
}: {
  matches: PartitaVolley[];
}) => {
  try {
    const filtered = matches.filter((match) => {
      if (match.status === "Conclusa" || match.status === "Rinviata")
        return false;

      const matchDate = parseMatchDate(match.date);
      if (!matchDate) return false;

      return daysUntil(matchDate) >= 0;
    });

    if (filtered.length === 0) {
      return {
        sent: false,
        reason: "no_matches",
        count: 0,
      };
    }

    const firstMatch = filtered[0];
    const body =
      filtered.length === 1
        ? `${firstMatch.home} vs ${firstMatch.guest} alle ${firstMatch.hour}. Apri Match Time per i dettagli.`
        : `Hai ${filtered.length} partite tra 7 giorni. Apri Match Time per i dettagli.`;

    await sendPushNotification(
      JSON.stringify({
        title: "Promemoria partita tra 7 giorni.",
        body,
        url: "/",
      }),
    );

    return {
      sent: true,
      reason: undefined,
      count: filtered.length,
    };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching matches data",
      cause: error instanceof Error ? error.message : String(error),
    });
  }
};

import { TRPCError } from "@trpc/server";
import { sendPushNotification } from "@/lib/web-push";
import { PartitaVolley } from "@/lib/schemas/match-schema";
import { Agenda } from "agenda";
import { PostgresBackend } from "@agendajs/postgres-backend";
import { env } from "@/env";
let agenda: Agenda | null = null;

/**
 * Function to configure and return an instance of agenda.
 *
 * @param dbUrl The database URL for connecting to the PostgreSQL database used by Agenda.
 * @returns An instance of Agenda configured with the PostgreSQL backend.
 * @throws An error if the connection to PostgreSQL fails.
 */
const getAgenda = ({ dbUrl }: { dbUrl: string }) => {
  try {
    return new Agenda({
      backend: new PostgresBackend({
        connectionString: dbUrl,
      }),
      processEvery: "1 minute",
    });
  } catch (error) {
    console.error(
      "[ERROR] Failed to connect to PostgreSQL for Agenda: ",
      error,
    );
    throw new Error("Failed to connect to PostgreSQL for Agenda");
  }
};

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

      return daysUntil(matchDate) <= 7 && daysUntil(matchDate) >= 0;
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

    if (!agenda) {
      agenda = getAgenda({ dbUrl: env.POSTGRES_URL });
      await agenda.start();
    }

    agenda.define("check-weekly-matches", async (job) => {
      const { title, body } = job.attrs.data as { title: string; body: string };
      console.log(
        "[LOG] Sending weekly reminder notification with title: ",
        title,
      );

      await sendPushNotification(
        JSON.stringify({
          title,
          body,
          url: "/",
        }),
      );
    });

    for (const match of filtered) {
      const matchDate = parseMatchDate(match.date);
      if (!matchDate) {
        console.error(
          "[ERROR] Invalid match date format for match: ",
          match.home,
          " vs ",
          match.guest,
          " date: ",
          match.date,
        );
        continue;
      }

      const notificationDate = new Date(matchDate);
      notificationDate.setDate(notificationDate.getDate() - 7);

      await agenda.schedule(notificationDate, "check-weekly-matches", {
        title: "Partita in arrivo!",
        body: body,
      });

      console.log(
        "[LOG] Scheduled weekly reminder for match: ",
        match.home,
        " vs ",
        match.guest,
        " on ",
        notificationDate,
      );
    }

    return {
      sent: true,
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

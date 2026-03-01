import { TRPCError } from "@trpc/server";
import { unstable_cache } from "next/cache";
import prepareData from "@/server/api/routers/api/getInfo/prepareData";
import asyncJob from "@/server/api/routers/api/asyncJob";
import { env } from "@/env";
import { PartitaVolley } from "@/lib/schemas/match-schema";
import fs from "fs";
import { sendWeeklyReminder } from "@/server/api/routers/api/sendWeeklyReminder";
/**
 * Function to parse a date string in the format "dd/MM/yyyy" and return the corresponding timestamp. It splits the date string into day, month, and year components, creates a Date object using these components, and returns the timestamp (in milliseconds) of that date.
 * @param dateStr A string representing a date in the format "dd/MM/yyyy".
 * @returns The timestamp (in milliseconds) corresponding to the parsed date.
 */
const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
};

let isWorking = false;

/**
 * Function to sort the matches based on their status (Done or Not Done).
 * @param matches An array of PartitaVolley objects representing the matches to be sorted
 * @returns A sorted array of PartitaVolley objects.
 */
const orderByStatus = (matches: PartitaVolley[]): PartitaVolley[] => {
  return matches.sort((a, b) => {
    if (a.status === b.status) {
      const timeA = parseDate(a.date);
      const timeB = parseDate(b.date);
      return timeA - timeB;
    }

    if (a.status === "Prossima") return -1;
    if (b.status === "Prossima") return 1;

    if (a.status === "In programma") return -1;
    if (b.status === "In programma") return 1;

    if (a.status === "Rinviata") return 1;
    if (b.status === "Rinviata") return -1;

    if (a.status === "Conclusa") return 1;
    if (b.status === "Conclusa") return -1;

    return 0;
  });
};
/**
 * Function to fetch and cache volleyball match data. It checks if a data retrieval process is already in progress, and if not,
 * it prepares the data by calling the prepareData function, which retrieves and processes the match data, send notification and then return results.
 * The result is then cached for 12 hours (43200 seconds) with the tag "matches".
 * If an error occurs during the process, it throws a TRPCError with an appropriate message.
 *
 * @returns An object containing the matches data, the last update timestamp, the team, and the category.
 * @throws TRPCError if there is an error during the data retrieval process or if a retrieval process is already in progress.
 */
const fetchAndCacheMatches = unstable_cache(
  async () => {
    fs.mkdirSync(env.DOWNLOAD_PATH, { recursive: true });

    if (isWorking) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Recupero dati in corso. Riprova tra poco.",
      });
    }

    try {
      isWorking = true;
      const content = await asyncJob(
        "Preparing data for caching...",
        async () => {
          return await prepareData({
            downloadPath: env.DOWNLOAD_PATH,
            category: env.CATEGORY,
            team: env.TEAM,
            homePlace: env.HOME_PLACE,
            urlDownloadSite: env.URL_DOWNLOAD_SITE,
          });
        },
        "Data prepared successfully.",
      );

      await sendWeeklyReminder().catch(console.error);

      return {
        matches: orderByStatus(content),
        lastUpdate: new Date().toISOString(),
        team: env.TEAM,
        category: env.CATEGORY,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching and caching matches.",
        cause: error instanceof Error ? error : undefined,
      });
    } finally {
      isWorking = false;
    }
  },
  ["volleyball-matches-data"],
  { revalidate: 43200, tags: ["matches"] },
);

export default fetchAndCacheMatches;

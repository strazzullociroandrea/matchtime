import type { NextRequest } from "next/server";
import * as ics from "ics";
import fetchAndCacheMatches from "@/server/api/routers/api/getInfo/fetchAndCache";

const handler = async (req: NextRequest) => {
  try {
    const { matches } = await fetchAndCacheMatches();

    const events: ics.EventAttributes[] = matches
      .filter((match) => match.status !== "Conclusa")
      .map((match) => {
        const [day, month, year] = match.date.split("/").map(Number);
        const [hour, minute] = match.hour.split(":").map(Number);

        return {
          uid: `${match.home}-${match.guest}-${match.date}`
            .replace(/\s+/g, "")
            .toLowerCase(),
          start: [year, month, day, hour, minute],
          duration: { hours: 2, minutes: 0 },
          title: `${match.home} vs ${match.guest} - ${match.status}`,
          description: `Partita di pallavolo tra ${match.home} e ${match.guest}.`,
          location: match.place,
          categories: ["Partita di Pallavolo"],
          status: "CONFIRMED",
          busyStatus: "BUSY",
        };
      });

    const { error, value } = ics.createEvents(events);
    if (error) {
      console.error("Errore nella creazione del calendario:", error);
      return new Response("Errore nella creazione del calendario", {
        status: 500,
      });
    }

    return new Response(value, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="calendario-partite.ics"',
      },
    });
  } catch (error) {
    return new Response("Errore nella generazione del calendario", {
      status: 500,
    });
  }
};

export { handler as GET, handler as POST };

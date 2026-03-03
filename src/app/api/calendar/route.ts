import type { NextRequest } from "next/server";
import * as ics from "ics";
import fetchAndCacheMatches from "@/server/api/routers/api/getInfo/fetchAndCache";
import { env } from "@/env";

const handler = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category")?.replaceAll("_", " ");

    const { matches } = await fetchAndCacheMatches(category ?? env.CATEGORY);

    const validMatches = matches.filter((match) => {
      if (match.status === "Conclusa" || !match.date || !match.hour)
        return false;
      const [day, month, year] = match.date.split("/");
      const [hour, minute] = match.hour.split(":");
      return ![day, month, year, hour, minute].includes("NA");
    });

    const events: ics.EventAttributes[] = validMatches.map((match) => {
      const [day, month, yearRaw] = match.date.split("/").map(Number);
      const [hour, minute] = match.hour.split(":").map(Number);

      const year = yearRaw! < 100 ? yearRaw! + 2000 : yearRaw!;

      const alarms = [];

      alarms.push({
        action: "display" as const,
        description: "Hai una partita tra una settimana!",
        trigger: { hours: 168, before: true },
      });

      alarms.push({
        action: "display" as const,
        description: "Hai una partita tra tre giorni!",
        trigger: { hours: 72, before: true },
      });

      return {
        uid: `${match.home}-${match.guest}-${match.date}`
          .replace(/\s+/g, "")
          .toLowerCase(),
        startInputType: "local",
        startOutputType: "local",
        start: [year!, month!, day!, hour!, minute!],
        duration: { hours: 2, minutes: 0 },
        title: `PARTITA: ${match.home} VS ${match.guest} - ${category ?? env.CATEGORY}`,
        description: `${match.home} VS ${match.guest}.`,
        location: match.place || "Sede da definire",
        categories: ["Partita di Pallavolo"],
        status: "CONFIRMED",
        busyStatus: "BUSY",
        alarms: alarms,
      };
    });

    if (events.length === 0) {
      return new Response("Nessun evento futuro trovato", { status: 200 });
    }

    const { error, value } = ics.createEvents(events);

    if (error) {
      console.error("Errore ICS:", error);
      return new Response("Errore nella creazione del calendario", {
        status: 500,
      });
    }

    return new Response(value, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="partite.ics"',
      },
    });
  } catch (error) {
    return new Response("Errore server", { status: 500 });
  }
};

export { handler as GET, handler as POST };

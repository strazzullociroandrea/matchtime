"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Calendar,
  ChevronRight,
  Clock,
  Download,
  Info,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { CalendarPDF } from "@/components/pdf-match";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

export default function Home() {
  const [showInfo, setShowInfo] = useState(false);
  const { data, isLoading } = api.orarioRouter.getInfo.useQuery();

  const getNavigationLink = (place: string) => {
    const query = encodeURIComponent(place);
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent;
      if (/iPhone|iPad|iPod|Macintosh/i.test(ua))
        return `maps://maps.apple.com/?q=${query}`;
      if (/Android/i.test(ua)) return `geo:0,0?q=${query}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  if (isLoading || !data || !data.team || !data.category) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full shadow-md"></div>
        <p className="text-muted-foreground animate-pulse font-medium">
          Caricamento calendario...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Info banner */}

      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogTitle> {""}</DialogTitle>
        <DialogContent className="max-w-lg p-0 overflow-hidden border-none bg-transparent shadow-none">
          <Card className="relative overflow-hidden bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg mx-auto backdrop-blur-md">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />

            <CardContent className="p-8 pl-10">
              <div className="flex flex-col gap-6">
                <div className="space-y-1">
                  <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">
                    Benvenuto su
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                    Match Time<span className="text-primary">.</span>
                  </h2>
                </div>

                <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                  <p>
                    Il portale dedicato alla categoria{" "}
                    <span className="text-slate-900 dark:text-white font-semibold">
                      {data.category}
                    </span>{" "}
                    dei{" "}
                    <span className="text-slate-900 dark:text-white font-semibold">
                      {data.team}
                    </span>
                    .
                  </p>

                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Scopri date, orari e luoghi delle partite</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Posizione esatta su mappa con un click</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Scarica il calendario completo in PDF</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-2 flex flex-col items-center">
                  <button
                    onClick={() => setShowInfo(false)}
                    className="w-full sm:w-2/3 bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                  >
                    Inizia a navigare
                  </button>
                  <p className="mt-4 text-xs text-slate-400  tracking-tight">
                    Questo sito è un progetto indipendente e non ufficiale. I
                    dati dei calendari sono di proprietà di PGS (Polisportive
                    Giovanili Salesiane), recuperati tramite file excel reso
                    disponbile dagli stessi. L&apos;autore non si assume
                    responsabilità per eventuali inesattezze o cambiamenti di
                    orario non riportati. Consultare sempre il portale ufficiale
                    per le comunicazioni formali.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <header className="sticky mb-6 mt-5 top-0 z-50 w-full bg-background px-4 py-4 text-center shadow-sm">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Info
            className="w-5 h-5 text-primary opacity-80 shrink-0"
            onClick={() => setShowInfo(true)}
          />
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Calendario Partite
          </h1>
        </div>

        <div>
          <p className="text-muted-foreground italic">
            Sfoglia le partite dell&apos;anno {new Date().getFullYear()} -
            Categoria {data?.category}
          </p>
          {data && data.matches && data.matches.length > 0 && (
            <PDFDownloadLink
              document={
                <CalendarPDF
                  matches={data.matches}
                  category={data.category}
                  team={data.team}
                />
              }
              fileName={`calendario_${data.category}_${data.team}.pdf`}
              className="inline-flex items-center mt-2 text-primary font-medium hover:underline gap-2"
            >
              {({ loading }) => (
                <>
                  <Download
                    className={cn("w-5 h-5", loading && "animate-bounce")}
                  />
                  Scarica calendario
                </>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </header>

      <div className="mt-14 mb-14 mx-auto max-w-7xl px-6">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {data?.matches?.map((matchSingle, index) => (
            <Card
              key={index}
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4",
                matchSingle.isHome
                  ? "border-l-primary bg-primary/5"
                  : "border-l-muted",
              )}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <Badge
                      variant="outline"
                      className="bg-primary/5 text-primary border-primary/20"
                    >
                      Giornata {matchSingle.giornata}
                    </Badge>
                  </div>
                  <Badge
                    variant={
                      matchSingle.done
                        ? "destructive"
                        : matchSingle.thisWeek
                          ? "default"
                          : "outline"
                    }
                  >
                    {matchSingle.data && matchSingle.ora
                      ? matchSingle.done
                        ? "Conclusa"
                        : matchSingle.thisWeek
                          ? "Prossima"
                          : "In programma"
                      : "Rinviata"}
                  </Badge>
                </div>

                <CardTitle className="text-2xl font-black italic uppercase tracking-tighter flex flex-wrap items-center gap-2">
                  <span className="text-foreground">{matchSingle.casa}</span>
                  <span className="text-primary not-italic font-light text-sm tracking-normal opacity-50">
                    VS
                  </span>
                  <span className="text-foreground">
                    {matchSingle.trasferta}
                  </span>
                </CardTitle>

                <div className="flex items-center gap-4 pt-3 text-sm font-medium">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary opacity-80" />
                    <span>{matchSingle.data}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary opacity-80" />
                    <span>{matchSingle.ora}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <a
                  href={getNavigationLink(matchSingle.indirizzo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-transparent hover:border-primary/20 hover:bg-secondary transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-white dark:bg-background rounded-lg shadow-sm group-hover:text-primary transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold truncate text-muted-foreground group-hover:text-foreground">
                      {matchSingle.indirizzo}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Questo sito è un progetto indipendente e non ufficiale. I dati dei
          calendari sono di proprietà di PGS (Polisportive Giovanili Salesiane),
          recuperati tramite file excel reso disponbile dagli stessi.
          L&apos;autore non si assume responsabilità per eventuali inesattezze o
          cambiamenti di orario non riportati. Consultare sempre il portale
          ufficiale per le comunicazioni formali.
          <span className="block mt-2 font-bold">
            Last updated:{" "}
            {data?.lastUpdate
              ? new Date(data.lastUpdate).toLocaleString("it-IT")
              : "N/A"}
          </span>
        </footer>
      </div>
    </>
  );
}

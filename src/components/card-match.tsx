import { Calendar, ChevronRight, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartitaVolley } from "@/lib/schemas/match-schema";
import { cn } from "@/lib/utils";

export const CardMatch = ({ matches }: { matches: PartitaVolley[] }) => {
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

  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 p-10">
      {matches.map((matchSingle, index) => (
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
                  Giornata {matchSingle.day}
                </Badge>
              </div>
              <Badge
                variant={
                  matchSingle.status === "Rinviata"
                    ? "destructive"
                    : matchSingle.status === "In programma"
                      ? "outline"
                      : "default"
                }
              >
                {matchSingle.status}
              </Badge>
            </div>

            <CardTitle className="text-2xl font-black italic uppercase tracking-tighter flex flex-wrap items-center gap-2">
              <span className="text-foreground">{matchSingle.home}</span>
              <span className="text-primary not-italic font-light text-sm tracking-normal opacity-50">
                VS
              </span>
              <span className="text-foreground">{matchSingle.guest}</span>
            </CardTitle>

            <div className="flex items-center gap-4 pt-3 text-sm font-medium">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary opacity-80" />
                <span>
                  {matchSingle.status === "Rinviata"
                    ? "Non disponibile"
                    : matchSingle.date}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4 text-primary opacity-80" />
                <span>
                  {matchSingle.status === "Rinviata"
                    ? "Non disponibile"
                    : matchSingle.hour}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <a
              href={
                matchSingle.status === "Rinviata"
                  ? undefined
                  : getNavigationLink(matchSingle.place)
              }
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-transparent transition-all ${
                matchSingle.status !== "Rinviata"
                  ? "hover:border-primary/20 hover:bg-secondary"
                  : "cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-white dark:bg-background rounded-lg shadow-sm group-hover:text-primary transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold truncate text-muted-foreground group-hover:text-foreground">
                  {matchSingle.status !== "Rinviata" && matchSingle.place
                    ? `${matchSingle.place}`
                    : "Indirizzo non disponibile"}
                </span>
              </div>
              {matchSingle.status !== "Rinviata" && (
                <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
              )}
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

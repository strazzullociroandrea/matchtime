"use client";

import {api} from "@/trpc/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {MapPin, Calendar, Clock, ChevronRight} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

export default function Home() {
    const {data: matches, isLoading} = api.orarioRouter.getInfo.useQuery();

    const getNavigationLink = (place: string) => {
        const query = encodeURIComponent(place);
        if (typeof window !== "undefined") {
            const ua = navigator.userAgent;
            if (/iPhone|iPad|iPod|Macintosh/i.test(ua)) return `maps://maps.apple.com/?q=${query}`;
            if (/Android/i.test(ua)) return `geo:0,0?q=${query}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <div
                    className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full shadow-md"></div>
                <p className="text-muted-foreground animate-pulse font-medium">Caricamento partite...</p>
            </div>
        );
    }

    return (
        <div className="mt-14 mb-14 mx-auto max-w-7xl px-6">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">Calendario Partite</h1>
                {/*Da settare ad ogni cambio stagione/categoria*/}
                <p className="text-muted-foreground italic">Sfoglia le partite
                    dell&apos;anno {new Date().getFullYear()} - Categoria U15 Maschile BBV</p>
            </header>

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                {matches?.map((matchSingle, index) => (
                    <Card
                        key={index}
                        className={cn(
                            "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4",
                        )}
                    >

                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                        Giornata {matchSingle.Giornata}
                                    </Badge>
                                </div>
                                <Badge
                                    variant={matchSingle.Done ? "destructive" : "default"}
                                >
                                    {matchSingle.Done ? "Conclusa" : "In programma"}
                                </Badge>
                            </div>

                            <CardTitle
                                className="text-2xl font-black italic uppercase tracking-tighter flex flex-wrap items-center gap-2">
                                <span className="text-foreground">{matchSingle.Casa}</span>
                                <span
                                    className="text-primary not-italic font-light text-sm tracking-normal opacity-50">VS</span>
                                <span className="text-foreground">{matchSingle.Trasferta}</span>
                            </CardTitle>

                            <div className="flex items-center gap-4 pt-3 text-sm font-medium">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar className="w-4 h-4 text-primary opacity-80"/>
                                    <span>{matchSingle.Data}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Clock className="w-4 h-4 text-primary opacity-80"/>
                                    <span>{matchSingle.Ora}</span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <a
                                href={getNavigationLink(matchSingle.Indirizzo)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-transparent hover:border-primary/20 hover:bg-secondary transition-all"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div
                                        className="p-2 bg-white dark:bg-background rounded-lg shadow-sm group-hover:text-primary transition-colors">
                                        <MapPin className="w-4 h-4"/>
                                    </div>
                                    <span
                                        className="text-xs font-semibold truncate text-muted-foreground group-hover:text-foreground">
                    {matchSingle.Indirizzo}
                  </span>
                                </div>
                                <ChevronRight
                                    className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary"/>
                            </a>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
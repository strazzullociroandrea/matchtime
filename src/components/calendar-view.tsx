import {useState} from "react";
import {Card} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils.ts";
import {ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, MapPin} from "lucide-react";
import {Button} from "@/components/ui/button";
import {getNavigationLink} from "@/components/get-navigation-link";


interface Match {
    id_partita: string;
    data: string;
    ora: string;
    squadra_casa: string;
    squadra_trasferta: string;
    indirizzo: string;
    categoria: string;
}

interface CalendarProps {
    matches: Match[];
}

export const CalendarView = ({matches}: CalendarProps) => {
    const [monthOffset, setMonthOffset] = useState(0);
    const [selectedMatches, setSelectedMatches] = useState<Match[] | null>(null);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);

    const now = new Date();
    const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const giorniNelMese = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    const monthNames = [
        "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
        "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ];

    const weekDays = ["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"];
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const handleDayClick = (dataTemplate: string) => {
        setSelectedDay(dataTemplate);
        const found = matches.filter((m) => m.data === dataTemplate);
        if (found.length > 0) setSelectedMatches(found);
    };


    return (
        <div>
            <Card className="w-full p-4">
                <div className="mb-6 flex items-center justify-between px-1">
                    <Button variant="outline" className="rounded-xl h-11 w-11 sm:h-9 sm:w-9 cursor-pointer" size="icon"
                            onClick={() => setMonthOffset(0)} disabled={monthOffset === 0}>
                        {monthOffset < 0 ? <ArrowRight className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground"/> :
                            <ArrowLeft className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground"/>}
                    </Button>

                    <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                        {monthNames[currentMonth]} <span
                        className="text-muted-foreground font-light">{currentYear}</span>
                    </h2>

                    <div className="flex gap-2">
                        <Button variant="outline" className="cursor-pointer rounded-xl h-11 w-11 sm:h-9 sm:w-9"
                                size="icon"
                                onClick={() => setMonthOffset(monthOffset - 1)}>
                            <ChevronLeft className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground"/>
                        </Button>
                        <Button variant="outline" className="cursor-pointer rounded-xl h-11 w-11 sm:h-9 sm:w-9"
                                size="icon"
                                onClick={() => setMonthOffset(monthOffset + 1)}>
                            <ChevronRight className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground"/>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {weekDays.map((d) => (
                        <div key={d}
                             className="text-center text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider py-1">{d}</div>
                    ))}
                    {Array.from({length: offset}).map((_, i) => (
                        <div key={`empty-${i}`}
                             className="h-16 md:h-24 bg-slate-50/50 dark:bg-zinc-900/10 rounded-lg border border-dashed border-slate-100 dark:border-zinc-800/40"/>
                    ))}
                    {Array.from({length: giorniNelMese}, (_, i) => {
                        const giorno = i + 1;
                        const dataTemplate = `${String(giorno).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}/${currentYear}`;
                        const haveMatchToday = matches.filter((m) => m.data === dataTemplate);

                        return (
                            <Card key={i}
                                  className={cn("cursor-pointer group relative flex h-16 md:h-24 flex-col justify-between p-2 rounded-lg border border-border bg-card shadow-2xs transition-all select-none hover:border-primary")}
                                  onClick={() => handleDayClick(dataTemplate)}>
                                <div className="flex justify-end w-full">
                                    <span
                                        className="font-bold text-sm sm:text-base text-slate-500 group-hover:text-primary">{giorno}</span>
                                </div>
                                <div className="w-full px-1 pb-1">
                                    {haveMatchToday?.length > 0 &&
                                        <div className="h-1 w-full bg-red-600 rounded-full"/>}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </Card>

            <Dialog open={!!selectedMatches} onOpenChange={() => setSelectedMatches(null)}>
                <DialogContent className="sm:max-w-md w-[95vw] p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle>Partite del giorno {selectedDay}</DialogTitle>
                        <DialogDescription>Dettagli degli incontri in programma.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
                        {selectedMatches?.map((match, i) => (
                            <Card key={i}
                                  className="relative flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex flex-col">
                                        <span
                                            className="text-3xl font-black text-primary leading-none">{match.ora ?? "--:--"}</span>
                                        <Badge variant="secondary"
                                               className="mt-2 w-fit text-[10px]">{match.categoria}</Badge>
                                    </div>
                                    <a href={match.indirizzo ? getNavigationLink(match.indirizzo) : undefined}
                                       target="_blank" rel="noopener noreferrer"
                                       className={cn("flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all", match.indirizzo ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed opacity-50")}>
                                        <MapPin className="w-3 h-3"/> Mappa
                                    </a>
                                </div>
                                <div
                                    className="text-center py-2 bg-muted/30 rounded-xl font-black text-sm flex items-center justify-center gap-2">
                                    <span>{match.squadra_casa}</span>
                                    <span className="text-[10px] text-primary italic">VS</span>
                                    <span>{match.squadra_trasferta}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                    <MapPin className="w-3 h-3 shrink-0 text-primary"/>
                                    <span className="truncate">{match.indirizzo ?? "Indirizzo non disponibile"}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
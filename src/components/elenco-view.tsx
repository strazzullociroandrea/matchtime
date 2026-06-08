import {
    Card
} from "@/components/ui/card"
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";
import {parse} from "date-fns";
import {Badge} from "@/components/ui/badge"
import {AlertCircle, ChevronRight, Clock, MapPin} from "lucide-react";
import {Separator} from "@/components/ui/separator"

interface Match {
    id_partita: string,
    data: string,
    ora: string,
    squadra_casa: string,
    squadra_trasferta: string,
    indirizzo: string,
    categoria: string
}


interface CalendarProps {
    matches: Match[];
}


export const ElencoView = ({matches}: CalendarProps) => {

    const getNavigationLink = (indirizzo: string) => {
        const query = encodeURIComponent(indirizzo);
        if (typeof window !== "undefined") {
            const ua = navigator.userAgent;
            if (/iPhone|iPad|iPod|Macintosh/i.test(ua))
                return `maps://maps.apple.com/?q=${query}`;
            if (/Android/i.test(ua)) return `geo:0,0?q=${query}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    }

    return (
        <div className="grid gap-4 p-6">
            {!matches ? (
                <Empty className="border border-dashed">
                    <EmptyHeader>
                        <EmptyTitle className="text-xl">Squadra senza partite</EmptyTitle>
                        <EmptyDescription>
                            Non sono state trovate partite relative alla squadra selezionata. Ti invitiamo a riprovare
                            più tardi; qualora il problema dovesse persistere, ti preghiamo di contattare
                            l'amministratore per ricevere assistenza.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="text-blue-700 w-5 h-5"/>
                        <h2 className="text-xl italic tracking-tight text-muted-foreground">Calendario partite</h2>
                    </div>
                    <div className="grid gap-10 mt-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-between ">
                        {matches.filter(m => m.data && m.ora).sort((m1, m2) => {

                            const dataOggetto1 = parse(m1.data, 'dd/MM/yyyy', new Date());
                            const dataOggetto2 = parse(m2.data, 'dd/MM/yyyy', new Date());

                            return dataOggetto1.getTime() - dataOggetto2.getTime();

                        }).map((match, i: number) => (
                            <Card
                                key={`${i}-calendar`}
                                className="cursor-pointer group relative flex flex-col lg:flex-row items-stretch gap-4 rounded-2xl border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30 w-full"
                            >
                                <div
                                    className="flex flex-row lg:flex-col items-center justify-between lg:justify-center lg:border-r lg:pr-6 lg:min-w-32 border-b lg:border-b-0 pb-3 lg:pb-0 gap-2 shrink-0">
                                    <div className="flex flex-col items-start lg:items-center text-left lg:text-center">
                                    <span className="text-2xl font-black text-primary leading-none">
                                        {match.ora ?? "--:--"}
                                    </span>
                                        <span
                                            className="text-[10px] text-red-700 uppercase font-bold tracking-widest text-muted-foreground mt-1">
                                        {match.data ?? "Non disponibile"}
                                    </span>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        {match.categoria && (
                                            <div className="flex justify-start mt-2 mb-2">
                                                <Badge variant="outline"
                                                       className="text-[9px] py-0 px-1.5 font-bold bg-primary/5 border-primary/20 text-primary w-fit">
                                                    {match.categoria}
                                                </Badge>
                                            </div>
                                        )}

                                        <div
                                            className="text-center flex flex-row items-center gap-3 overflow-hidden w-full justify-center">

                                         <span className="text-base font-black truncate text-right">
                                            {match.squadra_casa}
                                        </span>

                                            <span
                                                className="text-[10px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded italic shrink-0">
                                            VS
                                        </span>

                                            <span className="text-base font-black truncate text-left">
                                            {match.squadra_trasferta}
                                        </span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-muted-foreground/80">
                                        <MapPin className="w-4 h-4 mt-0.5 text-primary/60 shrink-0"/>
                                        <span className="text-xs font-medium leading-relaxed">
                                            {match.indirizzo ?? "Indirizzo non disponibile"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center lg:pl-4">
                                    <a
                                        href={!match.indirizzo ? undefined : getNavigationLink(match.indirizzo)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-full lg:w-auto flex items-center justify-center gap-2 p-3 lg:p-2.5 rounded-xl transition-all ${
                                            match.indirizzo
                                                ? "bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground"
                                                : "bg-secondary/50 text-muted-foreground cursor-not-allowed opacity-50"
                                        }`}
                                    >
                                        <span className="text-xs font-bold lg:hidden">Apri Navigatore</span>
                                        <ChevronRight className="w-5 h-5 lg:w-4 lg:h-4"/>
                                    </a>
                                </div>
                            </Card>

                        ))}
                    </div>
                </div>
            )}

            <Separator className="mt-4"/>

            <div>
                <div className="flex items-center gap-2 mb-6">
                    <AlertCircle className="text-amber-500 w-5 h-5"/>
                    <h2 className="text-xl italic tracking-tight text-muted-foreground">Da definire</h2>
                </div>
                <div className="grid gap-10 mt-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-between ">

                    {
                        matches.filter(m => !m.data || !m.ora).map((match, i: number) => (
                            <Card
                                key={`${i}-calendar`}
                                className="cursor-pointer group relative flex flex-col lg:flex-row items-stretch gap-4 rounded-2xl border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30 w-full"
                            >
                                <div
                                    className="flex flex-row lg:flex-col items-center justify-between lg:justify-center lg:border-r lg:pr-6 lg:min-w-32 border-b lg:border-b-0 pb-3 lg:pb-0 gap-2 shrink-0">
                                    <div className="flex flex-col items-start lg:items-center text-left lg:text-center">
                                    <span className="text-2xl font-black text-primary leading-none">
                                         --:--
                                    </span>
                                        <span
                                            className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">
                                        Non disponibile
                                    </span>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        {match.categoria && (
                                            <div className="flex justify-start mt-2 mb-2">
                                                <Badge variant="outline"
                                                       className="text-[9px] py-0 px-1.5 font-bold bg-primary/5 border-primary/20 text-primary w-fit">
                                                    {match.categoria}
                                                </Badge>
                                            </div>
                                        )}

                                        <div
                                            className="text-center flex flex-row items-center gap-3 overflow-hidden w-full justify-center">

                                         <span className="text-base font-black truncate text-right">
                                            {match.squadra_casa}
                                        </span>

                                            <span
                                                className="text-[10px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded italic shrink-0">
                                            VS
                                        </span>

                                            <span className="text-base font-black truncate text-left">
                                            {match.squadra_trasferta}
                                        </span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-muted-foreground/80">
                                        <MapPin className="w-4 h-4 mt-0.5 text-primary/60 shrink-0"/>
                                        <span className="text-xs font-medium leading-relaxed">
                                            {match.indirizzo ?? "Indirizzo non disponibile"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center lg:pl-4">
                                    <a
                                        href={undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-full lg:w-auto flex items-center justify-center gap-2 p-3 lg:p-2.5 rounded-xl transition-all ${
                                            "bg-secondary/50 text-muted-foreground cursor-not-allowed opacity-50"
                                        }`}

                                    >
                                        <span className="text-xs font-bold lg:hidden">Apri Navigatore</span>
                                        <ChevronRight className="w-5 h-5 lg:w-4 lg:h-4"/>
                                    </a>
                                </div>
                            </Card>

                        ))}

                </div>
            </div>
        </div>

    )
}
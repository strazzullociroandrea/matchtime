import {useState} from 'react';
import {Navbar} from './navbar';
import {CalendarView} from './calendar-view';
import {ElencoView} from './elenco-view';

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
    team: string;
    category: string;
    lastUpdate: string;
}

export const PageManager = ({matches, team, category}: CalendarProps) => {
    const [view, setView] = useState<"calendario" | "elenco">("calendario");

    return (
        <>
            <Navbar type={view} onTypeChange={setView} team={team} category={category}/>
            <main className="container mx-auto px-4 py-8 pt-20 w-full">
                {view === "calendario" ? (
                    <CalendarView matches={matches}/>
                ) : (
                    <ElencoView matches={matches}/>
                )}
            </main>
        </>
    );
};
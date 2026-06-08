import {NavbarSettings} from "@/components/navbar-settings.tsx"
import {Card} from "@/components/ui/card.tsx";
import {MessageSquareWarning, CloudDownload, Volleyball} from "lucide-react"

export const Settings = ({lastUpdate}: { lastUpdate: string | null }) => {

    return (
        <>
            <NavbarSettings/>
            <main className="container mx-auto px-4 py-8 pt-20 w-full">
                <div className="w-full sm:w-3/5 max-w-7xl mx-auto p-6 space-y-5">
                    <p className="text-muted-foreground uppercase text-[10px]">
                        Configurazione
                    </p>
                    <Card
                        className="group relative flex flex-row items-center justify-between p-4 transition-all"

                    >
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                                <Volleyball className="h-6 w-6"/>
                            </div>
                            <div className="flex flex-col overflow-hidden text-left">
                                <h3 className="truncate font-semibold">{import.meta.env.PUBLIC_TEAM || "Team mancante"}</h3>
                                <p className="text-xs text-zinc-500">{import.meta.env.PUBLIC_CATEGORY || "Categoria mancante"}</p>
                            </div>
                        </div>

                    </Card>

                    <p className="mt-8 text-muted-foreground uppercase text-[10px]">
                        Altro
                    </p>
                    <Card
                        className="group relative flex flex-row items-center justify-between p-4 transition-all"
                    >
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                                <MessageSquareWarning className="h-5 w-5"/>
                            </div>
                            <div className="flex flex-col overflow-hidden text-left">
                                <h3 className="truncate font-semibold">Segnalazioni e feedback</h3>
                                <p className="text-xs text-zinc-500">Scrivi a: feedback@cirostrazzullo.it</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="group relative flex flex-row items-center justify-between p-4 transition-all">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                                <CloudDownload className="h-5 w-5"/>
                            </div>
                            <div className="flex flex-col overflow-hidden text-left">
                                <h3 className="truncate font-semibold">Ultimo update</h3>
                                <p className="text-xs text-zinc-500">
                                    {lastUpdate ? new Date(lastUpdate).toLocaleString('it-IT') : "Non disponibile"}
                                </p>
                            </div>
                        </div>
                    </Card>

                </div>
            </main>
        </>
    )
}
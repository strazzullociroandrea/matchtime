import {NavbarSettings} from "@/components/navbar-settings.tsx"
import {Card} from "@/components/ui/card.tsx";
import {MessageSquareWarning, CloudDownload, Volleyball, Share, Smartphone, Download} from "lucide-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {useState, useEffect} from "react";
import {toast} from "sonner"


export const Settings = ({lastUpdate}: { lastUpdate: string | null }) => {

    const [isStandalone, setIsStandalone] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIOS, setIsIOS] = useState(false);


    useEffect(() => {
        setMounted(true);

        const isStandaloneMode =
            window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone
            || document.referrer.includes('android-app://');

        setIsStandalone(isStandaloneMode);

        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            toast.info("Per installare l'app:", {
                duration: 5000,
                description: "Clicca su 'Condividi' e seleziona 'Aggiungi alla schermata home'"
            });
            return;
        }

        if (!deferredPrompt) {
            toast.error("Errore installazione automatica.", {
                duration: 5000,
                description: "Clicca su condividi (iOS) o sui tre puntini (in alto a destra) e seleziona 'Aggiungi alla schermata home'."
            });
            return;
        }

        deferredPrompt.prompt();
        const {outcome} = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            toast.success("Installazione avviata!", {
                duration: 5000,
                description: "A breve potrai utilizzare Match Time dalla schermata home."
            });
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    if (!mounted) return null;

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
                        Sincronizza con il tuo calendario
                    </p>


                    <p className="mt-8 text-muted-foreground uppercase text-[10px]">
                        Altro
                    </p>

                    {!isStandalone && (
                        <Card
                            key="download-app"
                            className="group relative flex flex-row items-center justify-between cursor-pointer p-4 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all"
                            onClick={handleInstallClick}
                        >
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div
                                    className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary/10 rounded-full">
                                    {isIOS ? <Share className="h-5 w-5 text-primary"/> :
                                        <Smartphone className="h-5 w-5 text-primary"/>}
                                </div>
                                <div className="flex flex-col overflow-hidden text-left">
                                    <h3 className="truncate font-semibold">
                                        {isIOS ? "Installa su iPhone" : "Scarica l'App"}
                                    </h3>
                                    <p className="text-xs text-zinc-500">
                                        {isIOS ? "Clicca Condividi > Aggiungi a Home" : "Usa MatchTime comodamente dal tuo schermo."}
                                    </p>
                                </div>
                            </div>
                            {!isIOS && isInstallable && <Download className="h-4 w-4 text-primary animate-bounce"/>}
                        </Card>
                    )}

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

                    <p className="mt-8 text-muted-foreground uppercase text-[10px]">
                        Crediti
                    </p>
                    <Accordion type="single" collapsible className="w-full border rounded-xl bg-card ">
                        <AccordionItem value="credits" className="border-none">
                            <AccordionTrigger
                                className="cursor-pointer hover:no-underline py-4 px-4 text-sm font-semibold">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary font-bold">i</span>
                                    Info
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-xs leading-relaxed text-zinc-500 pb-4 px-4">
                                Progetto indipendente. Tutti i dati visualizzati sono di
                                proprietà dei rispettivi comitati organizzatori (es. PGS, FIPAV, VolleyCup, CSI) e sono
                                resi disponibili al pubblico dagli stessi tramite pubblicazione di documenti pdf.
                                L'applicazione si limita a facilitarne la consultazione.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </main>
        </>
    )
}
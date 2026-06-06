import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Calendar, TextAlignJustify, Settings} from "lucide-react"

export const Navbar = () => {
    const [active, setActive] = useState<"calendario" | "elenco">("calendario");

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

                <a href="/" className="flex items-center">
                    <img src="/logo.png" alt="logo" className="h-10 w-auto"/>
                    <div className="ml-3">
                        <p>Match Time</p>
                        <p className="text-xs text-muted-foreground">Under 15 Maschile</p>
                    </div>
                </a>

                <div className="flex items-center gap-5">
                    <div
                        className="hidden lg:flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <Button
                            variant="ghost"
                            onClick={() => setActive("calendario")}
                            className={`cursor-pointer px-6 rounded-full transition-all duration-300 font-medium text-sm ${
                                active === "calendario"
                                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                            }`}
                        >
                            <Calendar/>Calendario
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => setActive("elenco")}
                            className={`cursor-pointer px-6 rounded-full transition-all duration-300 font-medium text-sm ${
                                active === "elenco"
                                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                            }`}
                        >
                            <TextAlignJustify/> Elenco
                        </Button>
                    </div>
                    <div
                        className="hidden lg:flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer rounded-full h-8 w-8 transition-all duration-300 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                        >
                            <Settings className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
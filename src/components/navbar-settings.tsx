import {ArrowLeft} from "lucide-react"

export const NavbarSettings = () => {

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

                    <a href="/" className="flex items-center">
                        <ArrowLeft className="h-6 w-10  " />
                        <div className="ml-3">
                            <p>Impostazioni</p>
                            <p className="text-xs text-muted-foreground">Match Time</p>
                        </div>
                    </a>
                </div>

            </nav>

        </>
    );
};
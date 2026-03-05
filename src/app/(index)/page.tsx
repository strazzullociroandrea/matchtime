"use client";
import { api } from "@/trpc/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ListMatch } from "@/components/list-match";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { FirstShow } from "@/components/first-show";
import { useState, useEffect } from "react";
import { Calendar, LayoutDashboard, Settings } from "lucide-react";
import { SettingsPage } from "@/components/settings";

export default function Home() {
  const { data, isLoading, isError } = api.orario.getInfo.useQuery();

  const [showData, setShowData] = useState<string>("Elenco");
  /*if (!Cookies.get("firstShow")) {
    return (
      <div className="items-center justify-center h-screen">
        <FirstShow />
      </div>
    );
  }*/

  if (isLoading || !data || !data.team || !data.category) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-muted-foreground animate-pulse font-medium">
          Caricamento in corso . . .
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-muted-foreground  font-medium">
          Errore durante il caricamento dei dati.
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky mb-6 mt-5 top-0 z-50 w-full bg-background shadow-sm">
        {showData !== "Impostazioni" && (
          <Navbar
            matches={data?.matches || []}
            category={data?.category || ""}
            team={data?.team || ""}
          />
        )}
      </header>
      <main>
        {showData === "Elenco" && <ListMatch matches={data?.matches || []} />}
        {showData === "Impostazioni" && <SettingsPage />}
        <div className="fixed bottom-1 left-1/2 -translate-x-1/2 z-100 pointer-events-none">
          <div className="flex items-center p-2 gap-2 pointer-events-auto bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border border-white/20 dark:border-zinc-800/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <Button
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95"
              onClick={() => setShowData("Elenco")}
            >
              <LayoutDashboard className="w-5 h-5 stroke-[2.25px]" />
              <span className="hidden sm:inline">Elenco</span>
            </Button>

            <Button
              className="flex items-center gap-2 px-5 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl text-sm font-medium transition-all active:scale-95"
              onClick={() => setShowData("Settimana")}
            >
              <Calendar className="w-5 h-5 stroke-[1.5px]" />
              <span className="hidden sm:inline">Settimana</span>
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
              className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all active:scale-95"
              onClick={() => setShowData("Impostazioni")}
            >
              <Settings className="w-5 h-5 stroke-[1.5px]" />
            </Button>
          </div>
        </div>
      </main>
      <div className="mt-14 mb-14 mx-auto max-w-7xl px-6">
        <Footer lastUpdate={data?.lastUpdate} />
      </div>
    </>
  );
}

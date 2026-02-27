"use client";
import { Calendar, List } from "lucide-react";
import { api } from "@/trpc/react";
import { CardMatch } from "@/components/card-match";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";

export default function Home() {
  const { data, isLoading } = api.orario.getInfo.useQuery();
  const [typeViewData, setTypeViewData] = useState("list");
  const activeBtn =
    "rounded-lg bg-background shadow-sm text-primary hover:bg-background";
  const inactiveBtn =
    "rounded-lg shadow-sm text-muted-foreground hover:bg-background";

  if (isLoading || !data || !data.team || !data.category) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full shadow-md"></div>
        <p className="text-muted-foreground animate-pulse font-medium">
          Caricamento calendario...
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky mb-6 mt-5 top-0 z-50 w-full bg-background shadow-sm">
        <Navbar
          matches={data?.matches || []}
          category={data?.category || ""}
          team={data?.team || ""}
        />
      </header>
      <main>
        <div className="flex justify-end mb-6 sm:ml-10 ml-5 px-6 sm:mr-4">
          <ButtonGroup className="inline-flex p-1 bg-muted/50 rounded-xl border border-border">
            <Button
              variant="ghost"
              size="sm"
              className={typeViewData === "list" ? activeBtn : inactiveBtn}
              onClick={() => setTypeViewData("list")}
            >
              <List className="w-4 h-4 md:mr-2" />
              <span className="hidden md:block font-semibold">Elenco</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={typeViewData === "calendar" ? activeBtn : inactiveBtn}
              onClick={() => setTypeViewData("calendar")}
            >
              <Calendar className="w-4 h-4 md:mr-2" />
              <span className="hidden md:block">Calendario</span>
            </Button>
          </ButtonGroup>
        </div>
        {typeViewData === "list" ? (
          <CardMatch matches={data?.matches || []} />
        ) : (
          <div>ciao</div>
        )}
      </main>
      <div className="mt-14 mb-14 mx-auto max-w-7xl px-6">
        <Footer lastUpdate={data?.lastUpdate} />
      </div>
    </>
  );
}

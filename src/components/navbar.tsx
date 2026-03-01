"use client";

import { ChevronRight, Settings, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarPDF } from "@/components/pdf-match";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PartitaVolley } from "@/lib/schemas/match-schema";
import { SettingsCard } from "@/components/settings-card";
import { useState } from "react";

export const Navbar = ({
  matches,
  category,
  team,
}: {
  matches: PartitaVolley[];
  category: string;
  team: string;
}) => {
  const [show, setShow] = useState(false);

  return (
    <nav className="relative light:border-b  border-slate-200 dark:border-slate-800 w-full max-w-auto mx-auto py-6">
      <div className="absolute top-6 right-6 sm:right-20">
        <PDFDownloadLink
          document={
            <CalendarPDF matches={matches} category={category} team={team} />
          }
          fileName={`calendario_${category}_${team}.pdf`}
          className="mr-2 inline-block"
        >
          <span className="  bg-background inline-flex text-muted-foreground items-center justify-center rounded-full border border-input  hover:border-primary hover:text-primary h-10 w-10 text-sm font-medium">
            <Download className="h-4 w-4" />
          </span>
        </PDFDownloadLink>
        <Button
          variant="settings"
          size="icon"
          className=" w-10 h-10 rounded-full text-muted-foreground "
          onClick={() => setShow(true)}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="mb-3 ml-6">
        <Badge
          variant="outline"
          className="text-[10px] font-bold bg-primary/10 text-primary flex items-center gap-1 w-fit"
        >
          {team} <ChevronRight className="w-3 h-3" /> {category}
        </Badge>
      </div>

      <div className="flex gap-3 mb-1 ml-7">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-5xl">
          <span className="text-primary">Calendario</span> Partite
        </h1>
      </div>

      <div className="ml-8 gap-2">
        <p className="text-muted-foreground text-xs sm:text-sm font-medium pl-1 border-l-2 border-primary/30 ml-1">
          Visualizza il calendario completo delle partite della tua squadra.
        </p>
      </div>

      <SettingsCard
        show={show}
        setShow={setShow}
        category={category}
        team={team}
      />
    </nav>
  );
};

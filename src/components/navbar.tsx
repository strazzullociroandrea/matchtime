"use client";

import { ChevronRight, Settings, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarPDF } from "@/components/pdf-match";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PartitaVolley } from "@/lib/schemas/match-schema";
import { SettingsCard } from "@/components/settings-card";
import { useState } from "react";
import { toast } from "sonner";

export const Navbar = ({
  matches,
  category,
  team,
}: {
  matches: PartitaVolley[];
  category: string;
  team: string;
}) => {
  return (
    <>
      <nav className="relative light:border-b  border-slate-200 dark:border-slate-800 w-full max-w-auto mx-auto py-6">
        <div className="absolute top-6 right-6 sm:right-20">
          <PDFDownloadLink
            document={
              <CalendarPDF matches={matches} category={category} team={team} />
            }
            fileName={`calendario_${category}_${team}.pdf`}
            className="mr-2 inline-block"
            onClick={() => {
              toast.success("Generazione PDF in corso...", {
                description: "Il download del calendario inizierà a breve.",
              });
            }}
          >
            <span className="  bg-background inline-flex text-muted-foreground items-center justify-center rounded-full border border-input  hover:border-primary hover:text-primary h-10 w-10 text-sm font-medium">
              <Download className="h-4 w-4" />
            </span>
          </PDFDownloadLink>
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
            <span className="text-primary">Match</span> Time
          </h1>
        </div>

        <div className="ml-8 gap-2">
          <p className="text-muted-foreground text-xs sm:text-sm font-medium pl-1 border-l-2 border-primary/30 ml-1">
            Visualizza il calendario completo delle partite della tua squadra.
          </p>
        </div>
      </nav>
    </>
  );
};

import { Dot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CalendarPDF } from "@/components/pdf-match";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { cn } from "@/lib/utils";
import { PartitaVolley } from "@/lib/schemas/match-schema";

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
    <nav className=" border-b-2 border-slate-200 dark:border-slate-800 w-full max-w-auto mx-auto  py-6 ">
      
      <div className="mb-3">
        <Badge
          variant="outline"
          className="text-xs font-light bg-primary/10 text-primary"
        >
          {category} <Dot /> {team}
        </Badge>
      </div>
      <div className="flex items-center justify-center gap-3 mb-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          <span className="text-primary">Calendario</span> Partite
        </h1>
      </div>
      <div className="flex items-center justify-center gap-2">
        <p className="text-muted-foreground text-sm">
          Sfoglia, filtra e scarica il calendario delle gare.
        </p>
      </div>
      <div className="mt-4 flex justify-center w-full">
        <PDFDownloadLink
          document={
            <CalendarPDF matches={matches} category={category} team={team} />
          }
          fileName={`calendario_${category}_${team}.pdf`}
          className="text-primary hover:border-primary transition-all duration-200 inline-flex items-center mt-2 font-light no-underline gap-2 border border-muted-foreground rounded-md px-4 py-2"
        >
          {({ loading }) => (
            <>
              <Download
                className={cn("w-5 h-5", loading && "animate-bounce")}
              />
              Scarica calendario
            </>
          )}
        </PDFDownloadLink>
      </div>
    </nav>
  );
};

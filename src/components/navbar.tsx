import { Dot } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Navbar = ({ category }: { category: string }) => {
  return (
    <nav>
      <div className="mb-3">
        <Badge variant="outline" className="text-xs font-light">
          {category} <Dot />{" "}
          {new Date().getFullYear()}
        </Badge>
      </div>
      <div className="flex items-center justify-center gap-3 mb-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          <span className="text-primary">Calendario</span> Partite
        </h1>
      </div>
      <div className="flex items-center justify-center gap-2">
        <p className="text-muted-foreground text-sm">
          Sfoglia, filtra e scarica il calendario completo delle gare
        </p>
      </div>
    </nav>
  );
};

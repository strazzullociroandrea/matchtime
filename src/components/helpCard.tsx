import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

export const HelpCard = ({
  showInfo,
  setShowInfo,
  category,
  team,
}: {
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  category: string;
  team: string;
}) => {
  return (
    <Dialog open={showInfo} onOpenChange={setShowInfo}>
      <DialogTitle> {""}</DialogTitle>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-none bg-transparent shadow-none">
        <Card className="relative overflow-hidden bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg mx-auto backdrop-blur-md">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />

          <CardContent className="p-8 pl-10">
            <div className="flex flex-col gap-6">
              <div className="space-y-1">
                <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">
                  Benvenuto su
                </span>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                  Match Time<span className="text-primary">.</span>
                </h2>
              </div>

              <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                <p>
                  Il portale dedicato alla categoria{" "}
                  <span className="text-slate-900 dark:text-white font-semibold">
                    {category}
                  </span>{" "}
                  dei{" "}
                  <span className="text-slate-900 dark:text-white font-semibold">
                    {team}
                  </span>
                  .
                </p>

                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Scopri date, orari e luoghi delle partite</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Posizione esatta su mappa con un click</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Scarica il calendario completo in PDF</span>
                  </li>
                </ul>
              </div>

              <div className="mt-2 flex flex-col items-center">
                <button
                  onClick={() => setShowInfo(false)}
                  className="w-full sm:w-2/3 bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                >
                  Inizia a navigare
                </button>
                <p className="mt-4 text-xs text-slate-400  tracking-tight">
                  Questo sito è un progetto indipendente e non ufficiale. I dati
                  dei calendari sono di proprietà di PGS (Polisportive Giovanili
                  Salesiane), recuperati tramite file excel reso disponbile
                  dagli stessi. L&apos;autore non si assume responsabilità per
                  eventuali inesattezze o cambiamenti di orario non riportati.
                  Consultare sempre il portale ufficiale per le comunicazioni
                  formali.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export const SettingsCard = ({
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
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={showInfo} onOpenChange={setShowInfo}>
      <DialogTitle className="sr-only">Impostazioni</DialogTitle>

      <DialogContent className="max-w-[90vw] sm:max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
        <Card className="relative overflow-hidden border border-border bg-card/80 backdrop-blur-xl shadow-2xl rounded-3xl">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />

          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-8">
              <div className="space-y-1">
                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-1 block">
                  Impostazioni
                </span>
                <h2 className="text-4xl font-black tracking-tighter text-foreground">
                  Match Time<span className="text-primary">.</span>
                </h2>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50">
                <p className="text-sm font-bold text-primary tracking-wider mb-4">
                  Dati generali
                </p>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Squadra
                  </p>
                  <p className="font-bold text-foreground">{team}</p>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Categoria
                  </p>
                  <p className="font-bold text-foreground">{category}</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest px-1">
                  Preferenze
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="space-y-0.5">
                      <label
                        htmlFor="notifications"
                        className="text-sm font-bold text-foreground cursor-pointer"
                      >
                        Notifiche Push (Presto disponibile)
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Partite della settimana
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      className="data-[state=checked]:bg-primary"
                      disabled
                    />
                  </div>

                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="space-y-0.5">
                      <label
                        htmlFor="theme-toggle"
                        className="text-sm font-bold text-foreground cursor-pointer"
                      >
                        Tema Scuro (default)
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Attiva o disattiva il tema scuro
                      </p>
                    </div>
                    <Switch
                      id="theme-toggle"
                      checked={theme === "dark"}
                      onCheckedChange={(checked) =>
                        setTheme(checked ? "dark" : "light")
                      }
                      className="data-[state=checked]:bg-primary "
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowInfo(false)}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-sm font-extrabold active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  SALVA E CHIUDI
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

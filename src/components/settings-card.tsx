import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

export const SettingsCard = ({
  show,
  setShow,
  category,
  team,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
  category: string;
  team: string;
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTitle> {""}</DialogTitle>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-none bg-transparent shadow-none">
        <Card className="relative overflow-hiddenshadow-2xl w-full max-w-lg mx-auto backdrop-blur-md">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />

          <CardContent className="p-8 pl-10">
            <div className="flex flex-col gap-6">
              <div className="space-y-1">
                <span className="text-primary font-bold text-[10px] uppercase tracking-widest">
                  Impostazioni
                </span>
                <h2 className="text-3xl font-black  tracking-tighter">
                  Match Time<span className="text-primary">.</span>
                </h2>
              </div>

              <div className="space-y-4">
                <Card className="bg-muted-foreground/10  shadow-sm">
                  <CardContent>
                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest">
                      Generali
                    </span>
                    <p className="italic">
                      <span className="font-semibold   ">Squadra:</span> {team}
                    </p>
                    <p className="italic">
                      <span className="font-semibold  ">Categoria:</span>{" "}
                      {category}
                    </p>
                  </CardContent>
                </Card>
                <div>
                  <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
                    Personalizzazioni
                  </span>
                  <Card className="mt-4 bg-transparent">
                    <CardContent className="flex items-center justify-between ">
                      <div className="space-y-1">
                        <Label
                          htmlFor="dark-theme"
                          className="text-base font-semibold leading-none"
                        >
                          Tema scuro
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Attiva la modalità scura come predefinita.
                        </p>
                      </div>
                      <Switch
                        id="dark-theme"
                        defaultChecked={theme === "dark"}
                        checked={theme === "dark"}
                        onCheckedChange={(checked) =>
                          setTheme(checked ? "dark" : "light")
                        }
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-2 flex flex-col items-center">
                <button
                  onClick={() => setShow(false)}
                  className="w-full sm:w-2/3 bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  Salva e Chiudi
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

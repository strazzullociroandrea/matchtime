"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

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
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [loadingPush, setLoadingPush] = useState(false);

  const subscribeMutation = api.notification.subscribe.useMutation({
    onSuccess: () => {
      setIsPushEnabled(true);
    },
    onError: (err) => {
      console.error("Errore salvataggio server:", err);
      setIsPushEnabled(false);
      alert("Errore nel salvataggio della sottoscrizione.");
    },
  });

  // Sincronizza lo stato dello switch con la realtà del browser
  useEffect(() => {
    const checkSubscription = async () => {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsPushEnabled(!!subscription);
      }
    };
    if (show) checkSubscription();
  }, [show]);

  const handlePushChange = async (enabled: boolean) => {
    if (!enabled) {
      setLoadingPush(true);
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
        setIsPushEnabled(false);
      } catch (e) {
        console.error("Errore disiscrizione:", e);
      } finally {
        setLoadingPush(false);
      }
      return;
    }

    setLoadingPush(true);
    try {
      // 1. Chiedi il permesso esplicito
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Permesso notifiche negato");
      }

      // 2. Registra o ottieni il Service Worker
      const registration = await navigator.serviceWorker.ready;

      // ATTENZIONE: Usa NEXT_PUBLIC_ per esportare la chiave al browser
      const publicKey = process.env.NEXT_PUBLIC_VAPID_KEY;

      if (!publicKey) {
        throw new Error(
          "Chiave VAPID pubblica non trovata nelle variabili d'ambiente",
        );
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const subJSON = subscription.toJSON();

      if (subJSON.endpoint && subJSON.keys?.p256dh && subJSON.keys?.auth) {
        subscribeMutation.mutate({
          subscription: {
            endpoint: subJSON.endpoint,
            keys: {
              p256dh: subJSON.keys.p256dh,
              auth: subJSON.keys.auth,
            },
          },
        });
      }
    } catch (error) {
      console.error("Errore attivazione push:", error);
      alert(error instanceof Error ? error.message : "Errore attivazione push");
      setIsPushEnabled(false);
    } finally {
      setLoadingPush(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTitle className="sr-only">Impostazioni</DialogTitle>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-none bg-transparent shadow-none">
        <Card className="relative overflow-hidden shadow-2xl w-full max-w-lg mx-auto backdrop-blur-md border border-white/10">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
          <CardContent className="p-8 pl-10 bg-background/80">
            <div className="flex flex-col gap-6">
              <div className="space-y-1">
                <span className="text-primary font-bold text-[10px] uppercase tracking-widest">
                  Impostazioni
                </span>
                <h2 className="text-3xl font-black tracking-tighter">
                  Match Time<span className="text-primary">.</span>
                </h2>
              </div>

              <div className="space-y-4">
                <Card className="bg-muted-foreground/10 shadow-sm border-none">
                  <CardContent className="p-4 pt-4">
                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest">
                      Generali
                    </span>
                    <p className="italic text-sm mt-1">
                      <span className="font-semibold">Squadra:</span> {team}
                    </p>
                    <p className="italic text-sm">
                      <span className="font-semibold">Categoria:</span>{" "}
                      {category}
                    </p>
                  </CardContent>
                </Card>

                <div>
                  <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-2">
                    Personalizzazioni
                  </span>
                  <ScrollArea className="w-full h-fit">
                    <div className="space-y-3">
                      {/* TEMA */}
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <Label
                          htmlFor="dark-theme"
                          className="text-base font-semibold"
                        >
                          Tema scuro
                        </Label>
                        <Switch
                          id="dark-theme"
                          checked={theme === "dark"}
                          onCheckedChange={(c) =>
                            setTheme(c ? "dark" : "light")
                          }
                        />
                      </div>

                      {/* NOTIFICHE */}
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <div className="space-y-1">
                          <Label
                            htmlFor="push-notifications"
                            className="text-base font-semibold"
                          >
                            Notifiche push
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Avvisi su partite e variazioni orari.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {(loadingPush || subscribeMutation.isPending) && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          <Switch
                            id="push-notifications"
                            checked={isPushEnabled}
                            onCheckedChange={handlePushChange}
                            disabled={
                              loadingPush || subscribeMutation.isPending
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <button
                onClick={() => setShow(false)}
                className="w-full sm:w-2/3 self-center bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
              >
                Salva e Chiudi
              </button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

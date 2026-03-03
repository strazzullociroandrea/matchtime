"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

/**
 * Function to parse a base64 string to a Uint8Array, used for push notifications subscription.
 * @param base64String The base64 string to convert.
 * @returns  A Uint8Array representing the decoded base64 string.
 */
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
  /**
   * Handler to manage the subscription to push notifications.
   * @returns A promise that resolves when the subscription process is complete.
   */
  const subscribtionHandler = api.notification.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Iscrizione completata!", {
        description: "Hai attivato le notifiche push con successo.",
      });
    },
    onError: (err) => {
      console.error("Error during subscription:", err);
      toast.error("Errore durante l'iscrizione", {
        description:
          "Non è stato possibile attivare le notifiche push. Riprova più tardi.",
      });
    },
  });

  /**
   * Handler to manage the unsubscription from push notifications.
   * @param endpoint The endpoint of the push subscription to be removed.
   * @returns A promise that resolves when the unsubscription process is complete.
   */
  const unsubscriptionHandler = api.notification.unsubscribe.useMutation({
    onSuccess: async () => {
      setCurrentEndpoint(null);
      toast.success("Notifiche disattivate!", {
        description: "Hai disattivato le notifiche push con successo.",
      });
    },
    onError: (err) => {
      console.error("Error during unsubscription:", err);
      toast.error("Errore durante la disattivazione", {
        description:
          "Non è stato possibile disattivare le notifiche push. Riprova più tardi.",
      });
    },
  });

  const { theme, setTheme } = useTheme();
  const [currentEndpoint, setCurrentEndpoint] = useState<string | null>(null);
  const [changePush, setChangePush] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        console.log("[LOG] Current push subscription:", sub);
        if (sub) {
          setCurrentEndpoint(sub.endpoint);
        }
      }
    };
    void checkSubscription();
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <>
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
                    <span className="text-primary">Match</span> Time
                  </h2>
                </div>

                <div className="space-y-4">
                  <Card className="bg-muted-foreground/10 shadow-sm border-none">
                    <CardContent className="pl-4 ">
                      <span className="text-primary font-bold text-[10px] uppercase tracking-widest">
                        Generali
                      </span>
                      <p className="italic text-base   mt-4">
                        <span className="font-semibold">Squadra:</span> {team}
                      </p>
                      <p className="italic text-base mt-3">
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
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                          <Label
                            htmlFor="dark-theme"
                            className="text-base font-semibold"
                          >
                            Tema scuro
                          </Label>
                          <Switch
                            id="dark-theme"
                            checked={theme !== "light"}
                            onCheckedChange={(t) => {
                              try {
                                setTheme(t ? "dark" : "light");
                                toast.success("Il tema è stato aggiornato", {
                                  description: `Tema ${t ? "scuro" : "chiaro"} attivato!`,
                                });
                              } catch (error) {
                                console.error(
                                  "Error during theme change:",
                                  error,
                                );
                                toast.error("Errore durante il cambio tema", {
                                  description:
                                    "Non è stato possibile aggiornare il tema. Riprova più tardi.",
                                });
                              }
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                          <div className="space-y-1">
                            <Label
                              htmlFor="push-notifications"
                              className="text-base font-semibold"
                            >
                              Notifiche push (Beta)
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Avvisi su partite nei prossimi 7 giorni.
                            </p>
                          </div>
                          {changePush ? (
                            <Spinner />
                          ) : (
                            <Switch
                              id="push-notifications"
                              checked={currentEndpoint !== null}
                              onCheckedChange={async (enabled) => {
                                setChangePush(true);
                                if (enabled) {
                                  const result =
                                    await Notification.requestPermission();

                                  if (result !== "granted") return;

                                  try {
                                    const registration =
                                      await navigator.serviceWorker.ready;

                                    const sub =
                                      await registration.pushManager.subscribe({
                                        userVisibleOnly: true,
                                        applicationServerKey:
                                          urlBase64ToUint8Array(
                                            VAPID_PUBLIC_KEY,
                                          ),
                                      });

                                    const subJSON = sub.toJSON();

                                    await subscribtionHandler.mutateAsync({
                                      endpoint: subJSON.endpoint!,
                                      keys: {
                                        p256dh: subJSON.keys!.p256dh!,
                                        auth: subJSON.keys!.auth!,
                                      },
                                    });
                                    setCurrentEndpoint(sub.endpoint);
                                  } catch (error) {
                                    console.error(
                                      "Error during subscription:",
                                      error,
                                    );
                                    toast.error("Errore", {
                                      description:
                                        "Non è stato possibile attivare le notifiche push. Riprova più tardi.",
                                    });
                                  } finally {
                                    setChangePush(false);
                                  }
                                } else {
                                  try {
                                    const registration =
                                      await navigator.serviceWorker.ready;
                                    const sub =
                                      await registration.pushManager.getSubscription();
                                    if (!sub) {
                                      toast.error("Errore", {
                                        description:
                                          "Non è stato possibile disattivare le notifiche push. Riprova più tardi.",
                                      });
                                      return;
                                    }
                                    await unsubscriptionHandler.mutateAsync({
                                      endpoint: sub.endpoint,
                                    });
                                    await sub.unsubscribe();
                                  } catch (error) {
                                    console.error(
                                      "Error during unsubscription:",
                                      error,
                                    );
                                    toast.error("Errore", {
                                      description:
                                        "Non è stato possibile disattivare le notifiche push. Riprova più tardi.",
                                    });
                                    return;
                                  } finally {
                                    setChangePush(false);
                                  }
                                }
                              }}
                            />
                          )}
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
    </>
  );
};

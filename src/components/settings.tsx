"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Moon, Sun, BellRing, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}
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

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [currentEndpoint, setCurrentEndpoint] = useState<string | null>(null);
  const [changePush, setChangePush] = useState(false);

  /**
   * Handler to manage the subscription to push notifications.
   * @returns A promise that resolves when the subscription process is complete.
   */
  const subscribtionHandler = api.notification.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Notifiche attivate!", {
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

  useEffect(() => {
    const checkSubscription = async () => {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
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
    <div className="max-w-xl mx-auto p-6 pb-24">
      <div className="mb-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">
          Impostazioni
        </h1>
        <div className="h-1 w-12 bg-primary rounded-full mb-3" />
        <p className="text-muted-foreground text-sm font-medium">
          Personalizza la tua esperienza e l&apos;interfaccia.
        </p>
      </div>

      <div className="grid gap-4 w-full">
        <Card className="overflow-hidden border border-border/50 bg-secondary/10 backdrop-blur-md hover:bg-secondary/20 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-md font-semibold">Notifiche</h2>
                <p className="text-xs text-muted-foreground">
                  Avvisi su partite nei prossimi 7 giorni.
                </p>
              </div>
              <Button
                id="push-notifications"
                size="icon-lg"
                variant="outline"
                className={cn(
                  "cursor-pointer rounded-2xl border hover:text-primary  ",
                  currentEndpoint
                    ? "bg-green-500/20 text-green-500"
                    : "text-muted-foreground",
                )}
                onClick={async () => {
                  setChangePush(true);
                  if (currentEndpoint === null) {
                    const result = await Notification.requestPermission();

                    if (result !== "granted") return;

                    try {
                      const registration = await navigator.serviceWorker.ready;

                      const sub = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey:
                          urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
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
                      console.error("Error during subscription:", error);
                      toast.error("Errore", {
                        description:
                          "Non è stato possibile attivare le notifiche push. Riprova più tardi.",
                      });
                    } finally {
                      setChangePush(false);
                    }
                  } else {
                    try {
                      const registration = await navigator.serviceWorker.ready;
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
                      console.error("Error during unsubscription:", error);
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
              >
                {changePush ? (
                  <Spinner className="w-4 h-4" />
                ) : currentEndpoint ? (
                  <BellRing className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border border-border/50 bg-secondary/10 backdrop-blur-md hover:bg-secondary/20 transition-all duration-300 shadow-sm hover:shadow-md  ">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-md font-semibold">Tema</h2>
                <p className="text-xs text-muted-foreground">Chiaro/Scuro</p>
              </div>
              <Button
                id="dark-theme"
                variant="outline"
                size="icon-lg"
                className="hover:text-primary cursor-pointer rounded-2xl "
                onClick={() => {
                  try {
                    setTheme(theme === "light" ? "dark" : "light");
                    toast.success("Il tema è stato aggiornato", {
                      description: `Tema ${theme === "light" ? "scuro" : "chiaro"} attivato!`,
                    });
                  } catch (error) {
                    console.error("Error during theme change:", error);
                    toast.error("Errore durante il cambio tema", {
                      description:
                        "Non è stato possibile aggiornare il tema. Riprova più tardi.",
                    });
                  }
                }}
              >
                {theme === "light" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

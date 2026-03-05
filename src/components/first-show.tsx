import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Calendar, LayoutDashboard, Rocket, Copy, Bell } from "lucide-react";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Benvenuti su MatchTime",
    description: "La dashboard per visualizzare i match della tua squadra.",
    icon: <Rocket className="w-20 h-20 text-blue-500" />,
  },
  {
    title: "Tutto sotto controllo",
    description:
      "Resta aggiornato con orari, campi e avversari grazie alla nostra interfaccia intuitiva.",
    icon: <LayoutDashboard className="w-20 h-20 text-emerald-500" />,
    color: "from-emerald-50 to-teal-100",
  },
  {
    title: "Vuoi rimanere aggiornato?",
    description:
      "Installa l'applicazione web sul tuo dispositivo per accedere rapidamente alla dashboard e ricevere notifiche push sui match.",
    icon: <Bell className="w-20 h-20 text-yellow-600" />,
    color: "from-emerald-50 to-teal-100",
  },
  {
    title: "Non puoi vivere senza il tuo calendario?",
    description:
      "Esporta i match direttamente sul tuo Google Calendar o iCal utilizzando il link.",
    icon: <Calendar className="w-20 h-20 text-orange-500" />,
    color: "from-orange-50 to-red-100",
    link: "https://match.cirostrazzullo.it/api/calendar",
  },
];

export function FirstShow() {
  const handleFirstShow = () => {
    if (!Cookies.get("firstShow")) {
      Cookies.set("firstShow", "true", { expires: 365 });
    }
  };
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} className="w-full h-screen">
      <CarouselContent className="h-screen m-0">
        {steps.map((step, index) => (
          <CarouselItem key={index} className="p-0 border-none">
            <div className="flex flex-col items-center justify-center h-full w-full max-w-3xl mx-auto px-6 text-center">
              <div className="mb-10 animate-bounce-slow">{step.icon}</div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight   mb-6">
                {step.title}
              </h1>

              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                {step.description}
              </p>

              {step.link && (
                <div className="bg-white/50 backdrop-blur-sm border border-slate-200 p-4 rounded-xl flex items-center gap-3 mb-8 w-full max-w-md">
                  <code className="text-sm text-slate-700 truncate flex-1">
                    {step.link}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigator.clipboard.writeText(step.link)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {index === steps.length - 1 && (
                <Button
                  size="sm"
                  className="rounded-full px-10 shadow-lg hover:scale-105 transition-transform"
                  onClick={handleFirstShow}
                >
                  Inizia ora
                </Button>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="hidden md:flex left-12 h-12 w-12 hover:text-white" />
      <CarouselNext className="hidden md:flex right-12 h-12 w-12 hover:text-white" />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center gap-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              current === index
                ? "bg-blue-500 w-8" 
                : "bg-slate-300",
            )}
          />
        ))}
      </div>
    </Carousel>
  );
}

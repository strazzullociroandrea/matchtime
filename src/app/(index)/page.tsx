"use client";

import { api } from "@/trpc/react";
import { CardMatch } from "@/components/card-match";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  const { data, isLoading } = api.orario.getInfo.useQuery();

  if (isLoading || !data || !data.team || !data.category) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full shadow-md"></div>
        <p className="text-muted-foreground animate-pulse font-medium">
          Caricamento calendario...
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky mb-6 mt-5 top-0 z-50 w-full bg-background shadow-sm">
        <Navbar
          matches={data?.matches || []}
          category={data?.category || ""}
          team={data?.team || ""}
        />
      </header>
      <main>
        <CardMatch
          matches={data?.matches || []}
          category={data?.category || ""}
          team={data?.team || ""}
        />
      </main>
      <div className="mt-14 mb-14 mx-auto max-w-7xl px-6">
        <Footer lastUpdate={data?.lastUpdate} />
      </div>
    </>
  );
}

import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "next-themes";
import {TRPCReactProvider} from "@/trpc/react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Match Time",
    description: "A simple match time tracker for Under 15 maschile PGS volleyball team.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="it" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TRPCReactProvider>
                {children}
            </TRPCReactProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
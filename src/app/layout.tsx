import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk as SpaceGrotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = SpaceGrotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "KILL LIPE | Canal de Games",
  description:
    "Site oficial do KILL LIPE. Gameplays, guias e cobertura de lançamentos em português.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${inter.className} min-h-full bg-[#050505] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
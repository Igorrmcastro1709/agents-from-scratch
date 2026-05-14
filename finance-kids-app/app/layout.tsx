import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campeonato de Educação Financeira",
  description: "App de mesada infantil com visão mensal, semanal e anual.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

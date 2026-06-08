import type { Metadata } from "next";
import "./styles/globals.scss";
import "./styles/fonts.scss";
import { TRPCProvider } from "./providers/TRPCProvider";

export const metadata: Metadata = {
  title: "Photoi",
  description: "Photoi — Banco de imágenes generadas con IA",
};

export default function PhotoiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCProvider>
      <div className="photoiScope">{children}</div>
    </TRPCProvider>
  );
}

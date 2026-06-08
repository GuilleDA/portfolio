import type { Metadata, Viewport } from "next";
import "./styles/globals.scss";
import { TRPCProvider } from "./components/TRPCProvider";

export const metadata: Metadata = {
  title: "Fudi",
  description: "Fudi — On your table in 30",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function FudiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCProvider>
      <div className="fudiScope">{children}</div>
    </TRPCProvider>
  );
}

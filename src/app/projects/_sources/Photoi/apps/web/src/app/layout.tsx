import type { Metadata } from "next";
import "../styles/globals.scss";
import "../styles/fonts.scss";
import { TRPCProvider } from "../providers/TRPCProvider";

export const metadata: Metadata = {
  title: "Photoi",
  description: "Photoi",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}

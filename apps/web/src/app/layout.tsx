import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { PwaRegistration } from "@/components/pwa-registration";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: {
    default: "Maestro | Centro de progreso personal",
    template: "%s | Maestro",
  },
  description: "Un solo sistema para estudiar, crear, crecer y revisar tu progreso con claridad.",
  applicationName: "Maestro",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Maestro",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4f1e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className={geist.variable}>
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}

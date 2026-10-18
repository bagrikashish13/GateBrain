import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { RegisterServiceWorker } from "@/components/register-sw";
import { getSettings } from "@/lib/settings";
import "./globals.css";

// Fonts live in the repo (latin, woff2; SIL Open Font License), so building never needs Google.
// Chakra Petch: squared letters with cut corners, the same angle as the UI's cut corners.
const chakra = localFont({
  variable: "--font-chakra",
  src: [
    { path: "./fonts/chakra-petch-500.woff2", weight: "500" },
    { path: "./fonts/chakra-petch-600.woff2", weight: "600" },
    { path: "./fonts/chakra-petch-700.woff2", weight: "700" },
  ],
});
const plexSans = localFont({ variable: "--font-plex-sans", src: [{ path: "./fonts/ibm-plex-sans.woff2", weight: "400 600" }] });
const plexMono = localFont({ variable: "--font-plex-mono", src: [{ path: "./fonts/ibm-plex-mono-400.woff2", weight: "400" }] });

export const metadata: Metadata = {
  title: "GateBrain",
  description: "GATE prep: notes, revision, plan and mock tests.",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "GateBrain", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const settings = getSettings();
  return (
    <html lang="en" data-theme={settings.theme} className={`dark ${chakra.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("gatebrain-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}

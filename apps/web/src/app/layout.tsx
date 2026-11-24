import type { Metadata, Viewport } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import { THEME_COLORS, THEME_INIT_SCRIPT } from "@/lib/theme";
import "@/styles/tokens/palette.css";
import "@/styles/tokens/themes.css";
import "@/styles/tokens/scale.css";
import '@/styles/tokens/type.css';
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-manrope",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Reydarr",
  description: "Websites for small businesses in Nigeria, built with Zuri.",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

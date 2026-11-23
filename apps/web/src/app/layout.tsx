import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reydarr",
  description: "Websites for small businesses in Nigeria, built with Zuri.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

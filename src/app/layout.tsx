import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkedReach – BS23 Outreach Tool",
  description: "Internal LinkedIn outreach automation for Brain Station 23",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

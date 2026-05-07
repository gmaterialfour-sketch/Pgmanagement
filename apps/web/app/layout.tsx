import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StayNear PG Rentals",
  description: "Location based PG discovery and booking for students"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

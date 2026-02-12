import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tymoteusz Tymendorf - CV",
  description: "CV Tymoteusza Tymendorfa - Fullstack Developer & AI Engineer",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pelican Club — Menu Editor",
  description: "Internal menu editor for The Pelican Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Step High Sneakers | Cyber Footwear Ledger",
  description: "Phase 2 Backend Architecture & Pre-Order Service Pipeline",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#fbf9f4", color: "#292524" }}>
        {children}
      </body>
    </html>
  );
}

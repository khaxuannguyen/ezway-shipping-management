import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "International Shipping Admin",
  description: "MVP admin for international shipping operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import ClientLayout from "@/components/providers/ClientLayout";

export const metadata: Metadata = {
  title: "PDF Tools - Free Online PDF Utilities",
  description: "Free online PDF tools - merge, split, compress, convert PDFs and more. Similar to ilovePDF with powerful features.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
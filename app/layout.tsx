import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MINDORA — Digital Youth Wellness Platform",
  description: "A safe, confidential, and modern wellness and addiction prevention platform for college students.",
  keywords: ["mental wellness", "digital detox", "student wellness", "confidential counselor", "addiction prevention"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-[#00F5D4]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}

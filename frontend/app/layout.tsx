import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "CodeSecureX — LLM Vulnerability Scanner",
  description:
    "Detect vulnerabilities using CodeSecureX in seconds. Paste or upload code and instantly detect security vulnerabilities powered by AI. Get severity ratings, explanations, and fix suggestions.",
  keywords: ["security", "vulnerability scanner", "AI", "code review", "OWASP"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[hsl(222,47%,5%)] antialiased">
        <AuthProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(222,47%,10%)",
                color: "hsl(213,31%,91%)",
                border: "1px solid hsl(222,47%,18%)",
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "hsl(142,71%,45%)", secondary: "hsl(222,47%,10%)" } },
              error:   { iconTheme: { primary: "hsl(0,72%,51%)",   secondary: "hsl(222,47%,10%)" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

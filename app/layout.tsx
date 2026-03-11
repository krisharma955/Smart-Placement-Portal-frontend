import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Smart Placement Portal",
  description: "The definitive platform bridging the gap between exceptional talent and hyper-growth companies with AI resume scoring and intelligent matching.",
  openGraph: {
    title: "Smart Placement Portal",
    description: "Launch your career smarter with AI. The ultimate placement platform.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Placement Portal",
    description: "Launch your career smarter with AI. The ultimate placement platform.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, "dark")} suppressHydrationWarning>
      <body className="antialiased font-sans flex min-h-screen flex-col bg-[#0A0A0F] text-foreground selection:bg-primary/30 selection:text-white">

        {/* Global Premium Background Effect */}
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#0A0A0F]">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 via-primary/0 to-transparent" />
        </div>

        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-1 relative z-0">{children}</main>
            <Footer />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

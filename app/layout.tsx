import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationProgress from "@/components/ui/NavigationProgress";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BioLinks | Your Digital Identity",
  description: "Create your professional link-in-bio in seconds.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NavigationProgress />
        {children}
      </body>
    </html>
  );
}

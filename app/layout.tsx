import type { Metadata, Viewport } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack/server";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory App",
  description: "Inventory management dashboard",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B1635",
};

const authTheme = {
  light: {
    primary: "#5B3FD9",
    primaryForeground: "#FFFFFF",
    ring: "#5B3FD9",
  },
  dark: {
    primary: "#8B6CFF",
    primaryForeground: "#FFFFFF",
    ring: "#8B6CFF",
  },
  radius: "12px",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <StackProvider app={stackServerApp}>
          <StackTheme theme={authTheme}>{children}</StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
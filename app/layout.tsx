import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

const bebasNeue = Bebas_Neue({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "DS2 Table Football Tournament",
  description: "Register for the ultimate DS2 Table Football Tournament.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bebasNeue.variable} font-sans bg-[#1a6b2e] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}

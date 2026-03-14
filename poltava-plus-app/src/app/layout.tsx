import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll"; 
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "PoltavaPlus",
  description: "Всі сервіси Полтави в одному місці",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>
        <SmoothScroll>
          <Header />
          <div className="min-h-screen flex flex-col">
              <main className="flex-grow">
                  {children}
              </main>
              <Footer /> 
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import PageWrapper from "@/components/Pagewrapper";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fourgo — Digital Agency",
  description: "Professional web development, design, and marketing services.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-[#0a1f44] relative`}>
        <Background />
        <Navbar />
        <main className="relative z-10">
          <PageWrapper>{children}</PageWrapper>
        </main>
        <Footer/>
      </body>
    </html>
  );
}

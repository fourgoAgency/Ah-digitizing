import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "AhDigitizing",
  description: "A digital art portfolio showcasing stunning creations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}

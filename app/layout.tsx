import type { Metadata } from "next";
import "./global.css";
import "react-quill-new/dist/quill.snow.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://ah-digitizing.vercel.app"),
  title: {
    default: "Embroidery Digitizing & Vector Art | AH Digitizing",
    template: "%s | AH Digitizing",
  },
  description:
    "Professional embroidery digitizing and raster to vector conversion, manually prepared for clean stitching and production-ready results.",
  alternates: {
    canonical: "/",
  },
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

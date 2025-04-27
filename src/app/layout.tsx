import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";
import { Navbar } from "./components/navbar";
import { QueryProvider } from "./components/query-provider";
const inter = DM_Sans({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dualmind.kayodedev.com"),
  title: "Dualmind",
  description: "Merging the capabilities of two AI agents",
  openGraph: {
    title: "Dualmind",
    description: "Merging the capabilities of two AI agents",
    url: "https://dualmind.kayodedev.com",
    siteName: "Dualmind",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Dualmind",
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} h-dvh antialiased text-neutral-300 !bg-neutral-950  flex flex-col justify-between`}
      >
        <QueryProvider>
          <Navbar />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}

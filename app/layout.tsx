import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moose Rocket",
  description: "A silly little 2d shooter game. With physics!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}

        {/*         <Script src="https://www.googletagmanager.com/gtag/js?id=G-LYQ1KKE5FV" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-LYQ1KKE5FV');
        `}
        </Script> */}
      </body>
    </html>
  );
}

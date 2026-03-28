import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deep Space Explorer — Traverse the Cosmos",
  description:
    "An immersive 3D deep-space exploration experience with procedurally generated stars, orbiting planets, nebula clouds, and real-time physics simulation.",
  keywords: ["space", "3D", "WebGL", "Three.js", "cosmos", "explorer", "astronomy"],
  authors: [{ name: "Deep Space Explorer" }],
  openGraph: {
    title: "Deep Space Explorer",
    description: "Traverse the infinite cosmos in real-time 3D",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#020408" />
      </head>
      <body className="h-full overflow-hidden antialiased">{children}</body>
    </html>
  );
}

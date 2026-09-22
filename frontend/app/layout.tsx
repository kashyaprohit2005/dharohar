import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dharohar — India's Living Heritage (Places, People, Stories & Proof)",
  description: "India's premier Living Cultural Atlas & Provenance Engine. Explore living crafts, textiles, sacred citadels, folk bards, live cultural events, and verified master practitioners across India.",
  keywords: ["Dharohar", "Living Heritage Atlas", "Indian Crafts", "GI Registry", "Cultural Events", "Artisan Provenance", "Smart India Hackathon 2026"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,800;1,600&display=swap" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-full flex flex-col bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950">
        {children}
      </body>
    </html>
  );
}

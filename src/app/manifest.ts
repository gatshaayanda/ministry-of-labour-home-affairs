import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Iteration 13 | Service Studio",
    short_name: "Iteration 13",
    description: "Botswana Ministry service guidance, citizen enquiries and offline-aware public service support.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f5f0",
    theme_color: "#155eef",
    orientation: "portrait-primary",
    lang: "en",
    categories: ["business", "productivity"],
    prefer_related_applications: false,
    icons: [
      { src: "/iteration13-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/iteration13-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/iteration13-icon-180.png", sizes: "180x180", type: "image/png", purpose: "any" },
      { src: "/iteration13-icon-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" },
      
      { src: "/iteration13-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }
    ],
    shortcuts: [
      {
        name: "Browse services",
        short_name: "Services",
        description: "Explore Ministry services and submit a citizen enquiry",
        url: "/",
        icons: [{ src: "/iteration13-icon-192.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "My account",
        short_name: "Account",
        description: "Review your Ministry enquiries and service updates",
        url: "/?view=account",
        icons: [{ src: "/iteration13-icon-192.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "Admin demo",
        short_name: "Admin",
        description: "Open the private Ministry operations workspace",
        url: "/#admin",
        icons: [{ src: "/iteration13-icon-192.png", sizes: "192x192", type: "image/png" }]
      }
    ]
  };
}

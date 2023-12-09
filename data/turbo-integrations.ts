export const integrationCategories = [
  "health",
  "general",
  "entertainment",
] as const

interface TurboIntegration {
  name: string
  href: string
  url: string
  description: string
  imgLight: string
  imgDark: string
  category: (typeof integrationCategories)[number]
}

export const turboIntegrations = {
  litProtocol: {
    name: "Spotify",
    href: "/dashboard/upload/data-provider?source=GoogleFit",
    url: "https://spotify.com/",
    description:
      "Share you own music data",
    category: "entertainment",
    imgLight: "/integrations/spotify-icon.svg",
    imgDark: "/integrations/spotify-icon.svg",
  },
  googleFit: {
    name: "Google Fit",
    href: "/dashboard/upload/data-provider?source=GoogleFit",
    url: "https://www.google.com/fit/",
    description:
      "Share your own personal health and fitness data.",
    category: "health",
    imgLight: "/integrations/fit-icon.svg",
    imgDark: "/integrations/fit-icon.svg",
  },
} as const

import { ReactNode } from "react"
import Image from "next/image"
import { turboIntegrations } from "@/data/turbo-integrations"

import { PageSectionGrid } from "@/components/layout/page-section"
import { IsDarkTheme } from "@/components/shared/is-dark-theme"
import { IsLightTheme } from "@/components/shared/is-light-theme"
import { LightDarkImage } from "@/components/shared/light-dark-image"

export type Integration = {
  title: string
  description: string
  href: string
  contractAddress?: string
  demo: JSX.Element
}

export const integrations: Integration[] = [
  {
    title: "Google Fit",
    description: "Upload your personal health data from Google Fit.",
    href: "/dashboard/upload/data-provider?source=GoogleFit",
    demo: (
      <div className="flex items-center justify-center space-x-20">
        <IsLightTheme>
          <Image
            alt="Google Fit Logo"
            height={100}
            src="/integrations/fit-icon.svg"
            width={100}
          />
        </IsLightTheme>
        <IsDarkTheme>
          <Image
            alt="Google Fit Logo"
            height={100}
            src="/integrations/fit-icon.svg"
            width={100}
          />
        </IsDarkTheme>
      </div>
    ),
  },
  {
    title: "Spotify",
    description: "Upload your personal health data from Spotify.",
    href: "/dashboard/upload/data-provider?source=Spotify",
    demo: (
      <div className="flex items-center justify-center space-x-20">
        <IsLightTheme>
          <Image
            alt="Spotify"
            height={100}
            src="/integrations/spotify-icon.svg"
            width={100}
          />
        </IsLightTheme>
        <IsDarkTheme>
          <Image
            alt="Spotify"
            height={100}
            src="/integrations/spotify-icon.svg"
            width={100}
          />
        </IsDarkTheme>
      </div>
    ),
  },
  {
    title: "Plaid",
    description: "Upload your personal financial from Paid.",
    href: "/dashboard/upload/data-provider?source=Plaid",
    demo: (
      <div className="flex items-center justify-center space-x-20">
        <IsLightTheme>
          <Image
            alt="Spotify"
            height={100}
            src="/integrations/plaid-icon.png"
            width={100}
          />
        </IsLightTheme>
        <IsDarkTheme>
          <Image
            alt="Spotify"
            height={100}
            src="/integrations/plaid-icon.png"
            width={100}
          />
        </IsDarkTheme>
      </div>
    ),
  },
  {
    title: "Strava",
    description: "Upload your personal running from Strava.",
    href: "/dashboard/upload/data-provider?source=Strava",
    demo: (
      <div className="flex items-center justify-center space-x-20">
        <IsLightTheme>
          <Image
            alt="Spotify"
            height={100}
            src="/integrations/strava.png"
            width={100}
          />
        </IsLightTheme>
        <IsDarkTheme>
          <Image
            alt="Spotify"
            height={100}
            src="/integrations/strava.png"
            width={100}
          />
        </IsDarkTheme>
      </div>
    ),
  },
  {
    title: "My Fitness Pal",
    description: "Upload your personal fitness data from My Fitness Pal.",
    href: "/dashboard/upload/data-provider?source=MyFitnessPal",
    demo: (
      <div className="flex items-center justify-center space-x-20">
        <IsLightTheme>
          <Image
            alt="Spotify"
            height={100}
            src="/integrations/mfp.png"
            width={100}
          />
        </IsLightTheme>
        <IsDarkTheme>
          <Image
            alt="Spotify"
            height={100}
            src="/integrations/mfp.png"
            width={100}
          />
        </IsDarkTheme>
      </div>
    ),
  },
]

type IntegrationDescription = {
  title: string
  description: string
  disclaimer?: ReactNode
  image: ReactNode
  url: string
}

export const integrationDescriptions: {
  [key: string]: IntegrationDescription
} = {
  GoogleFit: {
    title: "Google Fit",
    description: "Upload your personal health data from Google Fit.",
    disclaimer: (
      <div className="my-4">
        <p>
          By clicking &apos;Upload&apos;, you&apos;ll be directed to our secure
          API integration portal, where you can upload your Google Fit data.
        </p>
        <p className="mb-4 text-gray-600">
          You&apos;ll be asked to grant us the following permissions:
        </p>
        <ul className="list-inside list-disc text-gray-600">
          <li className="mb-1">
            View your Google Fit data: This allows us to fetch the necessary
            fitness data for your profile.
          </li>
          <li className="mb-1">
            Upload Google Fit data: This allows us to upload fitness data to
            your Google Fit account, if you choose to sync data from our app.
          </li>
          <li className="mb-1">
            Manage your Google Fit data: This allows us to update or delete
            fitness data, ensuring your data in our app stays in sync with
            Google Fit.
          </li>
        </ul>
      </div>
    ),
    image: (
      <LightDarkImage
        LightImage={turboIntegrations.googleFit.imgDark}
        DarkImage={turboIntegrations.googleFit.imgLight}
        alt="Google Fit Logo"
        width={100}
        height={100}
      />
    ),
    url: turboIntegrations.googleFit.url,
  },
}

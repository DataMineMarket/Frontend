// This file allows us to add in additional frontend integrations to the dashboard.

"use client"

import Image from "next/image"
import Link from "next/link"
import { turboIntegrations } from "@/data/turbo-integrations"
import { motion, MotionProps } from "framer-motion"
import ReactMarkdown from "react-markdown"
import Balancer from "react-wrap-balancer"

import { DEPLOY_URL } from "@/config/site"
import { cn } from "@/lib/utils"
import { fadeUpVariant } from "@/lib/utils/motion"
import { buttonVariants } from "@/components/ui/button"
import { WalletAddress } from "@/components/blockchain/wallet-address"
import { WalletConnect } from "@/components/blockchain/wallet-connect"
import { PageSectionGrid } from "@/components/layout/page-section"
import { IsDarkTheme } from "@/components/shared/is-dark-theme"
import { IsLightTheme } from "@/components/shared/is-light-theme"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"
import { LightDarkImage } from "@/components/shared/light-dark-image"
import { ERC721TokenUriImage, ERC721TokenUriName } from "@/integrations/erc721"
import { ButtonSIWELogin } from "@/integrations/siwe/components/button-siwe-login"
import { ButtonSIWELogout } from "@/integrations/siwe/components/button-siwe-logout"
import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"
import { IsSignedOut } from "@/integrations/siwe/components/is-signed-out"

const integrations = [
  {
    title: "Google Fit",
    description: "Upload your personal health data from Google Fit.",
    href: "/dashboard/upload/google-fit",
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
    href: "/dashboard/upload/google-fit",
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
    href: "/dashboard/upload/google-fit",
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
    href: "/dashboard/upload/google-fit",
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
    href: "/dashboard/upload/google-fit",
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

interface Web2IntegrationsProps extends MotionProps {
  className?: string
}

export function Web2Integrations({
  className,
  ...props
}: Web2IntegrationsProps) {
  return (
    <PageSectionGrid className={className} {...props}>
      {integrations.map(({ title, description, href, demo }) => (
        <DemoCard
          key={title}
          title={title}
          description={description}
          href={href}
          demo={demo}
        />
      ))}
    </PageSectionGrid>
  )
}

interface DemoCardProps extends MotionProps {
  demo: React.ReactNode
  title: string
  description: string
  large?: boolean
  href?: string
}

function DemoCard({ title, description, href, demo, large }: DemoCardProps) {
  return (
    <motion.div
      variants={fadeUpVariant()}
      className={`relative col-span-1 overflow-hidden rounded-xl border bg-card px-4 shadow-sm transition-shadow hover:shadow-md ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex h-60 items-center justify-center">{demo}</div>
      <div className="mx-auto max-w-xl text-center">
        <h2 className="mb-3 bg-gradient-to-br from-black to-stone-500 bg-clip-text text-xl font-bold text-transparent dark:from-stone-100 dark:to-emerald-200 md:text-3xl md:font-normal">
          <Balancer>{title}</Balancer>
        </h2>
        <div className="prose-sm md:prose -mt-2 leading-normal text-muted-foreground">
          <Balancer>
            <ReactMarkdown
              components={{
                a: ({ ...props }) => (
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    {...props}
                    className="font-medium text-foreground underline transition-colors dark:text-blue-200"
                  />
                ),

                code: ({ ...props }) => (
                  <code
                    {...props}
                    className="rounded-sm px-1 py-0.5 font-mono font-medium text-foreground"
                  />
                ),
              }}
            >
              {description}
            </ReactMarkdown>
          </Balancer>
        </div>
        {!href ? null : (
          <Link href={href} className={cn(buttonVariants(), "my-4")}>
            Upload Data
          </Link>
        )}
      </div>
    </motion.div>
  )
}

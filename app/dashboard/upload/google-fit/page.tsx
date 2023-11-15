"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { turboIntegrations } from "@/data/turbo-integrations"
import { LuBook } from "react-icons/lu"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnect } from "@/components/blockchain/wallet-connect"
import {
  PageHeader,
  PageHeaderCTA,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-header"
import { PageSection } from "@/components/layout/page-section"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"
import { LightDarkImage } from "@/components/shared/light-dark-image"
import { FormLitDecryptMessage } from "@/integrations/lit-protocol/components/form-lit-decrypt-message"
import { FormLitEncryptMessage } from "@/integrations/lit-protocol/components/form-lit-encrypt-message"

export default function GoogleFitPage() {
  const searchParams = useSearchParams()
  const id = searchParams?.get("id") || ""

  return (
    <div className="container relative mt-10">
      <PageHeader className="pb-8">
        <LightDarkImage
          LightImage={turboIntegrations.googleFit.imgDark}
          DarkImage={turboIntegrations.googleFit.imgLight}
          alt="Google Fit Logo"
          width={100}
          height={100}
        />
        <PageHeaderHeading>Fit</PageHeaderHeading>
        <PageHeaderDescription>
          Upload your personal health data from Google Fit to earn tokens.
        </PageHeaderDescription>
        <PageHeaderCTA>
          <Link
            href={turboIntegrations.googleFit.url}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LuBook className="mr-2 h-4 w-4" />
            Documentation
          </Link>
        </PageHeaderCTA>
      </PageHeader>
      <PageSection>
        <Tabs defaultValue="upload data" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload data">Upload Data</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          <TabsContent value="upload data" className="mt-6">
            <IsWalletConnected>
              <div>
                {/* Add in Blue button to connect to Google fit to retrieve data*/}

              </div>
            </IsWalletConnected>
            <IsWalletDisconnected>
              <div className="flex items-center justify-center">
                <WalletConnect />
              </div>
            </IsWalletDisconnected>
          </TabsContent>
          <TabsContent value="permissions" className="mt-6">
            <IsWalletConnected>
              <div>
                <p className="mb-2 text-lg font-semibold text-gray-700">
                  By clicking 'Upload', you'll be directed to our secure API
                  integration portal, where you can upload your Google Fit data.
                </p>
                <p className="mb-4 text-gray-600">
                  You'll be asked to grant us the following permissions:
                </p>
                <ul className="list-inside list-disc text-gray-600">
                  <li className="mb-1">
                    View your Google Fit data: This allows us to fetch the
                    necessary fitness data for your profile.
                  </li>
                  <li className="mb-1">
                    Upload Google Fit data: This allows us to upload fitness
                    data to your Google Fit account, if you choose to sync data
                    from our app.
                  </li>
                  <li className="mb-1">
                    Manage your Google Fit data: This allows us to update or
                    delete fitness data, ensuring your data in our app stays in
                    sync with Google Fit.
                  </li>
                </ul>
              </div>
            </IsWalletConnected>
            <IsWalletDisconnected>
              <div className="flex items-center justify-center">
                <WalletConnect />
              </div>
            </IsWalletDisconnected>
          </TabsContent>
        </Tabs>
      </PageSection>
    </div>
  )
}

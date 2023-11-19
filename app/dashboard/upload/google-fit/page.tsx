"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { turboIntegrations } from "@/data/turbo-integrations"
import { LuBook } from "react-icons/lu"
import { set } from "zod"

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

import { exchangeCodeForTokens, googleAuthUrl } from "./auth"

export default function GoogleFitPage() {
  const [isConnectedModal, setIsConnectedModal] = useState(false)

  // Redirect to Google Authentication URL
  const connectGoogleFit = () => {
    window.location.href = googleAuthUrl
  }
  // Parse authorization code from URL when user is redirected back to the application
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code")

    if (code) {
      setIsConnectedModal(true)

      // Get access token and a refresh token
      exchangeCodeForTokens(code)
        .then((response) => {
          console.log("Tokens: ", response.data.access_token) // This will log the access and refresh tokens
        })
        .catch((error) => {
          console.error("Error: ", error)
        })

      // Send the tokens to chainlink functions
      console.log("Code: ", code)

      // Redirect to page without code in URL
      window.history.replaceState(
        {},
        document.title,
        "/dashboard/upload/google-fit"
      )
    }
  }, [])

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
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="upload data">Upload Data</TabsTrigger>
          </TabsList>
          <TabsContent value="upload data" className="mt-6">
            <IsWalletConnected>
              <div className="my-4">
                <p>
                  By clicking &apos;Upload&apos;, you&apos;ll be directed to our
                  secure API integration portal, where you can upload your
                  Google Fit data.
                </p>
                <p className="mb-4 text-gray-600">
                  You&apos;ll be asked to grant us the following permissions:
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
              <div>
                <div className="flex justify-center">
                  <button
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    onClick={connectGoogleFit}
                  >
                    Connect to Google Fit To Upload Data
                  </button>
                </div>

                {isConnectedModal && (
                  <div
                    className="fixed inset-0 z-10 flex justify-center"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                  >
                    <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
                      <span
                        className="hidden sm:inline-block sm:h-screen sm:align-middle"
                        aria-hidden="true"
                      >
                        &#8203;
                      </span>

                      <div className="inline-block overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                              <h3
                                className="text-lg font-medium leading-6 text-gray-900"
                                id="modal-title"
                              >
                                Google Fit Connection
                              </h3>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  Connection to Google Fit was successful.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => setIsConnectedModal(false)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </IsWalletConnected>
            <IsWalletDisconnected>
              <div className="flex items-center justify-center">
                <WalletConnect />
              </div>
            </IsWalletDisconnected>
          </TabsContent>
          <TabsContent value="permissions" className="mt-6">
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

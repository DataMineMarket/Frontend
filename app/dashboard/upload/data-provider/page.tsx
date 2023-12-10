"use client"

import { useEffect, useState } from "react"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { DataListingAbi } from "@/contracts"
import { turboIntegrations } from "@/data/turbo-integrations"
import { networkConfig } from "@/DataNexusContracts/helper-hardhat-config"
import { env } from "@/env.mjs"
import { ethers } from "ethers"
import { LuBook } from "react-icons/lu"
import { data } from "tailwindcss/defaultTheme"
import {
  Address,
  useContractEvent,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi"

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

import { integrationDescriptions } from "../templates/integrations-templates"
import { prepareArgs } from "./functions-handler"
import { exchangeCodeForTokens, googleAuthUrl } from "./google-auth"

// import { exchangeCodeForTokens, googleAuthUrl } from "./google-auth"

export default function DataProviderPage() {
  const [isConnectedModal, setIsConnectedModal] = useState(false)
  const [authToken, setAuthToken] = useState("")
  const [address, setAddress] = useState<Address>()
  const [tokenKey, setTokenKey] = useState("")
  const [dataKey, setDataKey] = useState("")
  const [args, setArgs] = useState<string[]>()
  const [dataResponse, setDataResponse] = useState<string>("")
  const [transactionState, setTransactionState] = useState("")

  const { chain } = useNetwork()
  const chainId = chain!.id
  const searchParams = useSearchParams()
  const dataSource: string = searchParams.get("source") || "Google"
  const queryAddress = searchParams.get("address")
  const integrationDescription = integrationDescriptions[dataSource]

  useEffect(() => {
    if (queryAddress) {
      sessionStorage.setItem("address", queryAddress)
      setAddress(queryAddress as Address)
    } else {
      const storedAddress = sessionStorage.getItem("address") || ""
      setAddress(storedAddress as Address)
    }
  }, [queryAddress])

  useContractRead({
    address: address,
    abi: DataListingAbi,
    functionName: "getTokenKey",
    onSuccess: (data: string) => {
      setTokenKey(data)
    },
  })

  useContractRead({
    address: address,
    abi: DataListingAbi,
    functionName: "getDataKey",
    onSuccess: (data: string) => {
      setDataKey(data)
    },
  })

  useEffect(() => {
    if (authToken && dataKey && tokenKey) {
      prepareArgs(authToken, dataKey, tokenKey)
        .then((args) => {
          setArgs(args)
        })
        .catch((error) => {
          console.error("Error: ", error)
        })
    }
  }, [authToken, dataKey, tokenKey])

  const { config } = usePrepareContractWrite({
    address: address,
    abi: DataListingAbi,
    functionName: "provideData",
    args: [
      0, // don hosted secrets - slot ID - empty in this example
      0, // don hosted secrets - version - empty in this example
      args,
      [], // bytesArgs - arguments can be encoded off-chain to bytes.
      process.env.NEXT_PUBLIC_SUBSCRIPTION_ID,
      networkConfig[chainId].gasLimit!,
      ethers.utils.formatBytes32String(networkConfig[chainId].functionsDonId!),
    ],
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  useContractEvent({
    address: address,
    abi: DataListingAbi,
    eventName: "Response",
    listener(log: any) {
      setDataResponse(log[0].args.response)
      console.log("RESPONSE EVENT LOG:", log)
      if (log[0].args.response === "0x") {
        setTransactionState("failed")
        console.log("failed log: ", log)
      } else {
        setTransactionState("success")
      }
    },
  })

  // Redirect to Google Authentication URL
  const connectGoogleFit = () => {
    window.location.href = googleAuthUrl
  }
  // Parse authorization code from URL when user is redirected back to the application
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code")
    setAddress(sessionStorage.getItem("address") as Address)

    if (code) {
      setIsConnectedModal(true)

      // Get access token and a refresh token
      exchangeCodeForTokens(code)
        .then((response) => {
          setAuthToken(response.data.access_token)
        })
        .catch((error) => {
          console.error("Error: ", error)
        })

      // Redirect to page without code in URL
      window.history.replaceState(
        {},
        document.title,
        "/dashboard/upload/data-provider"
      )
    }
  }, [])

  return (
    <div className="container relative mt-10">
      <PageHeader className="pb-8">
        {integrationDescription.image}
        <PageHeaderHeading>Fit</PageHeaderHeading>
        <PageHeaderDescription>
          {integrationDescription.description}
        </PageHeaderDescription>
        <PageHeaderCTA>
          <Link
            href={integrationDescription.url}
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
        {!authToken ? null : (
          <div>
            {transactionState == "" ? (
              <button
                className="rounded border border-blue-700 bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                onClick={() => {
                  setTransactionState("pending")
                  console.log("Starting Transaction...")
                  write?.()
                }}
              >
                Provide Data
              </button>
            ) : (
              <div>
                {transactionState == "pending" ? (
                  <b className="text-2xl">Data Uploading Pending...</b>
                ) : (
                  <b className="text-2xl">🎉 Data Upload Succesfull! 🎉</b>
                )}
              </div>
            )}
          </div>
        )}
        <Tabs defaultValue="upload data" className="w-full max-w-4xl">
          <TabsContent value="upload data" className="mt-6">
            <IsWalletConnected>
              {integrationDescription.disclaimer}
              <div>
                {authToken ? (
                  <div className="flex justify-center text-xl">
                    {integrationDescription.title} Account Connected ✅
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <button
                      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                      onClick={connectGoogleFit}
                    >
                      Connect to {integrationDescription.title} To Upload Data
                    </button>
                  </div>
                )}

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
                                {integrationDescription.title} Connection
                              </h3>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  Connection to {integrationDescription.title}{" "}
                                  was successful.
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

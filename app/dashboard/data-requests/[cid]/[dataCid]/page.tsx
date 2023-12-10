"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { turboIntegrations } from "@/data/turbo-integrations"
import { LuBook } from "react-icons/lu"
import { set } from "zod"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
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

import { downloadDecryptedData } from "../decrypt"

export default function DecryptedDataPage() {
  const dataCid = usePathname().split("/").pop() as string
  const [dataPrivKey, setDataPrivKey] = useState<string>("")
  const isDataKeyProvided = dataPrivKey.trim().length > 0

  function handleDownload() {
    if (isDataKeyProvided) {
      downloadDecryptedData(dataCid, dataPrivKey)
        .then(() => {
          console.log("Download triggered")
        })
        .catch((error) => {
          console.error("Download failed", error)
        })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <PageHeader className="pb-8">
          <PageHeaderHeading>Decrypted Data</PageHeaderHeading>
          <PageHeaderDescription>
            Download your decrypted data by providing your data key.
          </PageHeaderDescription>
          <div className="mt-4 w-full">
            <textarea
              placeholder="Enter your data key here..."
              value={dataPrivKey}
              onChange={(e) => setDataPrivKey(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              style={{ minHeight: "5em" }} // Set a minimum height for 5 lines approximately
              rows={5} // Set to 5 to fit at least 5 lines without scrolling
            />
          </div>
          <PageHeaderCTA>
            <IsWalletConnected>
              <button
                className={cn(buttonVariants({ variant: "default" }), "mt-4")}
                onClick={handleDownload}
                disabled={!isDataKeyProvided}
              >
                Download Data
              </button>
            </IsWalletConnected>
          </PageHeaderCTA>
        </PageHeader>
      </div>
    </div>
  )
}

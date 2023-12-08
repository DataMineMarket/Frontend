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

import { downloadDecryptedData } from "./decrypt"

export default function DecryptedDataPage() {
  const dataCid = usePathname().split("/").pop() as string

  function handleDownload() {
    downloadDecryptedData(dataCid)
      .then(() => {
        console.log("Download triggered")
      })
      .catch((error) => {
        console.error("Download failed", error)
      })
  }

  return (
    <div className="container relative mt-10">
      <PageHeader className="pb-8">
        <PageHeaderHeading>Decrypted Data </PageHeaderHeading>
        <PageHeaderDescription>
          Download your decrypted Data
        </PageHeaderDescription>
        <PageHeaderCTA>
          <IsWalletConnected>
            <button
              className={cn(buttonVariants({ variant: "outline" }))}
              onClick={handleDownload}
            >
              Download Data
            </button>
          </IsWalletConnected>
        </PageHeaderCTA>
      </PageHeader>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DataListingAbi, DataListingFactoryAbi } from "@/contracts"
import { motion, MotionProps } from "framer-motion"
import { useContractRead, useNetwork } from "wagmi"

import { FADE_DOWN_ANIMATION_VARIANTS } from "@/config/design"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-header"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"

import { downloadDecryptedData } from "./decrypt"

export default function PageData() {
  const cid = usePathname().split("&address=").pop() as string
  const formattedCid: `0x${string}` | undefined = `${cid}` as
    | `0x${string}`
    | undefined
  const [dataCid, setDataCid] = useState<string[]>([])
  const [dataPrivKey, setDataPrivKey] = useState<string>("")
  const isDataKeyProvided = dataPrivKey.trim().length > 0

  // Hook to get all the data fulfillled for a given data listing contract
  useContractRead({
    address: formattedCid,
    abi: DataListingAbi,
    functionName: "getDataCIDs",
    args: [],
    watch: true,
    onSuccess: (data: string[]) => {
      setDataCid(data)
    },
  })

  const noDataCIDs = dataCid.length < 1

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
    <motion.div
      animate="show"
      className="flex h-full w-full items-center justify-center lg:py-8"
      initial="hidden"
      variants={FADE_DOWN_ANIMATION_VARIANTS}
      viewport={{ once: true }}
      whileInView="show"
    >
      <IsWalletConnected>
        <div className="container mx-auto p-4">
          <div className="flex min-h-screen flex-col items-center justify-center">
            {" "}
            <PageHeader className="pb-8">
              <PageHeaderHeading>Decrypted Data</PageHeaderHeading>
              <PageHeaderDescription>
                Download your decrypted data by providing your data key.
              </PageHeaderDescription>
            </PageHeader>
            {noDataCIDs ? (
              <p className="col-span-full text-lg text-gray-600">
                No data has been collected for this data request.
              </p>
            ) : (
              <div>
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
                <button
                  className={cn(buttonVariants({ variant: "default" }), "mt-4")}
                  onClick={handleDownload}
                  disabled={!isDataKeyProvided}
                >
                  Download Data
                </button>
              </div>
            )}
          </div>
        </div>
      </IsWalletConnected>
      <IsWalletDisconnected>
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-gray-600">
            Please connect your wallet to view this page.
          </p>
          <Link href="/dashboard">
            <a className="mt-4 text-blue-600 hover:underline">Go back</a>
          </Link>
        </div>
      </IsWalletDisconnected>
    </motion.div>
  )
}

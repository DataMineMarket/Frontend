"use client"

import { title } from "process"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  contractAddresses,
  DataListingAbi,
  DataListingFactoryAbi,
} from "@/contracts"
import { motion, MotionProps } from "framer-motion"
import ReactMarkdown from "react-markdown"
import Balancer from "react-wrap-balancer"
import { useContractRead, useNetwork } from "wagmi"

import { FADE_DOWN_ANIMATION_VARIANTS } from "@/config/design"
import { cn } from "@/lib/utils"
import { fadeUpVariant } from "@/lib/utils/motion"
import { buttonVariants } from "@/components/ui/button"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"

export default function PageData() {
  const cid = usePathname().split("&address=").pop() as string
  const formattedCid: `0x${string}` | undefined = `${cid}` as
    | `0x${string}`
    | undefined
  const [dataCid, setDataCid] = useState<string[]>([])

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
        <div className="col-span-12 flex flex-col items-center justify-center lg:col-span-9">
          <div className="text-center">{/* ... existing code */}</div>
          <div className="mx-auto mt-6 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {noDataCIDs ? (
              <p className="col-span-full text-lg text-gray-600">
                No data has been collected for this data request.
              </p>
            ) : (
              dataCid.map((dataCidItem, index) => (
                <DataCard
                  key={dataCidItem} // Use dataCidItem as key for uniqueness
                  cid={cid}
                  dataCid={dataCidItem}
                  href={`/dashboard/data-requests/${cid}/${dataCidItem}`} // Replace with actual path
                  // ... additional props if needed
                />
              ))
            )}
          </div>
        </div>
      </IsWalletConnected>
      <IsWalletDisconnected>{/* ... existing code */}</IsWalletDisconnected>
    </motion.div>
  )
}

interface DataCardProps extends MotionProps {
  cid: string
  dataCid: string
  href: string
}

function DataCard({ cid, dataCid, href }: DataCardProps) {
  return (
    <motion.div
      variants={fadeUpVariant()}
      className="relative col-span-1 overflow-hidden rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-sm font-semibold text-gray-500">{cid}</div>
        <div className="mb-4 mt-1 text-3xl font-bold">{dataCid}</div>
        <Link
          href={`${href}/data-requests/${cid}/${dataCid}`}
          className={cn(
            "inline-block rounded-full bg-blue-600 px-6 py-2 text-center text-sm font-medium leading-6 text-white transition hover:bg-blue-700 focus:outline-none focus:ring",
            buttonVariants()
          )}
        >
          View Data Collected
        </Link>
      </div>
    </motion.div>
  )
}

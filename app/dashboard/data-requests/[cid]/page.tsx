"use client"

import { title } from "process"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  contractAddresses,
  DataListingFactoryAbi,
  FunctionsConsumerAbi,
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

  // Hook to get all the data fuffilled for a given data listing contract
  useContractRead({
    address: formattedCid,
    abi: FunctionsConsumerAbi,
    functionName: "getDataCIDs",
    args: [],
    watch: true,
    onSuccess: (data: string[]) => {
      setDataCid(data)
    },
  })

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
          <div className="text-center">
            <h3 className="text-2xl font-bold lg:text-6xl">
              <span className="bg-gradient-to-br from-indigo-600 to-purple-700 bg-clip-text text-transparent dark:from-indigo-100 dark:to-purple-200">
                Decrypt and Download Data
              </span>
            </h3>
            <span className="font-light">
              <div className="mt-4">
                <span className="text-xl font-light">Data Request: {cid}</span>
              </div>
            </span>
          </div>
          {
            // Create a data card for every data CID
            dataCid.map((dataCidItem, index) => (
              <DataCard
                key={index} // It's better to use a unique id as key if possible
                cid={cid}
                dataCid={dataCidItem}
                href={`/path-for-data-card/${dataCidItem}`} // Replace with actual path
                // ... additional props if needed
              />
            ))
          }
        </div>
      </IsWalletConnected>
      <IsWalletDisconnected>
        <h3 className="text-lg font-normal">
          Connect Wallet to view your dashboard.
        </h3>
      </IsWalletDisconnected>
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
      className="relative col-span-1 overflow-hidden rounded-xl border bg-card px-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-60 items-center justify-center">{dataCid}</div>
      <div className="mx-auto max-w-xl text-center">
        <h2 className="mb-3 bg-gradient-to-br from-black to-stone-500 bg-clip-text text-xl font-bold text-transparent dark:from-stone-100 dark:to-emerald-200 md:text-3xl md:font-normal">
          <Balancer>{title}</Balancer>
        </h2>
        <Link
          href={`${href}/data-requests/${cid}/${dataCid}`}
          className={cn(buttonVariants(), "my-4")}
        >
          View Data Collected
        </Link>
      </div>
    </motion.div>
  )
}

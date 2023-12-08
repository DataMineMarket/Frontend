"use client"

import { title } from "process"
import { useState } from "react"
import Link from "next/link"
import { contractAddresses, DataListingFactoryAbi } from "@/contracts"
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

import { Web2Integrations } from "../upload/integrations"

export default function PageDataRequest() {
  const [listingAddresses, setListingAddresses] = useState<string[]>([])
  const { chain } = useNetwork()
  const chainId = chain!.id

  const dataListingFactoryAddress =
    contractAddresses[chainId]["DataListingFactory"]

  // Add in Hook for getting all the data requests contracts that the user has created
  useContractRead({
    address: dataListingFactoryAddress,
    abi: DataListingFactoryAbi,
    functionName: "getDataListings", // change this to owner mapped function
    args: [],
    watch: true,
    onSuccess: (data: string[]) => {
      setListingAddresses(data)
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
                Data Requests
              </span>
            </h3>
          </div>
          {
            // Map over listingAddresses and render a RequestCard for each one
            listingAddresses.map((address, index) => (
              <RequestCard
                key={index}
                dataSource={`Data Source #${index + 1}`} // Example data source title, replace with actual data if available
                contractAddress={address}
                dateCreated="2023-12-08" // Example date, replace with actual data if available
                dataPointQuantity="42" // Example quantity, replace with actual data if available
                href={`/data/${address}`} // Construct the destination URL
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

interface RequestCardProps extends MotionProps {
  dataSource: string
  contractAddress: string
  dateCreated: string
  dataPointQuantity: string
  href: string
}

function RequestCard({
  dataSource,
  contractAddress,
  dateCreated,
  dataPointQuantity,
  href,
}: RequestCardProps) {
  return (
    <motion.div
      variants={fadeUpVariant()}
      className="relative col-span-1 overflow-hidden rounded-xl border bg-card px-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-60 items-center justify-center">{dataSource}</div>
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
              {dateCreated}
            </ReactMarkdown>
          </Balancer>
        </div>
        <Link
          href={`${href}&address=${contractAddress}`}
          className={cn(buttonVariants(), "my-4")}
        >
          View Data Collected
        </Link>
      </div>
    </motion.div>
  )
}

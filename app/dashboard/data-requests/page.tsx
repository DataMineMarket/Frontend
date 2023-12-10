"use client"

import { title } from "process"
import { useState } from "react"
import Link from "next/link"
import { contractAddresses, DataListingFactoryAbi } from "@/contracts"
import { motion, MotionProps } from "framer-motion"
import ReactMarkdown from "react-markdown"
import Balancer from "react-wrap-balancer"
import { useAccount, useContractRead, useNetwork } from "wagmi"

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
  const account = useAccount()
  const accAddress = account.address

  const dataListingFactoryAddress =
    contractAddresses[chainId]["DataListingFactory"]

  // TODO: Quick fix for date
  const todayDate = new Date()
  const today = todayDate.toISOString().slice(0, 10)

  // Add in Hook for getting all the data requests contracts that the user has created
  useContractRead({
    address: dataListingFactoryAddress,
    abi: DataListingFactoryAbi,
    functionName: "getOwnerListings", // change this to owner mapped function
    args: ["0x6759E6cb48eD1AfDb1DC6DD614Ab7868a595b1cE"],
    // args: [accAddress],
    watch: true,
    onSuccess: (data: string[]) => {
      console.log("DATA:", data)
      setListingAddresses(data)
    },
    onError: (error) => {
      console.log("ERROR:", error)
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
          <div className="mx-auto mt-6 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {
              // check if listingAddresses is empty
              listingAddresses.length != 0 ? (
                // Map over listingAddresses and render a RequestCard for each one
                listingAddresses.map((address, index) => (
                  <RequestCard
                    key={index}
                    dataSource={`Data Source #${index + 1}`}
                    contractAddress={address}
                    dateCreated={today} // Example date, replace with actual data if available
                    href={`/dashboard/data-requests/${address}`} // Construct the destination URL
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-bold lg:text-6xl">
                      <span className="text-xl font-bold">
                        No Data Requests
                      </span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <span className="text-xl font-light">
                      Create a Data Request to view your dashboard.
                    </span>
                  </div>
                </div>
              )
            }
          </div>
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
  // dataPointQuantity: string
  href: string
}

function RequestCard({
  dataSource,
  contractAddress,
  dateCreated,
  href,
}: RequestCardProps) {
  return (
    <motion.div
      variants={fadeUpVariant()}
      className="relative col-span-1 overflow-hidden rounded-lg border border-gray-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-sm font-semibold text-gray-500">{dataSource}</div>
        <div className="mb-4 text-lg text-gray-700">{dateCreated}</div>
        <Link
          href={`${href}&address=${contractAddress}`}
          className={cn(
            buttonVariants(),
            "inline-block rounded-full bg-blue-600 px-6 py-2 text-center text-sm font-medium leading-6 text-white transition hover:bg-blue-700 focus:outline-none focus:ring"
          )}
        >
          View Data Collected
        </Link>
      </div>
    </motion.div>
  )
}

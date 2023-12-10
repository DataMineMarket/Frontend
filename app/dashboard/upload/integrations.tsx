// This file allows us to add in additional frontend integrations to the dashboard.

"use client"

import { title } from "process"
import { useEffect, useState } from "react"
import Link from "next/link"
import { contractAddresses, DataListingFactoryAbi } from "@/contracts"
import { c } from "@wagmi/cli/dist/config-6e2b110a"
import { use } from "chai"
import { motion, MotionProps } from "framer-motion"
import ReactMarkdown from "react-markdown"
import Balancer from "react-wrap-balancer"
import { chainId } from "viem/_types/utils/chain/extractChain"
import { useContractRead, useNetwork, useSwitchNetwork } from "wagmi"

import { cn } from "@/lib/utils"
import { fadeUpVariant } from "@/lib/utils/motion"
import { buttonVariants } from "@/components/ui/button"
import { PageSectionGrid } from "@/components/layout/page-section"

import { Integration, integrations } from "./templates/integrations-templates"

interface Web2IntegrationsProps extends MotionProps {
  className?: string
}

function generateIntegrations(
  addresses: string[],
  sources: string[],
  prices: string[],
  dataPoints: string[]
): Integration[] {
  const sourceToTitleMap: { [key: string]: string } = {
    GoogleFit: "Google Fit",
    Spotify: "Spotify",
    Plaid: "Plaid",
    Strava: "Strava",
    MyFitnessPal: "My Fitness Pal",
  }

  const generatedIntegrations: Integration[] = []

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i]
    const address = addresses[i]
    const price = prices[i]
    const dataPoint = dataPoints[i]
    const title = sourceToTitleMap[source]

    const integration = integrations.find((int) => int.title === title)
    if (integration) {
      generatedIntegrations.push({
        ...integration,
        contractAddress: address,
        price: price,
        dataPoints: dataPoint,
      })
    }
  }

  return generatedIntegrations
}

export function Web2Integrations({
  className,
  ...props
}: Web2IntegrationsProps) {
  const { chain } = useNetwork()
  const chainId = chain!.id

  if (!contractAddresses[chainId]) {
    // Change network to 80001
  }

  const dataListingFactoryAddress =
    contractAddresses[chainId]["DataListingFactory"]

  const [listingAddresses, setListingAddresses] = useState<string[]>()
  const [dataSources, setDataSources] = useState<string[]>()
  const [prices, setPrices] = useState<string[]>()
  const [pricesDisplay, setPricesDisplay] = useState<string[]>()
  const [dataPoints, setDataPoints] = useState<string[]>()
  const [generatedIntegrations, setGeneratedIntegrations] =
    useState<Integration[]>()

  useContractRead({
    address: dataListingFactoryAddress,
    abi: DataListingFactoryAbi,
    functionName: "getDataListings",
    watch: true,
    onSuccess: (data: string[]) => {
      setListingAddresses(data)
    },
  })

  useContractRead({
    address: dataListingFactoryAddress,
    abi: DataListingFactoryAbi,
    functionName: "getDataListingSources",
    watch: true,
    onSuccess: (data: string[]) => {
      setDataSources(data)
    },
  })

  useContractRead({
    address: dataListingFactoryAddress,
    abi: DataListingFactoryAbi,
    functionName: "getDataListingInitialBalance",
    watch: true,
    onSuccess: (data: string[]) => {
      console.log("Prices", data)
      setPrices(data)
    },
  })

  useContractRead({
    address: dataListingFactoryAddress,
    abi: DataListingFactoryAbi,
    functionName: "getDataListingDataPointQuantity",
    watch: true,
    onSuccess: (data: string[]) => {
      console.log("Data Points", data)
      setDataPoints(data)
    },
  })

  useEffect(() => {
    if (listingAddresses && dataSources && prices && dataPoints) {
      // map prices to divide by 10^6
      const pricesDisplay = prices.map((price) => {
        return (parseInt(price) / 10 ** 6).toString()
      })
      setGeneratedIntegrations(
        generateIntegrations(
          listingAddresses,
          dataSources,
          pricesDisplay,
          dataPoints
        )
      )
    }
  }, [listingAddresses, dataSources, prices, dataPoints])

  return (
    <div>
      {generatedIntegrations ? (
        <PageSectionGrid className={className} {...props}>
          {generatedIntegrations.map(
            ({
              contractAddress,
              title,
              description,
              href,
              demo,
              price,
              dataPoints,
            }) => (
              <DemoCard
                key={contractAddress}
                title={title}
                contractAddress={contractAddress!}
                description={description}
                href={href}
                demo={demo}
                price={price}
                dataPoints={dataPoints}
              />
            )
          )}
        </PageSectionGrid>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          No DataListings Found
        </div>
      )}
    </div>
  )
}

interface DemoCardProps extends MotionProps {
  demo: React.ReactNode
  title: string
  contractAddress: string
  price: string
  dataPoints: string
  description: string
  large?: boolean
  href?: string
}

function DemoCard({
  title,
  contractAddress,
  price,
  dataPoints,
  description,
  href,
  demo,
  large,
}: DemoCardProps) {
  return (
    <motion.div
      variants={fadeUpVariant()}
      className={`relative col-span-1 overflow-hidden rounded-xl border bg-card px-4 shadow-sm transition-shadow hover:shadow-md ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex h-60 items-center justify-center">{demo}</div>
      {/* Section for contract address */}
      <div className="mt-4 flex flex-col items-center justify-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Contract Address
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {contractAddress.slice(0, 8)}...
        </span>
      </div>
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
              {description}
            </ReactMarkdown>
            {/* Initial Balance and Quantity */}
            <div className="mt-4 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Payout
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {price} USDC
              </span>
            </div>
            <div className="mt-4 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Data Points
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {dataPoints}
              </span>
            </div>
          </Balancer>
        </div>
        {!href ? null : (
          <Link
            href={`${href}&address=${contractAddress}`}
            className={cn(buttonVariants(), "my-4")}
          >
            Upload Data
          </Link>
        )}
      </div>
    </motion.div>
  )
}

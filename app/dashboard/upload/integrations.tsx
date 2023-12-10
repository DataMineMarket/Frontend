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
import { useContractRead, useNetwork, useSwitchNetwork } from "wagmi"

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
        dataPoint: dataPoint,
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
      // map data to just string
      const formattedData = data.map((d) => d.toString())
      console.log("Data Sources", formattedData)
      setDataPoints(formattedData)
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
              dataPoint,
            }) => (
              <DemoCard
                key={contractAddress}
                title={title}
                contractAddress={contractAddress!}
                description={description}
                href={href}
                demo={demo}
                price={price}
                dataPoint={dataPoint}
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
  price?: string
  dataPoint?: string
  description: string
  large?: boolean
  href?: string
}

function DemoCard({
  title,
  contractAddress,
  price,
  dataPoint,
  description,
  href,
  demo,
  large,
  ...motionProps // Include other motion props if needed
}: DemoCardProps) {
  return (
    <motion.div
      {...motionProps}
      className={`relative overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-lg ${
        large ? "col-span-2" : "col-span-1"
      }`}
      whileHover={{ translateY: -5 }}
    >
      <div className="flex h-60 items-center justify-center p-4 text-center">
        {demo}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="mt-2">
          <span className="block text-xs uppercase text-gray-400">
            Contract Address
          </span>
          <span className="block text-sm text-gray-500">
            {contractAddress.slice(0, 6)}...
          </span>
        </div>
        <div className="mt-2">
          <span className="block text-xs uppercase text-gray-400">
            Total Payout
          </span>
          <span className="block text-sm text-gray-500">{price} USDC</span>
        </div>
        <div className="mb-4 mt-2">
          <span className="block text-xs uppercase text-gray-400">
            Data Points
          </span>
          <span className="block text-sm text-gray-500">{dataPoint}</span>
        </div>
        {href && (
          <Link
            href={`${href}&address=${contractAddress}`}
            className="inline-block rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Upload Data
          </Link>
        )}
      </div>
    </motion.div>
  )
}

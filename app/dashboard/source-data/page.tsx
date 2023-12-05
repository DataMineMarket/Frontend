"use client"

import { useState } from "react"
import { contractAddresses, DataListingFactoryAbi } from "@/contracts"
import { motion } from "framer-motion"
import { useNetwork, usePrepareContractWrite } from "wagmi"

import { FADE_DOWN_ANIMATION_VARIANTS } from "@/config/design"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"

import { ErrorModal, SuccessModal } from "./modals"

export default function PageSourceData() {
  const { chain, chains } = useNetwork()
  const chainId = chain!.id
  // Throws error if chain id is not in contract addresses
  if (!contractAddresses[chainId]) {
    throw new Error(
      `Chain ID ${chainId} is not supported by the DataListingFactory contract` +
        `Supported chains: ${Object.keys(contractAddresses).join(", ")}`
    )
  }
  const dataListingFactoryAddress =
    contractAddresses[chainId]["DataListingFactory"]

  const [dataSource, setDataSource] = useState("")
  const [numListings, setNumListings] = useState("")
  const [totalPrice, setTotalPrice] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Write hook to create data listing
  const { config } = usePrepareContractWrite({
    address: dataListingFactoryAddress,
    abi: DataListingFactoryAbi,
    functionName: "createDataListing",
    args: [
      // router,
      // provideScript,
      // tokenKey,
      // dataKey,
      // encryptedSecretsUrls,
      "",
      "",
      "",
      "",
      "",
      "googleFit",
      // numListings,
      // totalPrice
    ],
    onSuccess(data) {
      setShowSuccessModal(true)
    },
    onError(error) {
      setErrorMessage(error.message)
      setShowErrorModal(true)
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Call the write function using the wagmi hook
    // You'll need to use the `useContractWrite` hook alongside `usePrepareContractWrite`
    // to actually send the transaction.
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
        <div className="col-span-12 flex flex-col items-center justify-center lg:col-span-9">
          <div className="text-center">
            <h3 className="text-2xl font-bold lg:text-6xl">
              <span className="bg-gradient-to-br from-indigo-600 to-purple-700 bg-clip-text text-transparent dark:from-indigo-100 dark:to-purple-200">
                Create Data Request
              </span>
            </h3>
            <span className="font-light">
              <div className="mt-4"></div>
            </span>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-xs">
            <select
              className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onChange={(e) => setDataSource(e.target.value)}
              value={dataSource}
            >
              {/* Populate this select with options based on the data providers available */}
            </select>
            <input
              type="number"
              placeholder="Total number of listings"
              className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onChange={(e) => setNumListings(e.target.value)}
              value={numListings}
            />
            <input
              type="text"
              placeholder="Total price in WETH"
              className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onChange={(e) => setTotalPrice(e.target.value)}
              value={totalPrice}
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none"
            >
              Create Data Listing
            </button>
          </form>
        </div>
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
        <ErrorModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          errorMessage={errorMessage}
        />
      </IsWalletConnected>
      <IsWalletDisconnected>
        <h3 className="text-lg font-normal">
          Connect Wallet to request for data.
        </h3>
      </IsWalletDisconnected>
    </motion.div>
  )
}

"use client"

import { useEffect, useState } from "react"
import router from "next/router"
import { contractAddresses, DataListingFactoryAbi } from "@/contracts"
import { networkConfig } from "@/DataNexusContracts/helper-hardhat-config"
import { ethers } from "ethers"
import { motion } from "framer-motion"
import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi"

import { FADE_DOWN_ANIMATION_VARIANTS } from "@/config/design"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"

import { ErrorModal, SuccessModal } from "./modals"
import { provideScript } from "./provide"

export default function PageSourceData() {
  const { chain, chains } = useNetwork()

  const chainId = chain!.id
  const router = networkConfig[chainId]["functionsRouter"]
  const tokenAddress = "0x52D800ca262522580CeBAD275395ca6e7598C014"

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
  const [tokenKey, setTokenKey] = useState<string>("")
  const [dataKey, setDataKey] = useState<string>("")
  const [encryptedSecretsUrls, setEncryptedSecretsUrls] = useState<string>("")

  type Secrets = {
    token_key: string
    ipfsAuth: string
  }

  const generateKeys = async (): Promise<Secrets> => {
    const tokenKeyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    )
    const exportedTokenPublicKey = await crypto.subtle.exportKey(
      "spki",
      tokenKeyPair.publicKey
    )
    const exportedTokenPrivateKey = await crypto.subtle.exportKey(
      "pkcs8",
      tokenKeyPair.privateKey
    )

    const tokenPubKey = toBase64(new Uint8Array(exportedTokenPublicKey))
    const tokenPrivKey = toBase64(new Uint8Array(exportedTokenPrivateKey))

    const dataKeyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    )
    const exportedDataPublicKey = await crypto.subtle.exportKey(
      "spki",
      dataKeyPair.publicKey
    )
    const exportedDataPrivateKey = await crypto.subtle.exportKey(
      "pkcs8",
      dataKeyPair.privateKey
    )

    const dataPubKey = toBase64(new Uint8Array(exportedDataPublicKey))
    const dataPrivKey = toBase64(new Uint8Array(exportedDataPrivateKey))

    setDataKey(dataPubKey)

    const secrets = {
      token_key: tokenPrivKey,
      ipfsAuth: process.env.NEXT_PUBLIC_NFT_STORAGE_API_TOKEN!,
    }

    setTokenKey(tokenPubKey)
    generateEncryptedSecretsURL(secrets)

    return secrets
  }

  const generateEncryptedSecretsURL = (secrets: Secrets) => {
    fetch("https://data-nexus-simple-server.onrender.com/encrypt-secrets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secrets: secrets,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setEncryptedSecretsUrls(data.encryptedSecretsUrls)
      })
      .catch((error) => console.error(error))
  }
  // Write hook to create data listing
  const { config } = usePrepareContractWrite({
    address: dataListingFactoryAddress,
    abi: DataListingFactoryAbi,
    functionName: "createDataListing",
    args: [
      router,
      provideScript,
      tokenKey,
      dataKey,
      encryptedSecretsUrls,
      dataSource,
      tokenAddress,
      numListings,
      totalPrice,
    ],
    onSuccess(data) {
      setShowSuccessModal(true)
    },
    onError(error) {
      setErrorMessage(error.message)
      setShowErrorModal(true)
    },
  })

  // const { data, isLoading, isSuccess, write } = useContractWrite(config)

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
              <div className="my-4"></div>
            </span>
          </div>

          <form className="w-full max-w-xs space-y-4">
            <div className="mb-4">
              <label
                htmlFor="data-provider"
                className="block text-sm font-medium text-gray-700"
              >
                Select data provider
              </label>
              <select
                id="data-provider"
                name="data-provider"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setDataSource(e.target.value)}
                value={dataSource}
              >
                <option value="google-fit" className="flex items-center">
                  {/* Inline SVG or component for Google Fit logo */}
                  <img
                    src="path-to-google-fit-logo"
                    alt="Google Fit"
                    className="mr-2 h-4 w-4"
                  />
                  Google Fit
                </option>
                <option value="spotify" className="flex items-center" disabled>
                  {/* Inline SVG or component for Spotify logo */}
                  <img
                    src="path-to-spotify-logo"
                    alt="Spotify"
                    className="mr-2 h-4 w-4"
                  />
                  Spotify
                </option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="num-listings"
                className="block text-sm font-medium text-gray-700"
              >
                Total number of listings
              </label>
              <input
                id="num-listings"
                type="number"
                placeholder="Total number of listings"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setNumListings(e.target.value)}
                value={numListings}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="total-price"
                className="block text-sm font-medium text-gray-700"
              >
                Total price in WETH
              </label>
              <input
                id="total-price"
                type="text"
                placeholder="Total price in WETH"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setTotalPrice(e.target.value)}
                value={totalPrice}
              />
            </div>
            <div className="mb-4">
              <button
                // disabled={!write}
                // onClick={() => write?.()}
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none"
              >
                Create Data Listing
              </button>
            </div>
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

// TODO
// 1. Check if the parameters are correct
// 2. Obtain the parameters
// 3. Test creation of data listing
// 4. Better Styling / Error handling

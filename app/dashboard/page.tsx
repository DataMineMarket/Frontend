"use client"

import { motion } from "framer-motion"

import { FADE_DOWN_ANIMATION_VARIANTS } from "@/config/design"
import { WalletAddress } from "@/components/blockchain/wallet-address"
import { WalletBalance } from "@/components/blockchain/wallet-balance"
import { WalletEnsName } from "@/components/blockchain/wallet-ens-name"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"

export default function PageDashboard() {
  return (
    <motion.div
      animate="show"
      className="flex h-full w-full flex-col items-center justify-center space-y-8 lg:flex-row lg:space-y-0 lg:py-8"
      initial="hidden"
      variants={FADE_DOWN_ANIMATION_VARIANTS}
      viewport={{ once: true }}
      whileInView="show"
    >
      <IsWalletConnected>
        <div className="flex w-full flex-col items-center justify-center px-4 lg:col-span-9 lg:px-0">
          <div className="space-y-6 text-center">
            <h3 className="text-3xl font-bold leading-normal text-gray-800 dark:text-white lg:text-6xl">
              <span className="bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Hi 👋 <WalletEnsName />
              </span>
            </h3>
            <WalletAddress className="block text-lg font-light text-gray-600 dark:text-gray-300" />
            <div className="mt-4">
              <span className="text-2xl font-light text-gray-700 dark:text-gray-200">
                Earnings: <WalletBalance decimals={7} /> USDC
              </span>
            </div>
            <div className="text-2xl font-light text-gray-700 dark:text-gray-200">
              Data Request Fulfilled: 1
            </div>
            <div className="text-2xl font-light text-gray-700 dark:text-gray-200">
              Data Request Created: 1
            </div>
          </div>
        </div>
      </IsWalletConnected>
      <IsWalletDisconnected>
        <h3 className="text-xl font-normal text-gray-800 dark:text-white">
          Connect Wallet to view your personalized dashboard.
        </h3>
      </IsWalletDisconnected>
    </motion.div>
  )
}

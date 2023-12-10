/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */

export const prepareArgs = async (
  authToken: string,
  dataKey: string,
  tokenKey: string
): Promise<string[]> => {
  const enc = new TextEncoder()

  const tokenCryptoKey = await crypto.subtle.importKey(
    "spki",
    fromBase64(tokenKey),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  )

  const encodedToken = enc.encode(authToken)
  const encrypted_token = await crypto.subtle.encrypt(
    "RSA-OAEP",
    tokenCryptoKey,
    encodedToken
  )
  const args = [arrayBufferToBase64(encrypted_token), dataKey]
  console.log("args", args)
  return args
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = ""
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

const fromBase64 = (str: string) =>
  new Uint8Array(
    atob(str)
      .split("")
      .map((c) => c.charCodeAt(0))
  )

export interface networkConfigItem {
  name?: string
  callbackGasLimit?: string
  blockConfirmations?: number
  functionsRouter?: string
  functionsSubscriptionId?: string
  functionsDonId?: string
  gasLimit?: number
  explorerUrl?: string
  linkToken?: string
}

export interface networkConfigInfo {
  [key: number]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
  31337: {
    name: "localhost",
    callbackGasLimit: "500000", // 500,000 gas
    blockConfirmations: 1,
    functionsRouter: "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C",
    functionsSubscriptionId: process.env.SUBSCRIPTION_ID,
    functionsDonId: "fun-localhost-1",
  },
  80001: {
    name: "mumbai",
    blockConfirmations: 6,
    functionsRouter: "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C",
    functionsSubscriptionId: process.env.SUBSCRIPTION_ID,
    functionsDonId: "fun-polygon-mumbai-1",
    gasLimit: 300000,
    explorerUrl: "https://mumbai.polygonscan.com",
    linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  },
  1: {
    name: "mainnet",
  },
}

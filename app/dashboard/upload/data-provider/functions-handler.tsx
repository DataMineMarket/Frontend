/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */

import assert from "assert"
import { networkConfig } from "@/DataNexusContracts/helper-hardhat-config"

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

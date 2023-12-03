/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */

import assert from "assert"
import { networkConfig } from "@/DataNexusContracts/helper-hardhat-config"
import {
  arrayBufferToBase64,
  fromBase64,
} from "@/DataNexusContracts/utils/conversions"

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

// export async function functionHandler(chainId: number, txHash: string) {
//   const rpcUrl = process.env.NEXT_PUBLIC_POLYGON_MUMBAI_RPC_URL
//   const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

//   const responseListener = new ResponseListener({
//     provider: provider,
//     functionsRouterAddress: networkConfig[chainId].functionsRouter!,
//   }) // Instantiate a ResponseListener object to wait for fulfillment.

//   await (async () => {
//     try {
//       const response: any = await new Promise((resolve, reject) => {
//         responseListener
//           .listenForResponseFromTransaction(txHash)
//           .then((response: any) => {
//             resolve(response) // Resolves once the request has been fulfilled.
//           })
//           .catch((error: any) => {
//             reject(error) // Indicate that an error occurred while waiting for fulfillment.
//           })
//       })

//       const fulfillmentCode = response.fulfillmentCode

//       if (fulfillmentCode === FulfillmentCode.FULFILLED) {
//         console.log(
//           `\n✅ Request ${
//             response.requestId
//           } successfully fulfilled. Cost is ${ethers.utils.formatEther(
//             response.totalCostInJuels
//           )} LINK. Complete reponse: `,
//           response
//         )
//       } else if (fulfillmentCode === FulfillmentCode.USER_CALLBACK_ERROR) {
//         console.log(
//           `\n⚠️ Request ${
//             response.requestId
//           } fulfilled. However, the consumer contract callback failed. Cost is ${ethers.utils.formatEther(
//             response.totalCostInJuels
//           )} LINK. Complete reponse: `,
//           response
//         )
//       } else {
//         console.log(
//           `\n❌ Request ${
//             response.requestId
//           } not fulfilled. Code: ${fulfillmentCode}. Cost is ${ethers.utils.formatEther(
//             response.totalCostInJuels
//           )} LINK. Complete reponse: `,
//           response
//         )
//       }

//       const errorString = response.errorString
//       if (errorString) {
//       } else {
//         const responseBytesHexstring = response.responseBytesHexstring
//         if (ethers.utils.arrayify(responseBytesHexstring).length > 0) {
//           const decodedResponse = decodeResult(
//             response.responseBytesHexstring,
//             ReturnType.string
//           )
//           console.log(`\n✅ Decoded response: `, decodedResponse)
//           lastCID = decodedResponse as string
//           console.log(lastCID)
//         }
//       }
//     } catch (error) {
//       assert.fail("Error listening for response", error)
//     }
//   })()
// }

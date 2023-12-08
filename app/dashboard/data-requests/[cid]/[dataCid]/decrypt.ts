import { readFileSync } from "fs";

export async function getDecryptedData(dataCid: string) : Promise<string> {
  const dataPrivKey= readFileSync("./dataKey.txt", "utf-8");
  const encodedDataKey = base64ToArrayBuffer(dataPrivKey);
  const importedDataKey = await crypto.subtle.importKey(
    "pkcs8",
    encodedDataKey,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );


  const resp = await fetch(`https://${dataCid}.ipfs.nftstorage.link/`);
  const data = (await resp.json()).data;
  const decryptedData = new TextDecoder().decode(
    await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      importedDataKey,
      base64ToArrayBuffer(data)
    )
  );

  return decryptedData;
}

const fromBase64 = (str: string) =>
    new Uint8Array(
        atob(str)
            .split("")
            .map((c) => c.charCodeAt(0))
    )


function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

const toBase64 = (arr: Uint8Array) => btoa(String.fromCodePoint(...arr))

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
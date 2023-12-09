import { readFileSync } from "fs";


export async function downloadDecryptedData(dataCid: string, dataPrivKey: string) {
    // Replace the following line with your actual data fetching/decrypting logic
    const decryptedData = await getDecryptedData(dataCid, dataPrivKey);


    // Create a blob from your data
    const blob = new Blob([decryptedData], { type: 'text/plain' });

    // Create a link element
    const link = document.createElement('a');

    // Set the download attribute with a filename
    link.download = 'decryptedData.txt';

    // Create a URL for the blob
    link.href = window.URL.createObjectURL(blob);

    // Append the link to the DOM (it doesn't have to be visible)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the DOM
    link.parentNode.removeChild(link);
  };

export async function getDecryptedData(dataCid: string, dataPrivKey: string) : Promise<string> {
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

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
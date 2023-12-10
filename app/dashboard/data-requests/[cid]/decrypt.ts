/* eslint-disable @typescript-eslint/restrict-template-expressions */

export async function downloadDecryptedData(dataCids: string[], dataPrivKey: string) {
  const decryptedData = await getDecryptedData(dataCids, dataPrivKey);
  // Create a blob from your data
  const blob = new Blob([decryptedData], { type: 'text/plain' });

  // Create a link element
  const link = document.createElement('a');

  // Set the download attribute with a filename
  link.download = 'decryptedData2.txt';

  // Create a URL for the blob
  link.href = window.URL.createObjectURL(blob);

  // Append the link to the DOM (it doesn't have to be visible)
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Remove the link from the DOM
  link.parentNode!.removeChild(link);
};

export async function getDecryptedData(dataCids: string[], dataPrivKey: string): Promise<string> {
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


  let decryptedDataAll = ""
  for (const cid of dataCids) {
    try {
      const bundledResponse = await fetch(`https://${cid}.ipfs.nftstorage.link/`)
      const bundledData = await bundledResponse.json()
      const encryptedAesKey = bundledData.aesKey
      const encryptedIv = bundledData.iv
      const dataCids = bundledData.dataCids

      let encryptedData = ""
      for (const cid of dataCids) {
        const resp = await fetch(`https://${cid}.ipfs.nftstorage.link/`)

        const data = (await resp.json()).data

        // This works fine
        encryptedData += data
      }

      // TODO: Fix the error in decryption here
      const decryptedAesKey = await crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        importedDataKey,
        base64ToArrayBuffer(encryptedAesKey)
      )

      const aesKey = await crypto.subtle.importKey(
        "raw",
        decryptedAesKey,
        { name: "AES-GCM", length: 256 },
        true,
        ["decrypt"]
      );
      const iv = await crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        importedDataKey,
        base64ToArrayBuffer(encryptedIv)
      )

      const decryptedData = new TextDecoder().decode(await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        aesKey,
        base64ToArrayBuffer(encryptedData)
      ));

      console.log("dc", decryptedData)

      decryptedDataAll += decryptedData + "\n"
    }
    catch (e) {
      console.log(e)
      throw (e)
    }
  }
  return decryptedDataAll;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = Buffer.from(base64, 'base64')
  return binaryString
}

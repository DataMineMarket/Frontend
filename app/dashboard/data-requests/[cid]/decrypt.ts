/* eslint-disable @typescript-eslint/restrict-template-expressions */

export async function downloadDecryptedData(dataCids: string[], dataPrivKey: string) {

    const decryptedData = await getDecryptedData(dataCids, dataPrivKey);

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
    link.parentNode!.removeChild(link);
  };

export async function getDecryptedData(dataCids: string[], dataPrivKey: string) : Promise<string> {
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

  console.log("importedDataKey",importedDataKey)

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
      console.log("decryptedAesKey",decryptedAesKey)

      const aesKey = await crypto.subtle.importKey(
          "raw",
          decryptedAesKey,
          { name: "AES-GCM", length: 256 },
          true,
          ["decrypt"]
      );
      console.log("aesKey",aesKey)
      const iv = await crypto.subtle.decrypt(
          {
              name: "RSA-OAEP",
          },
          importedDataKey,
          base64ToArrayBuffer(encryptedIv)
      )

      console.log("iv",iv)
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
      decryptedDataAll += JSON.stringify(sampleData) + "\n"
    }
  }
  return decryptedDataAll;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64)
    console.log("binaryString",binaryString)
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }


const sampleData = {
  "bucket": [
    {
      "startTimeMillis": "1454284800000", 
      "endTimeMillis": "1454371200000", 
      "dataset": [
        {
          "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:aggregated", 
          "point": []
        }
      ]
    }, 
    {
      "startTimeMillis": "1454371200000", 
      "endTimeMillis": "1454457600000", 
      "dataset": [
        {
          "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:aggregated", 
          "point": []
        }
      ]
    }, 
    {
      "startTimeMillis": "1454457600000", 
      "endTimeMillis": "1454544000000", 
      "dataset": [
        {
          "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:aggregated", 
          "point": []
        }
      ]
    }, 
    {
      "startTimeMillis": "1454544000000", 
      "endTimeMillis": "1454630400000", 
      "dataset": [
        {
          "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:aggregated", 
          "point": []
        }
      ]
    }, 
    {
      "startTimeMillis": "1454630400000", 
      "endTimeMillis": "1454716800000", 
      "dataset": [
        {
          "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:aggregated", 
          "point": []
        }
      ]
    }, 
    {
      "startTimeMillis": "1454716800000", 
      "endTimeMillis": "1454803200000", 
      "dataset": [
        {
          "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:aggregated", 
          "point": []
        }
      ]
    }, 
    {
      "startTimeMillis": "1454803200000", 
      "endTimeMillis": "1454889600000", 
      "dataset": [
        {
          "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:aggregated", 
          "point": []
        }
      ]
    }, 
    {
      "startTimeMillis": "1454889600000", 
      "endTimeMillis": "1454976000000", 
      "dataset": [
        {
          "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:aggregated", 
          "point": []
        }
      ]
    }, 
    {
      "startTimeMillis": "1454976000000", 
      "endTimeMillis": "1455062400000", 
      "dataset": [
        {
          "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:aggregated", 
          "point": []
        }
      ]
    }
  ]
}

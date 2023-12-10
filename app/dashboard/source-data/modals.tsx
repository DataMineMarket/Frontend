import { createPrivateKey } from "crypto"
import { useState } from "react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  privKey: string
}

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  errorMessage: string
}

interface CopyToClipboardButtonProps {
  textToCopy: string
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  textToCopy,
}) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000) // Reset state after 2 seconds
      })
      .catch((err) => console.error("Failed to copy text: ", err))
  }

  return (
    <button onClick={handleCopy}>
      {isCopied ? "Copied!" : "Copy to Clipboard"}
    </button>
  )
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  privKey,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex overflow-auto">
      <div className="relative m-auto flex w-full max-w-md flex-col rounded-lg bg-slate-400 p-8 outline outline-2 outline-offset-2">
        <div className="text-center">
          <h3 className="text-lg">Success</h3>
          <p className="py-4">
            Data Request created successfully! Go to Your Data Request Page to
            look at your request! Save your private key:
            <CopyToClipboardButton textToCopy={privKey} />
          </p>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="w-auto rounded-md bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ErrorModal.jsx
export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex overflow-auto">
      <div className="relative m-auto flex w-full max-w-md flex-col rounded-lg bg-white p-8">
        <div className="text-center">
          <h3 className="text-lg">Error</h3>
          <p className="py-4">{errorMessage}</p>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="w-auto rounded-md bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

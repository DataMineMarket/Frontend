interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  errorMessage: string
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex overflow-auto">
      <div className="relative m-auto flex w-full max-w-md flex-col rounded-lg bg-white p-8">
        <div className="text-center">
          <h3 className="text-lg">Success</h3>
          <p className="py-4">
            Data Request created successfully! Go to Your Data Request Page to
            look at your request!
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

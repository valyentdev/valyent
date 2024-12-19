import { useState } from 'react'

export type CopyToClipboardProps = {
  value: string
}

export default function CopyToClipboard({ value }: CopyToClipboardProps) {
  const [copiedProperty, setCopiedProperty] = useState(false)

  async function copyToClipboardUri() {
    await navigator.clipboard.writeText(value)

    setCopiedProperty(true)

    setTimeout(() => {
      setCopiedProperty(false)
    }, 5000)
  }

  return (
    <button
      className="bg-zinc-900 border-l-0 border-zinc-300/20 border rounded-md rounded-l-none px-2 flex items-center justify-center"
      onClick={copyToClipboardUri}
      type="button"
    >
      {copiedProperty ? (
        <svg
          className="w-5 h-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
          />
        </svg>
      )}
    </button>
  )
}

import * as React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { cn } from '../lib/cn'

export interface CodeProps {
  runtimes: string[]
  codeString: string
  selectedRuntime: string
  setSelectedRuntime: (runtime: string) => void
  className?: string
}

export default function Code({
  runtimes,
  codeString,
  selectedRuntime,
  setSelectedRuntime,
  className,
}: CodeProps) {
  /**
   * We only render the code component once the page has been loaded.
   */
  const [loaded, setLoaded] = React.useState(false)
  React.useEffect(() => {
    setLoaded(true)
  }, [])
  if (!loaded || !codeString) {
    return null
  }

  return (
    <div className={cn('flex flex-col space-y-2 w-full sm:w-auto', className)}>
      <div className="relative rounded-md outline outline-[5px] outline-fuchsia-600/15 bg-zinc-900 shadow-lg">
        {runtimes.length > 1 && (
          <div className="bg-black px-5 py-2.5 pb-0 flex space-x-4 rounded-t-md">
            {runtimes.map((runtime) => (
              <button
                key={runtime}
                className={cn(
                  'text-white text-sm hover:opacity-85 transition-opacity pb-2 border-b-2 border-b-transparent',
                  runtime === selectedRuntime && 'border-b-2 border-fuchsia-300/80 font-semibold'
                )}
                onClick={() => setSelectedRuntime(runtime)}
              >
                {runtime}
              </button>
            ))}
          </div>
        )}

        <div className="!max-w-[calc(80vw-1rem)] overflow-x-auto">
          <SyntaxHighlighter
            customStyle={{
              fontSize: '0.875rem',
              padding: '18px 1rem',
              margin: 0,
            }}
            language={selectedRuntime.toLowerCase()}
            style={atomOneDark}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
}

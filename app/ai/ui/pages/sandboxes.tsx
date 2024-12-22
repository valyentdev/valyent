import React from 'react'
import AILayout from '../components/ai_layout'
import { IconExternalLink } from '@tabler/icons-react'

export default function SandboxesPage({}: {}) {
  return (
    <AILayout breadcrumbs={[{ label: 'Sandboxes' }]}>
      <h1 className="pb-2 order-1 text-2xl sm:text-3xl tracking-tight font-serif text-black">
        Sandboxes
      </h1>
      <h2 className="pb-8 flex flex-wrap space-x-1 text-sm text-zinc-600 font-normal">
        <p>View your last created sandboxes.</p>
        <a
          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          href="https://docs.valyent.cloud/glossary#ai-sandbox"
          target="_blank"
        >
          <span>Learn more about Valyent Sandboxes.</span>
          <IconExternalLink className="h-4 w-4" />
        </a>
      </h2>
    </AILayout>
  )
}

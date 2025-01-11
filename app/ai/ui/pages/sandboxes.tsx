import React from 'react'
import AILayout from '../components/ai_layout'
import { IconExternalLink } from '@tabler/icons-react'
import Onboarding from '#applications/ui/components/onboarding'

export default function Index({}: {}) {
  return (
    <AILayout
      title="AI Sandboxes"
      description={
        <a
          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          href="https://docs.valyent.cloud/glossary#ai-sandbox"
          target="_blank"
        >
          <span>Learn more about Valyent AI Sandboxes.</span>
          <IconExternalLink className="h-4 w-4" />
        </a>
      }
      breadcrumbs={[{ label: 'Sandboxes' }]}
    >
      <Onboarding
        title="Start executing LLM-generated code"
        description="Follow the steps below to start executing LLM-generated code with Valyent."
      />
    </AILayout>
  )
}

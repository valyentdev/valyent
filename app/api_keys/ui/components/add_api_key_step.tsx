import * as React from 'react'
import { useForm } from '@inertiajs/react'
import { IconCheck, IconCopy, IconKey } from '@tabler/icons-react'
import Button from '#common/ui/components/button'
import Input from '#common/ui/components/input'
import Step from '#common/ui/components/step'
import useFlashMessage from '#common/ui/hooks/use_flash_message'
import useParams from '#common/ui/hooks/use_params'
import SaveApiKeyDialog from './save_api_key_dialog'

export default function AddAPIKeyStep() {
  return (
    <Step
      title="Add API key"
      description="API Keys are used to access the whole Valyent API. You can create and revoke them at any time."
    >
      <AddApiKeyOnboarding />
    </Step>
  )
}

function AddApiKeyOnboarding() {
  const params = useParams()
  const form = useForm({ name: 'Onboarding' })
  const apiKeyCreated = useFlashMessage('api_key_created')
  const [copied, setCopied] = React.useState(false)

  const handleAddApiKey = () => {
    form.post(`/organizations/${params.organizationSlug}/api_keys`)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(apiKeyCreated!)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 5 * 1000)
  }

  return (
    <div>
      <SaveApiKeyDialog />

      {apiKeyCreated ? (
        <div className="flex">
          <Input className="!rounded-r-none !w-auto" id="api-key" readOnly value={apiKeyCreated} />
          <Button className="!rounded-l-none !h-10" onClick={handleCopyToClipboard}>
            {copied ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleAddApiKey}
          icon={<IconKey className="h-4 w-4" />}
          loading={form.processing}
        >
          Add API Key
        </Button>
      )}
    </div>
  )
}

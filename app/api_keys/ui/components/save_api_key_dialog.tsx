import useFlashMessage from '#common/ui/hooks/use_flash_message'
import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '#common/ui/components/dialog'
import Input from '#common/ui/components/input'
import Button from '#common/ui/components/button'
import { IconCheck, IconCopy } from '@tabler/icons-react'

const SaveApiKeyDialog = () => {
  const apiKeyCreated = useFlashMessage('api_key_created')
  const [isOpen, setIsOpen] = React.useState<boolean>(!!apiKeyCreated)
  const [copied, setCopied] = React.useState(false)

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(apiKeyCreated!)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 5 * 1000)
  }

  React.useEffect(() => {
    setIsOpen(!!apiKeyCreated)
  }, [apiKeyCreated])

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save API Key</DialogTitle>
        </DialogHeader>
        <div className="px-6">
          <p>
            Please save this secret key somewhere safe and accessible. For security reasons,{' '}
            <strong>you won't be able to view it again</strong> in the future. If you lose this
            secret key, you'll need to generate a new one.
          </p>
        </div>
        <DialogFooter>
          <div className="flex w-full">
            <Input className="!rounded-r-none" id="api-key" readOnly value={apiKeyCreated} />
            <Button className="!rounded-l-none !h-10" onClick={handleCopyToClipboard}>
              {copied ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SaveApiKeyDialog

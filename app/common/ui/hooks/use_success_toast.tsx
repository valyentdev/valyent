import { useToast } from './use_toast'
import { IconCircleCheck } from '@tabler/icons-react'

export default function useSuccessToast() {
  const { toast } = useToast()

  return function (message = 'Saved successfully.') {
    toast({
      title: (
        <div className="flex items-start space-x-2">
          <IconCircleCheck className="h-5 w-5 text-blue-600" />
          <p>{message}</p>
        </div>
      ),
    })
  }
}

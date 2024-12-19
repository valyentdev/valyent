import usePageProps from './use_page_props'

export default function useFlashMessage(id: string | undefined): string | undefined {
  const props = usePageProps<{ flashMessages?: Record<string, string> }>()

  if (!props.flashMessages) {
    return undefined
  }

  if (!id) {
    return undefined
  }

  if (!props.flashMessages[id]) {
    return undefined
  }

  return props.flashMessages[id]
}

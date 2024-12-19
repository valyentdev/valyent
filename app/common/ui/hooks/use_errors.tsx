import usePageProps from './use_page_props'

export default function useErrors() {
  const props = usePageProps<{ errors?: Record<string, string> }>()

  return props.errors
}

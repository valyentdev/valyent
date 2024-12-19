import usePageProps from './use_page_props'

export default function usePath() {
  const { path } = usePageProps<{ path: string }>()
  return path
}

import usePageProps from './use_page_props'

export default function useQuery() {
  const pageProps = usePageProps<{ qs: Record<string, string> }>()

  return pageProps.qs
}

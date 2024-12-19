import usePageProps from './use_page_props'

export default function useTranslate() {
  const { translations } = usePageProps<{ translations: Record<string, string> }>()
  return (key: string) => translations[key] || key
}

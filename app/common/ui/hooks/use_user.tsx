import User from '#common/database/models/user'
import usePageProps from './use_page_props'

export default function useUser() {
  const props = usePageProps<{
    user: User
  }>()

  return props.user
}

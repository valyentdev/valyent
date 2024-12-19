import User from '#common/database/models/user'
import usePageProps from '#common/ui/hooks/use_page_props'
import Organization from '#organizations/database/models/organization'

export default function useOrganizations() {
  const props = usePageProps<{
    user: User
    organizations: Organization[]
    params: { organizationSlug: string }
  }>()

  /**
   * Get the current organization, based on the URL's organization slug.
   */
  const currentOrganization =
    props.organizations.find(
      (organization) => organization.slug === props.params.organizationSlug
    ) ||
    props.organizations.find((organization) => organization.id === props.user.defaultOrganizationId)

  return { organizations: props.organizations, currentOrganization }
}

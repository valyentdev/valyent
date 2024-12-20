import EditOrganizationCard from '../components/edit_organization_card'
import MembersManagementCard from '../components/members_management_card'
import QuitOrganizationCard from '../components/quit_organization_card'
import Organization from '#organizations/database/models/organization'
import SettingsLayout from '../components/settings_layout'
import React from 'react'

export default function Edit({
  isOwner,
  organization,
}: {
  isOwner: boolean
  organization: Organization
}) {
  return (
    <SettingsLayout breadcrumbs={[{ label: 'Organization Settings' }]}>
      {isOwner && <EditOrganizationCard organization={organization} />}
      {!isOwner && <QuitOrganizationCard organization={organization} />}
    </SettingsLayout>
  )
}

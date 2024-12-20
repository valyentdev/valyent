import * as React from 'react'
import SettingsLayout from '../components/settings_layout'
import MyAccountCard from '../components/my_account_card'

interface SettingsProps {}

const Settings: React.FunctionComponent<SettingsProps> = () => {
  return (
    <SettingsLayout breadcrumbs={[{ label: 'Account Settings' }]}>
      <MyAccountCard />
    </SettingsLayout>
  )
}

export default Settings

import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import ProfileTab from '../components/dashboard/tabs/ProfileTab'
import SkillsTab from '../components/dashboard/tabs/SkillsTab'
import ProjectsTab from '../components/dashboard/tabs/ProjectsTab'
import LinksTab from '../components/dashboard/tabs/LinksTab'
import SettingsPanel from '../components/dashboard/SettingsPanel'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profileInfo, setProfileInfo] = useState({ username: '', displayName: '', avatarUrl: '' })

  const handleProfileLoaded = (profile) => {
    setProfileInfo({
      username: profile.username || '',
      displayName: profile.displayName || '',
      avatarUrl: profile.avatarUrl || '',
    })
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':   return <ProfileTab onProfileLoaded={handleProfileLoaded} />
      case 'skills':    return <SkillsTab />
      case 'projects':  return <ProjectsTab />
      case 'links':     return <LinksTab />
      case 'settings':  return <SettingsPanel />
      default: return null
    }
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      username={profileInfo.username}
      displayName={profileInfo.displayName}
      avatarUrl={profileInfo.avatarUrl}
    >
      {renderTab()}
    </DashboardLayout>
  )
}

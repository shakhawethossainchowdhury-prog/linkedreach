'use client'
import { useAuth } from '@/lib/auth-context'
import Login from '@/components/Login'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import Campaigns from '@/components/Campaigns'
import Inbox from '@/components/Inbox'
import Analytics from '@/components/Analytics'
import Templates from '@/components/Templates'
import Prospects from '@/components/Prospects'
import Protection from '@/components/Protection'
import Settings from '@/components/Settings'
import { useState } from 'react'

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  campaigns: 'Campaigns',
  inbox: 'Inbox',
  analytics: 'Analytics',
  templates: 'Templates',
  prospects: 'Prospects',
  protection: 'LinkedIn Protection',
  settings: 'Settings',
}

export default function Home() {
  const { user, profile, loading, signOut } = useAuth()
  const [page, setPage] = useState('dashboard')

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f3f2ef'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, background: '#0077B5',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 20, marginBottom: 12
          }}>L</div>
          <div style={{ fontSize: 14, color: '#666' }}>Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) return <Login />

  function renderPage() {
    switch (page) {
      case 'dashboard': return <Dashboard onNav={setPage} />
      case 'campaigns': return <Campaigns />
      case 'inbox': return <Inbox />
      case 'analytics': return <Analytics />
      case 'templates': return <Templates onNav={setPage} />
      case 'prospects': return <Prospects />
      case 'protection': return <Protection />
      case 'settings': return <Settings />
      default: return <Dashboard onNav={setPage} />
    }
  }

  return (
    <div>
      <Sidebar active={page} onChange={setPage} />
      <div className="main-content">
        <div className="topbar">
          <span style={{ fontSize: 16, fontWeight: 600, color: '#1d1d1d' }}>
            {PAGE_TITLES[page]}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#2ecc71', fontWeight: 600 }}>
              <span className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ecc71', display: 'inline-block' }}></span>
              Campaigns running
            </div>
            <div style={{ fontSize: 13, color: '#666' }}>🛡️ Protected</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', background: '#0077B5',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700
              }}>{profile?.avatar || user.email?.[0].toUpperCase()}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1d' }}>
                {profile?.name || user.email}
              </span>
              <button onClick={signOut}
                style={{
                  background: 'none', border: '1px solid #d0cdc8', borderRadius: 6,
                  padding: '4px 10px', fontSize: 12, color: '#666', cursor: 'pointer'
                }}>
                Sign out
              </button>
            </div>
          </div>
        </div>
        {renderPage()}
      </div>
    </div>
  )
}
'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Campaigns from '@/components/Campaigns';
import Inbox from '@/components/Inbox';
import Analytics from '@/components/Analytics';
import Templates from '@/components/Templates';
import Prospects from '@/components/Prospects';
import Protection from '@/components/Protection';
import Settings from '@/components/Settings';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  campaigns: 'Campaigns',
  inbox: 'Inbox',
  analytics: 'Analytics',
  templates: 'Templates',
  prospects: 'Prospects',
  protection: 'LinkedIn Protection',
  settings: 'Settings',
};

export default function Home() {
  const [page, setPage] = useState('dashboard');

  function renderPage() {
    switch (page) {
      case 'dashboard': return <Dashboard onNav={setPage} />;
      case 'campaigns': return <Campaigns />;
      case 'inbox': return <Inbox />;
      case 'analytics': return <Analytics />;
      case 'templates': return <Templates onNav={setPage} />;
      case 'prospects': return <Prospects />;
      case 'protection': return <Protection />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNav={setPage} />;
    }
  }

  return (
    <div>
      <Sidebar active={page} onChange={setPage} />
      <div className="main-content">
        <div className="topbar">
          <span style={{ fontSize: 16, fontWeight: 600, color: '#1d1d1d' }}>{PAGE_TITLES[page]}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#2ecc71', fontWeight: 600 }}>
              <span className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ecc71', display: 'inline-block' }}></span>
              Campaigns running
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, color: '#666' }}>🛡️ Protected</span>
            </div>
          </div>
        </div>
        {renderPage()}
      </div>
    </div>
  );
}

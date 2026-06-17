'use client';
import { useState } from 'react';

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { key: 'campaigns', label: 'Campaigns', icon: '◎' },
  { key: 'inbox', label: 'Inbox', icon: '✉', badge: 2 },
  { key: 'analytics', label: 'Analytics', icon: '◈' },
  { key: 'templates', label: 'Templates', icon: '▤' },
  { key: 'prospects', label: 'Prospects', icon: '⊕' },
  { key: 'protection', label: 'Protection', icon: '⛨' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
];

interface SidebarProps {
  active: string;
  onChange: (key: string) => void;
}

export default function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <div className="sidebar">
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #e0ddd8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'var(--li-blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 15,
          }}>L</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1d1d1d' }}>LinkedReach</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>BS23 Internal</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
        {NAV.map(item => (
          <div
            key={item.key}
            className={`nav-item ${active === item.key ? 'active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge ? (
              <span style={{
                background: '#e53e3e', color: '#fff',
                borderRadius: 10, padding: '1px 7px',
                fontSize: 11, fontWeight: 700
              }}>{item.badge}</span>
            ) : null}
          </div>
        ))}
      </nav>

      <div style={{ padding: '14px 16px', borderTop: '1px solid #e0ddd8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>SH</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Shakhawet H.</div>
            <div style={{ fontSize: 11, color: '#2ecc71', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#2ecc71', display: 'inline-block' }}></span>
              Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

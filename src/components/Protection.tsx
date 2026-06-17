'use client';
import { useState } from 'react';

const LIMITS = [
  { key: 'connections', label: 'Connection requests / day', safe: 20, aggressive: 30, desc: 'LinkedIn may flag accounts sending 30+ requests daily. Safe mode keeps you under their detection threshold.' },
  { key: 'messages', label: 'Messages / day', safe: 50, aggressive: 80, desc: 'Bulk messaging patterns are detected. Safe mode spreads messages across the day with random intervals.' },
  { key: 'profileViews', label: 'Profile views / day', safe: 80, aggressive: 120, desc: 'Profile views trigger notifications. High volume can look automated. Stay under 100 to be safe.' },
  { key: 'inmails', label: 'InMail / day', safe: 10, aggressive: 20, desc: 'InMail is tracked more closely. Low volume, high personalization is the winning strategy.' },
];

export default function Protection() {
  const [mode, setMode] = useState<'safe' | 'aggressive'>('safe');
  const [delays, setDelays] = useState({ min: 2, max: 8 });
  const [workHours, setWorkHours] = useState({ start: 9, end: 18 });
  const [features, setFeatures] = useState({
    humanDelays: true,
    randomOrder: true,
    weekendPause: true,
    ipConsistency: true,
    sessionLimit: true,
  });

  return (
    <div className="page-body">
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>LinkedIn Protection</h1>
        <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0' }}>Safety settings to protect your LinkedIn account from restrictions</p>
      </div>

      {/* STATUS BANNER */}
      <div className="card" style={{ marginBottom: 18, background: '#e6f4ea', border: '1px solid #a8d5b5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🛡️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a5c2a' }}>Protection Active</div>
            <div style={{ fontSize: 13, color: '#2e7d32' }}>All safety measures are running. Your account is protected.</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#1a5c2a' }}>98/100</div>
            <div style={{ fontSize: 12, color: '#2e7d32' }}>Safety Score</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* MODE SELECTOR */}
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Activity Mode</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { key: 'safe', label: '🟢 Safe Mode', desc: 'Recommended. Stays well within LinkedIn limits. Lower volume, zero risk.' },
              { key: 'aggressive', label: '🟡 Growth Mode', desc: 'Higher limits. Use carefully. Best for Sales Navigator accounts.' },
            ].map(m => (
              <div key={m.key}
                onClick={() => setMode(m.key as 'safe' | 'aggressive')}
                style={{
                  padding: '14px 16px', borderRadius: 8, cursor: 'pointer',
                  border: mode === m.key ? '2px solid #0077B5' : '1px solid #e0ddd8',
                  background: mode === m.key ? 'var(--li-blue-light)' : '#fff',
                }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{m.desc}</div>
              </div>
            ))}
          </div>

          {LIMITS.map(l => (
            <div key={l.key} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#444' }}>{l.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0077B5' }}>{mode === 'safe' ? l.safe : l.aggressive}/day</span>
              </div>
              <div className="quota-bar-wrap">
                <div className="quota-bar-fill" style={{
                  width: `${((mode === 'safe' ? l.safe : l.aggressive) / l.aggressive) * 100}%`,
                  background: mode === 'safe' ? '#2ecc71' : '#f39c12',
                }}></div>
              </div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>{l.desc}</div>
            </div>
          ))}
        </div>

        {/* TIMING SETTINGS */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Working Hours</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>Start hour</label>
                <input type="number" className="input-field" min={6} max={12} value={workHours.start}
                  onChange={e => setWorkHours(p => ({ ...p, start: +e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>End hour</label>
                <input type="number" className="input-field" min={12} max={22} value={workHours.end}
                  onChange={e => setWorkHours(p => ({ ...p, end: +e.target.value }))} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>Actions run between {workHours.start}:00 – {workHours.end}:00 local time</div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Message Delay (seconds)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>Min delay</label>
                <input type="number" className="input-field" min={1} max={10} value={delays.min}
                  onChange={e => setDelays(p => ({ ...p, min: +e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>Max delay</label>
                <input type="number" className="input-field" min={5} max={60} value={delays.max}
                  onChange={e => setDelays(p => ({ ...p, max: +e.target.value }))} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>Random delay {delays.min}–{delays.max}s between actions mimics human behavior</div>
          </div>

          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Safety Features</div>
            {(Object.entries(features) as [keyof typeof features, boolean][]).map(([key, val]) => {
              const labels: Record<string, { label: string; desc: string }> = {
                humanDelays: { label: 'Human behavior delays', desc: 'Random pauses between actions' },
                randomOrder: { label: 'Random action order', desc: 'Vary sequence timing' },
                weekendPause: { label: 'Pause on weekends', desc: 'No activity Sat/Sun' },
                ipConsistency: { label: 'IP consistency check', desc: 'Flag location changes' },
                sessionLimit: { label: 'Session time limit', desc: 'Max 8 hours active/day' },
              };
              const info = labels[key];
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0eeeb' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{info.label}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{info.desc}</div>
                  </div>
                  <div
                    onClick={() => setFeatures(p => ({ ...p, [key]: !p[key] }))}
                    style={{
                      width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                      background: val ? '#0077B5' : '#ccc',
                      position: 'relative', transition: 'background 0.2s',
                    }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: '#fff',
                      position: 'absolute', top: 3,
                      left: val ? 23 : 3, transition: 'left 0.2s',
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { TEAM_MEMBERS } from '@/lib/data';

export default function Settings() {
  const [tab, setTab] = useState('team');
  const [members, setMembers] = useState(TEAM_MEMBERS);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const canAddMore = members.length < 5;

  return (
    <div className="page-body">
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Settings</h1>
        <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0' }}>Manage your team, LinkedIn accounts, and workspace</p>
      </div>

      <div className="tab-bar">
        {[['team','Team'], ['linkedin','LinkedIn Accounts'], ['workspace','Workspace'], ['billing','Plan']].map(([k,l]) => (
          <div key={k} className={`tab-item ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</div>
        ))}
      </div>

      {tab === 'team' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <span style={{ fontWeight: 600 }}>{members.length}/5 seats used</span>
              <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>— internal team plan</span>
            </div>
            <button className="btn-primary" onClick={() => canAddMore && setShowInvite(true)}
              style={{ opacity: canAddMore ? 1 : 0.5, cursor: canAddMore ? 'pointer' : 'not-allowed' }}>
              + Invite Member
            </button>
          </div>

          {showInvite && (
            <div className="card" style={{ marginBottom: 16, border: '2px solid #0077B5' }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Invite Team Member</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input className="input-field" placeholder="colleague@bs23.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} style={{ maxWidth: 320 }} />
                <button className="btn-primary" onClick={() => { setInviteEmail(''); setShowInvite(false); }}>Send Invite</button>
                <button className="btn-ghost" onClick={() => setShowInvite(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Campaigns</th>
                  <th>Daily Usage</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ fontSize: 12 }}>{m.avatar}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${m.role === 'Admin' ? 'badge-blue' : 'badge-gray'}`}>{m.role}</span>
                    </td>
                    <td><span style={{ fontWeight: 600 }}>{m.campaigns}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="quota-bar-wrap" style={{ width: 80 }}>
                          <div className="quota-bar-fill" style={{ width: `${(m.dailySent / m.dailyLimit) * 100}%`, background: m.dailySent >= m.dailyLimit * 0.9 ? '#f39c12' : '#2ecc71' }}></div>
                        </div>
                        <span style={{ fontSize: 12 }}>{m.dailySent}/{m.dailyLimit}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className={`status-dot ${m.status}`}></div>
                        <span style={{ fontSize: 13, textTransform: 'capitalize' }}>{m.status}</span>
                      </div>
                    </td>
                    <td>
                      {m.role !== 'Admin' && (
                        <button className="btn-ghost btn-sm" style={{ color: '#e53e3e', borderColor: '#e53e3e' }}
                          onClick={() => setMembers(p => p.filter(x => x.id !== m.id))}>
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'linkedin' && (
        <div>
          <div className="card" style={{ marginBottom: 16, border: '1px solid #a8d5b5', background: '#e6f4ea' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 600, color: '#1a5c2a', marginBottom: 4 }}>How LinkedIn Connection Works</div>
                <div style={{ fontSize: 13, color: '#2e7d32', lineHeight: 1.6 }}>
                  This tool uses a LinkedIn Cookie (li_at) to act on your behalf. This is the same method used by tools like Dripify, Expandi, and Lemlist.
                  Each team member must connect their own LinkedIn account. Accounts with Sales Navigator get higher daily limits.
                  Never share your cookie. It acts like your login session.
                </div>
              </div>
            </div>
          </div>

          {TEAM_MEMBERS.map(m => (
            <div key={m.id} className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="avatar">{m.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{m.email}</div>
                </div>
                {m.status === 'active' ? (
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-green">✓ Connected</span>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Sales Navigator • {m.dailyLimit} req/day</div>
                  </div>
                ) : (
                  <button className="btn-primary btn-sm">+ Connect Account</button>
                )}
              </div>
            </div>
          ))}

          <div className="card" style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>How to get your LinkedIn Cookie (li_at)</div>
            {[
              'Open LinkedIn in Chrome and log in',
              'Press F12 to open DevTools → click "Application" tab',
              'In left sidebar: Storage → Cookies → https://www.linkedin.com',
              'Find the cookie named "li_at" → copy its Value',
              'Paste it in the connection field above',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 13 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0077B5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                <span style={{ color: '#444', lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'workspace' && (
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 18 }}>Workspace Settings</div>
          {[
            { label: 'Company Name', value: 'Brain Station 23 (BS23)' },
            { label: 'Team Name', value: 'Growth & Outreach Team' },
            { label: 'Default Timezone', value: 'Asia/Dhaka (GMT+6)' },
            { label: 'Default Language', value: 'English' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>{f.label}</label>
              <input className="input-field" defaultValue={f.value} style={{ maxWidth: 400 }} />
            </div>
          ))}
          <button className="btn-primary" style={{ marginTop: 8 }}>Save Changes</button>
        </div>
      )}

      {tab === 'billing' && (
        <div>
          <div className="card" style={{ marginBottom: 16, border: '2px solid #0077B5' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: 10, display: 'inline-flex' }}>Current Plan</span>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#0077B5' }}>Internal Free</div>
                <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>5-seat internal team plan. No billing.</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#1d1d1d' }}>$0<span style={{ fontSize: 14, fontWeight: 400, color: '#888' }}>/mo</span></div>
            </div>
            <hr className="divider" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 8 }}>
              {[
                '5 LinkedIn accounts', '5 drip campaigns', 'Unlimited prospects',
                'CSV import & export', 'Analytics & reports', 'LinkedIn protection',
                'Sequence templates', 'Dedicated inbox', 'Team management',
              ].map(f => (
                <div key={f} style={{ fontSize: 13, color: '#444', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#2ecc71', fontWeight: 700 }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ background: '#f8f7f5' }}>
            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>
              <strong>Future upgrade path:</strong> When you are ready to scale beyond 5 seats or add API-based LinkedIn automation, this tool is built to upgrade. Phase 2 adds Supabase auth, real LinkedIn API integration, and webhook-based campaign triggers. Talk to your developer when ready.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

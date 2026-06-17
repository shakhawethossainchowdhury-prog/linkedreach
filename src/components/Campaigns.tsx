'use client'
import { useState, useEffect } from 'react'
import { getCampaigns, createCampaign, updateCampaignStatus, deleteCampaign } from '@/lib/db'

type Campaign = {
  id: string; name: string; status: string; target_service: string | null
  target_roles: string | null; prospects: number; connected: number
  replied: number; steps: number; created_at: string; updated_at: string
}

const STATUS_BADGE: Record<string, string> = {
  active: 'badge-green', paused: 'badge-orange', draft: 'badge-gray', completed: 'badge-blue'
}

const SEQUENCE_STEPS = [
  { icon: '👤', label: 'Visit Profile', delay: 'Day 1' },
  { icon: '🤝', label: 'Send Connection Request', delay: 'Day 1' },
  { icon: '💬', label: 'Welcome Message', delay: 'Day 2 (after accept)' },
  { icon: '📩', label: 'Follow-up #1', delay: 'Day 5' },
  { icon: '📩', label: 'Follow-up #2', delay: 'Day 10' },
]

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showNew, setShowNew] = useState(false)
  const [selected, setSelected] = useState<Campaign | null>(null)
  const [saving, setSaving] = useState(false)
  const [newName, setNewName] = useState('')
  const [newService, setNewService] = useState('ERP')
  const [newRoles, setNewRoles] = useState('')
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const data = await getCampaigns()
      setCampaigns(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length
  const canCreate = activeCampaigns < 5

  const filtered = filter === 'all' ? campaigns : campaigns.filter(c => c.status === filter)

  async function handleCreate() {
    if (!newName.trim()) return
    setSaving(true)
    try {
      await createCampaign({ name: newName, target_service: newService, target_roles: newRoles })
      setNewName(''); setNewRoles(''); setShowNew(false)
      await load()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function handleToggle(id: string, current: string) {
    const next = current === 'active' ? 'paused' : current === 'paused' ? 'active' : current
    if (next === current) return
    try {
      await updateCampaignStatus(id, next)
      await load()
    } catch (e: any) { setError(e.message) }
  }

  async function handleLaunch(id: string) {
    try {
      await updateCampaignStatus(id, 'active')
      await load()
    } catch (e: any) { setError(e.message) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this campaign? This cannot be undone.')) return
    try {
      await deleteCampaign(id)
      if (selected?.id === id) setSelected(null)
      await load()
    } catch (e: any) { setError(e.message) }
  }

  if (selected) {
    const connRate = selected.prospects > 0 ? Math.round((selected.connected / selected.prospects) * 100) : 0
    const repRate = selected.connected > 0 ? Math.round((selected.replied / selected.connected) * 100) : 0
    return (
      <div className="page-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button className="btn-ghost btn-sm" onClick={() => setSelected(null)}>← Back</button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{selected.name}</h2>
          <span className={`badge ${STATUS_BADGE[selected.status] || 'badge-gray'}`}>{selected.status}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'Prospects', value: selected.prospects, color: '#0077B5' },
            { label: 'Connected', value: selected.connected, color: '#2ecc71' },
            { label: 'Replied', value: selected.replied, color: '#f39c12' },
            { label: 'Connection Rate', value: `${connRate}%`, color: '#9b59b6' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Sequence Steps</div>
            {SEQUENCE_STEPS.map((step, i) => (
              <div key={i} className="seq-step">
                <div className="seq-icon"><span style={{ fontSize: 14 }}>{step.icon}</span></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{step.label}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{step.delay}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Conversion Funnel</div>
            {[
              { label: 'Prospects', val: selected.prospects, color: '#0077B5', pct: 100 },
              { label: 'Connection Sent', val: Math.round(selected.prospects * 0.9), color: '#3498db', pct: 90 },
              { label: 'Connected', val: selected.connected, color: '#2ecc71', pct: connRate },
              { label: 'Replied', val: selected.replied, color: '#f39c12', pct: repRate },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: '#444' }}>{f.label}</span>
                  <span style={{ fontWeight: 600 }}>{f.val} <span style={{ color: '#888', fontWeight: 400 }}>({f.pct}%)</span></span>
                </div>
                <div className="quota-bar-wrap">
                  <div className="quota-bar-fill" style={{ width: `${f.pct}%`, background: f.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Campaigns</h1>
          <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0' }}>
            {activeCampaigns}/5 active campaigns
            {!canCreate && <span style={{ color: '#e53e3e', marginLeft: 8 }}>— limit reached</span>}
          </p>
        </div>
        <button className="btn-primary"
          onClick={() => canCreate && setShowNew(true)}
          style={{ opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed' }}>
          + New Campaign
        </button>
      </div>

      {error && (
        <div style={{ background: '#fce8e8', border: '1px solid #f5c0c0', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#c62828' }}>
          {error} <button onClick={() => setError('')} style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#c62828', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {showNew && (
        <div className="card" style={{ marginBottom: 20, border: '2px solid #0077B5' }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>New Campaign</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>Campaign Name *</label>
              <input className="input-field" placeholder="e.g. ERP – Bangladesh Q3"
                value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>Target Service</label>
              <select className="select-field" style={{ width: '100%' }}
                value={newService} onChange={e => setNewService(e.target.value)}>
                {['ERP', 'Fintech', 'Cloud', 'Shopify', 'Staff Augmentation'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>Target Roles</label>
              <input className="input-field" placeholder="e.g. CFO, COO, IT Manager"
                value={newRoles} onChange={e => setNewRoles(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" onClick={handleCreate} disabled={saving}>
              {saving ? 'Creating...' : 'Create Campaign'}
            </button>
            <button className="btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {['all', 'active', 'paused', 'draft', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
              fontWeight: filter === f ? 600 : 400,
              background: filter === f ? '#0077B5' : '#fff',
              color: filter === f ? '#fff' : '#444',
              border: filter === f ? 'none' : '1px solid #d0cdc8',
            }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
          Loading campaigns...
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th>Service</th>
                <th>Prospects</th>
                <th>Connection %</th>
                <th>Reply %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const connRate = c.prospects > 0 ? Math.round((c.connected / c.prospects) * 100) : 0
                const repRate = c.connected > 0 ? Math.round((c.replied / c.connected) * 100) : 0
                return (
                  <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(c)}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                      {c.target_roles && <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{c.target_roles}</div>}
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <span className={`badge ${STATUS_BADGE[c.status] || 'badge-gray'}`}>{c.status}</span>
                    </td>
                    <td><span className="tag">{c.target_service || '—'}</span></td>
                    <td><span style={{ fontWeight: 600 }}>{c.prospects}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 70 }}>
                          <div className="progress-fill" style={{ width: `${connRate}%` }}></div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{connRate}%</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 70 }}>
                          <div className="progress-fill" style={{ width: `${repRate}%`, background: '#2ecc71' }}></div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#2ecc71' }}>{repRate}%</span>
                      </div>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {(c.status === 'active' || c.status === 'paused') && (
                          <button className="btn-ghost btn-sm" onClick={() => handleToggle(c.id, c.status)}>
                            {c.status === 'active' ? '⏸ Pause' : '▶ Resume'}
                          </button>
                        )}
                        {c.status === 'draft' && (
                          <button className="btn-primary btn-sm" onClick={() => handleLaunch(c.id)}>▶ Launch</button>
                        )}
                        <button className="btn-ghost btn-sm"
                          style={{ color: '#e53e3e', borderColor: '#e53e3e' }}
                          onClick={() => handleDelete(c.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
              {campaigns.length === 0
                ? 'No campaigns yet. Create your first one above.'
                : 'No campaigns match this filter.'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
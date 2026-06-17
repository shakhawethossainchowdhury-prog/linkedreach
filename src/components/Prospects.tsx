'use client'
import { useState, useEffect, useRef } from 'react'
import { getProspects, getCampaigns, importProspectsFromCSV, updateProspectStatus } from '@/lib/db'

type Prospect = {
  id: string; name: string; title: string | null; company: string | null
  location: string | null; status: string; last_action: string | null
  added_at: string; linkedin_url: string | null; email: string | null
  campaign_id: string; campaigns?: { name: string } | null
}
type Campaign = { id: string; name: string }

const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-gray', connected: 'badge-blue',
  replied: 'badge-green', meeting: 'badge-orange', dropped: 'badge-red'
}
const STATUSES = ['pending', 'connected', 'replied', 'meeting', 'dropped']

export default function Prospects() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCampaign, setFilterCampaign] = useState('all')
  const [importing, setImporting] = useState(false)
  const [importCampaign, setImportCampaign] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    setLoading(true)
    try {
      const [p, c] = await Promise.all([getProspects(), getCampaigns()])
      setProspects(p)
      setCampaigns(c)
      if (c.length > 0 && !importCampaign) setImportCampaign(c[0].id)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = prospects.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.company || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    const matchCampaign = filterCampaign === 'all' || p.campaign_id === filterCampaign
    return matchSearch && matchStatus && matchCampaign
  })

  async function handleStatusChange(id: string, status: string) {
    const labels: Record<string, string> = {
      connected: 'Connected on LinkedIn',
      replied: 'Replied to message',
      meeting: 'Meeting booked',
      dropped: 'Marked as dropped',
      pending: 'Reset to pending',
    }
    try {
      await updateProspectStatus(id, status, labels[status] || status)
      await load()
    } catch (e: any) { setError(e.message) }
  }

  function exportCSV() {
    const headers = ['Name', 'Title', 'Company', 'Location', 'Status', 'Campaign', 'LinkedIn', 'Email', 'Last Action', 'Added']
    const rows = filtered.map(p => [
      p.name, p.title || '', p.company || '', p.location || '',
      p.status, p.campaigns?.name || '',
      p.linkedin_url || '', p.email || '',
      p.last_action || '', p.added_at?.split('T')[0] || ''
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'prospects.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  async function handleCSVImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !importCampaign) return
    setImporting(true)
    setError(''); setSuccess('')

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(l => l.trim())
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
      const rows = lines.slice(1).map(line => {
        const vals = line.match(/(".*?"|[^,]+)(?=,|$)/g) || []
        return Object.fromEntries(headers.map((h, i) => [h, (vals[i] || '').replace(/"/g, '').trim()]))
      }).filter(r => Object.values(r).some(v => v))

      const imported = await importProspectsFromCSV(rows, importCampaign)
      setSuccess(`✓ Imported ${imported?.length || rows.length} prospects successfully`)
      await load()
    } catch (e: any) { setError(e.message) }
    finally { setImporting(false); if (fileRef.current) fileRef.current.value = '' }
  }

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Prospects</h1>
          <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0' }}>{filtered.length} of {prospects.length} prospects</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={exportCSV}>⬇ Export CSV</button>
          <button className="btn-primary" onClick={() => fileRef.current?.click()} disabled={importing || campaigns.length === 0}>
            {importing ? 'Importing...' : '⬆ Import CSV'}
          </button>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCSVImport} />
        </div>
      </div>

      {/* Import campaign picker */}
      {campaigns.length > 0 && (
        <div className="card" style={{ marginBottom: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>Import CSV into:</span>
          <select className="select-field" value={importCampaign} onChange={e => setImportCampaign(e.target.value)}>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <span style={{ fontSize: 12, color: '#888' }}>CSV columns: Name, Title, Company, Location, LinkedIn URL, Email</span>
        </div>
      )}

      {error && (
        <div style={{ background: '#fce8e8', border: '1px solid #f5c0c0', borderRadius: 8, padding: '10px 16px', marginBottom: 14, fontSize: 13, color: '#c62828' }}>
          {error} <button onClick={() => setError('')} style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#c62828', fontWeight: 700 }}>✕</button>
        </div>
      )}
      {success && (
        <div style={{ background: '#e6f4ea', border: '1px solid #a8d5b5', borderRadius: 8, padding: '10px 16px', marginBottom: 14, fontSize: 13, color: '#1a5c2a' }}>
          {success} <button onClick={() => setSuccess('')} style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#1a5c2a', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ marginBottom: 16, padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input className="input-field" placeholder="Search by name or company..."
            style={{ maxWidth: 260 }} value={search} onChange={e => setSearch(e.target.value)} />
          <select className="select-field" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="select-field" value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)}>
            <option value="all">All campaigns</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
            {STATUSES.map(s => (
              <span key={s} style={{ fontSize: 12, color: '#666' }}>
                <span style={{ fontWeight: 700, color: '#0077B5' }}>{prospects.filter(p => p.status === s).length}</span> {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>Loading prospects...</div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Prospect</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Campaign</th>
                  <th>Last Action</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ fontSize: 11 }}>
                          {p.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                          {p.title && <div style={{ fontSize: 12, color: '#888' }}>{p.title}</div>}
                          {p.linkedin_url && (
                            <a href={p.linkedin_url} target="_blank" rel="noreferrer"
                              style={{ fontSize: 11, color: '#0077B5' }} onClick={e => e.stopPropagation()}>
                              LinkedIn ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 500 }}>{p.company || '—'}</span></td>
                    <td><span style={{ fontSize: 13, color: '#666' }}>{p.location || '—'}</span></td>
                    <td><span className={`badge ${STATUS_BADGE[p.status] || 'badge-gray'}`}>{p.status}</span></td>
                    <td>
                      {p.campaigns?.name
                        ? <span className="tag" style={{ fontSize: 11 }}>{p.campaigns.name.split('–')[0].trim()}</span>
                        : <span style={{ color: '#aaa', fontSize: 12 }}>—</span>}
                    </td>
                    <td><span style={{ fontSize: 13, color: '#555' }}>{p.last_action || '—'}</span></td>
                    <td>
                      <select className="select-field" style={{ fontSize: 12, padding: '4px 8px' }}
                        value={p.status}
                        onChange={e => handleStatusChange(p.id, e.target.value)}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                {prospects.length === 0
                  ? 'No prospects yet. Import a CSV or add manually.'
                  : 'No prospects match your filters.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
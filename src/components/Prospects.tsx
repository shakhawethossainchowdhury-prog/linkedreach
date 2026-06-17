'use client';
import { useState } from 'react';
import { PROSPECTS, Prospect } from '@/lib/data';

const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-gray', connected: 'badge-blue',
  replied: 'badge-green', meeting: 'badge-orange', dropped: 'badge-red'
};

export default function Prospects() {
  const [prospects] = useState<Prospect[]>(PROSPECTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCampaign, setFilterCampaign] = useState('all');

  const campaigns = Array.from(new Set(prospects.map(p => p.campaign)));

  const filtered = prospects.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchCampaign = filterCampaign === 'all' || p.campaign === filterCampaign;
    return matchSearch && matchStatus && matchCampaign;
  });

  function exportCSV() {
    const headers = ['Name','Title','Company','Location','Status','Campaign','Last Action','Added'];
    const rows = filtered.map(p => [p.name, p.title, p.company, p.location, p.status, p.campaign, p.lastAction, p.addedAt]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'prospects.csv'; a.click();
  }

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Prospects</h1>
          <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0' }}>{filtered.length} prospects</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={exportCSV}>⬇ Export CSV</button>
          <button className="btn-primary">+ Import CSV</button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="card" style={{ marginBottom: 16, padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input className="input-field" placeholder="Search by name or company..." style={{ maxWidth: 260 }}
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="select-field" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {['pending','connected','replied','meeting','dropped'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="select-field" value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)}>
            <option value="all">All campaigns</option>
            {campaigns.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            {['pending','connected','replied','meeting','dropped'].map(s => (
              <span key={s} style={{ fontSize: 12, color: '#666' }}>
                <span style={{ fontWeight: 700, color: '#0077B5' }}>{prospects.filter(p => p.status === s).length}</span> {s}
              </span>
            ))}
          </div>
        </div>
      </div>

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
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ fontSize: 11 }}>
                        {p.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{p.title}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontWeight: 500 }}>{p.company}</span></td>
                  <td><span style={{ fontSize: 13, color: '#666' }}>{p.location}</span></td>
                  <td><span className={`badge ${STATUS_BADGE[p.status]}`}>{p.status}</span></td>
                  <td><span className="tag" style={{ fontSize: 11 }}>{p.campaign.split('–')[0].trim()}</span></td>
                  <td><span style={{ fontSize: 13, color: '#555' }}>{p.lastAction}</span></td>
                  <td><span style={{ fontSize: 12, color: '#888' }}>{p.addedAt}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
              No prospects match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

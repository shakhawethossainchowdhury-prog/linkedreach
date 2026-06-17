'use client';
import { useState } from 'react';
import { CAMPAIGNS, Campaign } from '@/lib/data';

const STATUS_LABELS: Record<string, string> = {
  active: 'Active', paused: 'Paused', draft: 'Draft', completed: 'Completed'
};
const STATUS_BADGE: Record<string, string> = {
  active: 'badge-green', paused: 'badge-orange', draft: 'badge-gray', completed: 'badge-blue'
};

const SEQUENCE_STEPS = [
  { icon: '👤', label: 'Visit Profile', delay: 'Day 1' },
  { icon: '🤝', label: 'Send Connection Request', delay: 'Day 1' },
  { icon: '💬', label: 'Welcome Message', delay: 'Day 2 (after accept)' },
  { icon: '📩', label: 'Follow-up #1', delay: 'Day 5' },
  { icon: '📩', label: 'Follow-up #2', delay: 'Day 10' },
];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS);
  const [filter, setFilter] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newService, setNewService] = useState('ERP');

  const filtered = filter === 'all' ? campaigns : campaigns.filter(c => c.status === filter);

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const canCreate = activeCampaigns < 5;

  function createCampaign() {
    if (!newName.trim()) return;
    const nc: Campaign = {
      id: `c${Date.now()}`, name: newName, status: 'draft',
      prospects: 0, connected: 0, replied: 0,
      connectionRate: 0, replyRate: 0,
      createdAt: new Date().toISOString().split('T')[0],
      target: newTarget || 'Not set', steps: 4,
    };
    setCampaigns(prev => [nc, ...prev]);
    setShowNew(false);
    setNewName(''); setNewTarget('');
  }

  function toggleStatus(id: string) {
    setCampaigns(prev => prev.map(c => {
      if (c.id !== id) return c;
      return { ...c, status: c.status === 'active' ? 'paused' : c.status === 'paused' ? 'active' : c.status };
    }));
  }

  if (selected) {
    return (
      <div className="page-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button className="btn-ghost btn-sm" onClick={() => setSelected(null)}>← Back</button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{selected.name}</h2>
          <span className={`badge ${STATUS_BADGE[selected.status]}`}>{STATUS_LABELS[selected.status]}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'Prospects', value: selected.prospects, color: '#0077B5' },
            { label: 'Connected', value: selected.connected, color: '#2ecc71' },
            { label: 'Replied', value: selected.replied, color: '#f39c12' },
            { label: 'Connection Rate', value: `${selected.connectionRate}%`, color: '#9b59b6' },
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
                <div className="seq-icon">
                  <span style={{ fontSize: 14 }}>{step.icon}</span>
                </div>
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
              { label: 'Connected', val: selected.connected, color: '#2ecc71', pct: selected.connectionRate },
              { label: 'Replied', val: selected.replied, color: '#f39c12', pct: selected.replyRate },
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
    );
  }

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Campaigns</h1>
          <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0' }}>
            {activeCampaigns}/5 active campaigns used
            {!canCreate && <span style={{ color: '#e53e3e', marginLeft: 8 }}>— limit reached</span>}
          </p>
        </div>
        <button className="btn-primary" onClick={() => canCreate && setShowNew(true)} style={{ opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed' }}>
          + New Campaign
        </button>
      </div>

      {showNew && (
        <div className="card" style={{ marginBottom: 20, border: '2px solid #0077B5' }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Create New Campaign</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>Campaign Name *</label>
              <input className="input-field" placeholder="e.g. ERP – Bangladesh Q3" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>Target Service</label>
              <select className="select-field" style={{ width: '100%' }} value={newService} onChange={e => setNewService(e.target.value)}>
                {['ERP','Fintech','Cloud','Shopify','Staff Augmentation'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>Target Roles</label>
              <input className="input-field" placeholder="e.g. CFO, COO, IT Manager" value={newTarget} onChange={e => setNewTarget(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" onClick={createCampaign}>Create Campaign</button>
            <button className="btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {['all','active','paused','draft','completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontWeight: filter === f ? 600 : 400,
              background: filter === f ? 'var(--li-blue)' : '#fff',
              color: filter === f ? '#fff' : '#444',
              border: filter === f ? 'none' : '1px solid #d0cdc8',
            }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Status</th>
              <th>Prospects</th>
              <th>Connection Rate</th>
              <th>Reply Rate</th>
              <th>Steps</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(c)}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{c.target}</div>
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <span className={`badge ${STATUS_BADGE[c.status]}`}>{STATUS_LABELS[c.status]}</span>
                </td>
                <td><span style={{ fontWeight: 600 }}>{c.prospects}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar" style={{ width: 70 }}>
                      <div className="progress-fill" style={{ width: `${c.connectionRate}%` }}></div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{c.connectionRate}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar" style={{ width: 70 }}>
                      <div className="progress-fill" style={{ width: `${c.replyRate}%`, background: '#2ecc71' }}></div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#2ecc71' }}>{c.replyRate}%</span>
                  </div>
                </td>
                <td><span style={{ fontSize: 13 }}>{c.steps} steps</span></td>
                <td onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(c.status === 'active' || c.status === 'paused') && (
                      <button className="btn-ghost btn-sm" onClick={() => toggleStatus(c.id)}>
                        {c.status === 'active' ? '⏸ Pause' : '▶ Resume'}
                      </button>
                    )}
                    {c.status === 'draft' && (
                      <button className="btn-primary btn-sm">▶ Launch</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            No campaigns found. Create your first campaign above.
          </div>
        )}
      </div>
    </div>
  );
}
